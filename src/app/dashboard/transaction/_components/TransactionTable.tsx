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
      <Card className="gap-2 w-full">
        <CardHeader className="flex flex-col gap-2 justify-between md:flex-row md:items-center">
          <div>
            <CardTitle>Recent Transaction</CardTitle>
            <CardDescription>Your latest financial activities</CardDescription>
          </div>
          <div>
            <Input
              placeholder="Search desuwa!  (・o･)♪"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full"
            />
          </div>
        </CardHeader>
        <CardContent>
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
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell
                      className={cn(
                        "font-semibold",
                        transaction.type === "expense"
                          ? "text-destructive"
                          : "text-green-500",
                      )}
                    >
                      {transaction.type === "expense" && "-"}
                      {convertToIDR(transaction.amount)}
                    </TableCell>
                    <TableCell className="flex">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-yellow-500"
                        onClick={() => {
                          setSelectedTransaction({
                            data: transaction,
                            action: "update",
                          });
                        }}
                      >
                        <PencilIcon className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          setSelectedTransaction({
                            data: transaction,
                            action: "delete",
                          });
                        }}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            {isLoading && (
              <TableCaption className="mb-4">
                Loading desuwa (っ◔◡◔)っ ♥...
              </TableCaption>
            )}
            {!isLoading && transactions?.data?.length === 0 && (
              <TableCaption className="mb-4">
                No transaction yet ≧◔◡◔≦
              </TableCaption>
            )}
          </Table>
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2 items-center">
              <div className="text-sm text-muted-foreground">
                {" "}
                Rows per page
              </div>
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  setLimit(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-20">
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
              <div className="text-muted-foreground">
                This should been a pagination component here (●ω●)
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
