import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenService } from './services/token.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
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

    const tokens = await this.tokenService.generateTokens(user.id, user.email);
    await this.tokenService.storeRefreshToken(user.id, tokens.refreshToken);
    this.tokenService.setTokenCookies(response, tokens);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: null,
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

    const tokens = await this.tokenService.generateTokens(user.id, user.email);
    await this.tokenService.storeRefreshToken(user.id, tokens.refreshToken);
    this.tokenService.setTokenCookies(response, tokens);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl || null,
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

    this.tokenService.clearTokenCookies(response);
  }

  async googleLogin(profile: any): Promise<{ id: string; email: string; name: string; avatarUrl: string | null }> {
    const email = profile.email;
    const displayName = profile.name;
    const avatarUrl = profile.avatarUrl;

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
          avatarUrl,
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { email },
        data: {
          name: displayName,
          avatarUrl,
        },
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account deactivated');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    };
  }

  async twitterLogin(profile: any): Promise<{ id: string; email: string; name: string; avatarUrl: string | null }> {
    const email = profile.email;
    const { id, username, displayName } = profile;
    const avatarUrl = profile.avatarUrl;
    const uniqueEmail = email || `twitter_${id}@oauth.com`;

    let user = await this.prisma.user.findUnique({ where: { email: uniqueEmail } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: uniqueEmail,
          name: displayName || username,
          password: 'oauth-generated',
          avatarUrl,
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { email: uniqueEmail },
        data: {
          name: displayName || username,
          avatarUrl,
        },
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account deactivated');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    };
  }

  public async handleOAuthLogin(user: { id: string; email: string; name: string; avatarUrl: string | null }, response: Response): Promise<void> {
    const tokens = await this.tokenService.generateTokens(user.id, user.email);
    await this.tokenService.storeRefreshToken(user.id, tokens.refreshToken);
    this.tokenService.setTokenCookies(response, tokens);
  }
  async refreshTokens(response: Response, refreshToken?: string) {
    return this.tokenService.refreshTokens(response, refreshToken);
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
      avatarUrl: user.avatarUrl,
    };
  }
}
