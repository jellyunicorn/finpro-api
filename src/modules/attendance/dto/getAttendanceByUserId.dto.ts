import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from "class-validator";
import { PaginationQueryParams } from "../../pagination/pagination.dto.js";

export class GetAttendanceByUserIdDTO extends PaginationQueryParams {
  @IsNumber()
  @IsNotEmpty()
  userId!: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
