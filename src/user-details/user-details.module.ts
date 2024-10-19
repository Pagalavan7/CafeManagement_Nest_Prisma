import { Module } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { UserDetailsController } from './user-details.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserDetailsController],
  providers: [UserDetailsService],
  exports: [UserDetailsService],
})
export class UserDetailsModule {}
