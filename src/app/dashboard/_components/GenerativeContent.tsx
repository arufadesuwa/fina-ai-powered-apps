import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";

import {
  generateChart,
  generateImage,
  generateVideo,
} from "@/features/ai/generativeContents";
import { cn, convertToIDR } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ChartPieIcon,
  ImageIcon,
  Loader2Icon,
  Sparkles,
  SparklesIcon,
  VideoIcon,
} from "lucide-react";
import { KeyboardEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Image from "next/image";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  request: z.string().min(1, "Request is required"),
});

const COLORS = [
  "#9fe870",
  "#2ead4b",
  "#38c8ff",
  "#ffc091",
  "#ffd11a",
  "#0e0f0c",
  "#d03238",
];

export default function GenerativeContent() {
  const [insightType, setInsightType] = useState<"chart" | "image" | "video">(
    "chart",
  );

  const [result, setResult] = useState<
    | {
        type: "chart";
        chartType: "bar" | "pie";
        data: { name: string; value: number }[];
      }
    | {
        type: "image";
        data: string;
      }
    | {
        type: "video";
        data: string;
      }
    | null
  >(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      request: "",
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (request: string) => {
      switch (insightType) {
        case "chart":
          const result = await generateChart(request);
          return { ...result, type: "chart" };
        case "image":
          const resultImage = await generateImage(request);
          return {
            type: "image",
            data: resultImage,
          };
        case "video":
          const resultVideo = await generateVideo(request);
          return {
            type: "video",
            data: resultVideo,
          };
        default:
          return null;
      }
    },
    onSuccess: (response) => {
      setResult(response);
      toast.success(`Success generate ${insightType}`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to process your request.",
      );
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data.request);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(form.getValues());
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl font-black text-foreground tracking-tight">
            <div className="size-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-xs shrink-0">
              <SparklesIcon className="size-4.5" />
            </div>
            <span>Generative AI Insights</span>
          </CardTitle>
          <form
            className="flex flex-col gap-2.5 sm:flex-row sm:items-center"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <ButtonGroup className="rounded-full bg-secondary p-1">
              <Button
                variant={insightType === "chart" ? "default" : "ghost"}
                type="button"
                size="sm"
                className="rounded-full h-8 px-3 text-xs"
                onClick={() => setInsightType("chart")}
              >
                <ChartPieIcon className="size-3.5" />
                <span>Chart</span>
              </Button>
              <Button
                variant={insightType === "image" ? "default" : "ghost"}
                type="button"
                size="sm"
                className="rounded-full h-8 px-3 text-xs"
                onClick={() => setInsightType("image")}
              >
                <ImageIcon className="size-3.5" />
                <span>Image</span>
              </Button>
              <Button
                variant={insightType === "video" ? "default" : "ghost"}
                type="button"
                size="sm"
                className="rounded-full h-8 px-3 text-xs"
                onClick={() => setInsightType("video")}
              >
                <VideoIcon className="size-3.5" />
                <span>Video</span>
              </Button>
            </ButtonGroup>
            <div className="flex flex-row gap-2">
              <Controller
                control={form.control}
                name="request"
                render={({ field }) => (
                  <Field>
                    <Input
                      {...field}
                      id="form-request"
                      placeholder="E.g. category spending breakdown..."
                      className="w-48 sm:w-64"
                      onKeyDown={handleKeyDown}
                      disabled={isPending}
                    />
                  </Field>
                )}
              />
              <Button type="submit" disabled={isPending} className="rounded-full shrink-0">
                {isPending ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                <span>
                  {result ? "Update" : "Generate"}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </CardHeader>
      <CardContent className={cn(result?.type === "chart" && "h-72")}>
        {error && (
          <div className="p-4 text-sm rounded-xl text-destructive border border-destructive/20 bg-destructive/10">
            {error.message}
          </div>
        )}

        {!result ? (
          <div className="flex items-center justify-center rounded-[20px] border border-dashed border-border/80 bg-secondary/30 h-64">
            {isPending ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2Icon className="size-8 text-primary animate-spin" />
                <span className="text-sm font-semibold text-foreground">AI is generating insight...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center p-6 gap-2">
                <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  <ChartPieIcon className="size-5" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Generate instant visual analytics
                </span>
                <span className="text-xs text-muted-foreground max-w-sm">
                  Ask for spending breakdowns, category proportions, or trend visualizations
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full">
            {result.type === "chart" && (
              <ResponsiveContainer width="100%" height="100%">
                {result.chartType === "bar" ? (
                  <BarChart data={result.data}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        convertToIDR(Number(value) || 0)
                      }
                      style={{
                        fontSize: "8px",
                      }}
                    />
                    <Tooltip
                      formatter={(value) => convertToIDR(Number(value) || 0)}
                      contentStyle={{
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="var(--color-primary)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={result.data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props) => (
                        <text
                          x={props.x}
                          y={props.y}
                          fill={COLORS[props.index % COLORS.length]}
                          textAnchor={props.textAnchor}
                          dominantBaseline="central"
                          fontSize={14}
                        >
                          {`${props.name} (${((props.percent || 0) * 100).toFixed(0)}%)`}
                        </text>
                      )}
                      outerRadius={100}
                      dataKey="value"
                      shape={(props, index) => (
                        <Sector
                          {...props}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )}
                    />
                    <Tooltip
                      formatter={(value) => convertToIDR(Number(value) || 0)}
                      contentStyle={{
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            )}

            {result.type === "image" && (
              <div className="flex items-center">
                <Image
                  width={1920}
                  height={1080}
                  src={result.data}
                  alt="Generate Image"
                  className="rounded-xl"
                />
              </div>
            )}

            {result.type === "video" && (
              <div className="flex items-center">
                <video
                  src={result.data}
                  controls
                  className="w-full border rounded-xl aspect-video"
                >
                  Your browser doesn't support
                </video>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
