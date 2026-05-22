import { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";

export class AuthMiddleware {
  verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.accessToken;
      if (!token) {
        throw new ApiError("Unauthorized", 401);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
        role: string;
      };
    } catch (error) {}
  };
}
