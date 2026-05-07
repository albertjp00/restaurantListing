import { Repository } from "../repository/repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { generateOtp } from "../utils/otp";
import { sendOtp } from "../utils/sendOtp";
import { otpStore } from "../utils/otpStore";
import {
  AddRestaurantDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from "../dto/dto";
import { IRepository, IService, LoginResponse, RegisterResponse, ServiceResponse, VerifyResponse } from "../interfaces.ts/interfaces";
import { HttpStatus } from "../enums/httpStatus.enums";

export interface ImageOrder {
  id: string;
  order: number;
}

export class Service implements IService {
  constructor(private _repository : IRepository) {};



loginRequest = async (dto: LoginDto): Promise<LoginResponse> => {
  const { email, password } = dto;

  const user = await this._repository.findUser(email);

  if (!user) {
    return {
      success: false,
      message: "Invalid email",
      statusCode: HttpStatus.NOT_FOUND,
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return {
      success: false,
      message: "Incorrect password",
      statusCode: HttpStatus.UNAUTHORIZED,
    };
  }

  const accessToken = jwt.sign(
    { id: user.id },
    process.env.secret_key!,
    { expiresIn: "1h" }
  );

  return {
    success: true,
    message: "Login successful",
    statusCode: HttpStatus.OK,
    token: accessToken ,
  };
};

registerRequest = async (dto: RegisterDto): Promise<RegisterResponse> => {
  const { name, phone, email, password } = dto;

  const existingUser = await this._repository.findUser(email);

  if (existingUser) {
    return {
      success: false,
      message: "User already exists",
      statusCode: HttpStatus.OK,
    };
  }

  const otp = generateOtp();

  otpStore.set(email, {
    name,
    email,
    password,
    phone,
    otp,
    expiresAt: Date.now() + 60 * 1000,
  });

  await sendOtp(email, otp);
  console.log("otp",otp);
  

  return {
    success: true,
    message: "OTP sent to email",
    statusCode: HttpStatus.OK,
  };
};


verifyOtp = async (dto: VerifyOtpDto): Promise<VerifyResponse> => {
  const { otp, email } = dto;

  const storedData = otpStore.get(email);

  if (!storedData) {
    return {
      success: false,
      message: "OTP not found",
      statusCode: HttpStatus.NOT_FOUND,
    };
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email);

    return {
      success: false,
      message: "OTP expired",
      statusCode: HttpStatus.BAD_REQUEST,
    };
  }

  if (storedData.otp !== otp) {
    return {
      success: false,
      message: "Invalid OTP",
      statusCode: HttpStatus.BAD_REQUEST,
    };
  }

  const hashedPassword = await bcrypt.hash(storedData.password, 10);

  await this._repository.create(
    storedData.name,
    email,
    storedData.phone,
    hashedPassword,
  );

  otpStore.delete(email);

  return {
    success: true,
    message: "Registration successful",
    statusCode: HttpStatus.CREATED,
  };
};



  resendOtp = async (email: string) => {
    try {
      const otp = generateOtp();

      const storedData = otpStore.get(email);
      console.log("resend otp",  otp);

      if (!storedData) {
        return { success: false };
      }

      const defaultEmail = email;
      await sendOtp(defaultEmail, otp);

      otpStore.set(email, {
        ...storedData,
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });
      return { success: true, message: "Otp send" };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Login failed" };
    }
  };



  forgotPassword = async (email: string): Promise<ServiceResponse> => {
  const user = await this._repository.findUser(email);

  if (!user) {
    return {
      success: false,
      message: "Invalid email",
      statusCode: HttpStatus.NOT_FOUND,
    };
  }

  const otp = generateOtp();
  console.log("forgot password otp",otp);
  

  otpStore.set(email, {
    name: user.name,
    phone: user.phone,
    password: user.password,
    email,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  await sendOtp(email, otp);

  return {
    success: true,
    message: "OTP sent to email",
    statusCode: HttpStatus.OK,
  };
};



  verifyResetPasswordOtp = async (dto: VerifyOtpDto) => {
    try {
      const { otp, email } = dto;
      const storedData = otpStore.get(email);

      if (!storedData) {
        return { success: false, message: "OTP NOT FOUND" };
      }

      if (Date.now() > storedData.expiresAt) {
        otpStore.delete(email);
        return { success: false, message: "OTP EXPIRED" };
      }

      if (storedData.otp !== otp) {
        return { success: false, message: "INVALID OTP" };
      }

      return { success: true, message: "otp verified" };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Something went wrong" };
    }
  };

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const { email, newPassword } = dto;
      const user = await this._repository.findUser(email);
      if (!user) {
        return { success: false, message: "USER NOT FOUND" };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this._repository.changePassword(user.id.toString(), hashedPassword);

      return { success: true, message: "PASSWORD CHANGED" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "RESET_FAILED" };
    }
  }

  addRestaurant = async (dto: AddRestaurantDto) => {
    try {
      const { userId, name, address, phone, email } = dto;

      const exists = await this._repository.findByName(name);

      if (exists) {
        return { success: false, message: "Restaurant already exists" };
      }

      await this._repository.createRestaurant({
        userId,
        name,
        address,
        phone,
        email,
      });

      return { success: true, message: "Restaurant added successfully" };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Failed to add restaurant" };
    }
  };

  getRestaurants = async (
    userId: string,
    page: number,
    limit: number,
    search: string,
  ) => {
    try {
      return await this._repository.getRestaurants(userId, page, limit, search);
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Failed to fetch restaurants",
      };
    }
  };

updateRestaurant = async (id: string, data: any) => {
  try {

    // ✅ ONLY check name if it exists in request
    if (data.name) {
      const exists = await this._repository.findByName(data.name);

      console.log(exists , id);
      

      if (exists && exists.id.toString() !== id) {
        return { success: false, message: "Restaurant already exists" };
      }
    }

    const updated = await this._repository.updateRestaurant(id, data);

    if (!updated) {
      return { success: false, message: "Restaurant not found" };
    }

    return { success: true, message: "Updated successfully" };

  } catch (error) {
    console.log(error);
    return { success: false, message: "Update failed" };
  }
};

  deleteRestaurant = async (id: string) => {
    try {
      await this._repository.deleteRestaurant(id);
      return { success: true, message: "Deleted successfully" };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Something went wrong" };
    }
  };
}
