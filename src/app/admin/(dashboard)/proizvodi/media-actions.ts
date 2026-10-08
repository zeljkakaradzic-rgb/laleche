"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { randomUUID } from "node:crypto";

const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB

export async function uploadMedia(productId: string, formData: FormData) {
  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) return;

  const existingCount = await db.productMedia.count({
    where: { productId },
  });

  let index = existingCount;

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) continue;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) continue;

    const extension =
      file.name.split(".").pop()?.toLowerCase() ||
      (isVideo ? "mp4" : "jpg");

    const filename = `products/${productId}/${randomUUID()}.${extension}`;

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    await db.productMedia.create({
      data: {
        productId,
        type: isVideo ? "VIDEO" : "IMAGE",
        url: blob.url,
        sortOrder: index++,
      },
    });
  }

  revalidatePath(`/admin/proizvodi/${productId}`);
  revalidatePath("/");
  revalidatePath("/prodavnica");
}
