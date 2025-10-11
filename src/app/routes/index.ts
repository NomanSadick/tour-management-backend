import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { DivisionRoutes } from "../modules/division/division.route";
import { TourRoutes } from "../modules/tour/tour.route";

export const router = Router();
const moduleRoutes = [
    {
        path: '/users',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
        {
        path: "/division",
        route: DivisionRoutes
    },
        {
        path: "/tour",
        route: TourRoutes
    },
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})