import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // In production, use ConfigModule to get this from .env
    });
  }

  // This method runs AFTER Passport verifies the JWT signature
  async validate(payload: any) {
    // You can optionally do a database lookup here to ensure the user hasn't been deleted
    // const user = await this.usersService.findById(payload.sub);
    // if (!user) throw new UnauthorizedException();

    // Whatever you return here gets attached to req.user
    return {
      //return };
    };
  }
}
