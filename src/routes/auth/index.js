const router = require("express").Router();
const bcrypt = require("bcrypt");
const {
  findUserByEmail,
  createSession,
  createUser,
  revokeSession,
} = require("./utils");

const { loginTemplate, registerTemplate } = require("./templates");

router.get("/login", (_req, res) => {
  res.send(loginTemplate());
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) return res.status(401).send(loginTemplate("User not found"));

  if (!(await bcrypt.compare(password, user.password_hash)))
    return res.status(401).send(loginTemplate("Invalid credentials"));

  const session = await createSession(user.id);
  console.log(session);

  return res
    .cookie("sid", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: session.expiresAt,
    })
    .redirect("/dashboard");
});

router.get("/register", (_req, res) => {
  res.send(registerTemplate());
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    await createUser(email, hashedPwd);
  } catch (error) {
    console.log(error.message);
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      return res
        .status(409)
        .send(
          registerTemplate(
            "User with same email id already exists, are you trying to <a href='/auth/login'>log in</a>?"
          )
        );
    }
    return res.status(401).send(registerTemplate(error.message));
  }

  res.redirect("/auth/login");
});

router.post("/logout", async (req, res) => {
  const sid = req.cookies.sid;
  if (sid) await revokeSession(sid);
  res.clearCookie("sid");
  res.send("<h1>Logged out successfully</h1>");
});

module.exports = router;
