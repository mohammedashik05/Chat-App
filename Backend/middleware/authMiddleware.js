const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const bearer = req.headers.authorization;

  // No Authorization header
  if (!bearer) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const token = bearer.split(" ")[1];

  // Prevent JWT malformed error
  if (!token || token === "null" || token === "undefined") {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or missing token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // console.log("Token verified:", decoded);
    req.user = decoded;
    return next(); // ensure next() stops here
  } catch (e) {
    // console.log("Invalid token error:", e.message);
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

module.exports = verifyToken;
