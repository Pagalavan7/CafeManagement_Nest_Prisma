import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomException } from 'src/common/customException';

@Injectable()
export class JsonWebTokenService {
  constructor(private jwtService: JwtService) {}

  async generateToken(payload) {
    try {
      const token = await this.jwtService.signAsync(payload);
      return token;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Error in generating Token. Try again.',
      );
    }
  }

  async verifyToken(token: string) {
    try {
      console.log('token verification happening');
      const payload = await this.jwtService.verifyAsync(token);
      if (!payload)
        throw new UnauthorizedException(
          'Token Tampered or Modified. Please login again to continue.',
        );
      return payload;
    } catch (err) {
      throw err;
    }
  }
}
