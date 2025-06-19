import type { Accessor, Setter } from "solid-js";
import { createSignal, createEffect } from "solid-js";

export function createStorageSignal<T>(
  key: string,
  defaultValue: T,
): [Accessor<T>, Setter<T>] {
  const initial = ((): T => {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    try {
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  })();

  const [value, setValue] = createSignal<T>(initial);

  createEffect(() => {
    localStorage.setItem(key, JSON.stringify(value()));
  });

  return [value, setValue];
}
