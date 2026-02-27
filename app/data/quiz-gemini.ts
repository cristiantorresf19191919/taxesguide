import type { QuizQuestion } from "@/app/components/AnalysisQuiz";

export const geminiQuestions: QuizQuestion[] = [
  {
    en: {
      question: "What are the three primary entry pathways for becoming a tax preparer according to Gemini's analysis?",
      options: ["Online courses, college degree, CPA exam", "Institutional apprenticeship, independent certification, digital academy", "IRS training, state licensing, federal exam", "Self-study, franchise employment, government program"],
      correct: 1,
      explanation: "Gemini identifies three pathways: (1) Institutional Apprenticeship with firms like H&R Block or Jackson Hewitt, (2) Independent Certification through programs like Georgia Southern's CTP or Surgent, and (3) Digital Academy Path through Intuit Academy for remote practice readiness.",
    },
    es: {
      question: "¿Cuáles son las tres vías principales de entrada para ser preparador de impuestos según el análisis de Gemini?",
      options: ["Cursos en línea, título universitario, examen CPA", "Aprendizaje institucional, certificación independiente, academia digital", "Capacitación del IRS, licencia estatal, examen federal", "Autoestudio, empleo en franquicia, programa gubernamental"],
      correct: 1,
      explanation: "Gemini identifica tres vías: (1) Aprendizaje Institucional con firmas como H&R Block o Jackson Hewitt, (2) Certificación Independiente a través de programas como el CTP de Georgia Southern o Surgent, y (3) Ruta de Academia Digital a través de Intuit Academy para preparación de práctica remota.",
    },
  },
  {
    en: {
      question: "How many experience hours does the Chartered Tax Professional (CTP) certificate require?",
      options: ["100 hours", "250 hours", "500 hours", "1,000 hours"],
      correct: 2,
      explanation: "The Chartered Tax Professional (CTP) certificate from Georgia Southern requires 500 hours of qualifying experience. This path builds professional vocabulary and technical proficiency for operating independently without a major firm.",
    },
    es: {
      question: "¿Cuántas horas de experiencia requiere el certificado de Chartered Tax Professional (CTP)?",
      options: ["100 horas", "250 horas", "500 horas", "1,000 horas"],
      correct: 2,
      explanation: "El certificado de Chartered Tax Professional (CTP) de Georgia Southern requiere 500 horas de experiencia calificada. Esta ruta desarrolla vocabulario profesional y competencia técnica para operar independientemente sin una firma grande.",
    },
  },
  {
    en: {
      question: "What is the difference between a standard Third-Party Filer and a Bulk Filer in Georgia?",
      options: ["There is no difference", "Standard files individually; Bulk submits one file for multiple clients", "Bulk is for federal returns only", "Standard is free; Bulk costs $500"],
      correct: 1,
      explanation: "Standard Third-Party Filers enter transactions individually through the Georgia Tax Center portal. Bulk Filers submit one electronic file for multiple clients simultaneously. For a solo practitioner starting out, standard Third-Party Filer registration is the appropriate entry point.",
    },
    es: {
      question: "¿Cuál es la diferencia entre un Third-Party Filer estándar y un presentador masivo en Georgia?",
      options: ["No hay diferencia", "El estándar presenta individualmente; el masivo envía un archivo para múltiples clientes", "El masivo es solo para declaraciones federales", "El estándar es gratis; el masivo cuesta $500"],
      correct: 1,
      explanation: "Los Third-Party Filers estándar ingresan transacciones individualmente en el portal del Georgia Tax Center. Los presentadores masivos envían un solo archivo electrónico para múltiples clientes simultáneamente. Para un practicante individual, el registro estándar es el punto de entrada apropiado.",
    },
  },
  {
    en: {
      question: "Why is an LLC recommended over a sole proprietorship for a tax preparation business?",
      options: ["LLCs pay lower taxes", "LLCs provide liability protection; sole proprietorships do not", "Sole proprietorships are illegal in Georgia", "LLCs are free to form"],
      correct: 1,
      explanation: "An LLC offers limited personal liability and pass-through taxation. A sole proprietorship offers no liability protection — risky in a profession where a single error can lead to client penalties and potential lawsuits. The LLC costs $100 to form in Georgia.",
    },
    es: {
      question: "¿Por qué se recomienda una LLC sobre una empresa individual para un negocio de preparación de impuestos?",
      options: ["Las LLC pagan menos impuestos", "Las LLC proporcionan protección de responsabilidad; las empresas individuales no", "Las empresas individuales son ilegales en Georgia", "Las LLC son gratuitas para formar"],
      correct: 1,
      explanation: "Una LLC ofrece responsabilidad personal limitada y tributación pass-through. Una empresa individual no ofrece protección de responsabilidad — riesgoso en una profesión donde un solo error puede generar multas al cliente y posibles demandas. La LLC cuesta $100 para formar en Georgia.",
    },
  },
  {
    en: {
      question: "Which Georgia county requires E-Verify affidavits and uses the ATLBIZ portal for Occupation Tax Certificates?",
      options: ["Gwinnett", "Cobb", "Atlanta", "Cherokee"],
      correct: 2,
      explanation: "Atlanta requires E-Verify/SAVE affidavits and uses the ATLBIZ portal for Occupation Tax Certificate applications. Different Georgia jurisdictions have different requirements: Douglas requires zoning approval, Peachtree City bases fees on employee count, and Cherokee requires in-person application with proof of residency.",
    },
    es: {
      question: "¿Qué jurisdicción de Georgia requiere afidávits E-Verify y usa el portal ATLBIZ para Certificados de Impuesto Ocupacional?",
      options: ["Gwinnett", "Cobb", "Atlanta", "Cherokee"],
      correct: 2,
      explanation: "Atlanta requiere afidávits E-Verify/SAVE y usa el portal ATLBIZ para solicitudes de Certificado de Impuesto Ocupacional. Diferentes jurisdicciones de Georgia tienen requisitos diferentes: Douglas requiere aprobación de zonificación, Peachtree City basa tarifas en el número de empleados, y Cherokee requiere solicitud en persona con prueba de residencia.",
    },
  },
  {
    en: {
      question: "What is the average annual cost for Errors & Omissions (E&O) insurance in Georgia?",
      options: ["$85", "$340", "$460", "$1,000"],
      correct: 1,
      explanation: "The average annual cost for E&O insurance in Georgia is approximately $340. E&O and cyber liability ($460/year) are especially important for tax preparers. Consider 'Prior Acts' coverage for E&O to protect against claims from past work.",
    },
    es: {
      question: "¿Cuál es el costo anual promedio del seguro de Errores y Omisiones (E&O) en Georgia?",
      options: ["$85", "$340", "$460", "$1,000"],
      correct: 1,
      explanation: "El costo anual promedio del seguro E&O en Georgia es aproximadamente $340. El E&O y la responsabilidad cibernética ($460/año) son especialmente importantes para preparadores de impuestos. Considera la cobertura de 'Actos Previos' para E&O para protegerte contra reclamos por trabajo anterior.",
    },
  },
  {
    en: {
      question: "What does the 3-2-1 backup rule refer to in data security?",
      options: ["3 passwords, 2 firewalls, 1 antivirus", "3 copies of data, 2 different storage types, 1 offsite", "3 security audits, 2 reviews, 1 certification", "3 employees, 2 managers, 1 security officer"],
      correct: 1,
      explanation: "The 3-2-1 backup rule means: keep 3 copies of your data, on 2 different types of storage media, with 1 copy stored offsite. This is part of the IRS Security Six requirements under Publication 4557 for protecting taxpayer data.",
    },
    es: {
      question: "¿A qué se refiere la regla de respaldo 3-2-1 en seguridad de datos?",
      options: ["3 contraseñas, 2 firewalls, 1 antivirus", "3 copias de datos, 2 tipos de almacenamiento diferentes, 1 fuera del sitio", "3 auditorías de seguridad, 2 revisiones, 1 certificación", "3 empleados, 2 gerentes, 1 oficial de seguridad"],
      correct: 1,
      explanation: "La regla de respaldo 3-2-1 significa: mantener 3 copias de tus datos, en 2 tipos diferentes de medios de almacenamiento, con 1 copia almacenada fuera del sitio. Esto es parte de los requisitos Security Six del IRS bajo la Publicación 4557 para proteger datos del contribuyente.",
    },
  },
  {
    en: {
      question: "What is the difference between a tax deduction and a tax credit?",
      options: ["They are the same thing", "A deduction reduces taxable income; a credit reduces tax dollar-for-dollar", "A credit reduces taxable income; a deduction reduces tax dollar-for-dollar", "Deductions are for businesses; credits are for individuals"],
      correct: 1,
      explanation: "A deduction reduces your taxable income (e.g., the Standard Deduction), while a credit reduces your actual tax bill dollar-for-dollar — making credits more powerful. For example, a $1,000 deduction in the 22% bracket saves $220, but a $1,000 credit saves a full $1,000.",
    },
    es: {
      question: "¿Cuál es la diferencia entre una deducción fiscal y un crédito fiscal?",
      options: ["Son lo mismo", "Una deducción reduce el ingreso gravable; un crédito reduce el impuesto dólar por dólar", "Un crédito reduce el ingreso gravable; una deducción reduce el impuesto dólar por dólar", "Las deducciones son para empresas; los créditos para individuos"],
      correct: 1,
      explanation: "Una deducción reduce tu ingreso gravable (ej. deducción estándar), mientras que un crédito reduce tu factura de impuestos dólar por dólar — haciendo los créditos más potentes. Por ejemplo, una deducción de $1,000 en la categoría del 22% ahorra $220, pero un crédito de $1,000 ahorra los $1,000 completos.",
    },
  },
  {
    en: {
      question: "What is the difference between refundable and non-refundable tax credits?",
      options: ["Refundable credits expire; non-refundable don't", "Non-refundable credits can only zero out tax; refundable credits can yield a refund", "Refundable credits are for businesses only", "There is no practical difference"],
      correct: 1,
      explanation: "Non-refundable credits can only reduce your tax bill to zero — any excess is lost. Refundable credits can generate a refund even if your tax is already zero. For example, the EITC is refundable (you can get money back), while many education credits are non-refundable.",
    },
    es: {
      question: "¿Cuál es la diferencia entre créditos fiscales reembolsables y no reembolsables?",
      options: ["Los créditos reembolsables expiran; los no reembolsables no", "Los no reembolsables solo pueden reducir el impuesto a cero; los reembolsables pueden generar un reembolso", "Los créditos reembolsables son solo para empresas", "No hay diferencia práctica"],
      correct: 1,
      explanation: "Los créditos no reembolsables solo pueden reducir tu factura de impuestos a cero — cualquier exceso se pierde. Los créditos reembolsables pueden generar un reembolso incluso si tu impuesto ya es cero. Por ejemplo, el EITC es reembolsable (puedes recibir dinero), mientras que muchos créditos educativos son no reembolsables.",
    },
  },
  {
    en: {
      question: "When must Georgia Form 500 be filed, and who must file it?",
      options: ["Everyone living in Georgia", "Only if income exceeds $50,000", "If required to file federally or if income exceeds the standard deduction", "Only self-employed individuals"],
      correct: 2,
      explanation: "File Georgia Form 500 if you are required to file federally or if income exceeds the standard deduction ($12,000 single / $24,000 MFJ for 2024–2025). Part-year/nonresidents use Form 500NR if Georgia income exceeds $5,000.",
    },
    es: {
      question: "¿Cuándo debe presentarse el Formulario 500 de Georgia y quién debe presentarlo?",
      options: ["Todos los que viven en Georgia", "Solo si el ingreso excede $50,000", "Si estás obligado a declarar federalmente o si el ingreso excede la deducción estándar", "Solo individuos autónomos"],
      correct: 2,
      explanation: "Presenta el Formulario 500 de Georgia si estás obligado a declarar federalmente o si tu ingreso excede la deducción estándar ($12,000 soltero / $24,000 MFJ para 2024–2025). Residentes parciales/no residentes usan el Formulario 500NR si el ingreso de Georgia excede $5,000.",
    },
  },
  {
    en: {
      question: "What is the recommended niche marketing strategy for building trust as a new preparer?",
      options: ["Target everyone in the city", "Advertise on TV and radio", "Target a specific niche (freelancers, military families, small business owners)", "Only accept referrals from CPAs"],
      correct: 2,
      explanation: "Gemini recommends targeting a specific niche (local freelancers, military families, small business owners) and engaging in relevant communities. Collect detailed reviews on Google My Business that mention specific outcomes. A professional, mobile-friendly website highlighting training and AFSP status is the cornerstone.",
    },
    es: {
      question: "¿Cuál es la estrategia de marketing de nicho recomendada para generar confianza como preparador nuevo?",
      options: ["Dirigirse a todos en la ciudad", "Anunciarse en TV y radio", "Enfocarse en un nicho específico (freelancers, familias militares, dueños de pequeños negocios)", "Solo aceptar referidos de CPAs"],
      correct: 2,
      explanation: "Gemini recomienda enfocarse en un nicho específico (freelancers locales, familias militares, dueños de pequeños negocios) y participar en comunidades relevantes. Recopila reseñas detalladas en Google My Business. Un sitio web profesional y responsivo destacando formación y estatus AFSP es la piedra angular.",
    },
  },
  {
    en: {
      question: "What are the four phases of Gemini's 12-month roadmap for launching a tax practice?",
      options: ["Study, Test, Practice, Launch", "Educational Foundation, Federal/State Credentialing, Business Formation, Operational Launch", "Register, Train, Market, File", "Research, Apply, Build, Open"],
      correct: 1,
      explanation: "Gemini's roadmap has four phases: (1) Educational Foundation (May–August), (2) Federal and State Credentialing (September–October), (3) Business Formation and Compliance (November–December), and (4) Operational Launch (December–January).",
    },
    es: {
      question: "¿Cuáles son las cuatro fases de la hoja de ruta de 12 meses de Gemini para lanzar una práctica de impuestos?",
      options: ["Estudiar, Probar, Practicar, Lanzar", "Base Educativa, Acreditación Federal/Estatal, Formación del Negocio, Lanzamiento Operativo", "Registrar, Capacitar, Marketing, Presentar", "Investigar, Solicitar, Construir, Abrir"],
      correct: 1,
      explanation: "La hoja de ruta de Gemini tiene cuatro fases: (1) Base Educativa (mayo–agosto), (2) Acreditación Federal y Estatal (septiembre–octubre), (3) Formación del Negocio y Cumplimiento (noviembre–diciembre), y (4) Lanzamiento Operativo (diciembre–enero).",
    },
  },
  {
    en: {
      question: "What does Intuit Academy offer, and what makes it unique?",
      options: ["Paid certification for CPAs only", "Free, self-paced training designed for TurboTax Live with digital workflows", "In-person classroom training in Atlanta", "A 500-hour apprenticeship program"],
      correct: 1,
      explanation: "Intuit Academy is free and self-paced, designed for TurboTax Live. It focuses on 1099/W-2 scenarios and high-income taxpayers, making it ideal for starting as a remote practice with digital workflows — a key differentiator from traditional in-person training paths.",
    },
    es: {
      question: "¿Qué ofrece Intuit Academy y qué la hace única?",
      options: ["Certificación pagada solo para CPAs", "Capacitación gratuita, a tu ritmo, diseñada para TurboTax Live con flujos de trabajo digitales", "Capacitación presencial en Atlanta", "Un programa de aprendizaje de 500 horas"],
      correct: 1,
      explanation: "Intuit Academy es gratuita y a tu ritmo, diseñada para TurboTax Live. Se enfoca en escenarios de 1099/W-2 y contribuyentes de altos ingresos, haciéndola ideal para iniciar una práctica remota con flujos de trabajo digitales — un diferenciador clave de las rutas de capacitación presencial tradicionales.",
    },
  },
  {
    en: {
      question: "What does AGI (Adjusted Gross Income) determine for taxpayers?",
      options: ["Only their tax bracket", "Eligibility for many credits and deductions", "Their refund amount only", "Their state tax rate"],
      correct: 1,
      explanation: "AGI (Adjusted Gross Income) is total income minus above-the-line adjustments. It determines eligibility for many credits and deductions, including education credits, IRA contributions, and various income-based phase-outs.",
    },
    es: {
      question: "¿Qué determina el AGI (Ingreso Bruto Ajustado) para los contribuyentes?",
      options: ["Solo su categoría impositiva", "Elegibilidad para muchos créditos y deducciones", "Solo su monto de reembolso", "Su tasa de impuesto estatal"],
      correct: 1,
      explanation: "El AGI (Ingreso Bruto Ajustado) es el ingreso total menos ajustes above-the-line. Determina la elegibilidad para muchos créditos y deducciones, incluyendo créditos educativos, contribuciones a IRA y varios límites basados en ingresos.",
    },
  },
  {
    en: {
      question: "How long can it take for Georgia e-file refunds vs. paper return refunds?",
      options: ["Both take the same time", "E-file: ~30 days; paper: up to 12 weeks", "E-file: 1 week; paper: 2 weeks", "E-file: 60 days; paper: 6 months"],
      correct: 1,
      explanation: "E-file with direct deposit can yield refunds in approximately 30 days, while paper returns may take up to 12 weeks. This significant speed advantage is a major selling point when explaining e-filing benefits to clients.",
    },
    es: {
      question: "¿Cuánto tiempo pueden tardar los reembolsos de e-file de Georgia vs. declaraciones en papel?",
      options: ["Ambos tardan lo mismo", "E-file: ~30 días; papel: hasta 12 semanas", "E-file: 1 semana; papel: 2 semanas", "E-file: 60 días; papel: 6 meses"],
      correct: 1,
      explanation: "El e-file con depósito directo puede producir reembolsos en aproximadamente 30 días, mientras que las declaraciones en papel pueden tomar hasta 12 semanas. Esta ventaja significativa de velocidad es un punto de venta importante al explicar los beneficios del e-file a los clientes.",
    },
  },
];
