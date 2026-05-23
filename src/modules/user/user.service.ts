import { PrismaClient } from "../../../generated/prisma/client.js";

export class UserService {
  constructor(private prisma: PrismaClient) {}

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
      },
    });
    return { userdata };
  };
}
