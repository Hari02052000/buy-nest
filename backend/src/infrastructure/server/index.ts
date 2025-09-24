import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

import router from "@/presentation/routes";
import { handleError } from "@/presentation/middleware/error.middleware";
import { env } from "@/infrastructure/config/environment";
import { setupSwagger } from "@/presentation/swager";

export const createServer = () => {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: [env.frontend_url ,"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());
  app.get('/api/health',(req,res,next)=>res.status(200).send("okay"))
  app.use("/api", router);
  app.use(handleError);
  setupSwagger(app)
  return app;
};
