import { Metadata } from "next"
import Transaction from "./_components/transaction"

export const metadata: Metadata = {
    title: 'Fina - Transaction',
    description: 'View and manage your financial transactions'
}

export default function TransactionPage() {
    return (
        <div className="space-y-6">
            <section id='header' className="space-y-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">Transactions</h1>
                <p className="text-body text-base lg:text-lg">View, filter, and record your transactions with instant precision.</p>
            </section>
            <section id='content'>
                <Transaction />
            </section>
        </div>
    )
}