import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-black uppercase tracking-tight border-2 border-foreground transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:translate-y-1 active:shadow-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-neo hover:opacity-90",
        outline:
          "bg-background text-foreground shadow-neo hover:bg-secondary",
        secondary:
          "bg-secondary text-secondary-foreground shadow-neo hover:opacity-90",
        ghost:
          "border-transparent text-foreground hover:bg-secondary hover:border-foreground shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground shadow-neo hover:opacity-90",
        link: "text-primary underline-offset-4 hover:underline border-transparent shadow-none",
        hero:
          "bg-primary text-primary-foreground shadow-neo-lg hover:-translate-y-0.5 hover:shadow-neo-xl",
        primary:
          "bg-primary text-primary-foreground shadow-neo hover:opacity-90",
      },
      size: {
        default: "h-12 px-6 py-2 rounded-lg text-sm",
        sm: "h-9 px-3 rounded-md text-xs",
        lg: "h-14 px-10 rounded-xl text-base",
        icon: "h-12 w-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
