"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ClaudeLogo } from "../components/ModelLogos";
import { GlossaryTerm } from "../components/GlossaryTerm";
import { Section, Card, Table, fadeUp, stagger } from "../components/AnalysisUI";
import { LangSwitchWrapper } from "../components/LangSwitchWrapper";

type Lang = "en" | "es";

const ui = {
  en: { menu: "Menu", title: "Claude Code analysis" },
  es: { menu: "Menú", title: "Análisis de Claude Code" },
};

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
              {isEn ? <>Unlike California, Maryland, New York, and Oregon, <strong className="text-white">Georgia does not require a state license, exam, certification, or registration</strong> to work as a paid tax preparer. The only legal requirement to prepare someone&apos;s federal tax return for compensation anywhere in the United States is a valid <GlossaryTerm id="ptin" lang={lang}>Preparer Tax Identification Number (PTIN)</GlossaryTerm> from the IRS. Georgia adds no additional layer on top of this.</> : <>A diferencia de California, Maryland, Nueva York y Oregón, <strong className="text-white">Georgia no requiere licencia estatal, examen, certificación ni registro</strong> para trabajar como preparador de impuestos pagado. El único requisito legal para preparar la declaración federal de alguien por compensación en cualquier lugar de EE.UU. es un <GlossaryTerm id="ptin" lang={lang}>Número de Identificación de Preparador (PTIN)</GlossaryTerm> válido del IRS. Georgia no agrega ninguna capa adicional.</>}
            </p>
            <p>
              {isEn ? <>Georgia Code § 48-2-62 imposes penalties on preparers who file fraudulent returns, including a <strong className="text-white">$500 penalty per check</strong> for fraudulently endorsing refund checks and the ability for the state to seek injunctions barring dishonest preparers. There is no state-mandated bonding or insurance requirement, though both are strongly recommended.</> : <>El Código de Georgia § 48-2-62 impone multas a preparadores que presenten declaraciones fraudulentas, incluyendo una <strong className="text-white">multa de $500 por cheque</strong> por endosar fraudulentamente cheques de reembolso y la capacidad del estado de solicitar órdenes judiciales contra preparadores deshonestos. No hay requisito estatal de fianza o seguro, aunque ambos se recomiendan encarecidamente.</>}
            </p>
            <p>
              {isEn ? <>Sandra will need to register as a <GlossaryTerm id="third-party-filer" lang={lang}>third-party filer</GlossaryTerm> with the Georgia Department of Revenue through the <GlossaryTerm id="gtc" lang={lang}>Georgia Tax Center</GlossaryTerm> (gtc.dor.ga.gov) if she files electronic returns on behalf of clients. This is a free registration. Georgia does not issue its own state-level tax preparer ID — the federal <GlossaryTerm id="ptin" lang={lang}>PTIN</GlossaryTerm> serves as the primary identifier.</> : <>Sandra necesitará registrarse como <GlossaryTerm id="third-party-filer" lang={lang}>presentadora de terceros</GlossaryTerm> en el Departamento de Ingresos de Georgia a través del <GlossaryTerm id="gtc" lang={lang}>Georgia Tax Center</GlossaryTerm> (gtc.dor.ga.gov) si presenta declaraciones electrónicas en nombre de clientes. El registro es gratuito. Georgia no emite su propio ID estatal de preparador — el <GlossaryTerm id="ptin" lang={lang}>PTIN</GlossaryTerm> federal sirve como identificador principal.</>}
            </p>
          </Section>

          <Section title={isEn ? "The three federal credentials Sandra must obtain" : "Las tres credenciales federales que Sandra debe obtener"}>
            <h3 className="mt-4 font-semibold text-amber-300">1. <GlossaryTerm id="ptin" lang={lang}>PTIN</GlossaryTerm> — {isEn ? "Preparer Tax Identification Number" : "Número de Identificación de Preparador"}</h3>
            <p>{isEn ? <>Every paid tax preparer must have a <GlossaryTerm id="ptin" lang={lang}>PTIN</GlossaryTerm> and include it on every return. Apply online at irs.gov in about <strong className="text-white">15 minutes</strong>.</> : <>Todo preparador de impuestos pagado debe tener un <GlossaryTerm id="ptin" lang={lang}>PTIN</GlossaryTerm> e incluirlo en cada declaración. Solicítalo en línea en irs.gov en unos <strong className="text-white">15 minutos</strong>.</>}</p>
            <ul className="list-inside list-disc space-y-1 text-neutral-300">
              <li><strong className="text-white">{isEn ? "Cost:" : "Costo:"}</strong> {isEn ? "$18.75/year (reduced from $19.75 effective Sept 30, 2025)" : "$18.75/año (reducido de $19.75 desde el 30 de sept. 2025)"}</li>
              <li><strong className="text-white">{isEn ? "Process:" : "Proceso:"}</strong> {isEn ? <>IRS Tax Professional PTIN System, verify identity via <GlossaryTerm id="id-me" lang={lang}>ID.me</GlossaryTerm> (government ID + camera), complete application, pay by card or eCheck</> : <>Sistema PTIN del IRS, verificar identidad vía <GlossaryTerm id="id-me" lang={lang}>ID.me</GlossaryTerm> (ID gubernamental + cámara), completar solicitud, pagar con tarjeta o eCheck</>}</li>
              <li><strong className="text-white">{isEn ? "Renewal:" : "Renovación:"}</strong> {isEn ? "PTINs expire Dec 31; renewal opens mid-October annually" : "Los PTIN expiran el 31 de dic.; la renovación abre a mediados de octubre anualmente"}</li>
              <li><strong className="text-white">{isEn ? "Paper option:" : "Opción en papel:"}</strong> {isEn ? <><GlossaryTerm id="w-12" lang={lang}>Form W-12</GlossaryTerm> available but ~6 weeks to process</> : <><GlossaryTerm id="w-12" lang={lang}>Formulario W-12</GlossaryTerm> disponible pero ~6 semanas para procesar</>}</li>
            </ul>

            <h3 className="mt-6 font-semibold text-amber-300">2. <GlossaryTerm id="efin" lang={lang}>EFIN</GlossaryTerm> — {isEn ? "Electronic Filing Identification Number" : "Número de Identificación de Presentación Electrónica"}</h3>
            <p>{isEn ? <>The <GlossaryTerm id="efin" lang={lang}>EFIN</GlossaryTerm> allows Sandra to <GlossaryTerm id="e-file" lang={lang}>e-file</GlossaryTerm>. Any preparer who files <strong className="text-white">11 or more</strong> individual returns in a year must e-file. The EFIN belongs to the firm, not the person.</> : <>El <GlossaryTerm id="efin" lang={lang}>EFIN</GlossaryTerm> permite a Sandra hacer <GlossaryTerm id="e-file" lang={lang}>e-file</GlossaryTerm>. Cualquier preparador que presente <strong className="text-white">11 o más</strong> declaraciones individuales al año debe presentar electrónicamente. El EFIN pertenece a la firma, no a la persona.</>}</p>
            <ul className="list-inside list-disc space-y-1 text-neutral-300">
              <li><strong className="text-white">{isEn ? "Cost:" : "Costo:"}</strong> {isEn ? "Free" : "Gratis"}</li>
              <li><strong className="text-white">{isEn ? "Processing:" : "Procesamiento:"}</strong> {isEn ? "Up to 45 days — apply well before tax season (ideally October or November)" : "Hasta 45 días — solicitar mucho antes de la temporada (idealmente octubre o noviembre)"}</li>
              <li><strong className="text-white">{isEn ? "Application:" : "Solicitud:"}</strong> {isEn ? <>IRS e-Services: create account, submit e-file application (<GlossaryTerm id="ero" lang={lang}>Electronic Return Originator</GlossaryTerm>), complete fingerprinting via IRS-authorized Livescan (free)</> : <>IRS e-Services: crear cuenta, enviar solicitud de e-file (<GlossaryTerm id="ero" lang={lang}>Electronic Return Originator</GlossaryTerm>), completar huellas dactilares vía Livescan autorizado por el IRS (gratis)</>}</li>
              <li><strong className="text-white">{isEn ? "Background check:" : "Verificación de antecedentes:"}</strong> {isEn ? "Credit history, tax compliance, criminal background" : "Historial crediticio, cumplimiento fiscal, antecedentes penales"}</li>
            </ul>

            <h3 className="mt-6 font-semibold text-amber-300">3. <GlossaryTerm id="afsp" lang={lang}>AFSP</GlossaryTerm> — {isEn ? "Annual Filing Season Program (strongly recommended)" : "Programa Anual de Temporada de Presentación (muy recomendado)"}</h3>
            <p>{isEn ? <>Voluntary IRS program giving non-credentialed preparers <GlossaryTerm id="representation-rights" lang={lang}>limited representation rights</GlossaryTerm> before the IRS (revenue agents, customer service, Taxpayer Advocate). Without AFSP, a PTIN-only holder has <strong className="text-white">zero representation rights</strong> and is not listed in the IRS public directory.</> : <>Programa voluntario del IRS que otorga a preparadores sin credenciales <GlossaryTerm id="representation-rights" lang={lang}>derechos de representación limitados</GlossaryTerm> ante el IRS (agentes, servicio al contribuyente, Defensor del Contribuyente). Sin AFSP, un titular solo de PTIN tiene <strong className="text-white">cero derechos de representación</strong> y no aparece en el directorio público del IRS.</>}</p>
            <ul className="list-inside list-disc space-y-1 text-neutral-300">
              <li><strong className="text-white">{isEn ? "Requirements:" : "Requisitos:"}</strong> {isEn ? <>18 hours IRS-approved <GlossaryTerm id="ce" lang={lang}>CE</GlossaryTerm> annually: 6 hours <GlossaryTerm id="aftr" lang={lang}>AFTR</GlossaryTerm> (comprehension test, 100 questions, 70% pass), 10 hours federal tax law, 2 hours ethics</> : <>18 horas de <GlossaryTerm id="ce" lang={lang}>CE</GlossaryTerm> aprobadas por el IRS anualmente: 6 horas de <GlossaryTerm id="aftr" lang={lang}>AFTR</GlossaryTerm> (prueba de comprensión, 100 preguntas, 70% para aprobar), 10 horas de ley tributaria federal, 2 horas de ética</>}</li>
              <li><strong className="text-white">{isEn ? "Cost:" : "Costo:"}</strong> {isEn ? "Typically $100–$250 for a complete AFSP bundle" : "Típicamente $100–$250 por un paquete completo de AFSP"}</li>
              <li><strong className="text-white">{isEn ? "Deadline:" : "Fecha límite:"}</strong> {isEn ? "Dec 31 each year" : "31 de diciembre cada año"}</li>
              <li><strong className="text-white">{isEn ? "CE providers:" : "Proveedores de CE:"}</strong> Surgent, Pronto Tax School, Fast Forward Academy, Gleim, TaxCE, Drake CPE{isEn ? ", and others at ceprovider.us" : " y otros en ceprovider.us"}</li>
            </ul>

            <p className="mt-4 font-medium text-white">{isEn ? "Understanding the preparer hierarchy" : "Entender la jerarquía de preparadores"}</p>
            <Table
              lang={lang}
              headers={isEn ? ["Level", "What's required", "Representation rights", "IRS directory listing"] : ["Nivel", "Qué se requiere", "Derechos de representación", "Directorio del IRS"]}
              rows={isEn ? [
                ["PTIN only", "PTIN ($18.75/yr)", "None", "No"],
                ["AFSP holder", "PTIN + 18 hrs CE/year", "Limited (returns you prepared)", "Yes"],
                ["Enrolled Agent", "PTIN + 3-part SEE exam + 72 hrs CE/3 years", "Unlimited (all matters, all clients)", "Yes"],
                ["CPA / Attorney", "State license + state CE", "Unlimited", "Yes"],
              ] : [
                ["Solo PTIN", "PTIN ($18.75/año)", "Ninguno", "No"],
                ["Titular AFSP", "PTIN + 18 hrs CE/año", "Limitados (declaraciones que preparaste)", "Sí"],
                ["Enrolled Agent", "PTIN + examen SEE 3 partes + 72 hrs CE/3 años", "Ilimitados (todos los asuntos, todos los clientes)", "Sí"],
                ["CPA / Abogado", "Licencia estatal + CE estatal", "Ilimitados", "Sí"],
              ]}
            />
            <p>{isEn ? <>Sandra should aim for AFSP in her first year, then consider the <GlossaryTerm id="enrolled-agent" lang={lang}>Enrolled Agent (EA)</GlossaryTerm> designation. The EA requires passing a three-part <GlossaryTerm id="see" lang={lang}>SEE</GlossaryTerm> exam ($267 per part, $801 total) but has no education prerequisites — anyone with a PTIN can sit for it.</> : <>Sandra debería apuntar al AFSP en su primer año, luego considerar la designación de <GlossaryTerm id="enrolled-agent" lang={lang}>Enrolled Agent (EA)</GlossaryTerm>. El EA requiere aprobar un examen <GlossaryTerm id="see" lang={lang}>SEE</GlossaryTerm> de tres partes ($267 por parte, $801 total) pero no tiene requisitos de educación previa — cualquier persona con PTIN puede presentarlo.</>}</p>
          </Section>

          <Section title={isEn ? "Training options ranked from free to premium" : "Opciones de formación de gratis a premium"}>
            <p className="font-medium text-white">{isEn ? "Free options" : "Opciones gratuitas"}</p>
            <p><strong className="text-white">{isEn ? "IRS VITA Program" : "Programa VITA del IRS"}</strong> — {isEn ? <>Volunteer to prepare returns for low-income taxpayers under supervision. IRS provides training via Link &amp; Learn Taxes; volunteers must pass Basic or Advanced certification (80%+). Sign-up October–January at irs.gov/volunteers. <GlossaryTerm id="vita" lang={lang}>VITA</GlossaryTerm> volunteers with PTIN who pass the advanced exam are <strong className="text-white">exempt from the <GlossaryTerm id="aftr" lang={lang}>AFTR</GlossaryTerm> course</strong> when completing AFSP.</> : <>Voluntariado para preparar declaraciones para contribuyentes de bajos ingresos bajo supervisión. El IRS provee formación vía Link &amp; Learn Taxes; los voluntarios deben pasar la certificación Básica o Avanzada (80%+). Inscripción octubre–enero en irs.gov/volunteers. Los voluntarios <GlossaryTerm id="vita" lang={lang}>VITA</GlossaryTerm> con PTIN que aprueban el examen avanzado están <strong className="text-white">exentos del curso <GlossaryTerm id="aftr" lang={lang}>AFTR</GlossaryTerm></strong> al completar el AFSP.</>}</p>
            <p><strong className="text-white">IRS Link &amp; Learn Taxes</strong> (apps.irs.gov/app/vita/) — {isEn ? "Free, self-paced, Basic through Advanced. Use with Publication 4491 (VITA/TCE Training Guide) and Publication 17 (Your Federal Income Tax)." : "Gratis, a tu ritmo, Básico a Avanzado. Usar con Publicación 4491 (Guía de Formación VITA/TCE) y Publicación 17 (Tu Impuesto Federal)."}</p>

            <p className="mt-6 font-medium text-white">{isEn ? "Budget options ($149–$300)" : "Opciones económicas ($149–$300)"}</p>
            <ul className="list-inside list-disc space-y-2 text-neutral-300">
              <li><strong className="text-white">H&R Block Income Tax Course:</strong> {isEn ? "Tuition free; $149 for materials. ~40 hours (in-person, virtual, or self-paced). Covers filing requirements, dependents, income, deductions, credits, self-employment, ethics. Classes start September; enrollment mid-August. No obligation to work for H&R Block." : "Matrícula gratuita; $149 por materiales. ~40 horas (presencial, virtual o a tu ritmo). Cubre requisitos de presentación, dependientes, ingresos, deducciones, créditos, autoempleo, ética. Clases comienzan en septiembre; inscripción a mediados de agosto. Sin obligación de trabajar para H&R Block."}</li>
              <li><strong className="text-white">Jackson Hewitt Fundamentals of Tax Preparation:</strong> {isEn ? <>~32 hours, 10 modules. Corporate offices often free; franchises $200–$300. IRS-approved <GlossaryTerm id="ce" lang={lang}>CE</GlossaryTerm>.</> : <>~32 horas, 10 módulos. Oficinas corporativas a menudo gratis; franquicias $200–$300. <GlossaryTerm id="ce" lang={lang}>CE</GlossaryTerm> aprobada por el IRS.</>}</li>
              <li><strong className="text-white">Liberty Tax Service:</strong> {isEn ? "Basic course often free; materials ~$199." : "Curso básico frecuentemente gratis; materiales ~$199."}</li>
            </ul>

            <p className="mt-6 font-medium text-white">{isEn ? "Professional-level ($500+)" : "Nivel profesional ($500+)"}</p>
            <p><strong className="text-white">Surgent Income Tax School Comprehensive Tax Course</strong> — {isEn ? <>57 hours, 4 modules, expert-led video, graded exams, hands-on. Up to 6 months to complete. IRS, <GlossaryTerm id="nasba" lang={lang}>NASBA</GlossaryTerm>, <GlossaryTerm id="ctec" lang={lang}>CTEC</GlossaryTerm> approved. ~$500–$800 (promos available). <strong className="text-white">Georgia technical colleges</strong> (e.g., Gwinnett Tech, West Georgia Tech) offer Tax Preparation Specialist certificates; UGA Georgia Center offers Chartered Tax Professional Certificate (ed2go/Surgent).</> : <>57 horas, 4 módulos, video con expertos, exámenes calificados, práctico. Hasta 6 meses para completar. Aprobado por IRS, <GlossaryTerm id="nasba" lang={lang}>NASBA</GlossaryTerm>, <GlossaryTerm id="ctec" lang={lang}>CTEC</GlossaryTerm>. ~$500–$800 (promociones disponibles). <strong className="text-white">Universidades técnicas de Georgia</strong> (ej. Gwinnett Tech, West Georgia Tech) ofrecen certificados de Especialista en Preparación de Impuestos; el Centro de UGA Georgia ofrece Certificado de Profesional Fiscal (ed2go/Surgent).</>}</p>

            <p className="mt-6 font-medium text-amber-300">{isEn ? "Recommended learning path for Sandra" : "Ruta de aprendizaje recomendada para Sandra"}</p>
            <ol className="list-inside list-decimal space-y-2 text-neutral-300">
              <li><strong className="text-white">{isEn ? "Months 1–2 (Summer):" : "Meses 1–2 (Verano):"}</strong> {isEn ? "Read Taxes Made Simple by Mike Piper (~$12) and IRS Pub 17. Start Link & Learn. Apply for PTIN." : "Leer Taxes Made Simple de Mike Piper (~$12) y Publicación 17 del IRS. Comenzar Link & Learn. Solicitar PTIN."}</li>
              <li><strong className="text-white">{isEn ? "Month 3 (Aug–Sep):" : "Mes 3 (Ago–Sep):"}</strong> {isEn ? "Enroll in H&R Block ITC ($149) or Surgent. Sign up for VITA." : "Inscribirse en el ITC de H&R Block ($149) o Surgent. Inscribirse para VITA."}</li>
              <li><strong className="text-white">{isEn ? "Months 4–5 (Oct–Dec):" : "Meses 4–5 (Oct–Dic):"}</strong> {isEn ? "Complete training. Complete AFSP (18 hrs CE by Dec 31). Apply for EFIN. Register business." : "Completar formación. Completar AFSP (18 hrs CE antes del 31 de dic). Solicitar EFIN. Registrar negocio."}</li>
              <li><strong className="text-white">{isEn ? "Months 5–9 (Jan–Apr):" : "Meses 5–9 (Ene–Abr):"}</strong> {isEn ? "Prepare first paid returns. Volunteer with VITA." : "Preparar primeras declaraciones pagadas. Voluntariado con VITA."}</li>
            </ol>
          </Section>

          <Section title={isEn ? "Setting up the business in Georgia, step by step" : "Montar el negocio en Georgia, paso a paso"}>
            <p className="font-medium text-amber-300">{isEn ? "Step 1: Choose a business structure" : "Paso 1: Elegir una estructura de negocio"}</p>
            <p>{isEn ? <><GlossaryTerm id="llc" lang={lang}>LLC</GlossaryTerm> (recommended) — File Articles of Organization at ecorp.sos.ga.gov for <strong className="text-white">$100</strong>. Name must include &quot;LLC&quot; or &quot;Limited Liability Company.&quot; Designate a registered agent in Georgia (can be herself). Annual renewal <strong className="text-white">$50</strong> online (due April 1; $25 late fee after deadline).</> : <><GlossaryTerm id="llc" lang={lang}>LLC</GlossaryTerm> (recomendada) — Presentar Artículos de Organización en ecorp.sos.ga.gov por <strong className="text-white">$100</strong>. El nombre debe incluir &quot;LLC&quot; o &quot;Limited Liability Company.&quot; Designar un agente registrado en Georgia (puede ser ella misma). Renovación anual <strong className="text-white">$50</strong> en línea (vence el 1 de abril; $25 de recargo después).</>}</p>
            <p>{isEn ? <><GlossaryTerm id="sole-proprietorship" lang={lang}>Sole proprietorship</GlossaryTerm> — No state registration but no liability protection. <GlossaryTerm id="dba" lang={lang}>DBA</GlossaryTerm> required if operating under another name: file with Clerk of Superior Court (~$160 plus $40–$60 newspaper publication).</> : <><GlossaryTerm id="sole-proprietorship" lang={lang}>Empresa individual</GlossaryTerm> — Sin registro estatal pero sin protección de responsabilidad. <GlossaryTerm id="dba" lang={lang}>DBA</GlossaryTerm> requerido si operas bajo otro nombre: presentar ante el Clerk of Superior Court (~$160 más $40–$60 publicación en periódico).</>}</p>

            <p className="mt-4 font-medium text-amber-300">{isEn ? <>Step 2: Get an <GlossaryTerm id="ein" lang={lang}>EIN</GlossaryTerm></> : <>Paso 2: Obtener un <GlossaryTerm id="ein" lang={lang}>EIN</GlossaryTerm></>}</p>
            <p>{isEn ? <>Apply free at irs.gov. <GlossaryTerm id="ein" lang={lang}>EIN</GlossaryTerm> issued instantly. Needed for business tax accounts and to avoid using <GlossaryTerm id="ssn" lang={lang}>SSN</GlossaryTerm> on business documents.</> : <>Solicitar gratis en irs.gov. <GlossaryTerm id="ein" lang={lang}>EIN</GlossaryTerm> emitido al instante. Necesario para cuentas fiscales del negocio y para evitar usar el <GlossaryTerm id="ssn" lang={lang}>SSN</GlossaryTerm> en documentos comerciales.</>}</p>

            <p className="mt-4 font-medium text-amber-300">{isEn ? <>Step 3: Register with Georgia <GlossaryTerm id="dor" lang={lang}>DOR</GlossaryTerm></> : <>Paso 3: Registrarse en el <GlossaryTerm id="dor" lang={lang}>DOR</GlossaryTerm> de Georgia</>}</p>
            <p>{isEn ? <>Register through <GlossaryTerm id="gtc" lang={lang}>Georgia Tax Center</GlossaryTerm> (gtc.dor.ga.gov) — free; state tax ID by email within 15 minutes. Register as <GlossaryTerm id="third-party-filer" lang={lang}>third-party filer</GlossaryTerm> (CRF Tax Preparer Registration Form) if e-filing for clients. <strong className="text-amber-300">Tax preparation services are not subject to Georgia sales tax.</strong></> : <>Registrarse a través del <GlossaryTerm id="gtc" lang={lang}>Georgia Tax Center</GlossaryTerm> (gtc.dor.ga.gov) — gratis; ID fiscal estatal por correo en 15 minutos. Registrarse como <GlossaryTerm id="third-party-filer" lang={lang}>presentador de terceros</GlossaryTerm> (CRF Tax Preparer Registration Form) si harás e-file para clientes. <strong className="text-amber-300">Los servicios de preparación de impuestos no están sujetos al impuesto de ventas de Georgia.</strong></>}</p>

            <p className="mt-4 font-medium text-amber-300">{isEn ? "Step 4: Obtain a local occupation tax certificate" : "Paso 4: Obtener un certificado de impuesto ocupacional local"}</p>
            <p>{isEn ? <>Every Georgia county and city requires an <GlossaryTerm id="occupational-tax-certificate" lang={lang}>Occupation Tax Certificate</GlossaryTerm>, including home-based businesses. Examples: Atlanta — $50 base + rates by class + $25/employee; Gwinnett — $80 fee + tax on <GlossaryTerm id="gross-receipts" lang={lang}>gross revenue</GlossaryTerm> ($0.65–$1.30 per $1,000); Cobb, DeKalb, Fulton — similar structures. Home-based may need a home occupation permit from zoning (signage, client traffic, residential compliance).</> : <>Cada condado y ciudad de Georgia requiere un <GlossaryTerm id="occupational-tax-certificate" lang={lang}>Certificado de Impuesto Ocupacional</GlossaryTerm>, incluyendo negocios desde casa. Ejemplos: Atlanta — $50 base + tarifas por clase + $25/empleado; Gwinnett — $80 tarifa + impuesto sobre <GlossaryTerm id="gross-receipts" lang={lang}>ingresos brutos</GlossaryTerm> ($0.65–$1.30 por $1,000); Cobb, DeKalb, Fulton — estructuras similares. Negocios desde casa pueden necesitar permiso de ocupación residencial de zonificación.</>}</p>

            <p className="mt-4 font-medium text-amber-300">{isEn ? <>Step 5: Create a <GlossaryTerm id="wisp" lang={lang}>WISP</GlossaryTerm></> : <>Paso 5: Crear un <GlossaryTerm id="wisp" lang={lang}>WISP</GlossaryTerm></>}</p>
            <p>{isEn ? <>Legally mandatory before preparing a single return. Tax preparers are &quot;financial institutions&quot; under the <GlossaryTerm id="ftc-safeguards-rule" lang={lang}>FTC Safeguards Rule</GlossaryTerm>. Since 2023, preparers must certify WISP compliance when renewing PTIN. Penalties up to <strong className="text-white">$46,517 per violation per day</strong>. IRS Publication 5708 (WISP) and Publication 4557 (safeguarding data). Implement the <GlossaryTerm id="security-six" lang={lang}>Security Six</GlossaryTerm>: antivirus, firewalls, <GlossaryTerm id="mfa" lang={lang}>MFA</GlossaryTerm>, backup, drive encryption, <GlossaryTerm id="vpn" lang={lang}>VPN</GlossaryTerm> for remote access.</> : <>Legalmente obligatorio antes de preparar una sola declaración. Los preparadores son &quot;instituciones financieras&quot; bajo la <GlossaryTerm id="ftc-safeguards-rule" lang={lang}>Regla de Salvaguardas de la FTC</GlossaryTerm>. Desde 2023, los preparadores deben certificar cumplimiento del WISP al renovar el PTIN. Multas de hasta <strong className="text-white">$46,517 por violación por día</strong>. Publicación 5708 del IRS (WISP) y Publicación 4557 (protección de datos). Implementar los <GlossaryTerm id="security-six" lang={lang}>Security Six</GlossaryTerm>: antivirus, firewalls, <GlossaryTerm id="mfa" lang={lang}>MFA</GlossaryTerm>, respaldo, cifrado de disco, <GlossaryTerm id="vpn" lang={lang}>VPN</GlossaryTerm> para acceso remoto.</>}</p>
          </Section>

          <Section title={isEn ? "Complete startup cost breakdown" : "Desglose completo de costes de arranque"}>
            <Table
              lang={lang}
              headers={isEn ? ["Category", "Minimum", "Comfortable"] : ["Categoría", "Mínimo", "Cómodo"]}
              rows={isEn ? [
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
              ] : [
                ["PTIN (anual)", "$19", "$19"],
                ["EFIN", "Gratis", "Gratis"],
                ["EIN", "Gratis", "Gratis"],
                ["Formación LLC Georgia", "$100", "$100"],
                ["Renovación anual LLC", "$50", "$50"],
                ["Certificado impuesto ocupacional", "$80", "$200"],
                ["Formación/educación", "$149 (H&R Block)", "$500 (Surgent + AFSP)"],
                ["Educación continua AFSP", "$100", "$200"],
                ["Software de impuestos", "$350 (Drake PPR)", "$1,875 (Drake Unlimited)"],
                ["Seguro E&O", "$250", "$500"],
                ["Seguro responsabilidad general", "$0", "$350"],
                ["Computadora/equipo", "$0 (existente)", "$1,500"],
                ["Impresora/escáner", "$150", "$400"],
                ["Suministros + archivador", "$200", "$400"],
                ["Sitio web", "$150", "$500"],
                ["Materiales de marketing", "$200", "$750"],
                ["Total", "~$1,800–$2,500", "~$6,500–$7,500"],
              ]}
            />
            <p>{isEn ? <>The most realistic first-year budget for Sandra is <strong className="text-amber-300">$3,000–$5,000</strong>, covering essentials plus adequate software and marketing.</> : <>El presupuesto más realista para el primer año de Sandra es <strong className="text-amber-300">$3,000–$5,000</strong>, cubriendo lo esencial más software y marketing adecuados.</>}</p>
          </Section>

          <Section title={isEn ? "Choosing the right tax software" : "Elegir el software de impuestos adecuado"}>
            <p>{isEn ? <>For Sandra&apos;s first season, <strong className="text-amber-300">Drake Tax Pay-Per-Return at $349.99</strong> (10 returns, full features) is the strongest recommendation. Drake is #1 among sole-proprietor preparers (2024 Tax Adviser Survey), includes all federal and state forms with no per-state surcharges, and has strong support. At 50+ returns, Drake Unlimited (~$1,875–$1,995) makes sense.</> : <>Para la primera temporada de Sandra, <strong className="text-amber-300">Drake Tax Pay-Per-Return a $349.99</strong> (10 declaraciones, funciones completas) es la recomendación más fuerte. Drake es #1 entre preparadores individuales (Encuesta Tax Adviser 2024), incluye todos los formularios federales y estatales sin recargos por estado y tiene buen soporte. Con 50+ declaraciones, Drake Unlimited (~$1,875–$1,995) tiene sentido.</>}</p>
            <p>{isEn ? "Other options: " : "Otras opciones: "}<strong className="text-white">TaxSlayer Pro</strong> — {isEn ? "guided interview workflow and alerts; " : "flujo de trabajo tipo entrevista guiada y alertas; "}<strong className="text-white">TaxAct Professional</strong> — {isEn ? "most budget-friendly unlimited; " : "opción ilimitada más económica; "}<strong className="text-white">UltimateTax</strong> — {isEn ? "$20/return after $388 base. Avoid Lacerte ($7,000+) and UltraTax CS ($2,650+) until established." : "$20/declaración después de $388 base. Evitar Lacerte ($7,000+) y UltraTax CS ($2,650+) hasta estar establecido."}</p>
          </Section>

          <Section title={isEn ? "What to charge and how to find clients" : "Qué cobrar y cómo encontrar clientes"}>
            <p className="font-medium text-white">{isEn ? "Pricing for the Georgia market (2025–2026)" : "Precios para el mercado de Georgia (2025–2026)"}</p>
            <Table
              lang={lang}
              headers={isEn ? ["Return type", "Typical range"] : ["Tipo de declaración", "Rango típico"]}
              rows={isEn ? [
                ["Simple 1040 (W-2, standard deduction)", "$150–$300"],
                ["1040 with itemized deductions", "$250–$400"],
                ["1040 with Schedule C (self-employed)", "$300–$500"],
                ["1040 with rental property (Schedule E)", "$350–$500"],
                ["Small business (1120S, 1065)", "$800–$1,500"],
              ] : [
                ["1040 simple (W-2, deducción estándar)", "$150–$300"],
                ["1040 con deducciones detalladas", "$250–$400"],
                ["1040 con Schedule C (autoempleo)", "$300–$500"],
                ["1040 con propiedad de alquiler (Schedule E)", "$350–$500"],
                ["Negocio pequeño (1120S, 1065)", "$800–$1,500"],
              ]}
            />
            <p>{isEn ? "Start slightly below market to attract first clients; increase 6–10% annually. Never quote before seeing documents; never base fees on refund amounts (IRS prohibited). Bank products (fee from refund) are a major selling point." : "Comenzar ligeramente por debajo del mercado para atraer primeros clientes; aumentar 6–10% anualmente. Nunca cotizar antes de ver documentos; nunca basar tarifas en montos de reembolso (prohibido por el IRS). Los productos bancarios (tarifa del reembolso) son un punto de venta importante."}</p>
            <p className="mt-4 font-medium text-white">{isEn ? "Building a client base from zero" : "Construir una base de clientes desde cero"}</p>
            <p>{isEn ? <>Three approaches: (1) <strong className="text-white">Personal network</strong> — tell everyone, offer introductory discount. (2) <strong className="text-white">Online presence</strong> — claim Google Business Profile, basic website, tax tips on Facebook/LinkedIn 2–4x monthly. (3) <strong className="text-white">Community networking</strong> — BNI, chamber of commerce; partner with financial planners, realtors, bookkeepers. Referral bonus $25–$50 per new client can accelerate growth.</> : <>Tres enfoques: (1) <strong className="text-white">Red personal</strong> — decirle a todos, ofrecer descuento introductorio. (2) <strong className="text-white">Presencia en línea</strong> — reclamar perfil de Google Business, sitio web básico, consejos fiscales en Facebook/LinkedIn 2–4x al mes. (3) <strong className="text-white">Networking comunitario</strong> — BNI, cámara de comercio; asociarse con planificadores financieros, agentes inmobiliarios, contadores. Bono de referido de $25–$50 por nuevo cliente puede acelerar el crecimiento.</>}</p>
            <p>{isEn ? <>Realistic first season (part-time solo): <strong className="text-amber-300">30–75 returns</strong>. Second season: 75–150. Experienced full-time: 200–350. At $250/return average, 75 returns ≈ <strong className="text-amber-300">$18,750</strong> first season.</> : <>Primera temporada realista (tiempo parcial solo): <strong className="text-amber-300">30–75 declaraciones</strong>. Segunda temporada: 75–150. Experimentados a tiempo completo: 200–350. A $250/declaración promedio, 75 declaraciones ≈ <strong className="text-amber-300">$18,750</strong> primera temporada.</>}</p>
          </Section>

          <Section title={isEn ? "Sandra's ideal timeline" : "Cronograma ideal de Sandra"}>
            <Table
              lang={lang}
              headers={isEn ? ["When", "What to do"] : ["Cuándo", "Qué hacer"]}
              rows={isEn ? [
                ["June–July", "Self-study: IRS Pub 17, Taxes Made Simple. Start Link & Learn. Apply for PTIN ($18.75)."],
                ["August–September", "Enroll in H&R Block ITC or Surgent. Begin structured training."],
                ["October", "Apply for EFIN (45 days). Sign up for VITA. File LLC ($100). Get EIN (free, instant)."],
                ["November", "Complete training. Get local occupation tax certificate. Buy software. Set up office. Create WISP."],
                ["December", "Complete AFSP (18 hrs CE by Dec 31). Renew PTIN. Get E&O insurance. Launch website and Google Business. Begin marketing."],
                ["January", "Start preparing returns. Begin VITA volunteering."],
                ["February–April", "Peak season — prepare and file, build relationships, collect referrals."],
                ["May–October (post-season)", "Extensions. EA exam study if desired. Evaluate season. Continue marketing."],
              ] : [
                ["Junio–Julio", "Autoestudio: Pub 17 del IRS, Taxes Made Simple. Comenzar Link & Learn. Solicitar PTIN ($18.75)."],
                ["Agosto–Septiembre", "Inscribirse en ITC de H&R Block o Surgent. Comenzar formación estructurada."],
                ["Octubre", "Solicitar EFIN (45 días). Inscribirse para VITA. Presentar LLC ($100). Obtener EIN (gratis, instantáneo)."],
                ["Noviembre", "Completar formación. Obtener certificado de impuesto ocupacional. Comprar software. Preparar oficina. Crear WISP."],
                ["Diciembre", "Completar AFSP (18 hrs CE antes del 31 dic). Renovar PTIN. Obtener seguro E&O. Lanzar sitio web y Google Business. Comenzar marketing."],
                ["Enero", "Comenzar a preparar declaraciones. Iniciar voluntariado VITA."],
                ["Febrero–Abril", "Temporada alta — preparar y presentar, construir relaciones, recopilar referidos."],
                ["Mayo–Octubre (post-temporada)", "Extensiones. Estudiar para examen EA si se desea. Evaluar temporada. Continuar marketing."],
              ]}
            />
            <p>{isEn ? <>The best time to start is <strong className="text-amber-300">June through August</strong>. Starting later than October makes a January launch difficult.</> : <>El mejor momento para comenzar es <strong className="text-amber-300">junio a agosto</strong>. Comenzar después de octubre hace difícil un lanzamiento en enero.</>}</p>
          </Section>

          <Section title={isEn ? "Avoiding the pitfalls that sink new preparers" : "Evitar los errores que hunden a los preparadores nuevos"}>
            <p>{isEn ? <>The most damaging mistake is <strong className="text-white">failing to meet IRS <GlossaryTerm id="due-diligence" lang={lang}>due diligence</GlossaryTerm> requirements</strong> for <GlossaryTerm id="eitc" lang={lang}>EITC</GlossaryTerm>, <GlossaryTerm id="ctc" lang={lang}>CTC</GlossaryTerm>, <GlossaryTerm id="aotc" lang={lang}>American Opportunity Tax Credit</GlossaryTerm>, and <GlossaryTerm id="hoh" lang={lang}>Head of Household</GlossaryTerm>. Each failure is <strong className="text-white">$650 penalty per credit per return</strong> (2026) — one return with all four = <strong className="text-amber-300">$2,600</strong> in penalties. Complete <GlossaryTerm id="form-8867" lang={lang}>Form 8867</GlossaryTerm> (Paid Preparer&apos;s Due Diligence Checklist) for every applicable return and retain documentation 3 years.</> : <>El error más dañino es <strong className="text-white">no cumplir los requisitos de <GlossaryTerm id="due-diligence" lang={lang}>debida diligencia</GlossaryTerm> del IRS</strong> para <GlossaryTerm id="eitc" lang={lang}>EITC</GlossaryTerm>, <GlossaryTerm id="ctc" lang={lang}>CTC</GlossaryTerm>, <GlossaryTerm id="aotc" lang={lang}>Crédito de Oportunidad Americana</GlossaryTerm> y <GlossaryTerm id="hoh" lang={lang}>Cabeza de Familia</GlossaryTerm>. Cada falla es una <strong className="text-white">multa de $650 por crédito por declaración</strong> (2026) — una declaración con los cuatro = <strong className="text-amber-300">$2,600</strong> en multas. Completar el <GlossaryTerm id="form-8867" lang={lang}>Formulario 8867</GlossaryTerm> (Lista de Debida Diligencia del Preparador) para cada declaración aplicable y conservar documentación 3 años.</>}</p>
            <p>{isEn ? <>Other errors: not mastering software before season, promising specific refunds, undercharging, neglecting data security. Know your limits; refer complex business, multistate, and estate returns to <GlossaryTerm id="cpa" lang={lang}>CPAs</GlossaryTerm> or <GlossaryTerm id="enrolled-agent" lang={lang}>EAs</GlossaryTerm>.</> : <>Otros errores: no dominar el software antes de la temporada, prometer reembolsos específicos, cobrar poco, descuidar la seguridad de datos. Conoce tus límites; refiere declaraciones complejas de negocios, multi-estatales y patrimoniales a <GlossaryTerm id="cpa" lang={lang}>CPAs</GlossaryTerm> o <GlossaryTerm id="enrolled-agent" lang={lang}>EAs</GlossaryTerm>.</>}</p>
            <p>{isEn ? <>Join <GlossaryTerm id="natp" lang={lang}>NATP</GlossaryTerm> (National Association of Tax Professionals) — 23,000+ members, education, fee studies, insurance/CE discounts. <GlossaryTerm id="nsa" lang={lang}>NSA</GlossaryTerm> (National Society of Accountants) is another strong option.</> : <>Únete a <GlossaryTerm id="natp" lang={lang}>NATP</GlossaryTerm> (Asociación Nacional de Profesionales de Impuestos) — 23,000+ miembros, educación, estudios de tarifas, descuentos en seguros/CE. <GlossaryTerm id="nsa" lang={lang}>NSA</GlossaryTerm> (Sociedad Nacional de Contadores) es otra excelente opción.</>}</p>
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
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
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
      <main className="mx-auto max-w-4xl px-4 pb-28 pt-10 sm:px-6" data-readaloud-content>
        <LangSwitchWrapper lang={lang}>
          <ClaudeContent lang={lang} />
        </LangSwitchWrapper>
      </main>
    </div>
  );
}
