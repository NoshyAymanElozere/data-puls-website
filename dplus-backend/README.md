# Data Puls Website - Backend API

Welcome to the backend project for **Data Puls Website**. This project is built using **Node.js**, **Express**, and utilizes ES modules for clean, modern Javascript syntax.

## Features

- **Modular Architecture**: Route definitions, controllers, middleware, and config parameters are isolated.
- **Robust Error Handling**: Centralized global error handling ensuring all errors are logged and returned as clean JSON responses.
- **CORS Enabled**: Configured for seamless web-client dashboard connections.
- **Development Server**: Automated hot-reloads using `nodemon`.
- **Environment Driven**: Configuration managed purely through `.env` variable bindings.

---

## Project Structure

```text
├── src/
│   ├── config/
│   │   └── index.js          # Environment config loader
│   ├── controllers/
│   │   └── healthController.js # App health status controller
│   ├── middleware/
│   │   ├── errorHandler.js   # Global express error handler
│   │   └── logger.js         # HTTP request logger
│   ├── routes/
│   │   └── api.js            # Modular router for all v1 API paths
│   └── index.js              # Application entry point
├── .env                      # Local environments configuration
├── .gitignore                # Standard repository exclusion settings
├── package.json              # App metadata, scripts, and dependencies
└── README.md                 # Project documentation
```

---

## Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed:
```bash
node --version # Recommended: v16+
npm --version
```

---

## Getting Started

### 1. Install Dependencies
Run the following command in the root folder to install all required packages:
```bash
npm install
```

### 2. Configure Environment variables
The project includes a pre-configured `.env` file in the root directory. Feel free to tweak these configurations:
```env
PORT=5000
NODE_ENV=development
API_PREFIX=/api/v1
```

### 3. Run the Server

#### Development Mode (with hot-reload)
Runs Nodemon to watch file changes and restart automatically:
```bash
npm run dev
```

#### Production Mode
Runs the standard node server:
```bash
npm start
```

---

## API Documentation

The server exposes the following root and versioned endpoints:

### Base Path
- **URL**: `http://localhost:5000/`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Welcome to the Data Puls Backend API!",
    "documentation": "Try accessing health check at /api/v1/health"
  }
  ```

### Health Check Utility
- **URL**: `/api/v1/health`
- **Method**: `GET`
- **Response**: Details server uptime, memory usage, node version, and system state.

### Project Information
- **URL**: `/api/v1/puls-info`
- **Method**: `GET`
- **Response**: JSON summary outlining the Data Puls project name and available API routing mapping.
