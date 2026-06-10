import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAssignmentDto {
  @IsInt()
  tool_id!: number;

  @IsInt()
  user_id!: number;

  @IsOptional()
  @IsString()
  notes?: string; 
}