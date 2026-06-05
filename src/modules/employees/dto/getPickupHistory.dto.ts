import { IsNotEmpty, IsNumber } from "class-validator";
import { PaginationQueryParams } from "../../pagination/pagination.dto.js";

export class GetPickupHistoryDTO extends PaginationQueryParams {
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}
