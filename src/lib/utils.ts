import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number | undefined | null, minSigFigs = 5): string {
  if (num === undefined || num === null) return "-";

  // For numbers >= 1, use regular toFixed(4)
  if (Math.abs(num) >= 1) {
    return num.toFixed(4);
  }

  // For numbers < 1, use toPrecision to get significant figures
  return num.toPrecision(minSigFigs);
}
