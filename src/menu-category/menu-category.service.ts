import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateMenuCategoryDto } from './dto/update-menu-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomException } from 'src/common/exceptions/customException';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';

@Injectable()
export class MenuCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuCategoryDto: CreateMenuCategoryDto) {
    try {
      const item = await this.prisma.menu_Category.create({
        data: { ...createMenuCategoryDto },
      });
      return item;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ConflictException('Category already found.');
      }
      if (err instanceof BadRequestException) throw err;

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll() {
    try {
      const items = await this.prisma.menu_Category.findMany();
      if (!items.length) {
        throw new CustomException('No items found', 400);
      }
      return items;
    } catch (err) {
      if (err instanceof CustomException) throw err;
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findwithItems(id: number) {
    try {
      const item = await this.prisma.menu_Category.findFirst({
        where: {
          categoryId: id,
        },
        include: {
          menuItem: true,
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
  async update(id: number, updateMenuCategoryDto: UpdateMenuCategoryDto) {
    try {
      console.log('update method called');
      const data = await this.prisma.menu_Category.update({
        where: {
          categoryId: id,
        },
        data: {
          ...updateMenuCategoryDto,
        },
      });

      return data;
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      if (err.code === 'P2025') {
        throw new CustomException(`No category with id ${id} is found.`, 400);
      } // Prisma error code for 'Record to update not found.'
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.menu_Category.delete({
        where: {
          categoryId: id,
        },
      });
      return data;
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      if (err.code === 'P2025') {
        throw new CustomException(`No category with id ${id} is found.`, 400);
      } // Prisma error code for 'Record to update not found.'
      throw new InternalServerErrorException('Something went wrong.');
    }
  }
}
