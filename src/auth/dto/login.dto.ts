import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
export class LoginDto {
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @Transform(({ value }: TransformFnParams) => {
    return typeof value === 'string' ? value.trim().toLowerCase() : value;
  })
  email!: string;
  @IsString()
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password!: string;
}
