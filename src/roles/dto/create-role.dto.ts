import { IsNotEmpty, IsString } from 'class-validator';

export enum UserRole {
  Customer = 'CUSTOMER',
  Admin = 'ADMIN',
  Employee = 'EMPLOYEE',
  Manager = 'MANAGER',
  Waiter = 'WAITER',
  Biller = 'BILLER',
  Chef = 'CHEF',
}

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  role: string;
}
