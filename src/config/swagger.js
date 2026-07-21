import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Internship Backend API",
      version: "1.0.0",
      description:
        "JWT authentication, role-based authorization, and task management APIs for v1 and v2 routes.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Authentication APIs",
      },
      {
        name: "Tasks",
        description: "Task management APIs",
      },
      {
        name: "Users",
        description: "User management APIs",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Send JWT as: Bearer <token>",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["_id", "username", "role"],
          properties: {
            _id: {
              type: "string",
              example: "661a0a5be8f4d7560f3d2c93",
            },
            username: {
              type: "string",
              example: "mahesh",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              example: "user",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-04-24T12:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-04-24T12:05:00.000Z",
            },
          },
        },
        Task: {
          type: "object",
          required: ["_id", "title", "status", "createdAt", "updatedAt"],
          properties: {
            _id: {
              type: "string",
              example: "661a0b16e8f4d7560f3d2ca1",
            },
            title: {
              type: "string",
              minLength: 5,
              example: "Fix API validation",
            },
            description: {
              type: "string",
              example: "Add proper status code handling in task controller",
            },
            status: {
              type: "string",
              enum: ["pending", "in progress", "completed"],
              example: "pending",
            },
            assignedTo: {
              nullable: true,
              oneOf: [
                {
                  type: "string",
                  example: "661a0a5be8f4d7560f3d2c93",
                },
                {
                  $ref: "#/components/schemas/User",
                },
              ],
            },
            createdBy: {
              nullable: true,
              oneOf: [
                {
                  type: "string",
                  example: "661a0a5be8f4d7560f3d2c11",
                },
                {
                  $ref: "#/components/schemas/User",
                },
              ],
            },
            dueDate: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2026-05-01T10:00:00.000Z",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-04-24T12:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-04-24T12:30:00.000Z",
            },
          },
        },
        AuthRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: {
              type: "string",
              minLength: 3,
              maxLength: 30,
              example: "mahesh",
            },
            password: {
              type: "string",
              minLength: 8,
              example: "Mahesh@123",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              description: "Registration route rejects admin role from public access",
              example: "user",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "User logged in suceessfully",
            },
            user: {
              type: "string",
              example: "mahesh",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              example: "user",
            },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
        MessageResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Operation successful",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Internal server error",
            },
          },
        },
      },
    },
    paths: {
      "/api/v1/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register user",
          description: "Creates a user account. Public registration can create either user or admin role.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthRequest" },
                examples: {
                  userRegister: {
                    value: {
                      username: "mahesh",
                      password: "Mahesh@123",
                      role: "user",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            403: {
              description: "Forbidden role assignment",
            },
            500: {
              description: "Internal server error",
            },
          },
        },
      },
      "/api/v1/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["username", "password"],
                  properties: {
                    username: { type: "string" },
                    password: { type: "string" },
                  },
                },
                examples: {
                  login: {
                    value: {
                      username: "mahesh",
                      password: "Mahesh@123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthResponse" },
                },
              },
            },
            400: { description: "Invalid request payload" },
            401: { description: "Invalid username/password" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout user",
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "Logout successful" },
            400: { description: "Token is required" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/auth/delete-account/{id}": {
        delete: {
          tags: ["Auth"],
          summary: "Delete account by id",
          description: "Admin can delete any account. User can delete own account.",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Account deleted successfully" },
            400: { description: "Invalid user ID" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "User not found" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/auth/delete-account": {
        delete: {
          tags: ["Auth"],
          summary: "Delete own account",
          description: "Deletes currently authenticated user account when id is not provided.",
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "Account deleted successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/v1/users/getUsers": {
        get: {
          tags: ["Users"],
          summary: "Get all users",
          description: "Admin only endpoint. Returns all users with role=user.",
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: "Users fetched successfully",
              content: {
                "application/json": {
                  example: {
                    message: "Users fetched successfully",
                    users: [
                      {
                        _id: "661a0a5be8f4d7560f3d2c93",
                        username: "mahesh",
                        role: "user",
                        createdAt: "2026-04-24T12:00:00.000Z",
                        updatedAt: "2026-04-24T12:00:00.000Z",
                      },
                    ],
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/v1/tasks": {
        get: {
          tags: ["Tasks"],
          summary: "Get tasks",
          description: "Admin gets all tasks. User gets tasks assigned to self.",
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "Tasks fetched successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            500: { description: "Internal server error" },
          },
        },
        post: {
          tags: ["Tasks"],
          summary: "Create task",
          description: "Admin only endpoint.",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "description"],
                  properties: {
                    title: { type: "string", minLength: 5 },
                    description: { type: "string", minLength: 8 },
                    status: {
                      type: "string",
                      enum: ["pending", "in progress", "completed"],
                    },
                    assignedTo: { type: "string", nullable: true },
                    dueDate: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Task created successfully" },
            400: { description: "Validation error" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/tasks/{id}": {
        get: {
          tags: ["Tasks"],
          summary: "Get task by id",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Task fetched successfully" },
            400: { description: "Invalid task id" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden task access" },
            404: { description: "Task not found" },
            500: { description: "Internal server error" },
          },
        },
        put: {
          tags: ["Tasks"],
          summary: "Update task by id",
          description: "Admin only endpoint.",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string", minLength: 5 },
                    description: { type: "string", minLength: 8 },
                    assignedTo: { type: "string", nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Task updated successfully" },
            400: { description: "Validation error" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Task not found" },
            500: { description: "Internal server error" },
          },
        },
        delete: {
          tags: ["Tasks"],
          summary: "Delete task by id",
          description: "Admin only endpoint.",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Task deleted successfully" },
            400: { description: "Invalid task id" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Task not found" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/v1/tasks/create": {
        post: {
          tags: ["Tasks"],
          summary: "Create task (legacy endpoint)",
          security: [{ BearerAuth: [] }],
          responses: {
            201: { description: "Task created successfully" },
            400: { description: "Validation error" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/tasks/getTasks": {
        get: {
          tags: ["Tasks"],
          summary: "Get tasks (legacy endpoint)",
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "Tasks fetched successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/tasks/getTask/{id}": {
        get: {
          tags: ["Tasks"],
          summary: "Get single task (legacy endpoint)",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Task fetched successfully" },
            400: { description: "Invalid task id" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Task not found" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/tasks/update/{id}": {
        put: {
          tags: ["Tasks"],
          summary: "Update task (legacy endpoint)",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Task updated successfully" },
            400: { description: "Validation error" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Task not found" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/tasks/delete/{id}": {
        delete: {
          tags: ["Tasks"],
          summary: "Delete task (legacy endpoint)",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Task deleted successfully" },
            400: { description: "Invalid task id" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Task not found" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/tasks/updateStatus/{id}": {
        patch: {
          tags: ["Tasks"],
          summary: "Update task status",
          description: "User-only endpoint. Assigned user can update status.",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: ["pending", "in progress", "completed"],
                    },
                  },
                },
                examples: {
                  updateStatus: {
                    value: {
                      status: "in progress",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Task status updated successfully" },
            400: { description: "Invalid task id or invalid status" },
            401: { description: "Unauthorized" },
            403: { description: "Only assigned user can update status" },
            404: { description: "Task not found" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/v2/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register user (v2)",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthRequest" },
              },
            },
          },
          responses: {
            201: { description: "User registered successfully" },
            400: { description: "Validation error" },
            403: { description: "Forbidden role assignment" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v2/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login user (v2)",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["username", "password"],
                  properties: {
                    username: { type: "string" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Login successful" },
            400: { description: "Invalid request payload" },
            401: { description: "Invalid username/password" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v2/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout user (v2)",
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "Logout successful" },
            400: { description: "Token is required" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v2/auth/delete-account/{id}": {
        delete: {
          tags: ["Auth"],
          summary: "Delete account by id (v2)",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Account deleted successfully" },
            400: { description: "Invalid user ID" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "User not found" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v2/auth/delete-account": {
        delete: {
          tags: ["Auth"],
          summary: "Delete own account (v2)",
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "Account deleted successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/v2/users/getUsers": {
        get: {
          tags: ["Users"],
          summary: "Get all users (v2)",
          description: "Admin only endpoint.",
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "Users fetched successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/v2/tasks/create": {
        post: {
          tags: ["Tasks"],
          summary: "Create task (v2)",
          description: "Admin only endpoint.",
          security: [{ BearerAuth: [] }],
          responses: {
            201: { description: "Task created successfully" },
            400: { description: "Validation error" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v2/tasks/getTasks": {
        get: {
          tags: ["Tasks"],
          summary: "Get tasks (v2)",
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "Tasks fetched successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v2/tasks/getTask/{id}": {
        get: {
          tags: ["Tasks"],
          summary: "Get task by id (v2)",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Task fetched successfully" },
            400: { description: "Invalid task id" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Task not found" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v2/tasks/update/{id}": {
        put: {
          tags: ["Tasks"],
          summary: "Update task by id (v2)",
          description: "Admin only endpoint.",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Task updated successfully" },
            400: { description: "Validation error" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Task not found" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v2/tasks/delete/{id}": {
        delete: {
          tags: ["Tasks"],
          summary: "Delete task by id (v2)",
          description: "Admin only endpoint.",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Task deleted successfully" },
            400: { description: "Invalid task id" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Task not found" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v2/tasks/updateStatus/{id}": {
        patch: {
          tags: ["Tasks"],
          summary: "Update task status (v2)",
          description: "User-only endpoint. Assigned user can update status.",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: ["pending", "in progress", "completed"],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Task status updated successfully" },
            400: { description: "Invalid task id or invalid status" },
            401: { description: "Unauthorized" },
            403: { description: "Only assigned user can update status" },
            404: { description: "Task not found" },
            500: { description: "Internal server error" },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
