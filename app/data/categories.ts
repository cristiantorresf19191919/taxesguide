export type CategoryDef = {
  id: string;
  labelEn: string;
  labelEs: string;
  icon: string;
  color: string;
  terms: string[];
};

export const CATEGORIES: CategoryDef[] = [
  {
    id: "credentials",
    labelEn: "IRS Credentials",
    labelEs: "Credenciales del IRS",
    icon: "🪪",
    color: "#8b5cf6",
    terms: ["ptin", "efin", "afsp", "aftr", "ce", "enrolled-agent", "cpa", "see", "ero", "circular-230", "representation-rights"],
  },
  {
    id: "forms",
    labelEn: "Tax Forms",
    labelEs: "Formularios fiscales",
    icon: "📄",
    color: "#3b82f6",
    terms: ["w-2", "1099", "1040", "w-4", "w-12", "form-8867", "schedule-c", "schedule-e", "form-500"],
  },
  {
    id: "credits",
    labelEn: "Credits & Deductions",
    labelEs: "Créditos y deducciones",
    icon: "💰",
    color: "#10b981",
    terms: ["eitc", "ctc", "aotc", "agi", "deduction", "tax-credit", "refundable-credit", "itemized-deductions", "withholding", "gross-receipts"],
  },
  {
    id: "compliance",
    labelEn: "Compliance & Security",
    labelEs: "Cumplimiento y seguridad",
    icon: "🛡️",
    color: "#f59e0b",
    terms: ["wisp", "mfa", "vpn", "eando", "due-diligence", "security-six", "ftc-safeguards-rule", "id-me"],
  },
  {
    id: "business",
    labelEn: "Business Setup",
    labelEs: "Montaje del negocio",
    icon: "🏢",
    color: "#ec4899",
    terms: ["llc", "dba", "sole-proprietorship", "occupational-tax-certificate", "third-party-filer", "e-file", "ein", "pass-through"],
  },
  {
    id: "identity",
    labelEn: "IDs & Filing Status",
    labelEs: "IDs y estado civil",
    icon: "👤",
    color: "#06b6d4",
    terms: ["ssn", "itin", "hoh", "mfj", "dor", "gtc"],
  },
  {
    id: "education",
    labelEn: "Education & Orgs",
    labelEs: "Educación y organizaciones",
    icon: "🎓",
    color: "#a855f7",
    terms: ["vita", "nasba", "ctec", "natp", "nsa"],
  },
];

export function getCategoryForTerm(termId: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.terms.includes(termId));
}
