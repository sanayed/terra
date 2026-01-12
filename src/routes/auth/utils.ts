import { Request, Response, NextFunction } from "express";
import { sign, SignOptions, verify } from "jsonwebtoken";
import db from "../../utils/db";
import { v4 as uuidv4 } from "uuid";
import { RowDataPacket } from "mysql2/promise";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined");
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is not defined");
}

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

// Auth check middleware @deprecated
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

export const updateRefreshToken = async (
  userId: string,
  refreshToken: string
) => {
  await db.query(`UPDATE users SET refresh_token = ? WHERE id = ?`, [
    refreshToken,
    userId,
  ]);
};

// JWT Things
export const generateAccessToken = (user: User) => {
  return sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (user: User) => {
  return sign({ id: user.id, email: user.email }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// Verification middleware
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Allow / to everyone
  if (req.path === "/") return next();

  const token = req.cookies?.accessToken as string | undefined;

  if (!token) {
    // Allow unauthenticated access to login/signup pages
    if (req.path.startsWith("/auth/")) return next();

    return res.status(401).send(
      `<h1>Unauthorized, redirecting to <a href='/auth/login'>login</a> in 3s</h1>
        <script>
        setTimeout(() => window.location.href = '/auth/login', 3000);
        </script>
        `
    );
  }

  verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    console.log("Verification is success!!");

    req.user = user;
    // Now the unauthenticated/unverified users are gone. Have to block /auth/login, auth/signup routes
    // so users wont see login/signup page when already logged in.
    if (req.path.startsWith("/auth/")) return res.redirect("/dashboard");

    next();
  });
};
