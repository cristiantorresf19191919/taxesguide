import type { QuizQuestion } from "@/app/components/AnalysisQuiz";

/**
 * Claude analysis page quiz — 15 unique questions focused on:
 * Georgia-specific regulations (§ 48-2-62), three federal credentials in detail,
 * PTIN-only vs. AFSP representation, VITA/AFSP exemption, EA career path,
 * Georgia sales tax exemption, third-party filer, DBA process, occupation tax examples,
 * due diligence penalties, WISP daily penalties, recommended learning timeline
 */
export const claudeQuestions: QuizQuestion[] = [
  {
    en: {
      question: "What penalty does Georgia Code § 48-2-62 impose for fraudulently endorsing a client's refund check?",
      options: ["$100 per check", "$250 per check", "$500 per check", "$1,000 per check"],
      correct: 2,
      explanation: "Georgia Code § 48-2-62 imposes a $500 penalty per check for fraudulently endorsing refund checks. The state can also seek injunctions barring dishonest preparers from practicing. There is no state-mandated bonding or insurance requirement, though both are strongly recommended.",
    },
    es: {
      question: "¿Qué multa impone el Código de Georgia § 48-2-62 por endosar fraudulentamente el cheque de reembolso de un cliente?",
      options: ["$100 por cheque", "$250 por cheque", "$500 por cheque", "$1,000 por cheque"],
      correct: 2,
      explanation: "El Código de Georgia § 48-2-62 impone una multa de $500 por cheque por endosar fraudulentamente cheques de reembolso. El estado también puede solicitar órdenes judiciales contra preparadores deshonestos. No hay requisito estatal de fianza o seguro, aunque ambos se recomiendan encarecidamente.",
    },
  },
  {
    en: {
      question: "What representation rights does a PTIN-only holder have vs. an AFSP holder?",
      options: ["Both have full representation rights", "PTIN-only has limited rights; AFSP has unlimited rights", "PTIN-only has zero rights; AFSP has limited rights for returns they prepared", "Neither has any representation rights"],
      correct: 2,
      explanation: "A PTIN-only holder has zero representation rights and is not listed in the IRS public directory. An AFSP holder has limited representation rights — they can represent clients for returns they prepared before IRS revenue agents and customer service, and they appear in the IRS directory.",
    },
    es: {
      question: "¿Qué derechos de representación tiene un titular solo de PTIN vs. un titular de AFSP?",
      options: ["Ambos tienen derechos de representación completos", "Solo PTIN tiene derechos limitados; AFSP tiene derechos ilimitados", "Solo PTIN tiene cero derechos; AFSP tiene derechos limitados para declaraciones que preparó", "Ninguno tiene derechos de representación"],
      correct: 2,
      explanation: "Un titular solo de PTIN tiene cero derechos de representación y no aparece en el directorio público del IRS. Un titular de AFSP tiene derechos de representación limitados — puede representar clientes por declaraciones que preparó ante agentes del IRS y servicio al contribuyente, y aparece en el directorio del IRS.",
    },
  },
  {
    en: {
      question: "What special benefit do VITA volunteers with a PTIN get when completing AFSP?",
      options: ["Free PTIN renewal for life", "Exemption from the AFTR course requirement", "Automatic Enrolled Agent status", "50% discount on tax software"],
      correct: 1,
      explanation: "VITA volunteers with a PTIN who pass the advanced exam are exempt from the AFTR (Annual Federal Tax Refresher) course when completing AFSP. This saves both time and money, making VITA an excellent strategic choice for new preparers.",
    },
    es: {
      question: "¿Qué beneficio especial obtienen los voluntarios de VITA con PTIN al completar el AFSP?",
      options: ["Renovación gratuita del PTIN de por vida", "Exención del requisito del curso AFTR", "Estatus automático de Agente Inscrito", "50% de descuento en software de impuestos"],
      correct: 1,
      explanation: "Los voluntarios de VITA con PTIN que aprueban el examen avanzado están exentos del curso AFTR (Repaso Federal Anual de Impuestos) al completar el AFSP. Esto ahorra tiempo y dinero, haciendo de VITA una excelente opción estratégica para preparadores nuevos.",
    },
  },
  {
    en: {
      question: "How much does the three-part SEE exam cost in total to become an Enrolled Agent?",
      options: ["$267 (one part only)", "$534 (two parts)", "$801 (three parts at $267 each)", "$1,200 (three parts at $400 each)"],
      correct: 2,
      explanation: "The EA designation requires passing a three-part SEE (Special Enrollment Examination) at $267 per part, totaling $801. Importantly, it has no education prerequisites — anyone with a PTIN can sit for it. EAs have unlimited representation rights before the IRS for all matters and all clients.",
    },
    es: {
      question: "¿Cuánto cuesta en total el examen SEE de tres partes para ser Agente Inscrito?",
      options: ["$267 (una sola parte)", "$534 (dos partes)", "$801 (tres partes a $267 cada una)", "$1,200 (tres partes a $400 cada una)"],
      correct: 2,
      explanation: "La designación de EA requiere aprobar un examen SEE (Examen Especial de Inscripción) de tres partes a $267 por parte, totalizando $801. Importante: no tiene requisitos de educación previa — cualquier persona con PTIN puede presentarlo. Los EAs tienen derechos de representación ilimitados ante el IRS.",
    },
  },
  {
    en: {
      question: "What is the AFTR comprehension test format within the AFSP program?",
      options: ["50 questions, 60% to pass", "75 questions, 75% to pass", "100 questions, 70% to pass", "200 questions, 80% to pass"],
      correct: 2,
      explanation: "The AFTR (Annual Federal Tax Refresher) includes a comprehension test with 100 questions requiring 70% to pass. It is a 6-hour course that is part of the 18 total hours of CE required for AFSP (plus 10 hours federal tax law and 2 hours ethics).",
    },
    es: {
      question: "¿Cuál es el formato de la prueba de comprensión AFTR dentro del programa AFSP?",
      options: ["50 preguntas, 60% para aprobar", "75 preguntas, 75% para aprobar", "100 preguntas, 70% para aprobar", "200 preguntas, 80% para aprobar"],
      correct: 2,
      explanation: "El AFTR (Repaso Federal Anual de Impuestos) incluye una prueba de comprensión con 100 preguntas que requiere 70% para aprobar. Es un curso de 6 horas que forma parte de las 18 horas totales de CE requeridas para el AFSP (más 10 horas de ley tributaria federal y 2 horas de ética).",
    },
  },
  {
    en: {
      question: "Are tax preparation services subject to Georgia sales tax?",
      options: ["Yes, at the standard state rate", "Yes, but at a reduced rate", "No, they are fully exempt", "Only if the preparer earns over $50,000"],
      correct: 2,
      explanation: "Tax preparation services are not subject to Georgia sales tax. This is an important advantage that simplifies pricing and reduces the compliance burden for new preparers in Georgia.",
    },
    es: {
      question: "¿Los servicios de preparación de impuestos están sujetos al impuesto de ventas de Georgia?",
      options: ["Sí, a la tasa estatal estándar", "Sí, pero a una tasa reducida", "No, están completamente exentos", "Solo si el preparador gana más de $50,000"],
      correct: 2,
      explanation: "Los servicios de preparación de impuestos no están sujetos al impuesto de ventas de Georgia. Esta es una ventaja importante que simplifica los precios y reduce la carga de cumplimiento para preparadores nuevos en Georgia.",
    },
  },
  {
    en: {
      question: "What is the LLC annual renewal fee in Georgia and when is it due?",
      options: ["$25, due January 1", "$50, due April 1 (with $25 late fee)", "$100, due December 31", "$150, due June 30"],
      correct: 1,
      explanation: "The Georgia LLC annual renewal costs $50 and is due April 1 each year. There is a $25 late fee if filed after the deadline. The initial LLC formation costs $100, and the name must include 'LLC' or 'Limited Liability Company.'",
    },
    es: {
      question: "¿Cuál es la tarifa de renovación anual de LLC en Georgia y cuándo vence?",
      options: ["$25, vence el 1 de enero", "$50, vence el 1 de abril (con $25 de recargo)", "$100, vence el 31 de diciembre", "$150, vence el 30 de junio"],
      correct: 1,
      explanation: "La renovación anual de LLC en Georgia cuesta $50 y vence el 1 de abril de cada año. Hay un recargo de $25 si se presenta después de la fecha límite. La formación inicial de LLC cuesta $100, y el nombre debe incluir 'LLC' o 'Limited Liability Company.'",
    },
  },
  {
    en: {
      question: "How much does a DBA filing cost in Georgia and where is it filed?",
      options: ["Free at the Secretary of State", "~$160 at the Clerk of Superior Court plus $40–$60 newspaper publication", "$500 at the Georgia DOR", "$50 online through the GTC"],
      correct: 1,
      explanation: "A DBA (Doing Business As) in Georgia costs approximately $160 filed with the Clerk of Superior Court, plus $40–$60 for required newspaper publication. A DBA is needed only if operating under a trade name different from the legal business name.",
    },
    es: {
      question: "¿Cuánto cuesta un registro de DBA en Georgia y dónde se presenta?",
      options: ["Gratis en el Secretario de Estado", "~$160 en el Clerk of Superior Court más $40–$60 de publicación en periódico", "$500 en el DOR de Georgia", "$50 en línea a través del GTC"],
      correct: 1,
      explanation: "Un DBA (Doing Business As) en Georgia cuesta aproximadamente $160 presentado ante el Clerk of Superior Court, más $40–$60 por publicación requerida en periódico. El DBA solo es necesario si operas bajo un nombre comercial diferente al nombre legal del negocio.",
    },
  },
  {
    en: {
      question: "What happens when Sandra registers through the Georgia Tax Center — how quickly does she get her state tax ID?",
      options: ["2–4 weeks by mail", "Within ~15 minutes by email", "3–5 business days", "Immediately at a physical office only"],
      correct: 1,
      explanation: "Registration through the Georgia Tax Center (gtc.dor.ga.gov) is free, and Sandra receives her state tax ID by email within approximately 15 minutes. She must also register as a third-party filer if she will e-file state returns for clients.",
    },
    es: {
      question: "¿Qué pasa cuando Sandra se registra en el Georgia Tax Center — qué tan rápido obtiene su ID fiscal estatal?",
      options: ["2–4 semanas por correo postal", "En ~15 minutos por correo electrónico", "3–5 días hábiles", "Inmediatamente solo en oficina física"],
      correct: 1,
      explanation: "El registro a través del Georgia Tax Center (gtc.dor.ga.gov) es gratuito y Sandra recibe su ID fiscal estatal por correo electrónico en aproximadamente 15 minutos. También debe registrarse como presentadora de terceros si va a hacer e-file de declaraciones estatales para clientes.",
    },
  },
  {
    en: {
      question: "What is the maximum daily penalty per violation for failing to comply with the WISP under the FTC Safeguards Rule?",
      options: ["$1,000", "$10,000", "$46,517", "$100,000"],
      correct: 2,
      explanation: "Penalties for WISP/FTC Safeguards Rule non-compliance can reach up to $46,517 per violation per day. Since 2023, preparers must certify WISP compliance when renewing their PTIN. The WISP must be created before preparing a single return.",
    },
    es: {
      question: "¿Cuál es la multa máxima diaria por violación por no cumplir con el WISP bajo la Regla de Salvaguardas de la FTC?",
      options: ["$1,000", "$10,000", "$46,517", "$100,000"],
      correct: 2,
      explanation: "Las multas por incumplimiento de la Regla de Salvaguardas WISP/FTC pueden alcanzar hasta $46,517 por violación por día. Desde 2023, los preparadores deben certificar cumplimiento del WISP al renovar su PTIN. El WISP debe crearse antes de preparar una sola declaración.",
    },
  },
  {
    en: {
      question: "How much is the due diligence penalty for a single return claiming EITC, CTC, AOTC, and Head of Household with inadequate documentation?",
      options: ["$650 total", "$1,300 total", "$2,600 total ($650 × 4 credits/statuses)", "$5,000 total"],
      correct: 2,
      explanation: "The penalty is $650 per credit per return (2026). A single return claiming all four credits/statuses (EITC, CTC, AOTC, Head of Household) with inadequate documentation results in $2,600 in penalties ($650 × 4). Preparers must complete Form 8867 and retain records for 3 years.",
    },
    es: {
      question: "¿Cuánto es la multa de debida diligencia por una sola declaración que reclama EITC, CTC, AOTC y Cabeza de Familia sin documentación adecuada?",
      options: ["$650 total", "$1,300 total", "$2,600 total ($650 × 4 créditos/estatus)", "$5,000 total"],
      correct: 2,
      explanation: "La multa es de $650 por crédito por declaración (2026). Una sola declaración reclamando los cuatro créditos/estatus (EITC, CTC, AOTC, Cabeza de Familia) sin documentación adecuada resulta en $2,600 en multas ($650 × 4). Los preparadores deben completar el Formulario 8867 y conservar registros por 3 años.",
    },
  },
  {
    en: {
      question: "During which months should Sandra complete training, AFSP, and EFIN application according to Claude's timeline?",
      options: ["January–March", "April–June", "June–August", "October–December"],
      correct: 3,
      explanation: "According to Claude's recommended timeline: October is for applying for EFIN (45-day processing) and registering the LLC; November for completing training and setting up the business; December for completing AFSP (18 hrs CE by Dec 31), renewing PTIN, and launching marketing.",
    },
    es: {
      question: "¿Durante qué meses debería Sandra completar su formación, AFSP y solicitud de EFIN según el cronograma de Claude?",
      options: ["Enero–Marzo", "Abril–Junio", "Junio–Agosto", "Octubre–Diciembre"],
      correct: 3,
      explanation: "Según el cronograma recomendado de Claude: octubre es para solicitar EFIN (45 días de procesamiento) y registrar la LLC; noviembre para completar formación y preparar el negocio; diciembre para completar AFSP (18 hrs CE antes del 31 dic), renovar PTIN y lanzar marketing.",
    },
  },
  {
    en: {
      question: "Which professional associations does Claude recommend Sandra join for education and fee studies?",
      options: ["American Bar Association and AICPA", "NATP (National Association of Tax Professionals) and NSA (National Society of Accountants)", "IRS Stakeholder Liaison and State Bar", "BNI and local Chamber of Commerce"],
      correct: 1,
      explanation: "Claude recommends joining NATP (National Association of Tax Professionals — 23,000+ members) for education, fee studies, and insurance/CE discounts. NSA (National Society of Accountants) is another strong option. These organizations provide ongoing professional support.",
    },
    es: {
      question: "¿Qué asociaciones profesionales recomienda Claude que Sandra se una para educación y estudios de tarifas?",
      options: ["Colegio de Abogados y AICPA", "NATP (Asociación Nacional de Profesionales de Impuestos) y NSA (Sociedad Nacional de Contadores)", "Enlace del IRS y Colegio Estatal", "BNI y Cámara de Comercio local"],
      correct: 1,
      explanation: "Claude recomienda unirse a NATP (Asociación Nacional de Profesionales de Impuestos — 23,000+ miembros) para educación, estudios de tarifas y descuentos en seguros/CE. NSA (Sociedad Nacional de Contadores) es otra excelente opción. Estas organizaciones proporcionan apoyo profesional continuo.",
    },
  },
  {
    en: {
      question: "What is the recommended first-year budget range according to Claude's analysis?",
      options: ["$500–$1,000", "$1,000–$2,000", "$3,000–$5,000", "$10,000–$15,000"],
      correct: 2,
      explanation: "Claude recommends a realistic first-year budget of $3,000–$5,000, covering essentials plus adequate software and marketing. The bare minimum is $1,800–$2,500, while a well-equipped start runs $6,500–$7,500.",
    },
    es: {
      question: "¿Cuál es el rango de presupuesto recomendado para el primer año según el análisis de Claude?",
      options: ["$500–$1,000", "$1,000–$2,000", "$3,000–$5,000", "$10,000–$15,000"],
      correct: 2,
      explanation: "Claude recomienda un presupuesto realista para el primer año de $3,000–$5,000, cubriendo lo esencial más software y marketing adecuados. El mínimo absoluto es $1,800–$2,500, mientras que un inicio bien equipado cuesta $6,500–$7,500.",
    },
  },
  {
    en: {
      question: "What credential does Claude recommend Sandra pursue after her first season for unlimited IRS representation?",
      options: ["CPA license", "Enrolled Agent (EA) via the SEE exam", "AFSP Advanced Level", "State tax preparer license"],
      correct: 1,
      explanation: "Claude recommends Sandra pursue the Enrolled Agent (EA) designation after her first season. EAs have unlimited representation rights before the IRS for all matters and all clients. The SEE exam has no education prerequisites — anyone with a PTIN can sit for it.",
    },
    es: {
      question: "¿Qué credencial recomienda Claude que Sandra busque después de su primera temporada para representación ilimitada ante el IRS?",
      options: ["Licencia de CPA", "Agente Inscrito (EA) vía el examen SEE", "Nivel Avanzado del AFSP", "Licencia estatal de preparador de impuestos"],
      correct: 1,
      explanation: "Claude recomienda que Sandra busque la designación de Agente Inscrito (EA) después de su primera temporada. Los EAs tienen derechos de representación ilimitados ante el IRS para todos los asuntos y clientes. El examen SEE no tiene requisitos de educación previa — cualquier persona con PTIN puede presentarlo.",
    },
  },
];
