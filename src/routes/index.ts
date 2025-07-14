import { sessionsRoutes } from "@/routes/sessions-routes";
import { usersRoutes } from "@/routes/users-routes";
import { refundsRoutes } from "@/routes/refunds-routes";
import { Router } from "express";

const routes = Router();

//rotas publicas
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

//rotas privadas
routes.use("/refunds", refundsRoutes);

export { routes };
