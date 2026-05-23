import { Router } from "express";
import { UserController } from "./user.controller.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";

export class UserRouter {
  private router: Router;

  constructor(
    private userController: UserController,
    private authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.get(
      "/",
      this.authMiddleware.verifyToken,
      this.userController.getUserData,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
