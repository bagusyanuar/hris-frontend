import { z } from 'zod';

export const CreateBranchSchema = z.object({
  code: z.string().min(1, 'Kode harus diisi'),
  name: z.string().min(1, 'Nama harus diisi'),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active')
});

export const UpdateBranchSchema = CreateBranchSchema.and(
  z.object({
    id: z.string().min(1)
  })
);
