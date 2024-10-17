import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomException } from 'src/common/exceptions/customException';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const order = await this.prisma.order.create({
        data: {
          ...createOrderDto,
        },
      });
      return order;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Something went wrong..');
    }
  }

  async findAll() {
    try {
      const order = await this.prisma.order.findMany();
      return order;
    } catch (err) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findOne(id: number) {
    try {
      const order = await this.prisma.order.findMany();
      if (!order)
        throw new CustomException(`No order found with id ${id} `, 400);
      return order;
    } catch (err) {
      if (err instanceof CustomException) throw err;
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      return await this.prisma.order.update({
        where: {
          orderId: id,
        },
        data: {
          ...updateOrderDto,
        },
      });
    } catch (err) {
      if (err.code === 'P2025')
        throw new CustomException(`No order found with id ${id} `, 400);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.order.delete({
        where: {
          orderId: id,
        },
      });
    } catch (err) {
      if (err.code === 'P2025')
        throw new CustomException(`No order found with id ${id} `, 400);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
