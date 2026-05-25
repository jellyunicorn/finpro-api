import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from "class-validator";

export class updateUserDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(72)
  @IsOptional()
  fullName?: string;

  @IsString()
  @MinLength(11)
  @MaxLength(13)
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  birthDate?: string;
}
