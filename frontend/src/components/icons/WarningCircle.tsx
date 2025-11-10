"use client";
import { WarningCircle as WarningCircleIcon } from "phosphor-react";

export function WarningCircle({
  size = 20,
  ...props
}: {
  size?: number;
  className?: string;
}) {
  return <WarningCircleIcon size={size} weight="fill" {...props} />;
}
