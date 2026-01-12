const express = require("express");
require("dotenv").config();

// Routes
const authRouter = require("./routes/auth");
const dashboardRouter = require("./routes/dashboard");
const { requireAuth } = require("./routes/auth/utils");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cookie-parser")());

app.get("/", async (req, res) => {
  res.send("<h1>Hello, World!</h1>");
});

app.use("/auth", authRouter);
app.use("/", requireAuth, dashboardRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
