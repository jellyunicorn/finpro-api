import {
  EmployeeType,
  PrismaClient,
  AttendanceType,
} from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
import { GetAttendanceByEmployeeIdDTO } from "./dto/getAttendanceByEmployeeId.dto.js";
import { GetAttendanceByUserIdDTO } from "./dto/getAttendanceByUserId.dto.js";
import { GetOutletAttendanceLogDTO } from "./dto/getOutletAttendanceLog.dto.js";

export class AttendanceService {
  constructor(private prisma: PrismaClient) {}

  getAttendanceByUserId = async ({
    userId,
    take,
    page,
    sortBy,
    sortOrder,
    startDate,
    endDate,
  }: GetAttendanceByUserIdDTO) => {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!employee) {
      throw new ApiError("Employee does not exist", 400);
    }

    const whereClause: any = { employeeId: employee.id };

    if (startDate || endDate) {
      whereClause.startTime = {};
      if (startDate) {
        whereClause.startTime.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        whereClause.startTime.lte = end;
      }
    }

    const attendances = await this.prisma.attendance.findMany({
      where: whereClause,
      take,
      skip: (page - 1) * take,
      orderBy: { [sortBy]: sortOrder },
    });

    const total = await this.prisma.attendance.count({ where: whereClause });

    return { data: attendances, meta: { page, take, total } };
  };

  getAttendanceByEmployeeId = async ({
    employeeId,
    take,
    page,
    sortBy,
    sortOrder,
    startDate,
    endDate,
  }: GetAttendanceByEmployeeIdDTO) => {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: { user: true },
    });

    if (!employee) {
      throw new ApiError("Employee does not exist", 400);
    }

    const whereClause: any = { employeeId };

    if (startDate || endDate) {
      whereClause.startTime = {};
      if (startDate) {
        whereClause.startTime.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        whereClause.startTime.lte = end;
      }
    }

    const attendances = await this.prisma.attendance.findMany({
      where: whereClause,
      take,
      skip: (page - 1) * take,
      orderBy: { [sortBy]: sortOrder },
    });

    const total = await this.prisma.attendance.count({ where: whereClause });

    const data = {
      attendance: [...attendances],
      employeeName: employee.user.fullName,
    };

    return { data, meta: { page, take, total } };
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
      where: { userId },
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
          select: { id: true, startTime: true, type: true },
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
        type: AttendanceType.CLOCK_IN,
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

    await this.prisma.attendance.create({
      data: {
        employeeId: employee.id,
        startTime: new Date(),
        type: AttendanceType.CLOCK_OUT,
      },
    });

    return { message: "Attendance clock-out successful" };
  };
}
