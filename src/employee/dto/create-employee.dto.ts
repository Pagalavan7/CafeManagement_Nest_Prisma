import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateUserDetailDto } from 'src/user-details/dto/create-user-detail.dto';

export class CreateEmployeeDto extends CreateUserDetailDto {
  // @IsNumber()
  // @IsOptional()
  // userId: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  employeeRoleId: number;
}
