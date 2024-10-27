import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from './auth.service';
import { JsonWebTokenService } from './jwt.service';
import { CustomException } from 'src/common/customException';

interface CustomRequest extends Request {
  user?: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JsonWebTokenService) {}
  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new CustomException('No Token found. ');

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }
    const token = authHeader.split(' ')[1];

    const tokenPayload: TokenPayload = await this.jwtService.verifyToken(token);

    if (!tokenPayload) throw new ForbiddenException('Token is not valid');
    req.user = tokenPayload;

    next();
  }
}
