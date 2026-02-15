"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GeminiLogo } from "../components/ModelLogos";
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
  en: { menu: "Menu", title: "Gemini analysis" },
  es: { menu: "Menú", title: "Análisis de Gemini" },
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

function GeminiContent({ lang }: { lang: Lang }) {
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
            className="rounded-2xl bg-gradient-to-br from-blue-500/25 to-violet-600/20 p-5 ring-1 ring-white/10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <GeminiLogo size={64} />
          </motion.div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          {isEn
            ? "Comprehensive Strategic Framework for Establishing an Independent Tax Practice in Georgia"
            : "Marco estratégico para establecer una práctica de impuestos independiente en Georgia"}
        </h1>
        <p className="text-sm leading-relaxed text-neutral-400">
          {isEn
            ? "The professional landscape for tax preparation in Georgia represents a distinct intersection of federal oversight and local administrative requirements. For an aspiring practitioner such as Sandra, entering from a non-accounting background, the path to independent business ownership is paved with specific regulatory milestones, technological necessities, and strategic marketing imperatives. Georgia does not mandate a state-level license for tax preparers who are not CPAs. This low barrier to entry creates significant opportunity, provided one navigates federal requirements and local occupational taxes."
            : "El panorama profesional de la preparación de impuestos en Georgia representa una intersección entre supervisión federal y requisitos administrativos locales. Para una profesional como Sandra, sin formación en contabilidad, el camino hacia un negocio independiente implica hitos regulatorios, necesidades tecnológicas y estrategias de marketing. Georgia no exige licencia estatal para preparadores que no son CPA. Esta baja barrera de entrada ofrece una oportunidad significativa, siempre que se cumplan los requisitos federales y los impuestos ocupacionales locales."}
        </p>
      </motion.header>

          <Section title={isEn ? "Strategic Evaluation of Entry Pathways" : "Evaluación estratégica de vías de entrada"}>
            <p>
              {isEn ? "For a beginner starting from scratch, the industry offers three primary trajectories:" : "Para un principiante desde cero, la industria ofrece tres trayectorias principales:"}
            </p>
            <ul className="list-inside list-disc space-y-2 text-neutral-300">
              <li><strong className="text-white">Institutional Apprenticeship:</strong> Seasonal employment with H&R Block or Jackson Hewitt. Jackson Hewitt’s Fundamentals of Tax Preparation (FTP) is typically a 30-hour program (12 modules: filing requirements, dependents, <GlossaryTerm id="eitc" lang={lang}>EITC</GlossaryTerm>, <GlossaryTerm id="ctc" lang={lang}>CTC</GlossaryTerm>, etc.). The firm provides software, <GlossaryTerm id="efin" lang={lang}>EFIN</GlossaryTerm>, and office space—but the practitioner does not own client relationships or full revenue.</li>
              <li><strong className="text-white">Independent Certification Path:</strong> Georgia Southern’s Chartered Tax Professional (CTP) certificate, or Surgent’s Comprehensive Tax Course (no prior accounting required). CTP requires 500 hours of qualifying experience. This path builds professional vocabulary and technical proficiency for operating without a major firm.</li>
              <li><strong className="text-white">Digital Academy Path:</strong> Intuit Academy—free, self-paced, designed for TurboTax Live. Focus on 1099/W-2 scenarios and high-income taxpayers. Ideal for starting as a remote practice with digital workflows.</li>
            </ul>
            <Table
              headers={["Pathway", "Primary Provider Examples", "Duration/Experience", "Key Benefit"]}
              rows={[
                ["Retail Firm Apprenticeship", "Jackson Hewitt, H&R Block", "30–60 Hours", "Supervised environment, low overhead"],
                ["Independent Certification", "Georgia Southern (CTP), Surgent", "500 Experience Hours", "Professional designation, deep expertise"],
                ["Platform Integration", "Intuit Academy", "Self-paced", "High-tech workflow, remote readiness"],
              ]}
            />
          </Section>

          <Section title={isEn ? "Federal Regulatory Foundations: PTIN and EFIN" : "Bases regulatorias federales: PTIN y EFIN"}>
            <p><GlossaryTerm id="ptin" lang={lang}>PTIN</GlossaryTerm> — {isEn ? "Mandatory for anyone who prepares federal returns for compensation. Online application via IRS (~15 min). 2025 fee: $18.75. Renew every year (mid-October–Dec 31). The PTIN belongs to the individual; each preparer in a firm must have their own." : "Obligatorio para quien prepare declaraciones federales por pago. Solicitud en línea en IRS (~15 min). Tarifa 2025: $18.75. Renovación anual (mitad de octubre–31 dic). El PTIN es individual."}</p>
            <p><GlossaryTerm id="efin" lang={lang}>EFIN</GlossaryTerm> — {isEn ? "Identifies the firm authorized to e-file. Federal rules require e-filing if you expect to file 11+ individual returns per year. The EFIN process includes a suitability check (criminal history, credit, tax compliance). Non-CPA/non-attorney applicants need fingerprints: call IRS 866-255-0654 for fingerprint card. Allow up to 45 days—apply at least two months before tax season." : "Identifica a la firma autorizada para e-file. Las normas federales exigen e-file si presentarás 11 o más declaraciones individuales al año. Incluye verificación de idoneidad (antecedentes, crédito, cumplimiento fiscal). No CPA/no abogado: huellas dactilares; llamar al IRS 866-255-0654. Hasta 45 días; solicitar al menos dos meses antes de la temporada."}</p>
            <Table
              headers={isEn ? ["Federal Credential", "Issuing Body", "Purpose", "Requirement for Beginners"] : ["Credencial federal", "Emisor", "Propósito", "Requisito para principiantes"]}
              rows={isEn ? [["PTIN", "IRS", "Individual legal authorization", "Mandatory for all paid preparers"], ["EFIN", "IRS", "Firm-level e-filing authorization", "Mandatory for those filing 11+ returns"], ["AFSP", "IRS", "Voluntary professional distinction", "Requires 18 hours of annual CE"]] : [["PTIN", "IRS", "Autorización legal individual", "Obligatorio para preparadores pagados"], ["EFIN", "IRS", "Autorización e-file de la firma", "Obligatorio si presentas 11+ declaraciones"], ["AFSP", "IRS", "Distinción profesional voluntaria", "18 horas de CE anual"]]}
            />
          </Section>

          <Section title={isEn ? "Annual Filing Season Program (AFSP)" : "Programa Anual de Temporada de Presentación (AFSP)"}>
            <p>
              {isEn ? "For preparers without EA or CPA credentials, AFSP is the most effective way to establish credibility. To earn the AFSP Record of Completion: complete 18 hours of CE from an IRS-approved provider, including a 6-hour \"Annual Federal Tax Refresher\" (AFTR) with a comprehension test, and consent to IRS Circular 230 ethics. AFSP participants are listed in a public IRS database and have limited representation rights—they can represent clients (for returns they prepared) before IRS revenue agents and customer service. Without AFSP, a basic PTIN holder cannot represent clients after the return is filed." : "Para preparadores sin credencial EA o CPA, el AFSP es la forma más efectiva de ganar credibilidad. Para obtener el Registro de Finalización: 18 horas de CE de un proveedor aprobado por el IRS, incluyendo 6 horas del curso AFTR con prueba, y consentir la ética del Circular 230. Los participantes aparecen en la base pública del IRS y tienen derechos de representación limitados ante agentes y servicio al contribuyente. Sin AFSP, un titular solo de PTIN no puede representar clientes después de presentar la declaración."}
            </p>
          </Section>

          <Section title={isEn ? "Georgia State Compliance: Third-Party Filer" : "Cumplimiento en Georgia: Third-Party Filer"}>
            <p>
              Georgia does not require a specific license for tax preparation, but the Georgia DOR requires anyone filing returns on behalf of others to register as a <GlossaryTerm id="third-party-filer" lang={lang}>Third-Party Filer</GlossaryTerm> on the Georgia Tax Center (GTC) portal. This allows managing client accounts and submitting returns under a professional login (using the client’s personal credentials is prohibited). Registration can be done with or without an existing GTC login; new filers typically receive a tax account number by email within ~15 minutes.
            </p>
            <p>
              <strong className="text-white">Single vs. Bulk Filers:</strong> Standard Third-Party Filers enter transactions individually; Bulk Filers submit one electronic file for multiple clients. For a solo practitioner, standard Third-Party Filer registration is the appropriate entry point (e.g., Georgia Form 500).
            </p>
          </Section>

          <Section title={isEn ? "Business Entity Formation and Local Occupational Taxes" : "Formación de entidad y impuestos ocupacionales locales"}>
            <p>
              <GlossaryTerm id="llc" lang={lang}>LLC</GlossaryTerm> is the most common structure: $100 filing fee with the Georgia Secretary of State, plus a registered agent in the state. LLC offers limited personal liability and pass-through taxation. <GlossaryTerm id="sole-proprietorship" lang={lang}>Sole proprietorship</GlossaryTerm> is simpler but offers no liability protection—risky in a profession where a single error can lead to client penalties.
            </p>
            <p>
              <GlossaryTerm id="occupational-tax-certificate" lang={lang}>Occupational Tax Certificate</GlossaryTerm> (business license): Administered at city/county level in Georgia. Even home-based businesses must pay and display the certificate. Requirements vary by jurisdiction (e.g., Atlanta: E-Verify/SAVE affidavits; Douglas County: zoning approval, driver’s license, utility bill; Peachtree City: tax based on employee count, ~$107 minimum for first four employees; Cherokee: in-person application, proof of residency).
            </p>
            <Table
              headers={["County/City", "Key Requirement", "Fee Basis", "Notable Detail"]}
              rows={[
                ["Atlanta", "E-Verify/SAVE Affidavits", "Gross Receipts", "ATLBIZ portal preferred"],
                ["Douglas", "Zoning Approval", "Gross Receipts", "Notaries available in office"],
                ["Peachtree City", "E-Verify for all", "Employee Count", "Home-based must pay annual tax"],
                ["Henry", "Zoning Approval", "District-specific", "Processed same-day in person"],
                ["Cherokee", "Proof of Residency", "Employee Count", "Late fee 10% after Jan 31"],
              ]}
            />
          </Section>

          <Section title={isEn ? "Operational Infrastructure: Software and Technical Standards" : "Infraestructura operativa: software y estándares técnicos"}>
            <p>Three primary options for a solo preparer in 2026:</p>
            <ul className="list-inside list-disc space-y-2 text-neutral-300">
              <li><strong className="text-white">Drake Tax:</strong> Highly rated for single-preparer firms; fast, keyboard-driven; strong diagnostics. Interface can feel dated.</li>
              <li><strong className="text-white">TaxSlayer Pro:</strong> User-friendly, good for beginners; strong cloud version for remote work.</li>
              <li><strong className="text-white">Intuit ProConnect:</strong> Cloud-based, integrates with QuickBooks; higher per-return cost; AI-powered deduction tools.</li>
            </ul>
            <p>Professional software should provide diagnostic feedback and data validation to prevent math errors and rejected e-files. Under <strong className="text-white">IRS Publication 4557</strong> and the FTC Safeguards Rule, tax professionals are treated as financial institutions and must implement a Written Information Security Plan (<GlossaryTerm id="wisp" lang={lang}>WISP</GlossaryTerm>) and the IRS &quot;<GlossaryTerm id="security-six" lang={lang}>Security Six</GlossaryTerm>&quot;: antivirus/anti-malware, firewalls, drive encryption, MFA, backup/disaster recovery (3-2-1 rule), and VPN for remote access to client data.</p>
          </Section>

          <Section title={isEn ? "Risk Management: Insurance" : "Gestión de riesgos: seguros"}>
            <Table
              headers={["Insurance Type", "Average Annual Cost (GA)", "Key Protection"]}
              rows={[
                ["Errors & Omissions", "$340", "Professional mistakes/advice"],
                ["Cyber Liability", "$460", "Data breaches/hacks"],
                ["General Liability", "$300", "Slip and fall accidents"],
                ["Workers' Comp", "$320", "Employee injuries"],
                ["Fidelity Bond", "$85", "Employee theft/dishonesty"],
              ]}
            />
            <p><GlossaryTerm id="eando" lang={lang}>E&O</GlossaryTerm> and cyber liability are especially important; consider &quot;Prior Acts&quot; coverage for E&O. General liability is needed if clients visit a physical office; workers’ comp is typically required in Georgia if you have employees.</p>
          </Section>

          <Section title={isEn ? "Strategic Marketing and Client Acquisition" : "Marketing estratégico y captación de clientes"}>
            <p>Establish trust by targeting a <strong className="text-white">niche</strong> (e.g., local freelancers, military families, small business owners) and engaging in relevant communities (subreddits, Facebook groups) to demonstrate expertise. Collect detailed reviews (Google My Business, Yelp) that mention specific outcomes. A <strong className="text-white">professional, mobile-friendly website</strong> with a bio highlighting training and AFSP status is the cornerstone of a modern practice. Educational content (glossary, state filing guide, client readiness checklist) builds trust and reduces repetitive questions.</p>
          </Section>

          <Section title={isEn ? "Educational Content for Your Website" : "Contenido educativo para tu sitio web"}>
            <p className="font-medium text-white">Tax terminology (plain English):</p>
            <ul className="list-inside list-disc space-y-1 text-neutral-300">
              <li><GlossaryTerm id="agi" lang={lang}>AGI</GlossaryTerm> — Total income minus above-the-line adjustments; determines eligibility for many credits.</li>
              <li><strong className="text-white">Deduction</strong> — Reduces taxable income (e.g., Standard Deduction).</li>
              <li><strong className="text-white">Credit</strong> — Reduces tax dollar-for-dollar (more powerful than a deduction).</li>
              <li><strong className="text-white">Refundable vs. non-refundable credits</strong> — Non-refundable can only zero out tax; refundable can yield a refund.</li>
              <li><strong className="text-white">Withholding</strong> — Amount employer sends to the government; too much → refund, too little → balance due.</li>
            </ul>
            <p className="mt-4 font-medium text-white">Georgia Form 500:</p>
            <p>File if you are required to file federally or if income exceeds the standard deduction ($12,000 single / $24,000 MFJ for 2024–2025). Part-year/nonresidents use Form 500NR if Georgia income exceeds $5,000. E-file and direct deposit can yield refunds in ~30 days; paper returns may take up to 12 weeks.</p>
            <p className="mt-4 font-medium text-white">Client readiness checklist:</p>
            <p>Identity documents (SSN/ITIN for taxpayer, spouse, dependents); income statements (W-2s, 1099-NEC/K, 1099-INT, 1099-G); expense records (1098, property taxes, charitable receipts, childcare/education); prior-year federal and state returns.</p>
          </Section>

          <Section title={isEn ? "12-Month Roadmap for Launch" : "Hoja de ruta de 12 meses para el lanzamiento"}>
            <div className="space-y-6">
              <Card>
                <div className="font-semibold text-blue-300">Phase 1: Educational Foundation (May–August)</div>
                <p className="mt-2">Complete a comprehensive course (Surgent, Jackson Hewitt, Intuit Academy). Research primary client niche. Begin reviewing AFSP requirements.</p>
              </Card>
              <Card>
                <div className="font-semibold text-blue-300">Phase 2: Federal and State Credentialing (September–October)</div>
                <p className="mt-2">Apply/renew <GlossaryTerm id="ptin" lang={lang}>PTIN</GlossaryTerm> when the window opens (mid-October, $18.75). Create IRS e-Services account and submit <GlossaryTerm id="efin" lang={lang}>EFIN</GlossaryTerm> application; request fingerprint instructions immediately. Register as <GlossaryTerm id="third-party-filer" lang={lang}>Third-Party Filer</GlossaryTerm> with Georgia DOR.</p>
              </Card>
              <Card>
                <div className="font-semibold text-blue-300">Phase 3: Business Formation and Compliance (November–December)</div>
                <p className="mt-2">File Articles of Organization for <GlossaryTerm id="llc" lang={lang}>LLC</GlossaryTerm> with Georgia Secretary of State ($100). Apply for local <GlossaryTerm id="occupational-tax-certificate" lang={lang}>Occupational Tax Certificate</GlossaryTerm>. Draft <GlossaryTerm id="wisp" lang={lang}>WISP</GlossaryTerm> and implement <GlossaryTerm id="security-six" lang={lang}>Security Six</GlossaryTerm>. Purchase <GlossaryTerm id="eando" lang={lang}>E&O</GlossaryTerm> and cyber liability insurance.</p>
              </Card>
              <Card>
                <div className="font-semibold text-blue-300">Phase 4: Operational Launch (December–January)</div>
                <p className="mt-2">Finalize professional software and complete training. Launch website with educational content and client checklist. Announce practice to network and niche communities.</p>
              </Card>
            </div>
          </Section>

          <Section title={isEn ? "Conclusion" : "Conclusión"}>
            <p>
              {isEn ? "The journey to becoming an independent tax preparer in Georgia combines a low regulatory barrier at the state level with rigorous federal standards (data security, ethics, e-file suitability). Success depends on continuous education (e.g., AFSP), strategic firm management (LLC, E&O and cyber insurance, Security Six), professional-grade software with strong diagnostics, and a digital presence that builds trust. This systematic approach ensures the firm is legally compliant and positioned to deliver the high-quality, secure service modern taxpayers expect." : "El camino para ser preparador de impuestos independiente en Georgia combina una baja barrera regulatoria estatal con estándares federales rigurosos (seguridad de datos, ética, idoneidad para e-file). El éxito depende de la formación continua (p. ej. AFSP), la gestión estratégica de la firma (LLC, seguros E&O y cibernético, Security Six), software profesional con buenos diagnósticos y una presencia digital que genere confianza. Este enfoque sistemático asegura que la firma cumpla la ley y esté en condiciones de ofrecer el servicio seguro y de calidad que los contribuyentes esperan."}
            </p>
          </Section>
        </motion.article>
  );
}

export default function AnalisisGeminiPage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = ui[lang];
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-[-180px] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-blue-500/12 blur-[100px]"
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-160px] top-[40%] h-[360px] w-[360px] rounded-full bg-violet-500/10 blur-[100px]"
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
            <GeminiLogo size={32} />
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
        <GeminiContent lang={lang} />
      </main>
    </div>
  );
}
