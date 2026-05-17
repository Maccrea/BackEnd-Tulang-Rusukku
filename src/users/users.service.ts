import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number): Promise<UserResponseDto | null> {
    const user = await this.prisma.userAuth.findUnique({
      where: { user_id: id },
      select: {
        user_id: true,
        email: true,
      },
    });
    if (!user) return null;
    return {
      user_id: user.user_id.toString(),
      email: user.email,
    };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    return this.prisma.userProfile.update({
      where: { user_id: userId },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.userMain.delete({ where: { user_id: id } });
  }

  async createEmailUser(
    email: string,
    hashedPassword: string,
    fullName: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const userMain = await tx.userMain.create({ data: {} });
      const userAuth = await tx.userAuth.create({
        data: {
          user_id: userMain.user_id,
          email,
          password: hashedPassword,
          provider: 'email',
        },
      });
      await tx.userProfile.create({
        data: { user_id: userMain.user_id, name_display: fullName },
      });
      return userAuth;
    });
  }

  async createGoogleUser(email: string, name: string) {
    return this.prisma.$transaction(async (tx) => {
      const userMain = await tx.userMain.create({ data: {} });
      const userAuth = await tx.userAuth.create({
        data: {
          user_id: userMain.user_id,
          email,
          password: null,
          provider: 'google',
        },
      });
      await tx.userProfile.create({
        data: { user_id: userMain.user_id, name_display: name },
      });
      return userAuth;
    });
  }

  async findByEmail(email: string) {
    return this.prisma.userAuth.findUnique({ where: { email } });
  }
}
