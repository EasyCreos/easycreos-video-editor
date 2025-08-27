import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, password, name = '' } = registerDto;

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        const tokens = await this.generateTokens(user.id, user.email);

        await this.storeRefreshToken(user.id, tokens.refreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            ...tokens,
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid login credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid login credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Account deactivated');
        }

        const tokens = await this.generateTokens(user.id, user.email);

        await this.storeRefreshToken(user.id, tokens.refreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            ...tokens,
        };
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });

            const storedToken = await this.prisma.refreshToken.findUnique({
                where: { token: refreshToken },
                include: { user: true },
            });

            if (!storedToken || storedToken.expiresAt < new Date()) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            await this.prisma.refreshToken.delete({
                where: { token: refreshToken },
            });

            const tokens = await this.generateTokens(
                storedToken.user.id,
                storedToken.user.email,
            );

            await this.storeRefreshToken(storedToken.user.id, tokens.refreshToken);

            return tokens;
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(refreshToken: string) {
        try {
            await this.prisma.refreshToken.delete({
                where: { token: refreshToken },
            });
        } catch (error) {
        }
    }

    async logoutAll(userId: string) {
        await this.prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }

    private async generateTokens(userId: string, email: string) {
        const payload = { sub: userId, email };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    private async storeRefreshToken(userId: string, refreshToken: string) {
        const decoded = this.jwtService.decode(refreshToken) as any;
        const expiresAt = new Date(decoded.exp * 1000);

        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId,
                expiresAt,
            },
        });
    }

    async validateUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }
}
