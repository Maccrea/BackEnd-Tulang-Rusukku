import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    return this.prisma.userProfile.findUnique({ where: { user_id: id } });
  }

  async findByEmail(email: string) {
    return this.prisma.userProfile.findUnique({ where: { email } });
  }
}
