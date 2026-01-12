import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRouter from "./routes/auth/index";
import dashboardRouter from "./routes/dashboard";
import { requireAuth } from "./routes/auth/utils";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.send("<h1>Hello, World!</h1>");
});

app.use("/auth", authRouter);
app.use("/", requireAuth, dashboardRouter);

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://${HOST}:${PORT}`);
});
