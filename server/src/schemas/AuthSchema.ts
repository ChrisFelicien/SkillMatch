import * as z from 'zod';

export const registerSchema = z.object({
  body: z
    .object({
      firstName: z.string('User first name is required'),
      lastName: z.string('User last name is required'),
      email: z.email('Please provide valid email'),
      password: z
        .string('Please provide user password')
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
          /[!@#$%^&*(),.?":{}|<>]/,
          'Password must contain at least one special character',
        ),
      confirmPassword: z.string('Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Password and confirm password should match',
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email('Email is required'),
    password: z.string('Password is required').min(1, 'Password is required'),
  }),
});
