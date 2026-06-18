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
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "pickupDate must be in YYYY-MM-DD format",
  })
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
