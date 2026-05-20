import z from "zod";

const envSchema = z.object({
  JWT_VERIFY_SECRET: z.string().min(1),
  MAIL_USER: z.email(),
  MAIL_PASS: z.string().min(1),
  DATABASE_URL: z.string().min(1),
});

export const env = envSchema.parse(process.env);
