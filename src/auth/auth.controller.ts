import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('LoginForm')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    // In a real app, use a DTO (Data Transfer Object) for the body validation
    return this.authService.login(body);
  }
}
