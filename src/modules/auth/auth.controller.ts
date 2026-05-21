import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { ApiError } from "../../utils/api-error.js";
import { cookieOptions } from "../../config/cookie.js";

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

  loginService = async (req: Request, res: Response) => {
    const body = req.body;
    const { accessToken, refreshToken, ...result } =
      await this.authService.loginService(body);
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 10 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).send(result);
  };
}
