import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap sesuai KTP wajib diisi' })
  @Transform(({ value }: TransformFnParams) => {
    return typeof value === 'string' 
      ? value.trim().replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) 
      : value;
  })
  full_name!: string; 

  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @Transform(({ value }: TransformFnParams) => {
    return typeof value === 'string' ? value.trim().toLowerCase() : value;
  })
  email!: string; 

  @IsString()
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-local]).*$/, {
    message: 'Password harus mengandung huruf besar, huruf kecil, dan angka/simbol',
  })
  password!: string; 
}