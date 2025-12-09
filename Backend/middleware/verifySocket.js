const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

function verifySocket(socket, next) {
  const { token } = socket.handshake.auth || {};

  let jwtString = token;

  // Also accept Authorization: Bearer xxx token
  if (!jwtString && socket.handshake.headers?.authorization) {
    const parts = socket.handshake.headers.authorization.split(" ");
    if (parts[0] === "Bearer") jwtString = parts[1];
  }

  // Prevent malformed token spam
  if (!jwtString || jwtString === "null" || jwtString === "undefined") {
    return next(new Error("No or invalid token provided"));
  }

  try {
    const decoded = jwt.verify(jwtString, SECRET_KEY);
    socket.user = decoded;
    return next();
  } catch (err) {
    return next(new Error("Invalid or expired token"));
  }
}

module.exports = verifySocket;
