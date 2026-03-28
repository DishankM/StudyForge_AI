export const ACCEPTED_UPLOAD_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "text/plain": [".txt"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
} as const;

export const ACCEPTED_UPLOAD_MIME_TYPES = Object.keys(ACCEPTED_UPLOAD_TYPES);

export const MAX_DOCUMENT_UPLOAD_SIZE = 50 * 1024 * 1024;

export function sanitizeUploadFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}
