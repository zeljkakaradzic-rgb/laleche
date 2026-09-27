"use server";

import { z } from "zod";
import { db } from "@/lib/db";

const orderSchema = z.object({
  customerName: z.string().min(2).max(120),
  phone: z.string().min(6).max(30),
  address: z.string().min(3).max(200),
  city: z.string().min(2).max(100),
  note: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
});

export type CreateOrderInput = z.infer<typeof orderSchema>;
export type CreateOrderResult =
  | { ok: true; orderId: string; total: number }
  | { ok: false; error: string };

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Podaci u formi nisu validni. Proveri sva polja." };
  }
  const data = parsed.data;

  try {
    const result = await db.$transaction(async (tx) => {
      const variantIds = data.items.map((i) => i.variantId);
      const variants = await tx.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: { product: true },
      });

      const variantById = new Map(variants.map((v) => [v.id, v]));

      let total = 0;
      for (const item of data.items) {
        const variant = variantById.get(item.variantId);
        if (!variant) {
          throw new Error("Jedan od proizvoda u torbi više nije dostupan.");
        }
        if (variant.stock < item.quantity) {
          throw new Error(
            `Nema dovoljno na stanju za "${variant.product.name}" (${variant.size}, ${variant.color}).`,
          );
        }
        total += variant.product.price * item.quantity;
      }

      const order = await tx.order.create({
        data: {
          customerName: data.customerName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          note: data.note,
          total,
          status: "NEW",
          items: {
            create: data.items.map((item) => {
              const variant = variantById.get(item.variantId)!;
              return {
                productId: variant.productId,
                variantId: variant.id,
                quantity: item.quantity,
                price: variant.product.price,
              };
            }),
          },
        },
      });

      for (const item of data.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return { orderId: order.id, total };
    });

    return { ok: true, orderId: result.orderId, total: result.total };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Greška prilikom kreiranja porudžbine.";
    return { ok: false, error: message };
  }
}
