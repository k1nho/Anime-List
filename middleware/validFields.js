module.exports = (req,res,next) =>{

    const {email, username, password} = req.body;

    function validEmail(user_email){
         return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user_email);
    }

    if (req.path === "/register") {

       
        // check if any of the fields is empty
        if (![email, username, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
    } 
    
    else if (req.path === "/login") {
        // check if nay of the fields are empty
        if (![email, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
  }



  // continue through the route
  next();
};