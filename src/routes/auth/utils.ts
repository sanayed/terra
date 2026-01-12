import { Request, Response, NextFunction } from "express";
import db from "../../utils/db";
import { v4 as uuidv4 } from "uuid";
import { RowDataPacket } from "mysql2/promise";

interface User extends RowDataPacket {
  id: string;
  email: string;
  password_hash: string;
}

interface Session extends RowDataPacket {
  id: string;
  user_id: string;
  expires_at: Date;
  is_revoked: boolean;
}

interface SessionResponse {
  id: string;
  expiresAt: Date;
}

export const findUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  const [rows] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

export const createSession = async (
  userId: string
): Promise<SessionResponse | null> => {
  const session_id = uuidv4();
  // Set expiration to 7 days
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  try {
    await db.query(
      "INSERT INTO sessions (id,user_id,expires_at) VALUES (?, ?, ?)",
      [session_id, userId, expiresAt]
    );
    return { id: session_id, expiresAt };
  } catch (err) {
    console.error("Error creating session:", (err as Error).message);
    return null;
  }
};

export const createUser = async (
  name: string,
  email: string,
  hashedPwd: string
): Promise<void> => {
  await db.query(
    "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
    [uuidv4(), name, email, hashedPwd]
  );
};

export const revokeSession = async (sessionId: string): Promise<void> => {
  await db.query(`UPDATE sessions SET is_revoked = TRUE WHERE id = ?`, [
    sessionId,
  ]);
};

// Auth check middleware
export const requireAuth = async (
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction
): Promise<void> => {
  const sid = req.cookies?.sid;
  console.log(req.cookies);

  if (!sid) {
    res
      .status(401)
      .send(
        "<h1>Please <a href='/auth/login/'>log in</a> to access this page.</h1>"
      );
    return;
  }

  const [rows] = await db.query<Session[]>(
    `
    SELECT user_id
    FROM sessions
    WHERE id = ?
      AND is_revoked = FALSE
      AND expires_at > NOW()
    `,
    [sid]
  );

  if (rows.length === 0) {
    res
      .status(401)
      .send(
        "<h1>Please <a href='/auth/login/'>log in</a> to access this page.</h1>"
      );
    return;
  }

  req.userId = rows[0]!.user_id;
  next();
};
