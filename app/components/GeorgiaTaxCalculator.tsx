"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */
type FilingStatus = "SINGLE" | "MFJ" | "MFS" | "HOH";
type IncomeType = "W2" | "1099_SELF_EMPLOYED" | "BOTH";

interface TaxData {
  // Step 1
  filingStatus: FilingStatus | null;
  // Step 2
  isGAResident: boolean | null;
  // Step 3
  dob: string;
  spouseDob: string;
  numDependents: number;
  dependentAges: number[];
  isDisabled: boolean;
  // Step 4
  incomeType: IncomeType | null;
  // Step 5
  federalAGI: number;
  w2GAWithholding: number;
  scheduleCNetProfit: number;
  estimatedPayments: number;
  withholding1099: number;
  // Step 6
  retirementIncome: number;
  spouseRetirementIncome: number;
  socialSecurity: number;
  bondInterest: number;
  bonusDepreciation: number;
  educatorExpense: boolean;
  path2College529: number;
  otherStateRefunds: number;
  militaryRetirement: number;
  gaEarnedIncome: number;
  // Step 7
  childCareExpenses: number;
  federalChildCareCredit: number;
  caregivingExpenses: number;
}

interface CalcResult {
  federalAGI: number;
  additions: number;
  subtractions: number;
  georgiaAGI: number;
  standardDeduction: number;
  dependentExemption: number;
  taxableNetIncome: number;
  grossTax: number;
  totalCredits: number;
  netTax: number;
  totalPayments: number;
  balance: number;
  retirementExclusion: number;
  spouseRetirementExclusion: number;
  militaryExclusion: number;
  childCareCredit: number;
  caregivingCredit: number;
}

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════ */
const TAX_RATE = 0.0519;
const TAX_YEAR = 2025;

const STANDARD_DEDUCTIONS: Record<FilingStatus, number> = {
  SINGLE: 12000,
  MFJ: 24000,
  MFS: 12000,
  HOH: 12000,
};

const FILING_STATUS_LABELS: Record<FilingStatus, { label: string; icon: string; desc: string }> = {
  SINGLE: { label: "Single", icon: "👤", desc: "Unmarried or legally separated" },
  MFJ: { label: "Married Filing Jointly", icon: "👫", desc: "Married couple filing together" },
  MFS: { label: "Married Filing Separately", icon: "↔️", desc: "Married but filing individually" },
  HOH: { label: "Head of Household", icon: "🏠", desc: "Unmarried with qualifying dependent" },
};

const STEP_LABELS = [
  "Filing Status",
  "Residency",
  "Personal Info",
  "Income Type",
  "Income Details",
  "GA Adjustments",
  "Credits",
  "Review & Results",
];

const STEP_ICONS = ["📋", "🏡", "👤", "💼", "💰", "📊", "🎯", "✅"];

const defaultData: TaxData = {
  filingStatus: null,
  isGAResident: null,
  dob: "",
  spouseDob: "",
  numDependents: 0,
  dependentAges: [],
  isDisabled: false,
  incomeType: null,
  federalAGI: 0,
  w2GAWithholding: 0,
  scheduleCNetProfit: 0,
  estimatedPayments: 0,
  withholding1099: 0,
  retirementIncome: 0,
  spouseRetirementIncome: 0,
  socialSecurity: 0,
  bondInterest: 0,
  bonusDepreciation: 0,
  educatorExpense: false,
  path2College529: 0,
  otherStateRefunds: 0,
  militaryRetirement: 0,
  gaEarnedIncome: 0,
  childCareExpenses: 0,
  federalChildCareCredit: 0,
  caregivingExpenses: 0,
};

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
function getAge(dob: string): number {
  if (!dob) return 0;
  const birth = new Date(dob);
  const endOfYear = new Date(TAX_YEAR, 11, 31);
  let age = endOfYear.getFullYear() - birth.getFullYear();
  const m = endOfYear.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && endOfYear.getDate() < birth.getDate())) age--;
  return age;
}

function retirementExclusion(age: number, isDisabled: boolean, retirementIncome: number): number {
  let max = 0;
  if (age >= 65) max = 65000;
  else if (age >= 62 || isDisabled) max = 35000;
  return Math.min(retirementIncome, max);
}

function militaryExclusion(age: number, milRetirement: number, gaEarned: number): number {
  if (age >= 62) return 0;
  const base = Math.min(milRetirement, 17500);
  let additional = 0;
  if (gaEarned > 17500) {
    additional = Math.min(milRetirement - base, 17500);
  }
  return base + additional;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
const CurrencyInput = memo(function CurrencyInput({
  label,
  value,
  onChange,
  hint,
  id,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
  id: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">$</span>
        <input
          id={id}
          type="number"
          min={0}
          step={0.01}
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-7 pr-4 text-sm transition-all
            focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none
            dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-emerald-400/60"
          placeholder="0.00"
        />
      </div>
      {hint && <p className="text-xs text-gray-400 dark:text-gray-500">{hint}</p>}
    </div>
  );
});

const Toggle = memo(function Toggle({
  label,
  checked,
  onChange,
  desc,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  desc?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
        checked
          ? "border-emerald-400 bg-emerald-50 dark:border-emerald-400/40 dark:bg-emerald-400/10"
          : "border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
      }`}
    >
      <div>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</span>
        {desc && <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{desc}</p>}
      </div>
      <div
        className={`flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <motion.div
          className="h-5 w-5 rounded-full bg-white shadow-sm"
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
});

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function GeorgiaTaxCalculator() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<TaxData>({ ...defaultData });
  const [direction, setDirection] = useState(1);

  const update = useCallback(<K extends keyof TaxData>(key: K, value: TaxData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const age = useMemo(() => getAge(data.dob), [data.dob]);
  const spouseAge = useMemo(() => getAge(data.spouseDob), [data.spouseDob]);

  /* ── Calculation Engine ── */
  const result: CalcResult = useMemo(() => {
    if (!data.filingStatus) {
      return {
        federalAGI: 0, additions: 0, subtractions: 0, georgiaAGI: 0, standardDeduction: 0,
        dependentExemption: 0, taxableNetIncome: 0, grossTax: 0, totalCredits: 0, netTax: 0,
        totalPayments: 0, balance: 0, retirementExclusion: 0, spouseRetirementExclusion: 0,
        militaryExclusion: 0, childCareCredit: 0, caregivingCredit: 0,
      };
    }

    const retExcl = retirementExclusion(age, data.isDisabled, data.retirementIncome);
    const spouseRetExcl = data.filingStatus === "MFJ"
      ? retirementExclusion(spouseAge, false, data.spouseRetirementIncome)
      : 0;
    const milExcl = militaryExclusion(age, data.militaryRetirement, data.gaEarnedIncome);

    const additions =
      data.bondInterest +
      data.bonusDepreciation +
      (data.educatorExpense ? 250 : 0);

    const subtractions =
      retExcl +
      spouseRetExcl +
      milExcl +
      data.path2College529 +
      data.otherStateRefunds +
      data.socialSecurity;

    const georgiaAGI = data.federalAGI + additions - subtractions;
    const standardDeduction = STANDARD_DEDUCTIONS[data.filingStatus];
    const dependentExemption = data.numDependents * 4000;
    const taxableNetIncome = Math.max(0, georgiaAGI - standardDeduction - dependentExemption);
    const grossTax = Math.round(taxableNetIncome * TAX_RATE * 100) / 100;

    const childCareCredit = Math.round(data.federalChildCareCredit * 0.5 * 100) / 100;
    const caregivingCredit = Math.min(Math.round(data.caregivingExpenses * 0.1 * 100) / 100, 500);
    let totalCredits = childCareCredit + caregivingCredit;
    totalCredits = Math.min(totalCredits, grossTax);

    const netTax = grossTax - totalCredits;
    const totalPayments = data.w2GAWithholding + data.estimatedPayments + data.withholding1099;
    const balance = Math.round((netTax - totalPayments) * 100) / 100;

    return {
      federalAGI: data.federalAGI,
      additions,
      subtractions,
      georgiaAGI,
      standardDeduction,
      dependentExemption,
      taxableNetIncome,
      grossTax,
      totalCredits,
      netTax,
      totalPayments,
      balance,
      retirementExclusion: retExcl,
      spouseRetirementExclusion: spouseRetExcl,
      militaryExclusion: milExcl,
      childCareCredit,
      caregivingCredit,
    };
  }, [data, age, spouseAge]);

  /* ── Navigation ── */
  const totalSteps = STEP_LABELS.length;

  const canProceed = useMemo(() => {
    switch (step) {
      case 0: return data.filingStatus !== null;
      case 1: return data.isGAResident === true;
      case 2: return data.dob !== "";
      case 3: return data.incomeType !== null;
      case 4: return data.federalAGI !== 0;
      default: return true;
    }
  }, [step, data.filingStatus, data.isGAResident, data.dob, data.incomeType, data.federalAGI]);

  const goNext = useCallback(() => {
    if (step < totalSteps - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  }, [step, totalSteps]);

  const goPrev = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  const goToStep = useCallback((target: number) => {
    setDirection(target > step ? 1 : -1);
    setStep(target);
  }, [step]);

  /* ── Animation variants ── */
  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  /* ── Render Steps ── */
  const renderStep = () => {
    switch (step) {
      /* ── STEP 0: Filing Status ── */
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Your Filing Status</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose the filing status that matches your federal return (IRS Form 1040).
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(Object.keys(FILING_STATUS_LABELS) as FilingStatus[]).map((key) => {
                const { label, icon, desc } = FILING_STATUS_LABELS[key];
                const selected = data.filingStatus === key;
                return (
                  <motion.button
                    key={key}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => update("filingStatus", key)}
                    className={`relative flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                      selected
                        ? "border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-400/10 dark:border-emerald-400/50 dark:bg-emerald-400/10"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
                    }`}
                  >
                    {selected && (
                      <motion.div
                        layoutId="filing-check"
                        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white"
                        initial={false}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                    <span className="text-2xl">{icon}</span>
                    <span className="mt-2 font-semibold text-gray-900 dark:text-white">{label}</span>
                    <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{desc}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      /* ── STEP 1: Residency ── */
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Georgia Residency</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Were you a full-year Georgia resident for tax year {TAX_YEAR}?
            </p>
            <div className="grid grid-cols-2 gap-4">
              {([true, false] as const).map((val) => {
                const selected = data.isGAResident === val;
                return (
                  <motion.button
                    key={String(val)}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => update("isGAResident", val)}
                    className={`flex flex-col items-center rounded-2xl border p-8 transition-all ${
                      selected
                        ? val
                          ? "border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-400/10 dark:border-emerald-400/50 dark:bg-emerald-400/10"
                          : "border-red-400 bg-red-50 shadow-lg shadow-red-400/10 dark:border-red-400/50 dark:bg-red-400/10"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
                    }`}
                  >
                    <span className="text-4xl">{val ? "🍑" : "✈️"}</span>
                    <span className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
                      {val ? "Yes" : "No"}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            {data.isGAResident === false && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10"
              >
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  This calculator is designed for full-year Georgia residents only.
                  Part-year and non-resident filers require different treatment on Form 500.
                </p>
              </motion.div>
            )}
          </div>
        );

      /* ── STEP 2: Personal Info ── */
      case 2:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We need a few personal details to determine your deductions and exclusions.
            </p>

            {/* DOB */}
            <div className="space-y-1.5">
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                value={data.dob}
                onChange={(e) => update("dob", e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all
                  focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none
                  dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-emerald-400/60"
              />
              {data.dob && (
                <p className="text-xs text-gray-400">
                  Age as of 12/31/{TAX_YEAR}: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{age}</span>
                  {age >= 65 && " — Qualifies for $65,000 retirement exclusion"}
                  {age >= 62 && age < 65 && " — Qualifies for $35,000 retirement exclusion"}
                </p>
              )}
            </div>

            {/* Spouse DOB (MFJ) */}
            {data.filingStatus === "MFJ" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-1.5">
                <label htmlFor="spouse-dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Spouse&apos;s Date of Birth
                </label>
                <input
                  id="spouse-dob"
                  type="date"
                  value={data.spouseDob}
                  onChange={(e) => update("spouseDob", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all
                    focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none
                    dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-emerald-400/60"
                />
                {data.spouseDob && (
                  <p className="text-xs text-gray-400">
                    Spouse age as of 12/31/{TAX_YEAR}: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{spouseAge}</span>
                  </p>
                )}
              </motion.div>
            )}

            {/* Dependents */}
            <div className="space-y-1.5">
              <label htmlFor="deps" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Number of Qualifying Dependents
              </label>
              <input
                id="deps"
                type="number"
                min={0}
                max={20}
                value={data.numDependents || ""}
                onChange={(e) => {
                  const n = Math.max(0, Math.min(20, parseInt(e.target.value) || 0));
                  update("numDependents", n);
                  update("dependentAges", Array(n).fill(0));
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all
                  focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none
                  dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-emerald-400/60"
                placeholder="0"
              />
              {data.numDependents > 0 && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Dependent exemption: {fmt(data.numDependents * 4000)}
                </p>
              )}
            </div>

            {/* Dependent Ages */}
            {data.numDependents > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ages of Dependents
                </label>
                <div className="flex flex-wrap gap-2">
                  {data.dependentAges.map((a, i) => (
                    <input
                      key={i}
                      type="number"
                      min={0}
                      max={99}
                      value={a || ""}
                      onChange={(e) => {
                        const ages = [...data.dependentAges];
                        ages[i] = parseInt(e.target.value) || 0;
                        update("dependentAges", ages);
                      }}
                      className="w-16 rounded-lg border border-gray-200 bg-white px-2 py-2 text-center text-sm
                        focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none
                        dark:border-white/10 dark:bg-white/5 dark:text-white"
                      placeholder={`#${i + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Disability */}
            {age < 62 && data.dob && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Toggle
                  label="Permanently & totally disabled (per SSA)?"
                  desc="Qualifies for $35,000 retirement income exclusion"
                  checked={data.isDisabled}
                  onChange={(v) => update("isDisabled", v)}
                />
              </motion.div>
            )}
          </div>
        );

      /* ── STEP 3: Income Type ── */
      case 3: {
        const types: { key: IncomeType; label: string; icon: string; desc: string }[] = [
          { key: "W2", label: "W-2 Employee", icon: "🏢", desc: "Salary/wages from employer" },
          { key: "1099_SELF_EMPLOYED", label: "1099 Self-Employed", icon: "💻", desc: "Independent contractor / sole proprietor" },
          { key: "BOTH", label: "Both", icon: "🔄", desc: "W-2 income and self-employment" },
        ];
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Primary Income Type</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              How did you earn your income in {TAX_YEAR}?
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {types.map(({ key, label, icon, desc }) => {
                const selected = data.incomeType === key;
                return (
                  <motion.button
                    key={key}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => update("incomeType", key)}
                    className={`flex flex-col items-center rounded-2xl border p-6 text-center transition-all ${
                      selected
                        ? "border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-400/10 dark:border-emerald-400/50 dark:bg-emerald-400/10"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
                    }`}
                  >
                    <span className="text-3xl">{icon}</span>
                    <span className="mt-2 font-semibold text-gray-900 dark:text-white text-sm">{label}</span>
                    <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{desc}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      }

      /* ── STEP 4: Income Details ── */
      case 4: {
        const hasW2 = data.incomeType === "W2" || data.incomeType === "BOTH";
        const has1099 = data.incomeType === "1099_SELF_EMPLOYED" || data.incomeType === "BOTH";
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Income Details</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your income amounts from your federal return and source documents.
            </p>

            <CurrencyInput
              id="federal-agi"
              label="Federal Adjusted Gross Income (1040 Line 11)"
              value={data.federalAGI}
              onChange={(v) => update("federalAGI", v)}
              hint="This is the starting point for your Georgia calculation"
            />

            {hasW2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <CurrencyInput
                  id="w2-withholding"
                  label="Georgia Tax Withheld from W-2(s) (Box 17)"
                  value={data.w2GAWithholding}
                  onChange={(v) => update("w2GAWithholding", v)}
                  hint="Sum across all W-2s where Box 15 = GA"
                />
              </motion.div>
            )}

            {has1099 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <CurrencyInput
                  id="sched-c"
                  label="Schedule C Net Profit (Line 31) — Informational"
                  value={data.scheduleCNetProfit}
                  onChange={(v) => update("scheduleCNetProfit", v)}
                  hint="Already included in your Federal AGI — not double-counted"
                />
                <CurrencyInput
                  id="est-payments"
                  label="Estimated Tax Payments to Georgia (Form 500-ES)"
                  value={data.estimatedPayments}
                  onChange={(v) => update("estimatedPayments", v)}
                  hint="Sum of all quarterly payments made for TY2025"
                />
              </motion.div>
            )}

            <CurrencyInput
              id="withholding-1099"
              label="GA Withholding from 1099-G / 1099-MISC / 1099-NEC"
              value={data.withholding1099}
              onChange={(v) => update("withholding1099", v)}
              hint="State tax withheld from government or miscellaneous payments"
            />

            {/* Social Security */}
            <CurrencyInput
              id="ss-benefits"
              label="Taxable Social Security / Railroad Retirement Benefits"
              value={data.socialSecurity}
              onChange={(v) => update("socialSecurity", v)}
              hint="Federally taxable amount — Georgia fully exempts this"
            />

            {/* Retirement Income */}
            {(age >= 62 || data.isDisabled) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                  <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                    You qualify for the Georgia Retirement Income Exclusion (up to {age >= 65 ? "$65,000" : "$35,000"})
                  </p>
                </div>
                <CurrencyInput
                  id="retirement"
                  label="Retirement Income (pension, annuity, interest, dividends, etc.)"
                  value={data.retirementIncome}
                  onChange={(v) => update("retirementIncome", v)}
                  hint={`Max exclusion: ${age >= 65 ? "$65,000" : "$35,000"} — excludes Social Security`}
                />
              </motion.div>
            )}

            {data.filingStatus === "MFJ" && (spouseAge >= 62) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <CurrencyInput
                  id="spouse-retirement"
                  label="Spouse's Retirement Income"
                  value={data.spouseRetirementIncome}
                  onChange={(v) => update("spouseRetirementIncome", v)}
                  hint={`Spouse qualifies for up to ${spouseAge >= 65 ? "$65,000" : "$35,000"} exclusion`}
                />
              </motion.div>
            )}
          </div>
        );
      }

      /* ── STEP 5: GA Adjustments ── */
      case 5:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Georgia Schedule 1 Adjustments</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              These items adjust your Federal AGI to arrive at Georgia Adjusted Gross Income.
            </p>

            {/* Additions */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-red-100 text-xs dark:bg-red-500/20">+</span>
                Additions (Add-Backs)
              </h3>
              <CurrencyInput
                id="bond-interest"
                label="Interest from Non-Georgia State/Local Bonds"
                value={data.bondInterest}
                onChange={(v) => update("bondInterest", v)}
                hint="From brokerage 1099-INT — bonds issued by states other than GA"
              />
              <CurrencyInput
                id="bonus-depreciation"
                label="Bonus Depreciation / Section 179 Difference"
                value={data.bonusDepreciation}
                onChange={(v) => update("bonusDepreciation", v)}
                hint="Georgia requires 5-year spread for bonus depreciation"
              />
              <Toggle
                label="Claimed Federal Educator Expense Deduction ($250)?"
                desc="Georgia does not allow this deduction — $250 add-back"
                checked={data.educatorExpense}
                onChange={(v) => update("educatorExpense", v)}
              />
            </div>

            {/* Subtractions */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100 text-xs dark:bg-emerald-500/20">−</span>
                Subtractions
              </h3>

              {(age < 62 && !data.isDisabled) && (
                <>
                  <CurrencyInput
                    id="mil-retirement"
                    label="Military Retirement Income (under 62)"
                    value={data.militaryRetirement}
                    onChange={(v) => update("militaryRetirement", v)}
                    hint="Base exclusion: $17,500; additional $17,500 if GA earned income > $17,500"
                  />
                  {data.militaryRetirement > 0 && (
                    <CurrencyInput
                      id="ga-earned"
                      label="Georgia Earned Income"
                      value={data.gaEarnedIncome}
                      onChange={(v) => update("gaEarnedIncome", v)}
                      hint="Needed to determine additional military exclusion"
                    />
                  )}
                </>
              )}

              <CurrencyInput
                id="path2college"
                label="Path2College 529 Plan Contributions"
                value={data.path2College529}
                onChange={(v) => update("path2College529", v)}
                hint={`Max: ${data.filingStatus === "MFJ" ? "$16,000" : "$8,000"} per beneficiary — must be GA 529 plan`}
              />
              <CurrencyInput
                id="other-state-refunds"
                label="Other State Tax Refunds (included in Federal AGI)"
                value={data.otherStateRefunds}
                onChange={(v) => update("otherStateRefunds", v)}
                hint="Refunds from states OTHER than Georgia"
              />
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Additions</span>
                  <span className="font-medium text-red-600 dark:text-red-400">+{fmt(result.additions)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Subtractions</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">−{fmt(result.subtractions)}</span>
                </div>
                <div className="border-t border-gray-200 pt-1 dark:border-white/10">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-700 dark:text-gray-300">Georgia AGI</span>
                    <span className="text-gray-900 dark:text-white">{fmt(result.georgiaAGI)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      /* ── STEP 6: Credits ── */
      case 6:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Georgia Tax Credits</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Credits directly reduce your tax liability. Most Georgia credits are non-refundable.
            </p>

            {/* Child Care Credit */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03] space-y-3">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Child & Dependent Care Credit (Code 202)
              </h3>
              <p className="text-xs text-gray-400">Georgia allows 50% of your federal child care credit (IRS Form 2441)</p>
              <CurrencyInput
                id="fed-childcare-credit"
                label="Federal Child & Dependent Care Credit Amount"
                value={data.federalChildCareCredit}
                onChange={(v) => update("federalChildCareCredit", v)}
                hint="From IRS Form 2441 — Georgia credit = 50% of this amount"
              />
              {data.federalChildCareCredit > 0 && (
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  GA Credit: {fmt(data.federalChildCareCredit * 0.5)}
                </p>
              )}
            </div>

            {/* Caregiving Credit */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03] space-y-3">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Qualified Caregiving Credit (Code 204)
              </h3>
              <p className="text-xs text-gray-400">10% of qualifying expenses for a family member age 62+ or disabled. Max $500.</p>
              <CurrencyInput
                id="caregiving"
                label="Qualified Caregiving Expenses"
                value={data.caregivingExpenses}
                onChange={(v) => update("caregivingExpenses", v)}
                hint="Max credit: $500 (10% of up to $5,000 in expenses)"
              />
              {data.caregivingExpenses > 0 && (
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  GA Credit: {fmt(Math.min(data.caregivingExpenses * 0.1, 500))}
                </p>
              )}
            </div>

            {/* Credits Summary */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-emerald-700 dark:text-emerald-300">Total Credits</span>
                <span className="text-emerald-700 dark:text-emerald-300">{fmt(result.totalCredits)}</span>
              </div>
              {result.totalCredits > 0 && result.totalCredits === result.grossTax && (
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  Credits capped at gross tax liability ({fmt(result.grossTax)})
                </p>
              )}
            </div>
          </div>
        );

      /* ── STEP 7: Review & Results ── */
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review & Results</h2>

            {/* Result Banner */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`rounded-2xl p-6 text-center ${
                result.balance > 0
                  ? "bg-gradient-to-br from-amber-500 to-orange-500"
                  : result.balance < 0
                  ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                  : "bg-gradient-to-br from-gray-500 to-gray-600"
              }`}
            >
              <p className="text-sm font-medium text-white/80">
                {result.balance > 0 ? "Tax Due" : result.balance < 0 ? "Refund" : "No Tax Due"}
              </p>
              <motion.p
                className="mt-1 text-4xl font-bold text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {fmt(Math.abs(result.balance))}
              </motion.p>
              {result.balance > 0 && (
                <p className="mt-2 text-xs text-white/70">Due by April 15, 2026 — Pay via Georgia Tax Center (GTC)</p>
              )}
              {result.balance < 0 && (
                <p className="mt-2 text-xs text-white/70">Expected refund — Track at gtc.dor.ga.gov → &quot;Where&apos;s My Refund?&quot;</p>
              )}
            </motion.div>

            {/* Calculation Breakdown */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/[0.03] overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50 px-5 py-3 dark:border-white/5 dark:bg-white/[0.02]">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">
                  Georgia Form 500 — Tax Year {TAX_YEAR}
                </h3>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                {/* Step 1: Federal AGI */}
                <LineItem label="Federal Adjusted Gross Income (1040 Line 11)" value={result.federalAGI} bold />

                {/* Step 2: Adjustments */}
                <SectionHeader label="Schedule 1 — Adjustments" />
                {result.additions > 0 && (
                  <>
                    {data.bondInterest > 0 && <LineItem label="  Non-GA Bond Interest" value={data.bondInterest} plus />}
                    {data.bonusDepreciation > 0 && <LineItem label="  Bonus Depreciation Add-Back" value={data.bonusDepreciation} plus />}
                    {data.educatorExpense && <LineItem label="  Educator Expense Add-Back" value={250} plus />}
                    <LineItem label="Total Additions" value={result.additions} plus bold />
                  </>
                )}
                {result.subtractions > 0 && (
                  <>
                    {result.retirementExclusion > 0 && <LineItem label="  Retirement Income Exclusion" value={result.retirementExclusion} minus />}
                    {result.spouseRetirementExclusion > 0 && <LineItem label="  Spouse Retirement Exclusion" value={result.spouseRetirementExclusion} minus />}
                    {result.militaryExclusion > 0 && <LineItem label="  Military Retirement Exclusion" value={result.militaryExclusion} minus />}
                    {data.socialSecurity > 0 && <LineItem label="  Social Security Exemption" value={data.socialSecurity} minus />}
                    {data.path2College529 > 0 && <LineItem label="  Path2College 529 Deduction" value={data.path2College529} minus />}
                    {data.otherStateRefunds > 0 && <LineItem label="  Other State Refunds" value={data.otherStateRefunds} minus />}
                    <LineItem label="Total Subtractions" value={result.subtractions} minus bold />
                  </>
                )}
                <LineItem label="Georgia Adjusted Gross Income" value={result.georgiaAGI} bold highlight />

                {/* Step 3: Deductions */}
                <SectionHeader label="Deductions & Exemptions" />
                <LineItem label="  Standard Deduction" value={result.standardDeduction} minus />
                {result.dependentExemption > 0 && (
                  <LineItem label={`  Dependent Exemption (${data.numDependents} × $4,000)`} value={result.dependentExemption} minus />
                )}
                <LineItem label="Georgia Taxable Net Income" value={result.taxableNetIncome} bold highlight />

                {/* Step 4: Tax */}
                <SectionHeader label="Tax Computation" />
                <LineItem label={`  Taxable Income × ${(TAX_RATE * 100).toFixed(2)}%`} value={result.grossTax} />
                <LineItem label="Gross Georgia Tax Liability" value={result.grossTax} bold />

                {/* Step 5: Credits */}
                {result.totalCredits > 0 && (
                  <>
                    <SectionHeader label="Credits (Schedule 2)" />
                    {result.childCareCredit > 0 && <LineItem label="  Child & Dependent Care (50% federal)" value={result.childCareCredit} minus />}
                    {result.caregivingCredit > 0 && <LineItem label="  Qualified Caregiving Credit" value={result.caregivingCredit} minus />}
                    <LineItem label="Total Credits" value={result.totalCredits} minus bold />
                  </>
                )}
                <LineItem label="Net Georgia Tax" value={result.netTax} bold highlight />

                {/* Step 6: Payments */}
                <SectionHeader label="Payments & Withholding" />
                {data.w2GAWithholding > 0 && <LineItem label="  W-2 GA Withholding" value={data.w2GAWithholding} minus />}
                {data.estimatedPayments > 0 && <LineItem label="  Estimated Payments (500-ES)" value={data.estimatedPayments} minus />}
                {data.withholding1099 > 0 && <LineItem label="  1099 Withholding" value={data.withholding1099} minus />}
                {result.totalPayments > 0 && <LineItem label="Total Payments" value={result.totalPayments} minus bold />}

                {/* Final Result */}
                <div className={`px-5 py-4 ${
                  result.balance > 0
                    ? "bg-amber-50 dark:bg-amber-500/10"
                    : result.balance < 0
                    ? "bg-emerald-50 dark:bg-emerald-500/10"
                    : "bg-gray-50 dark:bg-white/[0.02]"
                }`}>
                  <div className="flex justify-between font-bold text-base">
                    <span className={
                      result.balance > 0
                        ? "text-amber-700 dark:text-amber-400"
                        : result.balance < 0
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-gray-700 dark:text-gray-300"
                    }>
                      {result.balance > 0 ? "TAX DUE" : result.balance < 0 ? "REFUND" : "NO TAX DUE"}
                    </span>
                    <span className={
                      result.balance > 0
                        ? "text-amber-700 dark:text-amber-400"
                        : result.balance < 0
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-gray-700 dark:text-gray-300"
                    }>
                      {fmt(Math.abs(result.balance))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filing Info */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Filing Status</p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {data.filingStatus ? FILING_STATUS_LABELS[data.filingStatus].label : "—"}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Tax Rate</p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">{(TAX_RATE * 100).toFixed(2)}% Flat</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Filing Deadline</p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">April 15, 2026</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Dependents</p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">{data.numDependents}</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.02]">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <strong>Disclaimer:</strong> This calculation is for estimation purposes only. It is not legal or tax advice.
                Always cross-reference the official Georgia IT-511 instruction booklet and consult a qualified tax professional
                before filing. Georgia DOR: <span className="text-emerald-600 dark:text-emerald-400">dor.georgia.gov</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-all
                  hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                Print Form
              </button>
              <button
                type="button"
                onClick={() => goToStep(0)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium
                  text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50
                  dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-white/20"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4v6h6M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
                </svg>
                Start Over
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[rgb(10,10,12)] dark:to-[rgb(14,14,18)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Tax Year {TAX_YEAR}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Georgia Form 500 Calculator
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Step-by-step Georgia income tax calculation for full-year residents
          </p>
        </motion.div>

        {/* Stepper */}
        <div className="mb-8">
          {/* Progress Bar */}
          <div className="relative mb-6">
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                initial={false}
                animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
              <span>Step {step + 1} of {totalSteps}</span>
              <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-none">
            {STEP_LABELS.map((label, i) => {
              const isCompleted = i < step;
              const isCurrent = i === step;
              const isClickable = i <= step;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => isClickable && goToStep(i)}
                  disabled={!isClickable}
                  className={`group flex flex-col items-center gap-1.5 transition-all ${
                    isClickable ? "cursor-pointer" : "cursor-default opacity-40"
                  }`}
                >
                  <motion.div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : isCompleted
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : "bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500"
                    }`}
                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {isCompleted ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{STEP_ICONS[i]}</span>
                    )}
                  </motion.div>
                  <span
                    className={`hidden text-[10px] font-medium sm:block ${
                      isCurrent
                        ? "text-emerald-600 dark:text-emerald-400"
                        : isCompleted
                        ? "text-gray-500 dark:text-gray-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8
                dark:border-white/[0.08] dark:bg-white/[0.025]"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        {step < totalSteps - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex items-center justify-between"
          >
            <button
              type="button"
              onClick={goPrev}
              disabled={step === 0}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all ${
                step === 0
                  ? "cursor-default text-gray-300 dark:text-gray-600"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all ${
                canProceed
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:shadow-emerald-500/30"
                  : "cursor-default bg-gray-200 text-gray-400 dark:bg-white/5 dark:text-gray-600"
              }`}
            >
              {step === totalSteps - 2 ? "Calculate" : "Continue"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HELPER RENDER COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
function SectionHeader({ label }: { label: string }) {
  return (
    <div className="bg-gray-50 px-5 py-2 dark:bg-white/[0.02]">
      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function LineItem({
  label,
  value,
  bold,
  plus,
  minus,
  highlight,
}: {
  label: string;
  value: number;
  bold?: boolean;
  plus?: boolean;
  minus?: boolean;
  highlight?: boolean;
}) {
  const sign = plus ? "+" : minus ? "−" : "";
  return (
    <div className={`flex items-center justify-between px-5 py-2.5 ${highlight ? "bg-indigo-50/50 dark:bg-indigo-500/5" : ""}`}>
      <span className={`text-gray-600 dark:text-gray-400 ${bold ? "font-semibold text-gray-800 dark:text-gray-200" : ""}`}>
        {label}
      </span>
      <span
        className={`tabular-nums ${
          bold ? "font-bold text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
        } ${plus ? "text-red-600 dark:text-red-400" : ""} ${minus ? "text-emerald-600 dark:text-emerald-400" : ""}`}
      >
        {sign}{fmt(value)}
      </span>
    </div>
  );
}
