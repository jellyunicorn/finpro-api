import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  MaxLength,
} from "class-validator";

export class RegisterDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  fullName!: string;

  @IsEmail()
  email!: string;
}
