import type { Metadata } from "next";
import GeorgiaTaxCalculator from "../components/GeorgiaTaxCalculator";

export const metadata: Metadata = {
  title: "Georgia Form 500 Tax Calculator | TY2025",
  description:
    "Step-by-step Georgia income tax calculator for full-year residents. Calculate your Form 500 tax liability or refund for Tax Year 2025.",
};

export default function TaxCalculatorPage() {
  return <GeorgiaTaxCalculator />;
}
