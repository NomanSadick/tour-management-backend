import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    USER = "USER",
    ADMIN = "ADMIN",
    GUIDE = "GUIDE"
}

export interface IAuthProvider {
    provider: string;
    providerId: string;
}

export enum isActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: isActive;
    isActive?: string;
    isVerified?: string;
    role: Role;
    auths: IAuthProvider[];
    bookings?: Types.ObjectId[]; // References to Booking documents
    guides?: Types.ObjectId[]; // References to Guide documents
}