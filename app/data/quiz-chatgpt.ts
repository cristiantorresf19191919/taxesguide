import type { QuizQuestion } from "@/app/components/AnalysisQuiz";

/**
 * ChatGPT analysis page quiz — 15 unique questions focused on:
 * Industry overview, training programs, software comparison, pricing strategy,
 * EFIN timing, month-by-month timeline, startup cost breakdown, client acquisition
 */
export const chatgptQuestions: QuizQuestion[] = [
  {
    en: {
      question: "How much revenue does the U.S. tax preparation industry generate annually?",
      options: ["Over $2 billion", "Over $14 billion", "Over $50 billion", "Over $100 billion"],
      correct: 1,
      explanation: "The U.S. tax preparation industry generates over $14 billion annually, serving approximately 150 million individual returns filed each year. Around 60% of Americans use a paid tax preparer.",
    },
    es: {
      question: "¿Cuánto ingreso genera anualmente la industria de preparación de impuestos en EE.UU.?",
      options: ["Más de $2 mil millones", "Más de $14 mil millones", "Más de $50 mil millones", "Más de $100 mil millones"],
      correct: 1,
      explanation: "La industria de preparación de impuestos en EE.UU. genera más de $14 mil millones anuales, sirviendo aproximadamente 150 millones de declaraciones individuales al año. Alrededor del 60% de los estadounidenses usan un preparador pagado.",
    },
  },
  {
    en: {
      question: "What percentage of Americans use a paid tax preparer?",
      options: ["About 25%", "About 40%", "About 60%", "About 85%"],
      correct: 2,
      explanation: "Around 60% of Americans use a paid tax preparer, and that percentage increases among taxpayers with self-employment income, rental properties, or complex family situations.",
    },
    es: {
      question: "¿Qué porcentaje de estadounidenses usa un preparador de impuestos pagado?",
      options: ["Alrededor del 25%", "Alrededor del 40%", "Alrededor del 60%", "Alrededor del 85%"],
      correct: 2,
      explanation: "Alrededor del 60% de los estadounidenses usan un preparador pagado, y ese porcentaje aumenta entre contribuyentes con ingresos de autoempleo, propiedades de alquiler o situaciones familiares complejas.",
    },
  },
  {
    en: {
      question: "What is the cost and duration of the H&R Block Income Tax Course?",
      options: ["Free tuition, ~$149 for materials, ~40 hours", "$500 total, ~20 hours", "$1,000 total, ~80 hours", "Free including materials, ~10 hours"],
      correct: 0,
      explanation: "The H&R Block Income Tax Course is tuition-free with approximately $149 for materials. It is about 40 hours (in-person, virtual, or self-paced) and covers filing requirements, dependents, income, deductions, credits, self-employment, and ethics. No obligation to work for H&R Block afterward.",
    },
    es: {
      question: "¿Cuál es el costo y duración del Curso de Impuestos de H&R Block?",
      options: ["Matrícula gratuita, ~$149 por materiales, ~40 horas", "$500 total, ~20 horas", "$1,000 total, ~80 horas", "Gratis incluidos materiales, ~10 horas"],
      correct: 0,
      explanation: "El Curso de Impuestos de H&R Block tiene matrícula gratuita con aproximadamente $149 por materiales. Son unas 40 horas (presencial, virtual o a tu ritmo) y cubre requisitos de presentación, dependientes, ingresos, deducciones, créditos, autoempleo y ética. Sin obligación de trabajar para H&R Block después.",
    },
  },
  {
    en: {
      question: "How many hours and modules does the Surgent Comprehensive Tax Course include?",
      options: ["20 hours, 2 modules", "32 hours, 12 modules", "57 hours, 4 modules", "100 hours, 8 modules"],
      correct: 2,
      explanation: "The Surgent Comprehensive Tax Course includes 57 hours across 4 modules, with expert-led video and graded exams. It costs $500–$800 and is approved by IRS, NASBA, and CTEC. Students have up to 6 months to complete it.",
    },
    es: {
      question: "¿Cuántas horas y módulos incluye el Curso Integral de Surgent?",
      options: ["20 horas, 2 módulos", "32 horas, 12 módulos", "57 horas, 4 módulos", "100 horas, 8 módulos"],
      correct: 2,
      explanation: "El Curso Integral de Surgent incluye 57 horas en 4 módulos, con video dirigido por expertos y exámenes calificados. Cuesta $500–$800 y está aprobado por IRS, NASBA y CTEC. Los estudiantes tienen hasta 6 meses para completarlo.",
    },
  },
  {
    en: {
      question: "What minimum score is required to pass the VITA Basic or Advanced certification?",
      options: ["60%", "70%", "80%", "90%"],
      correct: 2,
      explanation: "VITA volunteers must pass the Basic or Advanced certification with a minimum score of 80%. The IRS provides free training via Link & Learn Taxes, and volunteers prepare returns for low-income and elderly taxpayers under supervision.",
    },
    es: {
      question: "¿Qué puntaje mínimo se requiere para aprobar la certificación Básica o Avanzada de VITA?",
      options: ["60%", "70%", "80%", "90%"],
      correct: 2,
      explanation: "Los voluntarios de VITA deben aprobar la certificación Básica o Avanzada con un puntaje mínimo del 80%. El IRS proporciona capacitación gratuita a través de Link & Learn Taxes, y los voluntarios preparan declaraciones para contribuyentes de bajos ingresos y personas mayores bajo supervisión.",
    },
  },
  {
    en: {
      question: "What does Drake Tax Pay-Per-Return cost and how many returns does it include?",
      options: ["$199.99 for 5 returns", "$349.99 for 10 returns", "$599.99 for 25 returns", "$999.99 for unlimited returns"],
      correct: 1,
      explanation: "Drake Tax Pay-Per-Return costs $349.99 and includes 10 returns with full features. Drake is #1 among sole-proprietor preparers (2024 Tax Adviser Survey) and includes all federal and state forms with no per-state surcharges.",
    },
    es: {
      question: "¿Cuánto cuesta Drake Tax Pay-Per-Return y cuántas declaraciones incluye?",
      options: ["$199.99 por 5 declaraciones", "$349.99 por 10 declaraciones", "$599.99 por 25 declaraciones", "$999.99 por ilimitadas"],
      correct: 1,
      explanation: "Drake Tax Pay-Per-Return cuesta $349.99 e incluye 10 declaraciones con funciones completas. Drake es #1 entre preparadores individuales (Encuesta Tax Adviser 2024) e incluye todos los formularios federales y estatales sin recargos por estado.",
    },
  },
  {
    en: {
      question: "Why should new preparers avoid Lacerte and UltraTax CS at the start?",
      options: ["They lack e-filing capabilities", "They don't support Georgia returns", "They cost $7,000+ and $2,650+ respectively — too expensive for a startup", "They are only available for CPA firms"],
      correct: 2,
      explanation: "Lacerte costs $7,000+ and UltraTax CS costs $2,650+, making them far too expensive for a new preparer. These are enterprise-grade products for established firms. Starting with Drake PPR at $349.99 or TaxAct Professional at $495+ is much more practical.",
    },
    es: {
      question: "¿Por qué los preparadores nuevos deben evitar Lacerte y UltraTax CS al inicio?",
      options: ["No tienen capacidades de e-file", "No soportan declaraciones de Georgia", "Cuestan $7,000+ y $2,650+ respectivamente — demasiado caro para un inicio", "Solo están disponibles para firmas de CPA"],
      correct: 2,
      explanation: "Lacerte cuesta $7,000+ y UltraTax CS cuesta $2,650+, haciéndolos demasiado caros para un preparador nuevo. Son productos empresariales para firmas establecidas. Comenzar con Drake PPR a $349.99 o TaxAct Professional a $495+ es mucho más práctico.",
    },
  },
  {
    en: {
      question: "What is the typical fee range for a 1040 with Schedule C (self-employed) in Georgia?",
      options: ["$50–$150", "$150–$250", "$300–$500", "$800–$1,500"],
      correct: 2,
      explanation: "A 1040 with Schedule C for self-employed taxpayers typically ranges from $300–$500 in Georgia. Simple 1040s (W-2, standard deduction) range $150–$300, while small business returns (1120S, 1065) range $800–$1,500.",
    },
    es: {
      question: "¿Cuál es el rango típico de tarifa para un 1040 con Schedule C (autoempleo) en Georgia?",
      options: ["$50–$150", "$150–$250", "$300–$500", "$800–$1,500"],
      correct: 2,
      explanation: "Un 1040 con Schedule C para contribuyentes autónomos típicamente varía de $300–$500 en Georgia. Los 1040 simples (W-2, deducción estándar) varían de $150–$300, mientras que las declaraciones de pequeños negocios (1120S, 1065) varían de $800–$1,500.",
    },
  },
  {
    en: {
      question: "Why is basing fees on refund amounts prohibited by the IRS?",
      options: ["It is too expensive for clients", "It creates a conflict of interest and can lead to fraudulent inflation of refunds", "The IRS sets all preparation fees", "It is only prohibited in Georgia"],
      correct: 1,
      explanation: "Basing fees on refund amounts is prohibited by the IRS because it creates a conflict of interest — preparers would be incentivized to inflate deductions or credits to increase refunds and their own fees. Instead, fees should be based on form complexity.",
    },
    es: {
      question: "¿Por qué está prohibido por el IRS basar las tarifas en los montos de reembolso?",
      options: ["Es demasiado caro para los clientes", "Crea un conflicto de interés y puede llevar a inflar fraudulentamente los reembolsos", "El IRS establece todas las tarifas de preparación", "Solo está prohibido en Georgia"],
      correct: 1,
      explanation: "Basar las tarifas en los montos de reembolso está prohibido por el IRS porque crea un conflicto de interés — los preparadores estarían incentivados a inflar deducciones o créditos para aumentar reembolsos y sus propias tarifas. Las tarifas deben basarse en la complejidad de los formularios.",
    },
  },
  {
    en: {
      question: "What should Sandra do during June–July according to the month-by-month timeline?",
      options: ["File her LLC and apply for EFIN", "Complete AFSP and buy tax software", "Self-study with IRS Pub 17, start Link & Learn, and apply for PTIN", "Begin accepting clients and start VITA volunteering"],
      correct: 2,
      explanation: "During June–July (Foundation phase), Sandra should self-study using Taxes Made Simple by Mike Piper (~$12) and IRS Publication 17, start IRS Link & Learn Taxes, and apply for her PTIN ($18.75). This builds the knowledge foundation before formal training.",
    },
    es: {
      question: "¿Qué debería hacer Sandra durante junio–julio según el cronograma mes a mes?",
      options: ["Registrar su LLC y solicitar EFIN", "Completar AFSP y comprar software de impuestos", "Autoestudio con Pub 17 del IRS, comenzar Link & Learn, y solicitar PTIN", "Comenzar a aceptar clientes e iniciar voluntariado VITA"],
      correct: 2,
      explanation: "Durante junio–julio (fase de Base), Sandra debería autoestudiar usando Taxes Made Simple de Mike Piper (~$12) y la Publicación 17 del IRS, comenzar Link & Learn del IRS, y solicitar su PTIN ($18.75). Esto construye la base de conocimiento antes de la formación formal.",
    },
  },
  {
    en: {
      question: "Why is October the critical month for EFIN application?",
      options: ["EFIN applications are only accepted in October", "The EFIN is free only during October", "Processing takes up to 45 days, so applying by October ensures approval before January filing season", "October is when PTIN renewal opens"],
      correct: 2,
      explanation: "The EFIN application takes up to 45 days to process. Applying by October at the latest ensures approval before January filing season. A November application may not be approved in time, and the application includes a suitability check (credit, tax compliance, criminal background).",
    },
    es: {
      question: "¿Por qué octubre es el mes crítico para la solicitud del EFIN?",
      options: ["Las solicitudes de EFIN solo se aceptan en octubre", "El EFIN es gratis solo durante octubre", "El procesamiento tarda hasta 45 días, así que solicitar en octubre asegura aprobación antes de la temporada de enero", "Octubre es cuando abre la renovación del PTIN"],
      correct: 2,
      explanation: "La solicitud del EFIN tarda hasta 45 días en procesarse. Solicitarlo a más tardar en octubre asegura la aprobación antes de la temporada en enero. Una solicitud en noviembre podría no aprobarse a tiempo, y la solicitud incluye una verificación de idoneidad (crédito, cumplimiento fiscal, antecedentes penales).",
    },
  },
  {
    en: {
      question: "What are the three proven strategies for building a client base from zero?",
      options: ["TV ads, radio spots, and billboard rentals", "Personal network, online presence, and community networking", "Cold calling, door-to-door, and direct mail only", "IRS referrals, CPA partnerships, and government contracts"],
      correct: 1,
      explanation: "The three proven strategies are: (1) Personal network — tell everyone, offer introductory discounts, use referral bonuses ($25–$50 per new client), (2) Online presence — Google Business Profile, website, social media tax tips, and (3) Community networking — BNI, chamber of commerce, partnerships with realtors and financial planners.",
    },
    es: {
      question: "¿Cuáles son las tres estrategias probadas para construir una base de clientes desde cero?",
      options: ["Anuncios en TV, radio y vallas publicitarias", "Red personal, presencia en línea y networking comunitario", "Llamadas en frío, puerta a puerta y correo directo solamente", "Referidos del IRS, asociaciones con CPA y contratos gubernamentales"],
      correct: 1,
      explanation: "Las tres estrategias probadas son: (1) Red personal — decirle a todos, ofrecer descuentos introductorios, bonos de referido ($25–$50 por nuevo cliente), (2) Presencia en línea — perfil de Google Business, sitio web, consejos fiscales en redes sociales, y (3) Networking comunitario — BNI, cámara de comercio, asociaciones con agentes inmobiliarios y planificadores financieros.",
    },
  },
  {
    en: {
      question: "How much does a state return add-on typically cost in Georgia?",
      options: ["Free — included with federal", "$50–$100", "$200–$300", "$500+"],
      correct: 1,
      explanation: "A state return add-on in Georgia typically costs $50–$100 on top of the federal preparation fee. This is an additional revenue source for each client who needs both federal and state returns prepared.",
    },
    es: {
      question: "¿Cuánto cuesta típicamente el complemento de declaración estatal en Georgia?",
      options: ["Gratis — incluido con la federal", "$50–$100", "$200–$300", "$500+"],
      correct: 1,
      explanation: "Un complemento de declaración estatal en Georgia típicamente cuesta $50–$100 además de la tarifa de preparación federal. Esta es una fuente de ingresos adicional por cada cliente que necesita tanto la declaración federal como la estatal.",
    },
  },
  {
    en: {
      question: "What is the UltimateTax pricing model that distinguishes it from competitors?",
      options: ["Flat monthly subscription only", "$388 base fee plus $20 per return — a pay-as-you-go model", "Free software with mandatory training purchase", "Tiered pricing based on state count"],
      correct: 1,
      explanation: "UltimateTax uses a unique pay-as-you-go model: $388 base fee plus $20 per return. This gives volume flexibility — you only pay for what you use. Other options include Drake PPR (fixed 10 returns) and TaxAct Professional (budget-friendly unlimited).",
    },
    es: {
      question: "¿Cuál es el modelo de precios de UltimateTax que lo distingue de la competencia?",
      options: ["Solo suscripción mensual fija", "Tarifa base de $388 más $20 por declaración — modelo de pago por uso", "Software gratis con compra obligatoria de capacitación", "Precios por niveles basados en cantidad de estados"],
      correct: 1,
      explanation: "UltimateTax usa un modelo único de pago por uso: tarifa base de $388 más $20 por declaración. Esto da flexibilidad de volumen — solo pagas por lo que usas. Otras opciones incluyen Drake PPR (10 declaraciones fijas) y TaxAct Professional (ilimitado económico).",
    },
  },
  {
    en: {
      question: "By what percentage should Sandra increase her fees annually as she builds experience?",
      options: ["1–2%", "6–10%", "15–20%", "25–30%"],
      correct: 1,
      explanation: "Sandra should increase her fees by 6–10% annually as she builds experience and collects client reviews. She should start slightly below market rate to attract initial clients, then gradually increase as her reputation and skills grow.",
    },
    es: {
      question: "¿En qué porcentaje debería Sandra aumentar sus tarifas anualmente conforme gana experiencia?",
      options: ["1–2%", "6–10%", "15–20%", "25–30%"],
      correct: 1,
      explanation: "Sandra debería aumentar sus tarifas un 6–10% anualmente conforme gana experiencia y recopila reseñas de clientes. Debería comenzar ligeramente por debajo del mercado para atraer clientes iniciales, luego aumentar gradualmente conforme crece su reputación y habilidades.",
    },
  },
];
