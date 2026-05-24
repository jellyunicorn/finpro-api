import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { ApiError } from "../../utils/api-error.js";
import { cookieOptions } from "../../config/cookie.js";
import {
  EXPIRED_ACCESS_TOKEN_JWT,
  EXPIRED_RESET_TOKEN_JWT,
} from "./authConstants.js";
import ms from "ms";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    res.status(200).send(result);
  };

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const { accessToken } = await this.authService.refresh(refreshToken);

    res.cookie("accessToken", accessToken, cookieOptions);
    res.status(200).send({ message: "Access token has been refreshed" });
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
      maxAge: ms(EXPIRED_ACCESS_TOKEN_JWT),
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: ms(EXPIRED_RESET_TOKEN_JWT),
    });
    res.status(200).send(result);
  };

  googleLogin = async (req: Request, res: Response) => {
    const { userWithoutPassword, accessToken, refreshToken } =
      await this.authService.googleLogin(req.body);

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).send({ user: userWithoutPassword });
  };

  googleRegister = async (req: Request, res: Response) => {
    const { userWithoutPassword, accessToken, refreshToken } =
      await this.authService.googleRegister(req.body);
    res.status(200).send({ user: userWithoutPassword });
  };

  logout = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;

    await this.authService.logout(userId);
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.status(200).send({ message: "successfully logged out" });
  };

  checkrole = async (req: Request, res: Response) => {
    res.status(200).send(res.locals.user.role);
  };
}
