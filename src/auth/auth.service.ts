import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
// import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: any) {
    // 1. Find user (Mocked here - replace with this.usersService.findByEmail)
    // const user = await this.usersService.findByEmail(loginDto.email);
    const user = {
      id: 1,
      email: 'test@example.com',
      password: 'hashed_password_here',
    };

    if (!user) throw new UnauthorizedException('Invalid credentials');

    // 2. Verify Password (assuming loginDto.password is the raw string)
    // const isMatch = await bcrypt.compare(loginDto.password, user.password);
    // if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // 3. Generate JWT
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
