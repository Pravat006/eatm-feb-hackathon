import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.1.0",
    info: {
        title: "SupplyChain360 API",
        version: "1.0.0",
        description: "Phase 1 REST API for SupplyChain360",
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: [{ bearerAuth: [] }],
    servers: [
        {
            url: "http://localhost:3001/api/v0",
            description: "Local dev",
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: [
        "./src/modules/**/*-route.ts",
        "./src/app.ts"
    ],
};

export const swaggerSpec = swaggerJSDoc(options);
