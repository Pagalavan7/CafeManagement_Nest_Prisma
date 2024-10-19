import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

@Injectable()
export class BcryptService {
  async hashPassword(userPassword: string) {
    const saltOrRounds = +process.env.SALT_ROUNDS;
    const salt = await bcrypt.genSalt(saltOrRounds);
    return await bcrypt.hash(userPassword, salt);
  }

  async comparePassword(userPassword, hashedPassword) {
    return await bcrypt.compare(userPassword, hashedPassword);
  }
}
