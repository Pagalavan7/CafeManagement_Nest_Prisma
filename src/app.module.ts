import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UserDetailsModule } from './user-details/user-details.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { MenuCategoryModule } from './menu-category/menu-category.module';

@Module({
  imports: [PrismaModule, UserDetailsModule, MenuItemModule, MenuCategoryModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
