type GenerationMode = "fast" | "full";
type GenerationAction = "notes" | "mcqs" | "viva";

export interface TrustDocumentLike {
  fileName: string;
  fileSize: number;
  mimeType: string;
  documentType?: string | null;
}

export interface CoverageSummary {
  processedSections: number;
  totalSections: number;
  label: string;
  detail: string;
}

export interface TrustSignal {
  tone: "info" | "warning";
  title: string;
  detail: string;
}

const SECTION_SIZE_HINTS: Record<string, number> = {
  "application/pdf": 180_000,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": 90_000,
  "text/plain": 25_000,
};

const ACTION_BASE_SECONDS: Record<GenerationAction, Record<GenerationMode, number>> = {
  notes: { fast: 22, full: 45 },
  mcqs: { fast: 18, full: 42 },
  viva: { fast: 20, full: 44 },
};

const ACTION_SECTION_SECONDS: Record<GenerationAction, Record<GenerationMode, number>> = {
  notes: { fast: 7, full: 10 },
  mcqs: { fast: 6, full: 9 },
  viva: { fast: 6, full: 9 },
};

function formatDuration(seconds: number) {
  if (seconds < 60) {
    return `${Math.max(15, Math.round(seconds / 5) * 5)} sec`;
  }

  const minutes = seconds / 60;
  if (minutes < 2) {
    return "1-2 min";
  }
  if (minutes < 4) {
    return "2-4 min";
  }

  return "4+ min";
}

export function estimateDocumentSections(document: TrustDocumentLike) {
  const sectionSizeHint = SECTION_SIZE_HINTS[document.mimeType] ?? 120_000;
  return Math.max(1, Math.min(18, Math.round(document.fileSize / sectionSizeHint) || 1));
}

export function getCoverageSummary(
  mode: GenerationMode,
  estimatedSections: number
): CoverageSummary {
  const processedSections =
    mode === "fast" ? Math.min(Math.max(2, Math.ceil(estimatedSections * 0.35)), estimatedSections) : estimatedSections;

  return {
    processedSections,
    totalSections: estimatedSections,
    label:
      mode === "fast"
        ? `Samples about ${processedSections} of ${estimatedSections} source sections`
        : `Processes all ${estimatedSections} detected source sections`,
    detail:
      mode === "fast"
        ? "Best for a quick first pass. Smaller topics near the end of the file may be missed."
        : "Best for stronger source coverage, especially when important units are spread across the document.",
  };
}

export function getGenerationTimeEstimate(
  action: GenerationAction,
  mode: GenerationMode,
  estimatedSections: number
) {
  const seconds =
    ACTION_BASE_SECONDS[action][mode] + ACTION_SECTION_SECONDS[action][mode] * estimatedSections;

  return formatDuration(seconds);
}

export function getDocumentTrustSignals(document: TrustDocumentLike) {
  const signals: TrustSignal[] = [
    {
      tone: "info",
      title: "Source-backed generation",
      detail: "Outputs are created from extracted text in this file, so clearer and more complete documents usually produce stronger results.",
    },
  ];

  if (document.fileSize < 70_000) {
    signals.push({
      tone: "warning",
      title: "Small source file",
      detail: "This upload looks short, so the AI may have limited context and could produce repetitive or shallow output.",
    });
  }

  if (document.mimeType === "application/pdf") {
    signals.push({
      tone: "info",
      title: "PDF extraction can vary",
      detail: "Text-based PDFs are usually reliable. Scanned or image-heavy PDFs can reduce coverage and introduce OCR mistakes.",
    });
  }

  if (document.documentType?.toLowerCase().includes("slides")) {
    signals.push({
      tone: "warning",
      title: "Slide decks need review",
      detail: "Slides often omit transitions and detail, so generated notes may need manual cleanup for missing context.",
    });
  }

  return signals;
}
