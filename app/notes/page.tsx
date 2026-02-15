"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TERMS } from "@/app/data/terms";
import type { TermRecord } from "@/app/data/terms";

type Lang = "en" | "es";

const NOTES_KEY = "tax-guide-notes";

type Category = "forms" | "definitions" | "study" | "dates" | "tips" | "general";

type Note = {
  id: string;
  title: string;
  content: string;
  category: Category;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
};

const CATEGORIES: Record<Category, { icon: string; colorClass: string; bgClass: string; borderClass: string }> = {
  forms:       { icon: "📋", colorClass: "text-emerald-400",  bgClass: "bg-emerald-500/15", borderClass: "border-emerald-500/30" },
  definitions: { icon: "📖", colorClass: "text-violet-400",   bgClass: "bg-violet-500/15",  borderClass: "border-violet-500/30" },
  study:       { icon: "📝", colorClass: "text-blue-400",     bgClass: "bg-blue-500/15",    borderClass: "border-blue-500/30" },
  dates:       { icon: "📅", colorClass: "text-amber-400",    bgClass: "bg-amber-500/15",   borderClass: "border-amber-500/30" },
  tips:        { icon: "💡", colorClass: "text-rose-400",     bgClass: "bg-rose-500/15",    borderClass: "border-rose-500/30" },
  general:     { icon: "📌", colorClass: "text-neutral-400",  bgClass: "bg-white/10",       borderClass: "border-white/20" },
};

function loadNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((n: Record<string, unknown>) => ({
      ...n,
      category: n.category ?? "general",
      pinned: n.pinned ?? false,
    })) as Note[];
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

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

const ui = {
  en: {
    title: "Learning Notes",
    subtitle: "Organize your tax prep study notes with smart categories & autocomplete.",
    newNote: "New note",
    back: "Back to menu",
    noteTitle: "Note title…",
    placeholder: "Start typing… Terms like PTIN, EFIN, due diligence will autocomplete.",
    noNotes: "No notes yet. Create one to get started!",
    noResults: "No notes match your search.",
    delete: "Delete",
    save: "Save",
    search: "Search notes…",
    all: "All",
    pin: "Pin",
    unpin: "Unpin",
    copy: "Copy",
    copied: "Copied!",
    words: "words",
    chars: "chars",
    confirmDelete: "Delete this note?",
    confirmYes: "Yes, delete",
    confirmNo: "Cancel",
    categories: {
      forms: "Tax Forms",
      definitions: "Definitions",
      study: "Study Notes",
      dates: "Key Dates",
      tips: "Quick Tips",
      general: "General",
    } as Record<Category, string>,
    sidebarToggle: "Notes list",
  },
  es: {
    title: "Apuntes de Aprendizaje",
    subtitle: "Organiza tus apuntes con categorías inteligentes y autocompletado.",
    newNote: "Nueva nota",
    back: "Volver al menú",
    noteTitle: "Título de la nota…",
    placeholder: "Escribe aquí… Términos como PTIN, EFIN, debida diligencia se autocompletarán.",
    noNotes: "Aún no hay notas. ¡Crea una para empezar!",
    noResults: "Ninguna nota coincide con tu búsqueda.",
    delete: "Eliminar",
    save: "Guardar",
    search: "Buscar notas…",
    all: "Todas",
    pin: "Fijar",
    unpin: "Desfijar",
    copy: "Copiar",
    copied: "¡Copiado!",
    words: "palabras",
    chars: "caracteres",
    confirmDelete: "¿Eliminar esta nota?",
    confirmYes: "Sí, eliminar",
    confirmNo: "Cancelar",
    categories: {
      forms: "Formularios",
      definitions: "Definiciones",
      study: "Apuntes",
      dates: "Fechas Clave",
      tips: "Consejos",
      general: "General",
    } as Record<Category, string>,
    sidebarToggle: "Lista de notas",
  },
};

export default function NotesPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("general");
  const [suggestions, setSuggestions] = useState<TermRecord[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<Category | "all">("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const t = ui[lang];

  useEffect(() => {
    const loaded = loadNotes();
    setNotes(loaded);
    if (loaded.length > 0) {
      const first = loaded[0]!;
      setActiveId(first.id);
      setTitle(first.title);
      setContent(first.content);
      setCategory(first.category);
    }
  }, []);

  const persist = useCallback((next: Note[]) => {
    setNotes(next);
    saveNotes(next);
  }, []);

  const activeNote = notes.find((n) => n.id === activeId);
  const isNew = activeId === "new";

  const filteredNotes = useMemo(() => {
    let list = [...notes];
    if (filterCat !== "all") list = list.filter((n) => n.category === filterCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return list;
  }, [notes, filterCat, search]);

  const createNote = useCallback(() => {
    setActiveId("new");
    setTitle("");
    setContent("");
    setCategory("general");
    setShowSuggestions(false);
    setSidebarOpen(false);
  }, []);

  const openNote = useCallback((n: Note) => {
    setActiveId(n.id);
    setTitle(n.title);
    setContent(n.content);
    setCategory(n.category);
    setShowSuggestions(false);
    setSidebarOpen(false);
  }, []);

  const saveCurrent = useCallback(() => {
    const now = new Date().toISOString();
    if (isNew) {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: title.trim() || t.newNote,
        content,
        category,
        pinned: false,
        createdAt: now,
        updatedAt: now,
      };
      persist([...notes, newNote]);
      setActiveId(newNote.id);
    } else if (activeNote) {
      persist(
        notes.map((n) =>
          n.id === activeId
            ? { ...n, title: title.trim() || n.title, content, category, updatedAt: now }
            : n
        )
      );
    }
  }, [isNew, activeId, activeNote, title, content, category, notes, persist, t.newNote]);

  const deleteCurrent = useCallback(() => {
    if (!activeId) return;
    const next = notes.filter((n) => n.id !== activeId);
    persist(next);
    setShowDeleteConfirm(false);
    if (next[0]) openNote(next[0]);
    else {
      setActiveId(null);
      setTitle("");
      setContent("");
      setCategory("general");
    }
  }, [activeId, notes, persist, openNote]);

  const togglePin = useCallback(() => {
    if (!activeNote) return;
    persist(
      notes.map((n) => (n.id === activeId ? { ...n, pinned: !n.pinned } : n))
    );
  }, [activeId, activeNote, notes, persist]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      //
    }
  }, [content]);

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

  // Auto-save debounce
  useEffect(() => {
    if (!activeNote && !isNew) return;
    if (isNew) return;
    const timer = setTimeout(saveCurrent, 800);
    return () => clearTimeout(timer);
  }, [title, content, category, activeId, isNew, activeNote]);

  const catMeta = CATEGORIES[category];
  const allCats = Object.keys(CATEGORIES) as Category[];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute right-[-120px] top-[20%] h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-[120px]"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[-80px] bottom-[10%] h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-[100px]"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,rgba(139,92,246,0.06),transparent)]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-neutral-950/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <motion.span whileHover={{ x: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/"
                className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
              >
                ← {t.back}
              </Link>
            </motion.span>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <span className="hidden sm:inline text-sm font-semibold text-white">{t.title}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile sidebar toggle */}
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/10 lg:hidden"
              aria-label={t.sidebarToggle}
            >
              {sidebarOpen ? "✕" : "☰"}
            </motion.button>
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

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <h1 className="text-xl font-bold tracking-tight text-white">{t.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">{t.subtitle}</p>
        </motion.div>

        <div className="flex gap-5 relative">
          {/* ───── Sidebar ───── */}
          <AnimatePresence>
            {/* On mobile: overlay sidebar; on lg+: always visible */}
            <motion.aside
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`
                w-64 shrink-0 flex-col gap-3
                lg:flex
                ${sidebarOpen
                  ? "fixed inset-0 top-[57px] z-40 flex bg-neutral-950/95 backdrop-blur-xl p-4 overflow-y-auto"
                  : "hidden"
                }
              `}
            >
              {/* Search */}
              <div className="relative">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.search}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-8 pr-3 text-xs text-neutral-200 placeholder-neutral-500 outline-none transition-colors focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>

              {/* Category filter pills */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterCat("all")}
                  className={`rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                    filterCat === "all"
                      ? "bg-white/15 text-white"
                      : "text-neutral-500 hover:bg-white/5 hover:text-neutral-300"
                  }`}
                >
                  {t.all}
                </button>
                {allCats.map((c) => {
                  const meta = CATEGORIES[c];
                  return (
                    <button
                      key={c}
                      onClick={() => setFilterCat(filterCat === c ? "all" : c)}
                      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                        filterCat === c
                          ? `${meta.bgClass} ${meta.colorClass}`
                          : "text-neutral-500 hover:bg-white/5 hover:text-neutral-300"
                      }`}
                    >
                      <span>{meta.icon}</span>
                      {t.categories[c]}
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.06]" />

              {/* Notes list */}
              <div className="flex-1 space-y-1 overflow-y-auto pr-1 lg:max-h-[calc(100vh-280px)]">
                {filteredNotes.length === 0 && (
                  <p className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center text-xs text-neutral-500">
                    {search.trim() ? t.noResults : t.noNotes}
                  </p>
                )}
                {filteredNotes.map((n) => {
                  const cMeta = CATEGORIES[n.category];
                  return (
                    <motion.button
                      key={n.id}
                      onClick={() => openNote(n)}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.99 }}
                      className={`group relative w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                        n.id === activeId
                          ? "bg-white/[0.12] text-white"
                          : "text-neutral-400 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {n.pinned && (
                          <span className="text-[10px] text-amber-400" title="Pinned">📌</span>
                        )}
                        <span className="text-[10px]">{cMeta.icon}</span>
                        <span className="block flex-1 truncate text-[13px] font-medium">
                          {n.title || t.newNote}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-neutral-500">
                        <span>{new Date(n.updatedAt).toLocaleDateString()}</span>
                        <span className={`rounded px-1 py-0.5 ${cMeta.bgClass} ${cMeta.colorClass} text-[9px] font-bold uppercase`}>
                          {t.categories[n.category]}
                        </span>
                      </div>
                      {/* Color indicator bar */}
                      <span
                        className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full transition-opacity ${
                          n.id === activeId ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                        } ${cMeta.bgClass.replace("/15", "/60").replace("/10", "/40")}`}
                        style={{
                          backgroundColor:
                            n.category === "forms" ? "rgb(52,211,153)" :
                            n.category === "definitions" ? "rgb(139,92,246)" :
                            n.category === "study" ? "rgb(59,130,246)" :
                            n.category === "dates" ? "rgb(245,158,11)" :
                            n.category === "tips" ? "rgb(244,63,94)" :
                            "rgb(163,163,163)",
                          opacity: n.id === activeId ? 0.8 : undefined,
                        }}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </motion.aside>
          </AnimatePresence>

          {/* Click-away overlay for mobile sidebar */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* ───── Editor panel ───── */}
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              {activeId === "new" || activeNote ? (
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="relative"
                >
                  {/* Editor card */}
                  <div
                    className={`rounded-2xl border bg-white/[0.03] p-5 transition-colors ${catMeta.borderClass.replace("/30", "/20")}`}
                    data-readaloud-content
                  >
                    {/* Category selector row */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                        {lang === "en" ? "Section" : "Sección"}:
                      </span>
                      {allCats.map((c) => {
                        const m = CATEGORIES[c];
                        const selected = category === c;
                        return (
                          <motion.button
                            key={c}
                            onClick={() => setCategory(c)}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-all ${
                              selected
                                ? `${m.bgClass} ${m.colorClass} ${m.borderClass}`
                                : "border-white/[0.06] text-neutral-500 hover:border-white/15 hover:text-neutral-300"
                            }`}
                          >
                            <span className="text-xs">{m.icon}</span>
                            {t.categories[c]}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Title input */}
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t.noteTitle}
                      className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-semibold text-white placeholder-neutral-500 outline-none transition-colors focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/30"
                    />

                    {/* Textarea with autocomplete */}
                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => updateContent(e.target.value, e.target.selectionStart)}
                        onSelect={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          setCursorPos(target.selectionStart ?? 0);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={t.placeholder}
                        rows={16}
                        className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm leading-relaxed text-neutral-200 placeholder-neutral-500 outline-none transition-colors focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/30"
                      />
                      <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                          <motion.ul
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-xl border border-white/10 bg-neutral-900/95 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl"
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
                                      i === suggestionIndex
                                        ? "bg-emerald-500/20 text-emerald-300"
                                        : "text-neutral-300 hover:bg-white/10"
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

                    {/* Footer: word count + stats */}
                    <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-500">
                      <div className="flex items-center gap-3">
                        <span>{wordCount(content)} {t.words}</span>
                        <span>{content.length} {t.chars}</span>
                      </div>
                      <span className={`flex items-center gap-1 ${catMeta.colorClass}`}>
                        <span>{catMeta.icon}</span>
                        {t.categories[category]}
                      </span>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <motion.button
                      onClick={saveCurrent}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/30"
                    >
                      {t.save}
                    </motion.button>

                    {activeNote && (
                      <>
                        <motion.button
                          onClick={togglePin}
                          whileTap={{ scale: 0.98 }}
                          className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                            activeNote.pinned
                              ? "border-amber-500/30 bg-amber-500/15 text-amber-400"
                              : "border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10"
                          }`}
                        >
                          📌 {activeNote.pinned ? t.unpin : t.pin}
                        </motion.button>

                        <motion.button
                          onClick={copyToClipboard}
                          whileTap={{ scale: 0.98 }}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/10"
                        >
                          {copied ? `✓ ${t.copied}` : `📋 ${t.copy}`}
                        </motion.button>

                        <motion.button
                          onClick={() => setShowDeleteConfirm(true)}
                          whileTap={{ scale: 0.98 }}
                          className="rounded-xl bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400/70 transition-colors hover:bg-red-500/20 hover:text-red-400"
                        >
                          {t.delete}
                        </motion.button>
                      </>
                    )}
                  </div>

                  {/* Delete confirmation */}
                  <AnimatePresence>
                    {showDeleteConfirm && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="mt-3 inline-flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5"
                      >
                        <span className="text-sm text-red-300">{t.confirmDelete}</span>
                        <button
                          onClick={deleteCurrent}
                          className="rounded-lg bg-red-500/30 px-3 py-1 text-xs font-bold text-red-300 transition-colors hover:bg-red-500/50"
                        >
                          {t.confirmYes}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="rounded-lg bg-white/10 px-3 py-1 text-xs font-bold text-neutral-300 transition-colors hover:bg-white/20"
                        >
                          {t.confirmNo}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                /* Empty state */
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center"
                >
                  <div className="mb-4 flex gap-2 text-3xl">
                    {allCats.map((c) => (
                      <motion.span
                        key={c}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: allCats.indexOf(c) * 0.08 }}
                      >
                        {CATEGORIES[c].icon}
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-neutral-500">{t.noNotes}</p>
                  <motion.button
                    onClick={createNote}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4 rounded-xl bg-emerald-500/20 px-5 py-2.5 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/30"
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
