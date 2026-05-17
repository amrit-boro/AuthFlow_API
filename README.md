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

| Method | Endpoint    | Description          | Auth Required     |
| ------ | ----------- | -------------------- | ----------------- |
| POST   | `/register` | Register a new user  | ❌                |
| POST   | `/login`    | Login and get tokens | ❌                |
| POST   | `/refresh`  | Get new access token | ❌ (needs cookie) |

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)

---

## 📄 License

This project is licensed under the MIT License.
