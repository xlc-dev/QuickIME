import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCSSVar(name: string) {
  const css = getComputedStyle(document.documentElement);
  return css.getPropertyValue(name).trim();
}
