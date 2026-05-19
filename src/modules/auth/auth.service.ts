import { hash, verify } from "argon2";
import axios from "axios";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "../../../generated/prisma/client.js";
import { RegisterDTO } from "./dto/auth.dto.js";
import { ApiError } from "../../utils/api-error.js";
import { MailService } from "../mail/mail.service.js";

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
    await this.prisma.user.create({
      data: {
        fullName: body.fullName,
        email: trimemail,
      },
    });

    await this.mailService.sendMail({
      to: body.email,
      subject: "Welcome to the Claundry!",
      templateName: "welcome",
      context: { name: body.fullName, logoUrl: process.env.MAIL_LOGO_URL },
    });
    return { message: "User registration success" };
  };
}
