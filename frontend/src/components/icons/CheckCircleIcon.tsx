"use client";
import { CheckCircle } from "phosphor-react";

export function CheckCircleIcon({
  size = 20,
  ...props
}: {
  size?: number;
  className?: string;
}) {
  return <CheckCircle size={size} weight="fill" {...props} />;
}
