import { z } from 'zod';

export const CreateCompanySchema = z.object({
  code: z.string().min(1, 'Kode harus diisi'),
  legalName: z.string().min(1, 'Nama Perusahaan harus diisi'),
  npwp: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$/, 'Format NPWP tidak valid (XX.XXX.XXX.X-XXX.XXX)')
    .optional()
    .nullable()
    .or(z.literal('')),
  bpjsNo: z.string().optional().nullable(),
  isActive: z.boolean().default(true)
});

export const UpdateCompanySchema = CreateCompanySchema.and(
  z.object({
    id: z.string().min(1)
  })
);
