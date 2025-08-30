import { UserController } from './user.controller';
import { Router } from "express";

const router = Router();

router.post("/register", UserController.createUser);
router.get("/all-users", UserController.getAllUsers)
export const UserRoutes = router;