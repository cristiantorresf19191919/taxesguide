import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { GlossaryWrapper } from "./components/GlossaryWrapper";

const font = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Análisis para ser preparador de impuestos | ChatGPT, Gemini, Claude",
  description:
    "Compara análisis de ChatGPT, Gemini y Claude Code sobre la ruta para ser preparador de impuestos. Guías y requisitos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={font.variable}>
      <body className="min-h-screen font-sans antialiased">
        <GlossaryWrapper>{children}</GlossaryWrapper>
      </body>
    </html>
  );
}
