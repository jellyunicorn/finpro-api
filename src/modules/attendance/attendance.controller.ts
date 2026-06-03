import { Request, Response } from "express";
import { AttendanceService } from "./attendance.service.js";
import { plainToInstance } from "class-transformer";
import { GetEmployeeAttendanceDTO } from "./dto/getEmployeeAttendance.dto.js";
import { GetOutletAttendanceLogDTO } from "./dto/getOutletAttendanceLog.js";

export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  getMyAttendanceLog = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const query = plainToInstance(GetEmployeeAttendanceDTO, {
      ...req.query,
      userId,
    });
    const result = await this.attendanceService.getAttendanceByEmployee(query);
    res.status(200).send(result);
  };

  getAttendanceByEmployee = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const query = plainToInstance(GetEmployeeAttendanceDTO, {
      ...req.query,
      userId,
    });
    const result = await this.attendanceService.getAttendanceByEmployee(query);
    res.status(200).send(result);
  };

  getAttendanceByOutlet = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const query = plainToInstance(GetOutletAttendanceLogDTO, {
      ...req.query,
      userId,
    });
    const result = await this.attendanceService.getAttendanceByOutlet(query);
    res.status(200).send(result);
  };

  clockIn = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const result = await this.attendanceService.clockIn(userId);
    res.status(200).send(result);
  };

  clockOut = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const result = await this.attendanceService.clockOut(userId);
    res.status(200).send(result);
  };
}
