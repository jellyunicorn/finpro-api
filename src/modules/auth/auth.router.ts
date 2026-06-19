import { Router } from "express";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { AuthController } from "./auth.controller.js";
import { googleAuthDTO, loginDTO, registerDTO } from "../dto/auth.dto.js";
import { createUserDTO } from "../dto/createuser.dto.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";

export class AuthRouter {
  private router: Router;

  constructor(
    private authController: AuthController,
    private authMiddleware: AuthMiddleware,
    private validationMiddleware: ValidationMiddleware,
  ) {
    this.router = Router();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.post(
      "/register",
      this.validationMiddleware.validateBody(registerDTO),
      this.authController.register,
    );
    this.router.post(
      "/create-user",
      this.validationMiddleware.validateBody(createUserDTO),
      this.authController.createUserService,
    );
    this.router.post(
      "/login",
      this.validationMiddleware.validateBody(loginDTO),
      this.authController.loginService,
    );
    this.router.post(
      "/login/google",
      this.validationMiddleware.validateBody(googleAuthDTO),
      this.authController.googleLogin,
    );
    this.router.post(
      "/register/google",
      this.validationMiddleware.validateBody(googleAuthDTO),
      this.authController.googleRegister,
    );
    this.router.get("/verifyemail", this.authController.verifyEmail);
    this.router.post("/refresh", this.authController.refresh);
    this.router.post(
      "/logout",
      this.authMiddleware.verifyToken,
      this.authController.logout,
    );
    this.router.get(
      "/me",
      this.authMiddleware.verifyToken,
      this.authController.checkrole,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
