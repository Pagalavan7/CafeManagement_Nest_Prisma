import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Roles } from 'src/common/roles.decorator';
import { UserRole } from 'src/roles/dto/create-role.dto';

@Controller('inventory')
@Roles(UserRole.Manager, UserRole.Chef)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    return await this.inventoryService.create(createInventoryDto);
  }

  @Get()
  async findAll() {
    return await this.inventoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.inventoryService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return await this.inventoryService.update(+id, updateInventoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.inventoryService.remove(+id);
  }
}
