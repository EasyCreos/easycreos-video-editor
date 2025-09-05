import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TwitterAuthGuard } from './guards/twitter.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.register(registerDto, response);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.login(loginDto, response);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res() response: Response, @Req() req: ExpressRequest) {
    const refreshToken = req.cookies['refreshToken'];
    await this.authService.logout(response, refreshToken);
    response.redirect(`${process.env.FRONTEND_URL}/login`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  checkAuth() {
    return { authenticated: true };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req: ExpressRequest) { }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = await this.authService.googleLogin(req.user as any);
    await this.authService.handleOAuthLogin(user, response);
    response.redirect(`${process.env.FRONTEND_URL}/login?user=${encodeURIComponent(JSON.stringify(user))}`);
  }

  @Get('twitter')
  @UseGuards(TwitterAuthGuard)
  async twitterAuth(@Req() req: ExpressRequest) { }

  @Get('twitter/callback')
  @UseGuards(TwitterAuthGuard)
  async twitterAuthRedirect(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = await this.authService.twitterLogin(req.user as any);
    await this.authService.handleOAuthLogin(user, response);
    response.redirect(`${process.env.FRONTEND_URL}/login?user=${encodeURIComponent(JSON.stringify(user))}`);
  }
}
