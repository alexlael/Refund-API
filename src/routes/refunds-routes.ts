import { Router } from "express";
import { RefundsController } from "@/controllers/refunds-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const refundsRoutes = Router();

const refundsController = new RefundsController();

refundsRoutes.post(
  "/",
  verifyUserAuthorization(["employee"]),
  // @ts-ignore
  refundsController.create
);

refundsRoutes.get(
  "/",
  verifyUserAuthorization(["manager"]),
  refundsController.index
);

refundsRoutes.get(
  "/:id",
  verifyUserAuthorization(["employee", "manager"]),
  // @ts-ignore
  refundsController.show
);

export { refundsRoutes };
