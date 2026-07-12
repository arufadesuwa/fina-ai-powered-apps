import { Transaction } from "@/app/types/transaction";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datePicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTransaction } from "@/features/transaction/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  type: z.enum(["income", "expense"], {
    error: "Type is required",
  }),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
});

export default function UpdateTransactionDialog({
  selectedTransaction,
  setSelectedTransaction,
  refetch,
}: {
  selectedTransaction: {
    data: Omit<Transaction, "user_id" | "embedding">;
    action: "update" | "delete";
  } | null;
  setSelectedTransaction: Dispatch<
    SetStateAction<{
      data: Omit<Transaction, "user_id" | "embedding">;
      action: "update" | "delete";
    } | null>
  >;
  refetch: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: selectedTransaction
        ? String(selectedTransaction.data.amount)
        : "",
      type: selectedTransaction ? selectedTransaction.data.type : "income",
      category: selectedTransaction ? selectedTransaction.data.category : "",
      date: selectedTransaction ? String(selectedTransaction.data.date) : "",
      description: selectedTransaction
        ? selectedTransaction.data.description
        : "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: z.infer<typeof formSchema>;
    }) => {
      const formatedData = {
        ...data,
        amount: parseFloat(data.amount),
      };
      return updateTransaction(id, formatedData);
    },
    onSuccess: () => {
      setSelectedTransaction(null);
      refetch();
      form.reset();
      toast.success("Transaction successfully updated ♪┏(・o･)┛♪");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error desune ◕w◕");
    },
  });

  useEffect(() => {
    if (selectedTransaction) {
      form.reset({
        amount: String(selectedTransaction.data.amount),
        type: selectedTransaction.data.type,
        category: selectedTransaction.data.category,
        date: String(selectedTransaction.data.date),
        description: selectedTransaction.data.description,
      });
    }
  }, [selectedTransaction, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutate({
      id: String(selectedTransaction?.data.id),
      data,
    });
  };

  return (
    <Dialog
      open={!!selectedTransaction && selectedTransaction.action === "update"}
      onOpenChange={() => setSelectedTransaction(null)}
    >
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader className="gap-4">
            <div>
              <DialogTitle>Update transaction (＝ω＝ )</DialogTitle>
              <DialogDescription>
                Update the transaction data below
              </DialogDescription>
            </div>
            <FieldGroup className="gap-3">
              <Controller
                control={form.control}
                name="amount"
                render={({ field, fieldState }) => (
                  <Field className="gap-1">
                    <FieldLabel htmlFor="form-amount">Amount</FieldLabel>
                    <Input
                      {...field}
                      id="form-amount"
                      placeholder="0,00"
                      autoComplete="off"
                      type="number"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="type"
                render={({ field, fieldState }) => (
                  <Field className="gap-1">
                    <FieldLabel htmlFor="form-type">Type</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="form-type">
                        <SelectValue placeholder="Select type ´･ᴗ･`" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income ´･ᴗ･`</SelectItem>
                        <SelectItem value="expense">Expense ´･ᴗ･`</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="category"
                render={({ field, fieldState }) => (
                  <Field className="gap-1">
                    <FieldLabel htmlFor="form-category">Category</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="form-category">
                        <SelectValue placeholder="Select category ´･ᴗ･`" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Food & Drink">
                          Food & Drink
                        </SelectItem>
                        <SelectItem value="Transportation">
                          Transportation
                        </SelectItem>
                        <SelectItem value="Entertainment">
                          Entertainment
                        </SelectItem>
                        <SelectItem value="Shopping">Shopping</SelectItem>
                        <SelectItem value="Housing">Housing</SelectItem>
                        <SelectItem value="Salary">Salary</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="date"
                render={({ field, fieldState }) => (
                  <Field className="gap-1">
                    <FieldLabel htmlFor="form-date">Date</FieldLabel>
                    <DatePicker
                      id="form-date"
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field className="gap-1">
                    <FieldLabel htmlFor="form-description">
                      Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="form-amount"
                      placeholder="Enter description ≧◡≦"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setSelectedTransaction(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              type="submit"
              disabled={!form.formState.isValid || isPending}
            >
              {isPending ? "Gaman shite nee~" : "Create!!   (◔◡◔)"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
