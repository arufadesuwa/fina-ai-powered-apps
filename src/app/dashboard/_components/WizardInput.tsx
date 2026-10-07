"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { handleWizardInput, handleWizardTools } from "@/features/ai/wizard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Loader2Icon,
  MicIcon,
  SendIcon,
  SparklesIcon,
  SquareIcon,
} from "lucide-react";
import { KeyboardEvent, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Markdown from "react-markdown";
import { toast } from "sonner";
import z from "zod";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  message: z.string().min(1, "message is required"),
});

export default function WizardInput({ refetch }: { refetch: () => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: handleWizardTools,
    onSuccess: (response) => {
      refetch();
      form.reset();
      toast.success(
        <div className="response-ai w-full!">
          <Markdown>{response}</Markdown>
        </div>,
      );
    },

    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "残念ですね");
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("type", "text");
    formData.append("file", "");
    formData.append("request", data.message);
    mutate(formData);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!isPending && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("type", "audio");
        formData.append("request", "");
        formData.append("file", audioBlob);
        mutate(formData);

        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      toast.error("Failed to access media recorder");
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const isText = form.watch("message") !== "";
  return (
    <div className="w-full rounded-[24px] bg-card p-2 sm:p-3 ring-1 ring-black/[0.04] dark:ring-white/10 shadow-none transition-all">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-3 px-2"
      >
        <div className="size-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
          <SparklesIcon className="size-5" />
        </div>
        <Controller
          control={form.control}
          name="message"
          render={({ field }) => (
            <div className="flex-1">
              <input
                {...field}
                id="form-message"
                placeholder={
                  isRecording
                    ? "Listening... speak now"
                    : isPending && !field.value
                      ? "AI is recording transaction..."
                      : "Type or speak: 'Spent 50k on lunch at bakery'..."
                }
                autoComplete="off"
                className="w-full h-12 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                onKeyDown={handleKeyDown}
              />
            </div>
          )}
        />
        <Button
          type={isText ? "submit" : "button"}
          size="icon"
          variant={isText ? "default" : "secondary"}
          className={cn(
            "size-11 rounded-full transition-transform active:scale-95 shrink-0",
            isRecording && "bg-destructive text-white hover:bg-destructive"
          )}
          disabled={isPending}
          onClick={
            !isText
              ? isRecording
                ? stopRecording
                : startRecording
              : undefined
          }
        >
          {isPending ? (
            <Loader2Icon className="size-5 animate-spin" />
          ) : isText ? (
            <SendIcon className="size-5" />
          ) : isRecording ? (
            <SquareIcon className="size-5 fill-white text-white animate-pulse" />
          ) : (
            <MicIcon className="size-5" />
          )}
        </Button>
      </form>
    </div>
  );
}
