const router = require("express").Router();

router.get("/dashboard", (req, res) => {
  res.send(`<h1>Welcome to your Dashboard!</h1> User ID: ${req.userId}`);
});

module.exports = router;
