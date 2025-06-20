import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Accessor, Setter } from "solid-js";
import { createSignal, createEffect } from "solid-js";
import { isServer } from "solid-js/web";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCSSVar(name: string) {
  const css = getComputedStyle(document.documentElement);
  return css.getPropertyValue(name).trim();
}

export function createStorageSignal<T>(key: string, defaultValue: T): [Accessor<T>, Setter<T>] {
  const initial: T = isServer
    ? defaultValue
    : (() => {
        try {
          const raw = localStorage.getItem(key);
          return raw !== null ? (JSON.parse(raw) as T) : defaultValue;
        } catch {
          return defaultValue;
        }
      })();

  const [value, setValue] = createSignal<T>(initial);

  if (!isServer) {
    createEffect(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value()));
      } catch {}
    });
  }

  return [value, setValue];
}
