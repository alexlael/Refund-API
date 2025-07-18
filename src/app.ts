import "express-async-errors" 
import { errorHandling } from "@/middlewares/error-handling";
import { routes } from "@/routes/index";
import express from "express";
import uploadConfig from "@/configs/upload";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use(errorHandling);

export { app };
