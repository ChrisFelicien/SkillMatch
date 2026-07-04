import { JobEmploymentType, JobLocationType } from '@/interfaces/IJob';
import * as z from 'zod';

export const createJobSchema = z.object({
  body: z
    .object({
      title: z
        .string('Job must have a title')
        .trim()
        .min(5, 'Job title cannot be less than 5 characters')
        .max(100, 'Job title cannot exceed 100 characters'),
      description: z
        .string('Job must have a description')
        .trim()
        .min(50, 'Job description cannot be less than 50 characters')
        .max(5000, 'Job description cannot exceed 5000 characters'),

      location: z
        .string('Provide job location')
        .trim()
        .min(3, 'Job location cannot be less than 3 characters'),

      employmentType: z.enum(Object.values(JobEmploymentType), {
        error: (issues) =>
          `Invalid employment type. Expected full-time, part-time,contract, internship, or freelance, but received: "${issues.input}"`,
      }),

      jobLocationType: z.enum(Object.values(JobLocationType), {
        error: (issues) =>
          `Invalid job location type. Expected full-time, part-time,contract, internship, or freelance, but received: "${issues.input}"`,
      }),

      salary: z.object({
        min: z
          .number('Please provide minimum salary for this position')
          .min(0, 'The minimum salary cannot be negative'),
        max: z.number('Please provide maximum salary for this position'),
        currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'ZAR', 'CAD', 'AUD'], {
          error: (issues) =>
            `Invalid currency. Expected 'USD', 'EUR', 'GBP', 'JPY', 'ZAR', 'CAD', 'AUD', but received: "${issues.input}"`,
        }),
      }),
      //   This will be changed when company model will be added
      company: z
        .string('Please provide your company.')
        .min(3, 'Company name cannot be less than 3 characters')
        .max(50, 'Company name cannot exceed 50 characters'),
      //
      skills: z
        .array(
          z
            .string('Skills must be string')
            .trim()
            .min(2, 'skills should have at lest two characters'),
        )
        .min(1, 'Job should have at least one required skills')
        .max(20, 'Job skills cannot exceed 20'),
      experienceLevel: z.enum(['junior', 'mid', 'senior', 'lead'], {
        error: (issues) =>
          `Invalid experience level provide. Expected junior, mid, senior,  or lead, but received: "${issues.input}"`,
      }),
    })
    .refine((data) => data.salary.min <= data.salary.max, {
      error: `The minimum salary should be less than the maximum salary`,
    }),
});
