import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class changeEmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
