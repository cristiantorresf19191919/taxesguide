"use client";

import { useMemo } from "react";
import { TERMS } from "@/app/data/terms";
import { GlossaryTerm } from "./GlossaryTerm";
import type { TermId } from "@/app/data/terms";

type Lang = "en" | "es";

/**
 * Map of surface forms (case-insensitive) → term ID.
 * Includes labelEn, labelEs, and common aliases.
 */
const SURFACE_TO_ID: Map<string, TermId> = new Map();

// Extra aliases that should also trigger a match
const ALIASES: Record<string, string[]> = {
  "e-file": ["e-file", "e-filing", "e-files", "e-filed"],
  "circular-230": ["Circular 230"],
  "form-8867": ["Form 8867"],
  "ftc-safeguards-rule": ["FTC Safeguards Rule", "Safeguards Rule"],
  "schedule-c": ["Schedule C"],
  "due-diligence": ["due diligence"],
  "security-six": ["Security Six"],
  "third-party-filer": ["Third-Party Filer", "third-party filer", "Third Party Filer"],
  "occupational-tax-certificate": [
    "Occupational Tax Certificate",
    "occupational tax certificate",
    "occupation tax certificate",
    "Occupation Tax Certificate",
  ],
  "sole-proprietorship": ["Sole Proprietor", "sole proprietor", "Sole Proprietorship", "sole proprietorship"],
  "representation-rights": ["representation rights", "Representation rights", "Representation Rights"],
  "enrolled-agent": ["Enrolled Agent", "enrolled agent", "EA"],
  "tax-credit": ["tax credit", "Tax credit", "Tax Credit"],
  withholding: ["Withholding", "withholding"],
  deduction: ["Deduction", "deduction", "Standard Deduction", "standard deduction"],
};

// Build the surface → id map
for (const term of TERMS) {
  // Add both EN/ES labels
  if (term.labelEn) SURFACE_TO_ID.set(term.labelEn, term.id);
  if (term.labelEs && term.labelEs !== term.labelEn) {
    SURFACE_TO_ID.set(term.labelEs, term.id);
  }
  // Add aliases
  const extra = ALIASES[term.id];
  if (extra) {
    for (const alias of extra) {
      SURFACE_TO_ID.set(alias, term.id);
    }
  }
}

/**
 * Build a regex that matches any known surface form.
 * Sort longest-first so "Third-Party Filer" matches before "EFIN", etc.
 */
const sortedSurfaces = Array.from(SURFACE_TO_ID.keys()).sort(
  (a, b) => b.length - a.length
);

const PATTERN = new RegExp(
  `(${sortedSurfaces.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  "g"
);

type AutoGlossaryProps = {
  text: string;
  lang?: Lang;
};

/**
 * AutoGlossary: renders a plain-text string with all recognized
 * tax/accounting terms automatically wrapped as <GlossaryTerm>.
 *
 * - Matches are case-sensitive to avoid false positives
 *   (e.g. "CE" won't match inside "service")
 * - Each unique term is only highlighted on its first occurrence
 *   within the text to avoid visual noise (configurable)
 */
export function AutoGlossary({ text, lang = "en" }: AutoGlossaryProps) {
  const parts = useMemo(() => {
    if (!text) return [text];
    const result: (string | { termId: TermId; match: string })[] = [];
    const seen = new Set<TermId>();
    let lastIndex = 0;

    // Reset regex
    PATTERN.lastIndex = 0;
    let m: RegExpExecArray | null;

    while ((m = PATTERN.exec(text)) !== null) {
      const matched = m[0];
      const termId = SURFACE_TO_ID.get(matched);
      if (!termId) continue;

      // Word-boundary check: ensure the match isn't part of a larger word
      const charBefore = m.index > 0 ? text[m.index - 1] : " ";
      const charAfter =
        m.index + matched.length < text.length
          ? text[m.index + matched.length]
          : " ";

      const isWordBoundaryBefore = /[\s,;:.!?()[\]{}/"'—–\-]/.test(charBefore) || m.index === 0;
      const isWordBoundaryAfter =
        /[\s,;:.!?()[\]{}/"'—–\-]/.test(charAfter) ||
        m.index + matched.length === text.length;

      if (!isWordBoundaryBefore || !isWordBoundaryAfter) continue;

      // Skip if we already highlighted this term (avoid visual noise)
      if (seen.has(termId)) continue;
      seen.add(termId);

      // Push text before match
      if (m.index > lastIndex) {
        result.push(text.slice(lastIndex, m.index));
      }
      result.push({ termId, match: matched });
      lastIndex = m.index + matched.length;
    }

    // Push remaining text
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return result;
  }, [text]);

  return (
    <>
      {parts.map((part, i) => {
        if (typeof part === "string") return <span key={i}>{part}</span>;
        return (
          <GlossaryTerm key={i} id={part.termId} lang={lang}>
            {part.match}
          </GlossaryTerm>
        );
      })}
    </>
  );
}
