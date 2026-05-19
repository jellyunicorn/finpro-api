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

export class App {
  app: Express;

  constructor() {
    this.app = express();
    this.configure();
  }

  private configure() {
    this.app.use(cors());
    this.app.use(loggerHttp);
    this.app.use(express.json());
    this.registerModules();
    this.errorMiddleware();
  }

  private registerModules() {
    // services
    const mailService = new MailService();
    const authService = new AuthService(prisma, mailService);

    // controllers
    const authController = new AuthController(authService);

    // middlewares
    const validationMiddleware = new ValidationMiddleware();

    // routes
    const router = new AuthRouter(authController, validationMiddleware);

    // entry point
    this.app.use("/auth", router.getRouter());
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
