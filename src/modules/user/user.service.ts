import { PrismaClient } from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
import { CloudinaryService } from "../cloudinary/cloudinary.service.js";
import { updateUserDTO } from "../dto/updateuser.dto.js";

export class UserService {
  constructor(
    private prisma: PrismaClient,
    private cloudinaryService: CloudinaryService,
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
}
