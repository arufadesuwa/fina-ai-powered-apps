import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTransactions } from "@/features/transaction/action";
import { cn, convertToIDR } from "@/lib/utils";
import { PencilIcon, Trash2Icon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Fragment } from "react/jsx-runtime";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Transaction } from "@/app/types/transaction";
import DeleteTransactionDialog from "./DeleteTransactionDialog";
import UpdateTransactionDialog from "./UpdateTransactionDialog";

const TABLE_HEADER = [
  "#",
  "Date",
  "Description",
  "Category",
  "Amount",
  "Action",
];

export default function TransactionTable({
  transactions,
  isLoading,
  refetch,
  page,
  limit,
  search,
  setPage,
  setLimit,
  setSearch,
}: {
  transactions?: Awaited<ReturnType<typeof getTransactions>>;
  page: number;
  limit: number;
  search: string;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  isLoading: boolean;
  refetch: () => void;
}) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  });

  const [selectedTransaction, setSelectedTransaction] = useState<{
    data: Omit<Transaction, "user_id" | "embedding">;
    action: "update" | "delete";
  } | null>(null);

  return (
    <Fragment>
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-3 justify-between sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-xl lg:text-2xl font-black text-foreground tracking-tight">Recent Transactions</CardTitle>
            <CardDescription className="text-body text-sm mt-0.5">Your recorded financial activities</CardDescription>
          </div>
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search desuwa!  (・o･)♪"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full h-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-[16px] overflow-hidden border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  {TABLE_HEADER.map((header) => (
                    <TableHead key={`th-${header}`}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!isLoading &&
                  transactions?.data?.map((transaction, index) => (
                    <TableRow key={`tr-${transaction.id}`}>
                      <TableCell className="text-muted-foreground font-mono text-xs">{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell className="font-medium text-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">{transaction.description}</TableCell>
                      <TableCell>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-foreground">
                          {transaction.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "font-bold text-sm",
                            transaction.type === "expense"
                              ? "text-destructive"
                              : "text-positive-deep bg-primary-pale px-2.5 py-0.5 rounded-full",
                          )}
                        >
                          {transaction.type === "expense" ? "-" : "+"}
                          {convertToIDR(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary"
                            onClick={() => {
                              setSelectedTransaction({
                                data: transaction,
                                action: "update",
                              });
                            }}
                          >
                            <PencilIcon className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="size-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setSelectedTransaction({
                                data: transaction,
                                action: "delete",
                              });
                            }}
                          >
                            <Trash2Icon className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              {isLoading && (
                <TableCaption className="py-8 text-muted-foreground">
                  Loading desuwa (っ◔◡◔)っ ♥...
                </TableCaption>
              )}
              {!isLoading && transactions?.data?.length === 0 && (
                <TableCaption className="py-8 text-muted-foreground">
                  No transaction yet ≧◔◡◔≦
                </TableCaption>
              )}
            </Table>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-2">
            <div className="flex gap-2 items-center">
              <span className="text-xs font-medium text-muted-foreground">
                Rows per page
              </span>
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  setLimit(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-20 h-9 rounded-xl">
                  <SelectValue placeholder={limit.toString()} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 10, 20, 50, 100].map((size) => (
                    <SelectItem key={`limit-${size}`} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {transactions?.totalPages && transactions?.totalPages > 1 ? (
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        page === 1
                          ? setPage(Number(transactions?.totalPages))
                          : setPage(page - 1)
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        page === Number(transactions?.totalPages)
                          ? setPage(1)
                          : setPage(page + 1)
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : (
              <div className="text-muted-foreground text-xs">
                This should be a pagination component (●ω●)
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <UpdateTransactionDialog
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        refetch={refetch}
      />
      <DeleteTransactionDialog
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        refetch={refetch}
      />
    </Fragment>
  );
}
