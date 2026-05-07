import { AddRestaurantDto } from "../dto/dto";
import { IRestaurantController, IService } from "../interfaces.ts/interfaces";
import { AuthRequest } from "../middleware/authMiddleware";
import { NextFunction, Request, Response } from "express";

export class RestaurantController implements IRestaurantController {
  constructor(private _service: IService) {}

  addRestaurant = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const dto: AddRestaurantDto = {
        userId: req.user?.id as string,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
      };

      const result = await this._service.addRestaurant(dto);

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getRestaurants = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.user?.id;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const search = (req.query.search as string) || "";

      const result = await this._service.getRestaurants(
        id as string,
        page,
        limit,
        search,
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;

      await this._service.deleteRestaurant(id as string);

      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  updateRestaurant = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;

      const result = await this._service.updateRestaurant(
        id as string,
        req.body,
      );

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.message,
        });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
