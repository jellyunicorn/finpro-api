import { Request, Response } from "express";
import { DriverService } from "./driver.service.js";
import { plainToInstance } from "class-transformer";
import { GetPickupHistoryDTO } from "./dto/getPickupHistory.dto.js";
import { GetDeliveryHistoryDTO } from "./dto/getDeliveryHistory.dto.js";

export class DriverController {
  constructor(private driverService: DriverService) {}

  getActiveRequest = async (req: Request, res: Response) => {
    const id = Number(res.locals.user.id);
    const result = await this.driverService.getActiveRequest(id);
    res.status(200).send(result);
  };

  getPickupHistory = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const query = plainToInstance(GetPickupHistoryDTO, {
      ...req.query,
      userId,
    });
    const result = await this.driverService.getPickupHistory(query);
    res.status(200).send(result);
  };

  getDeliveryHistory = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const query = plainToInstance(GetDeliveryHistoryDTO, {
      ...req.query,
      userId,
    });
    const result = await this.driverService.getDeliveryHistory(query);
    res.status(200).send(result);
  };

  assignPickup = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const pickupId = req.body.pickupId;
    const result = await this.driverService.assignPickup(userId, pickupId);
    res.status(200).send(result);
  };

  assignDelivery = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const deliveryId = req.body.deliveryId;
    const result = await this.driverService.assignDelivery(userId, deliveryId);
    res.status(200).send(result);
  };
}
