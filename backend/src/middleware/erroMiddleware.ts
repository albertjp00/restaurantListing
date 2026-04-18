import { NextFunction  , Request , Response} from "express";


export const errorMiddleware = (
    err : any,
    req : Request,
    res : Response,
    next : NextFunction
)=>{
    console.log("Error" ,err);

    const statusCode = err.statusCode || 500

    res.status(statusCode).json({
        success : false,
        message : err.message || "Internal server error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    })


}