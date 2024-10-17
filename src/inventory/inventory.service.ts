import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}
  async create(createInventoryDto: CreateInventoryDto) {
    return await this.prisma.inventory.create({
      data: {
        ...createInventoryDto,
      },
    });
  }

  async findAll() {
    const items = await this.prisma.inventory.findMany();
    if (!items.length) throw new NotFoundException('No inventory items found');
    return items;
  }

  async findOne(id: number) {
    const item = await this.prisma.inventory.findFirst({
      where: {
        inventoryItemId: id,
      },
    });
    if (!item)
      throw new NotFoundException(`No inventory item found with id ${id}`);
    return item;
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const updatedItem = await this.prisma.inventory.update({
      data: { ...updateInventoryDto },
      where: { inventoryItemId: id },
    });
    if (!updatedItem)
      throw new NotFoundException(`No inventory item found with id ${id}`);
    return updatedItem;
  }

  async remove(id: number) {
    const deletedItem = await this.prisma.inventory.delete({
      where: {
        inventoryItemId: id,
      },
    });
    if (!deletedItem)
      throw new NotFoundException(`No inventory item found with id ${id}`);
    return deletedItem;
  }
}
