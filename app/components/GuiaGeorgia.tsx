"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AutoGlossary } from "./AutoGlossary";

type Lang = "en" | "es";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export function GuiaGeorgia({ backLink }: { backLink?: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const t = useMemo(() => {
    const copy = {
      en: {
        nav: {
          title: "Tax Preparer in Georgia",
          subtitle:
            "A beginner-friendly roadmap for Sandra to start preparing taxes independently in GA.",
          toggle: "ES",
          toggleHint: "Switch to Spanish",
        },
        hero: {
          badge: "Beginner roadmap • Georgia (GA) • Independent",
          title: "Start a Tax Preparation Business in Georgia",
          desc:
            "Georgia doesn’t require a special state tax-preparer license. The key is to follow IRS rules, learn the basics, register properly, and start small with confidence.",
          cta1: "See the Steps",
          cta2: "Download Content Outline",
          disclaimer:
            "Educational info only — not legal/tax advice. Requirements can change. Verify with IRS and Georgia DOR.",
        },
        sections: {
          overview: {
            title: "What Sandra needs (the easiest path)",
            items: [
              {
                title: "1) Learn the basics",
                desc:
                  "Start with free training (IRS Link & Learn / Intuit Academy) and practice simple returns first.",
              },
              {
                title: "2) Get an IRS PTIN (required)",
                desc:
                  "A PTIN is the IRS ID you must have to prepare federal returns for pay. Renew yearly.",
              },
              {
                title: "3) Apply for an EFIN (recommended)",
                desc:
                  "EFIN lets you e-file returns (what clients expect). The process can take weeks, so apply early.",
              },
              {
                title: "4) Set up a simple business",
                desc:
                  "Start as a sole proprietor using your own name (easiest). Get a local business license.",
              },
              {
                title: "5) Register with Georgia DOR",
                desc:
                  "Georgia expects preparers who file for clients to register as a Third-Party Filer in Georgia Tax Center.",
              },
              {
                title: "6) Choose affordable pro software",
                desc:
                  "Use professional tax software (pay-per-return is great for a beginner). Avoid consumer TurboTax for clients.",
              },
            ],
          },
          legal: {
            title: "Georgia rules (simple)",
            points: [
              "Georgia does not require a special state license to be a paid tax preparer.",
              "You still must follow IRS rules (PTIN, signing returns, accuracy, privacy).",
              "You’ll likely need a local city/county business license (occupational tax certificate).",
              "If you prepare Georgia returns for clients, register as a Third-Party Filer in Georgia Tax Center.",
            ],
          },
          irs: {
            title: "IRS terms in plain English",
            cards: [
              {
                title: "PTIN (Required)",
                desc:
                  "Your IRS preparer ID. You must have it before preparing returns for pay. Renew every year.",
              },
              {
                title: "EFIN (Recommended)",
                desc:
                  "Your e-file business ID. Needed to e-file returns (very important if you plan to file many returns).",
              },
              {
                title: "AFSP (Optional)",
                desc:
                  "A voluntary IRS program. Helps credibility + limited ability to represent clients for returns you prepared.",
              },
              {
                title: "Enrolled Agent (Optional)",
                desc:
                  "A high-level IRS credential. Requires passing exams. Gives broad ability to represent clients before IRS.",
              },
            ],
          },
          education: {
            title: "Beginner training (low cost / free)",
            list: [
              {
                title: "IRS Link & Learn (Free)",
                desc:
                  "Self-paced training used for VITA volunteers — excellent fundamentals.",
              },
              {
                title: "Intuit Academy (Free)",
                desc:
                  "Tax Level 1 & 2 courses to build step-by-step knowledge.",
              },
              {
                title: "H&R Block Course (Low-cost materials)",
                desc:
                  "Often free tuition with a materials cost. Structured learning for total beginners.",
              },
              {
                title: "Practice returns",
                desc:
                  "Do mock returns before taking paying clients. Start with simple W-2 scenarios.",
              },
            ],
          },
          business: {
            title: "Simplest business setup in Georgia",
            steps: [
              "Start as a Sole Proprietor (easiest). Use your own legal name at first.",
              "If you want a brand name, register a DBA/Trade Name with your county (optional).",
              "Get a local business license from your city/county (required in most places).",
              "Optional: Get a free EIN from the IRS (useful for privacy + business bank account).",
              "Open a separate bank account for client payments and expenses.",
            ],
          },
          tools: {
            title: "Tools & software (starter friendly)",
            items: [
              {
                title: "Tax software",
                desc:
                  "Choose professional tax software with pay-per-return or small bundles. Look for strong support + easy UI.",
              },
              {
                title: "Secure document handling",
                desc:
                  "Use a scanner, encrypted storage, strong passwords, and avoid sending SSNs via insecure email.",
              },
              {
                title: "Client workflow",
                desc:
                  "Use a scheduling tool + secure upload portal (some tax software includes this).",
              },
            ],
          },
          costs: {
            title: "Minimum startup cost (lean version)",
            rows: [
              { name: "PTIN (annual)", value: "~$20" },
              { name: "EFIN", value: "$0 (IRS fee)" },
              { name: "GA DOR Third-Party Filer registration", value: "$0" },
              { name: "Local business license", value: "~$50–$150" },
              { name: "Starter pro tax software", value: "~$200–$400" },
              { name: "Supplies (basic)", value: "~$50–$150" },
            ],
            note:
              "Your first few clients can often cover these costs. Keep receipts — many expenses are deductible.",
          },
          faq: {
            title: "Common beginner questions",
            qs: [
              {
                q: "Can Sandra start without an EFIN?",
                a:
                  "Technically yes if doing very few returns and paper filing, but e-filing is the norm. Applying early is smart because approval can take time.",
              },
              {
                q: "Does Sandra need to be an accountant?",
                a:
                  "No. She needs training, practice, and a solid workflow. Start with simple returns and grow from there.",
              },
              {
                q: "What is the easiest way to start?",
                a:
                  "Sole proprietor + PTIN + local license + pro software + GA DOR registration. Start with friends/family simple returns and build referrals.",
              },
            ],
          },
          footer: {
            title: "Ready to build Sandra’s website?",
            desc:
              "This page is already structured like a website landing page. You can add pricing, booking, testimonials, and a contact form next.",
            cta: "Add Pricing Section Next",
          },
        },
        outline: {
          title: "Content Outline (for your website)",
          items: [
            "Hero (who it’s for + promise)",
            "Step-by-step roadmap",
            "Georgia rules (simple)",
            "IRS terms explained",
            "Training options",
            "Business setup checklist",
            "Tools & software",
            "Costs breakdown",
            "FAQ",
            "CTA (book a consult / request info)",
          ],
        },
      },
      es: {
        nav: {
          title: "Preparadora de Impuestos en Georgia",
          subtitle:
            "Ruta clara para que Sandra empiece desde cero y trabaje de forma independiente en GA.",
          toggle: "EN",
          toggleHint: "Cambiar a inglés",
        },
        hero: {
          badge: "Ruta para principiantes • Georgia (GA) • Independiente",
          title: "Empezar un Negocio de Preparación de Impuestos en Georgia",
          desc:
            "Georgia no exige una licencia estatal especial para preparar impuestos. La clave es cumplir con reglas del IRS, aprender lo básico, registrarse bien y empezar en pequeño con confianza.",
          cta1: "Ver los pasos",
          cta2: "Descargar outline",
          disclaimer:
            "Solo información educativa — no es asesoría legal ni tributaria. Verifica siempre con el IRS y el Georgia DOR.",
        },
        sections: {
          overview: {
            title: "Lo que Sandra necesita (el camino más fácil)",
            items: [
              {
                title: "1) Aprender lo básico",
                desc:
                  "Empieza con cursos gratis (IRS Link & Learn / Intuit Academy) y practica declaraciones simples primero.",
              },
              {
                title: "2) Sacar el PTIN (obligatorio)",
                desc:
                  "Es el ID del IRS para preparar impuestos por pago. Se renueva cada año.",
              },
              {
                title: "3) Pedir EFIN (recomendado)",
                desc:
                  "EFIN permite e-file (lo normal hoy). Puede tardar semanas, así que hazlo con tiempo.",
              },
              {
                title: "4) Montar el negocio simple",
                desc:
                  "Empieza como sole proprietor con tu nombre (lo más fácil). Saca licencia local de negocio.",
              },
              {
                title: "5) Registrarse en Georgia DOR",
                desc:
                  "Georgia espera que los preparadores se registren como Third-Party Filer en Georgia Tax Center.",
              },
              {
                title: "6) Software pro y económico",
                desc:
                  "Usa software profesional (pay-per-return es ideal al inicio). No uses TurboTax de consumidor para clientes.",
              },
            ],
          },
          legal: {
            title: "Reglas en Georgia (simple)",
            points: [
              "Georgia no exige una licencia estatal especial para ser preparador pagado.",
              "Igual debes cumplir reglas del IRS (PTIN, firmar, precisión, privacidad).",
              "Casi siempre necesitas licencia local de ciudad/condado (occupational tax certificate).",
              "Si preparas declaraciones de Georgia para clientes, regístrate como Third-Party Filer en Georgia Tax Center.",
            ],
          },
          irs: {
            title: "Términos del IRS en fácil",
            cards: [
              {
                title: "PTIN (Obligatorio)",
                desc:
                  "Tu ID de preparador ante el IRS. Es obligatorio antes de preparar impuestos por pago. Se renueva cada año.",
              },
              {
                title: "EFIN (Recomendado)",
                desc:
                  "Tu ID para e-file. Es clave para presentar electrónicamente (muy importante si tendrás varios clientes).",
              },
              {
                title: "AFSP (Opcional)",
                desc:
                  "Programa voluntario del IRS. Da credibilidad + representación limitada para declaraciones que tú preparaste.",
              },
              {
                title: "Enrolled Agent (Opcional)",
                desc:
                  "Credencial alta del IRS. Requiere exámenes. Da representación amplia ante el IRS.",
              },
            ],
          },
          education: {
            title: "Formación para principiantes (gratis / barato)",
            list: [
              {
                title: "IRS Link & Learn (Gratis)",
                desc:
                  "Curso auto-guiado usado por voluntarios VITA — excelente para bases.",
              },
              {
                title: "Intuit Academy (Gratis)",
                desc:
                  "Cursos Tax Level 1 y 2 para aprender paso a paso.",
              },
              {
                title: "Curso H&R Block (Materiales económicos)",
                desc:
                  "Muchas veces la matrícula es gratis y pagas solo materiales. Estructurado para principiantes.",
              },
              {
                title: "Practicar declaraciones",
                desc:
                  "Haz casos de práctica antes de cobrar. Empieza con W-2 simples.",
              },
            ],
          },
          business: {
            title: "La forma más simple de crear el negocio en Georgia",
            steps: [
              "Empieza como Sole Proprietor (lo más fácil). Usa tu nombre legal al inicio.",
              "Si quieres marca, registra un DBA/Trade Name con tu condado (opcional).",
              "Saca licencia local en tu ciudad/condado (casi siempre obligatoria).",
              "Opcional: saca un EIN gratis del IRS (útil para privacidad y banco).",
              "Abre una cuenta separada para pagos y gastos del negocio.",
            ],
          },
          tools: {
            title: "Herramientas y software (amigables para empezar)",
            items: [
              {
                title: "Software de impuestos",
                desc:
                  "Elige software profesional con pay-per-return o paquetes pequeños. Busca buen soporte + interfaz fácil.",
              },
              {
                title: "Seguridad de documentos",
                desc:
                  "Usa escáner, almacenamiento cifrado, contraseñas fuertes y evita enviar SSN por email inseguro.",
              },
              {
                title: "Flujo con clientes",
                desc:
                  "Usa agenda + portal seguro para documentos (algunos software lo incluyen).",
              },
            ],
          },
          costs: {
            title: "Costo mínimo para empezar (modo lean)",
            rows: [
              { name: "PTIN (anual)", value: "~$20" },
              { name: "EFIN", value: "$0 (fee IRS)" },
              { name: "Registro GA DOR Third-Party Filer", value: "$0" },
              { name: "Licencia local", value: "~$50–$150" },
              { name: "Software pro inicial", value: "~$200–$400" },
              { name: "Insumos básicos", value: "~$50–$150" },
            ],
            note:
              "Con pocos clientes normalmente recuperas estos costos. Guarda recibos — muchos gastos son deducibles.",
          },
          faq: {
            title: "Preguntas típicas de principiante",
            qs: [
              {
                q: "¿Sandra puede empezar sin EFIN?",
                a:
                  "Técnicamente sí con pocas declaraciones y enviando en papel, pero hoy el estándar es e-file. Pedirlo temprano es lo mejor.",
              },
              {
                q: "¿Sandra necesita ser contadora?",
                a:
                  "No. Necesita formación, práctica y un flujo claro. Empieza con declaraciones simples y ve subiendo nivel.",
              },
              {
                q: "¿Cuál es la forma más fácil de arrancar?",
                a:
                  "Sole proprietor + PTIN + licencia local + software pro + registro GA DOR. Empieza con conocidos y casos simples.",
              },
            ],
          },
          footer: {
            title: "¿Listos para crear el sitio de Sandra?",
            desc:
              "Esta página ya está estructurada como landing. Luego le agregamos precios, agenda, testimonios y contacto.",
            cta: "Agregar sección de precios",
          },
        },
        outline: {
          title: "Outline de Contenido (para el sitio)",
          items: [
            "Hero (para quién es + promesa)",
            "Ruta paso a paso",
            "Reglas Georgia (simple)",
            "Términos IRS explicados",
            "Opciones de formación",
            "Checklist de negocio",
            "Herramientas y software",
            "Costos",
            "FAQ",
            "CTA (agendar / pedir info)",
          ],
        },
      },
    };

    return copy[lang];
  }, [lang]);

  const scrollToSteps = () => {
    const el = document.getElementById("steps");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const downloadOutline = () => {
    const text = [
      `${t.outline.title}`,
      "",
      ...t.outline.items.map((x, i) => `${i + 1}. ${x}`),
      "",
      "—",
      t.hero.disclaimer,
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = lang === "en" ? "website-outline-tax-prep-ga.txt" : "outline-sitio-impuestos-ga.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <BackgroundGlow />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            {backLink && <div className="shrink-0 mr-2">{backLink}</div>}
            <div className="h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/10" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">{t.nav.title}</div>
              <div className="text-xs text-neutral-300">{t.nav.subtitle}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-200 md:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>{lang === "en" ? "EN" : "ES"}</span>
            </div>

            <button
              onClick={() => setLang((p) => (p === "en" ? "es" : "en"))}
              className="group rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
              aria-label={t.nav.toggleHint}
              title={t.nav.toggleHint}
            >
              <span className="inline-flex items-center gap-2">
                <span className="opacity-90">{t.nav.toggle}</span>
                <span className="opacity-50 transition group-hover:opacity-90">↔</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-10">
        <AnimatePresence mode="wait">
          <motion.section
            key={lang}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-neutral-200">
                  <span className="h-2 w-2 rounded-full bg-violet-400" />
                  <span className="opacity-90">{t.hero.badge}</span>
                </motion.div>

                <motion.h1 variants={fadeUp} className="text-3xl font-bold tracking-tight md:text-5xl">
                  {t.hero.title}
                </motion.h1>

                <motion.p variants={fadeUp} className="max-w-xl text-base leading-relaxed text-neutral-300 md:text-lg">
                  <AutoGlossary text={t.hero.desc} lang={lang} />
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                  <button
                    onClick={scrollToSteps}
                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:opacity-90"
                  >
                    {t.hero.cta1}
                  </button>
                  <button
                    onClick={downloadOutline}
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {t.hero.cta2}
                  </button>
                </motion.div>

                <motion.p variants={fadeUp} className="text-xs leading-relaxed text-neutral-400">
                  {t.hero.disclaimer}
                </motion.p>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease: "easeOut" }}>
                <HeroCard lang={lang} />
              </motion.div>
            </div>
          </motion.section>
        </AnimatePresence>

        <section id="steps" className="mt-16">
          <SectionTitle title={t.sections.overview.title} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-4 md:grid-cols-2">
            {t.sections.overview.items.map((item) => (
              <Card key={item.title} title={item.title} desc={item.desc} lang={lang} />
            ))}
          </motion.div>
        </section>

        <section className="mt-16">
          <SectionTitle title={t.sections.legal.title} />
          <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-3">
            {t.sections.legal.points.map((p) => (
              <motion.li key={p} variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-neutral-200">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400 align-middle" />
                <span className="align-middle"><AutoGlossary text={p} lang={lang} /></span>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        <section className="mt-16">
          <SectionTitle title={t.sections.irs.title} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-4 md:grid-cols-2">
            {t.sections.irs.cards.map((c) => (
              <Card key={c.title} title={c.title} desc={c.desc} accent="violet" lang={lang} />
            ))}
          </motion.div>
        </section>

        <section className="mt-16">
          <SectionTitle title={t.sections.education.title} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-4 md:grid-cols-2">
            {t.sections.education.list.map((c) => (
              <Card key={c.title} title={c.title} desc={c.desc} accent="sky" lang={lang} />
            ))}
          </motion.div>
        </section>

        <section className="mt-16">
          <SectionTitle title={t.sections.business.title} />
          <motion.ol variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="space-y-3">
            {t.sections.business.steps.map((s, idx) => (
              <motion.li key={s} variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-neutral-200">
                <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <AutoGlossary text={s} lang={lang} />
              </motion.li>
            ))}
          </motion.ol>
        </section>

        <section className="mt-16">
          <SectionTitle title={t.sections.tools.title} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-4 md:grid-cols-3">
            {t.sections.tools.items.map((i) => (
              <Card key={i.title} title={i.title} desc={i.desc} accent="emerald" lang={lang} />
            ))}
          </motion.div>
        </section>

        <section className="mt-16">
          <SectionTitle title={t.sections.costs.title} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="grid gap-3">
              {t.sections.costs.rows.map((r) => (
                <motion.div key={r.name} variants={fadeUp} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-neutral-950/30 p-4">
                  <div className="text-sm text-neutral-200"><AutoGlossary text={r.name} lang={lang} /></div>
                  <div className="text-sm font-semibold text-white">{r.value}</div>
                </motion.div>
              ))}
            </div>

            <motion.p variants={fadeUp} className="mt-4 text-xs text-neutral-400">
              <AutoGlossary text={t.sections.costs.note} lang={lang} />
            </motion.p>
          </motion.div>
        </section>

        <section className="mt-16">
          <SectionTitle title={t.sections.faq.title} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="space-y-3">
            {t.sections.faq.qs.map((qa) => (
              <Faq key={qa.q} q={qa.q} a={qa.a} lang={lang} />
            ))}
          </motion.div>
        </section>

        <section className="mt-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xl font-bold">{t.sections.footer.title}</div>
                <div className="mt-1 max-w-2xl text-sm text-neutral-300">{t.sections.footer.desc}</div>
              </div>
              <button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:opacity-90">
                {t.sections.footer.cta}
              </button>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <h2 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
      <div className="hidden text-xs text-neutral-400 md:block">Georgia • IRS • Step-by-step</div>
    </div>
  );
}

function Card({
  title,
  desc,
  accent = "neutral",
  lang = "en",
}: {
  title: string;
  desc: string;
  accent?: "neutral" | "violet" | "emerald" | "sky";
  lang?: Lang;
}) {
  const dot =
    accent === "violet"
      ? "bg-violet-400"
      : accent === "emerald"
        ? "bg-emerald-400"
        : accent === "sky"
          ? "bg-sky-400"
          : "bg-white/40";

  return (
    <motion.div variants={fadeUp} className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start gap-3">
        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${dot}`} />
        <div>
          <div className="text-sm font-semibold text-white"><AutoGlossary text={title} lang={lang} /></div>
          <div className="mt-1 text-sm leading-relaxed text-neutral-300"><AutoGlossary text={desc} lang={lang} /></div>
        </div>
      </div>
    </motion.div>
  );
}

function Faq({ q, a, lang = "en" }: { q: string; a: string; lang?: Lang }) {
  return (
    <motion.details variants={fadeUp} className="group rounded-2xl border border-white/10 bg-white/5 p-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-white">
        <span><AutoGlossary text={q} lang={lang} /></span>
        <span className="text-neutral-400 transition group-open:rotate-45">＋</span>
      </summary>
      <div className="mt-3 text-sm leading-relaxed text-neutral-300"><AutoGlossary text={a} lang={lang} /></div>
    </motion.details>
  );
}

function HeroCard({ lang }: { lang: Lang }) {
  const steps =
    lang === "en"
      ? ["PTIN", "Training", "Local License", "GA DOR Registration", "EFIN (e-file)"]
      : ["PTIN", "Formación", "Licencia local", "Registro GA DOR", "EFIN (e-file)"];

  const heading = lang === "en" ? "Quick checklist" : "Checklist rápida";
  const sub = lang === "en" ? "Start small, then scale 💪" : "Empieza pequeño y escala 💪";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">{heading}</div>
            <div className="mt-1 text-sm text-neutral-300">{sub}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-neutral-950/30 px-4 py-2 text-xs text-neutral-300">
            {lang === "en" ? "Beginner mode" : "Modo principiante"}
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {steps.map((s, idx) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * idx, duration: 0.35, ease: "easeOut" }}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-neutral-950/30 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <div className="text-sm font-medium text-neutral-100">{s}</div>
              </div>
              <span className="text-neutral-400">→</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-neutral-300">
          <AutoGlossary
            text={lang === "en"
              ? "Tip: Apply for EFIN early — approval can take a few weeks."
              : "Tip: Pide el EFIN con tiempo — la aprobación puede tardar semanas."}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}

function BackgroundGlow() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute right-[-200px] top-[120px] h-[520px] w-[520px] rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="absolute bottom-[-260px] left-[-200px] h-[620px] w-[620px] rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
    </div>
  );
}
