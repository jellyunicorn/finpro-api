import {
  EmployeeType,
  PrismaClient,
} from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
import { GetEmployeeAttendanceDTO } from "./dto/getEmployeeAttendance.dto.js";
import { GetOutletAttendanceLogDTO } from "./dto/getOutletAttendanceLog.js";

export class AttendanceService {
  constructor(private prisma: PrismaClient) {}

  getAttendanceByEmployee = async ({
    userId,
    take,
    page,
    sortBy,
    sortOrder,
  }: GetEmployeeAttendanceDTO) => {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw new ApiError("Employee does not exist", 400);
    }

    const attendances = await this.prisma.attendance.findMany({
      where: { employeeId: employee.id },
      take,
      skip: (page - 1) * take,
      orderBy: { [sortBy]: sortOrder },
    });

    const total = await this.prisma.attendance.count({
      where: { employeeId: employee.id },
    });

    return { data: attendances, meta: { page, take, total } };
  };

  getAttendanceByOutlet = async ({
    userId,
    take,
    page,
    sortBy,
    sortOrder,
    attendanceLimit,
  }: GetOutletAttendanceLogDTO) => {
    const admin = await this.prisma.employee.findUnique({
      where: {
        userId,
      },
    });

    if (!admin || admin.type !== EmployeeType.ADMIN) {
      throw new ApiError("Unauthorized access", 400);
    }

    const skip = (page - 1) * take;
    const whereClause = {
      outletId: admin.outletId,
      NOT: { type: EmployeeType.ADMIN },
    };

    const employees = await this.prisma.employee.findMany({
      where: whereClause,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        user: { select: { fullName: true } },
        attendance: {
          orderBy: { startTime: "desc" },
          take: attendanceLimit,
          select: { id: true, startTime: true, endTime: true },
        },
      },
    });

    const total = await this.prisma.employee.count({
      where: whereClause,
    });

    return {
      data: employees.map((employee) => ({
        id: employee.id,
        fullName: employee.user.fullName,
        attendance: employee.attendance,
      })),
      meta: {
        page,
        take,
        total,
      },
    };
  };

  clockIn = async (userId: number) => {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw new ApiError("Employee does not exist", 400);
    }

    return { message: "Attendance clock-in successful" };
  };

  clockOut = async (userId: number) => {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw new ApiError("Employee does not exist", 400);
    }

    return { message: "Attendance clock-out successful" };
  };
}
