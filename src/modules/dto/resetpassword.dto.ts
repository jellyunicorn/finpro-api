import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class resetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  fullName!: string;
}

export class changePasswordDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
