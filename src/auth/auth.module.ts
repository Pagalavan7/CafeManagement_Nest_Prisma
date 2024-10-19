import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserDetailsModule } from 'src/user-details/user-details.module';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { JWTService } from './jwt.service';
import { BcryptService } from './hash.service';

@Module({
  imports: [
    UserDetailsModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTService, BcryptService],
})
export class AuthModule {}
