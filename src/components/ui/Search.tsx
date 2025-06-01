import type { ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as SearchPrimitive from "@kobalte/core/search";

import { cn } from "~/utils";

const Search = SearchPrimitive.Root;

type SearchLabelProps<T extends ValidComponent = "label"> = SearchPrimitive.SearchLabelProps<T> & {
  class?: string | undefined;
};

const SearchLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, SearchLabelProps<T>>
) => {
  const [local, others] = splitProps(props as SearchLabelProps, ["class"]);
  return (
    <SearchPrimitive.Label
      class={cn(
        "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        local.class
      )}
      {...others}
    />
  );
};

type SearchDescriptionProps<T extends ValidComponent = "div"> =
  SearchPrimitive.SearchDescriptionProps<T> & {
    class?: string | undefined;
  };

const SearchDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SearchDescriptionProps<T>>
) => {
  const [local, others] = splitProps(props as SearchDescriptionProps, ["class"]);
  return (
    <SearchPrimitive.Description
      class={cn("text-muted-foreground text-sm", local.class)}
      {...others}
    />
  );
};

type SearchControlProps<T extends ValidComponent = "div"> =
  SearchPrimitive.SearchControlProps<T> & {
    class?: string | undefined;
  };

const SearchControl = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SearchControlProps<T>>
) => {
  const [local, others] = splitProps(props as SearchControlProps, ["class"]);
  return (
    <SearchPrimitive.Control
      class={cn(
        "border-input bg-background ring-offset-background focus-within:ring-ring flex h-10 w-full items-center gap-2 rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        local.class
      )}
      {...others}
    />
  );
};

type SearchInputProps<T extends ValidComponent = "input"> = SearchPrimitive.SearchInputProps<T> & {
  class?: string | undefined;
};

const SearchInput = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, SearchInputProps<T>>
) => {
  const [local, others] = splitProps(props as SearchInputProps, ["class"]);
  return (
    <SearchPrimitive.Input
      class={cn(
        "placeholder:text-muted-foreground flex h-full w-full bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
        local.class
      )}
      {...others}
    />
  );
};

type SearchIndicatorProps<T extends ValidComponent = "div"> =
  SearchPrimitive.SearchIndicatorProps<T> & {
    class?: string | undefined;
  };

const SearchIndicator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SearchIndicatorProps<T>>
) => {
  const [local, others] = splitProps(props as SearchIndicatorProps, ["class"]);
  return (
    <SearchPrimitive.Indicator
      class={cn("flex items-center justify-center", local.class)}
      {...others}
    />
  );
};

type SearchIconProps<T extends ValidComponent = "svg"> = SearchPrimitive.SearchIconProps<T> & {
  class?: string | undefined;
};

const SearchIcon = <T extends ValidComponent = "svg">(
  props: PolymorphicProps<T, SearchIconProps<T>>
) => {
  const [local, others] = splitProps(props as SearchIconProps, ["class"]);
  return (
    <SearchPrimitive.Icon class={cn("text-muted-foreground h-4 w-4", local.class)} {...others} />
  );
};

const SearchPortal = SearchPrimitive.Portal;

type SearchContentProps<T extends ValidComponent = "div"> =
  SearchPrimitive.SearchContentProps<T> & {
    class?: string | undefined;
  };

const SearchContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SearchContentProps<T>>
) => {
  const [local, others] = splitProps(props as SearchContentProps, ["class"]);
  return (
    <SearchPrimitive.Content
      class={cn(
        "bg-popover text-popover-foreground data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95 relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border shadow-md",
        local.class
      )}
      {...others}
    />
  );
};

type SearchArrowProps<T extends ValidComponent = "div"> = SearchPrimitive.SearchArrowProps<T> & {
  class?: string | undefined;
};

const SearchArrow = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SearchArrowProps<T>>
) => {
  const [local, others] = splitProps(props as SearchArrowProps, ["class"]);
  return (
    <SearchPrimitive.Arrow class={cn("fill-popover stroke-border", local.class)} {...others} />
  );
};

type SearchListboxProps<T extends ValidComponent = "ul"> =
  SearchPrimitive.SearchListboxProps<T> & {
    class?: string | undefined;
  };

const SearchListbox = <T extends ValidComponent = "ul">(
  props: PolymorphicProps<T, SearchListboxProps<T>>
) => {
  const [local, others] = splitProps(props as SearchListboxProps, ["class"]);
  return <SearchPrimitive.Listbox class={cn("overflow-hidden p-1", local.class)} {...others} />;
};

type SearchSectionProps<T extends ValidComponent = "li"> =
  SearchPrimitive.SearchSectionProps<T> & {
    class?: string | undefined;
  };

const SearchSection = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, SearchSectionProps<T>>
) => {
  const [local, others] = splitProps(props as SearchSectionProps, ["class"]);
  return (
    <SearchPrimitive.Section
      class={cn("text-foreground overflow-hidden p-1", local.class)}
      {...others}
    />
  );
};

type SearchItemProps<T extends ValidComponent = "li"> = SearchPrimitive.SearchItemProps<T> & {
  class?: string | undefined;
};

const SearchItem = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, SearchItemProps<T>>
) => {
  const [local, others] = splitProps(props as SearchItemProps, ["class"]);
  return (
    <SearchPrimitive.Item
      class={cn(
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default items-center justify-start gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        local.class
      )}
      {...others}
    />
  );
};

type SearchItemLabelProps<T extends ValidComponent = "span"> =
  SearchPrimitive.SearchItemLabelProps<T> & {
    class?: string | undefined;
  };

const SearchItemLabel = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, SearchItemLabelProps<T>>
) => {
  const [local, others] = splitProps(props as SearchItemLabelProps, ["class"]);
  return (
    <SearchPrimitive.ItemLabel class={cn("text-left font-medium", local.class)} {...others} />
  );
};

type SearchItemDescriptionProps<T extends ValidComponent = "span"> =
  SearchPrimitive.SearchItemDescriptionProps<T> & {
    class?: string | undefined;
  };

const SearchItemDescription = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, SearchItemDescriptionProps<T>>
) => {
  const [local, others] = splitProps(props as SearchItemDescriptionProps, ["class"]);
  return (
    <SearchPrimitive.ItemDescription
      class={cn("text-muted-foreground text-left text-sm", local.class)}
      {...others}
    />
  );
};

type SearchNoResultProps<T extends ValidComponent = "div"> =
  SearchPrimitive.SearchNoResultProps<T> & {
    class?: string | undefined;
  };

const SearchNoResult = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SearchNoResultProps<T>>
) => {
  const [local, others] = splitProps(props as SearchNoResultProps, ["class"]);
  return (
    <SearchPrimitive.NoResult
      class={cn("text-muted-foreground px-2 py-1.5 text-sm", local.class)}
      {...others}
    />
  );
};

export {
  Search,
  SearchLabel,
  SearchDescription,
  SearchControl,
  SearchInput,
  SearchIndicator,
  SearchIcon,
  SearchPortal,
  SearchContent,
  SearchArrow,
  SearchListbox,
  SearchSection,
  SearchItem,
  SearchItemLabel,
  SearchItemDescription,
  SearchNoResult,
};
