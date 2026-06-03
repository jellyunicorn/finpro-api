import { Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";
import { AddressService } from "./address.service.js";

export class AddressController {
  constructor(private addressService: AddressService) {}

  getUserAddress = async (req: Request, res: Response) => {
    const userid = res.locals.user.id;
    const result = await this.addressService.getUserAddress(userid);
    res.status(200).send(result);
  };
  getOutletAddresses = async (req: Request, res: Response) => {
    const result = await this.addressService.getOutletAddresses();
    res.status(200).send(result);
  };
  createAddress = async (req: Request, res: Response) => {
    const userid = res.locals.user.id;
    const result = await this.addressService.createAddress(userid, req.body);
    res.status(201).send(result);
  };
  deleteAddress = async (req: Request, res: Response) => {
    const selectedid = req.body.id;
    const userid = res.locals.user.id;

    const result = await this.addressService.deleteAddress(selectedid, userid);
    res.status(201).send(result);
  };

  updateAddressDetail = async (req: Request, res: Response) => {
    const userid = res.locals.user.id;
    const result = await this.addressService.updateAddressDetail(
      userid,
      req.body,
    );
    res.status(200).send(result);
  };

  switchPrimaryAddress = async (req: Request, res: Response) => {
    const userid = res.locals.user.id;
    const newprimary = req.body.id;
    console.log(newprimary);
    const result = await this.addressService.switchPrimaryAddress(
      userid,
      newprimary,
    );
    res.status(200).send(result);
  };
}
