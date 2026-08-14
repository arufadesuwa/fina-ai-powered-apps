import { extractReceiptData } from "@/features/ai/multimodal";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { Loader2Icon, UploadCloudIcon } from "lucide-react";
import { DragEvent, useRef, useState } from "react";
import { UseFormSetValues } from "react-hook-form";
import { toast } from "sonner";

export default function FileDropZoneInput({
  // refetch,
  setValues,
}: {
  // refetch: () => void;
  setValues: UseFormSetValues<{
    amount: string;
    type: "income" | "expense";
    category: string;
    date: string;
    description: string;
  }>;
}) {
  const [isDrag, setIsDrag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: extractReceiptData,
    onSuccess: (response) => {
      setValues({
        ...response,
        amount: `${response.amount}`,
      });
      toast.success("Scan receipt successfuly");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      // refetch()
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "残念ですね");
    },
  });

  const processFile = async (file: File) => {
    if (
      !file.type.endsWith("pdf") &&
      !file.type.startsWith("image") &&
      !file.type.startsWith("video") &&
      !file.type.startsWith("audio")
    ) {
      toast.error("File type not supported");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    mutate(formData);
  };

  const handleDrop = (e: DragEvent) => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    e.preventDefault();
    setIsDrag(false);
    if (e.dataTransfer.files && e.dataTransfer?.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDrag(true);
      }}
      onDragLeave={() => setIsDrag(false)}
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all",
        isDrag
          ? "border-primary bg-primary/10 scale-[1.02] animate-spin"
          : "border-muted hover:border-primary/50 hover:bg-muted/50",
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf, image/*, video/*, audio/*"
        onChange={(e) => e.target.files && processFile(e.target.files[0])}
      />
      {isPending ? (
        <div className="flex flex-col items-center">
          <Loader2Icon className="size-8 text-primary animate-spin" />
          <p className="text-xs font-medium">AI is processing receipt</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <UploadCloudIcon
            className={cn(
              "size-8",
              isDrag ? "text-primary" : "text-muted-foreground",
            )}
          />
          <div className="space-y-1 text-center">
            <p className="text-sm font-medium">Drag & Drop Receipt Here</p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to browse
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
