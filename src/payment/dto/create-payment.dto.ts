import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  orderId: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  reservationId: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  paymentStatusId: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  paymentAmount: number;
}
