import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;
}

export class InventoryQueryDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  limit: string;

  @IsOptional()
  @IsString()
  offset: string;
}
