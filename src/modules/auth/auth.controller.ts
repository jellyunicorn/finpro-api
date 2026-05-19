import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

export class AuthController {
  constructor(private sampleService: AuthService) {}

  register = async (req: Request, res: Response) => {
    const result = await this.sampleService.register(req.body);
    res.status(200).send(result);
  };
}
