"use server";

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const UPLOAD_ROOT = join(process.cwd(), "public", "uploads", "products");
const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25MB

export async function uploadMedia(productId: string, formData: FormData) {
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return;

  const productDir = join(UPLOAD_ROOT, productId);
  await mkdir(productDir, { recursive: true });

  const existingCount = await db.productMedia.count({ where: { productId } });

  let index = existingCount;
  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) continue;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) continue;

    const extension = file.name.split(".").pop() || (isVideo ? "mp4" : "jpg");
    const filename = `${randomUUID()}.${extension}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(join(productDir, filename), bytes);

    await db.productMedia.create({
      data: {
        productId,
        type: isVideo ? "VIDEO" : "IMAGE",
        url: `/uploads/products/${productId}/${filename}`,
        sortOrder: index++,
      },
    });
  }

  revalidatePath(`/admin/proizvodi/${productId}`);
  revalidatePath("/");
  revalidatePath("/prodavnica");
}
