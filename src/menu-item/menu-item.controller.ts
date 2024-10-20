import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { UserRole } from 'src/user-details/dto/create-user-detail.dto';

@Controller('menu-item')
@UseGuards(RolesGuard)
@Roles(UserRole.Admin)
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  async create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return await this.menuItemService.create(createMenuItemDto);
  }

  @Get()
  async findAll() {
    return await this.menuItemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.menuItemService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return await this.menuItemService.update(+id, updateMenuItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.menuItemService.remove(+id);
  }
}
