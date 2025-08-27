import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(registerDto: RegisterDto, response: Response) {
        const { email, password, name = '' } = registerDto;

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        if (typeof password !== 'string' || !password) {
            throw new BadRequestException('Password must be a string');
        }

        const hashedPassword = await bcrypt.hash(String(password), 12);

        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        const tokens = await this.generateTokens(user.id, user.email);
        await this.storeRefreshToken(user.id, tokens.refreshToken);

        this.setTokenCookies(response, tokens);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    async login(loginDto: LoginDto, response: Response) {
        const { email, password } = loginDto;

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid login credentials');
        }

        if (typeof password !== 'string' || !password) {
            throw new BadRequestException('Password must be a string');
        }

        const isPasswordValid = await bcrypt.compare(String(password), user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid login credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Account deactivated');
        }

        const tokens = await this.generateTokens(user.id, user.email);
        await this.storeRefreshToken(user.id, tokens.refreshToken);

        this.setTokenCookies(response, tokens);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    async logout(response: Response, refreshToken?: string) {
        if (refreshToken) {
            try {
                await this.prisma.refreshToken.delete({
                    where: { token: refreshToken },
                });
            } catch (error) {
            }
        }

        this.clearTokenCookies(response);
    }

    private setTokenCookies(response: Response, tokens: { accessToken: string; refreshToken: string }) {
        const isProduction = this.configService.get('NODE_ENV') === 'production';

        response.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000, 
            path: '/',
        });

        response.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, 
            path: '/',
        });
    }

    private clearTokenCookies(response: Response) {
        response.clearCookie('accessToken', {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: 'lax',
            path: '/',
        });

        response.clearCookie('refreshToken', {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: 'lax',
            path: '/',
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

        return { accessToken, refreshToken };
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
