import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { Roles } from 'src/common/roles.decorator';
import { UserRole } from 'src/roles/dto/create-role.dto';

@Controller('user-details')
export class UserDetailsController {
  constructor(private readonly userDetailsService: UserDetailsService) {}

  // @Post()
  // @Roles()
  // async create(@Body() createUserDetailDto: CreateUserDetailDto) {
  //   return await this.userDetailsService.create(createUserDetailDto);
  // }

  @Get()
  @Roles(UserRole.Admin, UserRole.Manager)
  findAll() {
    return this.userDetailsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.Admin, UserRole.Manager)
  findOne(@Param('id') id: string) {
    return this.userDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDetailDto: UpdateUserDetailDto,
    @Req() payload: any,
  ) {
    return this.userDetailsService.update(
      +id,
      updateUserDetailDto,
      payload.user,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userDetailsService.remove(+id);
  }
}
