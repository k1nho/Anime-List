const router = require("express").Router();
const pool = require("../db");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    // middleware auth will provide req.user
    const user = await pool.query(
      "SELECT username FROM users WHERE username = $1",
      [req.user.id]
    );

    res.json(user.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;
