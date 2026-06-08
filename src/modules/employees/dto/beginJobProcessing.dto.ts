import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";
import { Station } from "../../../../generated/prisma/enums.js";

export class OrderItemInputDto {
  @IsInt()
  itemId!: number;

  @IsInt()
  @IsPositive()
  quantity!: number;
}

export class BeginJobProcessingDto {
  @IsString()
  jobId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items!: OrderItemInputDto[];
}
