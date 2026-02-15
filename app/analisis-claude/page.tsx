"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ClaudeLogo } from "../components/ModelLogos";
import { GlossaryTerm } from "../components/GlossaryTerm";

type Lang = "en" | "es";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const ui = {
  en: { menu: "Menu", title: "Claude Code analysis" },
  es: { menu: "Menú", title: "Análisis de Claude Code" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section variants={fadeUp} className="mt-14 first:mt-0">
      <h2 className="mb-5 text-lg font-bold tracking-tight text-white md:text-xl">{title}</h2>
      <div className="space-y-4 text-sm leading-relaxed text-neutral-300">{children}</div>
    </motion.section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.05]"
    >
      {children}
    </motion.div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <motion.div variants={fadeUp} className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.03]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {headers.map((h) => (
              <th key={h} className="p-3 font-semibold text-white">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={i}
              className="border-b border-white/5 last:border-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              {row.map((cell, j) => (
                <td key={j} className="p-3 text-neutral-300">
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

function ClaudeContent({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  return (
        <motion.article
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-10"
        >
          <motion.header variants={fadeUp} className="space-y-5">
            <div className="flex justify-center">
              <motion.div
                className="rounded-2xl bg-gradient-to-br from-amber-500/25 to-orange-600/20 p-5 ring-1 ring-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ClaudeLogo size={64} />
              </motion.div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              {isEn ? "Sandra's complete roadmap to becoming an independent tax preparer in Georgia" : "Ruta completa de Sandra para ser preparadora de impuestos independiente en Georgia"}
            </h1>
            <p className="text-sm leading-relaxed text-neutral-400">
              {isEn ? (<><strong className="text-white">Georgia requires no state license to prepare taxes for pay — only a federal <GlossaryTerm id="ptin" lang={lang}>PTIN</GlossaryTerm>.</strong> This makes the state one of the easiest places in the country to launch a tax preparation business. Sandra can realistically go from zero experience to preparing her first paid return in <strong className="text-amber-300">3–4 months</strong> with focused study, and launch a legitimate business for as little as <strong className="text-amber-300">$2,000–$3,000</strong>. The key milestones are: get trained, obtain a <GlossaryTerm id="ptin" lang={lang}>PTIN</GlossaryTerm> and <GlossaryTerm id="efin" lang={lang}>EFIN</GlossaryTerm> from the IRS, register her business with the state, buy professional software, and start marketing before tax season begins. This guide covers every step in detail — legal requirements, training options, business setup, costs, timeline, and success strategies — all current for the 2025–2026 tax season.</>) : (<><strong className="text-white">Georgia no exige licencia estatal para preparar impuestos por pago — solo un PTIN federal.</strong> Esto hace del estado uno de los más sencillos para montar un negocio de preparación. Sandra puede pasar de cero experiencia a preparar su primera declaración pagada en <strong className="text-amber-300">3–4 meses</strong> con estudio enfocado, y lanzar un negocio legítimo por tan solo <strong className="text-amber-300">$2,000–$3,000</strong>. Los hitos clave son: formarse, obtener PTIN y EFIN del IRS, registrar el negocio en el estado, comprar software profesional y empezar a promocionarse antes de la temporada. Esta guía cubre cada paso: requisitos legales, opciones de formación, montaje del negocio, costes, cronograma y estrategias de éxito, actualizado para la temporada 2025–2026.</>)}
            </p>
          </motion.header>

          <Section title={isEn ? "Georgia has almost no barriers to entry" : "Georgia tiene casi ninguna barrera de entrada"}>
            <p>
              Unlike California, Maryland, New York, and Oregon, <strong className="text-white">Georgia does not require a state license, exam, certification, or registration</strong> to work as a paid tax preparer. The only legal requirement to prepare someone&apos;s federal tax return for compensation anywhere in the United States is a valid <GlossaryTerm id="ptin" lang={lang}>Preparer Tax Identification Number (PTIN)</GlossaryTerm> from the IRS. Georgia adds no additional layer on top of this.
            </p>
            <p>
              Georgia Code § 48-2-62 imposes penalties on preparers who file fraudulent returns, including a <strong className="text-white">$500 penalty per check</strong> for fraudulently endorsing refund checks and the ability for the state to seek injunctions barring dishonest preparers. There is no state-mandated bonding or insurance requirement, though both are strongly recommended.
            </p>
            <p>
              Sandra will need to register as a <GlossaryTerm id="third-party-filer" lang={lang}>third-party filer</GlossaryTerm> with the Georgia Department of Revenue through the Georgia Tax Center (gtc.dor.ga.gov) if she files electronic returns on behalf of clients. This is a free registration. Georgia does not issue its own state-level tax preparer ID — the federal PTIN serves as the primary identifier.
            </p>
          </Section>

          <Section title={isEn ? "The three federal credentials Sandra must obtain" : "Las tres credenciales federales que Sandra debe obtener"}>
            <h3 className="mt-4 font-semibold text-amber-300">1. <GlossaryTerm id="ptin" lang={lang}>PTIN</GlossaryTerm> — Preparer Tax Identification Number</h3>
            <p>Every paid tax preparer must have a PTIN and include it on every return. Apply online at irs.gov in about <strong className="text-white">15 minutes</strong>.</p>
            <ul className="list-inside list-disc space-y-1 text-neutral-300">
              <li><strong className="text-white">Cost:</strong> $18.75/year (reduced from $19.75 effective Sept 30, 2025)</li>
              <li><strong className="text-white">Process:</strong> IRS Tax Professional PTIN System, verify identity via ID.me (government ID + camera), complete application, pay by card or eCheck</li>
              <li><strong className="text-white">Renewal:</strong> PTINs expire Dec 31; renewal opens mid-October annually</li>
              <li><strong className="text-white">Paper option:</strong> Form W-12 available but ~6 weeks to process</li>
            </ul>

            <h3 className="mt-6 font-semibold text-amber-300">2. <GlossaryTerm id="efin" lang={lang}>EFIN</GlossaryTerm> — Electronic Filing Identification Number</h3>
            <p>The EFIN allows Sandra to e-file. Any preparer who files <strong className="text-white">11 or more</strong> individual returns in a year must e-file. The EFIN belongs to the firm, not the person.</p>
            <ul className="list-inside list-disc space-y-1 text-neutral-300">
              <li><strong className="text-white">Cost:</strong> Free</li>
              <li><strong className="text-white">Processing:</strong> Up to 45 days — apply well before tax season (ideally October or November)</li>
              <li><strong className="text-white">Application:</strong> IRS e-Services: create account, submit e-file application (Electronic Return Originator), complete fingerprinting via IRS-authorized Livescan (free)</li>
              <li><strong className="text-white">Background check:</strong> Credit history, tax compliance, criminal background</li>
            </ul>

            <h3 className="mt-6 font-semibold text-amber-300">3. <GlossaryTerm id="afsp" lang={lang}>AFSP</GlossaryTerm> — Annual Filing Season Program (strongly recommended)</h3>
            <p>Voluntary IRS program giving non-credentialed preparers <GlossaryTerm id="representation-rights" lang={lang}>limited representation rights</GlossaryTerm> before the IRS (revenue agents, customer service, Taxpayer Advocate). Without AFSP, a PTIN-only holder has <strong className="text-white">zero representation rights</strong> and is not listed in the IRS public directory.</p>
            <ul className="list-inside list-disc space-y-1 text-neutral-300">
              <li><strong className="text-white">Requirements:</strong> 18 hours IRS-approved CE annually: 6 hours AFTR (comprehension test, 100 questions, 70% pass), 10 hours federal tax law, 2 hours ethics</li>
              <li><strong className="text-white">Cost:</strong> Typically $100–$250 for a complete AFSP bundle</li>
              <li><strong className="text-white">Deadline:</strong> Dec 31 each year</li>
              <li><strong className="text-white">CE providers:</strong> Surgent, Pronto Tax School, Fast Forward Academy, Gleim, TaxCE, Drake CPE, and others at ceprovider.us</li>
            </ul>

            <p className="mt-4 font-medium text-white">Understanding the preparer hierarchy</p>
            <Table
              headers={["Level", "What's required", "Representation rights", "IRS directory listing"]}
              rows={[
                ["PTIN only", "PTIN ($18.75/yr)", "None", "No"],
                ["AFSP holder", "PTIN + 18 hrs CE/year", "Limited (returns you prepared)", "Yes"],
                ["Enrolled Agent", "PTIN + 3-part SEE exam + 72 hrs CE/3 years", "Unlimited (all matters, all clients)", "Yes"],
                ["CPA / Attorney", "State license + state CE", "Unlimited", "Yes"],
              ]}
            />
            <p>Sandra should aim for AFSP in her first year, then consider the <GlossaryTerm id="enrolled-agent" lang={lang}>Enrolled Agent (EA)</GlossaryTerm> designation. The EA requires passing a three-part exam ($267 per part, $801 total) but has no education prerequisites — anyone with a PTIN can sit for it.</p>
          </Section>

          <Section title={isEn ? "Training options ranked from free to premium" : "Opciones de formación de gratis a premium"}>
            <p className="font-medium text-white">Free options</p>
            <p><strong className="text-white">IRS VITA Program</strong> — Volunteer to prepare returns for low-income taxpayers under supervision. IRS provides training via Link & Learn Taxes; volunteers must pass Basic or Advanced certification (80%+). Sign-up October–January at irs.gov/volunteers. VITA volunteers with PTIN who pass the advanced exam are <strong className="text-white">exempt from the AFTR course</strong> when completing AFSP.</p>
            <p><strong className="text-white">IRS Link & Learn Taxes</strong> (apps.irs.gov/app/vita/) — Free, self-paced, Basic through Advanced. Use with Publication 4491 (VITA/TCE Training Guide) and Publication 17 (Your Federal Income Tax).</p>

            <p className="mt-6 font-medium text-white">Budget options ($149–$300)</p>
            <ul className="list-inside list-disc space-y-2 text-neutral-300">
              <li><strong className="text-white">H&R Block Income Tax Course:</strong> Tuition free; $149 for materials. ~40 hours (in-person, virtual, or self-paced). Covers filing requirements, dependents, income, deductions, credits, self-employment, ethics. Classes start September; enrollment mid-August. No obligation to work for H&R Block.</li>
              <li><strong className="text-white">Jackson Hewitt Fundamentals of Tax Preparation:</strong> ~32 hours, 10 modules. Corporate offices often free; franchises $200–$300. IRS-approved CE.</li>
              <li><strong className="text-white">Liberty Tax Service:</strong> Basic course often free; materials ~$199.</li>
            </ul>

            <p className="mt-6 font-medium text-white">Professional-level ($500+)</p>
            <p><strong className="text-white">Surgent Income Tax School Comprehensive Tax Course</strong> — 57 hours, 4 modules, expert-led video, graded exams, hands-on. Up to 6 months to complete. IRS, NASBA, CTEC approved. ~$500–$800 (promos available). <strong className="text-white">Georgia technical colleges</strong> (e.g., Gwinnett Tech, West Georgia Tech) offer Tax Preparation Specialist certificates; UGA Georgia Center offers Chartered Tax Professional Certificate (ed2go/Surgent).</p>

            <p className="mt-6 font-medium text-amber-300">Recommended learning path for Sandra</p>
            <ol className="list-inside list-decimal space-y-2 text-neutral-300">
              <li><strong className="text-white">Months 1–2 (Summer):</strong> Read <em>Taxes Made Simple</em> by Mike Piper (~$12) and IRS Pub 17. Start Link & Learn. Apply for PTIN.</li>
              <li><strong className="text-white">Month 3 (Aug–Sep):</strong> Enroll in H&R Block ITC ($149) or Surgent. Sign up for VITA.</li>
              <li><strong className="text-white">Months 4–5 (Oct–Dec):</strong> Complete training. Complete AFSP (18 hrs CE by Dec 31). Apply for EFIN. Register business.</li>
              <li><strong className="text-white">Months 5–9 (Jan–Apr):</strong> Prepare first paid returns. Volunteer with VITA.</li>
            </ol>
          </Section>

          <Section title={isEn ? "Setting up the business in Georgia, step by step" : "Montar el negocio en Georgia, paso a paso"}>
            <p className="font-medium text-amber-300">Step 1: Choose a business structure</p>
            <p><GlossaryTerm id="llc" lang={lang}>LLC</GlossaryTerm> (recommended) — File Articles of Organization at ecorp.sos.ga.gov for <strong className="text-white">$100</strong>. Name must include &quot;LLC&quot; or &quot;Limited Liability Company.&quot; Designate a registered agent in Georgia (can be herself). Annual renewal <strong className="text-white">$50</strong> online (due April 1; $25 late fee after deadline).</p>
            <p><GlossaryTerm id="sole-proprietorship" lang={lang}>Sole proprietorship</GlossaryTerm> — No state registration but no liability protection. <GlossaryTerm id="dba" lang={lang}>DBA</GlossaryTerm> required if operating under another name: file with Clerk of Superior Court (~$160 plus $40–$60 newspaper publication).</p>

            <p className="mt-4 font-medium text-amber-300">Step 2: Get an <GlossaryTerm id="ein" lang={lang}>EIN</GlossaryTerm></p>
            <p>Apply free at irs.gov. EIN issued instantly. Needed for business tax accounts and to avoid using SSN on business documents.</p>

            <p className="mt-4 font-medium text-amber-300">Step 3: Register with Georgia DOR</p>
            <p>Register through Georgia Tax Center (gtc.dor.ga.gov) — free; state tax ID by email within 15 minutes. Register as third-party filer (CRF Tax Preparer Registration Form) if e-filing for clients. <strong className="text-amber-300">Tax preparation services are not subject to Georgia sales tax.</strong></p>

            <p className="mt-4 font-medium text-amber-300">Step 4: Obtain a local occupation tax certificate</p>
            <p>Every Georgia county and city requires an <GlossaryTerm id="occupational-tax-certificate" lang={lang}>Occupation Tax Certificate</GlossaryTerm>, including home-based businesses. Examples: Atlanta — $50 base + rates by class + $25/employee; Gwinnett — $80 fee + tax on gross revenue ($0.65–$1.30 per $1,000); Cobb, DeKalb, Fulton — similar structures. Home-based may need a home occupation permit from zoning (signage, client traffic, residential compliance).</p>

            <p className="mt-4 font-medium text-amber-300">Step 5: Create a Written Information Security Plan (<GlossaryTerm id="wisp" lang={lang}>WISP</GlossaryTerm>)</p>
            <p>Legally mandatory before preparing a single return. Tax preparers are &quot;financial institutions&quot; under the FTC Safeguards Rule. Since 2023, preparers must certify WISP compliance when renewing PTIN. Penalties up to <strong className="text-white">$46,517 per violation per day</strong>. IRS Publication 5708 (WISP) and Publication 4557 (safeguarding data). Implement the <GlossaryTerm id="security-six" lang={lang}>Security Six</GlossaryTerm>: antivirus, firewalls, MFA, backup, drive encryption, VPN for remote access.</p>
          </Section>

          <Section title={isEn ? "Complete startup cost breakdown" : "Desglose completo de costes de arranque"}>
            <Table
              headers={["Category", "Minimum", "Comfortable"]}
              rows={[
                ["PTIN (annual)", "$19", "$19"],
                ["EFIN", "Free", "Free"],
                ["EIN", "Free", "Free"],
                ["Georgia LLC formation", "$100", "$100"],
                ["LLC annual renewal", "$50", "$50"],
                ["Local occupation tax certificate", "$80", "$200"],
                ["Training/education", "$149 (H&R Block)", "$500 (Surgent + AFSP)"],
                ["AFSP continuing education", "$100", "$200"],
                ["Tax software", "$350 (Drake PPR)", "$1,875 (Drake Unlimited)"],
                ["E&O insurance", "$250", "$500"],
                ["General liability insurance", "$0", "$350"],
                ["Computer/equipment", "$0 (existing)", "$1,500"],
                ["Printer/scanner", "$150", "$400"],
                ["Office supplies + filing cabinet", "$200", "$400"],
                ["Website", "$150", "$500"],
                ["Marketing materials", "$200", "$750"],
                ["Total", "~$1,800–$2,500", "~$6,500–$7,500"],
              ]}
            />
            <p>The most realistic first-year budget for Sandra is <strong className="text-amber-300">$3,000–$5,000</strong>, covering essentials plus adequate software and marketing.</p>
          </Section>

          <Section title={isEn ? "Choosing the right tax software" : "Elegir el software de impuestos adecuado"}>
            <p>For Sandra&apos;s first season, <strong className="text-amber-300">Drake Tax Pay-Per-Return at $349.99</strong> (10 returns, full features) is the strongest recommendation. Drake is #1 among sole-proprietor preparers (2024 Tax Adviser Survey), includes all federal and state forms with no per-state surcharges, and has strong support. At 50+ returns, Drake Unlimited (~$1,875–$1,995) makes sense.</p>
            <p>Other options: <strong className="text-white">TaxSlayer Pro</strong> — guided interview workflow and alerts; <strong className="text-white">TaxAct Professional</strong> — most budget-friendly unlimited; <strong className="text-white">UltimateTax</strong> — $20/return after $388 base. Avoid Lacerte ($7,000+) and UltraTax CS ($2,650+) until established.</p>
          </Section>

          <Section title={isEn ? "What to charge and how to find clients" : "Qué cobrar y cómo encontrar clientes"}>
            <p className="font-medium text-white">Pricing for the Georgia market (2025–2026)</p>
            <Table
              headers={["Return type", "Typical range"]}
              rows={[
                ["Simple 1040 (W-2, standard deduction)", "$150–$300"],
                ["1040 with itemized deductions", "$250–$400"],
                ["1040 with Schedule C (self-employed)", "$300–$500"],
                ["1040 with rental property (Schedule E)", "$350–$500"],
                ["Small business (1120S, 1065)", "$800–$1,500"],
              ]}
            />
            <p>Start slightly below market to attract first clients; increase 6–10% annually. Never quote before seeing documents; never base fees on refund amounts (IRS prohibited). Bank products (fee from refund) are a major selling point.</p>
            <p className="mt-4 font-medium text-white">Building a client base from zero</p>
            <p>Three approaches: (1) <strong className="text-white">Personal network</strong> — tell everyone, offer introductory discount. (2) <strong className="text-white">Online presence</strong> — claim Google Business Profile, basic website, tax tips on Facebook/LinkedIn 2–4x monthly. (3) <strong className="text-white">Community networking</strong> — BNI, chamber of commerce; partner with financial planners, realtors, bookkeepers. Referral bonus $25–$50 per new client can accelerate growth.</p>
            <p>Realistic first season (part-time solo): <strong className="text-amber-300">30–75 returns</strong>. Second season: 75–150. Experienced full-time: 200–350. At $250/return average, 75 returns ≈ <strong className="text-amber-300">$18,750</strong> first season.</p>
          </Section>

          <Section title={isEn ? "Sandra's ideal timeline" : "Cronograma ideal de Sandra"}>
            <Table
              headers={["When", "What to do"]}
              rows={[
                ["June–July", "Self-study: IRS Pub 17, Taxes Made Simple. Start Link & Learn. Apply for PTIN ($18.75)."],
                ["August–September", "Enroll in H&R Block ITC or Surgent. Begin structured training."],
                ["October", "Apply for EFIN (45 days). Sign up for VITA. File LLC ($100). Get EIN (free, instant)."],
                ["November", "Complete training. Get local occupation tax certificate. Buy software. Set up office. Create WISP."],
                ["December", "Complete AFSP (18 hrs CE by Dec 31). Renew PTIN. Get E&O insurance. Launch website and Google Business. Begin marketing."],
                ["January", "Start preparing returns. Begin VITA volunteering."],
                ["February–April", "Peak season — prepare and file, build relationships, collect referrals."],
                ["May–October (post-season)", "Extensions. EA exam study if desired. Evaluate season. Continue marketing."],
              ]}
            />
            <p>The best time to start is <strong className="text-amber-300">June through August</strong>. Starting later than October makes a January launch difficult.</p>
          </Section>

          <Section title={isEn ? "Avoiding the pitfalls that sink new preparers" : "Evitar los errores que hunden a los preparadores nuevos"}>
            <p>The most damaging mistake is <strong className="text-white">failing to meet IRS <GlossaryTerm id="due-diligence" lang={lang}>due diligence</GlossaryTerm> requirements</strong> for <GlossaryTerm id="eitc" lang={lang}>EITC</GlossaryTerm>, <GlossaryTerm id="ctc" lang={lang}>CTC</GlossaryTerm>, American Opportunity Tax Credit, and Head of Household. Each failure is <strong className="text-white">$650 penalty per credit per return</strong> (2026) — one return with all four = <strong className="text-amber-300">$2,600</strong> in penalties. Complete Form 8867 (Paid Preparer&apos;s Due Diligence Checklist) for every applicable return and retain documentation 3 years.</p>
            <p>Other errors: not mastering software before season, promising specific refunds, undercharging, neglecting data security. Know your limits; refer complex business, multistate, and estate returns to CPAs or EAs.</p>
            <p>Join <strong className="text-white">NATP</strong> (National Association of Tax Professionals) — 23,000+ members, education, fee studies, insurance/CE discounts. <strong className="text-white">NSA</strong> (National Society of Accountants) is another strong option.</p>
          </Section>

          <Section title={isEn ? "Conclusion" : "Conclusión"}>
            <p>
              {isEn ? "Sandra's path in Georgia is remarkably accessible: no state licensing, affordable training, and startup cost as low as $2,000–$3,000. Success factors are practical: solid training before the first season, complete AFSP for credibility and representation rights, master the software, market aggressively before tax season, and maintain rigorous data security and due diligence. View the first season as a learning investment; target 50–75 returns at competitive rates and build toward the Enrolled Agent credential. The industry rewards consistency and relationships — clients who trust Sandra will return and bring referrals." : "El camino de Sandra en Georgia es muy accesible: sin licencia estatal, formación asequible y coste de arranque desde $2,000–$3,000. Los factores de éxito son prácticos: formación sólida antes de la primera temporada, completar el AFSP para credibilidad y derechos de representación, dominar el software, promocionarse antes de la temporada y mantener seguridad de datos y debida diligencia. Considera la primera temporada una inversión de aprendizaje; apunta a 50–75 declaraciones a precios competitivos y avanza hacia la credencial de Enrolled Agent. La industria premia la constancia y las relaciones: los clientes que confíen en Sandra volverán y traerán referidos."}
            </p>
          </Section>
        </motion.article>
  );
}

export default function AnalisisClaudePage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = ui[lang];
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-[-180px] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-amber-500/12 blur-[100px]"
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-160px] top-[40%] h-[360px] w-[360px] rounded-full bg-orange-500/10 blur-[100px]"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-neutral-950/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/10 hover:text-white">
                ← {t.menu}
              </Link>
            </motion.span>
            <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/glossary" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/10 hover:text-white">
                {lang === "en" ? "Glossary" : "Glosario"}
              </Link>
            </motion.span>
          </div>
          <div className="flex items-center gap-2">
            <ClaudeLogo size={32} />
            <span className="hidden text-sm font-semibold sm:inline">{t.title}</span>
            <motion.button
              onClick={() => setLang((p) => (p === "en" ? "es" : "en"))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/10"
              aria-label={lang === "en" ? "Switch to Spanish" : "Cambiar a inglés"}
            >
              {lang === "en" ? "ES" : "EN"}
            </motion.button>
          </div>
        </div>
      </motion.header>
      <main className="mx-auto max-w-3xl px-4 pb-28 pt-10" data-readaloud-content>
        <ClaudeContent lang={lang} />
      </main>
    </div>
  );
}
