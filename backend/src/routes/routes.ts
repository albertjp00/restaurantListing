import express from "express";
import { Controller } from "../controller/controller";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../utils/multer";
import { Repository } from "../repository/repository";
import { Service } from "../services/service";



const router = express.Router();


const repository = new Repository()
const service = new Service(repository)
const controller = new Controller(service)




router.post("/register",  controller.register);

router.post("/login", controller.login);

router.post("/verifyOtp", controller.verifyOtp);

router.post("/resendOtp", controller.resendOtp);

router.post("/forgotPassword", controller.forgotPassword);

router.post("/verifyResetPasswordOtp", controller.verifyResetPasswordOtp);


router.post("/resetPassword", controller.resetPassword);

router.post("/restaurant",authMiddleware,controller.addRestaurant);

router.get("/restaurants", authMiddleware, controller.getRestaurants);


router.delete("/restaurant/:id", authMiddleware, controller.deleteRestaurant);

router.put("/restaurant/:id", authMiddleware, controller.updateRestaurant);

export default router;
