import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    const { orderId, menuItemId } = createOrderItemDto;
    const order = this.prisma.order.findUnique({
      where: {
        orderId: orderId,
      },
    });
    if (!order)
      throw new NotFoundException(
        "Order ID not found. Order items can't be added",
      );

    const menuItem = await this.prisma.menu_Item.findUnique({
      where: {
        itemId: menuItemId,
      },
    });
    if (!menuItem)
      throw new NotFoundException(
        "Menu ID not found. Order items can't be added",
      );
    console.log('menu item is', menuItem);
    const menuItemPrice = menuItem.price;
    console.log('menu item price is ', menuItemPrice);
    const orderItem = await this.prisma.order_Item.create({
      data: { ...createOrderItemDto, price: menuItemPrice },
    });
    await this.updateTotalOrderAmount(orderItem.orderId);
    return orderItem;
  }

  async findAll() {}

  async findOne(id: number) {}

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {}

  async remove(id: number) {}

  async updateTotalOrderAmount(orderId: number) {
    console.log('order id to be updated', orderId);

    let orderItems = await this.prisma.order_Item.findMany({
      where: {
        orderId: orderId,
      },
    });
    if (!orderItems.length)
      throw new NotFoundException(`No order items found for order ${orderId}`);
    console.log(orderItems);

    let totalOrderAmount = orderItems.reduce((sum, item) => {
      sum = sum + item.price.toNumber() * item.quantity;
      return sum;
    }, 0);

    console.log('total order amount is', totalOrderAmount);

    const order = await this.prisma.order.update({
      data: {
        totalOrderAmount: totalOrderAmount,
      },
      where: {
        orderId: orderId,
      },
    });
  }
}
