import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  MaxLength,
  IsNotEmpty,
} from "class-validator";
import { Transform } from "class-transformer";

export class registerDTO {
  @Transform(({ value }) =>
    typeof value === "string" ? value.replace(/<[^>]*>/g, "").trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class loginDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @IsNotEmpty()
  password!: string;
}
