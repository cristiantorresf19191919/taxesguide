"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  const [clicked, setClicked] = useState(false);
  if (!term) return <>{children ?? id}</>;

  const label = lang === "es" ? term.labelEs : term.labelEn;
  const tooltip = lang === "es" ? term.shortEs : term.shortEn;
  const display = children ?? label;
  const isAbbrev = term.isAbbreviation;

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
      openTerm(id, lang);
    }, 300);
  };

  if (isAbbrev) {
    return (
      <motion.span
        className="relative cursor-help border-b border-dotted border-neutral-500/70 text-neutral-200 hover:border-emerald-400/70 hover:text-emerald-300"
        title={tooltip}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick(e);
        }}
        animate={clicked ? {
          scale: [1, 1.15, 1],
          color: ["rgb(229,229,229)", "rgb(110,231,183)", "rgb(229,229,229)"],
        } : {}}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {display}
        {clicked && (
          <motion.span
            className="absolute inset-0 rounded bg-emerald-400/20"
            initial={{ opacity: 0.6, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.6 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}
      </motion.span>
    );
  }

  return (
    <motion.span
      className="relative cursor-pointer text-emerald-400 underline decoration-emerald-400/70 decoration-2 underline-offset-2 hover:text-emerald-300 hover:decoration-emerald-300/80"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick(e);
      }}
      title={lang === "es" ? "Clic para ver definición" : "Click to see definition"}
      animate={clicked ? {
        scale: [1, 1.12, 1],
      } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {display}
      {clicked && (
        <motion.span
          className="absolute inset-0 rounded bg-emerald-400/25"
          initial={{ opacity: 0.7, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.8 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      )}
    </motion.span>
  );
}
