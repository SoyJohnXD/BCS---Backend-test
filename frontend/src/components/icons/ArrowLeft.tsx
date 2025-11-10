"use client";
import { ArrowLeft as ArrowLeftIcon } from "phosphor-react";

export function ArrowLeft({
  size = 20,
  ...props
}: {
  size?: number;
  className?: string;
}) {
  return <ArrowLeftIcon size={size} {...props} />;
}
