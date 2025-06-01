import { mergeProps, Show, splitProps, type Component, type ComponentProps } from "solid-js";

import { cn } from "~/utils";

type BarDeltaProps = ComponentProps<"div"> & {
  value: number;
  isIncreasePositive?: boolean;
};

const BarDelta: Component<BarDeltaProps> = (rawProps) => {
  const props = mergeProps(
    {
      isIncreasePositive: true,
    },
    rawProps
  );
  const [local, others] = splitProps(props, ["value", "isIncreasePositive", "class"]);

  const barColor = () =>
    (local.value > 0 && local.isIncreasePositive) || (local.value < 0 && !local.isIncreasePositive)
      ? "bg-success-foreground"
      : "bg-error-foreground";

  return (
    <div
      class={cn("bg-secondary relative flex h-2 w-full items-center rounded-full", local.class)}
      {...others}>
      <div class="flex h-full w-1/2 justify-end">
        <Show when={local.value < 0}>
          <div
            class={cn("rounded-l-full", barColor())}
            style={{ width: `${Math.abs(local.value)}%` }}
          />
        </Show>
      </div>
      <div class={cn("ring-background z-10 h-4 w-1 rounded-full ring-2", barColor())} />
      <div class="flex h-full w-1/2 justify-start">
        <Show when={local.value > 0}>
          <div
            class={cn("rounded-r-full", barColor())}
            style={{ width: `${Math.abs(local.value)}%` }}
          />
        </Show>
      </div>
    </div>
  );
};

export { BarDelta };
export type { BarDeltaProps };
