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
    const updatedOrder = await this.updateTotalOrderAmount(orderItem.orderId);
    return { orderItem, order: updatedOrder };
  }

  async findAll() {
    const orderItems = await this.prisma.order_Item.findMany();
    if (!orderItems.length)
      throw new NotFoundException(`No order items found.`);
    return orderItems;
  }

  async findOne(id: number) {
    const orderItem = await this.prisma.order_Item.findUnique({
      where: {
        orderItemId: id,
      },
    });
    if (!orderItem) throw new NotFoundException(`No order items found.`);
    return orderItem;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const updatedOrderItem = await this.prisma.order_Item.update({
      where: {
        orderItemId: id,
      },
      data: {
        ...updateOrderItemDto,
      },
    });
    const order = await this.updateTotalOrderAmount(updatedOrderItem.orderId);
    return { updatedOrderItem, order };
  }

  async remove(id: number) {
    const removedOrderItem = await this.prisma.order_Item.delete({
      where: {
        orderItemId: id,
      },
    });
    if (!removedOrderItem) throw new NotFoundException(`No order items found.`);
    const order = await this.updateTotalOrderAmount(removedOrderItem.orderId);
    return { removedOrderItem, order };
  }

  async updateTotalOrderAmount(orderId: number) {
    let orderItems = await this.prisma.order_Item.findMany({
      where: {
        orderId: orderId,
      },
    });
    if (!orderItems.length)
      throw new NotFoundException(`No order items found for order ${orderId}`);
    console.log(orderItems);

    let totalOrderAmount = orderItems.reduce((sum, item) => {
      sum = sum + item.price * item.quantity;
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
    return order;
  }
}
