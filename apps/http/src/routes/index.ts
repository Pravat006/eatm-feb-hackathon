import { authRouter } from "@/modules/auth/auth-route";
import { Router } from "express";
import { userSafeRouter } from "@/modules/user/user-route";
import { ticketRouter } from "@/modules/ticket/ticket-route";
import { assetRouter } from "@/modules/asset/asset-route";
import { aiRouter } from "@/modules/ai/ai-route";
import { campusRouter } from "@/modules/campus/campus-route";

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
    },
    {
        path: '/ai',
        route: aiRouter
    },
    {
        path: '/campus',
        route: campusRouter
    }
]

routeModules.forEach((route) => {
    router.use(route.path, route.route)
})

export default router
