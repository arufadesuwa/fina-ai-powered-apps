import { Button } from "@/components/ui/button";
import { WalletMinimal } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <WalletMinimal className="text-emerald-700 size-20" />
      <h1 className="text-4xl font-bold text-emerald-700">Welcome to Fina!</h1>
      <p className="mt-2 text-lg">Your personal finance app powered by AI</p>
      <Link href='/dashboard'>
        <Button className="mt-2 size-lg">Get Started</Button>
      </Link>
    </main>
  );
}
