import { RowDataPacket } from "mysql2";
import db from "../../utils/db";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidV4 } from "uuid";
import { INVITE_TOKEN_SECRET } from "../../constants";

export interface Project extends RowDataPacket {
  id: string;
  name: string;
  status: "active" | "rejected" | "postponded";
  description: string;
  created_by: string;
  created_at: string;
}

if (!INVITE_TOKEN_SECRET) {
  throw new Error("INVITE_TOKEN_SECRET is not defined");
}

export const getProjects = async (id: string) => {
  const [rows] = await db.query<Project[]>(
    `SELECT DISTINCT p.*, u.fullname AS owner_name FROM projects p JOIN users u ON u.id = p.created_by LEFT JOIN project_members pm ON pm.project_id = p.id WHERE p.created_by = ? OR pm.user_id = ? ORDER BY p.created_at DESC;`,
    [id, id]
  );
  return rows;
};

export const createProject = async (
  user_id: string,
  { name, description }: { name: string; description: string }
) => {
  const project_id = uuidV4();
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(
      `INSERT INTO projects (id, name, description, created_by)
       VALUES (?, ?, ?, ?)`,
      [project_id, name, description, user_id]
    );

    await conn.query(
      `INSERT INTO project_members (project_id, user_id, role)
       VALUES (?, ?, ?)`,
      [project_id, user_id, "admin"]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
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
