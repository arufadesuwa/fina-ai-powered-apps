import { Button } from "@/components/ui/button";
import { WalletMinimal } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fina",
  description: "Your personal finance app powered by AI",
};

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background selection:bg-primary selection:text-primary-foreground">
      <div className="flex flex-col items-center text-center max-w-md w-full bg-card rounded-[24px] p-8 sm:p-12 ring-1 ring-black/[0.04] dark:ring-white/10 space-y-6">
        <div className="size-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
          <WalletMinimal className="size-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Welcome to Fina!
          </h1>
          <p className="text-body text-base">
            Your personal finance app powered by AI
          </p>
        </div>
        <Link href="/dashboard" className="w-full">
          <Button size="lg" className="w-full h-12 rounded-full font-bold text-base shadow-xs">
            Get Started
          </Button>
        </Link>
      </div>
    </main>
  );
}
