import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  category?: string;

  @IsIn(['boys', 'girls', 'unisex'])
  gender: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  notes?: string[];

  @IsString()
  @IsOptional()
  size?: string;

  @IsNumber()
  @Min(0)
  stock: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
