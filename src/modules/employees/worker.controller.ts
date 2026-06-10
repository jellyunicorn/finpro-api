import { Request, Response } from "express";
import { WorkerService } from "./worker.service.js";
import { plainToInstance } from "class-transformer";
import { BeginJobProcessingDto } from "./dto/beginJobProcessing.dto.js";
import { GetAvailableJobsDto } from "./dto/getAvailableJobs.dto.js";

export class WorkerController {
  constructor(private workerService: WorkerService) {}

  getAvailableJobs = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const query = plainToInstance(GetAvailableJobsDto, req.query);
    const result = await this.workerService.getAvailableJobs(userId, query);
    res.status(200).send(result);
  };

  getActiveJobs = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const query = plainToInstance(GetAvailableJobsDto, req.query);
    const result = await this.workerService.getActiveJobs(userId, query);
    res.status(200).send(result);
  };

  getJobHistory = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const query = plainToInstance(GetAvailableJobsDto, req.query);
    const result = await this.workerService.getJobHistory(userId, query);
    res.status(200).send(result);
  };

  beginJobProcessing = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const body = plainToInstance(BeginJobProcessingDto, req.body);
    const result = await this.workerService.beginJobProcessing(userId, body);
    res.status(200).send(result);
  };

  finishJobProcessing = async (req: Request, res: Response) => {
    const jobId = req.params.id;
    const result = await this.workerService.finishJobProcessing(jobId);
    res.status(200).send(result);
  };
}
