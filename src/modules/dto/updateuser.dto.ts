import {
  IsDateString,
  IsString,
  MinLength,
  Matches,
  MaxLength,
  IsOptional,
} from "class-validator";

export class updateUserDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(72)
  @IsOptional()
  fullName?: string;

  @IsOptional()
  @Matches(/^\+?\d{8,13}$/, {
    message: "phone must be 8-13 digits, optionally starting with +",
  })
  phone?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
