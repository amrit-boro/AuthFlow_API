const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  console.log("hello from dev error controller");

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // OPERATIONAL ERROR
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // PROGRAMMING OR OTHER UNKNOWN ERROR
  } else {
    // 1) Log Error
    console.error("ERROR: 🔥", err);
    // 2) send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const handleJWTError = () => {
  return new AppError("Invalid token. Please login again!", 401);
};

const handleInvalidUUID = (err) => {
  const invalidValueMatch = err.message.match(/"(.*?)"/);
  const invalidValue = invalidValueMatch ? invalidValueMatch[1] : "Invalid id";
  const message = `Invalid id: ${invalidValue}`;
  return new AppError(message, 400);
};

const handleDuplicateDB = (err) => {
  const match = err.detail.match(/\((.*?)\)=\((.*?)\)/);
  const field = match ? match[1] : "field";
  const value = match ? match[2] : "value";
  const message = `Duplicate ${field}: ${value}`;
  return new AppError(message, 409);
};

const handleJWTExpiredError = (err) =>
  new AppError("Your token has expired! Please login again", 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    error.message = err.message;
    error.name = err.name;

    if (error.name === "JsonWebTokenError") {
      error = handleJWTError();
    }
    if (error.code === "22P02") error = handleInvalidUUID(error);
    if (error.code === "23505") error = handleDuplicateDB(error);
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
