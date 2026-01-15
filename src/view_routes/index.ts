import express, { Request, Response, Router } from "express";
import { serveStatic } from "./utils";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { verifyUser } from "../routes/auth/utils";

const router = Router();

serveStatic(router, "/", "index.html");
serveStatic(router, "/", "index.html");
serveStatic(router, "/auth/login", "login.html");
serveStatic(router, "/auth/signup", "signup.html");
serveStatic(router, "/projects", "projects/index.html", true);

router.get("/projects/:id", verifyUser, async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) return res.redirect("/projects");
  let file = (
    await readFile(path.join(__dirname, "views/projects/project_dash.html"))
  )
    .toString()
    .replace("$$PROJECT$$", `"${id}"`);

  res.send(file);
});

export default router;
