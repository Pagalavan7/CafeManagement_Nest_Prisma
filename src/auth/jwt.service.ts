import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomException } from 'src/common/customException';

@Injectable()
export class JsonWebTokenService {
  constructor(private jwtService: JwtService) {}

  async generateToken(payload) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (!payload) throw new ForbiddenException('Invalid token.');
      return payload;
    } catch (err) {
      if (err instanceof ForbiddenException) throw err;
      throw new CustomException('Token validation failed. Login to continue');
    }
  }
}
