import type { ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as FileFieldPrimitive from "@kobalte/core/file-field";

import { cn } from "~/utils";

const FileField = FileFieldPrimitive.Root;

const FileFieldHiddenInput = FileFieldPrimitive.HiddenInput;

const FileFieldTrigger = FileFieldPrimitive.Trigger;

type FileFieldDropzoneProps<T extends ValidComponent = "div"> =
  FileFieldPrimitive.FileFieldDropzoneProps<T> & {
    class?: string | undefined;
  };

const FileFieldDropzone = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, FileFieldDropzoneProps<T>>
) => {
  const [local, others] = splitProps(props as FileFieldDropzoneProps, ["class"]);
  return (
    <FileFieldPrimitive.Dropzone
      class={cn(
        "border-input hover:bg-accent/50 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors",
        local.class
      )}
      {...others}
    />
  );
};

type FileFieldLabelProps<T extends ValidComponent = "label"> =
  FileFieldPrimitive.FileFieldLabelProps<T> & {
    class?: string | undefined;
  };

const FileFieldLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, FileFieldLabelProps<T>>
) => {
  const [local, others] = splitProps(props as FileFieldLabelProps, ["class"]);
  return (
    <FileFieldPrimitive.Label
      class={cn(
        "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        local.class
      )}
      {...others}
    />
  );
};

type FileFieldItemListProps<T extends ValidComponent = "ul"> =
  FileFieldPrimitive.FileFieldItemListProps<T> & {
    class?: string | undefined;
  };

const FileFieldItemList = <T extends ValidComponent = "ul">(
  props: PolymorphicProps<T, FileFieldItemListProps<T>>
) => {
  const [local, others] = splitProps(props as FileFieldItemListProps, ["class"]);
  return <FileFieldPrimitive.ItemList class={cn("mt-2 space-y-2", local.class)} {...others} />;
};

type FileFieldItemProps<T extends ValidComponent = "li"> =
  FileFieldPrimitive.FileFieldItemRootProps<T> & {
    class?: string | undefined;
  };

const FileFieldItem = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, FileFieldItemProps<T>>
) => {
  const [local, others] = splitProps(props as FileFieldItemProps, ["class"]);
  return (
    <FileFieldPrimitive.Item
      class={cn(
        "border-border bg-card text-card-foreground flex items-center justify-between rounded-lg border p-3",
        local.class
      )}
      {...others}
    />
  );
};

type FileFieldItemPreviewImageProps<T extends ValidComponent = "img"> =
  FileFieldPrimitive.FileFieldItemPreviewImageProps<T> & {
    class?: string | undefined;
  };

const FileFieldItemPreviewImage = <T extends ValidComponent = "img">(
  props: PolymorphicProps<T, FileFieldItemPreviewImageProps<T>>
) => {
  const [local, others] = splitProps(props as FileFieldItemPreviewImageProps, ["class"]);
  return (
    <FileFieldPrimitive.ItemPreviewImage
      class={cn("h-12 w-12 rounded object-cover", local.class)}
      {...others}
    />
  );
};

type FileFieldItemNameProps<T extends ValidComponent = "span"> =
  FileFieldPrimitive.FileFieldItemNameProps<T> & {
    class?: string | undefined;
  };

const FileFieldItemName = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, FileFieldItemNameProps<T>>
) => {
  const [local, others] = splitProps(props as FileFieldItemNameProps, ["class"]);
  return (
    <FileFieldPrimitive.ItemName class={cn("truncate font-medium", local.class)} {...others} />
  );
};

type FileFieldItemSizeProps<T extends ValidComponent = "span"> =
  FileFieldPrimitive.FileFieldItemSizeProps<T> & {
    class?: string | undefined;
  };

const FileFieldItemSize = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, FileFieldItemSizeProps<T>>
) => {
  const [local, others] = splitProps(props as FileFieldItemSizeProps, ["class"]);
  return (
    <FileFieldPrimitive.ItemSize
      class={cn("text-muted-foreground text-sm", local.class)}
      {...others}
    />
  );
};

type FileFieldItemDeleteTriggerProps<T extends ValidComponent = "button"> =
  FileFieldPrimitive.FileFieldItemDeleteTriggerProps<T> & {
    class?: string | undefined;
  };

const FileFieldItemDeleteTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, FileFieldItemDeleteTriggerProps<T>>
) => {
  const [local, others] = splitProps(props as FileFieldItemDeleteTriggerProps, ["class"]);
  return (
    <FileFieldPrimitive.ItemDeleteTrigger
      class={cn(
        "text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring inline-flex h-6 w-6 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        local.class
      )}
      {...others}
    />
  );
};

type FileFieldDescriptionProps<T extends ValidComponent = "div"> =
  FileFieldPrimitive.FileFieldDescriptionProps<T> & {
    class?: string | undefined;
  };

const FileFieldDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, FileFieldDescriptionProps<T>>
) => {
  const [local, others] = splitProps(props as FileFieldDescriptionProps, ["class"]);
  return (
    <FileFieldPrimitive.Description
      class={cn("text-muted-foreground text-sm", local.class)}
      {...others}
    />
  );
};

type FileFieldErrorMessageProps<T extends ValidComponent = "div"> =
  FileFieldPrimitive.FileFieldErrorMessageProps<T> & {
    class?: string | undefined;
  };

const FileFieldErrorMessage = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, FileFieldErrorMessageProps<T>>
) => {
  const [local, others] = splitProps(props as FileFieldErrorMessageProps, ["class"]);
  return (
    <FileFieldPrimitive.ErrorMessage
      class={cn("text-destructive text-sm font-medium", local.class)}
      {...others}
    />
  );
};

export {
  FileField,
  FileFieldHiddenInput,
  FileFieldDropzone,
  FileFieldTrigger,
  FileFieldLabel,
  FileFieldItemList,
  FileFieldItem,
  FileFieldItemPreviewImage,
  FileFieldItemName,
  FileFieldItemSize,
  FileFieldItemDeleteTrigger,
  FileFieldDescription,
  FileFieldErrorMessage,
};
