// Handle response when not found url is requested

const notFound = (req, res, next) => {
  debugger;
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "prod" ? null : error.stack
  });
};

// Token verificator
const jwt = require("jsonwebtoken");

const tokenVerify = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ message: "Access Denied." });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token." });
  }
};

module.exports = {
  notFound,
  errorHandler,
  tokenVerify
};
