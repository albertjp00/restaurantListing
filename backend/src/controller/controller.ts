import {
  AddRestaurantDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from "../dto/dto";
import { HttpStatus } from "../enums/httpStatus.enums";
import { IController, IService } from "../interfaces.ts/interfaces";
import { AuthRequest } from "../middleware/authMiddleware";
import { NextFunction, Request, Response } from "express";
import { Service } from "../services/service";

export class Controller implements IController {
  constructor(private _service: IService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: LoginDto = {
        email: req.body.email,
        password: req.body.password,
      };

      const result = await this._service.loginRequest(dto);
      if (!result) return;
      if (result.success) {
        res.status(HttpStatus.OK).json({ success: true, token: result.token });
        return;
      }

      res.json({ success: false, message: result.message });
    } catch (error) {
      next(error);
    }
  };

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto: RegisterDto = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
      };

      const result = await this._service.registerRequest(dto);

      console.log("register", result);

      if (!result?.success) {
        res.json({ success: false, message: result?.message });
      }

      res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      next(error);
      res.status(500).json({
        success: false,
        message: "Registration failed",
      });
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: VerifyOtpDto = {
        email: req.body.email,
        otp: req.body.otp,
      };

      console.log("verify ", dto);

      const result = await this._service.verifyOtp(dto);
      console.log("result ", result);

      if (result?.success) {
        res.status(HttpStatus.OK).json({ success: true });
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: result?.message });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const result = await this._service.resendOtp(email);
      console.log("result ", result);

      if (result?.success) {
        res.status(HttpStatus.OK).json({ success: true });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const result = await this._service.forgotPassword(email);
      console.log("result ", result);

      if (result?.success) {
        res.status(HttpStatus.OK).json({ success: true });
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: result?.message });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  verifyResetPasswordOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const dto: VerifyOtpDto = {
        email: req.body.email,
        otp: req.body.otp,
      };

      console.log("reset password ", dto);

      const result = await this._service.verifyResetPasswordOtp(dto);
      console.log("result ", result);

      if (result?.success) {
        res.status(HttpStatus.OK).json({ success: true });
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: result?.message });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: ResetPasswordDto = {
        email: req.body.email,
        newPassword: req.body.newPassword,
      };

      const result = await this._service.resetPassword(dto);
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  addRestaurant = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.log(req.user?.id);

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
      console.log(error);
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
      console.log(error);
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

      this._service.deleteRestaurant(id as string);

      res.json({ success: true });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  updateRestaurant = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const id = req.params.id;

      const result = await this._service.updateRestaurant(
        id as string,
        req.body,
      );

      console.log(result);
      

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.message,
        });
        return;
      }

      res.status(200).json(result);
      return;
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
      return;
    }
  };
}
