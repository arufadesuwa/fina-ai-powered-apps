import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formScema = z.object({
  message: z.string().min(1, "message is required"),
});

export default function ChatbotTextArea() {
  const form = useForm<z.infer<typeof formScema>>({
    resolver: zodResolver(formScema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(data: z.infer<typeof formScema>) {
    form.reset();
  }

  return (
    <form className="flex flex-col p-2 bg-secondary rounded-2xl">
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
              className="h-16 resize-none rounded-md px-3 py-2 focus:outline-none"
            />
          </Field>
        )}
      />
      <div className="flex justify-between">
        <div></div>
        <div>
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="text-primary hover:bg-primary/10 hover:text-primary cursor-pointer disabled:bg-transparent"
          >
            <SendIcon className="size-5" />
          </Button>
        </div>
      </div>
    </form>
  );
}
