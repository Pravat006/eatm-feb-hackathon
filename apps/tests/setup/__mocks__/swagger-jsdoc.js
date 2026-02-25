/**
 * Mock for swagger-jsdoc module
 * Used in tests to avoid importing the actual swagger-jsdoc library
 */

const mockSwaggerSpec = {
    openapi: '3.1.0',
    info: {
        title: 'Supply Chain 360 API',
        version: '1.0.0',
        description: 'Mock Swagger specification for testing',
    },
    paths: {},
    components: {
        schemas: {},
    },
};

/**
 * Mock swaggerJSDoc function
 * Returns a mock swagger specification
 */
function swaggerJSDoc(options) {
    return mockSwaggerSpec;
}

module.exports = swaggerJSDoc;
module.exports.default = swaggerJSDoc;
