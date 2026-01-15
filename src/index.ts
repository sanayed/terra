/// <reference path="./types/express.d.ts" />
import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRouter from "./routes/auth";
import path from "node:path";
import { verifyUser } from "./routes/auth/utils";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

const urls: { [path: string]: { file: string; protected: boolean } } = {
  "/": { file: "index.html", protected: false },
  "/auth/login": { file: "login.html", protected: false },
  "/auth/signup": { file: "signup.html", protected: false },
  "/app": { file: "app.html", protected: true },
};

// app.use(authenticateToken);

// Simple logger middleware
// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.url}`, req.body);
//   next();
// });

// app.get("/", (req: Request, res: Response) => {
//   console.log(req.user);

//   res.send(
//     `<h1>Hello, World!</h1>
//     <a href='/authlogin'>Go to Login</a><br>
//     <a href='/auth/signup'>Go to Signup</a><br>
//     <a href='/app/'>Go to Dashboard</a>`
//   );
// });

// app.use("/auth", authRouter);

Object.entries(urls).forEach(([routePath, props]) => {
  if (props.protected)
    app.get(routePath, verifyUser, (_req: Request, res: Response) =>
      res.sendFile(props.file, { root: path.join(__dirname, "/views") })
    );
  else {
    app.get(routePath, (_req: Request, res: Response) =>
      res.sendFile(props.file, { root: path.join(__dirname, "/views") })
    );
  }
});

app.use("/api", authRouter);

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://${HOST}:${PORT}`);
});
