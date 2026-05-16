const express = require("express");
const morgan = require("morgan");

const globalErrorHandler = require("./controller/errorController");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

const AppError = require("./utils/appError");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res, next) => {
  //   const err = new Error("Hello from the error");
  //   err.statusCode = 404;
  next(new AppError("Hello from the ", 400));
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
