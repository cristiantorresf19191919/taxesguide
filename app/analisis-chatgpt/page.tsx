"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChatGPTLogo } from "../components/ModelLogos";
import { GlossaryTerm } from "../components/GlossaryTerm";
import { Section, Card, Table, fadeUp, stagger } from "../components/AnalysisUI";

type Lang = "en" | "es";

const ui = {
  en: { menu: "Menu", title: "ChatGPT analysis" },
  es: { menu: "Menú", title: "Análisis de ChatGPT" },
};

function ChatGPTContent({ lang }: { lang: Lang }) {
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
            className="rounded-2xl bg-gradient-to-br from-emerald-500/25 to-teal-600/20 p-5 ring-1 ring-white/10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <ChatGPTLogo size={64} />
          </motion.div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          {isEn
            ? "How to become a tax preparer in Georgia: a step-by-step guide for beginners"
            : "Cómo ser preparador de impuestos en Georgia: guía paso a paso para principiantes"}
        </h1>
        <p className="text-sm leading-relaxed text-neutral-400">
          {isEn ? (
            <>
              <strong className="text-white">Georgia is one of the most accessible states in the U.S. to start a tax preparation business.</strong> There is no state license required — only a federal <GlossaryTerm id="ptin" lang={lang}>PTIN</GlossaryTerm>. This guide walks Sandra through every step: from understanding the industry landscape, to obtaining credentials, to setting up a profitable practice. With focused effort over <strong className="text-emerald-300">3–5 months</strong>, she can go from zero experience to filing her first paid return for as little as <strong className="text-emerald-300">$2,000–$4,000</strong> in startup costs. Below is the complete playbook — training options, IRS credentials, Georgia business requirements, software comparisons, pricing strategies, and a month-by-month timeline.
            </>
          ) : (
            <>
              <strong className="text-white">Georgia es uno de los estados más accesibles en EE.UU. para iniciar un negocio de preparación de impuestos.</strong> No se requiere licencia estatal — solo un <GlossaryTerm id="ptin" lang={lang}>PTIN</GlossaryTerm> federal. Esta guía lleva a Sandra paso a paso: desde entender la industria, obtener credenciales, hasta montar una práctica rentable. Con esfuerzo enfocado durante <strong className="text-emerald-300">3–5 meses</strong>, puede pasar de cero experiencia a presentar su primera declaración pagada con tan solo <strong className="text-emerald-300">$2,000–$4,000</strong> de inversión inicial. Abajo está el plan completo: opciones de formación, credenciales del IRS, requisitos de negocio en Georgia, comparación de software, estrategias de precios y un cronograma mes a mes.
            </>
          )}
        </p>
      </motion.header>

      <Section title={isEn ? "Industry overview: why tax preparation is a strong opportunity" : "Panorama de la industria: por qué la preparación de impuestos es una buena oportunidad"}>
        <p>
          {isEn
            ? "The U.S. tax preparation industry generates over $14 billion annually, serving approximately 150 million individual returns filed each year. Around 60% of Americans use a paid tax preparer, and that percentage increases among taxpayers with self-employment income, rental properties, or complex family situations. The industry is seasonal but predictable: the bulk of revenue flows between January and April, with extension work stretching into October."
            : "La industria de preparación de impuestos en EE.UU. genera más de $14 mil millones anuales, sirviendo aproximadamente 150 millones de declaraciones individuales al año. Alrededor del 60% de los estadounidenses usan un preparador pagado, y ese porcentaje aumenta entre contribuyentes con ingresos de autoempleo, propiedades de alquiler o situaciones familiares complejas. La industria es estacional pero predecible: la mayor parte de los ingresos fluye entre enero y abril, con extensiones hasta octubre."}
        </p>
        <p>
          {isEn
            ? "Georgia's regulatory environment is especially favorable. Unlike California, Maryland, New York, and Oregon — which require state-level licensing, bonding, or exams — Georgia imposes no such requirements. Any adult with a valid PTIN can legally prepare federal and Georgia state tax returns for compensation. This makes it one of the lowest-barrier entry points for a new preparer in the entire country."
            : "El entorno regulatorio de Georgia es especialmente favorable. A diferencia de California, Maryland, Nueva York y Oregón — que requieren licencias estatales, fianzas o exámenes — Georgia no impone tales requisitos. Cualquier adulto con un PTIN válido puede preparar legalmente declaraciones federales y estatales de Georgia por compensación. Esto lo convierte en uno de los puntos de entrada con menor barrera para un nuevo preparador en todo el país."}
        </p>
      </Section>

      <Section title={isEn ? "Step 1: Get your PTIN (Preparer Tax Identification Number)" : "Paso 1: Obtener tu PTIN (Número de Identificación de Preparador)"}>
        <p>
          {isEn
            ? "The PTIN is the single mandatory federal credential. Every person who prepares or assists in preparing a federal tax return for compensation must have one. It must appear on every return you prepare."
            : "El PTIN es la única credencial federal obligatoria. Toda persona que prepare o asista en la preparación de una declaración federal por compensación debe tener uno. Debe aparecer en cada declaración que prepares."}
        </p>
        <ul className="list-inside list-disc space-y-1 text-neutral-300">
          <li><strong className="text-white">{isEn ? "Where:" : "Dónde:"}</strong> {isEn ? "IRS Tax Professional PTIN System (irs.gov)" : "Sistema PTIN de Profesionales de Impuestos del IRS (irs.gov)"}</li>
          <li><strong className="text-white">{isEn ? "Cost:" : "Costo:"}</strong> $18.75/{isEn ? "year" : "año"}</li>
          <li><strong className="text-white">{isEn ? "Time:" : "Tiempo:"}</strong> {isEn ? "~15 minutes online; issued immediately" : "~15 minutos en línea; se emite inmediatamente"}</li>
          <li><strong className="text-white">{isEn ? "Identity verification:" : "Verificación de identidad:"}</strong> {isEn ? "ID.me (government-issued photo ID + selfie)" : "ID.me (identificación con foto emitida por el gobierno + selfie)"}</li>
          <li><strong className="text-white">{isEn ? "Renewal:" : "Renovación:"}</strong> {isEn ? "Annual — PTINs expire December 31; renewal window opens mid-October" : "Anual — los PTIN expiran el 31 de diciembre; la ventana de renovación abre a mediados de octubre"}</li>
          <li><strong className="text-white">{isEn ? "Paper option:" : "Opción en papel:"}</strong> {isEn ? "Form W-12 (takes ~6 weeks)" : "Formulario W-12 (tarda ~6 semanas)"}</li>
        </ul>
        <p className="font-medium text-emerald-300">
          {isEn
            ? "Sandra should apply for her PTIN as soon as she decides to pursue this career — it's fast, inexpensive, and is required before she can legally prepare a single return."
            : "Sandra debería solicitar su PTIN tan pronto como decida seguir esta carrera — es rápido, económico y es obligatorio antes de poder preparar legalmente una sola declaración."}
        </p>
      </Section>

      <Section title={isEn ? "Step 2: Choose a training program" : "Paso 2: Elegir un programa de formación"}>
        <p className="font-medium text-white">{isEn ? "Free options" : "Opciones gratuitas"}</p>
        <ul className="list-inside list-disc space-y-2 text-neutral-300">
          <li>
            <strong className="text-white">IRS VITA/TCE Program</strong> — {isEn
              ? "Volunteer Income Tax Assistance. Free IRS-provided training via Link & Learn Taxes (apps.irs.gov/app/vita/). Sandra prepares returns for low-income and elderly taxpayers under supervision. Must pass Basic or Advanced certification (80% minimum). Excellent hands-on experience. Sign-up October through January."
              : "Asistencia Voluntaria de Impuestos sobre la Renta. Formación gratuita del IRS a través de Link & Learn Taxes (apps.irs.gov/app/vita/). Sandra prepara declaraciones para contribuyentes de bajos ingresos y personas mayores bajo supervisión. Debe pasar la certificación Básica o Avanzada (mínimo 80%). Excelente experiencia práctica. Inscripciones de octubre a enero."}
          </li>
          <li>
            <strong className="text-white">IRS Publications</strong> — {isEn
              ? "Publication 17 (Your Federal Income Tax), Publication 4491 (VITA Training Guide). Free downloads at irs.gov. Together, these are a comprehensive self-study resource."
              : "Publicación 17 (Tu Impuesto Federal), Publicación 4491 (Guía de Formación VITA). Descarga gratuita en irs.gov. Juntas, son un recurso completo de autoestudio."}
          </li>
        </ul>

        <p className="mt-6 font-medium text-white">{isEn ? "Budget options ($149–$300)" : "Opciones económicas ($149–$300)"}</p>
        <ul className="list-inside list-disc space-y-2 text-neutral-300">
          <li>
            <strong className="text-white">H&R Block Income Tax Course:</strong> {isEn
              ? "Tuition free; ~$149 for materials. Approximately 40 hours (in-person, virtual, or self-paced). Covers filing requirements, dependents, income types, deductions, credits, self-employment basics, and ethics. Classes start September; enrollment mid-August. No obligation to work for H&R Block afterward."
              : "Matrícula gratuita; ~$149 por materiales. Aproximadamente 40 horas (presencial, virtual o a tu ritmo). Cubre requisitos de presentación, dependientes, tipos de ingresos, deducciones, créditos, conceptos básicos de autoempleo y ética. Las clases comienzan en septiembre; inscripción a mediados de agosto. Sin obligación de trabajar para H&R Block después."}
          </li>
          <li>
            <strong className="text-white">Jackson Hewitt Fundamentals:</strong> {isEn
              ? "~32 hours, 12 modules. Corporate offices often free; franchises $200–$300. IRS-approved CE credit."
              : "~32 horas, 12 módulos. Oficinas corporativas frecuentemente gratis; franquicias $200–$300. Crédito de CE aprobado por el IRS."}
          </li>
        </ul>

        <p className="mt-6 font-medium text-white">{isEn ? "Professional-level ($500+)" : "Nivel profesional ($500+)"}</p>
        <ul className="list-inside list-disc space-y-2 text-neutral-300">
          <li>
            <strong className="text-white">Surgent Comprehensive Tax Course:</strong> {isEn
              ? "57 hours, 4 modules, expert-led video, graded exams. Up to 6 months to complete. IRS, NASBA, CTEC approved. ~$500–$800."
              : "57 horas, 4 módulos, video con expertos, exámenes calificados. Hasta 6 meses para completar. Aprobado por IRS, NASBA, CTEC. ~$500–$800."}
          </li>
          <li>
            <strong className="text-white">{isEn ? "Georgia technical colleges:" : "Universidades técnicas de Georgia:"}</strong> {isEn
              ? "Gwinnett Tech, West Georgia Tech offer Tax Preparation Specialist certificates. UGA Georgia Center offers Chartered Tax Professional (CTP) certificate via ed2go/Surgent."
              : "Gwinnett Tech, West Georgia Tech ofrecen certificados de Especialista en Preparación de Impuestos. El Centro de UGA Georgia ofrece certificado de Profesional Fiscal Colegiado (CTP) a través de ed2go/Surgent."}
          </li>
        </ul>

        <Table
          lang={lang}
          headers={isEn ? ["Program", "Cost", "Hours", "Best for"] : ["Programa", "Costo", "Horas", "Ideal para"]}
          rows={isEn ? [
            ["IRS VITA (free)", "$0", "40+", "Hands-on experience under supervision"],
            ["H&R Block ITC", "$149 materials", "~40", "Structured beginner course"],
            ["Jackson Hewitt FTP", "$0–$300", "~32", "Quick start with possible employment"],
            ["Surgent Comprehensive", "$500–$800", "57", "Deep professional knowledge"],
            ["Georgia Tech Colleges", "$500–$1,200", "Varies", "Formal certification pathway"],
          ] : [
            ["IRS VITA (gratis)", "$0", "40+", "Experiencia práctica supervisada"],
            ["H&R Block ITC", "$149 materiales", "~40", "Curso estructurado para principiantes"],
            ["Jackson Hewitt FTP", "$0–$300", "~32", "Inicio rápido con posible empleo"],
            ["Surgent Comprehensive", "$500–$800", "57", "Conocimiento profesional profundo"],
            ["Universidades técnicas GA", "$500–$1,200", "Varía", "Ruta de certificación formal"],
          ]}
        />
      </Section>

      <Section title={isEn ? "Step 3: Complete the AFSP (Annual Filing Season Program)" : "Paso 3: Completar el AFSP (Programa Anual de Temporada de Presentación)"}>
        <p>
          {isEn
            ? "The AFSP is a voluntary IRS program designed for preparers who don't hold an EA, CPA, or attorney license. It is strongly recommended because it provides two major benefits: (1) limited representation rights before the IRS (you can represent clients for returns you prepared before revenue agents and customer service), and (2) listing in the IRS public directory of tax preparers — a trust signal for potential clients."
            : "El AFSP es un programa voluntario del IRS diseñado para preparadores que no tienen licencia de EA, CPA o abogado. Se recomienda encarecidamente porque brinda dos beneficios principales: (1) derechos de representación limitados ante el IRS (puedes representar clientes para declaraciones que preparaste ante agentes y servicio al contribuyente), y (2) inclusión en el directorio público del IRS de preparadores de impuestos — una señal de confianza para clientes potenciales."}
        </p>
        <p className="font-medium text-white">{isEn ? "Requirements:" : "Requisitos:"}</p>
        <ul className="list-inside list-disc space-y-1 text-neutral-300">
          <li>{isEn ? "18 hours of IRS-approved continuing education annually:" : "18 horas de educación continua aprobada por el IRS anualmente:"}</li>
          <li className="ml-4">{isEn ? "6 hours: Annual Federal Tax Refresher (AFTR) — includes a comprehension test (100 questions, 70% to pass)" : "6 horas: Repaso Federal Anual de Impuestos (AFTR) — incluye prueba de comprensión (100 preguntas, 70% para aprobar)"}</li>
          <li className="ml-4">{isEn ? "10 hours: Federal tax law topics" : "10 horas: Temas de ley tributaria federal"}</li>
          <li className="ml-4">{isEn ? "2 hours: Ethics" : "2 horas: Ética"}</li>
          <li><strong className="text-white">{isEn ? "Cost:" : "Costo:"}</strong> {isEn ? "Typically $100–$250 for a complete AFSP CE bundle" : "Típicamente $100–$250 por un paquete completo de CE para AFSP"}</li>
          <li><strong className="text-white">{isEn ? "Deadline:" : "Fecha límite:"}</strong> {isEn ? "December 31 each year" : "31 de diciembre de cada año"}</li>
        </ul>
        <p>
          {isEn
            ? "Without AFSP, a PTIN-only preparer has zero representation rights and does not appear in the IRS directory. Clients increasingly search this directory before hiring a preparer."
            : "Sin el AFSP, un preparador solo con PTIN tiene cero derechos de representación y no aparece en el directorio del IRS. Los clientes cada vez más buscan en este directorio antes de contratar a un preparador."}
        </p>

        <Table
          lang={lang}
          headers={isEn ? ["Credential level", "Requirements", "Representation rights", "IRS directory"] : ["Nivel de credencial", "Requisitos", "Derechos de representación", "Directorio IRS"]}
          rows={isEn ? [
            ["PTIN only", "PTIN ($18.75/yr)", "None", "No"],
            ["AFSP holder", "PTIN + 18 hrs CE/year", "Limited (returns you prepared)", "Yes"],
            ["Enrolled Agent", "PTIN + 3-part SEE exam", "Unlimited (all matters)", "Yes"],
            ["CPA / Attorney", "State license + state CE", "Unlimited", "Yes"],
          ] : [
            ["Solo PTIN", "PTIN ($18.75/año)", "Ninguno", "No"],
            ["Titular AFSP", "PTIN + 18 hrs CE/año", "Limitados (declaraciones preparadas)", "Sí"],
            ["Agente Inscrito", "PTIN + examen SEE de 3 partes", "Ilimitados (todos los asuntos)", "Sí"],
            ["CPA / Abogado", "Licencia estatal + CE estatal", "Ilimitados", "Sí"],
          ]}
        />
      </Section>

      <Section title={isEn ? "Step 4: Apply for your EFIN (Electronic Filing Identification Number)" : "Paso 4: Solicitar tu EFIN (Número de Identificación de Presentación Electrónica)"}>
        <p>
          {isEn
            ? "The EFIN is the firm-level credential that allows e-filing. Federal rules mandate e-filing if you expect to file 11 or more individual returns in a year. Since virtually all clients expect electronic filing, this is effectively mandatory."
            : "El EFIN es la credencial a nivel de firma que permite la presentación electrónica. Las reglas federales exigen e-file si esperas presentar 11 o más declaraciones individuales al año. Dado que prácticamente todos los clientes esperan presentación electrónica, esto es efectivamente obligatorio."}
        </p>
        <ul className="list-inside list-disc space-y-1 text-neutral-300">
          <li><strong className="text-white">{isEn ? "Cost:" : "Costo:"}</strong> {isEn ? "Free" : "Gratis"}</li>
          <li><strong className="text-white">{isEn ? "Processing time:" : "Tiempo de procesamiento:"}</strong> {isEn ? "Up to 45 days — apply well before tax season (ideally October–November)" : "Hasta 45 días — solicitar mucho antes de la temporada de impuestos (idealmente octubre–noviembre)"}</li>
          <li><strong className="text-white">{isEn ? "Process:" : "Proceso:"}</strong> {isEn ? "Create IRS e-Services account → submit e-file application (Electronic Return Originator) → complete fingerprinting via IRS-authorized Livescan" : "Crear cuenta en e-Services del IRS → enviar solicitud de e-file (Electronic Return Originator) → completar toma de huellas vía Livescan autorizado por el IRS"}</li>
          <li><strong className="text-white">{isEn ? "Background check:" : "Verificación de antecedentes:"}</strong> {isEn ? "Credit history, tax compliance, criminal background" : "Historial crediticio, cumplimiento fiscal, antecedentes penales"}</li>
        </ul>
        <p className="font-medium text-emerald-300">
          {isEn
            ? "Critical: Apply for the EFIN by October at the latest. The 45-day processing window means a November application may not be approved in time for January filing season."
            : "Crítico: Solicitar el EFIN a más tardar en octubre. La ventana de procesamiento de 45 días significa que una solicitud de noviembre podría no aprobarse a tiempo para la temporada de enero."}
        </p>
      </Section>

      <Section title={isEn ? "Step 5: Set up your business in Georgia" : "Paso 5: Establecer tu negocio en Georgia"}>
        <p className="font-medium text-emerald-300">{isEn ? "Business structure" : "Estructura del negocio"}</p>
        <p>
          {isEn
            ? <>An <GlossaryTerm id="llc" lang={lang}>LLC</GlossaryTerm> is the recommended structure for a new tax preparer. It provides personal liability protection (separating personal assets from business liability) while maintaining simple pass-through taxation. File Articles of Organization with the Georgia Secretary of State at ecorp.sos.ga.gov for <strong className="text-white">$100</strong>. Annual renewal is <strong className="text-white">$50</strong> (due April 1).</>
            : <>Una <GlossaryTerm id="llc" lang={lang}>LLC</GlossaryTerm> es la estructura recomendada para un nuevo preparador de impuestos. Proporciona protección de responsabilidad personal (separando bienes personales de la responsabilidad del negocio) mientras mantiene tributación directa simple. Presentar Artículos de Organización con el Secretario de Estado de Georgia en ecorp.sos.ga.gov por <strong className="text-white">$100</strong>. La renovación anual es <strong className="text-white">$50</strong> (vence el 1 de abril).</>}
        </p>
        <p>
          {isEn
            ? <><GlossaryTerm id="sole-proprietorship" lang={lang}>Sole proprietorship</GlossaryTerm> is simpler (no state filing) but offers zero liability protection. A <GlossaryTerm id="dba" lang={lang}>DBA</GlossaryTerm> costs ~$160 plus $40–$60 newspaper publication if operating under a trade name.</>
            : <><GlossaryTerm id="sole-proprietorship" lang={lang}>Empresa individual</GlossaryTerm> es más simple (sin presentación estatal) pero ofrece cero protección de responsabilidad. Un <GlossaryTerm id="dba" lang={lang}>DBA</GlossaryTerm> cuesta ~$160 más $40–$60 de publicación en periódico si operas bajo un nombre comercial.</>}
        </p>

        <p className="mt-4 font-medium text-emerald-300"><GlossaryTerm id="ein" lang={lang}>EIN</GlossaryTerm> ({isEn ? "Employer Identification Number" : "Número de Identificación del Empleador"})</p>
        <p>{isEn ? "Apply free at irs.gov — issued instantly online. Required for business bank accounts and to avoid using your SSN on business documents." : "Solicitar gratis en irs.gov — se emite instantáneamente en línea. Requerido para cuentas bancarias comerciales y para evitar usar tu SSN en documentos del negocio."}</p>

        <p className="mt-4 font-medium text-emerald-300">{isEn ? "Georgia DOR registration" : "Registro en el DOR de Georgia"}</p>
        <p>{isEn
          ? <>Register through the Georgia Tax Center (gtc.dor.ga.gov) — free; receive your state tax ID by email within ~15 minutes. Register as a <GlossaryTerm id="third-party-filer" lang={lang}>third-party filer</GlossaryTerm> if you will e-file state returns for clients. <strong className="text-emerald-300">Tax preparation services are not subject to Georgia sales tax.</strong></>
          : <>Registrarse a través del Georgia Tax Center (gtc.dor.ga.gov) — gratis; recibes tu ID fiscal estatal por correo en ~15 minutos. Registrarse como <GlossaryTerm id="third-party-filer" lang={lang}>presentador de terceros</GlossaryTerm> si vas a presentar declaraciones estatales electrónicamente para clientes. <strong className="text-emerald-300">Los servicios de preparación de impuestos no están sujetos al impuesto de ventas de Georgia.</strong></>}
        </p>

        <p className="mt-4 font-medium text-emerald-300">{isEn ? "Local occupation tax certificate" : "Certificado de impuesto ocupacional local"}</p>
        <p>{isEn
          ? <><GlossaryTerm id="occupational-tax-certificate" lang={lang}>Occupation Tax Certificate</GlossaryTerm> — required by every Georgia county and city, including home-based businesses. Fees vary by jurisdiction: Atlanta ~$50 base; Gwinnett ~$80 + tax on gross revenue; Cobb, DeKalb, Fulton have similar structures. Home-based businesses may need a home occupation permit from zoning.</>
          : <><GlossaryTerm id="occupational-tax-certificate" lang={lang}>Certificado de Impuesto Ocupacional</GlossaryTerm> — requerido por cada condado y ciudad de Georgia, incluyendo negocios desde casa. Las tarifas varían por jurisdicción: Atlanta ~$50 base; Gwinnett ~$80 + impuesto sobre ingresos brutos; Cobb, DeKalb, Fulton tienen estructuras similares. Los negocios desde casa pueden necesitar un permiso de ocupación del hogar de zonificación.</>}
        </p>
      </Section>

      <Section title={isEn ? "Step 6: Choose your tax software" : "Paso 6: Elegir tu software de impuestos"}>
        <p>
          {isEn
            ? "Professional tax software is different from consumer products like TurboTax. It provides diagnostic feedback, e-file capabilities, and multi-client management. Here's how the main options compare for a new solo preparer:"
            : "El software profesional de impuestos es diferente de los productos para consumidores como TurboTax. Proporciona retroalimentación de diagnóstico, capacidades de e-file y gestión de múltiples clientes. Así se comparan las principales opciones para un nuevo preparador independiente:"}
        </p>
        <Table
          lang={lang}
          headers={isEn ? ["Software", "Starting price", "Best for", "Key advantage"] : ["Software", "Precio inicial", "Ideal para", "Ventaja clave"]}
          rows={isEn ? [
            ["Drake Tax PPR", "$349.99 (10 returns)", "Budget-conscious beginners", "Full features, all states included, #1 rated for solo preparers"],
            ["Drake Unlimited", "$1,875–$1,995", "50+ returns/season", "No per-return limits, strongest diagnostics"],
            ["TaxSlayer Pro", "$1,399+", "Beginners wanting guided workflow", "Interview-style interface, strong alerts"],
            ["TaxAct Professional", "$495+", "Most budget-friendly unlimited", "Lowest unlimited price point"],
            ["UltimateTax", "$388 base + $20/return", "Volume flexibility", "Pay as you go model"],
            ["Intuit ProConnect", "$549+", "QuickBooks integration", "Cloud-based, AI-powered deductions"],
          ] : [
            ["Drake Tax PPR", "$349.99 (10 declaraciones)", "Principiantes con presupuesto limitado", "Funciones completas, todos los estados incluidos, #1 para preparadores individuales"],
            ["Drake Unlimited", "$1,875–$1,995", "50+ declaraciones/temporada", "Sin límites por declaración, mejores diagnósticos"],
            ["TaxSlayer Pro", "$1,399+", "Principiantes que quieren flujo guiado", "Interfaz tipo entrevista, alertas fuertes"],
            ["TaxAct Professional", "$495+", "Ilimitado más económico", "Precio ilimitado más bajo"],
            ["UltimateTax", "$388 base + $20/decl.", "Flexibilidad de volumen", "Modelo de pago por uso"],
            ["Intuit ProConnect", "$549+", "Integración con QuickBooks", "Basado en la nube, deducciones con IA"],
          ]}
        />
        <p className="font-medium text-emerald-300">
          {isEn
            ? "Recommendation: Start with Drake Tax Pay-Per-Return ($349.99) for the first season. It includes all federal and state forms with no per-state surcharges and has the highest satisfaction rating among sole-proprietor preparers."
            : "Recomendación: Comenzar con Drake Tax Pay-Per-Return ($349.99) para la primera temporada. Incluye todos los formularios federales y estatales sin recargos por estado y tiene la mayor calificación de satisfacción entre preparadores individuales."}
        </p>
      </Section>

      <Section title={isEn ? "Step 7: Data security — your legal obligation" : "Paso 7: Seguridad de datos — tu obligación legal"}>
        <p>
          {isEn
            ? <>Tax preparers are classified as &quot;financial institutions&quot; under the FTC Safeguards Rule (16 CFR Part 314). This means Sandra must create and maintain a <GlossaryTerm id="wisp" lang={lang}>Written Information Security Plan (WISP)</GlossaryTerm> before preparing a single return. Since 2023, preparers must certify WISP compliance when renewing their PTIN. Penalties for non-compliance can reach <strong className="text-white">$46,517 per violation per day</strong>.</>
            : <>Los preparadores de impuestos son clasificados como &quot;instituciones financieras&quot; bajo la Regla de Salvaguardas de la FTC (16 CFR Parte 314). Esto significa que Sandra debe crear y mantener un <GlossaryTerm id="wisp" lang={lang}>Plan Escrito de Seguridad de Información (WISP)</GlossaryTerm> antes de preparar una sola declaración. Desde 2023, los preparadores deben certificar cumplimiento con el WISP al renovar su PTIN. Las multas por incumplimiento pueden alcanzar <strong className="text-white">$46,517 por violación por día</strong>.</>}
        </p>
        <p className="font-medium text-white">{isEn ? "The IRS \"Security Six\" — minimum protections:" : "Los \"Security Six\" del IRS — protecciones mínimas:"}</p>
        <ul className="list-inside list-disc space-y-1 text-neutral-300">
          <li>{isEn ? "Antivirus/anti-malware software (kept updated)" : "Software antivirus/anti-malware (actualizado)"}</li>
          <li>{isEn ? "Hardware and software firewalls" : "Firewalls de hardware y software"}</li>
          <li>{isEn ? "Multi-factor authentication (MFA) on all accounts" : "Autenticación multifactor (MFA) en todas las cuentas"}</li>
          <li>{isEn ? "Data backup and disaster recovery plan (3-2-1 rule)" : "Respaldo de datos y plan de recuperación ante desastres (regla 3-2-1)"}</li>
          <li>{isEn ? "Full-drive encryption on all devices with client data" : "Encriptación de disco completo en todos los dispositivos con datos de clientes"}</li>
          <li>{isEn ? "VPN for any remote access to client information" : "VPN para cualquier acceso remoto a información de clientes"}</li>
        </ul>
        <p>{isEn ? "Resources: IRS Publication 5708 (WISP template), Publication 4557 (Safeguarding Taxpayer Data)." : "Recursos: Publicación 5708 del IRS (plantilla WISP), Publicación 4557 (Protección de Datos del Contribuyente)."}</p>
      </Section>

      <Section title={isEn ? "Step 8: Insurance and risk management" : "Paso 8: Seguros y gestión de riesgos"}>
        <Table
          lang={lang}
          headers={isEn ? ["Insurance type", "Annual cost (GA avg)", "What it covers"] : ["Tipo de seguro", "Costo anual (prom. GA)", "Qué cubre"]}
          rows={isEn ? [
            ["Errors & Omissions (E&O)", "$250–$500", "Mistakes in tax preparation, incorrect advice"],
            ["General liability", "$300–$400", "Slip-and-fall, property damage at office"],
            ["Cyber liability", "$400–$600", "Data breaches, ransomware, client data exposure"],
            ["Fidelity bond", "$85–$150", "Employee theft or dishonesty"],
          ] : [
            ["Errores y Omisiones (E&O)", "$250–$500", "Errores en preparación, asesoría incorrecta"],
            ["Responsabilidad general", "$300–$400", "Caídas, daños a propiedad en oficina"],
            ["Responsabilidad cibernética", "$400–$600", "Brechas de datos, ransomware, exposición de datos"],
            ["Fianza de fidelidad", "$85–$150", "Robo o deshonestidad de empleados"],
          ]}
        />
        <p>
          {isEn
            ? "E&O insurance is the most important for a new preparer. A single filing error that results in IRS penalties for a client could lead to a costly claim. Most E&O policies start around $250/year for a solo preparer."
            : "El seguro E&O es el más importante para un nuevo preparador. Un solo error de presentación que resulte en multas del IRS para un cliente podría llevar a un reclamo costoso. La mayoría de las pólizas E&O comienzan alrededor de $250/año para un preparador individual."}
        </p>
      </Section>

      <Section title={isEn ? "Due diligence: avoiding the biggest penalties" : "Debida diligencia: evitar las multas más grandes"}>
        <p>
          {isEn
            ? <>The IRS imposes strict <GlossaryTerm id="due-diligence" lang={lang}>due diligence</GlossaryTerm> requirements for four credits: <GlossaryTerm id="eitc" lang={lang}>Earned Income Tax Credit (EITC)</GlossaryTerm>, <GlossaryTerm id="ctc" lang={lang}>Child Tax Credit (CTC)</GlossaryTerm>, American Opportunity Tax Credit (AOTC), and Head of Household filing status. Each failure is a <strong className="text-white">$650 penalty per credit per return</strong> (2026). A single return claiming all four credits with inadequate documentation = <strong className="text-emerald-300">$2,600 in penalties</strong> to the preparer.</>
            : <>El IRS impone requisitos estrictos de <GlossaryTerm id="due-diligence" lang={lang}>debida diligencia</GlossaryTerm> para cuatro créditos: <GlossaryTerm id="eitc" lang={lang}>Crédito por Ingreso del Trabajo (EITC)</GlossaryTerm>, <GlossaryTerm id="ctc" lang={lang}>Crédito Tributario por Hijos (CTC)</GlossaryTerm>, Crédito de Oportunidad Americana (AOTC) y estatus de Cabeza de Familia. Cada falla es una <strong className="text-white">multa de $650 por crédito por declaración</strong> (2026). Una sola declaración reclamando los cuatro créditos sin documentación adecuada = <strong className="text-emerald-300">$2,600 en multas</strong> para el preparador.</>}
        </p>
        <p className="font-medium text-white">{isEn ? "What due diligence requires:" : "Qué requiere la debida diligencia:"}</p>
        <ul className="list-inside list-disc space-y-1 text-neutral-300">
          <li>{isEn ? "Complete Form 8867 (Paid Preparer's Due Diligence Checklist) for every applicable return" : "Completar el Formulario 8867 (Lista de Verificación de Debida Diligencia del Preparador Pagado) para cada declaración aplicable"}</li>
          <li>{isEn ? "Compute each credit on the appropriate worksheet" : "Calcular cada crédito en la hoja de trabajo correspondiente"}</li>
          <li>{isEn ? "Ask the taxpayer enough questions to determine eligibility — document the answers" : "Hacer suficientes preguntas al contribuyente para determinar elegibilidad — documentar las respuestas"}</li>
          <li>{isEn ? "Retain all records for at least 3 years" : "Retener todos los registros por al menos 3 años"}</li>
          <li>{isEn ? "Do not ignore information that seems inconsistent or incomplete" : "No ignorar información que parezca inconsistente o incompleta"}</li>
        </ul>
      </Section>

      <Section title={isEn ? "Pricing strategy for the Georgia market" : "Estrategia de precios para el mercado de Georgia"}>
        <Table
          lang={lang}
          headers={isEn ? ["Return type", "Typical fee range (2025–2026)"] : ["Tipo de declaración", "Rango típico de tarifa (2025–2026)"]}
          rows={isEn ? [
            ["Simple 1040 (W-2, standard deduction)", "$150–$300"],
            ["1040 with itemized deductions", "$250–$400"],
            ["1040 with Schedule C (self-employed)", "$300–$500"],
            ["1040 with rental property (Schedule E)", "$350–$500"],
            ["Small business (1120S, 1065)", "$800–$1,500"],
            ["State return add-on", "$50–$100"],
          ] : [
            ["1040 simple (W-2, deducción estándar)", "$150–$300"],
            ["1040 con deducciones detalladas", "$250–$400"],
            ["1040 con Schedule C (autoempleo)", "$300–$500"],
            ["1040 con propiedad de alquiler (Schedule E)", "$350–$500"],
            ["Negocio pequeño (1120S, 1065)", "$800–$1,500"],
            ["Declaración estatal adicional", "$50–$100"],
          ]}
        />
        <p>
          {isEn
            ? "Start slightly below market to attract initial clients; increase 6–10% annually as you build experience and reviews. Never quote a fee before seeing the client's documents. Never base fees on refund amounts — this is prohibited by the IRS and can result in penalties. Bank products (refund transfer, pay-from-refund) are a major selling point for clients who want to pay preparation fees from their refund."
            : "Comenzar ligeramente por debajo del mercado para atraer clientes iniciales; aumentar 6–10% anualmente conforme construyes experiencia y reseñas. Nunca cotizar un precio antes de ver los documentos del cliente. Nunca basar las tarifas en montos de reembolso — esto está prohibido por el IRS y puede resultar en multas. Los productos bancarios (transferencia de reembolso, pago desde reembolso) son un punto de venta importante para clientes que quieren pagar los honorarios de preparación desde su reembolso."}
        </p>
        <p>
          {isEn
            ? <><strong className="text-white">Realistic first season (part-time solo):</strong> 30–75 returns. At $250 average, 75 returns = <strong className="text-emerald-300">~$18,750</strong>. Second season: 75–150 returns. By season 3, experienced full-time preparers handle 200–350 returns.</>
            : <><strong className="text-white">Primera temporada realista (tiempo parcial solo):</strong> 30–75 declaraciones. A $250 promedio, 75 declaraciones = <strong className="text-emerald-300">~$18,750</strong>. Segunda temporada: 75–150 declaraciones. Para la temporada 3, preparadores experimentados a tiempo completo manejan 200–350 declaraciones.</>}
        </p>
      </Section>

      <Section title={isEn ? "Complete startup cost breakdown" : "Desglose completo de costos de inicio"}>
        <Table
          lang={lang}
          headers={isEn ? ["Item", "Minimum", "Comfortable"] : ["Concepto", "Mínimo", "Cómodo"]}
          rows={isEn ? [
            ["PTIN (annual)", "$19", "$19"],
            ["EFIN application", "Free", "Free"],
            ["EIN", "Free", "Free"],
            ["Georgia LLC formation", "$100", "$100"],
            ["LLC annual renewal", "$50", "$50"],
            ["Local occupation tax certificate", "$80", "$200"],
            ["Training/education", "$149 (H&R Block)", "$500 (Surgent + AFSP)"],
            ["AFSP continuing education", "$100", "$200"],
            ["Tax software", "$350 (Drake PPR)", "$1,875 (Drake Unlimited)"],
            ["E&O insurance", "$250", "$500"],
            ["General liability insurance", "$0", "$350"],
            ["Cyber liability insurance", "$0", "$460"],
            ["Computer/equipment", "$0 (existing)", "$1,500"],
            ["Printer/scanner", "$150", "$400"],
            ["Office supplies", "$200", "$400"],
            ["Website", "$150", "$500"],
            ["Marketing materials", "$200", "$750"],
            ["Total", "~$1,800–$2,500", "~$7,000–$8,000"],
          ] : [
            ["PTIN (anual)", "$19", "$19"],
            ["Solicitud EFIN", "Gratis", "Gratis"],
            ["EIN", "Gratis", "Gratis"],
            ["Formación LLC en Georgia", "$100", "$100"],
            ["Renovación anual LLC", "$50", "$50"],
            ["Certificado impuesto ocupacional", "$80", "$200"],
            ["Formación/educación", "$149 (H&R Block)", "$500 (Surgent + AFSP)"],
            ["Educación continua AFSP", "$100", "$200"],
            ["Software de impuestos", "$350 (Drake PPR)", "$1,875 (Drake Unlimited)"],
            ["Seguro E&O", "$250", "$500"],
            ["Seguro responsabilidad general", "$0", "$350"],
            ["Seguro responsabilidad cibernética", "$0", "$460"],
            ["Computadora/equipo", "$0 (existente)", "$1,500"],
            ["Impresora/escáner", "$150", "$400"],
            ["Suministros de oficina", "$200", "$400"],
            ["Sitio web", "$150", "$500"],
            ["Materiales de marketing", "$200", "$750"],
            ["Total", "~$1,800–$2,500", "~$7,000–$8,000"],
          ]}
        />
        <p>
          {isEn
            ? "A realistic first-year budget is $3,000–$5,000, covering essentials and adequate software. Nearly all of these expenses are tax-deductible as business startup costs."
            : "Un presupuesto realista para el primer año es $3,000–$5,000, cubriendo lo esencial y software adecuado. Casi todos estos gastos son deducibles de impuestos como costos de inicio de negocio."}
        </p>
      </Section>

      <Section title={isEn ? "Month-by-month launch timeline" : "Cronograma de lanzamiento mes a mes"}>
        <div className="space-y-6">
          <Card>
            <div className="font-semibold text-emerald-300">{isEn ? "June–July: Foundation" : "Junio–Julio: Base"}</div>
            <p className="mt-2">{isEn
              ? "Self-study: read Taxes Made Simple by Mike Piper (~$12) and IRS Publication 17. Start IRS Link & Learn Taxes. Apply for PTIN ($18.75). Research local market and decide on business name."
              : "Autoestudio: leer Taxes Made Simple de Mike Piper (~$12) y Publicación 17 del IRS. Comenzar IRS Link & Learn Taxes. Solicitar PTIN ($18.75). Investigar el mercado local y decidir nombre del negocio."}</p>
          </Card>
          <Card>
            <div className="font-semibold text-emerald-300">{isEn ? "August–September: Structured training" : "Agosto–Septiembre: Formación estructurada"}</div>
            <p className="mt-2">{isEn
              ? "Enroll in H&R Block Income Tax Course ($149) or Surgent Comprehensive Tax Course. Begin structured training with real tax scenarios. Sign up for VITA volunteering."
              : "Inscribirse en el Curso de Impuestos de H&R Block ($149) o Curso Integral de Surgent. Comenzar formación estructurada con escenarios fiscales reales. Inscribirse como voluntario VITA."}</p>
          </Card>
          <Card>
            <div className="font-semibold text-emerald-300">{isEn ? "October: Credentialing" : "Octubre: Acreditación"}</div>
            <p className="mt-2">{isEn
              ? "Apply for EFIN (allow 45 days). Renew PTIN when window opens (mid-October). File LLC with Georgia Secretary of State ($100). Get EIN (free, instant). Register as third-party filer with Georgia DOR."
              : "Solicitar EFIN (esperar 45 días). Renovar PTIN cuando abra la ventana (mediados de octubre). Presentar LLC con el Secretario de Estado de Georgia ($100). Obtener EIN (gratis, instantáneo). Registrarse como presentador de terceros con el DOR de Georgia."}</p>
          </Card>
          <Card>
            <div className="font-semibold text-emerald-300">{isEn ? "November: Business setup" : "Noviembre: Configuración del negocio"}</div>
            <p className="mt-2">{isEn
              ? "Complete training. Get local occupation tax certificate. Purchase tax software (Drake PPR $349.99). Create WISP and implement Security Six. Get E&O insurance. Set up business bank account."
              : "Completar formación. Obtener certificado de impuesto ocupacional local. Comprar software de impuestos (Drake PPR $349.99). Crear WISP e implementar Security Six. Obtener seguro E&O. Abrir cuenta bancaria comercial."}</p>
          </Card>
          <Card>
            <div className="font-semibold text-emerald-300">{isEn ? "December: AFSP and marketing launch" : "Diciembre: AFSP y lanzamiento de marketing"}</div>
            <p className="mt-2">{isEn
              ? "Complete AFSP (18 hours CE by December 31). Launch website and claim Google Business Profile. Begin marketing: tell personal network, distribute business cards, post on social media. Practice with software using sample returns."
              : "Completar AFSP (18 horas CE antes del 31 de diciembre). Lanzar sitio web y reclamar perfil de Google Business. Comenzar marketing: informar a la red personal, distribuir tarjetas, publicar en redes sociales. Practicar con el software usando declaraciones de muestra."}</p>
          </Card>
          <Card>
            <div className="font-semibold text-emerald-300">{isEn ? "January–April: First season" : "Enero–Abril: Primera temporada"}</div>
            <p className="mt-2">{isEn
              ? "Begin accepting clients. Start VITA volunteering for additional experience. Focus on simple returns first (W-2, standard deduction), then gradually take on more complex returns. Target 30–75 returns. Collect Google reviews from satisfied clients."
              : "Comenzar a aceptar clientes. Iniciar voluntariado VITA para experiencia adicional. Enfocarse primero en declaraciones simples (W-2, deducción estándar), luego gradualmente tomar declaraciones más complejas. Objetivo: 30–75 declaraciones. Recopilar reseñas de Google de clientes satisfechos."}</p>
          </Card>
          <Card>
            <div className="font-semibold text-emerald-300">{isEn ? "May–October: Post-season growth" : "Mayo–Octubre: Crecimiento post-temporada"}</div>
            <p className="mt-2">{isEn
              ? "Handle extensions (October 15 deadline). Evaluate first season results. Study for Enrolled Agent (EA) exam if desired ($267/part, 3 parts). Continue marketing year-round. Consider adding bookkeeping or payroll services for recurring revenue."
              : "Manejar extensiones (fecha límite 15 de octubre). Evaluar resultados de la primera temporada. Estudiar para el examen de Agente Inscrito (EA) si se desea ($267/parte, 3 partes). Continuar marketing todo el año. Considerar agregar servicios de contabilidad o nómina para ingresos recurrentes."}</p>
          </Card>
        </div>
      </Section>

      <Section title={isEn ? "Building a client base from zero" : "Construir una base de clientes desde cero"}>
        <p className="font-medium text-white">{isEn ? "Three proven strategies:" : "Tres estrategias probadas:"}</p>
        <ul className="list-inside list-disc space-y-3 text-neutral-300">
          <li>
            <strong className="text-white">{isEn ? "Personal network:" : "Red personal:"}</strong> {isEn
              ? "Tell everyone you know. Offer an introductory discount ($25–$50 off first return). Ask satisfied clients for referrals — a $25–$50 referral bonus per new client can accelerate growth significantly."
              : "Decirle a todos los que conoces. Ofrecer un descuento introductorio ($25–$50 de descuento en la primera declaración). Pedir referidos a clientes satisfechos — un bono de referido de $25–$50 por nuevo cliente puede acelerar el crecimiento significativamente."}
          </li>
          <li>
            <strong className="text-white">{isEn ? "Online presence:" : "Presencia en línea:"}</strong> {isEn
              ? "Claim and optimize your Google Business Profile (appears in local search and Maps). Build a simple, mobile-friendly website with your credentials, services, and contact info. Post tax tips on Facebook and LinkedIn 2–4 times per month."
              : "Reclamar y optimizar tu perfil de Google Business (aparece en búsquedas locales y Maps). Crear un sitio web simple y responsivo con tus credenciales, servicios e información de contacto. Publicar consejos fiscales en Facebook y LinkedIn 2–4 veces al mes."}
          </li>
          <li>
            <strong className="text-white">{isEn ? "Community networking:" : "Networking comunitario:"}</strong> {isEn
              ? "Join BNI (Business Network International), local chamber of commerce, or community groups. Partner with financial planners, realtors, and bookkeepers for cross-referrals. Offer free 15-minute tax consultations at community events."
              : "Unirse a BNI (Business Network International), cámara de comercio local o grupos comunitarios. Asociarse con planificadores financieros, agentes inmobiliarios y contadores para referencias cruzadas. Ofrecer consultas fiscales gratuitas de 15 minutos en eventos comunitarios."}
          </li>
        </ul>
      </Section>

      <Section title={isEn ? "Conclusion" : "Conclusión"}>
        <p>
          {isEn
            ? "Georgia's lack of state licensing requirements means Sandra's path is straightforward: get trained, obtain a PTIN and EFIN, register her LLC, set up her security plan, buy professional software, and start marketing before tax season begins. The total investment can be as low as $2,000–$3,000 for a minimal start, or $5,000–$7,000 for a well-equipped practice. The key success factors are: (1) solid training before the first return, (2) AFSP completion for credibility and representation rights, (3) mastering the software before season starts, (4) aggressive marketing starting in November–December, and (5) rigorous due diligence and data security from day one."
            : "La falta de requisitos de licencia estatal en Georgia significa que el camino de Sandra es directo: formarse, obtener PTIN y EFIN, registrar su LLC, establecer su plan de seguridad, comprar software profesional y comenzar marketing antes de que empiece la temporada de impuestos. La inversión total puede ser tan baja como $2,000–$3,000 para un inicio mínimo, o $5,000–$7,000 para una práctica bien equipada. Los factores clave de éxito son: (1) formación sólida antes de la primera declaración, (2) completar el AFSP para credibilidad y derechos de representación, (3) dominar el software antes de que comience la temporada, (4) marketing agresivo a partir de noviembre–diciembre, y (5) debida diligencia rigurosa y seguridad de datos desde el primer día."}
        </p>
        <p>
          {isEn
            ? "View the first season as a learning investment. Target 50–75 returns at competitive rates, collect reviews, and build toward the Enrolled Agent credential for unlimited IRS representation. The tax preparation industry rewards consistency and trust — clients who trust Sandra will return year after year and bring referrals."
            : "Ver la primera temporada como una inversión de aprendizaje. Apuntar a 50–75 declaraciones a precios competitivos, recopilar reseñas y avanzar hacia la credencial de Agente Inscrito para representación ilimitada ante el IRS. La industria de preparación de impuestos premia la constancia y la confianza — los clientes que confíen en Sandra volverán año tras año y traerán referidos."}
        </p>
      </Section>
    </motion.article>
  );
}

export default function AnalisisChatGPTPage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = ui[lang];
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-[-180px] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[100px]"
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-160px] top-[40%] h-[360px] w-[360px] rounded-full bg-teal-500/10 blur-[100px]"
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
            <ChatGPTLogo size={32} />
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
        <ChatGPTContent lang={lang} />
      </main>
    </div>
  );
}
