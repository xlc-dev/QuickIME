import { Show } from "solid-js";

export default function Info(props: {
  showTitle: CallableFunction;
  showExplanation: CallableFunction;
}) {
  return (
    <>
      <Show when={props.showTitle()}>
        <h1 class="flex flex-col items-center text-3xl font-semibold sm:text-4xl">
          <img src="icon.png" alt="" class="mb-2 h-10 w-10 lg:h-16 lg:w-16" />
          <p>
            QuickIME – An Input Method Editor that <span class="text-primary">doesn't suck</span>
          </p>
        </h1>
      </Show>

      <Show when={props.showExplanation()}>
        <p class="text-muted-foreground mx-auto mt-4 max-w-xl text-base sm:text-lg">
          Tired of clunky setups, invasive tracking, and unreliable input methods? QuickIME is
          fast, private, and a simple web-based alternative to other IME's that just works.
        </p>
      </Show>
    </>
  );
}
