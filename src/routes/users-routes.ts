import { UsersController } from "@/controllers/users-controller";
import { Router } from "express";

const usersRoutes = Router();

const usersController = new UsersController()


usersRoutes.post("/", usersController.create);
// usersRoutes.get("/", usersController.index);


export { usersRoutes };