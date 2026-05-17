import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Delete,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { GetUser } from '../common/decorators/get.user.decorator';
import { UserResponseDto } from './dto/user-response.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GetUser('userId') requestingUserId: string,
  ): Promise<UserResponseDto> {
    if (+id !== +requestingUserId) {
      throw new ForbiddenException('You can only view your own profile');
    }
    const user = await this.usersService.findOne(+id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @GetUser('userId') requestingUserId: string,
  ) {
    if (+id !== +requestingUserId) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.updateProfile(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('userId') requestingUserId: string) {
    if (+id !== +requestingUserId) {
      throw new ForbiddenException('You can only delete your own account');
    }
    return this.usersService.remove(+id);
  }
}
