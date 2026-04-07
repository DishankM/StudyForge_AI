import { isTrustedDocumentUrl } from "@/lib/uploads";
import { extractTextFromDOCX } from "./docx-extractor";
import { extractTextFromPDF } from "./pdf-extractor";

function isAbsoluteHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

export async function extractDocumentText(
  fileUrl: string,
  mimeType: string
): Promise<string> {
  try {
    if (!isTrustedDocumentUrl(fileUrl)) {
      throw new Error("Untrusted document URL");
    }

    switch (mimeType) {
      case "application/pdf":
        return await extractTextFromPDF(fileUrl);

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return await extractTextFromDOCX(fileUrl);

      case "text/plain": {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const urlToFetch = isAbsoluteHttpUrl(fileUrl)
          ? fileUrl
          : new URL(fileUrl, baseUrl).toString();
        const response = await fetch(urlToFetch);
        if (!response.ok) {
          throw new Error(`Failed to fetch text file: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        return text.trim();
      }

      default:
        throw new Error(`Unsupported file type: ${mimeType}`);
    }
  } catch (error) {
    console.error("Document extraction error:", error);
    throw error;
  }
}
