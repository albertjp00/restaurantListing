import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

export interface IController {
  login(req: Request, res: Response , next : NextFunction): Promise<void>;

  register(req: Request, res: Response, next : NextFunction): Promise<void>;

  verifyOtp(req: Request, res: Response, next : NextFunction): Promise<void>;

  // resendOtp(req: Request, res: Response, next : NextFunction): Promise<void>;

  // forgotPassword(req: Request, res: Response, next : NextFunction): Promise<void>;

  // resetPassword(req: Request, res: Response, next : NextFunction): Promise<void>;

  addRestaurant(req: AuthRequest, res: Response, next : NextFunction): Promise<void>;

  getRestaurants(req: AuthRequest, res: Response, next : NextFunction): Promise<void>;

  deleteRestaurant(req: Request, res: Response, next : NextFunction): Promise<void>;

  updateRestaurant(req: Request, res: Response, next : NextFunction): Promise<void>;
}





import {
  AddRestaurantDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from "../dto/dto";

export interface IService {
  loginRequest(dto: LoginDto): Promise<{
    success: boolean;
    message?: string;
    token?: string;
  }>;

  registerRequest(dto: RegisterDto): Promise<{
    success: boolean;
    message: string;
  }>;

  verifyOtp(dto: VerifyOtpDto): Promise<{
    success: boolean;
    message: string;
  }>;

  resendOtp(email: string): Promise<{
    success: boolean;
    message?: string;
  }>;

  forgotPassword(email: string): Promise<{
    success: boolean;
    message?: string;
  }>;

  verifyResetPasswordOtp(dto: VerifyOtpDto): Promise<{
    success: boolean;
    message?: string;
  }>;

  resetPassword(dto: ResetPasswordDto): Promise<{
    success: boolean;
    message: string;
  }>;

  addRestaurant(dto: AddRestaurantDto): Promise<{
    success: boolean;
    message: string;
  }>;

  getRestaurants(
    userId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<any>; // You can replace `any` with a proper type later

  updateRestaurant(
    id: string,
    data: any
  ): Promise<{
    success: boolean;
    message?: string;
  }>;

  deleteRestaurant(id: string): Promise<{
    success: boolean;
    message?: string;
  }>;
}


export interface BasicResponse {
  success: boolean;
  message?: string;
}

export interface AuthResponse extends BasicResponse {
  token?: string;
}

export interface ImageResponse {
  images: any[]; // better: define proper Image DTO
  totalPages?: number;
}

export interface ImageOrder {
  id: string;
  order: number;
}







export interface IRestaurant {
  id: string;
  name: string;
  address: string;
  phone: number;
  email: string;
}

export interface IRestaurantResponse {
  restaurants: IRestaurant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface ICreateRestaurantDto {
  userId: string;
  name: string;
  address: string;
  phone: number;
  email: string;
}

export interface IRepository {
  findUser(email: string): Promise<IUser | null>;

  create(
    name: string,
    email: string,
    phone: number,
    password: string
  ): Promise<IUser>;

  findByName(name: string): Promise<IRestaurant | null>;

  changePassword(
    userId: string,
    hashedPassword: string
  ): Promise<IChangePasswordResponse>;

  createRestaurant(data: ICreateRestaurantDto): Promise<void>;

  getRestaurants(
    userId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<IRestaurantResponse>;

  updateRestaurant(
    id: string,
    data: Omit<IRestaurant, "id">
  ): Promise<void>;

  deleteRestaurant(id: string): Promise<void>;
}

export interface IUser {
  id: number;
  email: string;
  password: string;
  name : string;
  phone : number
}