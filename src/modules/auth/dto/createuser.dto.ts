import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  MaxLength,
} from "class-validator";

export class createUserDTO {
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}
