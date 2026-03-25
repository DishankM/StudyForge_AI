import { createRequire } from "module";
import path from "path";
import { readFile } from "fs/promises";

const require = createRequire(import.meta.url);

function isAbsoluteHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function resolveLocalUpload(fileUrl: string) {
  const cleaned = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
  return path.join(process.cwd(), "public", cleaned);
}

async function loadPdfBuffer(fileUrl: string): Promise<Buffer> {
  if (fileUrl.startsWith("/uploads/") || fileUrl.startsWith("uploads/")) {
    const localPath = resolveLocalUpload(fileUrl);
    return await readFile(localPath);
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const urlToFetch = isAbsoluteHttpUrl(fileUrl) ? fileUrl : new URL(fileUrl, baseUrl).toString();

  const response = await fetch(urlToFetch);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function cleanExtractedText(text: string) {
  return text.replace(/\s+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

async function extractWithPdfParse(buffer: Buffer): Promise<string> {
  let pdfParse: any;
  try {
    pdfParse = require("pdf-parse/lib/pdf-parse.js");
  } catch (loadError) {
    console.error("PDF parser load error:", loadError);
    throw new Error("PDF parser is not available");
  }

  if (typeof pdfParse !== "function") {
    throw new Error("pdfParse is not a function");
  }

  const data = await pdfParse(buffer);
  return cleanExtractedText(data.text || "");
}

async function extractWithOcr(buffer: Buffer): Promise<string> {
  let pdfjsLib: any;
  let createCanvas: any;
  let createWorker: any;

  try {
    pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  } catch (loadError) {
    console.error("pdfjs-dist load error:", loadError);
    throw new Error("PDF renderer is not available for OCR");
  }

  try {
    ({ createCanvas } = require("@napi-rs/canvas"));
  } catch (loadError) {
    console.error("Canvas load error:", loadError);
    throw new Error("Canvas is not available for OCR");
  }

  try {
    ({ createWorker } = require("tesseract.js"));
  } catch (loadError) {
    console.error("Tesseract load error:", loadError);
    throw new Error("OCR engine is not available");
  }

  const pdfjs = pdfjsLib?.getDocument ? pdfjsLib : pdfjsLib?.default;
  if (!pdfjs?.getDocument) {
    throw new Error("PDF renderer is not available for OCR");
  }

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    disableWorker: true,
  });
  const pdf = await loadingTask.promise;
  const maxPages = Math.min(pdf.numPages, 5);
  const scale = 2;

  const worker = await createWorker("eng");
  try {
    let fullText = "";

    for (let pageNum = 1; pageNum <= maxPages; pageNum += 1) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = createCanvas(viewport.width, viewport.height);
      const ctx = canvas.getContext("2d");

      await page.render({ canvasContext: ctx, viewport }).promise;
      const imageBuffer = canvas.toBuffer("image/png");
      const result = await worker.recognize(imageBuffer);

      if (result?.data?.text) {
        fullText += `\n${result.data.text}`;
      }
    }

    return cleanExtractedText(fullText);
  } finally {
    await worker.terminate();
  }
}

export async function extractTextFromPDF(fileUrl: string): Promise<string> {
  try {
    const buffer = await loadPdfBuffer(fileUrl);

    try {
      const parsedText = await extractWithPdfParse(buffer);
      if (parsedText && parsedText.length >= 200) {
        return parsedText;
      }
    } catch (error) {
      console.warn("Primary PDF text extraction failed, falling back to OCR:", error);
    }

    const ocrText = await extractWithOcr(buffer);

    if (!ocrText || ocrText.length < 50) {
      throw new Error("PDF appears to be empty or unreadable");
    }

    return ocrText;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract text from PDF");
  }
}
