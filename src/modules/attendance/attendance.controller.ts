import { Request, Response } from "express";
import { AttendanceService } from "./attendance.service.js";

export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  getMyAttendanceLog = async (req: Request, res: Response) => {
    const id = Number(res.locals.user.id);
    const result = await this.attendanceService.getAttendanceByEmployee(id);
    res.status(200).send(result);
  };

  getAttendanceByEmployee = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await this.attendanceService.getAttendanceByEmployee(id);
    res.status(200).send(result);
  };

  getAttendanceByOutlet = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await this.attendanceService.getAttendanceByOutlet(id);
    res.status(200).send(result);
  };

  clockIn = async (req: Request, res: Response) => {
    const id = Number(res.locals.user.id);
    const result = await this.attendanceService.clockIn(id);
    res.status(200).send(result);
  };

  clockOut = async (req: Request, res: Response) => {
    const id = Number(res.locals.user.id);
    const result = await this.attendanceService.clockOut(id);
    res.status(200).send(result);
  };
}
