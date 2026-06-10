import { Request, Response } from "express";
import { DriverService } from "./driver.service.js";
import { plainToInstance } from "class-transformer";
import { GetPickupHistoryDTO } from "./dto/getPickupHistory.dto.js";
import { GetDeliveryHistoryDTO } from "./dto/getDeliveryHistory.dto.js";
import { GetAvailableDeliveriesDto } from "./dto/getAvailableDeliveries.dto.js";
import { GetAvailablePickupsDto } from "./dto/getAvailablePickups.dto.js";

export class DriverController {
  constructor(private driverService: DriverService) {}

  getActiveRequest = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const result = await this.driverService.getActiveRequest(userId);
    res.status(200).send(result);
  };

  getAvailablePickups = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const query = plainToInstance(GetAvailablePickupsDto, req.query);
    const result = await this.driverService.getAvailablePickups(userId, query);
    res.status(200).send(result);
  };

  getAvailableDeliveries = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const query = plainToInstance(GetAvailableDeliveriesDto, req.query);
    const result = await this.driverService.getAvailableDeliveries(
      userId,
      query,
    );
    res.status(200).send(result);
  };

  getPickupHistory = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const query = plainToInstance(GetPickupHistoryDTO, req.query);
    const result = await this.driverService.getPickupHistory(userId, query);
    res.status(200).send(result);
  };

  getDeliveryHistory = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const query = plainToInstance(GetDeliveryHistoryDTO, req.query);
    const result = await this.driverService.getDeliveryHistory(userId, query);
    res.status(200).send(result);
  };

  assignPickup = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const pickupId = req.params.id;
    const result = await this.driverService.assignPickup(userId, pickupId);
    res.status(200).send(result);
  };

  assignDelivery = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const deliveryId = req.params.id;
    const result = await this.driverService.assignDelivery(userId, deliveryId);
    res.status(200).send(result);
  };

  finishPickup = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const pickupId = req.params.id;
    const result = await this.driverService.finishPickup(userId, pickupId);
    res.status(200).send(result);
  };

  finishDelivery = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const deliveryId = req.params.id;
    const result = await this.driverService.finishDelivery(userId, deliveryId);
    res.status(200).send(result);
  };

  cancelPickup = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const pickupId = req.params.id;
    const result = await this.driverService.cancelPickup(userId, pickupId);
    res.status(200).send(result);
  };

  cancelDelivery = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const deliveryId = req.params.id;
    const result = await this.driverService.cancelDelivery(userId, deliveryId);
    res.status(200).send(result);
  };
}
