import { Request, Response, Router } from "express";
import { verifyUser } from "../auth/utils";
import { createIssue, getIssues } from "./utils";

const router = Router();

router.use(verifyUser);

router.post("/issues", async (req: Request, res: Response) => {
  const user = req.user as any;
  const projectData = req.body;

  try {
    await createIssue({
      project_id: projectData.project_id,
      description: projectData.description,
      issue_type: projectData.type || "task",
      priority: projectData.priority || "medium",
      reporter_id: user.id,
      assignee_id:
        !projectData.assignee_id || projectData.assignee_id == "none"
          ? null
          : projectData.assignee_id,
    });
    const issues = await getIssues(projectData.project_id);

    return res.json({
      success: true,
      data: {
        issues,
      },
    });
  } catch (e: any) {
    console.log(e);

    return res.status(500).json({
      success: false,
      message: "Unexpected server error",
    });
  }
});

export default router;
