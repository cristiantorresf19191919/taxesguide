"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TERMS } from "@/app/data/terms";
import type { TermRecord } from "@/app/data/terms";

type Lang = "en" | "es";

const NOTES_KEY = "tax-guide-notes";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

function loadNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {
    //
  }
}

function getSuggestions(prefix: string, lang: Lang, limit = 8): TermRecord[] {
  const p = prefix.trim().toLowerCase();
  if (p.length < 2) return [];
  const labelKey = lang === "es" ? "labelEs" : "labelEn";
  const seen = new Set<string>();
  return TERMS.filter((t) => {
    const match =
      t[labelKey].toLowerCase().startsWith(p) ||
      t.labelEn.toLowerCase().startsWith(p) ||
      t.labelEs.toLowerCase().startsWith(p) ||
      t.id.toLowerCase().includes(p);
    if (!match || seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  }).slice(0, limit);
}

function getWordAtCursor(text: string, cursor: number): { word: string; start: number; end: number } {
  let start = cursor;
  while (start > 0 && /[\w\-]/.test(text[start - 1]!)) start--;
  let end = cursor;
  while (end < text.length && /[\w\-]/.test(text[end]!)) end++;
  return { word: text.slice(start, end), start, end };
}

const ui = {
  en: {
    title: "Learning notes",
    subtitle: "Take notes with autocomplete from tax terms.",
    newNote: "New note",
    back: "Back to menu",
    noteTitle: "Note title",
    placeholder: "Start typing… Terms like PTIN, EFIN, due diligence will autocomplete.",
    noNotes: "No notes yet. Create one to start.",
    delete: "Delete",
    save: "Save",
  },
  es: {
    title: "Apuntes de aprendizaje",
    subtitle: "Toma notas con autocompletado de términos fiscales.",
    newNote: "Nueva nota",
    back: "Volver al menú",
    noteTitle: "Título de la nota",
    placeholder: "Escribe aquí… Términos como PTIN, EFIN, debida diligencia se autocompletarán.",
    noNotes: "Aún no hay notas. Crea una para empezar.",
    delete: "Eliminar",
    save: "Guardar",
  },
};

export default function NotesPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [suggestions, setSuggestions] = useState<TermRecord[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const t = ui[lang];

  useEffect(() => {
    const loaded = loadNotes();
    setNotes(loaded);
    if (loaded.length > 0 && activeId === null) {
      const first = loaded[0]!;
      setActiveId(first.id);
      setTitle(first.title);
      setContent(first.content);
    }
  }, []);

  const persist = useCallback((next: Note[]) => {
    setNotes(next);
    saveNotes(next);
  }, []);

  const activeNote = notes.find((n) => n.id === activeId);
  const isNew = activeId === "new";

  const createNote = useCallback(() => {
    const id = "new";
    setActiveId(id);
    setTitle("");
    setContent("");
    setShowSuggestions(false);
  }, []);

  const openNote = useCallback((n: Note) => {
    setActiveId(n.id);
    setTitle(n.title);
    setContent(n.content);
    setShowSuggestions(false);
  }, []);

  const saveCurrent = useCallback(() => {
    const now = new Date().toISOString();
    if (isNew) {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: title.trim() || t.newNote,
        content,
        createdAt: now,
        updatedAt: now,
      };
      persist([...notes, newNote]);
      setActiveId(newNote.id);
    } else if (activeNote) {
      persist(
        notes.map((n) =>
          n.id === activeId ? { ...n, title: title.trim() || n.title, content, updatedAt: now } : n
        )
      );
    }
  }, [isNew, activeId, activeNote, title, content, notes, persist, t.newNote]);

  const deleteCurrent = useCallback(() => {
    if (!activeId) return;
    const next = notes.filter((n) => n.id !== activeId);
    persist(next);
    setActiveId(next[0]?.id ?? null);
    if (next[0]) openNote(next[0]);
    else { setTitle(""); setContent(""); }
  }, [activeId, notes, persist, openNote]);

  const updateContent = useCallback(
    (value: string, newCursor?: number) => {
      setContent(value);
      const pos = newCursor ?? textareaRef.current?.selectionStart ?? value.length;
      setCursorPos(pos);
      const { word } = getWordAtCursor(value, pos);
      const list = getSuggestions(word, lang);
      setSuggestions(list);
      setShowSuggestions(list.length > 0);
      setSuggestionIndex(0);
    },
    [lang]
  );

  const insertSuggestion = useCallback(
    (term: TermRecord) => {
      const label = lang === "es" ? term.labelEs : term.labelEn;
      const { start, end } = getWordAtCursor(content, cursorPos);
      const before = content.slice(0, start);
      const after = content.slice(end);
      const newContent = before + label + after;
      const newPos = start + label.length;
      updateContent(newContent, newPos);
      setShowSuggestions(false);
      textareaRef.current?.focus();
      setTimeout(() => {
        textareaRef.current?.setSelectionRange(newPos, newPos);
      }, 0);
    },
    [content, cursorPos, lang, updateContent]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSuggestionIndex((i) => (i + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSuggestionIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertSuggestion(suggestions[suggestionIndex]!);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    },
    [showSuggestions, suggestions, suggestionIndex, insertSuggestion]
  );

  useEffect(() => {
    if (!activeNote && !isNew) return;
    if (isNew) return;
    const timer = setTimeout(saveCurrent, 800);
    return () => clearTimeout(timer);
  }, [title, content, activeId, isNew, activeNote]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute right-[-120px] top-[20%] h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[100px]"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,rgba(139,92,246,0.08),transparent)]" />
      </div>

      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-neutral-950/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <motion.span whileHover={{ x: -2 }} whileTap={{ scale: 0.98 }}>
              <Link href="/" className="text-sm font-medium text-neutral-400 transition-colors hover:text-white">
                ← {t.back}
              </Link>
            </motion.span>
            <span className="text-neutral-600">|</span>
            <span className="text-sm font-semibold text-white">{t.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setLang((l) => (l === "en" ? "es" : "en"))}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/10"
            >
              {lang === "en" ? "ES" : "EN"}
            </motion.button>
            <motion.button
              onClick={createNote}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/30"
            >
              + {t.newNote}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-xl font-bold tracking-tight text-white">{t.title}</h1>
          <p className="mt-1 text-sm text-neutral-400">{t.subtitle}</p>
        </motion.div>

        <div className="flex gap-6">
          <motion.div
            ref={listRef}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-56 shrink-0 space-y-1"
          >
            {notes.length === 0 && !activeId && (
              <p className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-xs text-neutral-500">
                {t.noNotes}
              </p>
            )}
            {notes.map((n) => (
              <motion.button
                key={n.id}
                onClick={() => openNote(n)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  n.id === activeId
                    ? "bg-white/15 font-medium text-white"
                    : "text-neutral-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="block truncate">{n.title || t.newNote}</span>
                <span className="mt-0.5 block truncate text-xs text-neutral-500">
                  {new Date(n.updatedAt).toLocaleDateString()}
                </span>
              </motion.button>
            ))}
          </motion.div>

          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              {(activeId === "new" || activeNote) ? (
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5" data-readaloud-content>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t.noteTitle}
                      className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white placeholder-neutral-500 outline-none transition-colors focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/30"
                    />
                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => updateContent(e.target.value, e.target.selectionStart)}
                        onSelect={(e) => {
                          const t = e.target as HTMLTextAreaElement;
                          setCursorPos(t.selectionStart ?? 0);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={t.placeholder}
                        rows={14}
                        className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm leading-relaxed text-neutral-200 placeholder-neutral-500 outline-none transition-colors focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/30"
                      />
                      <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                          <motion.ul
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-neutral-900 shadow-xl ring-1 ring-white/10"
                          >
                            {suggestions.map((term, i) => {
                              const label = lang === "es" ? term.labelEs : term.labelEn;
                              return (
                                <li key={term.id}>
                                  <button
                                    type="button"
                                    onClick={() => insertSuggestion(term)}
                                    onMouseEnter={() => setSuggestionIndex(i)}
                                    className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition-colors ${
                                      i === suggestionIndex ? "bg-emerald-500/20 text-emerald-300" : "text-neutral-300 hover:bg-white/10"
                                    }`}
                                  >
                                    <span className="font-medium">{label}</span>
                                    {term.shortEn && (
                                      <span className="max-w-[60%] truncate text-xs text-neutral-500">
                                        {term.shortEn.slice(0, 50)}…
                                      </span>
                                    )}
                                  </button>
                                </li>
                              );
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <motion.button
                      onClick={saveCurrent}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/30"
                    >
                      {t.save}
                    </motion.button>
                    {activeId && activeId !== "new" && (
                      <motion.button
                        onClick={deleteCurrent}
                        whileTap={{ scale: 0.98 }}
                        className="rounded-xl bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/30"
                      >
                        {t.delete}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center"
                >
                  <p className="text-neutral-500">{t.noNotes}</p>
                  <motion.button
                    onClick={createNote}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4 rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-400"
                  >
                    + {t.newNote}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
