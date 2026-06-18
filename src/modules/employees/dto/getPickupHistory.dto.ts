import { IsDateString, IsOptional } from "class-validator";
import { PaginationQueryParams } from "../../pagination/pagination.dto.js";

export class GetPickupHistoryDTO extends PaginationQueryParams {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
