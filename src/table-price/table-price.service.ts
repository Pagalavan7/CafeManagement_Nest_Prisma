import { Injectable } from '@nestjs/common';
import { CreateTablePriceDto } from './dto/create-table-price.dto';
import { UpdateTablePriceDto } from './dto/update-table-price.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TablePriceService {
  constructor(private prisma: PrismaService) {}
  async create(createTablePriceDto: CreateTablePriceDto) {
    return await this.prisma.tablePrice.create({
      data: { ...createTablePriceDto },
    });
  }

  async findAll() {
    return await this.prisma.tablePrice.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.tablePrice.findFirst({
      where: { tableId: id },
    });
  }

  async update(id: number, updateTablePriceDto: UpdateTablePriceDto) {
    return await this.prisma.tablePrice.update({
      where: { tableId: id },
      data: { ...updateTablePriceDto },
    });
  }

  async remove(id: number) {
    return await this.prisma.tablePrice.delete({
      where: { tableId: id },
    });
  }
}
