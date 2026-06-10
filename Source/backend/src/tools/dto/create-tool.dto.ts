import { IsString, IsOptional, IsInt, Min, Max, IsDateString } from 'class-validator';

export class CreateToolDto {
  @IsString()
  inventory_number!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsInt()
  category_id?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  purchase_date?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  condition_score?: number;
}