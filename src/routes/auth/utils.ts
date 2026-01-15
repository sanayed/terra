import { Request, Response, NextFunction } from "express";
import { JwtPayload, sign, verify, VerifyCallback } from "jsonwebtoken";
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

export interface User extends RowDataPacket {
  id: string;
  email: string;
  username: string;
  fullname: string;
  password_hash: string;
  created_at: string;
  refresh_token: string;
}

export const findUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  const [rows] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

export const generateAccessToken = (user: Pick<User, "id" | "email">) => {
  return sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
};

export const generateRefreshToken = (user: Pick<User, "id" | "email">) => {
  return sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const createUser = async (
  username: string,
  email: string,
  hashedPwd: string
): Promise<void> => {
  await db.query(
    "INSERT INTO users (id, email, username, fullname, password_hash) VALUES (?, ?, ?, ?, ?)",
    [uuidv4(), email, username, username, hashedPwd]
  );
};

export const verifyRefresh = (
  token: string,
  callback?: VerifyCallback<JwtPayload | string>
) => {
  return verify(token, REFRESH_TOKEN_SECRET, callback);
};

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.access_token as string | undefined;

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });

  verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({
        success: false,
        message:
          err.name === "TokenExpiredError"
            ? "Error: expired token"
            : "Error verifying token!",
      });

    req.user = user;
    // Now the unauthenticated/unverified users are gone. Have to block /auth/login, auth/signup routes
    // so users wont see login/signup page when already logged in.
    if (req.path.startsWith("/auth/")) return res.redirect("/app/");

    next();
  });
};

export const makeAndSentTokens = (
  user: Pick<User, "id" | "email">,
  res: Response,
  responseMessage: string = "Authentication Success"
) => {
  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
  });
  res
    .cookie("access_token", accessToken, {
      maxAge: 30 * 60 * 1000,
      sameSite: "strict",
      httpOnly: true,
    })
    .cookie("refresh_token", refreshToken, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      httpOnly: true,
    })
    .json({
      success: true,
      message: responseMessage,
      data: {
        accessToken,
        refreshToken,
      },
    });
};
