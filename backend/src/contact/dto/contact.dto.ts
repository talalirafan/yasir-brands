import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ContactDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(5)
  message: string;
}
