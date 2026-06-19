import {
  IsBoolean,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from "class-validator";

export class CreateAddressDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  label!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}$/, { message: "postalCode must be 5 digits" })
  postalCode!: string;

  @IsNotEmpty()
  @IsLatitude()
  latitude!: string;

  @IsNotEmpty()
  @IsLongitude()
  longitude!: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsString()
  regencyCode?: string;

  @IsOptional()
  @IsString()
  districtCode?: string;

  @IsOptional()
  @IsString()
  villageCode?: string;
}

export class UpdateAddressDTO {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  label!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}$/, { message: "postalCode must be 5 digits" })
  postalCode!: string;

  @IsNotEmpty()
  @IsLatitude()
  latitude!: string;

  @IsNotEmpty()
  @IsLongitude()
  longitude!: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsString()
  regency?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  village?: string;
}

export class AddressIdDTO {
  @IsInt()
  @IsNotEmpty()
  id!: number;
}
