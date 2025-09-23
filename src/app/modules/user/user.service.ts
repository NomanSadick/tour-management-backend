import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from 'bcryptjs';
import httpStatus from "http-status-codes";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new AppError( httpStatus.BAD_REQUEST, 'User already exists');
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUNDS));
   

    const authProvider : IAuthProvider = {
      provider: 'credentials',
      providerId: email as string
    }

    const user = await User.create({
        
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })

    return user;

}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

  const ifUserExist = await User.findById(userId);
  if(!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }


  if (payload.role) {
    if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not allowed to change role');
    }
    if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not allowed to change role to super admin');
  }
}
  if(payload.isActive || payload.isDeleted || payload.isVerified){
     if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not allowed to change role');
    }
  }

  if(payload.password){
    payload.password = await bcryptjs.hash(payload.password as string, Number(envVars.BCRYPT_SALT_ROUNDS));
  }
  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
  return newUpdatedUser;
}

const getAllUsers = async () => {
  const users = await User.find();

  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
        total: totalUsers
    }
  };
}

export const UserService = {
    createUser,
    getAllUsers,
    updateUser
}
