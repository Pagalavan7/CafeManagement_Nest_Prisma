import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  // paymentId Int @id @default(autoincrement())
  // orderId Int @unique
  // order Order @relation(fields: [orderId],references: [orderId])
  // paymentStatusId Int
  // paymentStatus Payment_Status @relation(fields: [paymentStatusId], references: [statusId])
  // createdAt DateTime   @default(now())

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  orderId: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  paymentStatusId: number;
}
