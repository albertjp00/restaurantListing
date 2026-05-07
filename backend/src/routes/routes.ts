import express from "express";
import { Controller } from "../controller/controller";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../utils/multer";
import { Repository } from "../repository/repository";
import { Service } from "../services/service";
import { API_ROUTES } from "./routeConstants";

const router = express.Router();

const repository = new Repository();
const service = new Service(repository);
const controller = new Controller(service);

router.post(API_ROUTES.AUTH.REGISTER, controller.register);

router.post(API_ROUTES.AUTH.LOGIN, controller.login);

router.post(API_ROUTES.AUTH.VERIFY_OTP, controller.verifyOtp);

router.post(API_ROUTES.AUTH.RESEND_OTP, controller.resendOtp);

router.post(API_ROUTES.AUTH.FORGOT_PASSWORD, controller.forgotPassword);

router.post(
  API_ROUTES.AUTH.VERIFY_RESET_PASSWORD_OTP,
  controller.verifyResetPasswordOtp,
);

router.post(API_ROUTES.AUTH.RESET_PASSWORD, controller.resetPassword);

router.post(
  API_ROUTES.RESTAURANT.ADD,
  authMiddleware,
  controller.addRestaurant,
);


router.get(
  API_ROUTES.RESTAURANT.GET_ALL,
  authMiddleware,
  controller.getRestaurants,
);


router.delete(
  API_ROUTES.RESTAURANT.DELETE,
  authMiddleware,
  controller.deleteRestaurant,
);


router.put(
  API_ROUTES.RESTAURANT.UPDATE,
  authMiddleware,
  controller.updateRestaurant,
);

export default router;
