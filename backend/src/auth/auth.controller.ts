import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Request,
    Get,
    Res,
    Req,
} from '@nestjs/common';
import type { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
    async logout(
        @Req() request: ExpressRequest,
        @Res({ passthrough: true }) response: Response
    ) {
        const refreshToken = request.cookies?.refreshToken;
        await this.authService.logout(response, refreshToken);
        return { message: 'Успішно вийшли з системи' };
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
}
