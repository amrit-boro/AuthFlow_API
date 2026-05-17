# AuthFlow API

A secure authentication REST API built with Node.js and Express.js, implementing JWT-based access and refresh token mechanisms with security best practices.

---

## Features

- User Registration with hashed passwords
- User Login with access & refresh token generation
- Refresh token mechanism for generating new access tokens without re-login
- Token rotation for refresh token reuse detection
- HttpOnly cookie for secure refresh token storage
- Input validation using Joi
- Centralized error handling
- HTTPS ready for production

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JSON Web Tokens (JWT)
- **Validation:** Joi
- **Database:** MongoDB + Mongoose
- **Password Hashing:** bcrypt
- **Cookie Parsing:** cookie-parser

---

## Folder Structure

AUTHFLOW_API/
├── src/
│ ├── config/ # Environment & DB configuration
│ ├── controller/ # Route controllers (auth logic)
│ ├── middleware/ # Custom middleware (protect routes)
│ ├── models/ # Mongoose schemas
│ ├── routes/ # Express routers
│ ├── utils/ # Utility functions (token, catchAsync, appError)
│ ├── validators/ # Joi validation schemas
│ ├── index.js # App entry point
│ └── server.js # Server configuration
├── .env # Environment variables
├── .gitignore
├── package.json
└── README.md

```

```
