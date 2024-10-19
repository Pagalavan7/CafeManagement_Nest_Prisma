import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export enum UserRole {
  Customer = 'CUSTOMER',
  Admin = 'ADMIN',
  Employee = 'EMPLOYEE',
}

export class CreateUserDetailDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @MaxLength(15)
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  // @IsBoolean()
  // @Transform(({ value }) => {
  //   if (value === 'true') {
  //     return true;
  //   } else if (value === 'false') {
  //     return false;
  //   }
  // })

  // @IsEnum()
  // @IsOptional()
  // role: string;
}
