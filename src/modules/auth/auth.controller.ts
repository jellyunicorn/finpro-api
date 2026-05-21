import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { ApiError } from "../../utils/api-error.js";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    res.status(200).send(result);
  };

  verifyEmail = async (req: Request, res: Response) => {
    const token = req.query.token as string;
    if (!token) {
      throw new ApiError("Token is required", 400);
    }
    const result = await this.authService.verifyEmail(token);
    res.status(200).send(result);
  };

  createUserService = async (req: Request, res: Response) => {
    const token = req.query.token as string;
    if (!token) {
      throw new ApiError("Token is required", 400);
    }
    const result = await this.authService.createUserService(token, req.body);
    res.status(200).send(result);
  };
}
