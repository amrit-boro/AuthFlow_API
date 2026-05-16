const Joi = require("joi");

const registerUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Please tell us your name",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name too long",
  }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email() // Joi's built-in email validator handles the regex for you
    .required()
    .messages({
      "string.empty": "Please provide your email",
      "string.email": "Please provide a valid email",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^[6-9]\d{9}$/) // Matching your Mongoose regex exactly
    .required()
    .messages({
      "string.empty": "Please provide your phone number",
      "string.pattern.base": "Please provide a valid 10-digit phone number",
    }),

  avatar: Joi.string()
    .allow("") // Allows empty string as per default
    .optional(),

  role: Joi.string().valid("superadmin", "owner", "user").default("user"),

  password: Joi.string().min(8).required().messages({
    "string.empty": "Please provide a password",
    "string.min": "Password must be at least 8 characters",
  }),
});

const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide valid email",
    "any.required": "Email is required",
    "string.empty": "Email can't be empty",
  }),

  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password can't be empty",
  }),
});

module.exports = { registerUserSchema, loginUserSchema };
