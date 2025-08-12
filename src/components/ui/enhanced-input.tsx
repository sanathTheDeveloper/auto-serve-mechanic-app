import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

interface EnhancedInputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode
  suffix?: React.ReactNode
  error?: boolean
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ className, icon, suffix, error, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </div>
        )}
        <Input
          className={cn(
            "bg-gradient-to-r from-blue-50/30 to-orange-50/30 border-blue-200/50",
            "focus-visible:border-blue-400 focus-visible:ring-blue-400/20",
            "hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-orange-50/50",
            "transition-all duration-200",
            icon && "pl-10",
            suffix && "pr-10",
            error && "border-amber-300 focus-visible:border-amber-400 focus-visible:ring-amber-400/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            {suffix}
          </div>
        )}
      </div>
    )
  }
)
EnhancedInput.displayName = "EnhancedInput"

export { EnhancedInput }