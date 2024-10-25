import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

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

  @IsDateString()
  bookingStartTime: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  totalHrs: number;
}
