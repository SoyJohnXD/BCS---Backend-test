"use client";
import { Package as PackageIcon } from "phosphor-react";

export function Package({
  size = 20,
  ...props
}: {
  size?: number;
  className?: string;
}) {
  return <PackageIcon size={size} weight="duotone" {...props} />;
}
