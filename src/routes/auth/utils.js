const db = require("../../utils/db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const findUserByEmail = async (email) =>
  (await db.query("SELECT * FROM users WHERE email = ?", [email]))[0][0];

const createSession = async (userId) => {
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
    console.error("Error creating session:", err.message);
    return null;
  }
};

const createUser = async (email, hashedPwd) => {
  await db.query(
    "INSERT INTO users (id, email, password_hash) VALUES (?,?, ?)",
    [uuidv4(), email, hashedPwd]
  );
};

const revokeSession = async (sessionId) => {
  await db.execute(`UPDATE sessions SET is_revoked = TRUE WHERE id = ?`, [
    sessionId,
  ]);
};

// Auth check middleware
async function requireAuth(req, res, next) {
  const sid = req.cookies?.sid;
  console.log(req.cookies);

  if (!sid)
    return res
      .status(401)
      .send(
        "<h1>Please <a href='/auth/login/'>log in</a> to access this page.</h1>"
      );

  const [rows] = await db.execute(
    `
    SELECT user_id
    FROM sessions
    WHERE id = ?
      AND is_revoked = FALSE
      AND expires_at > NOW()
    `,
    [sid]
  );

  if (rows.length === 0)
    return res
      .status(401)
      .send(
        "<h1>Please <a href='/auth/login/'>log in</a> to access this page.</h1>"
      );

  req.userId = rows[0].user_id;
  next();
}

module.exports = {
  findUserByEmail,
  createSession,
  createUser,
  revokeSession,
  requireAuth,
};
