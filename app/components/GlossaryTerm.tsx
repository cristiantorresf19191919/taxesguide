"use client";

import { useGlossary } from "@/app/contexts/GlossaryContext";
import { getTerm } from "@/app/data/terms";
import type { TermId } from "@/app/data/terms";

type Lang = "en" | "es";

type GlossaryTermProps = {
  id: TermId;
  lang?: Lang;
  children?: React.ReactNode;
};

export function GlossaryTerm({ id, lang = "en", children }: GlossaryTermProps) {
  const { openTerm } = useGlossary();
  const term = getTerm(id);
  if (!term) return <>{children ?? id}</>;

  const label = lang === "es" ? term.labelEs : term.labelEn;
  const tooltip = lang === "es" ? term.shortEs : term.shortEn;
  const display = children ?? label;
  const isAbbrev = term.isAbbreviation;

  if (isAbbrev) {
    return (
      <span
        className="cursor-help border-b border-dotted border-neutral-500/70 text-neutral-200 hover:border-emerald-400/70 hover:text-emerald-300"
        title={tooltip}
        onClick={(e) => {
          e.preventDefault();
          openTerm(id, lang);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openTerm(id, lang);
          }
        }}
      >
        {display}
      </span>
    );
  }

  return (
    <span
      className="cursor-pointer text-emerald-400 underline decoration-emerald-400/70 decoration-2 underline-offset-2 hover:text-emerald-300 hover:decoration-emerald-300/80"
      onClick={(e) => {
        e.preventDefault();
        openTerm(id, lang);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openTerm(id, lang);
        }
      }}
      title={lang === "es" ? "Clic para ver definición" : "Click to see definition"}
    >
      {display}
    </span>
  );
}
