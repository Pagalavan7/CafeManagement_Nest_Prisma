import { Module } from '@nestjs/common';
import { TablePriceService } from './table-price.service';
import { TablePriceController } from './table-price.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TablePriceController],
  providers: [TablePriceService],
})
export class TablePriceModule {}
