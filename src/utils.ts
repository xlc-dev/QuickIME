import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Accessor, Setter } from "solid-js";
import { createSignal, createEffect, onMount, on } from "solid-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCSSVar(name: string) {
  const css = getComputedStyle(document.documentElement);
  return css.getPropertyValue(name).trim();
}

export function createStorageSignal<T>(key: string, defaultValue: T): [Accessor<T>, Setter<T>] {
  const [value, setValue] = createSignal<T>(defaultValue);

  onMount(() => {
    const item = localStorage.getItem(key);
    if (item != null) {
      try {
        setValue(JSON.parse(item));
      } catch {
        /* ignore malformed */
      }
    }
  });

  createEffect(
    on(value, (v) => {
      localStorage.setItem(key, JSON.stringify(v));
    })
  );

  return [value, setValue];
}
