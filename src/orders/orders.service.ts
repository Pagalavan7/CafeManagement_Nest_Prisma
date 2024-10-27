import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomException } from 'src/common/customException';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const userExists = await this.prisma.user_Details.findUnique({
        where: { userId: createOrderDto.userId },
      });

      if (!userExists) {
        throw new NotFoundException(
          `User with ID ${createOrderDto.userId} not found.`,
        );
      }

      const order = await this.prisma.order.create({
        data: {
          ...createOrderDto,
        },
      });
      return order;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Something went wrong..');
    }
  }

  async findAll() {
    try {
      const order = await this.prisma.order.findMany({});
      return order;
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
          payments: {
            include: {
              paymentStatus: true,
            },
          },
        },
      });
      if (!order) throw new NotFoundException(`No order found with id ${id}`);

      const modifiedOrder = {
        orderId: order.orderId,
        userId: order.userId,

        totalOrderAmount: order.totalOrderAmount,
        paymentStatus: order.payments.map((x) => ({
          paymentId: x.paymentId,
          StatusName: x.paymentStatus.statusName,
          StatusId: x.paymentStatus.statusId,
        })),
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
