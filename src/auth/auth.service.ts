import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const DUMMY_HASH =
  '$2b$10$X4kv7j5ZcG39WgogSl16aufxkiYSC8cFHKXrVaUCCQSzF5CKGnuWG';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const userAuth = await this.usersService.findByEmail(loginDto.email);

    if (!userAuth) {
      await bcrypt.compare(loginDto.password, DUMMY_HASH);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (userAuth.provider !== 'email') {
      throw new UnauthorizedException(
        'This account uses Google sign-in. Please continue with Google.',
      );
    }

    const isMatch = await bcrypt.compare(
      loginDto.password,
      userAuth.password ?? DUMMY_HASH,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: userAuth.email, sub: userAuth.user_id.toString() };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) throw new ConflictException('Email sudah terdaftar');

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const userAuth = await this.usersService.createEmailUser(
      registerDto.email,
      hashedPassword,
      registerDto.full_name,
    );

    const payload = { email: userAuth.email, sub: userAuth.user_id.toString() };
    return { access_token: this.jwtService.sign(payload) };
  }

  async googleLogin(googleUser: { email: string; name: string }) {
    let userAuth = await this.usersService.findByEmail(googleUser.email);

    if (userAuth) {
      if (userAuth.provider !== 'google') {
        throw new UnauthorizedException(
          'This email is registered with a password. Please log in with your email and password.',
        );
      }
    } else {
      userAuth = await this.usersService.createGoogleUser(
        googleUser.email,
        googleUser.name,
      );
    }

    const payload = { email: userAuth.email, sub: userAuth.user_id.toString() };
    return { access_token: this.jwtService.sign(payload) };
  }
}
