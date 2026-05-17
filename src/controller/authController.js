const User = require("../models/userSchema");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");

const {
  registerUserSchema,
  loginUserSchema,
} = require("../validators/registerUserSchema");
const {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} = require("../utils/token");

// User Registration

exports.signup = catchAsync(async (req, res, next) => {
  const { error, value } = registerUserSchema.validate(req.body, {
    abortEarly: false,
  });

  // Validate body
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message);
    return next(new AppError(errorMessage, 400));
  }

  // Validate existing user
  const existingUser = await User.findOne({ email: value.email });
  if (existingUser) {
    return next(new AppError("Email already exists!", 409));
  }

  // Create user
  const newUser = await User.create(value);

  // 4. Generate the JWT for the new user
  const accessToken = createAccessToken(newUser._id);
  const refreshToken = createRefreshToken(newUser._id);

  newUser.refreshToken = refreshToken;
  await newUser.save({ validateBeforeSave: false });

  // Remove password
  const user = newUser.toObject();
  delete user.password;
  delete user.refreshToken;

  // Send cookie
  sendRefreshToken(res, refreshToken);

  res.status(201).json({
    status: "success",
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.updatedAt,
      updatedAt: user.updatedAt,
    },
  });
});

// User Login

exports.login = catchAsync(async (req, res, next) => {
  const { error, value } = loginUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message);
    return next(new AppError(errorMessage, 400));
  }

  // If user exists && password is correct
  const user = await User.findOne({ email: value.email }).select("+password");
  if (!user || !(await user.correctPassword(value.password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // Create Token
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  sendRefreshToken(res, refreshToken);
  // Response
  res.status(200).json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// Refresh token generation
exports.refreshAccessToken = catchAsync(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return next(new AppError("Unauthorized request", 401));
  }

  // 1. Verify token signature
  const decoded = await promisify(jwt.verify)(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  // 2. Find user
  const user = await User.findById(decoded?.id);
  if (!user) {
    return next(new AppError("User not found", 401));
  }

  // 3. ✅ Token rotation check (reuse detection)
  if (incomingRefreshToken !== user.refreshToken) {
    return next(new AppError("Refresh token is expired or used", 401));
  }

  // 4. Generate new tokens
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  // 5. Save new refresh token to DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // 6. Send new refresh token via cookie
  sendRefreshToken(res, refreshToken);

  // 7. Return new access token
  res.status(200).json({
    accessToken,
  });
});
