/// <reference path="./types/express.d.ts" />
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRouter from "./routes/auth";
import viewRouter from "./view_routes";
import projectsRouter from "./routes/projects";
import { HOST, PORT } from "./constants";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Simple logger middleware
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`, req.body);
  next();
});

app.use("/", viewRouter);
app.use("/api", authRouter, projectsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port http://${HOST}:${PORT}`);
});
