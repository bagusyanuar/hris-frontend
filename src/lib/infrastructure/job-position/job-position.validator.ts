import { z } from 'zod';

export const CreateJobPositionSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  departmentId: z.string().min(1, 'Departemen harus diisi'),
  jobTitleId: z.string().min(1, 'Job Title harus diisi'),
  parentId: z.string().nullable().default(null),
  headcountQuota: z.number().min(1, 'Kuota minimal 1').default(1),
  description: z.string().nullable().default(null),
  status: z.enum(['active', 'inactive']).default('active')
});

export const UpdateJobPositionSchema = CreateJobPositionSchema.and(
  z.object({
    id: z.string().min(1)
  })
);
