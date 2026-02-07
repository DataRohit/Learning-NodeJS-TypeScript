import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskMaster Pro API",
      version: "1.0.0",
      description:
        "Enterprise-grade Todo Management API with JWT Auth, MongoDB, and GraphQL.",
      contact: {
        name: "API Support",
        email: "support@taskmaster.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token to access protected routes.",
        },
      },
      schemas: {
        User: {
          type: "object",
          description: "User profile information",
          properties: {
            _id: { type: "string", example: "65c3b1e2a0f8b12345678900" },
            username: { type: "string", example: "rohit_coder" },
            email: { type: "string", example: "rohit@example.com" },
            refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1Ni..." },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-02-07T14:18:13.700Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-02-07T14:18:34.731Z",
            },
            __v: { type: "integer", example: 0 },
          },
        },
        Todo: {
          type: "object",
          description: "Todo item information",
          properties: {
            _id: { type: "string", example: "65c3b1e2a0f8b12345678905" },
            task: { type: "string", example: "Complete advanced API docs" },
            completed: { type: "boolean", example: false },
            user: { type: "string", example: "65c3b1e2a0f8b12345678900" },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-02-07T14:20:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-02-07T14:20:00.000Z",
            },
            __v: { type: "integer", example: 0 },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", description: "Detailed error message" },
          },
        },
        AuthSuccess: {
          type: "object",
          properties: {
            message: { type: "string", example: "Success" },
            accessToken: { type: "string", example: "access_token_here" },
            refreshToken: { type: "string", example: "refresh_token_here" },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
              examples: {
                missingToken: { value: { error: "Unauthorized access" } },
                invalidToken: { value: { error: "Invalid or expired token" } },
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
              example: { error: "Resource not found" },
            },
          },
        },
        InternalError: {
          description: "Server-side error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
              example: { error: "Internal server error" },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
