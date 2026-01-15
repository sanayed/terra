import { RowDataPacket } from "mysql2";
import db from "../../utils/db";
import { NextFunction, Request, Response } from "express";

export interface Project extends RowDataPacket {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
}

export const getProjects = async (id: string) => {
  const [rows] = await db.query<Project[]>(
    `SELECT DISTINCT p.*, u.fullname AS owner_name FROM projects p JOIN users u ON u.id = p.created_by LEFT JOIN project_members pm ON pm.project_id = p.id WHERE p.created_by = ? OR pm.user_id = ?;`,
    [id, id]
  );
  return rows;
};

export const getMembers = async (pid: string) => {
  const [rows] = await db.query<Project[]>(
    `SELECT u.id, u.fullname, u.username, u.email, pm.role FROM project_members pm JOIN users u ON u.id = pm.user_id WHERE pm.project_id = ?;`,
    [pid]
  );
  return rows;
};

export const accessControl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO
};
