import { hash } from "argon2";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
import {
  EXPIRED_REFRESH_TOKEN_JWT,
  EXPIRED_RESET_TOKEN_JWT,
} from "../auth/authConstants.js";
import { CloudinaryService } from "../cloudinary/cloudinary.service.js";
import { resetPasswordDTO } from "../dto/resetpassword.dto.js";
import { updateUserDTO } from "../dto/updateuser.dto.js";
import { MailService } from "../mail/mail.service.js";
import jwt from "jsonwebtoken";

export class UserService {
  constructor(
    private prisma: PrismaClient,
    private cloudinaryService: CloudinaryService,
    private mailService: MailService,
  ) {}

  getUserData = async (userid: number) => {
    const userdata = await this.prisma.user.findUnique({
      where: { id: userid },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        avatar: true,
        verifiedAt: true,
        provider: true,
        birthDate: true,
      },
    });
    return { userdata };
  };

  updateUser = async (
    userId: number,
    body: updateUserDTO,
    file?: Express.Multer.File,
  ) => {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new ApiError("User does not exists", 400);
    }

    let secure_url: string | undefined = undefined;

    if (file) {
      const result = await this.cloudinaryService.upload(file);
      secure_url = result.secure_url;
    }

    const parseBday = body.birthDate ? new Date(body.birthDate) : undefined;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: body.fullName,
        phone: body.phone,
        birthDate: parseBday,
        avatar: secure_url,
      },
    });
    return updatedUser;
  };

  resetPasswordEmail = async (body: resetPasswordDTO) => {
    const token = jwt.sign(
      { fullName: body.fullName, email: body.email },
      process.env.JWT_SECRET_RESET as string,
      { expiresIn: EXPIRED_RESET_TOKEN_JWT },
    );

    await this.mailService.sendMail({
      to: body.email,
      subject: "Reset Password Confirmation Email",
      templateName: "reset-password",
      context: {
        name: body.fullName,
        logoUrl: process.env.MAIL_LOGO_URL,
        resetUrl: `${process.env.BASE_FE_URL}/dashboard/reset?token=${token}`,
      },
    });
    return { message: "Email has been sent" };
  };

  verifyResetToken = async (token: string) => {
    let decoded: { fullName: string; email: string };

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_RESET!) as {
        fullName: string;
        email: string;
      };
    } catch (error) {
      throw new ApiError("Invalid or expired token", 400);
    }
    return { email: decoded.email };
  };

  changePassword = async (userId: number, newPass: string) => {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ApiError("This user does not exist", 400);
    }
    const hashedPassword = await hash(newPass);

    const updatedpass = await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
    return { message: "user password update successfull" };
  };
}
