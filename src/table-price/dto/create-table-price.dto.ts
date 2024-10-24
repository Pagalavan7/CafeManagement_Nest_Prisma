import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTablePriceDto {
  @IsNumber()
  @IsNotEmpty()
  tableId: number;

  @IsNumber()
  @IsNotEmpty()
  pricePerHour: number;

  @IsNumber()
  @IsOptional()
  hoursDiscount:number;

}
