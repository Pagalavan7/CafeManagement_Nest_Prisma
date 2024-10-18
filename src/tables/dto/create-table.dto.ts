import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum TableStatus {
  OCCUPIED = 'OCCUPIED',
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
}

export class CreateTableDto {
  // tableId Int @id @default(autoincrement())
  // tableNumber Int
  // capacity Int
  // status String
  // createdAt DateTime @default(now())
  // updatedAt DateTime @updatedAt()
  // reservation Reservation[] @relation("TableReservation")

  @IsString()
  @IsNotEmpty()
  tableName: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  capacity: number;

  // @IsEnum(Status, { message: 'Status must be Occupied, Available or Reserved' })
  // status: string;
}
