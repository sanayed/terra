import { Router, Request, Response } from "express";
import { AuthUser } from "../types/types";

const router: Router = Router();

router.get("/dashboard", (req: Request, res: Response) => {
  const user = req.user as { id: string; email: string };
  res.send(`<h1>Welcome to your Dashboard!</h1> User ID: ${user.id}`);
});

export default router;
