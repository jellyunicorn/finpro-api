import { IsNotEmpty, IsNumber } from "class-validator";
import { PaginationQueryParams } from "../../pagination/pagination.dto.js";

export class GetDeliveryHistoryDTO extends PaginationQueryParams {
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}
