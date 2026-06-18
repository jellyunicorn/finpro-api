import { Request, Response } from "express";
import { UserService } from "./user.service.js";
import jwt from "jsonwebtoken";

import { ApiError } from "../../utils/api-error.js";
import { email } from "zod";

export class UserController {
  constructor(private userService: UserService) {}

  getUserData = async (req: Request, res: Response) => {
    const userid = res.locals.user.id;

    const result = await this.userService.getUserData(userid);
    res.status(200).send(result);
  };

  getUserAddress = async (req: Request, res: Response) => {
    const userid = res.locals.user.id;
    const result = await this.userService.getUserAddress(userid);
    res.status(200).send(result);
  };

  updateUser = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const body = req.body;
    const file = req.file;
    const result = await this.userService.updateUser(userId, body, file);
    res.status(200).send(result);
  };

  resetPasswordEmail = async (req: Request, res: Response) => {
    const result = await this.userService.resetPasswordEmail(req.body);
    res.status(200).send(result);
  };
  verifyResetToken = async (req: Request, res: Response) => {
    const token = req.query.token as string;
    if (!token) {
      throw new ApiError("Token is required", 400);
    }
    const result = await this.userService.verifyResetToken(token);
    res.status(200).send(result);
  };

  changePassword = async (req: Request, res: Response) => {
    const newPass = req.body.password;
    const token = req.query.token as string;

    if (!token) throw new ApiError("Token is required", 400);
    if (!newPass) throw new ApiError("No new password provided", 400);

    let decoded: { email: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_RESET!) as {
        email: string;
      };
    } catch {
      throw new ApiError("Token invalid or expired", 400);
    }
    const result = await this.userService.changePassword(
      decoded.email,
      newPass,
    );
    res.status(200).send(result);
  };

  executeEmailChange = async (req: Request, res: Response) => {
    const token = req.query.token as string;
    if (!token) {
      throw new ApiError("Token is required", 400);
    }
    const result = await this.userService.executeEmailChange(token);
    res.status(200).send(result);
  };

  changeEmail = async (req: Request, res: Response) => {
    const userdata = res.locals.user;
    const newEmail = req.body.email;
    const result = await this.userService.changeEmail(newEmail, userdata);
    res.status(200).send(result);
  };
  reverify = async (req: Request, res: Response) => {
    const userdata = res.locals.user;
    const result = await this.userService.reverify(userdata);
    res.status(200).send(result);
  };
}
