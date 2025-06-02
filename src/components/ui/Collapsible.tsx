import type { ValidComponent, JSX } from "solid-js";
import { splitProps } from "solid-js";

import type { PolymorphicProps } from "@kobalte/core";
import * as CollapsiblePrimitive from "@kobalte/core/collapsible";

import LineMdChevronSmallDown from "~icons/line-md/chevron-small-down";

import { cn } from "~/utils";

type CollapsibleProps<T extends ValidComponent = "div"> =
  CollapsiblePrimitive.CollapsibleRootProps<T> & {
    class?: string | undefined;
  };

const Collapsible = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CollapsibleProps<T>>
) => {
  const [local, others] = splitProps(props as CollapsibleProps, ["class"]);
  return <CollapsiblePrimitive.Root class={cn("mb-4 w-full", local.class)} {...others} />;
};

type CollapsibleTriggerProps<T extends ValidComponent = "button"> =
  CollapsiblePrimitive.CollapsibleTriggerProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const CollapsibleTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, CollapsibleTriggerProps<T>>
) => {
  const [local, others] = splitProps(props as CollapsibleTriggerProps, ["class", "children"]);

  return (
    <CollapsiblePrimitive.Trigger
      class={cn(
        "border-input ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex w-full items-center justify-between rounded-lg border bg-transparent px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&[data-expanded]>svg.lucide-chevron]:rotate-180",
        local.class
      )}
      {...others}>
      {local.children}
      <LineMdChevronSmallDown
        class={cn(
          "lucide-chevron h-4 w-4 shrink-0 text-current",
          "transition-transform duration-200 ease-in-out will-change-transform"
        )}
        aria-hidden="true"
      />
    </CollapsiblePrimitive.Trigger>
  );
};

type CollapsibleContentProps<T extends ValidComponent = "div"> =
  CollapsiblePrimitive.CollapsibleContentProps<T> & {
    class?: string | undefined;
  };

const CollapsibleContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CollapsibleContentProps<T>>
) => {
  const [local, others] = splitProps(props as CollapsibleContentProps, ["class"]);
  return (
    <CollapsiblePrimitive.Content
      class={cn(
        "border-input mt-2 overflow-hidden rounded-lg border",
        "transition-colors duration-300 ease-out",
        "data-[expanded]:animate-accordion-down",
        "data-[closed]:animate-accordion-up data-[closed]:border-transparent",
        local.class
      )}
      {...others}
    />
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
