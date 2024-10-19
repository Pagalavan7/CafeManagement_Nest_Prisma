import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDetailDto } from 'src/user-details/dto/create-user-detail.dto';
import { UpdateUserDetailDto } from 'src/user-details/dto/update-user-detail.dto';
import { LoginUserDTO } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDetailDto) {
    return await this.authService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDTO: LoginUserDTO) {
    return await this.authService.loginUser(loginUserDTO);
  }

  @Get()
  findAll() {
    // return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDetailDto) {
    // return this.authService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.authService.remove(+id);
  }
}
