import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-headline text-xs font-bold uppercase tracking-widest transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary hover:bg-primary-container",
        secondary:
          "bg-secondary text-on-secondary hover:bg-tertiary active:scale-[0.98]",
        outline:
          "border border-primary/20 bg-transparent text-primary hover:bg-primary hover:text-on-primary",
        ghost: "text-primary hover:text-secondary",
        link: "text-secondary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-14 px-8 py-4",
        sm: "h-10 px-4",
        lg: "h-16 px-16 py-6 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
