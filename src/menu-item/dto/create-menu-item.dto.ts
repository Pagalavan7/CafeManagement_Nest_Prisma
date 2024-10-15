import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateMenuItemDto {
  // itemId Int @id @default(autoincrement())
  // itemName String @unique
  // description String
  // price Decimal
  // isAvailable Boolean @default(false)
  // createdAt DateTime @default(now())
  // updatedAt DateTime @updatedAt()

  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    }
  })
  isAvailable: boolean;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
