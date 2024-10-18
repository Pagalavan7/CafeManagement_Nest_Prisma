import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @Type(() => Number)
  @IsNotEmpty()
  userId: number;

  // @Type(() => Number)
  // @IsNotEmpty()
  // paymentStatusId: number;

  // @Type(() => Number)
  // @IsNotEmpty()
  // totalOrderAmount: number;
}
