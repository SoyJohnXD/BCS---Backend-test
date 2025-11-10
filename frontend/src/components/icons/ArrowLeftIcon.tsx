"use client";
import { ArrowLeft as PhArrowLeft } from "phosphor-react";

export interface ArrowLeftIconProps {
  size?: number;
  className?: string;
}

export function ArrowLeftIcon({ size = 20, className }: ArrowLeftIconProps) {
  return <PhArrowLeft size={size} className={className} />;
}
