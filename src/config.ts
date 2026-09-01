import { z } from 'zod';
import dotenv from 'dotenv';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(4000),
  COOKIE_SECRET: z.string().min(10, '세션 아이디 비밀번호는 최소 10자 이상입니다.'),
  TOKEN_SECRET: z.string().min(10, '토큰 시크릿은 최소 10자 이상입니다.'),
  ACCESS_TOKEN_EXPIRES_IN: z.enum(['15m', '1h', '6h']).default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.enum(['7d']).default('7d'),
  CLIENT_DOMAIN: z.string(),
  JSON_LIMIT: z.string(),
  MAX_RETRIES: z.coerce.number(),
  OPTIMISTIC_LOCK_RETRY_DELAY_MS: z.coerce.number(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.coerce.number().optional(),
  ENABLE_RESOURCE_MONITORING: z.coerce.boolean().default(false),
  BULK_NOTIFICATION_SIZE: z.coerce.number().default(100),
  NOTIFICATION_SCHEDULER_INTERVAL_MS: z.coerce.number().default(5000),
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_S3_BUCKET_NAME: z.string().optional(),
});

type EnvParsed = z.infer<typeof envSchema>;

const getCredentials = () => {
  dotenv.config({
    path:
      process.env.NODE_ENV === 'development'
        ? '.env.dev'
        : process.env.NODE_ENV === 'test'
          ? '.env.test'
          : '.env.prod',
  });

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(result.error.issues[0].path + ': ' + result.error.issues[0].message);
  }

  return result.data;
};

const credentials = getCredentials();

export const getEnv = (): EnvParsed => {
  return credentials;
};

export const getAwsEnv = () => {
  const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME } =
    getEnv();

  if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_S3_BUCKET_NAME) {
    throw new Error('AWS file storage is not configured.');
  }

  return {
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET_NAME,
  };
};
