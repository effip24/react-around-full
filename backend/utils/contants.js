const { NODE_ENV, JWT_SECRET, MONGO_ADDRESS } = process.env;
const rateLimit = require("express-rate-limit");

module.exports.MONGODB_ADDRESS = NODE_ENV === "production" ? MONGO_ADDRESS : "http://localhost:3000";

module.exports.SECRET = NODE_ENV === "production" ? JWT_SECRET : "dev-secret";

module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
