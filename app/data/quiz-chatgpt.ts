import type { QuizQuestion } from "@/app/components/AnalysisQuiz";

export const chatgptQuestions: QuizQuestion[] = [
  {
    en: {
      question: "What is the only mandatory federal credential required to prepare tax returns for pay in Georgia?",
      options: ["CPA license", "PTIN (Preparer Tax Identification Number)", "EFIN (Electronic Filing Identification Number)", "Enrolled Agent designation"],
      correct: 1,
      explanation: "The PTIN is the single mandatory federal credential. Every person who prepares or assists in preparing a federal tax return for compensation must have one. Georgia adds no additional state-level requirements on top of this.",
    },
    es: {
      question: "¿Cuál es la única credencial federal obligatoria para preparar declaraciones de impuestos por pago en Georgia?",
      options: ["Licencia de CPA", "PTIN (Número de Identificación de Preparador)", "EFIN (Número de Identificación de Presentación Electrónica)", "Designación de Agente Inscrito"],
      correct: 1,
      explanation: "El PTIN es la única credencial federal obligatoria. Toda persona que prepare o asista en la preparación de una declaración federal por compensación debe tener uno. Georgia no agrega requisitos estatales adicionales.",
    },
  },
  {
    en: {
      question: "How much does it cost to apply for a PTIN?",
      options: ["Free", "$18.75 per year", "$100 per year", "$267 per year"],
      correct: 1,
      explanation: "The PTIN costs $18.75 per year. It can be obtained online in about 15 minutes through the IRS Tax Professional PTIN System and must be renewed annually before December 31.",
    },
    es: {
      question: "¿Cuánto cuesta solicitar un PTIN?",
      options: ["Gratis", "$18.75 por año", "$100 por año", "$267 por año"],
      correct: 1,
      explanation: "El PTIN cuesta $18.75 por año. Se puede obtener en línea en unos 15 minutos a través del Sistema PTIN del IRS y debe renovarse anualmente antes del 31 de diciembre.",
    },
  },
  {
    en: {
      question: "At what threshold must a tax preparer e-file returns (requiring an EFIN)?",
      options: ["1 or more returns", "5 or more returns", "11 or more individual returns", "50 or more returns"],
      correct: 2,
      explanation: "Federal rules mandate e-filing if a preparer expects to file 11 or more individual returns in a year. The EFIN is the firm-level credential that enables electronic filing.",
    },
    es: {
      question: "¿A partir de cuántas declaraciones un preparador debe presentar electrónicamente (requiriendo un EFIN)?",
      options: ["1 o más declaraciones", "5 o más declaraciones", "11 o más declaraciones individuales", "50 o más declaraciones"],
      correct: 2,
      explanation: "Las reglas federales exigen la presentación electrónica si un preparador espera presentar 11 o más declaraciones individuales al año. El EFIN es la credencial a nivel de firma que permite la presentación electrónica.",
    },
  },
  {
    en: {
      question: "What does the AFSP (Annual Filing Season Program) provide to preparers who complete it?",
      options: ["Unlimited IRS representation rights", "Limited representation rights and IRS directory listing", "A state license to prepare taxes", "Free tax software"],
      correct: 1,
      explanation: "AFSP provides two major benefits: limited representation rights before the IRS (for returns you prepared) and listing in the IRS public directory of tax preparers — a trust signal for potential clients.",
    },
    es: {
      question: "¿Qué proporciona el AFSP (Programa Anual de Temporada de Presentación) a los preparadores que lo completan?",
      options: ["Derechos de representación ilimitados ante el IRS", "Derechos de representación limitados y listado en el directorio del IRS", "Una licencia estatal para preparar impuestos", "Software de impuestos gratis"],
      correct: 1,
      explanation: "El AFSP proporciona dos beneficios principales: derechos de representación limitados ante el IRS (para declaraciones que preparaste) y listado en el directorio público del IRS — una señal de confianza para clientes potenciales.",
    },
  },
  {
    en: {
      question: "How many hours of continuing education (CE) are required annually for AFSP?",
      options: ["6 hours", "12 hours", "18 hours", "24 hours"],
      correct: 2,
      explanation: "AFSP requires 18 hours of IRS-approved CE annually: 6 hours AFTR (Annual Federal Tax Refresher with a comprehension test), 10 hours federal tax law, and 2 hours ethics. The deadline is December 31 each year.",
    },
    es: {
      question: "¿Cuántas horas de educación continua (CE) se requieren anualmente para el AFSP?",
      options: ["6 horas", "12 horas", "18 horas", "24 horas"],
      correct: 2,
      explanation: "El AFSP requiere 18 horas de CE aprobadas por el IRS anualmente: 6 horas de AFTR (Repaso Federal Anual con prueba de comprensión), 10 horas de ley tributaria federal y 2 horas de ética. La fecha límite es el 31 de diciembre cada año.",
    },
  },
  {
    en: {
      question: "What is the penalty per credit per return for failing IRS due diligence requirements (2026)?",
      options: ["$250", "$500", "$650", "$1,000"],
      correct: 2,
      explanation: "Each due diligence failure carries a $650 penalty per credit per return (2026). A single return claiming EITC, CTC, AOTC, and Head of Household with inadequate documentation = $2,600 in penalties to the preparer.",
    },
    es: {
      question: "¿Cuál es la multa por crédito por declaración por no cumplir los requisitos de debida diligencia del IRS (2026)?",
      options: ["$250", "$500", "$650", "$1,000"],
      correct: 2,
      explanation: "Cada falla de debida diligencia conlleva una multa de $650 por crédito por declaración (2026). Una sola declaración reclamando EITC, CTC, AOTC y Cabeza de Familia sin documentación adecuada = $2,600 en multas para el preparador.",
    },
  },
  {
    en: {
      question: "How much does it cost to form an LLC in Georgia?",
      options: ["Free", "$50", "$100", "$250"],
      correct: 2,
      explanation: "Filing Articles of Organization with the Georgia Secretary of State costs $100. The annual renewal is $50 (due April 1). An LLC is the recommended structure because it provides personal liability protection.",
    },
    es: {
      question: "¿Cuánto cuesta formar una LLC en Georgia?",
      options: ["Gratis", "$50", "$100", "$250"],
      correct: 2,
      explanation: "Presentar los Artículos de Organización con el Secretario de Estado de Georgia cuesta $100. La renovación anual es de $50 (vence el 1 de abril). Una LLC es la estructura recomendada porque proporciona protección de responsabilidad personal.",
    },
  },
  {
    en: {
      question: "What is a WISP, and why is it required for tax preparers?",
      options: ["A type of tax software", "A Written Information Security Plan required by the FTC Safeguards Rule", "A warranty for insurance policies", "A work income summary plan"],
      correct: 1,
      explanation: "Tax preparers are classified as 'financial institutions' under the FTC Safeguards Rule and must create a Written Information Security Plan (WISP) before preparing any returns. Since 2023, preparers must certify WISP compliance when renewing their PTIN. Penalties can reach $46,517 per violation per day.",
    },
    es: {
      question: "¿Qué es un WISP y por qué se requiere para los preparadores de impuestos?",
      options: ["Un tipo de software de impuestos", "Un Plan Escrito de Seguridad de Información requerido por la Regla de Salvaguardas de la FTC", "Una garantía para pólizas de seguro", "Un plan resumido de ingresos del trabajo"],
      correct: 1,
      explanation: "Los preparadores de impuestos son clasificados como 'instituciones financieras' bajo la Regla de Salvaguardas de la FTC y deben crear un Plan Escrito de Seguridad de Información (WISP) antes de preparar cualquier declaración. Desde 2023, deben certificar cumplimiento al renovar su PTIN. Las multas pueden alcanzar $46,517 por violación por día.",
    },
  },
  {
    en: {
      question: "Which tax software is recommended as the best starting option for a new solo preparer?",
      options: ["TurboTax", "Drake Tax Pay-Per-Return ($349.99)", "Lacerte ($7,000+)", "UltraTax CS ($2,650+)"],
      correct: 1,
      explanation: "Drake Tax Pay-Per-Return at $349.99 (10 returns, full features) is the strongest recommendation. Drake is #1 among sole-proprietor preparers, includes all federal and state forms with no per-state surcharges, and has strong support.",
    },
    es: {
      question: "¿Qué software de impuestos se recomienda como la mejor opción inicial para un preparador individual nuevo?",
      options: ["TurboTax", "Drake Tax Pay-Per-Return ($349.99)", "Lacerte ($7,000+)", "UltraTax CS ($2,650+)"],
      correct: 1,
      explanation: "Drake Tax Pay-Per-Return a $349.99 (10 declaraciones, funciones completas) es la recomendación más fuerte. Drake es #1 entre preparadores individuales, incluye todos los formularios federales y estatales sin recargos por estado.",
    },
  },
  {
    en: {
      question: "Which states require a state-level license for tax preparers, unlike Georgia?",
      options: ["Texas, Florida, Nevada, and Arizona", "California, Maryland, New York, and Oregon", "Georgia, Alabama, Tennessee, and South Carolina", "All 50 states require state licensing"],
      correct: 1,
      explanation: "California, Maryland, New York, and Oregon require state-level licensing, bonding, or exams for tax preparers. Georgia imposes no such requirements — any adult with a valid PTIN can legally prepare returns for compensation.",
    },
    es: {
      question: "¿Qué estados requieren una licencia estatal para preparadores de impuestos, a diferencia de Georgia?",
      options: ["Texas, Florida, Nevada y Arizona", "California, Maryland, Nueva York y Oregón", "Georgia, Alabama, Tennessee y Carolina del Sur", "Los 50 estados requieren licencia estatal"],
      correct: 1,
      explanation: "California, Maryland, Nueva York y Oregón requieren licencias, fianzas o exámenes estatales para preparadores. Georgia no impone tales requisitos — cualquier adulto con un PTIN válido puede preparar declaraciones legalmente por compensación.",
    },
  },
  {
    en: {
      question: "How many returns can a new part-time preparer realistically expect in their first season?",
      options: ["5–10 returns", "30–75 returns", "150–200 returns", "300+ returns"],
      correct: 1,
      explanation: "A realistic first season for a part-time solo preparer is 30–75 returns. At $250 average, 75 returns equals approximately $18,750 in revenue. Second season targets 75–150 returns.",
    },
    es: {
      question: "¿Cuántas declaraciones puede esperar de forma realista un preparador nuevo a tiempo parcial en su primera temporada?",
      options: ["5–10 declaraciones", "30–75 declaraciones", "150–200 declaraciones", "300+ declaraciones"],
      correct: 1,
      explanation: "Una primera temporada realista para un preparador individual a tiempo parcial es 30–75 declaraciones. A $250 promedio, 75 declaraciones equivalen a aproximadamente $18,750 en ingresos. La segunda temporada apunta a 75–150 declaraciones.",
    },
  },
  {
    en: {
      question: "What are the IRS 'Security Six' minimum protections that tax preparers must implement?",
      options: ["Six types of insurance policies", "Six IRS exams to pass", "Antivirus, firewalls, MFA, backups, drive encryption, and VPN", "Six forms to file with the IRS"],
      correct: 2,
      explanation: "The IRS Security Six are: (1) antivirus/anti-malware, (2) hardware and software firewalls, (3) multi-factor authentication on all accounts, (4) data backup and disaster recovery, (5) full-drive encryption, and (6) VPN for remote access to client data.",
    },
    es: {
      question: "¿Cuáles son las seis protecciones mínimas 'Security Six' del IRS que los preparadores deben implementar?",
      options: ["Seis tipos de pólizas de seguro", "Seis exámenes del IRS para aprobar", "Antivirus, firewalls, MFA, respaldos, cifrado de disco y VPN", "Seis formularios para presentar ante el IRS"],
      correct: 2,
      explanation: "Los Security Six del IRS son: (1) antivirus/anti-malware, (2) firewalls de hardware y software, (3) autenticación multifactor en todas las cuentas, (4) respaldo de datos y recuperación ante desastres, (5) cifrado completo de disco, y (6) VPN para acceso remoto a datos de clientes.",
    },
  },
  {
    en: {
      question: "What is the typical fee range for preparing a simple 1040 (W-2, standard deduction) in Georgia?",
      options: ["$50–$100", "$150–$300", "$500–$800", "$1,000–$1,500"],
      correct: 1,
      explanation: "A simple 1040 with W-2 income and standard deduction typically ranges from $150–$300 in Georgia. New preparers should start slightly below market rate to attract initial clients, then increase 6–10% annually.",
    },
    es: {
      question: "¿Cuál es el rango típico de tarifa para preparar un 1040 simple (W-2, deducción estándar) en Georgia?",
      options: ["$50–$100", "$150–$300", "$500–$800", "$1,000–$1,500"],
      correct: 1,
      explanation: "Un 1040 simple con ingresos W-2 y deducción estándar típicamente varía de $150–$300 en Georgia. Los preparadores nuevos deben comenzar ligeramente por debajo del mercado para atraer clientes iniciales, luego aumentar 6–10% anualmente.",
    },
  },
  {
    en: {
      question: "When is the best time to apply for an EFIN before tax season?",
      options: ["January, right when tax season starts", "March or April", "October or November (45 days processing)", "There is no deadline"],
      correct: 2,
      explanation: "The EFIN application takes up to 45 days to process. Applying in October or November ensures approval before January filing season. A November application may not be approved in time.",
    },
    es: {
      question: "¿Cuándo es el mejor momento para solicitar un EFIN antes de la temporada de impuestos?",
      options: ["Enero, justo cuando comienza la temporada", "Marzo o abril", "Octubre o noviembre (45 días de procesamiento)", "No hay fecha límite"],
      correct: 2,
      explanation: "La solicitud del EFIN tarda hasta 45 días en procesarse. Solicitarlo en octubre o noviembre asegura la aprobación antes de la temporada en enero. Una solicitud en noviembre podría no aprobarse a tiempo.",
    },
  },
  {
    en: {
      question: "What is the approximate total minimum startup cost to launch a tax preparation business in Georgia?",
      options: ["$500–$800", "$1,800–$2,500", "$10,000–$15,000", "$25,000+"],
      correct: 1,
      explanation: "The minimum startup cost is approximately $1,800–$2,500, covering PTIN, LLC formation, training, basic software, and essential supplies. A more comfortable setup runs $7,000–$8,000 with better software, insurance, and marketing.",
    },
    es: {
      question: "¿Cuál es el costo total mínimo aproximado de inicio para lanzar un negocio de preparación de impuestos en Georgia?",
      options: ["$500–$800", "$1,800–$2,500", "$10,000–$15,000", "$25,000+"],
      correct: 1,
      explanation: "El costo mínimo de inicio es aproximadamente $1,800–$2,500, cubriendo PTIN, formación de LLC, capacitación, software básico y suministros esenciales. Una configuración más cómoda cuesta $7,000–$8,000 con mejor software, seguros y marketing.",
    },
  },
];
