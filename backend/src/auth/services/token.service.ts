import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) { }

    setTokenCookies(response: Response, tokens: { accessToken: string; refreshToken: string }) {
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

    clearTokenCookies(response: Response) {
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

    async generateTokens(userId: string, email: string) {
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

    async storeRefreshToken(userId: string, refreshToken: string) {
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

    async refreshTokens(response: Response, refreshToken?: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('Missing refresh token');
        }

        let payload: any;
        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const tokenRecord = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken } });
        if (!tokenRecord) {
            throw new UnauthorizedException('Refresh token not found');
        }
        if (tokenRecord.expiresAt <= new Date()) {
            await this.prisma.refreshToken.delete({ where: { token: refreshToken } });
            throw new UnauthorizedException('Refresh token expired');
        }

        const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user || !user.isActive) {
            await this.prisma.refreshToken.delete({ where: { token: refreshToken } }).catch(() => { });
            throw new UnauthorizedException('User not authorized');
        }

        const newTokens = await this.generateTokens(user.id, user.email);

        await this.prisma.$transaction([
            this.prisma.refreshToken.create({
                data: {
                    token: newTokens.refreshToken,
                    userId: user.id,
                    expiresAt: new Date(((this.jwtService.decode(newTokens.refreshToken) as any).exp) * 1000),
                },
            }),
            this.prisma.refreshToken.delete({ where: { token: refreshToken } }),
        ]);

        this.setTokenCookies(response, newTokens);

        return { refreshed: true };
    }
}
