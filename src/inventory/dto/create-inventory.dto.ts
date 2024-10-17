import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum unit {
  kg = 'kg',
  litre = 'litre',
  piece = 'piece',
}

export class CreateInventoryDto {
  // inventoryItemName String @unique
  // quantity Int
  // unit String
  // restoreLevel Int
  // createdAt DateTime @default(now())
  // updatedAt DateTime @updatedAt()

  @IsString()
  @IsNotEmpty()
  inventoryItemName: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  quantity: number;

  @IsEnum(unit, { message: `Unit must be kg or litre` })
  unit: unit;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  restoreLevel: number;
}
