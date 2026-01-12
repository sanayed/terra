import { Router, Request, Response } from "express";

const router: Router = Router();

router.get(
  "/dashboard",
  (req: Request & { userId?: string }, res: Response) => {
    res.send(`<h1>Welcome to your Dashboard!</h1> User ID: ${req.userId}`);
  }
);

export default router;
