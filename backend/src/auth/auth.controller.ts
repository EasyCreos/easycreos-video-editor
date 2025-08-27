import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Request,
    Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto.refreshToken);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Body() refreshTokenDto: RefreshTokenDto) {
        await this.authService.logout(refreshTokenDto.refreshToken);
        return { message: 'Successfully logged out of the system' };
    }

    @Post('logout-all')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logoutAll(@Request() req) {
        await this.authService.logoutAll(req.user.id);
        return { message: 'Successfully logged out of all devices' };
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req) {
        return req.user;
    }
}