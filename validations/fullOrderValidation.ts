import { z } from "zod";

const menuSchema = z.object({
  name: z.string(),
  price: z.number().nonnegative(),
});

const orderItemSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().int().positive(),
  notes: z.string().nullable(),
  menu: menuSchema,
});

const tableSchema = z.object({
  id: z.string().uuid(),
  number: z.number().int(),
});

const customerSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  phone: z.string(),
});

export const fullOrderSchema = z.object({
  id: z.string().uuid(),
  status: z.string(),
  createdAt: z.string().datetime(),

  Table: tableSchema.nullable(),

  Customer: customerSchema.nullable(),

  orderItems: z.array(orderItemSchema),
});

export type TFullOrder = z.infer<typeof fullOrderSchema>;
