import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from "class-validator";
import { PaginationQueryParams } from "../../pagination/pagination.dto.js";

export class GetAttendanceByEmployeeIdDTO extends PaginationQueryParams {
  @IsNumber()
  @IsNotEmpty()
  employeeId!: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
