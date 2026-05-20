import jwt from "jsonwebtoken";
import { PrismaClient, User } from "../../../generated/prisma/client.js";
import { createUserDTO, RegisterDTO } from "./dto/auth.dto.js";
import { ApiError } from "../../utils/api-error.js";
import { MailService } from "../mail/mail.service.js";
import { env } from "../../utils/validatorEnv.js";
import { hash } from "argon2";

export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private mailService: MailService,
  ) {}

  register = async (body: RegisterDTO) => {
    const trimemail = body.email.toLowerCase().trim();
    const existingemail = await this.prisma.user.findUnique({
      where: { email: trimemail },
    });

    if (existingemail) {
      throw new ApiError("This Email is already in use", 409);
    }

    const token = jwt.sign(
      { fullName: body.fullName, email: trimemail },
      env.JWT_VERIFY_SECRET,
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
    return { message: "User registration success" };
  };

  verifyEmail = async (token: string) => {
    let decoded: { fullName: string; email: string };

    try {
      decoded = jwt.verify(token, env.JWT_VERIFY_SECRET) as {
        fullName: string;
        email: string;
      };
    } catch (error) {
      throw new ApiError("Invalid or expired token", 400);
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (existingUser) {
      throw new ApiError("Token has been used", 400);
    }

    return { email: decoded.email, fullName: decoded.fullName };
  };

  createUserService = async (body: createUserDTO) => {
    const trimemail = body.email.toLowerCase().trim();
    const existingemail = await this.prisma.user.findUnique({
      where: { email: trimemail },
    });

    if (existingemail) {
      throw new ApiError("This Email is already in use", 409);
    }
    const hashedPassword = await hash(body.password);

    const user = await this.prisma.user.create({
      data: {
        fullName: body.fullName,
        email: trimemail,
        password: hashedPassword,
        verifiedAt: new Date(),
      },
    });
    return { message: "Successfully registered & activated" };
  };
}
