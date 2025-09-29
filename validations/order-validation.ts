import { z } from "zod";

export const orderItemSchema = z.object({
  id: z.string().uuid().optional(),
  quantity: z.number().int().min(1),
  notes: z.string().max(255).nullable(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  orderId: z.string().uuid().optional(),
  menuId: z.string().uuid(),
});

export const orderSchema = z.object({
  id: z.string().uuid().optional(),
  status: z.string().default("Pending").optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  customerId: z.string().uuid(),
  tableId: z.string().uuid().nullable().optional(),
});

export type TOrderItem = z.infer<typeof orderItemSchema>;
export type TOrder = z.infer<typeof orderSchema>;
