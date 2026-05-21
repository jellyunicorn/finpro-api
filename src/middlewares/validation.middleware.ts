import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

export class ValidationMiddleware {
  validateBody<T>(dtoClass: new () => T) {
    return async (req: Request, _res: Response, next: NextFunction) => {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new ApiError("Request body is required", 400);
      }

      const dtoInstance = plainToInstance(dtoClass, req.body);

      const errors = await validate(dtoInstance as any);

      if (errors.length > 0) {
        const message = errors
          .map((error) => Object.values(error.constraints || {}))
          .flat()
          .join(", ");

        throw new ApiError(message, 400);
      }

      req.body = dtoInstance;

      next();
    };
  }
}
