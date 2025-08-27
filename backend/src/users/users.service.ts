import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) { }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid ID format');
    }
    const updatedData: any = { ...data };
    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password, 10);
    }
    try {
      return this.prisma.user.update({ where: { id }, data: updatedData });
    } catch (error) {
      this.logger.error(`Update error for id ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async remove(id: string): Promise<User> {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      return this.prisma.user.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Delete error for id ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
