import * as z from 'zod';

export const clientSchema = z.object({
  body: z.object({
    name: z
      .string('Company name is required')
      .min(3, 'Company name cannot be less than 3 characters')
      .max(50, 'Company name cannot exceed 50 characters')
      .trim(),

    owner: z.string('Owner id is required').regex(/^[0-9a-fA-F]{24}$/, {
      message: 'Invalid MongoDB ObjectId',
    }),
  }),
});
