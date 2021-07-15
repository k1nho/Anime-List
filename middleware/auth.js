const jwt = require("jsonwebtoken");
require("dotenv").config();



module.exports = async(req,res,next) =>{
    try {
        const token = req.header("token");

        // no token exists therefore user in not authorized
        if(!token){
            return res.status(403).json("User not authorized");
        }

        const payload = jwt.verify(token, process.env.jwtsecret);

        req.user = payload.user;

        next();

    } catch (err) {
        console.log(err.message);
        return res.status(403).json("User not authorized");

    }
}