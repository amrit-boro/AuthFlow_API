const catchAsync = require("../utils/catchAsync");
const User = require("../models/userSchema");

exports.getAllUser = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const users = await User.findById(id);

  res.status(200).json({
    status: true,
    message: "success",
    data: {
      users,
    },
  });
});
