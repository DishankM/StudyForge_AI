import path from "path";
import { unlink } from "fs/promises";
import { del } from "@vercel/blob";

export function isLegacyLocalUpload(fileUrl: string | null | undefined) {
  if (!fileUrl) return false;
  return fileUrl.startsWith("/uploads/") || fileUrl.startsWith("uploads/");
}

export function isBlobStorageUrl(fileUrl: string | null | undefined) {
  if (!fileUrl) return false;
  return fileUrl.includes(".public.blob.vercel-storage.com");
}

export async function deleteStoredFile(fileUrl: string | null | undefined) {
  if (!fileUrl) return;

  if (isLegacyLocalUpload(fileUrl)) {
    const relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
    const filePath = path.join(process.cwd(), "public", relativePath);

    try {
      await unlink(filePath);
    } catch (error: any) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }

    return;
  }

  if (isBlobStorageUrl(fileUrl) && process.env.BLOB_READ_WRITE_TOKEN) {
    await del(fileUrl);
  }
}
