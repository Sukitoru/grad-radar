import { z } from 'zod';

// Schema validating the input when a new account is registered
export const registerSchema = z.object({
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters long.' })
    .max(50, { message: 'Username cannot exceed 50 characters.' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores.' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
});

// Schema validating the input when a user logs in
export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' })
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
