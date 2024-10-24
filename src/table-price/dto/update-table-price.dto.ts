import { PartialType } from '@nestjs/mapped-types';
import { CreateTablePriceDto } from './create-table-price.dto';

export class UpdateTablePriceDto extends PartialType(CreateTablePriceDto) {}
