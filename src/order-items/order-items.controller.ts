import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { Roles } from 'src/common/roles.decorator';
import { UserRole } from 'src/roles/dto/create-role.dto';

@Controller('order-items')
@Roles(UserRole.Manager, UserRole.Biller)
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  async create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return await this.orderItemsService.create(createOrderItemDto);
  }

  @Get()
  async findAll() {
    return await this.orderItemsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderItemsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return await this.orderItemsService.update(+id, updateOrderItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.orderItemsService.remove(+id);
  }
}
