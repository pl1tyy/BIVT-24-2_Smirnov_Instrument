import { IsString, IsEmail, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(100, { message: 'Имя не должно превышать 100 символов' })
  name!: string;

  @IsEmail({}, { message: 'Некорректный формат email' })
  email!: string;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Возраст не может быть отрицательным' })
  age?: number;
}