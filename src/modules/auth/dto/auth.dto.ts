import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  MaxLength,
} from "class-validator";
import { Transform } from "class-transformer";

export class RegisterDTO {
  @Transform(({ value }) =>
    typeof value === "string" ? value.replace(/<[^>]*>/g, "").trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  fullName!: string;

  @IsEmail()
  email!: string;
}
