import type { QuizQuestion } from "@/app/components/AnalysisQuiz";

/**
 * Gemini analysis page quiz — 15 unique questions focused on:
 * Three entry pathways, CTP certificate, Intuit Academy, standard vs. bulk filer,
 * county-specific occupation tax details, insurance types and costs,
 * 3-2-1 backup rule, deductions vs. credits, refundable vs. non-refundable,
 * Georgia Form 500, niche marketing, 4-phase roadmap, AGI, e-file vs. paper timing
 */
export const geminiQuestions: QuizQuestion[] = [
  {
    en: {
      question: "What are the three primary entry pathways Gemini identifies for becoming a tax preparer?",
      options: ["College degree, CPA exam, state license", "Institutional apprenticeship, independent certification, digital academy", "Self-study only, franchise work only, government training only", "Online course, in-person school, mentorship program"],
      correct: 1,
      explanation: "Gemini identifies three pathways: (1) Institutional Apprenticeship — seasonal work with H&R Block or Jackson Hewitt, (2) Independent Certification — programs like Georgia Southern's CTP or Surgent, and (3) Digital Academy — Intuit Academy for remote-ready digital workflows.",
    },
    es: {
      question: "¿Cuáles son las tres vías principales de entrada que Gemini identifica para ser preparador de impuestos?",
      options: ["Título universitario, examen CPA, licencia estatal", "Aprendizaje institucional, certificación independiente, academia digital", "Solo autoestudio, solo trabajo en franquicia, solo capacitación gubernamental", "Curso en línea, escuela presencial, programa de mentoría"],
      correct: 1,
      explanation: "Gemini identifica tres vías: (1) Aprendizaje Institucional — trabajo estacional con H&R Block o Jackson Hewitt, (2) Certificación Independiente — programas como el CTP de Georgia Southern o Surgent, y (3) Academia Digital — Intuit Academy para flujos de trabajo digitales remotos.",
    },
  },
  {
    en: {
      question: "How many qualifying experience hours does the Chartered Tax Professional (CTP) certificate require?",
      options: ["100 hours", "250 hours", "500 hours", "1,000 hours"],
      correct: 2,
      explanation: "The CTP certificate from Georgia Southern requires 500 hours of qualifying experience. This path builds professional vocabulary and deep technical proficiency, preparing practitioners to operate independently without relying on a major firm.",
    },
    es: {
      question: "¿Cuántas horas de experiencia calificada requiere el certificado de Chartered Tax Professional (CTP)?",
      options: ["100 horas", "250 horas", "500 horas", "1,000 horas"],
      correct: 2,
      explanation: "El certificado CTP de Georgia Southern requiere 500 horas de experiencia calificada. Esta ruta desarrolla vocabulario profesional y competencia técnica profunda, preparando a los practicantes para operar independientemente sin depender de una firma grande.",
    },
  },
  {
    en: {
      question: "What makes Intuit Academy unique compared to traditional training programs?",
      options: ["It costs $2,000 and takes 6 months", "It is free, self-paced, and designed for TurboTax Live with digital/remote workflows", "It provides an automatic EA designation", "It is only available in Georgia"],
      correct: 1,
      explanation: "Intuit Academy is free and self-paced, specifically designed for TurboTax Live. It focuses on 1099/W-2 scenarios and high-income taxpayers, making it ideal for starting a remote practice with modern digital workflows — a unique differentiator from traditional classroom training.",
    },
    es: {
      question: "¿Qué hace única a Intuit Academy comparada con programas de capacitación tradicionales?",
      options: ["Cuesta $2,000 y tarda 6 meses", "Es gratuita, a tu ritmo, diseñada para TurboTax Live con flujos de trabajo digitales/remotos", "Proporciona designación automática de EA", "Solo está disponible en Georgia"],
      correct: 1,
      explanation: "Intuit Academy es gratuita y a tu ritmo, diseñada específicamente para TurboTax Live. Se enfoca en escenarios de 1099/W-2 y contribuyentes de altos ingresos, haciéndola ideal para iniciar una práctica remota con flujos de trabajo digitales modernos.",
    },
  },
  {
    en: {
      question: "What is the difference between a standard Third-Party Filer and a Bulk Filer in Georgia?",
      options: ["They are identical — just different names", "Standard enters transactions individually; Bulk submits one electronic file for multiple clients", "Bulk is only for federal returns", "Standard is free but Bulk costs $500"],
      correct: 1,
      explanation: "Standard Third-Party Filers enter transactions individually through the Georgia Tax Center portal. Bulk Filers submit one electronic file for multiple clients simultaneously. For a solo practitioner starting out, standard Third-Party Filer registration is the appropriate entry point.",
    },
    es: {
      question: "¿Cuál es la diferencia entre un Third-Party Filer estándar y un presentador masivo en Georgia?",
      options: ["Son idénticos — solo nombres diferentes", "El estándar ingresa transacciones individualmente; el masivo envía un archivo electrónico para múltiples clientes", "El masivo es solo para declaraciones federales", "El estándar es gratis pero el masivo cuesta $500"],
      correct: 1,
      explanation: "Los Third-Party Filers estándar ingresan transacciones individualmente a través del portal del Georgia Tax Center. Los presentadores masivos envían un solo archivo electrónico para múltiples clientes simultáneamente. Para un practicante individual que comienza, el registro estándar es el punto de entrada apropiado.",
    },
  },
  {
    en: {
      question: "Which Georgia jurisdiction requires E-Verify/SAVE affidavits and uses the ATLBIZ portal?",
      options: ["Gwinnett County", "Cherokee County", "City of Atlanta", "Peachtree City"],
      correct: 2,
      explanation: "The City of Atlanta requires E-Verify/SAVE affidavits and uses the ATLBIZ portal for Occupation Tax Certificate applications. Other jurisdictions differ: Douglas requires zoning approval, Peachtree City bases fees on employee count, and Cherokee requires in-person application with proof of residency.",
    },
    es: {
      question: "¿Qué jurisdicción de Georgia requiere afidávits E-Verify/SAVE y usa el portal ATLBIZ?",
      options: ["Condado de Gwinnett", "Condado de Cherokee", "Ciudad de Atlanta", "Peachtree City"],
      correct: 2,
      explanation: "La Ciudad de Atlanta requiere afidávits E-Verify/SAVE y usa el portal ATLBIZ para solicitudes de Certificado de Impuesto Ocupacional. Otras jurisdicciones difieren: Douglas requiere aprobación de zonificación, Peachtree City basa tarifas en el número de empleados, y Cherokee requiere solicitud en persona con prueba de residencia.",
    },
  },
  {
    en: {
      question: "In Cherokee County, what is the late fee percentage for Occupation Tax Certificates filed after January 31?",
      options: ["5% late fee", "10% late fee", "15% late fee", "25% late fee"],
      correct: 1,
      explanation: "Cherokee County imposes a 10% late fee after January 31 for Occupation Tax Certificate filings. Cherokee also requires in-person application with proof of residency and bases fees on employee count.",
    },
    es: {
      question: "En el condado de Cherokee, ¿cuál es el porcentaje de recargo por Certificados de Impuesto Ocupacional presentados después del 31 de enero?",
      options: ["5% de recargo", "10% de recargo", "15% de recargo", "25% de recargo"],
      correct: 1,
      explanation: "El condado de Cherokee impone un recargo del 10% después del 31 de enero para los Certificados de Impuesto Ocupacional. Cherokee también requiere solicitud en persona con prueba de residencia y basa las tarifas en el número de empleados.",
    },
  },
  {
    en: {
      question: "What is the average annual cost for Errors & Omissions (E&O) insurance in Georgia?",
      options: ["$85", "$300", "$340", "$460"],
      correct: 2,
      explanation: "The average annual cost for E&O insurance in Georgia is approximately $340. It protects against professional mistakes and incorrect advice. Consider 'Prior Acts' coverage for claims from past work. Cyber liability insurance averages $460/year.",
    },
    es: {
      question: "¿Cuál es el costo anual promedio del seguro de Errores y Omisiones (E&O) en Georgia?",
      options: ["$85", "$300", "$340", "$460"],
      correct: 2,
      explanation: "El costo anual promedio del seguro E&O en Georgia es aproximadamente $340. Protege contra errores profesionales y asesoría incorrecta. Considera la cobertura de 'Actos Previos' para reclamos de trabajo anterior. El seguro de responsabilidad cibernética promedia $460/año.",
    },
  },
  {
    en: {
      question: "How much does a Fidelity Bond typically cost annually in Georgia?",
      options: ["$85", "$300", "$340", "$460"],
      correct: 0,
      explanation: "A Fidelity Bond in Georgia typically costs about $85 per year. It protects against employee theft or dishonesty. Among all insurance types for tax preparers, it is the least expensive but still provides important protection if you have staff handling client funds.",
    },
    es: {
      question: "¿Cuánto cuesta típicamente una Fianza de Fidelidad anual en Georgia?",
      options: ["$85", "$300", "$340", "$460"],
      correct: 0,
      explanation: "Una Fianza de Fidelidad en Georgia cuesta típicamente alrededor de $85 por año. Protege contra robo o deshonestidad de empleados. Entre todos los tipos de seguro para preparadores de impuestos, es el menos costoso pero proporciona protección importante si tienes personal manejando fondos de clientes.",
    },
  },
  {
    en: {
      question: "What does the 3-2-1 backup rule mean in data security?",
      options: ["3 passwords, 2 firewalls, 1 antivirus", "3 copies of data, 2 different storage types, 1 copy offsite", "3 security audits per year, 2 reviews, 1 certification", "Backup every 3 hours, 2 locations, 1 cloud"],
      correct: 1,
      explanation: "The 3-2-1 backup rule means: keep 3 copies of your data, on 2 different types of storage media, with 1 copy stored offsite. This is part of the backup/disaster recovery requirement within the IRS Security Six under Publication 4557.",
    },
    es: {
      question: "¿Qué significa la regla de respaldo 3-2-1 en seguridad de datos?",
      options: ["3 contraseñas, 2 firewalls, 1 antivirus", "3 copias de datos, 2 tipos de almacenamiento diferentes, 1 copia fuera del sitio", "3 auditorías de seguridad al año, 2 revisiones, 1 certificación", "Respaldo cada 3 horas, 2 ubicaciones, 1 nube"],
      correct: 1,
      explanation: "La regla de respaldo 3-2-1 significa: mantener 3 copias de tus datos, en 2 tipos diferentes de medios de almacenamiento, con 1 copia almacenada fuera del sitio. Esto es parte del requisito de respaldo/recuperación ante desastres dentro de los Security Six del IRS bajo la Publicación 4557.",
    },
  },
  {
    en: {
      question: "What is the key difference between a tax deduction and a tax credit?",
      options: ["They are the same thing", "A deduction reduces taxable income; a credit reduces tax dollar-for-dollar", "A credit reduces taxable income; a deduction reduces tax dollar-for-dollar", "Deductions apply to businesses; credits apply to individuals"],
      correct: 1,
      explanation: "A deduction reduces your taxable income (e.g., the Standard Deduction), while a credit reduces your actual tax bill dollar-for-dollar — making credits much more powerful. A $1,000 deduction in the 22% bracket saves $220, but a $1,000 credit saves a full $1,000.",
    },
    es: {
      question: "¿Cuál es la diferencia clave entre una deducción fiscal y un crédito fiscal?",
      options: ["Son lo mismo", "Una deducción reduce el ingreso gravable; un crédito reduce el impuesto dólar por dólar", "Un crédito reduce el ingreso gravable; una deducción reduce el impuesto dólar por dólar", "Las deducciones aplican a empresas; los créditos a individuos"],
      correct: 1,
      explanation: "Una deducción reduce tu ingreso gravable (ej. deducción estándar), mientras que un crédito reduce tu factura de impuestos dólar por dólar — haciendo los créditos mucho más potentes. Una deducción de $1,000 en la categoría del 22% ahorra $220, pero un crédito de $1,000 ahorra los $1,000 completos.",
    },
  },
  {
    en: {
      question: "What is the difference between refundable and non-refundable tax credits?",
      options: ["Refundable credits expire after one year", "Non-refundable credits can only zero out tax; refundable credits can yield a cash refund", "Refundable credits are only for businesses", "Non-refundable credits are worth more"],
      correct: 1,
      explanation: "Non-refundable credits can only reduce your tax bill to zero — any excess is lost. Refundable credits can generate a cash refund even if your tax is already zero. For example, EITC is refundable (you can receive money back), while many education credits are non-refundable.",
    },
    es: {
      question: "¿Cuál es la diferencia entre créditos fiscales reembolsables y no reembolsables?",
      options: ["Los créditos reembolsables expiran después de un año", "Los no reembolsables solo pueden reducir el impuesto a cero; los reembolsables pueden generar un reembolso en efectivo", "Los créditos reembolsables son solo para empresas", "Los créditos no reembolsables valen más"],
      correct: 1,
      explanation: "Los créditos no reembolsables solo pueden reducir tu factura de impuestos a cero — cualquier exceso se pierde. Los créditos reembolsables pueden generar un reembolso en efectivo incluso si tu impuesto ya es cero. Por ejemplo, el EITC es reembolsable (puedes recibir dinero), mientras que muchos créditos educativos son no reembolsables.",
    },
  },
  {
    en: {
      question: "When must a Georgia resident file Form 500?",
      options: ["Only if they are self-employed", "If required to file federally or if income exceeds the standard deduction ($12,000 single / $24,000 MFJ)", "Only if they owe more than $1,000 in state tax", "All Georgia residents must file regardless of income"],
      correct: 1,
      explanation: "File Georgia Form 500 if you are required to file federally or if income exceeds the standard deduction ($12,000 single / $24,000 MFJ for 2024–2025). Part-year and nonresidents use Form 500NR if Georgia income exceeds $5,000.",
    },
    es: {
      question: "¿Cuándo debe un residente de Georgia presentar el Formulario 500?",
      options: ["Solo si es autónomo", "Si está obligado a declarar federalmente o si el ingreso excede la deducción estándar ($12,000 soltero / $24,000 MFJ)", "Solo si debe más de $1,000 en impuesto estatal", "Todos los residentes de Georgia deben presentar sin importar el ingreso"],
      correct: 1,
      explanation: "Presenta el Formulario 500 de Georgia si estás obligado a declarar federalmente o si tu ingreso excede la deducción estándar ($12,000 soltero / $24,000 MFJ para 2024–2025). Residentes parciales y no residentes usan el Formulario 500NR si el ingreso de Georgia excede $5,000.",
    },
  },
  {
    en: {
      question: "How long does a Georgia e-file refund take vs. a paper return refund?",
      options: ["Both take the same time (~60 days)", "E-file: ~30 days with direct deposit; paper: up to 12 weeks", "E-file: 1 week; paper: 2 weeks", "E-file: 90 days; paper: 6 months"],
      correct: 1,
      explanation: "E-file with direct deposit yields Georgia refunds in approximately 30 days, while paper returns may take up to 12 weeks. This significant speed advantage is a major selling point when explaining e-filing benefits to clients.",
    },
    es: {
      question: "¿Cuánto tiempo tarda un reembolso de e-file de Georgia vs. una declaración en papel?",
      options: ["Ambos tardan lo mismo (~60 días)", "E-file: ~30 días con depósito directo; papel: hasta 12 semanas", "E-file: 1 semana; papel: 2 semanas", "E-file: 90 días; papel: 6 meses"],
      correct: 1,
      explanation: "El e-file con depósito directo produce reembolsos de Georgia en aproximadamente 30 días, mientras que las declaraciones en papel pueden tomar hasta 12 semanas. Esta ventaja significativa de velocidad es un punto de venta importante al explicar los beneficios del e-file a los clientes.",
    },
  },
  {
    en: {
      question: "What niche marketing strategy does Gemini recommend for building trust as a new preparer?",
      options: ["Target all residents in your city equally", "Focus on a specific niche (freelancers, military families, small business owners) and engage in relevant communities", "Only accept clients referred by CPAs", "Invest heavily in TV and radio ads"],
      correct: 1,
      explanation: "Gemini recommends targeting a specific niche (local freelancers, military families, small business owners) and engaging in relevant communities (subreddits, Facebook groups) to demonstrate expertise. A professional, mobile-friendly website with AFSP status is the cornerstone of a modern practice.",
    },
    es: {
      question: "¿Qué estrategia de marketing de nicho recomienda Gemini para generar confianza como preparador nuevo?",
      options: ["Dirigirse a todos los residentes de tu ciudad por igual", "Enfocarse en un nicho específico (freelancers, familias militares, dueños de pequeños negocios) y participar en comunidades relevantes", "Solo aceptar clientes referidos por CPAs", "Invertir fuertemente en anuncios de TV y radio"],
      correct: 1,
      explanation: "Gemini recomienda enfocarse en un nicho específico (freelancers locales, familias militares, dueños de pequeños negocios) y participar en comunidades relevantes (subreddits, grupos de Facebook) para demostrar experiencia. Un sitio web profesional y responsivo con estatus de AFSP es la piedra angular de una práctica moderna.",
    },
  },
  {
    en: {
      question: "What are the four phases of Gemini's 12-month launch roadmap?",
      options: ["Study, Test, Practice, Open", "Educational Foundation, Federal/State Credentialing, Business Formation, Operational Launch", "Register, Train, Market, File", "Research, Apply, Build, Advertise"],
      correct: 1,
      explanation: "Gemini's 4-phase roadmap: (1) Educational Foundation (May–August) — complete courses and research niche, (2) Federal/State Credentialing (September–October) — apply for PTIN and EFIN, register as third-party filer, (3) Business Formation (November–December) — file LLC, get insurance, draft WISP, and (4) Operational Launch (December–January) — finalize software, launch website, announce practice.",
    },
    es: {
      question: "¿Cuáles son las cuatro fases de la hoja de ruta de lanzamiento de 12 meses de Gemini?",
      options: ["Estudiar, Probar, Practicar, Abrir", "Base Educativa, Acreditación Federal/Estatal, Formación del Negocio, Lanzamiento Operativo", "Registrar, Capacitar, Marketing, Presentar", "Investigar, Solicitar, Construir, Anunciar"],
      correct: 1,
      explanation: "La hoja de ruta de 4 fases de Gemini: (1) Base Educativa (mayo–agosto) — completar cursos e investigar nicho, (2) Acreditación Federal/Estatal (septiembre–octubre) — solicitar PTIN y EFIN, registrarse como third-party filer, (3) Formación del Negocio (noviembre–diciembre) — registrar LLC, obtener seguros, redactar WISP, y (4) Lanzamiento Operativo (diciembre–enero) — finalizar software, lanzar sitio web, anunciar práctica.",
    },
  },
];
