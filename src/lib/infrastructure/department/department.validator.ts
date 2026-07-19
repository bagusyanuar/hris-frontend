import { z } from 'zod';

export const CreateDepartmentSchema = z.object({
  code: z
    .string()
    .min(2, 'Kode departemen minimal 2 karakter')
    .max(20, 'Kode departemen maksimal 20 karakter'),
  name: z
    .string()
    .min(3, 'Nama departemen minimal 3 karakter')
    .max(100, 'Nama departemen maksimal 100 karakter'),
  parentId: z.string().nullable().default(null),
  description: z.string().max(255, 'Deskripsi maksimal 255 karakter').optional(),
  status: z.enum(['active', 'inactive']).default('active')
});

export const UpdateDepartmentSchema = CreateDepartmentSchema.and(
  z.object({ id: z.string().min(1, 'ID Departemen tidak boleh kosong') })
);
