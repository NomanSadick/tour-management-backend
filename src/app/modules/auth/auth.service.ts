import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });


  if (!isUserExist) {
    throw new AppError("Email already exists", httpStatus.BAD_REQUEST, "");
  }

  const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string);
    if (!isPasswordMatch) {
      throw new AppError("Password is incorrect", httpStatus.UNAUTHORIZED, "");
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRE);
    // const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "1d" });

    return {
        accessToken
    }
};

export const AuthService = {
  credentialsLogin,
};
