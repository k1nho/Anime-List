const jwt = require("jsonwebtoken");
require("dotenv").config();

// Function used to generate the json web tokens.

function tokenGenerator(user_id) {
  const payload = {
    user: {
      id: user_id,
    },
  };

  // use the id and the secret key to create the signature
  return jwt.sign(payload, process.env.jwtsecret, { expiresIn: "5h" });
}

module.exports = tokenGenerator;
