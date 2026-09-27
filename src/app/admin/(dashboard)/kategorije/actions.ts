"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";

export async function toggleCategory(id: string) {
  const category = await db.category.findUnique({ where: { id } });
  if (!category) return;
  await db.category.update({ where: { id }, data: { isVisible: !category.isVisible } });
  revalidatePath("/admin/kategorije");
  revalidatePath("/");
  revalidatePath("/prodavnica");
}

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const slug = slugify(name);
  const count = await db.category.count();

  await db.category.create({
    data: { name, slug, sortOrder: count, isVisible: true },
  });

  revalidatePath("/admin/kategorije");
  revalidatePath("/");
}

export async function moveCategory(id: string, direction: "up" | "down") {
  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= categories.length) return;

  const current = categories[index];
  const swapWith = categories[swapIndex];

  await db.$transaction([
    db.category.update({ where: { id: current.id }, data: { sortOrder: swapWith.sortOrder } }),
    db.category.update({ where: { id: swapWith.id }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidatePath("/admin/kategorije");
  revalidatePath("/");
}
