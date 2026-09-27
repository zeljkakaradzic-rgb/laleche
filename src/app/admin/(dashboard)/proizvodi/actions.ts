"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";

const productSchema = z.object({
  name: z.string().min(2).max(150),
  categoryId: z.string().min(1),
  price: z.coerce.number().positive(),
  oldPrice: z.coerce.number().positive().optional().or(z.literal("")),
  material: z.string().max(150).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "SOLD_OUT", "ARCHIVED"]),
  featured: z.union([z.literal("on"), z.undefined()]).optional(),
});

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/prodavnica");
}

export async function createProduct(formData: FormData) {
  const parsed = productSchema.parse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    oldPrice: formData.get("oldPrice") || undefined,
    material: formData.get("material") || undefined,
    description: formData.get("description") || undefined,
    status: formData.get("status"),
    featured: formData.get("featured") ?? undefined,
  });

  const baseSlug = slugify(parsed.name);
  let slug = baseSlug;
  let suffix = 1;
  while (await db.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const product = await db.product.create({
    data: {
      name: parsed.name,
      slug,
      categoryId: parsed.categoryId,
      price: parsed.price,
      oldPrice: parsed.oldPrice ? Number(parsed.oldPrice) : null,
      material: parsed.material || null,
      description: parsed.description || null,
      status: parsed.status,
      featured: parsed.featured === "on",
    },
  });

  revalidatePublic();
  redirect(`/admin/proizvodi/${product.id}`);
}

export async function updateProduct(productId: string, formData: FormData) {
  const parsed = productSchema.parse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    oldPrice: formData.get("oldPrice") || undefined,
    material: formData.get("material") || undefined,
    description: formData.get("description") || undefined,
    status: formData.get("status"),
    featured: formData.get("featured") ?? undefined,
  });

  await db.product.update({
    where: { id: productId },
    data: {
      name: parsed.name,
      categoryId: parsed.categoryId,
      price: parsed.price,
      oldPrice: parsed.oldPrice ? Number(parsed.oldPrice) : null,
      material: parsed.material || null,
      description: parsed.description || null,
      status: parsed.status,
      featured: parsed.featured === "on",
    },
  });

  revalidatePublic();
  revalidatePath(`/admin/proizvodi/${productId}`);
}

export async function deleteProduct(productId: string) {
  await db.product.delete({ where: { id: productId } });
  revalidatePublic();
  redirect("/admin/proizvodi");
}

export async function addVariant(productId: string, formData: FormData) {
  const size = String(formData.get("size") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const stock = Number(formData.get("stock") ?? 0);

  if (!size || !color || Number.isNaN(stock)) return;

  await db.productVariant.upsert({
    where: { productId_size_color: { productId, size, color } },
    update: { stock },
    create: { productId, size, color, stock },
  });

  revalidatePath(`/admin/proizvodi/${productId}`);
  revalidatePublic();
}

export async function updateVariantStock(variantId: string, formData: FormData) {
  const stock = Number(formData.get("stock") ?? 0);
  if (Number.isNaN(stock) || stock < 0) return;

  const variant = await db.productVariant.update({
    where: { id: variantId },
    data: { stock },
  });

  revalidatePath(`/admin/proizvodi/${variant.productId}`);
  revalidatePublic();
}

export async function deleteVariant(productId: string, variantId: string) {
  try {
    await db.productVariant.delete({ where: { id: variantId } });
  } catch {
    // Varijanta je vezana za postojeću porudžbinu i ne može se obrisati.
  }
  revalidatePath(`/admin/proizvodi/${productId}`);
  revalidatePublic();
}

export async function deleteMedia(productId: string, mediaId: string) {
  await db.productMedia.delete({ where: { id: mediaId } });
  revalidatePath(`/admin/proizvodi/${productId}`);
  revalidatePublic();
}

export async function saveRecommendations(productId: string, formData: FormData) {
  const recommendedIds = formData.getAll("recommend").map(String);

  await db.$transaction([
    db.productRecommendation.deleteMany({ where: { baseProductId: productId } }),
    ...(recommendedIds.length > 0
      ? [
          db.productRecommendation.createMany({
            data: recommendedIds.map((id) => ({
              baseProductId: productId,
              recommendedProductId: id,
            })),
          }),
        ]
      : []),
  ]);

  revalidatePath(`/admin/proizvodi/${productId}`);
  revalidatePublic();
}
