import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsPositive,
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
  @IsInt()
  orderId!: number;

  @IsEnum(Station)
  station!: Station;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items!: OrderItemInputDto[];
}
