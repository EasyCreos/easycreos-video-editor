import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
        },
    });
}


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
