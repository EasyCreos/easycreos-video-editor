import { Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Injectable()
@UseGuards(JwtAuthGuard)
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async findOne(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async update(id: string, data: UpdateUserDto): Promise<User> {
        const updatedData: any = { ...data };
        if (data.password) {
            updatedData.password = await bcrypt.hash(data.password, 10);
        }
        return this.prisma.user.update({ where: { id }, data: updatedData });
    }

    async remove(id: string): Promise<User> {
        return this.prisma.user.delete({ where: { id } });
    }
}
