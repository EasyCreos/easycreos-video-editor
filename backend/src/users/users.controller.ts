import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<User | null> {
        return this.usersService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: UpdateUserDto): Promise<User> {
        return this.usersService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<User> {
        return this.usersService.remove(id);
    }
}
