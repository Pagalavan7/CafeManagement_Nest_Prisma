import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TablePriceService } from './table-price.service';
import { CreateTablePriceDto } from './dto/create-table-price.dto';
import { UpdateTablePriceDto } from './dto/update-table-price.dto';
import { Roles } from 'src/common/roles.decorator';
import { UserRole } from 'src/roles/dto/create-role.dto';

@Controller('table-price')
@Roles(UserRole.Manager)
export class TablePriceController {
  constructor(private readonly tablePriceService: TablePriceService) {}

  @Post()
  async create(@Body() createTablePriceDto: CreateTablePriceDto) {
    return await this.tablePriceService.create(createTablePriceDto);
  }

  @Get()
  async findAll() {
    return await this.tablePriceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tablePriceService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTablePriceDto: UpdateTablePriceDto,
  ) {
    return await this.tablePriceService.update(+id, updateTablePriceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tablePriceService.remove(+id);
  }
}
