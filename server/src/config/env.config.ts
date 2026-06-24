import dotenv from 'dotenv';
import * as z from 'zod';

dotenv.config();

const envSchema = z.object({
  JWT_ACCESS_EXPIRE_IN: z
    .string()
    .min(1, 'JWT_ACCESS_EXPIRE_IN cannot be empty'),
  JWT_REFRESH_EXPIRE_IN: z
    .string()
    .min(1, 'JWT_REFRESH_EXPIRE_IN cannot be empty'),
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  JWT_ACCESS_TOKEN_SECRET: z
    .string('Jwt access token secret is missing in env')
    .min(1, 'JWT_ACCESS_TOKEN_SECRET cannot be empty'),
  JWT_REFRESH_TOKEN_SECRET: z
    .string('Jwt refresh token secret is missing in env')
    .min(1, 'JWT_REFRESH_TOKEN_SECRET cannot be empty'),

  MONGO_URI: z.string().min(1, 'MONGO_URI is not defined'),
});

const parsed = envSchema.safeParse(process.env);

if (parsed.error) {
  const message = parsed.error.issues.map((item) => item.message).join(', ');
  console.log(message);
  process.exit(1);
}

const config = {
  PORT: parsed.data.PORT,
  NODE_ENV: parsed.data.NODE_ENV,
  JWT_REFRESH_TOKEN_SECRET: parsed.data.JWT_REFRESH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_SECRET: parsed.data.JWT_ACCESS_TOKEN_SECRET,
  MONGO_URI: parsed.data.MONGO_URI,
};

export default config;
