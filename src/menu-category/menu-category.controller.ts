import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MenuCategoryService } from './menu-category.service';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-category.dto';
import { UserRole } from 'src/roles/dto/create-role.dto';
import { Roles } from 'src/common/roles.decorator';

@Controller('menu-category')
@Roles(UserRole.Manager)
export class MenuCategoryController {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}

  @Post()
  async create(@Body() createMenuCategoryDto: CreateMenuCategoryDto) {
    return await this.menuCategoryService.create(createMenuCategoryDto);
  }

  @Get()
  async findAll() {
    return await this.menuCategoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.menuCategoryService.findwithItems(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMenuCategoryDto: UpdateMenuCategoryDto,
  ) {
    return await this.menuCategoryService.update(+id, updateMenuCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.menuCategoryService.remove(+id);
  }
}
