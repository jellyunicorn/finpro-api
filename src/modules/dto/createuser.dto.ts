import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  MaxLength,
  IsNotEmpty,
} from "class-validator";

export class createUserDTO {
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @IsNotEmpty()
  password!: string;
}
