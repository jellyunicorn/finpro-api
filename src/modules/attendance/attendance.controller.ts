import { Request, Response } from "express";
import { AttendanceService } from "./attendance.service.js";
import { plainToInstance } from "class-transformer";
import { GetAttendanceByUserIdDTO } from "./dto/getAttendanceByUserId.dto.js";
import { GetOutletAttendanceLogDTO } from "./dto/getOutletAttendanceLog.dto.js";
import { GetAttendanceByEmployeeIdDTO } from "./dto/getAttendanceByEmployeeId.dto.js";

export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  getMyAttendanceLog = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const query = plainToInstance(GetAttendanceByUserIdDTO, {
      ...req.query,
      userId,
    });
    const result = await this.attendanceService.getAttendanceByUserId(query);
    res.status(200).send(result);
  };

  getAttendanceByEmployee = async (req: Request, res: Response) => {
    const employeeId = Number(req.params.id);
    const query = plainToInstance(GetAttendanceByEmployeeIdDTO, {
      ...req.query,
      employeeId,
    });
    const result =
      await this.attendanceService.getAttendanceByEmployeeId(query);
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
