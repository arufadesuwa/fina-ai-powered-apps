import { Metadata } from "next";
import { BalanceCards } from "./_components/balance-cards";
import DashboardContent from "./_components/DashboardContent";

export const metadata: Metadata = {
  title: "Fina - Dashboard",
  description: "Your personal financial dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section id="header" className="space-y-1">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
          Dashboard
        </h1>
        <p className="text-body text-base lg:text-lg">
          Get insights into your spending, track your expenses, and command your finances with AI.
        </p>
      </section>
      <DashboardContent />
    </div>
  );
}
