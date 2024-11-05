import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  roleId: number;
}
