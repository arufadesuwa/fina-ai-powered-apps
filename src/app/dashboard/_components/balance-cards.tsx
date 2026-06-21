'use client'

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getBalanceSummary } from "@/features/action";
import { convertToIDR } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { TrendingDownIcon, TrendingUpIcon, WalletIcon } from "lucide-react";

export function BalanceCards() {
    const {data, error} = useQuery({
        queryKey: ['balance'],
        queryFn: () => getBalanceSummary(),
    })

    if (error){
        return(
            <div className="w-full p-4 border border-destructive/50 text-destructive rounded-lg bg-destructive/10 text-sm">
                Failed to get Balance (｡•́︿•̀｡)
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex gap-2 items-center text-primary">
                        <WalletIcon className="size-4" />
                        Saving
                    </CardTitle>
                    <CardDescription className="text-2xl font-semibold text-secondary-foreground">
                        {convertToIDR(Number(data?.savings || 0))}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="text-sm">
                    Savings for all time
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex gap-2 items-center text-primary">
                        <TrendingUpIcon className="size-4 text-primary" />
                        Income
                    </CardTitle>
                    <CardDescription className="text-2xl font-semibold text-secondary-foreground">
                        {convertToIDR(Number(data?.totalIncome || 0))}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="text-sm">
                    Total income for all time
                </CardFooter>
            </Card><Card>
                <CardHeader>
                    <CardTitle className="flex gap-2 items-center text-primary">
                        <TrendingDownIcon className="size-4 text-primary" />
                        Expense
                    </CardTitle>
                    <CardDescription className="text-2xl font-semibold text-secondary-foreground">
                        {convertToIDR(Number(data?.totalExpense || 0))}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="text-sm">
                    Total expenses for all time
                </CardFooter>
            </Card>
        </div>
    )
}