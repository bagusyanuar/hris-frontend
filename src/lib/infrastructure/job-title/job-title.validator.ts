import { z } from 'zod';

export const CreateJobTitleSchema = z.object({
    code: z.string().min(1, 'Kode harus diisi'),
    name: z.string().min(1, 'Nama harus diisi'),
    description: z.string().nullable().default(null),
    status: z.enum(['active', 'inactive']).default('active'),
});

export const UpdateJobTitleSchema = CreateJobTitleSchema.and(
	z.object({
		id: z.string().min(1)
	})
);
