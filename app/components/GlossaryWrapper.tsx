"use client";

import { GlossaryProvider } from "@/app/contexts/GlossaryContext";
import { ReadAloudProvider } from "@/app/contexts/ReadAloudContext";
import { ToastProvider } from "@/app/contexts/ToastContext";
import { TermPopup } from "@/app/components/TermPopup";
import { ReadAloudBar } from "@/app/components/ReadAloudBar";
import { Footer } from "@/app/components/Footer";
import { ScrollToTop } from "@/app/components/ScrollToTop";
import { ToastContainer } from "@/app/components/ToastContainer";
import { CommandPalette } from "@/app/components/CommandPalette";
import { KeyboardShortcuts } from "@/app/components/KeyboardShortcuts";

export function GlossaryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <GlossaryProvider>
        <ReadAloudProvider>
          {children}
          <ScrollToTop />
          <Footer />
          <TermPopup />
          <ReadAloudBar />
          <ToastContainer />
          <CommandPalette />
          <KeyboardShortcuts />
        </ReadAloudProvider>
      </GlossaryProvider>
    </ToastProvider>
  );
}
