"use client";
import { ReactNode } from "react";
import {
  CheckCircleIcon,
  WarningCircleIcon,
  PackageIcon,
  ArrowLeftIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

type AlertVariant = "success" | "error" | "info" | "warning";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children?: ReactNode;
  className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
};

const iconByVariant: Record<AlertVariant, ReactNode> = {
  success: <CheckCircleIcon size={20} className="text-green-600" />,
  error: <WarningCircleIcon size={20} className="text-red-600" />,
  info: <PackageIcon size={20} className="text-blue-600" />,
  warning: <ArrowLeftIcon size={20} className="text-yellow-600" />,
};

export function Alert({
  variant = "info",
  title,
  children,
  className,
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "border rounded-xl p-4 flex gap-3 items-start text-sm",
        variantStyles[variant],
        className
      )}
    >
      <div className="shrink-0 mt-0.5">{iconByVariant[variant]}</div>
      <div className="space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="leading-relaxed">{children}</div>}
      </div>
    </div>
  );
}
