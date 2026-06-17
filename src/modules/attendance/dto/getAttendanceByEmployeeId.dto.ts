import { IsNotEmpty, IsNumber } from "class-validator";
import { PaginationQueryParams } from "../../pagination/pagination.dto.js";

export class GetAttendanceByEmployeeIdDTO extends PaginationQueryParams {
  @IsNumber()
  @IsNotEmpty()
  employeeId!: number;
}
