import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemsService {
  async create(createOrderItemDto: CreateOrderItemDto) {}

  async findAll() {}

  async findOne(id: number) {}

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {}

  async remove(id: number) {}
}
