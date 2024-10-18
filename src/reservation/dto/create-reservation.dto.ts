import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export enum ReservationStatus {
  BOOKED = 'Booked',
  PENDING = 'Pending',
  CANCELLED = 'Cancelled',
}

export class CreateReservationDto {
  // resevationId Int @id @default(autoincrement())
  // userId Int
  // user User_Details @relation(fields: [userId],references: [userId])
  // tableId Int
  // table Tables[] @relation("TableReservation")
  // status String

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  tableId: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  members: number;
}
