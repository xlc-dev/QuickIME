import type { Accessor, Setter } from "solid-js";
import { createSignal, createEffect, on } from "solid-js";
import { isServer } from "solid-js/web";

/**
 * Creates a SolidJS signal that is automatically persisted to localStorage.
 *
 * @param key The key to use in localStorage.
 * @param defaultValue The value to use if nothing is in storage.
 * @returns A signal [getter, setter] pair.
 */
export function createStorageSignal<T>(key: string, defaultValue: T): [Accessor<T>, Setter<T>] {
  // Determine the initial value based on the environment (server or client).
  // This logic runs only once when the signal is created.
  const initialValue = (() => {
    if (isServer) {
      return defaultValue;
    }
    // On the client, try to read the initial value from localStorage.
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  })();

  // Create the signal once with the determined initial value.
  const [value, setValue] = createSignal<T>(initialValue);

  // This effect runs only on the client because localStorage is client-side.
  // It also ensures the value is saved whenever it changes.
  // Use an if statement for conditional execution to satisfy the linter.
  if (!isServer) {
    createEffect(
      on(value, () => {
        // It writes the new value back to localStorage.
        localStorage.setItem(key, JSON.stringify(value()));
      })
    );
  }

  return [value, setValue];
}
