import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export enum ReservationStatus {
  BOOKED = 'Booked',
  PENDING = 'Pending',
  CANCELLED = 'Cancelled',
}

export class CreateReservationDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  members: number;

  @IsNumber()
  @IsNotEmpty()
  totalHrs: number;

  @IsDateString()
  bookingStartTime: string;
}
