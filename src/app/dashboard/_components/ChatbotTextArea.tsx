import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrainIcon, SendIcon } from "lucide-react";
import { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formScema = z.object({
  message: z.string().min(1, "message is required"),
});

export default function ChatbotTextArea({
  sendMessage,
  isThinking,
  setIsThinking,
  isPending,
  mode,
  setMode,
}: {
  sendMessage: (message: string) => void;
  isThinking: boolean;
  setIsThinking: Dispatch<SetStateAction<boolean>>;
  isPending: boolean;
  mode: "general" | "personal";
  setMode: Dispatch<SetStateAction<"general" | "personal">>;
}) {
  const form = useForm<z.infer<typeof formScema>>({
    resolver: zodResolver(formScema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(data: z.infer<typeof formScema>) {
    sendMessage(data.message);
    form.reset();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (!isPending && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(form.getValues());
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col p-2.5 bg-secondary/80 border border-border/70 rounded-[20px]"
    >
      <Controller
        control={form.control}
        name="message"
        render={({ field, fieldState }) => (
          <Field>
            <textarea
              {...field}
              id="form-message"
              placeholder="ask fina advisor!"
              autoComplete="off"
              className="h-16 resize-none bg-transparent px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              onKeyDown={handleKeyDown}
            />
          </Field>
        )}
      />
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Toggle
            variant="outline"
            pressed={isThinking}
            onPressedChange={setIsThinking}
            className={cn("text-xs p-0 size-8 rounded-full border-border bg-card", {
              "bg-primary! text-primary-foreground! border-primary!": isThinking,
            })}
          >
            <BrainIcon className="size-4" />
          </Toggle>
          <Select
            value={mode}
            onValueChange={(value: "general" | "personal") => setMode(value)}
          >
            <SelectTrigger size="sm" className="capitalize rounded-full h-8 px-3 text-xs bg-card border-border">
              <SelectValue>{mode}</SelectValue>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </SelectTrigger>
          </Select>
        </div>
        <div>
          <Button
            type="submit"
            size="icon-sm"
            variant="default"
            className="rounded-full size-8 p-0 cursor-pointer disabled:opacity-40"
            disabled={isPending}
          >
            <SendIcon className="size-3.5" />
          </Button>
        </div>
      </div>
    </form>
  );
}
