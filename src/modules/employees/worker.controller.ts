import { Request, Response } from "express";
import { WorkerService } from "./worker.service.js";
import { plainToInstance } from "class-transformer";
import { BeginJobProcessingDto } from "./dto/beginJobProcessing.dto.js";

export class WorkerController {
  constructor(private workerService: WorkerService) {}

  beginJobProcessing = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const body = plainToInstance(BeginJobProcessingDto, req.body);
    const result = await this.workerService.beginJobProcessing(userId, body);
    res.status(200).send(result);
  };

  finishJobProcessing = async (req: Request, res: Response) => {
    const jobId = Number(req.params.id);
    const result = await this.workerService.finishJobProcessing(jobId);
    res.status(200).send(result);
  };
}
