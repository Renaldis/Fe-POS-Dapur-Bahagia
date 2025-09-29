import { z } from "zod";

export const tableSchema = z.object({
  id: z.string().uuid(),
  number: z.number().int().positive(),
  capacity: z.number().int().min(1),
  status: z.enum(["available", "occupied", "unavailable"]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type TTable = z.infer<typeof tableSchema>;
