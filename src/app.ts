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
    const userService = new UserService(prisma, cloudinaryService);

    // controllers
    const authController = new AuthController(authService);
    const userController = new UserController(userService);

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

    // entry point
    this.app.use("/auth", authRouter.getRouter());
    this.app.use("/user", userRouter.getRouter());
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
