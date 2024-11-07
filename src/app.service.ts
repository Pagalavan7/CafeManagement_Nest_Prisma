import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    try {
      // throw new ForbiddenException('random error generating');
      return 'testing';
    } catch (err) {
      throw err;
    }
  }
}
