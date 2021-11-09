import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class registerDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^((?!.*[\s])(?=.*[A-Za-z])(?=.*\d).{8,})/, {message: "Пароль слишком слабый. Должен содержать минимум 1 цифру и быть длиной более 8 символов."})
  password: string;
}

export default registerDto;

