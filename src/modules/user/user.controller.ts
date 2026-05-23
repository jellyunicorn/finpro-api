import { Request, Response } from "express";
import { UserService } from "./user.service.js";

export class UserController {
  constructor(private userService: UserService) {}

  getUserData = async (req: Request, res: Response) => {
    const userid = res.locals.user.id;

    const result = await this.userService.getUserData(userid);
    res.status(200).send(result);
  };
}
