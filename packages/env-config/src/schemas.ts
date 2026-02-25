import { z } from "zod";

/**
 * Common environment variables shared across all services
 */
export const commonEnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    HTTP_PORT: z.coerce.number().default(8080),
    CORS_ORIGIN: z.string().default("http://localhost:5173"),
    VERCEL: z.string().optional(),
    VERCEL_ENV: z.number().optional(),
});

/**
 * JWT configuration
 */
export const jwtEnvSchema = z.object({
    JWT_ACCESS_TOKEN_SECRET: z.string().min(1, "JWT access token secret is required"),
    JWT_ACCESS_TOKEN_EXPIRY: z.string().default("20m"),
    JWT_REFRESH_TOKEN_SECRET: z.string().min(1, "JWT refresh token secret is required"),
    JWT_REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
});

/**
 * Redis configuration
 */
export const redisEnvSchema = z.object({
    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_DB: z.coerce.number().default(0),
});

/**
 * Kafka configuration
 */
export const kafkaEnvSchema = z.object({
    KAFKA_BROKERS: z.string().default("localhost:9092"),
    KAFKA_CLIENT_ID: z.string().default("supply-chain-360"),
    KAFKA_GROUP_ID: z.string().default("supply-chain-group"),
});

/**
 * Database configuration
 */
export const databaseEnvSchema = z.object({
    DATABASE_URL: z.string().min(1, "Database URL is required"),
    DB_HOST: z.string().optional(),
    DB_PORT: z.coerce.number().optional(),
    DB_USER: z.string().optional(),
    DB_PASSWORD: z.string().optional(),
    DB_NAME: z.string().optional(),
});

/**
 * AWS/S3 configuration
 */
export const awsEnvSchema = z.object({
    AWS_REGION: z.string().default("us-east-1"),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    S3_BUCKET_NAME: z.string().optional(),
});

/**
 * Razorpay configuration
 */
export const razorpayEnvSchema = z.object({
    RAZORPAY_KEY_ID: z.string().optional(),
    RAZORPAY_KEY_SECRET: z.string().optional(),
    RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
});

/**
 * WebSocket configuration
 */
export const websocketEnvSchema = z.object({
    WS_PORT: z.coerce.number().default(3001),
    WS_PATH: z.string().default("/ws"),
});

/**
 * Clerk configuration
 */
export const clerkEnvSchema = z.object({
    CLERK_SECRET_KEY: z.string().min(1, "Clerk secret key is required"),
    CLERK_PUBLISHABLE_KEY: z.string().min(1, "Clerk publishable key is required"),
});

/**
 * Gemini configuration
 */
export const geminiEnvSchema = z.object({
    GEMINI_API_KEY: z.string().min(1, "Gemini API key is required"),
});

/**
 * Cloudinary configuration
 */
export const cloudinaryEnvSchema = z.object({
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
});

/**
 * Complete environment schema - combines all schemas
 */
export const envSchema = commonEnvSchema
    .merge(jwtEnvSchema)
    .merge(redisEnvSchema)
    .merge(kafkaEnvSchema)
    .merge(databaseEnvSchema)
    .merge(awsEnvSchema)
    .merge(websocketEnvSchema)
    .merge(razorpayEnvSchema)
    .merge(clerkEnvSchema)
    .merge(geminiEnvSchema)
    .merge(cloudinaryEnvSchema);

export type EnvConfig = z.infer<typeof envSchema>;
export type CommonEnvConfig = z.infer<typeof commonEnvSchema>;
export type JwtEnvConfig = z.infer<typeof jwtEnvSchema>;
export type RedisEnvConfig = z.infer<typeof redisEnvSchema>;
export type KafkaEnvConfig = z.infer<typeof kafkaEnvSchema>;
export type DatabaseEnvConfig = z.infer<typeof databaseEnvSchema>;
export type AwsEnvConfig = z.infer<typeof awsEnvSchema>;
export type WebsocketEnvConfig = z.infer<typeof websocketEnvSchema>;
