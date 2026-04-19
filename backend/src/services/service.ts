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
import { IRepository, IService } from "../interfaces.ts/interfaces";

export interface ImageOrder {
  id: string;
  order: number;
}

export class Service implements IService {
  constructor(private _repository : IRepository) {};



  loginRequest = async (dto: LoginDto) => {
    try {
      const { email, password } = dto;
      const user = await this._repository.findUser(email);

      if (!user) {
        return { success: false, message: "Invalid email" };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { success: false, message: "Incorrect Password" };
      }
      // const id = user._id.toString()

      const accessToken = jwt.sign({ id: user.id }, process.env.secret_key!, {
        expiresIn: "1h",
      });

      return { success: true, token: accessToken };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Login failed" };
    }
  };

  registerRequest = async (dto: RegisterDto) => {
    try {
      const { name, phone, email, password } = dto;
      const user = await this._repository.findUser(email);
      if (user) {
        return { success: false, message: "User Exists" };
      }

      const otp = generateOtp();
      const defaultEmail = "albertjpaul@gmail.com";
      await sendOtp(defaultEmail, otp);

      otpStore.set(email, {
        name,
        email,
        password,
        phone,
        otp,
        expiresAt: Date.now() + 60 * 1000,
      });

      console.log("register request ", otpStore);

      return { success: true, message: "OTP SEND to MAIL" };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Registration failed" };
    }
  };

  verifyOtp = async (dto: VerifyOtpDto) => {
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

      const hashedPassword = await bcrypt.hash(storedData.password, 10);

      const result = await this._repository.create(
        storedData.name,
        email,
        storedData.phone,
        hashedPassword,
      );

      return { success: true, message: "Registration Succesfull" };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Login failed" };
    }
  };

  resendOtp = async (email: string) => {
    try {
      const otp = generateOtp();

      const storedData = otpStore.get(email);
      console.log("storedData", storedData);

      if (!storedData) {
        return { success: false };
      }

      const defaultEmail = "albertjpaul@gmail.com";
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

  forgotPassword = async (email: string) => {
    try {
      const user = await this._repository.findUser(email);
      if (!user) {
        return { success: false, message: "Invalid Email" };
      }

      const otp = generateOtp();

      otpStore.set(email, {
        name: user.name,
        phone: user.phone,
        password: user.password,
        email: email,
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      const defaultEmail = "albertjpaul@gmail.com";
      await sendOtp(defaultEmail, otp);

      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Login failed" };
    }
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
