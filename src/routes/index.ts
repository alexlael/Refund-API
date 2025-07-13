import { usersRoutes } from "@/routes/users-routes";
import { Router } from "express";

const routes = Router();

//rotas publicas
routes.use("/users", usersRoutes);

export { routes };
