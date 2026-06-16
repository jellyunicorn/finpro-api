import {
  EmployeeType,
  PrismaClient,
} from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
import { GetEmployeeAttendanceDTO } from "./dto/getEmployeeAttendance.dto.js";
import { GetOutletAttendanceLogDTO } from "./dto/getOutletAttendanceLog.dto.js";

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

    const whereClause = { employeeId: employee.id };

    const attendances = await this.prisma.attendance.findMany({
      where: whereClause,
      take,
      skip: (page - 1) * take,
      orderBy: { [sortBy]: sortOrder },
    });

    const total = await this.prisma.attendance.count({
      where: whereClause,
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
      throw new ApiError("Employee does not exist", 404);
    }

    await this.prisma.attendance.create({
      data: {
        employeeId: employee.id,
        startTime: new Date(),
      },
    });

    return { message: "Attendance clock-in successful" };
  };

  clockOut = async (userId: number) => {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw new ApiError("Employee does not exist", 404);
    }

    const latestAttendance = await this.prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        endTime: null,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    if (!latestAttendance) {
      throw new ApiError("Employee is not clocked in", 400);
    }

    await this.prisma.attendance.update({
      where: {
        id: latestAttendance.id,
      },
      data: {
        endTime: new Date(),
      },
    });

    return { message: "Attendance clock-out successful" };
  };
}
