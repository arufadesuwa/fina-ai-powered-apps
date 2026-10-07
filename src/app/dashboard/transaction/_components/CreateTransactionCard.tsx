import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/datePicker";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { createTransaction } from "@/features/transaction/action";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import FileDropZoneInput from "../../_components/FileDropZoneInput";
import { CATEGORIES } from "@/constants/transactionConstant";

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  type: z.enum(["income", "expense"], {
    error: "Type is required",
  }),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
});

export default function CreateTransactionCard({
  refetch,
}: {
  refetch: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      type: "income",
      category: "",
      date: "",
      description: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      const formatedData = {
        ...data,
        amount: parseFloat(data.amount),
      };

      return createTransaction(formatedData);
    },
    onSuccess: () => {
      form.reset();
      refetch();
      toast.success("Yatta! Transaction created successfully ʕ•ᴥ•ʔ");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "残念ですね");
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutate(data);
  };

  return (
    <Card className="w-full h-fit">
      <CardHeader>
        <CardTitle className="text-xl lg:text-2xl font-black text-foreground tracking-tight">
          Create Transaction（＾ω＾）
        </CardTitle>
        <CardDescription className="text-body text-sm mt-0.5">
          Add a new financial activity desuwa（＾ω＾）
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-5">
          <FileDropZoneInput
            setValues={form.setValues}
          />
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              control={form.control}
              name="amount"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="form-amount" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Amount
                  </FieldLabel>
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
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="form-type" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Type
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="form-type" className="rounded-xl h-11">
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
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="form-category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Category
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="form-category" className="rounded-xl h-11">
                      <SelectValue placeholder="Select category ´･ᴗ･`" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem value={category} key={category}>
                          {category}
                        </SelectItem>
                      ))}
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
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="form-date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Date
                  </FieldLabel>
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
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="form-description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
            <Button size="lg" type="submit" disabled={isPending} className="w-full h-12 rounded-full font-bold text-base mt-2">
              {isPending ? "Gaman shite nee~" : "Create!!   (◔◡◔)"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
