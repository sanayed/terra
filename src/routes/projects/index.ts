import { Request, Response, Router } from "express";
import { getMembers, getProjects } from "./utils";
import { verifyUser } from "../auth/utils";

const router = Router();

router.use(verifyUser);

router.get("/projects", async (req: Request, res: Response) => {
  const user = req.user as any;
  const projects = await getProjects(user.id);

  return res.json({
    success: true,
    data: {
      projects,
    },
  });
});

router.get("/project/:project/members", async (req: Request, res: Response) => {
  console.log(req.query);
  const pid = req.params.project as string;
  const { user_id } = req?.user as any;

  const members = await getMembers(pid);

  return res.json({
    success: true,
    data: {
      members,
    },
  });
});

export default router;
