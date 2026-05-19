import { hash, verify } from "argon2";
import axios from "axios";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "../../../generated/prisma/client.js";
import { RegisterDTO } from "./dto/auth.dto.js";
import { ApiError } from "../../utils/api-error.js";

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  register = async (body: RegisterDTO) => {
    const trimemail = body.email.toLowerCase().trim();
    const existingemail = await this.prisma.user.findUnique({
      where: { email: trimemail },
    });

    if (existingemail) {
      throw new ApiError("This Email is already in use", 409);
    }

    await this.prisma.user.create({
      data: {
        fullName: body.fullName,
        email: trimemail,
      },
    });
    return { message: "User registration success" };
  };
}
