import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UserDetailsModule } from './user-details/user-details.module';
import { UserDetailsModule } from './user-details/user-details.module';

@Module({
  imports: [PrismaModule, UserDetailsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
