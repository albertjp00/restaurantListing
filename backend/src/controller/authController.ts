import {
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from "../dto/dto";

import { HttpStatus } from "../enums/httpStatus.enums";
import { IAuthController, IService } from "../interfaces.ts/interfaces";
import { NextFunction, Request, Response } from "express";

export class AuthController implements IAuthController{
  constructor(private _service: IService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: LoginDto = req.body;

      const result = await this._service.loginRequest(dto);

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: RegisterDto = req.body;

      const result = await this._service.registerRequest(dto);

      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };

  verifyOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto: VerifyOtpDto = req.body;

      const result = await this._service.verifyOtp(dto);

      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };

  resendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;

      const result = await this._service.resendOtp(email);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;

      const result = await this._service.forgotPassword(email);

      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };

  verifyResetPasswordOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto: VerifyOtpDto = {
        email: req.body.email,
        otp: req.body.otp,
      };

      const result = await this._service.verifyResetPasswordOtp(dto);

      if (result?.success) {
        res.status(HttpStatus.OK).json({ success: true });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: result?.message,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto: ResetPasswordDto = {
        email: req.body.email,
        newPassword: req.body.newPassword,
      };

      await this._service.resetPassword(dto);

      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}