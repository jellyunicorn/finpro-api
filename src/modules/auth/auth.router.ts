import { Router } from "express";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { AuthController } from "./auth.controller.js";
import { RegisterDTO } from "./dto/auth.dto.js";
import { createUserDTO } from "./dto/createuser.dto.js";

export class AuthRouter {
  private router: Router;

  constructor(
    private authController: AuthController,
    private validationMiddleware: ValidationMiddleware,
  ) {
    this.router = Router();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.post(
      "/register",
      this.validationMiddleware.validateBody(RegisterDTO),
      this.authController.register,
    );
    this.router.post(
      "/create-user",
      this.validationMiddleware.validateBody(createUserDTO),
      this.authController.createUserService,
    );
    this.router.get("/verifyemail", this.authController.verifyEmail);
  };

  getRouter = () => {
    return this.router;
  };
}
