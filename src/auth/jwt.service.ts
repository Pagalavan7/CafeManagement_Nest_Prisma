import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}

  async generateToken(payload) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async verifyToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token);
    if (!payload) throw new ForbiddenException('Invalid token.');
    return payload;
  }
}
