import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { AddressController } from "./address.controller.js";

export class AddressRouter {
  private router: Router;

  constructor(
    private addressController: AddressController,
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
      this.addressController.getUserAddress,
    );
    this.router.post(
      "/create",
      this.authMiddleware.verifyToken,
      this.addressController.createAddress,
    );
    this.router.patch(
      "/switch",
      this.authMiddleware.verifyToken,
      this.addressController.switchPrimaryAddress,
    );
    this.router.patch(
      "/update",
      this.authMiddleware.verifyToken,
      this.addressController.updateAddressDetail,
    );
    this.router.patch(
      "/delete",
      this.authMiddleware.verifyToken,
      this.addressController.deleteAddress,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
