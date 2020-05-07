export const CONSTANTS = {
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    COGNITO_USER_POOL: process.env.COGNITO_USER_POOL,
    COGNITO_USER_POOL_CLIENT: process.env.COGNITO_USER_POOL_CLIENT,
    // ENVIRONMENT: process.env.ENVIRONMENT,
    // DYNAMODB_OPTIONS: {},
    DYNAMODB_OPTIONS: {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    },
    DYNAMODB_USERS_TABLE: process.env.DYNAMODB_USERS_TABLE
};