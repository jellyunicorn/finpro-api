import jwt from "jsonwebtoken";
import { Prisma, PrismaClient } from "../../../generated/prisma/client.js";
import { loginDTO, registerDTO } from "./dto/auth.dto.js";
import { ApiError } from "../../utils/api-error.js";
import { MailService } from "../mail/mail.service.js";
import { hash, verify } from "argon2";
import { createUserDTO } from "./dto/createuser.dto.js";
import {
  EXPIRED_ACCESS_TOKEN_JWT,
  EXPIRED_REFRESH_TOKEN_JWT,
  REFRESH_TOKEN_EXPIRES_IN,
} from "./authConstants.js";

export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private mailService: MailService,
  ) {}

  register = async (body: registerDTO) => {
    const trimEmail = body.email.toLowerCase().trim();
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: trimEmail },
    });

    if (existingEmail) {
      throw new ApiError("This Email is already in use", 409);
    }

    const token = jwt.sign(
      { fullName: body.fullName, email: trimEmail },
      process.env.JWT_VERIFY_SECRET as string,
      { expiresIn: "1h" },
    );

    await this.mailService.sendMail({
      to: body.email,
      subject: "Welcome to Claundry!",
      templateName: "welcome",
      context: {
        name: body.fullName,
        logoUrl: process.env.MAIL_LOGO_URL,
        verifyUrl: `${process.env.BASE_FE_URL}/verified?token=${token}`,
      },
    });
    return { message: "Email has been sent" };
  };

  verifyEmail = async (token: string) => {
    let decoded: { fullName: string; email: string };

    try {
      decoded = jwt.verify(token, process.env.JWT_VERIFY_SECRET!) as {
        fullName: string;
        email: string;
      };
    } catch (error) {
      throw new ApiError("Invalid or expired token", 400);
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (existingUser?.verifiedAt) {
      throw new ApiError("Token has been used", 400);
    }

    return { email: decoded.email, fullName: decoded.fullName };
  };

  createUserService = async (token: string, body: createUserDTO) => {
    let decoded: { fullName: string; email: string };

    try {
      decoded = jwt.verify(token, process.env.JWT_VERIFY_SECRET!) as {
        fullName: string;
        email: string;
      };
    } catch (error) {
      throw new ApiError("Invalid or expired token", 400);
    }
    const existingUser = await this.prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (existingUser?.verifiedAt) {
      throw new ApiError("Token has been used", 400);
    }

    const hashedPassword = await hash(body.password);

    try {
      await this.prisma.user.create({
        data: {
          fullName: decoded.fullName,
          email: decoded.email,
          password: hashedPassword,
          verifiedAt: new Date(),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ApiError("Token has been used", 400);
      }
      throw error;
    }

    return { message: "Successfully registered & activated" };
  };

  loginService = async (body: loginDTO) => {
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: body.email },
      });

      if (!user || !user.password) {
        throw new ApiError("Invalid credentials", 400);
      }

      const isPassMatch = await verify(user.password, body.password);

      if (!isPassMatch) {
        throw new ApiError("Invalid credentials", 400);
      }

      const payload = {
        id: user.id,
        role: user.role,
      };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: EXPIRED_ACCESS_TOKEN_JWT,
      });

      const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH!, {
        expiresIn: EXPIRED_REFRESH_TOKEN_JWT,
      });

      await tx.refreshToken.upsert({
        where: { userId: user.id },
        update: {
          token: refreshToken,
          expiredAt: new Date(REFRESH_TOKEN_EXPIRES_IN()),
        },
        create: {
          token: refreshToken,
          expiredAt: new Date(REFRESH_TOKEN_EXPIRES_IN()),
          userId: user.id,
        },
      });

      const { password, ...usernopass } = user;
      return { user: usernopass, accessToken, refreshToken };
    });

    return result;
  };
}
