import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import "reflect-metadata";
import { PORT } from "./config/env.js";
import { loggerHttp } from "./lib/logger-http.js";
import { prisma } from "./lib/prisma.js";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middlewares/error.middleware.js";
import { ValidationMiddleware } from "./middlewares/validation.middleware.js";
import { AuthRouter } from "./modules/auth/auth.router.js";
import { AuthController } from "./modules/auth/auth.controller.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { MailService } from "./modules/mail/mail.service.js";
import { corsOptions } from "./config/cors.js";
import { AuthMiddleware } from "./middlewares/auth.middleware.js";
import { UserRouter } from "./modules/user/user.router.js";
import { UserController } from "./modules/user/user.controller.js";
import { UserService } from "./modules/user/user.service.js";
import { CloudinaryService } from "./modules/cloudinary/cloudinary.service.js";
import { AddressService } from "./modules/address/address.service.js";
import { AddressController } from "./modules/address/address.controller.js";
import { AddressRouter } from "./modules/address/address.router.js";
import { AttendanceService } from "./modules/attendance/attendance.service.js";
import { AttendanceController } from "./modules/attendance/attendance.controller.js";
import { AttendanceRouter } from "./modules/attendance/attendance.router.js";
import { DriverService } from "./modules/employees/driver.service.js";
import { DriverController } from "./modules/employees/driver.controller.js";
import { DriverRouter } from "./modules/employees/driver.router.js";
import { OrderRouter } from "./modules/order/order.router.js";
import { OrderController } from "./modules/order/order.controller.js";
import { OrderServices } from "./modules/order/order.service.js";
import { NotificationService } from "./modules/notification/notification.service.js";
import { NotificationController } from "./modules/notification/notification.controller.js";
import { NotificationRouter } from "./modules/notification/notification.router.js";
import { WorkerService } from "./modules/employees/worker.service.js";
import { WorkerController } from "./modules/employees/worker.controller.js";
import { WorkerRouter } from "./modules/employees/worker.router.js";

export class App {
  app: Express;

  constructor() {
    this.app = express();
    this.configure();
  }

  private configure() {
    this.app.use(cors(corsOptions));
    this.app.use(cookieParser());
    this.app.use(loggerHttp);
    this.app.use(express.json());
    this.registerModules();
    this.errorMiddleware();
  }

  private registerModules() {
    // services
    const mailService = new MailService();
    const cloudinaryService = new CloudinaryService();

    const authService = new AuthService(prisma, mailService);
    const addressService = new AddressService(prisma);
    const userService = new UserService(prisma, cloudinaryService, mailService);
    const orderService = new OrderServices(prisma);
    const attendanceService = new AttendanceService(prisma);
    const driverService = new DriverService(prisma);
    const workerService = new WorkerService(prisma);
    const notificationService = new NotificationService(prisma);

    // controllers
    const authController = new AuthController(authService);
    const addressController = new AddressController(addressService);
    const userController = new UserController(userService);
    const orderController = new OrderController(orderService);
    const attendanceController = new AttendanceController(attendanceService);
    const driverController = new DriverController(driverService);
    const workerController = new WorkerController(workerService);
    const notificationController = new NotificationController(
      notificationService,
    );

    // middlewares
    const authMiddleware = new AuthMiddleware();
    const validationMiddleware = new ValidationMiddleware();

    // routes
    const authRouter = new AuthRouter(
      authController,
      authMiddleware,
      validationMiddleware,
    );
    const userRouter = new UserRouter(
      userController,
      authMiddleware,
      validationMiddleware,
    );
    const addressRouter = new AddressRouter(
      addressController,
      authMiddleware,
      validationMiddleware,
    );
    const attendanceRouter = new AttendanceRouter(
      attendanceController,
      authMiddleware,
    );
    const driverRouter = new DriverRouter(driverController, authMiddleware);
    const workerRouter = new WorkerRouter(
      workerController,
      authMiddleware,
      validationMiddleware,
    );
    const orderRouter = new OrderRouter(
      orderController,
      validationMiddleware,
      authMiddleware,
    );
    const notificationRouter = new NotificationRouter(
      notificationController,
      authMiddleware,
    );

    // entry point
    this.app.use("/auth", authRouter.getRouter());
    this.app.use("/user", userRouter.getRouter());
    this.app.use("/address", addressRouter.getRouter());
    this.app.use("/attendance", attendanceRouter.getRouter());
    this.app.use("/driver", driverRouter.getRouter());
    this.app.use("/worker", workerRouter.getRouter());
    this.app.use("/order", orderRouter.getRouter());
    this.app.use("/notification", notificationRouter.getRouter());
  }

  private errorMiddleware() {
    this.app.use(notFoundMiddleware);
    this.app.use(errorMiddleware);
  }

  public start() {
    this.app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  }
}
