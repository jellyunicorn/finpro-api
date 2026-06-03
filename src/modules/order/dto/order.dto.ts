import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
} from "class-validator";

export class CreateOrderDTO {
  @IsNotEmpty()
  @IsInt()
  pickupAddressId!: number;

  @IsNotEmpty()
  @IsInt()
  outletId!: number;

  @IsNotEmpty()
  @IsDateString()
  pickupDate!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "pickupTime must be HH:MM format" })
  pickupTime!: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  distance!: number;
}
