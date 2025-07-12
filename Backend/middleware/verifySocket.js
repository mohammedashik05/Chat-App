// middleware/verifySocket.js
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Socket.IO middleware
 * – Looks for a JWT sent by the client during the connection handshake.
 * – On success: attaches the decoded payload to socket.user and lets the
 *   connection proceed.
 * – On failure: blocks the connection with an auth error.
 *
 * Client side you’ll typically connect like:
 *   const socket = io("http://localhost:7000", {
 *     auth: { token: localStorage.getItem("token") }
 *   });
 */
function verifySocket(socket, next) {
  // Token can be passed in several ways; the two most common:
  // 1) socket.handshake.auth.token   (recommended)
  // 2) socket.handshake.headers['authorization'] => "Bearer xxx"
  const { token } = socket.handshake.auth || {};

  let jwtString = token;
  if (!jwtString && socket.handshake.headers?.authorization) {
    const parts = socket.handshake.headers.authorization.split(" ");
    if (parts[0] === "Bearer") jwtString = parts[1];
  }

  if (!jwtString) {
    return next(new Error("No token provided"));
  }

  try {
    const decoded = jwt.verify(jwtString, SECRET_KEY);
    socket.user = decoded;        // make user info available in your handlers
    return next();                // allow the connection
  } catch (err) {
    return next(new Error("Invalid or expired token"));
  }
}

module.exports = verifySocket;
