const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"],
      trim: true,
      minlength: [2, "Name must be at least 2 character"],
      maxlength: [50, "Name too long"],
    },

    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
        },
        message: "Please provide a valid email",
      },
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[6-9]\d{9}$/.test(v);
        },
        message: "Please provide a valid 10-digit phone number",
      },
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["superadmin", "owner", "user"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    // Change from the array format to this:
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  // 1. Run only if password was actually modified
  if (!this.isModified("password")) {
    return; // Simply return to hand control back to Mongoose
  }
  // 2. Hash the password
  this.password = await bcrypt.hash(this.password, 12);
});

// Instance method
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("User", UserSchema);
