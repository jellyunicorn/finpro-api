import { PaginationQueryParams } from "../../pagination/pagination.dto.js";
import { IsDateString, IsOptional } from "class-validator";

export class GetJobHistoryDto extends PaginationQueryParams {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
