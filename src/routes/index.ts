import { sessionsRoutes } from "@/routes/sessions-routes";
import { usersRoutes } from "@/routes/users-routes";
import { refundsRoutes } from "@/routes/refunds-routes";
import { ensureAutheticated } from "@/middlewares/ensure-autheticated";
import { Router } from "express";

const routes = Router();

//rotas publicas
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

//rotas privadas
routes.use(ensureAutheticated); // Passará por esse middleware antes de acessar as rotas abaixo
routes.use("/refunds", refundsRoutes);

export { routes };
