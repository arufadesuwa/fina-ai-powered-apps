import { Button } from "@/components/ui/button";
import { WalletMinimal } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Fina',
    description: 'Your personal finance app powered by AI'
}

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <WalletMinimal className="text-primary size-20" />
      <h1 className="text-4xl font-bold text-primary">Welcome to Fina!</h1>
      <p className="mt-2 text-lg">Your personal finance app powered by AI</p>
      <Link href='/dashboard'>
        <Button className="mt-2 size-lg">Get Started</Button>
      </Link>
    </main>
  );
}
