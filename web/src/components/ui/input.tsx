import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full border-0 border-b-2 border-outline-variant bg-transparent px-0 py-2 text-xl font-headline transition-colors placeholder:text-primary-fixed-dim/40 focus:border-secondary focus:outline-none focus:ring-0",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
