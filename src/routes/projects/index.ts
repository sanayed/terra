import { Request, Response, Router } from "express";
import { createProject, getMembers, getProjects } from "./utils";
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

router.post("/project", async (req: Request, res: Response) => {
  const user = req.user as any;
  const projectData = req.body;
  console.log(projectData);

  try {
    await createProject(user.id, {
      name: projectData.name,
      description: projectData.description,
    });
    const projects = await getProjects(user.id);

    return res.json({
      success: true,
      data: {
        projects,
      },
    });
  } catch (e: any) {
    console.log(e);

    if (e.code == "ER_DUP_ENTRY") {
      return res.status(500).json({
        success: false,
        message: "Project with this name already exist.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unexpected server error",
    });
  }
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
