import { Request, Response } from "express";
import { OrderServices } from "./order.service.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { plainToInstance } from "class-transformer";
import { CreateOrderDTO } from "./dto/order.dto.js";

export class OrderController {
  constructor(private orderService: OrderServices) {}

  getOrders = async (req: Request, res: Response) => {
    const id = res.locals.user.id;
    const searchQuery = req.query.search as string | undefined;
    const monthQuery = Number(req.query.month) || 0;
    const dateQuery = Number(req.query.date) || 0;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const result = await this.orderService.getOrders(
      id,
      searchQuery,
      monthQuery,
      dateQuery,
      page,
      limit,
    );
    res.status(200).send(result);
  };
  addNewOrder = async (req: Request, res: Response) => {
    const id = res.locals.user.id;
    const body = plainToInstance(CreateOrderDTO, req.body);
    const result = await this.orderService.addNewOrder(body, id);
    res.status(201).send(result);
  };
  getOrderItems = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const orderId = req.params.orderid;
    const result = await this.orderService.getOrderItems(orderId, userId);
    res.status(200).send(result);
  };
  getOrderItemsTotal = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const orderId = req.params.orderid;
    const result = await this.orderService.getOrderItemsTotal(orderId, userId);
    res.status(200).send(result);
  };
  getOrderDetail = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const orderId = req.params.orderid;
    const result = await this.orderService.getOrderDetail(orderId, userId);
    res.status(200).send(result);
  };
  confirmOrder = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const orderId = req.params.orderid;
    const result = await this.orderService.confirmOrder(orderId, userId);
    res.status(200).send(result);
  };
}
