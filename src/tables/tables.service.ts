import { Injectable } from '@nestjs/common';
import { CreateTableDto, TableStatus } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}
  async create(createTableDto: CreateTableDto) {
    return await this.prisma.tables.create({
      data: { ...createTableDto, status: TableStatus.AVAILABLE },
    });
  }

  async findAll() {
    return await this.prisma.tables.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.tables.findFirst({
      where: {
        tableId: id,
      },
      include: {
        reservation: true,
      },
    });
  }

  async update(id: number, updateTableDto: UpdateTableDto) {
    return await this.prisma.tables.update({
      where: {
        tableId: id,
      },
      data: { ...updateTableDto },
    });
  }

  async remove(id: number) {
    return await this.prisma.tables.delete({
      where: {
        tableId: id,
      },
    });
  }
}
