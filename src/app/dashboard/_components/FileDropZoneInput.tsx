import { cn } from "@/lib/utils";
import { UploadCloudIcon } from "lucide-react";
import { DragEvent, useRef, useState } from "react";
import { UseFormSetValues } from "react-hook-form";

export default function FileDropZoneInput({
  refetch,
  setValues,
}: {
  refetch: () => void;
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

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    if (e.dataTransfer.files && e.dataTransfer?.files.length > 0) {
      console.log(e.dataTransfer.files);
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
      className={cn(
        "border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all",
        isDrag
          ? "border-primary bg-primary/10 scale-[1.02] animate-spin"
          : "border-muted hover:border-primary/50 hover:bg-muted/50",
      )}
    >
      <input type="file" ref={fileInputRef} className="hidden" />
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
    </div>
  );
}
