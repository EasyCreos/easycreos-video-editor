import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

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
      } catch (error) { }
    }

    this.clearTokenCookies(response);
  }

  async googleLogin(profile: any): Promise<{ id: string; email: string; name: string }> {
    const email = profile.emails?.[0]?.value;
    const displayName = profile.displayName;

    if (!email) {
      throw new BadRequestException('Email not provided by Google');
    }

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: displayName,
          password: 'oauth-generated',
        },
      });
    } else if (!user.isActive) {
      throw new UnauthorizedException('Account deactivated');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async twitterLogin(profile: any): Promise<{ id: string; email: string; name: string }> {
    const email = profile.emails?.[0]?.value;
    const { id, username, displayName } = profile;
    const uniqueEmail = email || `twitter_${id}@oauth.com`;

    let user = await this.prisma.user.findUnique({ where: { email: uniqueEmail } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: uniqueEmail,
          name: displayName || username,
          password: 'oauth-generated',
        },
      });
    } else if (!user.isActive) {
      throw new UnauthorizedException('Account deactivated');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  public async handleOAuthLogin(user: { id: string; email: string; name: string }, response: Response): Promise<void> {
    const tokens = await this.generateTokens(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    this.setTokenCookies(response, tokens);
  }

  protected setTokenCookies(response: Response, tokens: { accessToken: string; refreshToken: string }) {
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

  protected clearTokenCookies(response: Response) {
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

  protected async generateTokens(userId: string, email: string) {
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

  protected async storeRefreshToken(userId: string, refreshToken: string) {
    const decoded = this.jwtService.decode(refreshToken) as any;
    const expiresAt = new Date(decoded.exp * 1000);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

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
