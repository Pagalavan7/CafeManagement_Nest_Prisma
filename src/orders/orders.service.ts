import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
      const order = await this.prisma.order.findMany({
        include: {
          paymentStatus: {
            select: {
              statusName: true,
            },
          },
        },
      });

      const modifiedresult = order.map((x) => ({
        orderId: x.orderId,
        userId: x.userId,
        paymentStatus: x.paymentStatus.statusName,
        paymentStatusId: x.paymentStatusId,
        totalOrderAmount: '960',
        createdAt: '2024-10-17T06:35:28.293Z',
        updatedAt: '2024-10-17T10:21:59.205Z',
      }));

      return modifiedresult;
    } catch (err) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findOne(id: number) {
    try {
      const order = await this.prisma.order.findFirst({
        where: {
          orderId: id,
        },
        include: {
          orderItems: {
            select: {
              menuItem: {
                select: {
                  itemName: true,
                },
              },
              price: true,
              quantity: true,
            },
          },
          paymentStatus: {
            select: {
              statusName: true,
            },
          },
        },
      });
      if (!order) throw new NotFoundException(`No order found with id ${id}`);

      const modifiedOrder = {
        orderId: order.orderId,
        userId: order.userId,
        paymentStatus: order.paymentStatus.statusName,
        totalOrderAmount: order.totalOrderAmount,

        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        orderItems: order.orderItems.map((x) => ({
          menuItemName: x.menuItem.itemName,
          price: x.price,
          quantity: x.quantity,
        })),
      };
      return modifiedOrder;
    } catch (err) {
      if (err instanceof CustomException) throw err;
      if (err instanceof NotFoundException) throw err;
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
