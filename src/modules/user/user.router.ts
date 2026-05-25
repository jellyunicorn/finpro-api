import { Router } from "express";
import { UserController } from "./user.controller.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { upload } from "../../config/multer.js";
import { updateUserDTO } from "../dto/updateuser.dto.js";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { changePasswordDTO } from "../dto/resetpassword.dto.js";

export class UserRouter {
  private router: Router;

  constructor(
    private userController: UserController,
    private authMiddleware: AuthMiddleware,
    private validationMiddleware: ValidationMiddleware,
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
    this.router.post(
      "/resettoken",
      this.authMiddleware.verifyToken,
      this.userController.verifyResetToken,
    );
    this.router.post(
      "/resetemail",
      this.authMiddleware.verifyToken,
      this.userController.resetPasswordEmail,
    );
    this.router.patch(
      "/update",
      this.authMiddleware.verifyToken,
      upload.single("avatar"),
      this.validationMiddleware.validateBody(updateUserDTO),
      this.userController.updateUser,
    );
    this.router.patch(
      "/changepassword",
      this.authMiddleware.verifyToken,
      this.validationMiddleware.validateBody(changePasswordDTO),
      this.userController.changePassword,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
