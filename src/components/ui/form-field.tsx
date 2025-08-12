import * as React from "react"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  description?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({ 
  label, 
  description, 
  error, 
  required, 
  children, 
  className 
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-amber-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  )
}

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-xl border border-blue-200/50", className)}>
      <div className="mb-5">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

interface FormGridProps {
  columns?: 1 | 2 | 3
  children: React.ReactNode
  className?: string
}

export function FormGrid({ columns = 2, children, className }: FormGridProps) {
  return (
    <div className={cn(
      "grid gap-4",
      {
        "grid-cols-1": columns === 1,
        "grid-cols-1 md:grid-cols-2": columns === 2,
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": columns === 3,
      },
      className
    )}>
      {children}
    </div>
  )
}