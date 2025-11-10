"use client";
import { Package as PhPackage } from "phosphor-react";

export interface PackageIconProps {
  size?: number;
  className?: string;
}

export function PackageIcon({ size = 20, className }: PackageIconProps) {
  return <PhPackage size={size} weight="duotone" className={className} />;
}
