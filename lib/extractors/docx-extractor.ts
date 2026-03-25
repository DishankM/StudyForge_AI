import mammoth from "mammoth";

function isAbsoluteHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

export async function extractTextFromDOCX(fileUrl: string): Promise<string> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const urlToFetch = isAbsoluteHttpUrl(fileUrl)
      ? fileUrl
      : new URL(fileUrl, baseUrl).toString();

    const response = await fetch(urlToFetch);
    if (!response.ok) {
      throw new Error(`Failed to fetch DOCX: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await mammoth.extractRawText({ buffer });

    const cleanText = result.value.replace(/\s+/g, " ").trim();

    if (!cleanText || cleanText.length < 100) {
      throw new Error("DOCX appears to be empty");
    }

    return cleanText;
  } catch (error) {
    console.error("DOCX extraction error:", error);
    throw new Error("Failed to extract text from DOCX");
  }
}
