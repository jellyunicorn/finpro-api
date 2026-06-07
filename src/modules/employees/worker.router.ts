import { Router } from "express";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { WorkerController } from "./worker.controller.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { Role } from "../../../generated/prisma/enums.js";
import { BeginJobProcessingDto } from "./dto/beginJobProcessing.dto.js";

export class WorkerRouter {
  private router: Router;

  constructor(
    private workerController: WorkerController,
    private authMiddleware: AuthMiddleware,
    private validationMiddleware: ValidationMiddleware,
  ) {
    this.router = Router();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.get(
      "/jobs",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.WORKER]),
      this.workerController.getAvailableJobs,
    );
    this.router.post(
      "/begin-job",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.WORKER]),
      this.validationMiddleware.validateBody(BeginJobProcessingDto),
      this.workerController.beginJobProcessing,
    );
    this.router.patch(
      "/finish-job/:id",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.WORKER]),
      this.workerController.finishJobProcessing,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
