"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  id,
  value,
  onChange,
}: {
  id?: string;
  value?: Date;
  onChange?: (date?: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          id={id}
          data-empty={!value}
          className="w-full bg-input/50 justify-start text-left font-normal data-[empty=true]:text-muted-foreground gap-2"
        >
          <CalendarIcon className="h-4 w-4" />{" "}
          {value ? format(value, "PPP") : <span>Pick a date(◕ᴗ◕)</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  );
}
