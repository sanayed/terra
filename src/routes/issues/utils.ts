import { RowDataPacket } from "mysql2";
import db from "../../utils/db";
import { v4 as uuidV4 } from "uuid";

export interface Issue extends RowDataPacket {
  id: string;
  project_id: string;
  description: string;
  issue_type: "task" | "bug" | "story";
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  reporter_id: string;
  assignee_id: string | null;
  created_at: string;
  updated_at: string;
}

export const createIssue = async (
  issue: Omit<Issue, "id" | "status" | "created_at" | "updated_at">
) => {
  return await db.query<Issue[]>(
    `INSERT INTO issues (id, project_id, description, issue_type, status, priority, reporter_id, assignee_id)
     VALUES (?, ?, ?, ?, 'todo', ?, ?, ?)`,
    [
      uuidV4(),
      issue.project_id,
      issue.description,
      issue.issue_type,
      issue.priority,
      issue.reporter_id,
      issue.assignee_id,
    ]
  );
};
export const getIssues = (project_id: string) => {
  return db.query<Issue[]>(`SELECT * FROM issues WHERE project_id = ?`, [
    project_id,
  ]);
};
