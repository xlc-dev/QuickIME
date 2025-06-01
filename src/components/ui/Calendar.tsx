import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import type {
  NavProps,
  LabelProps,
  TableProps,
  HeadCellProps,
  CellProps,
  CellTriggerProps,
  DynamicProps,
} from "@corvu/calendar";

import CalendarPrimitive from "@corvu/calendar";

import { cn } from "~/utils";

type CalendarNavProps<T extends ValidComponent = "button"> = NavProps<T> & {
  class?: string;
};

const CalendarNav = <T extends ValidComponent = "button">(
  props: DynamicProps<T, CalendarNavProps<T>>
) => {
  const [, rest] = splitProps(props as CalendarNavProps, ["class"]);
  return (
    <CalendarPrimitive.Nav
      class={cn(
        "focus-visible:ring-ring inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm bg-transparent p-0 opacity-50 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50", // cursor-pointer already here, good.
        props.class
      )}
      {...rest}
    />
  );
};

type CalendarLabelProps<T extends ValidComponent = "div"> = LabelProps<T> & {
  class?: string;
};

const CalendarLabel = <T extends ValidComponent = "div">(
  props: DynamicProps<T, CalendarLabelProps<T>>
) => {
  const [, rest] = splitProps(props as CalendarLabelProps, ["class"]);
  return (
    <CalendarPrimitive.Label
      class={cn("text-sm leading-none font-medium", props.class)}
      {...rest}
    />
  );
};

type CalendarTableProps<T extends ValidComponent = "table"> = TableProps<T> & {
  class?: string;
};

const CalendarTable = <T extends ValidComponent = "table">(
  props: DynamicProps<T, CalendarTableProps<T>>
) => {
  const [, rest] = splitProps(props as CalendarTableProps, ["class"]);
  return (
    <CalendarPrimitive.Table
      class={cn("w-full table-fixed border-collapse", props.class)}
      {...rest}
    />
  );
};

type CalendarHeadCellProps<T extends ValidComponent = "th"> = HeadCellProps<T> & {
  class?: string;
};

const CalendarHeadCell = <T extends ValidComponent = "th">(
  props: DynamicProps<T, CalendarHeadCellProps<T>>
) => {
  const [, rest] = splitProps(props as CalendarHeadCellProps, ["class"]);
  return (
    <CalendarPrimitive.HeadCell
      class={cn(
        "text-muted-foreground h-8 w-8 text-center align-middle text-[0.8rem] font-normal",
        props.class
      )}
      {...rest}
    />
  );
};

type CalendarCellProps<T extends ValidComponent = "td"> = CellProps<T> & {
  class?: string;
};

const CalendarCell = <T extends ValidComponent = "td">(
  props: DynamicProps<T, CalendarCellProps<T>>
) => {
  const [, rest] = splitProps(props as CalendarCellProps, ["class"]);
  return (
    <CalendarPrimitive.Cell
      class={cn(
        "relative h-8 w-8 border-none p-0 text-center align-middle text-sm focus-within:relative focus-within:z-20",
        "has-data-range-end:rounded-r-md has-data-range-start:rounded-l-md",
        "has-data-in-range:bg-info/70 has-[[disabled]]:opacity-40",
        "has-data-in-range:first:rounded-l-md has-data-in-range:last:rounded-r-md",
        props.class
      )}
      {...rest}
    />
  );
};

type CalendarCellTriggerProps<T extends ValidComponent = "button"> = CellTriggerProps<T> & {
  class?: string;
};

const CalendarCellTrigger = <T extends ValidComponent = "button">(
  props: DynamicProps<T, CalendarCellTriggerProps<T>>
) => {
  const [, rest] = splitProps(props as CalendarCellTriggerProps, ["class"]);
  return (
    <CalendarPrimitive.CellTrigger
      class={cn(
        "ring-offset-background focus-visible:ring-ring inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-0 text-sm font-normal transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:bg-accent/80",
        "data-[today]:bg-accent/50 data-[today]:text-accent-foreground data-[today]:font-semibold",
        "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground",
        "data-[range-start]:bg-primary data-[range-start]:text-primary-foreground",
        "data-[range-end]:bg-primary data-[range-end]:text-primary-foreground",
        "lg:hover:not([data-selected]):not([data-range-start]):not([data-range-end]):bg-accent/80",
        "data-[outside]:text-muted-foreground data-[outside]:opacity-50",
        props.class
      )}
      {...rest}
    />
  );
};

type CalendarWrapperProps = {
  class?: string;
  children?: JSX.Element;
};

const CalendarWrapper: Component<CalendarWrapperProps> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);
  return (
    <div
      class={cn("bg-background relative rounded-md border p-3 shadow-sm", props.class)}
      {...rest}>
      {props.children}
    </div>
  );
};

const CalendarHeader: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <div class={cn("relative mb-3 flex h-7 items-center justify-center", props.class)} {...rest} />
  );
};

const CalendarMonths: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return <div class={cn("space-y-4 md:flex md:space-y-0 md:space-x-4", props.class)} {...rest} />;
};

export {
  CalendarPrimitive as Calendar,
  CalendarNav,
  CalendarLabel,
  CalendarTable,
  CalendarHeadCell,
  CalendarCell,
  CalendarCellTrigger,
  CalendarWrapper,
  CalendarHeader,
  CalendarMonths,
};
