import { authRouter } from "@/modules/auth/auth-route";
import { Router } from "express";
import { userSafeRouter } from "@/modules/user/user-route";
import { ticketRouter } from "@/modules/ticket/ticket-route";
import { assetRouter } from "@/modules/asset/asset-route";

const router: Router = Router()

type Route = {
    path: string,
    route: Router
}

const routeModules: Route[] = [
    {
        path: '/auth',
        route: authRouter
    },
    {
        path: '/user',
        route: userSafeRouter
    },
    {
        path: '/tickets',
        route: ticketRouter
    },
    {
        path: '/assets',
        route: assetRouter
    }
]

routeModules.forEach((route) => {
    router.use(route.path, route.route)
})

export default router
