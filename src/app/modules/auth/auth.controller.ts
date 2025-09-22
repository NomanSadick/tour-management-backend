/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import httpStatus from "http-status-codes";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
  

    const loggedInfo = await AuthService.credentialsLogin(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Logged in successfully",
      data: loggedInfo,
    });
  }
);

export const AuthControllers = {
    credentialsLogin
}