import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Roles } from 'src/common/roles.decorator';
import { UserRole } from 'src/roles/dto/create-role.dto';

@Controller('tables')
@Roles(UserRole.Manager)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  async create(@Body() createTableDto: CreateTableDto) {
    return await this.tablesService.create(createTableDto);
  }

  @Get()
  async findAll() {
    return await this.tablesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tablesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return await this.tablesService.update(+id, updateTableDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tablesService.remove(+id);
  }
}
