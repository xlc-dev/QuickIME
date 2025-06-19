import * as wanakana from "wanakana";
import { createSignal, onMount } from "solid-js";

import { TextField, TextFieldTextArea } from "./ui/TextField";

export function IMEField() {
  const [input, setInput] = createSignal("");

  let textArea: HTMLTextAreaElement | undefined;

  onMount(() => {
    if (!textArea) {
      console.error("TextArea not found, could not bind wanakana");
      return;
    }
    wanakana.bind(textArea);
  });

  return (
    <TextField class="w-full">
      <TextFieldTextArea
        autoResize
        placeholder="Type your message here"
        ref={textArea}
        onInput={(e) => setInput(e.currentTarget.value)}
      />
    </TextField>
  );
}
