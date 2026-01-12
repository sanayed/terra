/// <reference path="./types/express.d.ts" />
import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRouter from "./routes/auth/index";
import dashboardRouter from "./routes/dashboard";
import { authenticateToken } from "./routes/auth/utils";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Server static files from the "public" directory
app.use(express.static("public"));
app.use(authenticateToken);

// Simple logger middleware
// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.url}`, req.body);
//   next();
// });

app.get("/", (req: Request, res: Response) => {
  console.log(req.user);

  res.send(
    `<h1>Hello, World!</h1>
    <a href='/login'>Go to Login</a><br>
    <a href='/auth/signup'>Go to Signup</a><br>
    <a href='/dashboard'>Go to Dashboard</a>`
  );
});

app.use("/auth", authRouter);
app.use("/", dashboardRouter);

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://${HOST}:${PORT}`);
});
