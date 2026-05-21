import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  MaxLength,
} from "class-validator";

export class createUserDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(72)
  password!: string;
}
