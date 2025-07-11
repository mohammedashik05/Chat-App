const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
//act as a middleware to verify the token is vald or not
const verifyToken = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer)
    return res
      .status(401)
      .json({ success: false, message: "no token provied" });

  const token = bearer.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("token verifed", decoded);
    req.user = decoded;
    next();
  } catch (e) {
    console.log("Invalid token error:", e.message);
    res.status(403).json({ success: false, message: "Invalid token" });
  }
};

module.exports = verifyToken;
