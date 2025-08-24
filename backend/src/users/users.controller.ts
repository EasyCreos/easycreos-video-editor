import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() data: CreateUserDto): Promise<{ id: number; email: string; name: string }> {
    try {
      const user = await this.usersService.create(data);
      return { id: Number(user.id), email: user.email, name: user.name };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUserDto): Promise<User> {
    try {
      return await this.usersService.update(id, data);
    } catch (error) {
      if (error.message === 'Invalid ID format') {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    try {
      return await this.usersService.remove(id);
    } catch (error) {
      if (error.message === 'Invalid ID format') {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
