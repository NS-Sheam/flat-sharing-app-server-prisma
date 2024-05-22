import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { FlatRoutes } from "../modules/flat/flat.routes";
import { FlatShareRequestRoutes } from "../modules/flatShareRequest/flatShareRequest.routes";

const router = express.Router();

const routes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/flats",
    route: FlatRoutes,
  },
  {
    path: "/flat-share",
    route: FlatShareRequestRoutes,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
