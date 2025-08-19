"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Brand-consistent color variants
export const modalVariants = {
  blue: {
    header: "bg-gradient-to-r from-blue-50/50 to-slate-50/50",
    icon: "bg-gradient-to-br from-blue-500 to-blue-600",
    border: "border-blue-200/60",
  },
  orange: {
    header: "bg-gradient-to-r from-orange-50/50 to-amber-50/50",
    icon: "bg-gradient-to-br from-orange-500 to-orange-600",
    border: "border-orange-200/60",
  },
  green: {
    header: "bg-gradient-to-r from-green-50/50 to-emerald-50/50",
    icon: "bg-gradient-to-br from-green-500 to-green-600",
    border: "border-green-200/60",
  },
  slate: {
    header: "bg-gradient-to-r from-slate-50/50 to-gray-50/50",
    icon: "bg-gradient-to-br from-slate-500 to-slate-600",
    border: "border-slate-200/60",
  },
};

export type ModalVariant = keyof typeof modalVariants;

interface BaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

interface ModalHeaderProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  variant?: ModalVariant;
  className?: string;
}

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: "max-w-md w-[90vw]",
  md: "max-w-2xl w-[90vw]",
  lg: "max-w-4xl w-[92vw]",
  xl: "max-w-6xl w-[95vw]",
  "2xl": "max-w-7xl w-[98vw]",
};

export function BaseModal({
  open,
  onOpenChange,
  children,
  size = "lg",
  className,
}: BaseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          sizeClasses[size],
          "max-h-[85vh] rounded-2xl border-0 shadow-2xl bg-white p-0 overflow-hidden",
          className
        )}
      >
        <div className="flex flex-col h-full max-h-[85vh]">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export function ModalHeader({
  icon: Icon,
  title,
  subtitle,
  variant = "blue",
  className,
}: ModalHeaderProps) {
  const variantStyles = modalVariants[variant];

  return (
    <DialogHeader
      className={cn(
        "px-6 py-3 border-b border-slate-100 flex-shrink-0",
        variantStyles.header,
        className
      )}
    >
      <DialogTitle className="flex items-center gap-3">
        {Icon && (
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl shadow-lg",
              variantStyles.icon
            )}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-slate-800 truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-slate-500 truncate">{subtitle}</p>
          )}
        </div>
      </DialogTitle>
    </DialogHeader>
  );
}

export function ModalContent({ children, className }: ModalContentProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scroll-smooth",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        "px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex-shrink-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ModalActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col lg:flex-row gap-3 w-full", className)}>
      {children}
    </div>
  );
}

export function ModalActionGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-2 flex-1", className)}>
      {children}
    </div>
  );
}

