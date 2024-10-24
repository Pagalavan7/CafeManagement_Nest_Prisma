import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export enum ReservationStatus {
  BOOKED = 'Booked',
  PENDING = 'Pending',
  CANCELLED = 'Cancelled',
}

export class CreateReservationDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  members: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  totalHrs: number;
}
