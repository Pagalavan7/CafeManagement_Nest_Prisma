import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserDetailsModule } from 'src/user-details/user-details.module';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { JsonWebTokenService } from './jwt.service';
import { BcryptService } from './hash.service';
import { AuthMiddleware } from './auth.middleware';
import { RolesGuard } from './roles.guard';

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
  providers: [
    AuthService,
    JsonWebTokenService,
    BcryptService,
    AuthMiddleware,
    RolesGuard,
  ],
  exports: [AuthMiddleware, JsonWebTokenService],
})
export class AuthModule {}
