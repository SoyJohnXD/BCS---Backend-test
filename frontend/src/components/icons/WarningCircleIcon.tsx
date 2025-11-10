"use client";
import { WarningCircle as PhWarningCircle } from "phosphor-react";

export interface WarningCircleIconProps {
  size?: number;
  className?: string;
}

export function WarningCircleIcon({
  size = 20,
  className,
}: WarningCircleIconProps) {
  return <PhWarningCircle size={size} weight="fill" className={className} />;
}
