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

module.exports = {
  notFound,
  errorHandler
};
