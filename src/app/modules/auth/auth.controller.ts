/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
  

    const loggedInfo = await AuthService.credentialsLogin(req.body);

  

    // res.cookie("refreshToken", loggedInfo.refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    // });
    setAuthCookie(res, loggedInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Logged in successfully",
      data: loggedInfo,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received from cookies");
    }
  

    const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string);

    //   res.cookie("accessToken", tokenInfo.accessToken, {
    //   httpOnly: true,
    //   secure: true,
    // });

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New access token generated successfully",
      data: tokenInfo,
    });
  }
);


const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   
    res.clearCookie("accessToken", { httpOnly: true, secure: false, sameSite: "lax" });
    res.clearCookie("refreshToken", { httpOnly: true, secure: false });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Logged out successfully",
      data: null,
    });
  }
);


const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
  await AuthService.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);
    

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User password reset successfully",
      data: null,
    });
  }
);

const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? req.query.state as string : "" ;
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    console.log("user from google callback", user);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    const tokenInfo = createUserTokens(user);

    setAuthCookie(res, tokenInfo);
    
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`); // Redirect to the frontend with tokens in cookies
  }
);



export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}