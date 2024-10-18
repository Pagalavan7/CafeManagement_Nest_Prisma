import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  // paymentId Int @id @default(autoincrement())
  // orderId Int @unique
  // order Order @relation(fields: [orderId],references: [orderId])
  // paymentStatusId Int
  // paymentStatus Payment_Status @relation(fields: [paymentStatusId], references: [statusId])
  // createdAt DateTime   @default(now())

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
}
