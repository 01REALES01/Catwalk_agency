import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "min-h-[120px] w-full resize-y border border-outline-variant/30 bg-surface-container-low px-4 py-3 font-body text-sm leading-relaxed text-on-background placeholder:text-primary-fixed-dim/40 focus:border-secondary focus:outline-none",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
