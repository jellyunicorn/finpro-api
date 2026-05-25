import { Request, Response } from "express";
import { UserService } from "./user.service.js";
import { ApiError } from "../../utils/api-error.js";

export class UserController {
  constructor(private userService: UserService) {}

  getUserData = async (req: Request, res: Response) => {
    const userid = res.locals.user.id;

    const result = await this.userService.getUserData(userid);
    res.status(200).send(result);
  };

  updateUser = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const body = req.body;
    const file = req.file;

    if (
      file &&
      !["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)
    ) {
      throw new ApiError("Invalid file type", 400);
    }

    if (file && file.size > 1 * 1024 * 1024) {
      throw new ApiError("File too large", 400);
    }

    const result = await this.userService.updateUser(userId, body, file);
    res.status(200).send(result);
  };
}
