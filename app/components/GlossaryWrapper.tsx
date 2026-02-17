"use client";

import { GlossaryProvider } from "@/app/contexts/GlossaryContext";
import { ReadAloudProvider } from "@/app/contexts/ReadAloudContext";
import { TermPopup } from "@/app/components/TermPopup";
import { ReadAloudBar } from "@/app/components/ReadAloudBar";
import { Footer } from "@/app/components/Footer";
import { ScrollToTop } from "@/app/components/ScrollToTop";

export function GlossaryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <GlossaryProvider>
      <ReadAloudProvider>
        {children}
        <ScrollToTop />
        <Footer />
        <TermPopup />
        <ReadAloudBar />
      </ReadAloudProvider>
    </GlossaryProvider>
  );
}
