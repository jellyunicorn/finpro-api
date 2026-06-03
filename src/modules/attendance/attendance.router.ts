import { Router } from "express";
import { Role } from "../../../generated/prisma/enums.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { AttendanceController } from "./attendance.controller.js";

export class AttendanceRouter {
  private router: Router;

  constructor(
    private attendanceController: AttendanceController,
    private authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.get(
      "/",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER, Role.WORKER]),
      this.attendanceController.getMyAttendanceLog,
    );
    this.router.get(
      "/employee/:id",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.ADMIN]),
      this.attendanceController.getAttendanceByEmployee,
    );
    this.router.get(
      "/outlet",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.ADMIN]),
      this.attendanceController.getAttendanceByOutlet,
    );
    this.router.put(
      "/clock-in",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER, Role.WORKER]),
      this.attendanceController.clockIn,
    );
    this.router.put(
      "/clock-out",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER, Role.WORKER]),
      this.attendanceController.clockOut,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
