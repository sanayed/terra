import { Request, Response, Router } from "express";
import { verifyUser } from "../routes/auth/utils";
import path from "node:path";

export const serveStatic = (
  router: Router,
  route_path: string,
  file_path: string,
  isProtected: boolean = false
) => {
  return router.get(
    route_path,
    ...(isProtected ? [verifyUser] : []),
    (_req: Request, res: Response) =>
      res.sendFile(file_path, { root: path.join(__dirname, "/views") })
  );
};
