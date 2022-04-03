// middleware/auth.js
const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const UnauthorizeError = require("../utils/errors/UnauthorizeError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizeError("Authorization Required");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
    );
  } catch (err) {
    throw new UnauthorizeError("Authorization Required");
  }

  req.user = payload;

  return next();
};
