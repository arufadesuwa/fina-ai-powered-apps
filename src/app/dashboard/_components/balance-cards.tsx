import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { convertToIDR } from "@/lib/utils";
import { TrendingDownIcon, TrendingUpIcon, WalletIcon } from "lucide-react";

export function BalanceCards({
  data,
  error,
}: {
  data:
    { savings: number; totalIncome: number; totalExpense: number } | undefined;
  error: unknown;
}) {
  if (error) {
    return (
      <div className="w-full p-4 border border-destructive/50 text-destructive rounded-[24px] bg-destructive/10 text-sm">
        Failed to get Balance (｡•́︿•̀｡)
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {/* Signature Soft Green Feature Card for Savings */}
      <div className="rounded-[24px] bg-primary-pale text-ink p-6 flex flex-col justify-between gap-4 ring-1 ring-black/[0.03]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <WalletIcon className="size-4.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-ink-deep">
              Total Savings
            </span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-positive-deep">
            All time
          </span>
        </div>
        <div>
          <div className="text-2xl lg:text-4xl font-black tracking-tight text-ink mt-1">
            {convertToIDR(Number(data?.savings || 0))}
          </div>
          <p className="text-xs font-medium text-body mt-2">
            Net balance across all registered channels
          </p>
        </div>
      </div>

      {/* Pure White Card for Income */}
      <div className="rounded-[24px] bg-card text-foreground p-6 flex flex-col justify-between gap-4 ring-1 ring-black/[0.03] dark:ring-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-secondary flex items-center justify-center text-positive-deep">
              <TrendingUpIcon className="size-4.5 text-positive" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Income
            </span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary-pale text-positive-deep">
            + Inflow
          </span>
        </div>
        <div>
          <div className="text-2xl lg:text-4xl font-black tracking-tight text-foreground mt-1">
            {convertToIDR(Number(data?.totalIncome || 0))}
          </div>
          <p className="text-xs font-medium text-muted-foreground mt-2">
            Accumulated income received
          </p>
        </div>
      </div>

      {/* Pure White Card for Expense */}
      <div className="rounded-[24px] bg-card text-foreground p-6 flex flex-col justify-between gap-4 ring-1 ring-black/[0.03] dark:ring-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-secondary flex items-center justify-center text-destructive">
              <TrendingDownIcon className="size-4.5 text-destructive" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Expense
            </span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#fde8e8] text-destructive">
            - Outflow
          </span>
        </div>
        <div>
          <div className="text-2xl lg:text-4xl font-black tracking-tight text-foreground mt-1">
            {convertToIDR(Number(data?.totalExpense || 0))}
          </div>
          <p className="text-xs font-medium text-muted-foreground mt-2">
            Accumulated outgoing spending
          </p>
        </div>
      </div>
    </div>
  );
}
