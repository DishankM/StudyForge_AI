"use client";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN_X = 52;
const TOP_MARGIN = 72;
const BOTTOM_MARGIN = 54;
const BRAND_NAME = "StudyForge";

type FontKey = "F1" | "F2" | "F3";

type TextBlock = {
  text: string;
  font?: FontKey;
  size?: number;
  color?: [number, number, number];
  spacingBefore?: number;
  spacingAfter?: number;
  align?: "left" | "center" | "right";
  indent?: number;
  uppercase?: boolean;
};

type PdfLayoutOptions = {
  filename: string;
  title: string;
  subtitle?: string;
  watermark?: string;
  blocks: TextBlock[];
};

function escapePdfText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r/g, "");
}

function sanitizePdfFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function estimateCharWidth(size: number, font: FontKey) {
  if (font === "F2") return size * 0.57;
  if (font === "F3") return size * 0.5;
  return size * 0.52;
}

function wrapText(text: string, maxWidth: number, size: number, font: FontKey) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [""];

  const maxChars = Math.max(12, Math.floor(maxWidth / estimateCharWidth(size, font)));
  const words = normalized.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }

    if (current) lines.push(current);

    if (word.length <= maxChars) {
      current = word;
      continue;
    }

    let start = 0;
    while (start < word.length) {
      lines.push(word.slice(start, start + maxChars));
      start += maxChars;
    }
    current = "";
  }

  if (current) lines.push(current);
  return lines;
}

function colorCommand([r, g, b]: [number, number, number]) {
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`;
}

function buildWatermark(text: string) {
  return [
    "q",
    "0.94 0.94 0.97 rg",
    "BT",
    "/F2 42 Tf",
    "1 0 0 1 0 0 Tm",
    `0.866 0.5 -0.5 0.866 ${PAGE_WIDTH / 2 - 120} ${PAGE_HEIGHT / 2 - 40} Tm`,
    `(${escapePdfText(text)}) Tj`,
    "ET",
    "Q",
  ].join("\n");
}

function buildHeader(title: string, subtitle?: string) {
  const lines = [
    "q",
    "0.129 0.129 0.145 rg",
    `0 ${PAGE_HEIGHT - 62} ${PAGE_WIDTH} 62 re f`,
    "Q",
    "q",
    "1 1 1 rg",
    "BT",
    "/F2 16 Tf",
    `1 0 0 1 ${MARGIN_X} ${PAGE_HEIGHT - 34} Tm`,
    `(${escapePdfText(title)}) Tj`,
    "ET",
    "Q",
  ];

  if (subtitle) {
    lines.push(
      "q",
      "0.835 0.835 0.875 rg",
      "BT",
      "/F3 10 Tf",
      `1 0 0 1 ${MARGIN_X} ${PAGE_HEIGHT - 49} Tm`,
      `(${escapePdfText(subtitle)}) Tj`,
      "ET",
      "Q"
    );
  }

  return lines.join("\n");
}

function buildFooter(pageNumber: number) {
  return [
    "q",
    "0.500 0.500 0.550 rg",
    `52 38 ${PAGE_WIDTH - 104} 0.8 re f`,
    "Q",
    "q",
    "0.470 0.470 0.520 rg",
    "BT",
    "/F3 9 Tf",
    `1 0 0 1 ${MARGIN_X} 24 Tm`,
    `(${escapePdfText(BRAND_NAME)}) Tj`,
    "ET",
    "BT",
    "/F3 9 Tf",
    `1 0 0 1 ${PAGE_WIDTH - MARGIN_X - 42} 24 Tm`,
    `(Page ${pageNumber}) Tj`,
    "ET",
    "Q",
  ].join("\n");
}

function buildPdfBytes({ title, subtitle, watermark = BRAND_NAME, blocks }: Omit<PdfLayoutOptions, "filename">) {
  const pages: string[] = [];
  let pageNumber = 1;
  let currentPage = `${buildWatermark(watermark)}\n${buildHeader(title, subtitle)}\n`;
  let y = PAGE_HEIGHT - TOP_MARGIN - 24;

  const flushPage = () => {
    currentPage += `\n${buildFooter(pageNumber)}`;
    pages.push(currentPage);
    pageNumber += 1;
    currentPage = `${buildWatermark(watermark)}\n${buildHeader(title, subtitle)}\n`;
    y = PAGE_HEIGHT - TOP_MARGIN - 24;
  };

  const ensureRoom = (requiredHeight: number) => {
    if (y - requiredHeight <= BOTTOM_MARGIN) {
      flushPage();
    }
  };

  const addLine = (
    text: string,
    {
      font = "F1",
      size = 12,
      color = [0.16, 0.16, 0.19] as [number, number, number],
      align = "left",
      indent = 0,
    }: Required<Pick<TextBlock, "font" | "size" | "color" | "align" | "indent">>
  ) => {
    const width = PAGE_WIDTH - MARGIN_X * 2 - indent;
    const lineWidth = text.length * estimateCharWidth(size, font);
    const x =
      align === "center"
        ? MARGIN_X + Math.max(0, (PAGE_WIDTH - MARGIN_X * 2 - lineWidth) / 2)
        : align === "right"
        ? PAGE_WIDTH - MARGIN_X - lineWidth
        : MARGIN_X + indent;

    currentPage += [
      "q",
      colorCommand(color),
      "BT",
      `/${font} ${size} Tf`,
      `1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm`,
      `(${escapePdfText(text)}) Tj`,
      "ET",
      "Q",
      "",
    ].join("\n");

    y -= Math.max(14, size + 5);
  };

  for (const block of blocks) {
    const font = block.font ?? "F1";
    const size = block.size ?? 12;
    const color = block.color ?? ([0.16, 0.16, 0.19] as [number, number, number]);
    const align = block.align ?? "left";
    const indent = block.indent ?? 0;
    const text = block.uppercase ? block.text.toUpperCase() : block.text;

    y -= block.spacingBefore ?? 0;

    if (!text.trim()) {
      y -= block.spacingAfter ?? 8;
      continue;
    }

    const usableWidth = PAGE_WIDTH - MARGIN_X * 2 - indent;
    const wrapped = wrapText(text, usableWidth, size, font);
    ensureRoom(wrapped.length * Math.max(14, size + 5) + (block.spacingAfter ?? 0));

    for (const line of wrapped) {
      addLine(line, { font, size, color, align, indent });
    }

    y -= block.spacingAfter ?? 0;
  }

  flushPage();

  const objects: string[] = [];
  objects.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj");

  const pageObjectIds = pages.map((_, index) => 6 + index * 2);
  const kids = pageObjectIds.map((id) => `${id} 0 R`).join(" ");
  objects.push(`2 0 obj << /Type /Pages /Count ${pages.length} /Kids [${kids}] >> endobj`);
  objects.push("3 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj");
  objects.push("4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj");
  objects.push("5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >> endobj");

  pages.forEach((content, index) => {
    const pageId = 6 + index * 2;
    const contentId = pageId + 1;
    objects.push(
      `${pageId} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${contentId} 0 R >> endobj`
    );
    objects.push(`${contentId} 0 obj << /Length ${content.length} >> stream\n${content}endstream endobj`);
  });

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}

export function markdownToPlainText(markdown: string) {
  return markdown
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`{1,3}(.*?)`{1,3}/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "- ")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function triggerPdfDownload({ filename, title, subtitle, blocks, watermark }: PdfLayoutOptions) {
  const bytes = buildPdfBytes({ title, subtitle, blocks, watermark });
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${sanitizePdfFileName(filename)}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadStudyNotesPdf({
  filename,
  title,
  content,
  format,
  wordCount,
}: {
  filename: string;
  title: string;
  content: string;
  format?: string;
  wordCount?: number;
}) {
  const plainText = markdownToPlainText(content);
  const paragraphs = plainText.split("\n");

  const blocks: TextBlock[] = [
    {
      text: "AI-Generated Study Notes",
      font: "F2",
      size: 11,
      color: [0.905, 0.431, 0.573],
      uppercase: true,
      spacingAfter: 10,
    },
    {
      text: title,
      font: "F2",
      size: 24,
      color: [0.09, 0.09, 0.12],
      spacingAfter: 8,
    },
    {
      text: `${format ? `${format} format` : "Study format"}${wordCount ? `  •  ${wordCount} words` : ""}`,
      font: "F3",
      size: 10,
      color: [0.45, 0.45, 0.52],
      spacingAfter: 18,
    },
    {
      text: "Prepared with StudyForge for fast revision, exam prep, and structured study.",
      font: "F1",
      size: 10.5,
      color: [0.28, 0.28, 0.34],
      spacingAfter: 20,
    },
  ];

  paragraphs.forEach((paragraph) => {
    const trimmed = paragraph.trim();
    if (!trimmed) {
      blocks.push({ text: "", spacingAfter: 8 });
    } else if (trimmed.length < 70 && /^[A-Z0-9][A-Za-z0-9 ,:/()-]+$/.test(trimmed)) {
      blocks.push({
        text: trimmed,
        font: "F2",
        size: 14,
        color: [0.12, 0.12, 0.15],
        spacingBefore: 8,
        spacingAfter: 6,
      });
    } else {
      blocks.push({
        text: trimmed,
        font: "F1",
        size: 11.5,
        color: [0.18, 0.18, 0.22],
        spacingAfter: 4,
      });
    }
  });

  triggerPdfDownload({
    filename,
    title,
    subtitle: "StudyForge Notes Export",
    watermark: BRAND_NAME,
    blocks,
  });
}

export function downloadExamPaperPdf({
  filename,
  examPaper,
}: {
  filename: string;
  examPaper: any;
}) {
  const data = examPaper?.questions;
  const header = data?.header || {};
  const sections = data?.sections || [];

  const blocks: TextBlock[] = [
    {
      text: header.university || "University Examination",
      font: "F2",
      size: 16,
      color: [0.08, 0.08, 0.1],
      align: "center",
      spacingAfter: 8,
      uppercase: true,
    },
    {
      text: header.examTitle || examPaper?.title || "Examination Paper",
      font: "F2",
      size: 19,
      color: [0.08, 0.08, 0.1],
      align: "center",
      spacingAfter: 6,
    },
    {
      text: header.subject || examPaper?.subject || "",
      font: "F1",
      size: 12,
      color: [0.3, 0.3, 0.36],
      align: "center",
      spacingAfter: 20,
    },
    {
      text: `Duration: ${header.duration || `${examPaper?.duration || ""} minutes`}`,
      font: "F2",
      size: 11,
      color: [0.12, 0.12, 0.15],
      spacingAfter: 2,
    },
    {
      text: `Maximum Marks: ${header.totalMarks ?? examPaper?.totalMarks ?? ""}`,
      font: "F2",
      size: 11,
      color: [0.12, 0.12, 0.15],
      spacingAfter: 14,
    },
    {
      text: "Instructions to Candidates",
      font: "F2",
      size: 12.5,
      uppercase: true,
      spacingAfter: 8,
    },
  ];

  (header.instructions || []).forEach((instruction: string, index: number) => {
    blocks.push({
      text: `${index + 1}. ${instruction}`,
      font: "F1",
      size: 11.5,
      spacingAfter: 4,
    });
  });

  sections.forEach((section: any, sectionIndex: number) => {
    blocks.push({ text: "", spacingAfter: 8 });
    blocks.push({
      text: section.name || `Section ${sectionIndex + 1}`,
      font: "F2",
      size: 13,
      uppercase: true,
      spacingAfter: 4,
    });

    if (section.instructions) {
      blocks.push({
        text: section.instructions,
        font: "F3",
        size: 10.5,
        color: [0.36, 0.36, 0.42],
        spacingAfter: 10,
      });
    }

    (section.questions || []).forEach((question: any) => {
      blocks.push({
        text: `${question.number}. ${question.text}`,
        font: "F1",
        size: 11.5,
        color: [0.15, 0.15, 0.18],
        spacingAfter: 3,
      });
      blocks.push({
        text: `(${question.marks} Marks)`,
        font: "F2",
        size: 10.5,
        color: [0.35, 0.12, 0.12],
        align: "right",
        spacingAfter: 8,
      });
    });
  });

  triggerPdfDownload({
    filename,
    title: header.examTitle || examPaper?.title || "Examination Paper",
    subtitle: header.university || "StudyForge Exam Paper Export",
    watermark: BRAND_NAME,
    blocks,
  });
}
