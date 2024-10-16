import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  // orderItemId Int @id @default(autoincrement())
  // orderId Int
  // order Order @relation(fields: [orderId],references: [orderId])
  // menuItemId Int
  // menuItem Menu_Item @relation(fields: [menuItemId],references: [itemId])
  // quantity Int
  // createdAt DateTime @default(now())
  // updatedAt DateTime @updatedAt()

  @Type(() => Number)
  @IsNotEmpty()
  orderId: number;

  @Type(() => Number)
  @IsNotEmpty()
  menuItemId: number;

  @Type(() => Number)
  @IsNotEmpty()
  quantity: number;
}
