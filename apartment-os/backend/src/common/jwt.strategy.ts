// src/common/strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from "Authorization: Bearer <token>"
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: 'SUPER_SECRET_KEY', // TODO: Move to .env in production
    });
  }

  // This method runs automatically if the token signature is valid
  async validate(payload: any) {
    // We attach this return value to the Request object (req.user)
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
