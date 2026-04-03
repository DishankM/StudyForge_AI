const DEFAULT_TARGET_CHUNK_CHARS = 4000;
const DEFAULT_MAX_CHUNK_CHARS = 5000;

function splitLongSegment(segment: string, maxChunkChars: number) {
  if (segment.length <= maxChunkChars) {
    return [segment];
  }

  const sentenceParts = segment.match(/[^.!?]+[.!?]+|\S.+$/g) ?? [segment];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentenceParts) {
    const next = current ? `${current} ${sentence.trim()}` : sentence.trim();
    if (next.length <= maxChunkChars) {
      current = next;
      continue;
    }

    if (current) {
      chunks.push(current);
      current = "";
    }

    if (sentence.length <= maxChunkChars) {
      current = sentence.trim();
      continue;
    }

    for (let index = 0; index < sentence.length; index += maxChunkChars) {
      const piece = sentence.slice(index, index + maxChunkChars).trim();
      if (piece) {
        chunks.push(piece);
      }
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

export function chunkDocumentText(
  text: string,
  {
    targetChunkChars = DEFAULT_TARGET_CHUNK_CHARS,
    maxChunkChars = DEFAULT_MAX_CHUNK_CHARS,
  }: {
    targetChunkChars?: number;
    maxChunkChars?: number;
  } = {}
) {
  const normalizedText = text.replace(/\r\n/g, "\n").trim();
  if (!normalizedText) {
    return [];
  }

  const rawSegments = normalizedText
    .split(/\n\s*\n+/)
    .flatMap((segment) => splitLongSegment(segment.trim(), maxChunkChars))
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  for (const segment of rawSegments) {
    const separator = current ? "\n\n" : "";
    const candidate = `${current}${separator}${segment}`;

    if (candidate.length <= maxChunkChars) {
      current = candidate;
      if (current.length >= targetChunkChars) {
        chunks.push(current);
        current = "";
      }
      continue;
    }

    if (current) {
      chunks.push(current);
    }
    current = segment;
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

export function normalizePromptText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").replace(/[^\w\s]/g, "").trim();
}
