import { UserController } from "./user.controller";
import { Router } from "express";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";



const router = Router();



router.post("/register", validateRequest(createUserZodSchema), UserController.createUser);
router.get("/all-users", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), UserController.getAllUsers);
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserController.updateUser);
export const UserRoutes = router;
