import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { PaginationQueryParams } from "../../pagination/pagination.dto.js";

export class GetOutletAttendanceLogDTO extends PaginationQueryParams {
  @IsNumber()
  @IsNotEmpty()
  userId!: number;

  @IsNumber()
  @IsOptional()
  attendanceLimit: number = 5;
}
