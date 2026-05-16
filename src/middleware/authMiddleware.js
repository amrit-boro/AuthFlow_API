const AppError = require("../utils/appError");
const User = require("../models/userSchema");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401),
    );
  }
  // 2) Verify token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.ACCESS_TOKEN_SECRET,
  );

  // 3) Check user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The token belonging to this token does no longer exists.",
        401,
      ),
    );
  }
  console.log(currentUser.role);
  // Grant access to freshUser
  req.user = currentUser;
  next();
});

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return new AppError(
        "You don't have permission to perform this action",
        403,
      );
    }
    next();
  };
};
