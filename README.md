#  Full-Stack Task Management System

A production-style full-stack task management system built with Node.js, Express, MongoDB, and React, designed around secure JWT authentication, strict role-based access control, and API versioning.

This project demonstrates practical backend architecture, clean frontend role flows, and API-first documentation with Swagger/OpenAPI.

## Tech Stack

- Backend: Node.js, Express.js, MongoDB, Mongoose
- Frontend: React (Vite), React Router, Axios
- Authentication: JWT (Bearer token), bcryptjs
- Security Middleware: helmet, express-mongo-sanitize, xss-clean, cors
- API Documentation: swagger-jsdoc, swagger-ui-express

## Key Features

- JWT-based authentication with token verification on protected routes
- Role-based authorization with separate Admin and User capabilities
- Task lifecycle management with assignment and status updates
- API versioning implemented with /api/v1 and /api/v2 route groups
- Frontend API version switcher (v1/v2) with dynamic service routing
- Swagger UI available at /api-docs
- Exported OpenAPI spec committed at docs/openapi.json

## Architecture Overview

### Backend Boot Sequence

1. Server startup begins in src/server.js
2. Environment is loaded and MongoDB connection is initialized
3. Database connection logic is handled by src/config/databaseConnect.js
4. Express app configuration is loaded from src/app.js
5. Middleware, Swagger UI, and versioned API routers are mounted

### Core Backend Responsibility Split

- src/server.js: process start, env load, database connect, listen
- src/config/databaseConnect.js: primary + fallback MongoDB URI connection strategy
- src/app.js: security middleware, JSON parsing, CORS, Swagger route, API route mounting
- src/routes: API version and module-level route wiring
- src/controller: request/response orchestration
- src/services: business rules and domain logic
- src/models: MongoDB schema definitions
- src/middleware: authentication and role enforcement

## Authentication Flow

1. User registers or logs in using routes handled by src/controller/authController.js
2. Authentication business logic runs in src/services/authService.js
3. Passwords are hashed using bcryptjs during registration
4. On login, a JWT token is generated and returned to frontend
5. Frontend stores token and role in browser local storage
6. Protected requests send Authorization: Bearer <token>
7. src/middleware/authMiddleware.js verifies JWT and attaches decoded user context
8. Logout revokes token using src/services/tokenService.js in-memory blacklist
9. Revoked tokens are blocked by auth middleware on future requests

## Role-Based Access

Role checks are enforced by src/middleware/UserMiddleware.js and applied at route level.

### Route Protection Files

- src/routes/v1/authRoutes.js
- src/routes/v1/userRoutes.js
- src/routes/v1/taskRoute.js
- src/routes/v2/authRoutes.js
- src/routes/v2/userRoutes.js
- src/routes/v2/taskRoute.js

### Admin Capabilities

- View users list
- Create, assign, update, and delete tasks
- Access broad task visibility

### User Capabilities

- View only assigned tasks
- Update only task status for tasks assigned to them

## Data Models & Business Logic

### User Model (src/models/userModel.js)

- username
- password
- role

### Task Model (src/models/taskModel.js)

- title
- description
- status
- assignedTo
- createdBy
- dueDate
- timestamps

### Business Logic Layers

- Task rules, validation, and ownership constraints: src/services/TaskService.js
- Request/response and status code handling: src/controller/taskController.js

## API Versioning

- Versioned base paths:
  - /api/v1
  - /api/v2
- Version routers are mounted in src/app.js
- Version index routers are in src/routes/v1/index.js and src/routes/v2/index.js
- Frontend supports dynamic version switching for user task flow
- Selected API version is stored in local storage and used by frontend/src/services/userService.js

## Frontend Flow

- Routing entry and protected page composition: frontend/src/App.jsx
- Route access control: frontend/src/components/ProtectedRoute.jsx
- Local storage helpers for auth/session/version: frontend/src/utils/helpers.js
- Admin API operations: frontend/src/services/adminService.js
- User API operations with version-aware endpoints: frontend/src/services/userService.js

## End-to-End Flow

1. User logs in from frontend
2. JWT token and role are stored in browser local storage
3. Every protected request includes Bearer token
4. Backend middleware verifies token and role permissions
5. Controllers delegate to services for business logic
6. MongoDB persists and retrieves entities
7. API sends structured response back to frontend
8. UI updates based on role and selected API version

## API Documentation

- Swagger UI: /api-docs
- OpenAPI JSON: docs/openapi.json

## Project Structure

```text
INTERNSHIP_BACKEND_PROJECT_MAHESH_RASAPALLI/
├─ docs/
│  └─ openapi.json
├─ frontend/
│  ├─ src/
│  │  ├─ api/
│  │  │  └─ axios.js
│  │  ├─ components/
│  │  │  ├─ Navbar.jsx
│  │  │  └─ ProtectedRoute.jsx
│  │  ├─ pages/
│  │  │  ├─ AdminDashboard.jsx
│  │  │  ├─ Login.jsx
│  │  │  ├─ Register.jsx
│  │  │  └─ UserDashboard.jsx
│  │  ├─ services/
│  │  │  ├─ adminService.js
│  │  │  ├─ authService.js
│  │  │  └─ userService.js
│  │  ├─ utils/
│  │  │  └─ helpers.js
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  └─ package.json
├─ src/
│  ├─ config/
│  │  ├─ databaseConnect.js
│  │  └─ swagger.js
│  ├─ controller/
│  │  ├─ authController.js
│  │  ├─ taskController.js
│  │  └─ userController.js
│  ├─ middleware/
│  │  ├─ authMiddleware.js
│  │  └─ UserMiddleware.js
│  ├─ models/
│  │  ├─ taskModel.js
│  │  └─ userModel.js
│  ├─ routes/
│  │  ├─ v1/
│  │  └─ v2/
│  ├─ services/
│  │  ├─ authService.js
│  │  ├─ TaskService.js
│  │  └─ tokenService.js
│  ├─ app.js
│  └─ server.js
├─ package.json
└─ README.md
```

## Setup Instructions

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Access URLs

- Backend API: http://localhost:5000
- Frontend App (Vite default): http://localhost:5173
- Swagger UI: http://localhost:5000/api-docs

## Environment Variables

Define these in src/.env:

```env
PORT=5000
CONNECTION_STRING=<your_mongodb_srv_connection_string>
CONNECTION_STRING_DIRECT=<your_mongodb_direct_connection_string>
JWT_SECRET=<your_jwt_secret>
```

Frontend variable (frontend/.env):

```env
VITE_API_BASE_URL=http://localhost:1729/api/v1
```

## API Endpoints

| Version | Module | Method | Endpoint | Access |
|---|---|---|---|---|
| v1/v2 | Auth | POST | /api/{v}/auth/register | Public |
| v1/v2 | Auth | POST | /api/{v}/auth/login | Public |
| v1/v2 | Auth | POST | /api/{v}/auth/logout | Admin, User |
| v1/v2 | Auth | DELETE | /api/{v}/auth/delete-account/:id? | Admin, User |
| v1/v2 | Users | GET | /api/{v}/users/getUsers | Admin |
| v1/v2 | Tasks | GET | /api/{v}/tasks/getTasks | Admin, User |
| v1/v2 | Tasks | GET | /api/{v}/tasks/getTask/:id | Admin, User |
| v1/v2 | Tasks | POST | /api/{v}/tasks/create | Admin |
| v1/v2 | Tasks | PUT | /api/{v}/tasks/update/:id | Admin |
| v1/v2 | Tasks | DELETE | /api/{v}/tasks/delete/:id | Admin |
| v1/v2 | Tasks | PATCH | /api/{v}/tasks/updateStatus/:id | User |
| v1 | Tasks | GET | /api/v1/tasks | Admin, User |
| v1 | Tasks | POST | /api/v1/tasks | Admin |
| v1 | Tasks | GET | /api/v1/tasks/:id | Admin, User |
| v1 | Tasks | PUT | /api/v1/tasks/:id | Admin |
| v1 | Tasks | DELETE | /api/v1/tasks/:id | Admin |

## Scalability Notes

- API versioning allows iterative rollout without breaking current clients
- Service layer isolates business rules from transport layer
- Middleware-based security keeps auth/authorization reusable and centralized
- Swagger + exported OpenAPI improves collaboration, testing, and onboarding
- Current token revocation is in-memory; can be upgraded to Redis for distributed deployment

## Deployment

- Backend can be deployed on any Node-compatible platform (Render, Railway, EC2, Docker)
- Frontend can be deployed on Vercel/Netlify as static build
- Use managed MongoDB (Atlas) and secure environment variable injection
- Keep docs/openapi.json in CI pipeline for API contract visibility

## License

ISC

## Author

Mahesh Rasapalli
