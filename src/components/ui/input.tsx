import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border-2 border-foreground bg-background px-4 py-2 text-base font-bold text-foreground shadow-neo transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-bold placeholder:text-muted-foreground/50 focus:translate-y-0.5 focus:shadow-neo-focus focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
