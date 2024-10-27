import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomException } from 'src/common/customException';

@Injectable()
export class MenuItemService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    try {
      const item = await this.prisma.menu_Item.create({
        data: {
          ...createMenuItemDto,
        },
      });
      return item;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ConflictException('Item already found.');
      }
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll() {
    try {
      const items = await this.prisma.menu_Item.findMany({
        include: {
          category: true,
        },
      });
      if (!items.length) {
        throw new CustomException('No items found', 400);
      }
      return items;
    } catch (err) {
      if (err instanceof CustomException) throw err;
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findOne(id: number) {
    try {
      const item = await this.prisma.menu_Item.findFirst({
        where: {
          itemId: id,
        },
        include: {
          category: true,
        },
      });
      if (!item) {
        throw new CustomException('No items found with id ' + id, 400);
      }
      return item;
    } catch (err) {
      if (err instanceof CustomException) throw err;
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async update(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    try {
      const data = await this.prisma.menu_Item.update({
        where: {
          itemId: id,
        },
        data: {
          ...updateMenuItemDto,
        },
      });

      return data;
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      if (err.code === 'P2025') {
        throw new CustomException(`No item with id ${id} is found.`, 400);
      } // Prisma error code for 'Record to update not found.'
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.menu_Item.delete({
        where: {
          itemId: id,
        },
      });
      return data;
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      if (err.code === 'P2025') {
        throw new CustomException(`No item with id ${id} is found.`, 400);
      } // Prisma error code for 'Record to update not found.'
      throw new InternalServerErrorException('Something went wrong.');
    }
  }
}
