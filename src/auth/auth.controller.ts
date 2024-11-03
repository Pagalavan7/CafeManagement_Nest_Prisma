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
import { AuthService } from './auth.service';
import { CreateUserDetailDto } from 'src/user-details/dto/create-user-detail.dto';
import { LoginUserDTO } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async create(
    @Body() createUserDto: CreateUserDetailDto,
    @Req() request: any,
  ) {
    console.log(createUserDto, request.user);
    return await this.authService.createUser(createUserDto, request.user);
  }

  @Post('login')
  async login(@Body() loginUserDTO: LoginUserDTO, @Req() request: any) {
    console.log(loginUserDTO, request.user);
    return await this.authService.loginUser(loginUserDTO, request.user);
  }
}
