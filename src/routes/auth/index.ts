import { Router, Request, Response } from "express";
import {
  createUser,
  findUserByEmail,
  makeAndSentTokens,
  User,
  verifyRefresh,
} from "./utils";
import { compare, hash } from "bcrypt";

const router: Router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const user = await findUserByEmail(req.body.email);
    if (!user || !(await compare(req.body.password, user.password_hash)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    makeAndSentTokens(user, res);
  } catch (e: any) {
    res
      .status(401)
      .json({ success: false, message: `Unknown Error: ${e?.message}` });
  }
});

router.post("/signup", async (req: Request, res: Response) => {
  const { username, email, password } = req.body as {
    username: string;
    email: string;
    password: string;
  };

  if (!email || !password || !username)
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });

  try {
    const hashedPwd = await hash(password, 10);
    await createUser(username, email, hashedPwd);
    const user = (await findUserByEmail(req.body.email)) as User;

    makeAndSentTokens(user, res);
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      return res.status(409).json({
        success: false,
        message:
          "User with same email id already exists, are you trying to log in?",
      });
    }
    return res.json({
      success: false,
      message: `Unknown Error: ${error?.message}`,
    });
  }
});

router.get("/refresh", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) return res.sendStatus(409);
  // TODO: Chech on db also

  verifyRefresh(refreshToken, (err, user: any) => {
    if (err) return res.sendStatus(403);
    makeAndSentTokens({ id: user.id, email: user.email }, res);
  });
});

export default router;
