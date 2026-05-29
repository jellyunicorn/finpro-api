import { PrismaClient } from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
import { CloudinaryService } from "../cloudinary/cloudinary.service.js";
import { MailService } from "../mail/mail.service.js";

export class AddressService {
  constructor(private prisma: PrismaClient) {}

  getUserAddress = async (userid: number) => {
    const useraddress = await this.prisma.userAddress.findMany({
      where: { userId: userid, deletedAt: null },
      select: {
        id: true,
        address: true,
        city: true,
        postalCode: true,
        latitude: true,
        longitude: true,
        isPrimary: true,
        userId: true,
        label: true,
      },
    });

    if (!useraddress) {
      return { message: "no address is found" };
    }
    return { useraddress };
  };

  createAddress = async (
    userid: number,
    body: {
      address: string;
      city: string;
      postalCode: string;
      latitude: number;
      longitude: number;
      isPrimary: boolean;
      label: string;
    },
  ) => {
    if (body.isPrimary) {
      await this.prisma.userAddress.updateMany({
        where: { userId: userid, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const created = await this.prisma.userAddress.create({
      data: {
        ...body,
        userId: userid,
      },
    });

    return { created };
  };

  deleteAddress = async (selectedid: number, userid: number) => {
    const address = await this.prisma.userAddress.findUnique({
      where: { id: selectedid },
    });
    if (!address || address.deletedAt !== null || address.userId !== userid)
      throw new ApiError("No Address is found", 400);
    await this.prisma.userAddress.update({
      where: { id: selectedid },
      data: { deletedAt: new Date() },
    });
  };

  updateAddressDetail = async (
    userid: number,
    body: {
      id: number;
      address: string;
      city: string;
      postalCode: string;
      latitude: number;
      longitude: number;
      isPrimary: boolean;
      label: string;
      userId: number;
    },
  ) => {
    const existing = await this.prisma.userAddress.findFirst({
      where: { id: body.id, userId: userid, deletedAt: null },
    });

    if (!existing) {
      throw new Error("Address not found");
    }

    const updated = await this.prisma.userAddress.update({
      where: { id: body.id },
      data: {
        address: body.address,
        city: body.city,
        postalCode: body.postalCode,
        latitude: body.latitude,
        longitude: body.longitude,
        isPrimary: body.isPrimary,
        label: body.label,
      },
    });

    return { updated };
  };

  switchPrimaryAddress = async (userid: number, newprimary: number) => {
    await this.prisma.userAddress.updateMany({
      where: { userId: userid, isPrimary: true },
      data: { isPrimary: false },
    });
    const result = await this.prisma.userAddress.update({
      where: { id: newprimary },
      data: { isPrimary: true },
    });

    return { message: "new primary addres is :", result };
  };
}
