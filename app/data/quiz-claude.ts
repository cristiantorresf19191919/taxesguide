import type { QuizQuestion } from "@/app/components/AnalysisQuiz";

export const claudeQuestions: QuizQuestion[] = [
  {
    en: {
      question: "Does Georgia require a state license to prepare taxes for pay?",
      options: ["Yes, a state exam is required", "Yes, bonding and registration are required", "No — only a federal PTIN is required", "Yes, but only for self-employed preparers"],
      correct: 2,
      explanation: "Georgia does not require a state license, exam, certification, or registration to work as a paid tax preparer. The only legal requirement is a valid PTIN from the IRS. This makes Georgia one of the easiest states to launch a tax preparation business.",
    },
    es: {
      question: "¿Georgia requiere una licencia estatal para preparar impuestos por pago?",
      options: ["Sí, se requiere un examen estatal", "Sí, se requiere fianza y registro", "No — solo se requiere un PTIN federal", "Sí, pero solo para preparadores autónomos"],
      correct: 2,
      explanation: "Georgia no requiere licencia estatal, examen, certificación ni registro para trabajar como preparador de impuestos pagado. El único requisito legal es un PTIN válido del IRS. Esto hace de Georgia uno de los estados más fáciles para iniciar un negocio de preparación de impuestos.",
    },
  },
  {
    en: {
      question: "What penalty does Georgia Code § 48-2-62 impose on preparers who fraudulently endorse refund checks?",
      options: ["$100 per check", "$250 per check", "$500 per check", "$1,000 per check"],
      correct: 2,
      explanation: "Georgia Code § 48-2-62 imposes a $500 penalty per check for fraudulently endorsing refund checks. The state can also seek injunctions barring dishonest preparers from practicing.",
    },
    es: {
      question: "¿Qué multa impone el Código de Georgia § 48-2-62 a los preparadores que endosan fraudulentamente cheques de reembolso?",
      options: ["$100 por cheque", "$250 por cheque", "$500 por cheque", "$1,000 por cheque"],
      correct: 2,
      explanation: "El Código de Georgia § 48-2-62 impone una multa de $500 por cheque por endosar fraudulentamente cheques de reembolso. El estado también puede solicitar órdenes judiciales contra preparadores deshonestos.",
    },
  },
  {
    en: {
      question: "What are the three federal credentials Sandra must obtain to operate independently?",
      options: ["CPA, EA, and state license", "PTIN, EFIN, and AFSP (recommended)", "SSN, EIN, and DBA", "LLC, WISP, and E&O insurance"],
      correct: 1,
      explanation: "The three key federal credentials are: (1) PTIN — mandatory for all paid preparers, (2) EFIN — required for e-filing, and (3) AFSP — strongly recommended for credibility and limited representation rights before the IRS.",
    },
    es: {
      question: "¿Cuáles son las tres credenciales federales que Sandra debe obtener para operar independientemente?",
      options: ["CPA, EA y licencia estatal", "PTIN, EFIN y AFSP (recomendado)", "SSN, EIN y DBA", "LLC, WISP y seguro E&O"],
      correct: 1,
      explanation: "Las tres credenciales federales clave son: (1) PTIN — obligatorio para todos los preparadores pagados, (2) EFIN — requerido para e-file, y (3) AFSP — muy recomendado para credibilidad y derechos de representación limitados ante el IRS.",
    },
  },
  {
    en: {
      question: "What representation rights does a PTIN-only holder (without AFSP) have before the IRS?",
      options: ["Full representation rights", "Limited representation rights", "Zero representation rights", "Rights only for audit cases"],
      correct: 2,
      explanation: "A PTIN-only holder has zero representation rights and is not listed in the IRS public directory. AFSP provides limited representation rights (for returns you prepared) and directory listing. The Enrolled Agent designation provides unlimited representation.",
    },
    es: {
      question: "¿Qué derechos de representación tiene un titular solo de PTIN (sin AFSP) ante el IRS?",
      options: ["Derechos de representación completos", "Derechos de representación limitados", "Cero derechos de representación", "Derechos solo para casos de auditoría"],
      correct: 2,
      explanation: "Un titular solo de PTIN tiene cero derechos de representación y no aparece en el directorio público del IRS. El AFSP proporciona derechos limitados de representación (para declaraciones que preparaste) y listado en el directorio. La designación EA proporciona representación ilimitada.",
    },
  },
  {
    en: {
      question: "How much does the Enrolled Agent (EA) SEE exam cost in total?",
      options: ["$100 total", "$267 total", "$534 total", "$801 total (3 parts × $267)"],
      correct: 3,
      explanation: "The EA requires passing a three-part SEE exam at $267 per part, totaling $801. It has no education prerequisites — anyone with a PTIN can sit for it. EAs have unlimited representation rights before the IRS.",
    },
    es: {
      question: "¿Cuánto cuesta en total el examen SEE de Agente Inscrito (EA)?",
      options: ["$100 total", "$267 total", "$534 total", "$801 total (3 partes × $267)"],
      correct: 3,
      explanation: "El EA requiere aprobar un examen SEE de tres partes a $267 por parte, totalizando $801. No tiene requisitos de educación previa — cualquier persona con PTIN puede presentarlo. Los EAs tienen derechos de representación ilimitados ante el IRS.",
    },
  },
  {
    en: {
      question: "What is the VITA program, and what special benefit does it provide for AFSP?",
      options: ["A paid internship program at the IRS", "A volunteer program where passing the advanced exam exempts you from the AFTR course", "A software training certification", "A required state registration program"],
      correct: 1,
      explanation: "VITA (Volunteer Income Tax Assistance) is a free IRS program for preparing returns for low-income taxpayers. VITA volunteers with a PTIN who pass the advanced exam are exempt from the AFTR course when completing AFSP, saving time and money.",
    },
    es: {
      question: "¿Qué es el programa VITA y qué beneficio especial proporciona para el AFSP?",
      options: ["Un programa de pasantía pagada en el IRS", "Un programa de voluntariado donde aprobar el examen avanzado te exime del curso AFTR", "Una certificación de capacitación en software", "Un programa de registro estatal obligatorio"],
      correct: 1,
      explanation: "VITA (Asistencia Voluntaria de Impuestos) es un programa gratuito del IRS para preparar declaraciones para contribuyentes de bajos ingresos. Los voluntarios VITA con PTIN que aprueban el examen avanzado están exentos del curso AFTR al completar el AFSP, ahorrando tiempo y dinero.",
    },
  },
  {
    en: {
      question: "What is the recommended LLC annual renewal fee in Georgia, and when is it due?",
      options: ["$25, due January 1", "$50, due April 1", "$100, due December 31", "$200, due June 30"],
      correct: 1,
      explanation: "The LLC annual renewal in Georgia costs $50 and is due April 1. There is a $25 late fee after the deadline. The initial LLC formation filing costs $100 with the Georgia Secretary of State.",
    },
    es: {
      question: "¿Cuál es la tarifa de renovación anual de LLC en Georgia y cuándo vence?",
      options: ["$25, vence el 1 de enero", "$50, vence el 1 de abril", "$100, vence el 31 de diciembre", "$200, vence el 30 de junio"],
      correct: 1,
      explanation: "La renovación anual de LLC en Georgia cuesta $50 y vence el 1 de abril. Hay un recargo de $25 después de la fecha límite. La presentación inicial de formación de LLC cuesta $100 con el Secretario de Estado de Georgia.",
    },
  },
  {
    en: {
      question: "What must Sandra register as with the Georgia Department of Revenue if she e-files for clients?",
      options: ["Certified Public Accountant", "Licensed Tax Agent", "Third-party filer", "State Tax Auditor"],
      correct: 2,
      explanation: "Sandra must register as a third-party filer with the Georgia Department of Revenue through the Georgia Tax Center (gtc.dor.ga.gov). This is a free registration that allows her to file electronic returns on behalf of clients.",
    },
    es: {
      question: "¿Cómo debe registrarse Sandra en el Departamento de Ingresos de Georgia si hace e-file para clientes?",
      options: ["Contadora Pública Certificada", "Agente Fiscal Licenciada", "Presentadora de terceros", "Auditora Fiscal Estatal"],
      correct: 2,
      explanation: "Sandra debe registrarse como presentadora de terceros en el Departamento de Ingresos de Georgia a través del Georgia Tax Center (gtc.dor.ga.gov). Este es un registro gratuito que le permite presentar declaraciones electrónicas en nombre de clientes.",
    },
  },
  {
    en: {
      question: "Are tax preparation services subject to Georgia sales tax?",
      options: ["Yes, at 4% state rate", "Yes, at 7% combined rate", "No, they are exempt", "Only if earning over $50,000"],
      correct: 2,
      explanation: "Tax preparation services are not subject to Georgia sales tax. This is an important advantage for new preparers as it simplifies pricing and reduces the compliance burden.",
    },
    es: {
      question: "¿Los servicios de preparación de impuestos están sujetos al impuesto de ventas de Georgia?",
      options: ["Sí, a la tasa estatal del 4%", "Sí, a la tasa combinada del 7%", "No, están exentos", "Solo si se gana más de $50,000"],
      correct: 2,
      explanation: "Los servicios de preparación de impuestos no están sujetos al impuesto de ventas de Georgia. Esta es una ventaja importante para preparadores nuevos ya que simplifica los precios y reduce la carga de cumplimiento.",
    },
  },
  {
    en: {
      question: "What is the maximum daily penalty for non-compliance with the WISP/FTC Safeguards Rule?",
      options: ["$1,000 per violation per day", "$5,000 per violation per day", "$46,517 per violation per day", "$100,000 flat fine"],
      correct: 2,
      explanation: "Penalties for WISP/FTC Safeguards Rule non-compliance can reach up to $46,517 per violation per day. Since 2023, preparers must certify WISP compliance when renewing their PTIN. This makes data security legally mandatory.",
    },
    es: {
      question: "¿Cuál es la multa máxima diaria por incumplimiento de la Regla de Salvaguardas WISP/FTC?",
      options: ["$1,000 por violación por día", "$5,000 por violación por día", "$46,517 por violación por día", "$100,000 multa fija"],
      correct: 2,
      explanation: "Las multas por incumplimiento de la Regla de Salvaguardas WISP/FTC pueden alcanzar hasta $46,517 por violación por día. Desde 2023, los preparadores deben certificar el cumplimiento del WISP al renovar su PTIN. Esto hace la seguridad de datos legalmente obligatoria.",
    },
  },
  {
    en: {
      question: "What is Sandra's recommended learning path timing for getting trained and ready?",
      options: ["Start in January, ready by April", "Start in June, ready by January", "Start in March, ready by December", "Start in October, ready by February"],
      correct: 1,
      explanation: "The recommended path starts in June-July with self-study, then structured training in August-September, credentialing in October-November, AFSP completion by December 31, and first returns prepared in January.",
    },
    es: {
      question: "¿Cuál es el cronograma recomendado de la ruta de aprendizaje de Sandra para prepararse?",
      options: ["Comenzar en enero, lista para abril", "Comenzar en junio, lista para enero", "Comenzar en marzo, lista para diciembre", "Comenzar en octubre, lista para febrero"],
      correct: 1,
      explanation: "La ruta recomendada comienza en junio-julio con autoestudio, luego formación estructurada en agosto-septiembre, acreditación en octubre-noviembre, completar AFSP antes del 31 de diciembre, y primeras declaraciones preparadas en enero.",
    },
  },
  {
    en: {
      question: "What is the realistic first-year budget for Sandra to launch her practice?",
      options: ["$500–$1,000", "$3,000–$5,000", "$10,000–$15,000", "$20,000+"],
      correct: 1,
      explanation: "The most realistic first-year budget is $3,000–$5,000, covering essentials (PTIN, LLC, training) plus adequate software and marketing. A minimal start is possible for $1,800–$2,500, while a well-equipped practice costs $6,500–$7,500.",
    },
    es: {
      question: "¿Cuál es el presupuesto realista del primer año para que Sandra lance su práctica?",
      options: ["$500–$1,000", "$3,000–$5,000", "$10,000–$15,000", "$20,000+"],
      correct: 1,
      explanation: "El presupuesto más realista para el primer año es $3,000–$5,000, cubriendo lo esencial (PTIN, LLC, formación) más software y marketing adecuados. Un inicio mínimo es posible con $1,800–$2,500, mientras que una práctica bien equipada cuesta $6,500–$7,500.",
    },
  },
  {
    en: {
      question: "Which four credits/statuses trigger IRS due diligence requirements and Form 8867?",
      options: ["Standard Deduction, AMT, Capital Gains, Social Security", "EITC, CTC, AOTC, and Head of Household", "Mortgage Interest, Charity, State Taxes, Medical", "Self-Employment, Rental Income, Dividends, Interest"],
      correct: 1,
      explanation: "The four credits/statuses requiring due diligence are: EITC (Earned Income Tax Credit), CTC (Child Tax Credit), AOTC (American Opportunity Tax Credit), and Head of Household filing status. Form 8867 must be completed for each applicable return and records retained for 3 years.",
    },
    es: {
      question: "¿Cuáles cuatro créditos/estatus activan los requisitos de debida diligencia del IRS y el Formulario 8867?",
      options: ["Deducción Estándar, AMT, Ganancias de Capital, Seguro Social", "EITC, CTC, AOTC y Cabeza de Familia", "Interés Hipotecario, Caridad, Impuestos Estatales, Médicos", "Autoempleo, Ingresos de Alquiler, Dividendos, Intereses"],
      correct: 1,
      explanation: "Los cuatro créditos/estatus que requieren debida diligencia son: EITC (Crédito por Ingreso del Trabajo), CTC (Crédito por Hijos), AOTC (Crédito de Oportunidad Americana) y estatus Cabeza de Familia. El Formulario 8867 debe completarse para cada declaración aplicable y los registros deben conservarse 3 años.",
    },
  },
  {
    en: {
      question: "How much can Sandra expect to earn preparing 75 returns at the average fee?",
      options: ["$7,500", "$12,500", "$18,750", "$25,000"],
      correct: 2,
      explanation: "At $250/return average, 75 returns would generate approximately $18,750 in revenue for Sandra's first season. This is a realistic target for a part-time solo preparer in their first year.",
    },
    es: {
      question: "¿Cuánto puede esperar ganar Sandra preparando 75 declaraciones a la tarifa promedio?",
      options: ["$7,500", "$12,500", "$18,750", "$25,000"],
      correct: 2,
      explanation: "A $250/declaración promedio, 75 declaraciones generarían aproximadamente $18,750 en ingresos para la primera temporada de Sandra. Este es un objetivo realista para un preparador individual a tiempo parcial en su primer año.",
    },
  },
  {
    en: {
      question: "What credential should Sandra pursue after her first season for unlimited IRS representation?",
      options: ["CPA (Certified Public Accountant)", "Enrolled Agent (EA)", "Certified Financial Planner", "AFSP Advanced Level"],
      correct: 1,
      explanation: "Sandra should consider the Enrolled Agent (EA) designation after her first season. The EA requires passing a three-part SEE exam ($801 total) but has no education prerequisites. EAs have unlimited representation rights before the IRS for all matters and all clients.",
    },
    es: {
      question: "¿Qué credencial debería buscar Sandra después de su primera temporada para representación ilimitada ante el IRS?",
      options: ["CPA (Contador Público Certificado)", "Agente Inscrito (EA)", "Planificador Financiero Certificado", "Nivel Avanzado de AFSP"],
      correct: 1,
      explanation: "Sandra debería considerar la designación de Agente Inscrito (EA) después de su primera temporada. El EA requiere aprobar un examen SEE de tres partes ($801 total) pero no tiene requisitos de educación previa. Los EAs tienen derechos de representación ilimitados ante el IRS para todos los asuntos y clientes.",
    },
  },
];
