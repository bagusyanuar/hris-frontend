import { z } from 'zod';

export const CreateBranchSchema = z.object({
  companyId: z.string().min(1, 'ID Perusahaan harus diisi'),
  code: z.string().min(1, 'Kode harus diisi'),
  name: z.string().min(1, 'Nama harus diisi'),
  city: z.string().optional().nullable(),
  isMain: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

export const UpdateBranchSchema = CreateBranchSchema.and(
  z.object({
    id: z.string().min(1)
  })
);
