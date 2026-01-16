import express, { Request, Response, Router } from "express";
import { serveStatic } from "./utils";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { verifyUser } from "../routes/auth/utils";
import { getProject } from "../routes/projects/utils";

const router = Router();

serveStatic(router, "/", "index.html");
serveStatic(router, "/", "index.html");
serveStatic(router, "/auth/login", "login.html");
serveStatic(router, "/auth/signup", "signup.html");
serveStatic(router, "/projects", "projects/index.html", true);

router.get(
  /^\/projects\/([^/]+)(?:\/(.*))?$/,
  verifyUser,
  async (req: Request, res: Response) => {
    const id = req.params[0] as string;

    if (!id) return res.redirect("/projects");
    const project = (await getProject(id))[0];

    console.log(project);

    let file = (
      await readFile(path.join(__dirname, "views/projects/project_dash.html"))
    )
      .toString()
      .replace("$$PROJECT$$", `"${id}"`)
      .replace("$$PROJECT_INFO$$.NAME", project.name)
      .replace("$$PROJECT_INFO$$.DESCRIPTION", project.description)
      .replace("$$PROJECT_INFO$$", JSON.stringify(project));

    res.send(file);
  }
);
export default router;
