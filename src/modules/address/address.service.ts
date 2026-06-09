import { PrismaClient } from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";

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
        district: true,
        regency: true,
        village: true,
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
      regencyCode: string;
      districtCode: string;
      villageCode: string;
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
      regency: string;
      district: string;
      village: string;
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
        regencyCode: body.regency,
        districtCode: body.district,
        villageCode: body.village,
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

  getOutletAddresses = async () => {
    const outlets = await this.prisma.outlet.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        postalCode: true,
        latitude: true,
        longitude: true,
      },
    });

    return { outlets };
  };

  getRegency = async () => {
    const result = await this.prisma.regency.findMany({
      orderBy: { name: "asc" },
    });
    return result;
  };

  getDistrict = async (regcode: string) => {
    if (!regcode) {
      throw new ApiError("need regency code to complete data fetch", 400);
    }

    const checkcode = await this.prisma.district.findFirst({
      where: { regencyCode: regcode },
    });

    if (!checkcode) {
      throw new ApiError("REGENCY CODE INVALID", 400);
    }

    const result = await this.prisma.district.findMany({
      where: { regencyCode: regcode },
      orderBy: { name: "asc" },
    });
    return result;
  };
  getVillage = async (discode: string) => {
    if (!discode) {
      throw new ApiError("need district code to complete data fetch", 400);
    }

    const checkcode = await this.prisma.village.findFirst({
      where: { districtCode: discode },
    });

    if (!checkcode) {
      throw new ApiError("DISTRICT CODE INVALID", 400);
    }

    const result = await this.prisma.village.findMany({
      where: { districtCode: discode },
      orderBy: { name: "asc" },
    });
    return result;
  };
}
