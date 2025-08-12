import * as React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "./textarea"

interface EnhancedTextareaProps extends React.ComponentProps<"textarea"> {
  error?: boolean
  maxLength?: number
  showCount?: boolean
}

const EnhancedTextarea = React.forwardRef<HTMLTextAreaElement, EnhancedTextareaProps>(
  ({ className, error, maxLength, showCount, value, ...props }, ref) => {
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
      if (value && typeof value === 'string') {
        setCount(value.length)
      }
    }, [value])

    return (
      <div className="relative">
        <Textarea
          className={cn(
            "bg-gradient-to-r from-blue-50/30 to-orange-50/30 border-blue-200/50",
            "focus-visible:border-blue-400 focus-visible:ring-blue-400/20",
            "hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-orange-50/50",
            "transition-all duration-200 resize-none",
            error && "border-amber-300 focus-visible:border-amber-400 focus-visible:ring-amber-400/20",
            className
          )}
          maxLength={maxLength}
          value={value}
          ref={ref}
          {...props}
        />
        {showCount && maxLength && (
          <div className="absolute bottom-2 right-3 text-xs text-slate-400">
            {count}/{maxLength}
          </div>
        )}
      </div>
    )
  }
)
EnhancedTextarea.displayName = "EnhancedTextarea"

export { EnhancedTextarea }