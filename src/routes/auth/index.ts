import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  findUserByEmail,
  createSession,
  createUser,
  revokeSession,
} from "./utils";
import { loginTemplate, registerTemplate } from "./templates";

const router: Router = Router();

router.get("/login", (_req: Request, res: Response) => {
  res.send(loginTemplate());
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await findUserByEmail(email);

  if (!user) return res.status(401).send(loginTemplate("User not found"));

  if (!(await bcrypt.compare(password, user.password_hash)))
    return res.status(401).send(loginTemplate("Invalid credentials"));

  const session = await createSession(user.id);
  console.log(session);

  return res
    .cookie("sid", session?.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    })
    .redirect("/dashboard");
});

router.get("/register", (_req: Request, res: Response) => {
  res.send(registerTemplate());
});

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

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
          registerTemplate(
            "User with same email id already exists, are you trying to <a href='/auth/login'>log in</a>?"
          )
        );
    }
    return res.status(401).send(registerTemplate(err.message));
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
