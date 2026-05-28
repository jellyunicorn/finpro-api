import {
  EmployeeType,
  PrismaClient,
} from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";

export class AttendanceService {
  constructor(private prisma: PrismaClient) {}

  getAttendanceByEmployee = async (userId: number) => {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw new ApiError("Employee does not exist", 400);
    }

    const attendances = await this.prisma.attendance.findMany({
      where: { employeeId: employee.id },
    });

    return attendances;
  };

  getAttendanceByOutlet = async (userId: number) => {
    console.log(userId);

    const admin = await this.prisma.employee.findUnique({
      where: { userId },
    });

    if (!admin) {
      throw new ApiError("Outlet admin does not exist", 400);
    }

    if (admin.type != EmployeeType.ADMIN) {
      throw new ApiError("Unauthorized access", 400);
    }

    const outlet = await this.prisma.outlet.findUnique({
      where: { id: admin.outletId },
      include: {
        employees: {
          where: {
            NOT: { type: EmployeeType.ADMIN },
          },
          select: {
            id: true,
            user: {
              select: {
                fullName: true,
              },
            },
            attendance: {
              orderBy: { startTime: "desc" },
              select: {
                id: true,
                startTime: true,
                endTime: true,
              },
            },
          },
        },
      },
    });

    if (!outlet) {
      throw new ApiError("Outlet not found", 400);
    }

    return outlet.employees.map((employee) => ({
      id: employee.id,
      fullName: employee.user.fullName,
      attendance: employee.attendance,
    }));
  };

  clockIn = async (userId: number) => {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw new ApiError("Employee does not exist", 400);
    }

    const activeSession = await this.prisma.attendance.findFirst({
      where: { employeeId: employee.id, endTime: null },
    });

    if (activeSession) {
      throw new ApiError("Employee is already clocked in", 400);
    }

    await this.prisma.attendance.create({
      data: {
        employeeId: employee.id,
      },
    });

    return { message: "Attendance clock-in successful" };
  };

  clockOut = async (userId: number) => {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw new ApiError("Employee does not exist", 400);
    }

    const activeSession = await this.prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        endTime: null,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    if (!activeSession) {
      throw new ApiError("Employee is not clocked in", 400);
    }

    await this.prisma.attendance.update({
      where: {
        id: activeSession.id,
      },
      data: {
        endTime: new Date(),
      },
    });

    return { message: "Attendance clock-out successful" };
  };
}
