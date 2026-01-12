import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  findUserByEmail,
  createSession,
  createUser,
  revokeSession,
  generateAccessToken,
  generateRefreshToken,
  updateRefreshToken,
} from "./utils";
import { loginTemplate, signupTemplate } from "./templates";

const secure = process.env.NODE_ENV === "production";
const router: Router = Router();

router.get("/login", (_req: Request, res: Response) => {
  res.send(loginTemplate());
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const user = await findUserByEmail(email);

    if (!user) return res.status(401).send(loginTemplate("User not found"));

    if (!(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).send(loginTemplate("Invalid credentials"));

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    updateRefreshToken(user.id, refreshToken);

    return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .redirect("/dashboard");
  } catch (error) {
    const err = error as any;
    return res.status(500).send(loginTemplate(err.message));
  }
});

router.get("/", (req: Request, res: Response) => {
  res.redirect("/auth/login");
});

router.get("/signup", (_req: Request, res: Response) => {
  res.send(signupTemplate());
});

router.post("/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  if (!email || !password || !name)
    return res.status(400).send(signupTemplate("All fields are required"));

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    await createUser(name, email, hashedPwd);
  } catch (error) {
    const err = error as any;
    console.log(err.message);
    if (err.code === "ER_DUP_ENTRY" || err.errno === 1062) {
      return res
        .status(409)
        .send(
          signupTemplate(
            "User with same email id already exists, are you trying to <a href='/auth/login'>log in</a>?"
          )
        );
    }
    return res.status(401).send(signupTemplate(err.message));
  }

  res.redirect("/auth/login");
});

router.post("/logout", async (req: Request, res: Response) => {
  const sid = req.cookies.sid;
  if (sid) await revokeSession(sid);
  res.clearCookie("sid");
  res.send("<h1>Logged out successfully</h1>");
});

export default router;
