const pool = require("../db");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const tokenGenerator = require("../Utils/jwtGenerator");
const auth = require("../middleware/auth");
const valid = require("../middleware/validFields");

// To register an user into the database
router.post("/register", valid, async (req, res) => {
  try {
    const {
      username,
      password,
      gender,
      birthDate,
      creditCardNum,
      address,
      email,
    } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // No need to register if the user already exists
    if (user.rows.length > 0) {
      return res.status(401).json("An user with that account already exists");
    }

    // generate password by using hash salt
    const hashSaltRounds = 10;
    const saltGenerator = await bcrypt.genSalt(hashSaltRounds);
    const saltPassword = await bcrypt.hash(password, saltGenerator);

    // insert user into the database
    const newUser = await pool.query(
      "INSERT INTO users (username,  password, dob, address, credit_card, email) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [username, saltPassword, birthDate, address, creditCardNum, email]
    );

    const token = tokenGenerator(newUser.rows[0].username);

    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error");
  }
});

// To login an user into his/her account
router.post("/login", valid, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // the user trying to login does not exists
    if (user.rows.length === 0) {
      return res
        .status(401)
        .json("The Email or Password Provided is Incorrect");
    }

    // validate the user's password login
    const valid = await bcrypt.compare(password, user.rows[0].password);

    if (!valid) {
      return res
        .status(401)
        .json("The Email or Password Provided is Incorrect. Try Again");
    }

    // Authentication completed successfully
    const token = tokenGenerator(user.rows[0].username);

    return res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error");
  }
});

router.get("/verify-user", auth, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error");
  }
});

module.exports = router;
