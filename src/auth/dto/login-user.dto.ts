import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDetailDto } from 'src/user-details/dto/create-user-detail.dto';

export class LoginUserDTO extends PartialType(CreateUserDetailDto) {}
