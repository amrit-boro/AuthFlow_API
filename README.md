# AuthFlow API

A secure authentication REST API built with Node.js and Express.js, implementing JWT-based access and refresh token mechanisms with security best practices.

---

## 🚀 Features

- User Registration with hashed passwords
- User Login with access & refresh token generation
- Refresh token mechanism for generating new access tokens without re-login
- Token rotation for refresh token reuse detection
- HttpOnly cookie for secure refresh token storage
- Input validation using Joi
- Centralized error handling
- HTTPS ready for production

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JSON Web Tokens (JWT)
- **Validation:** Joi
- **Database:** MongoDB + Mongoose
- **Password Hashing:** bcrypt
- **Cookie Parsing:** cookie-parser

---

## 📁 Folder Structure

```
AUTHFLOW_API/
├── src/
│   ├── config/          # Environment & DB configuration
│   ├── controller/      # Route controllers (auth logic)
│   ├── middleware/       # Custom middleware (protect routes)
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── utils/           # Utility functions (token, catchAsync, appError)
│   ├── validators/      # Joi validation schemas
│   ├── index.js         # App entry point
│   └── server.js        # Server configuration
├── .env                 # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8003
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
```

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/AuthFlow_API.git

# Navigate to project directory
cd AuthFlow_API

# Install dependencies
npm install

# Start development server
npm start
```

---

## 📌 API Endpoints

### Auth Routes — `/api/v1/auth`

| Method | Endpoint   | Description          | Auth Required     |
| ------ | ---------- | -------------------- | ----------------- |
| POST   | `/signup`  | Register a new user  | ❌                |
| POST   | `/login`   | Login and get tokens | ❌                |
| POST   | `/refresh` | Get new access token | ❌ (needs cookie) |

---

## 📋 API Reference

### Register — `POST /api/v1/auth/signup`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "status": "success",
  "accessToken": "eyJhbGci...",
  "user": {
    "id": "6a08bb841cedee...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-05-01T00:00:00.000Z",
    "updatedAt": "2025-05-01T00:00:00.000Z"
  }
}
```

---

### Login — `POST /api/v1/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "accessToken": "eyJhbGci...",
  "user": {
    "id": "6a08bb841cedee...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

> ✅ Refresh token is automatically set as an **HttpOnly cookie**

---

### Refresh Token — `POST /api/v1/auth/refresh`

**Cookie Required:** `refreshToken`

**Response:**

```json
{
  "accessToken": "eyJhbGci...(new token)"
}
```

> ✅ New refresh token is automatically rotated and set in cookie

---

## 🔐 Security Implementation

### Token Strategy

| Token         | Storage         | Expiry     | Purpose                    |
| ------------- | --------------- | ---------- | -------------------------- |
| Access Token  | Response body   | 15 minutes | Authenticate API requests  |
| Refresh Token | HttpOnly Cookie | 7 days     | Generate new access tokens |

## ❌ Error Responses

| Status | Message                          | Reason                  |
| ------ | -------------------------------- | ----------------------- |
| 400    | Validation error                 | Invalid request body    |
| 401    | Incorrect email or password      | Wrong credentials       |
| 401    | Unauthorized request             | No refresh token        |
| 401    | Invalid or expired refresh token | JWT verification failed |
| 401    | Refresh token is expired or used | Token reuse detected    |
| 409    | Email already exists             | Duplicate registration  |

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)

---

## 📄 License

This project is licensed under the MIT License.
