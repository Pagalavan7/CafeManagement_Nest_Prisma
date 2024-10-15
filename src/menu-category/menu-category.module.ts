import { Module } from '@nestjs/common';
import { MenuCategoryService } from './menu-category.service';
import { MenuCategoryController } from './menu-category.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MenuCategoryController],
  providers: [MenuCategoryService],
})
export class MenuCategoryModule {}
