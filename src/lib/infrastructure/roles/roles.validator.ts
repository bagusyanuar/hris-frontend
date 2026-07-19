import { z } from 'zod';

export const CreateRoleSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  description: z.string().optional(),
  permissions: z.array(z.string()).default([])
});

export const UpdateRoleSchema = CreateRoleSchema.and(
  z.object({
    id: z.string().min(1)
  })
);
