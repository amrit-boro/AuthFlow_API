const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const ratelimit = require("express-rate-limit");
const cors = require("cors");

// Controller
const globalErrorHandler = require("./controller/errorController");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const AppError = require("./utils/appError");

// Start App
const app = express();

// Security header
app.use(helmet());
app.use(
  cors({
    credentials: true,
  }),
);

// Rate limiting
const limiter = ratelimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Initialize the middleware
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// Handle Undefined Routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
