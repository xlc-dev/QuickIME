import * as wanakana from "wanakana";
import {
  createSignal,
  createResource,
  createEffect,
  createMemo,
  For,
  onMount,
  onCleanup,
  Suspense,
  Show,
} from "solid-js";
import SvgSpinners180Ring from "~icons/svg-spinners/180-ring";

import { TextField, TextFieldTextArea } from "./ui/TextField";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

type JishoJapanese = { word?: string; reading: string };
type JishoEntry = { japanese: JishoJapanese[] };
type JishoResponse = { data: JishoEntry[] };

type LastConversion = {
  confirmed: string;
  reading: string;
  start: number;
  end: number;
};

const JISHO_PROXY_BASE = "https://cors-anywhere.com/";

async function fetchKanjiFromJisho(reading: string): Promise<string[]> {
  if (!reading) {
    return [];
  }

  const jishoTargetUrl =
    "https://jisho.org/api/v1/search/words?keyword=" + encodeURIComponent(reading);

  const proxyUrl = JISHO_PROXY_BASE + jishoTargetUrl;

  try {
    const res = await fetch(proxyUrl);

    if (!res.ok) {
      console.error(`Error fetching from CORS Anywhere proxy: ${res.status} ${res.statusText}`);
      try {
        const errorText = await res.text();
        console.error("Proxy error response:", errorText);
      } catch (e) {
        console.error("Could not read error response text:", e);
      }
      return [];
    }

    const json = (await res.json()) as JishoResponse;

    if (!json?.data) {
      return [];
    }

    const uniqueWords = new Set(json.data.map((e) => e.japanese[0].word || e.japanese[0].reading));

    return Array.from(uniqueWords);
  } catch (error) {
    console.error("Error in fetchKanjiFromJisho:", error);
    return [];
  }
}

const Spinner = () => (
  <div class="flex items-center justify-center p-2">
    <SvgSpinners180Ring class="size-5 animate-spin" />
  </div>
);

export function IMEField() {
  const [input, setInput] = createSignal("");
  const [compositionStart, setCompositionStart] = createSignal(0);
  const [lookupReading, setLookupReading] = createSignal<string | null>(null);
  const [suggestions] = createResource(lookupReading, fetchKanjiFromJisho, {
    initialValue: [],
  });
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  const [confirmedIndex, setConfirmedIndex] = createSignal(0);
  const [isComposing, setIsComposing] = createSignal(false);
  const [lastConversion, setLastConversion] = createSignal<LastConversion | null>(null);

  let ta: HTMLTextAreaElement | undefined;
  let itemRefs: HTMLDivElement[] = [];
  let listRef: HTMLDivElement | undefined;

  const confirmedText = createMemo(() => input().slice(0, confirmedIndex()));
  const unconfirmedText = createMemo(() => input().slice(confirmedIndex()));

  onMount(() => {
    if (!ta) return;
    wanakana.bind(ta);
    ta.value = "";
    setInput("");
    ta.focus();
  });

  onCleanup(() => {
    if (ta) wanakana.unbind(ta);
  });

  createEffect(() => {
    suggestions();
    itemRefs = [];
    setSelectedIndex(0);
  });

  function commitSuggestion(idx: number) {
    const val = input();
    const start = compositionStart();
    const cands = suggestions();
    const reading = lookupReading();
    if (!reading) return;
    const cand = idx >= 0 && cands[idx] ? cands[idx] : reading;
    const before = val.slice(0, start);
    const after = val.slice(start + reading.length);
    const newVal = before + cand + after;
    setInput(newVal);
    const newPos = before.length + cand.length;
    if (ta) {
      ta.value = newVal;
      ta.setSelectionRange(newPos, newPos);
    }
    setLastConversion({
      confirmed: cand,
      reading,
      start,
      end: newPos,
    });
    setLookupReading(null);
    setSelectedIndex(0);
    setIsMenuOpen(false);
    setIsComposing(false);
    setConfirmedIndex(newPos);
    setTimeout(() => ta?.focus(), 0);
  }

  function handleKeyDown(e: KeyboardEvent & { currentTarget: HTMLTextAreaElement }) {
    if (isMenuOpen()) {
      const len = suggestions().length;
      if (len > 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        e.preventDefault();
        const delta = e.key === "ArrowDown" ? 1 : -1;
        const newIndex = (selectedIndex() + delta + len) % len;
        setSelectedIndex(newIndex);
        const item = itemRefs[newIndex];
        const container = listRef;
        if (item && container) {
          const itop = item.offsetTop;
          const ibot = itop + item.offsetHeight;
          const ctop = container.scrollTop;
          const cheight = container.clientHeight;
          if (ibot > ctop + cheight) {
            container.scrollTop = ibot - cheight;
          } else if (itop < ctop) {
            container.scrollTop = itop;
          }
        }
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        commitSuggestion(selectedIndex());
      }
      return;
    }

    const lc = lastConversion();
    if (
      e.key === "Backspace" &&
      lc &&
      e.currentTarget.selectionStart === lc.end &&
      e.currentTarget.selectionEnd === lc.end
    ) {
      e.preventDefault();
      const before = input().slice(0, lc.start);
      const after = input().slice(lc.end);
      const newVal = before + lc.reading + after;
      setInput(newVal);
      const newPos = lc.start + lc.reading.length;
      if (ta) {
        ta.value = newVal;
        ta.setSelectionRange(newPos, newPos);
      }
      setConfirmedIndex(lc.start);
      setIsComposing(true);
      setLastConversion(null);
      return;
    }

    if (e.key === "Enter" && isComposing()) {
      e.preventDefault();
      setIsComposing(false);
      setConfirmedIndex(e.currentTarget.selectionStart);
      setLastConversion(null);
      return;
    }

    if (e.key === " " && e.shiftKey && isComposing()) {
      e.preventDefault();
      const start = confirmedIndex();
      const pos = e.currentTarget.selectionStart;
      const reading = input().slice(start, pos);
      if (wanakana.isHiragana(reading)) {
        const kata = wanakana.toKatakana(reading);
        const before = input().slice(0, start);
        const after = input().slice(pos);
        const newVal = before + kata + after;
        setInput(newVal);
        const end = before.length + kata.length;
        if (ta) {
          ta.value = newVal;
          ta.setSelectionRange(end, end);
        }
        setLastConversion({
          confirmed: kata,
          reading,
          start,
          end,
        });
        setConfirmedIndex(end);
        setIsComposing(false);
      }
      return;
    }
  }

  function handleInput(e: InputEvent & { currentTarget: HTMLTextAreaElement }) {
    const val = e.currentTarget.value;
    setInput(val);
    setIsComposing(val.length > confirmedIndex());
    setLastConversion(null);

    if (e.inputType === "insertText" && e.data === " " && isComposing()) {
      const start = confirmedIndex();
      const pos = e.currentTarget.selectionStart;
      const reading = val.slice(start, pos - 1);
      if (wanakana.isHiragana(reading) && reading.length) {
        setCompositionStart(start);
        setLookupReading(reading);
        setSelectedIndex(0);
        setIsMenuOpen(true);
      }
    }
  }

  function handleCompositionStart(e: CompositionEvent & { currentTarget: HTMLTextAreaElement }) {
    setIsComposing(true);
    setCompositionStart(e.currentTarget.selectionStart);
  }

  function handleCompositionEnd(e: CompositionEvent & { currentTarget: HTMLTextAreaElement }) {
    setIsComposing(false);
    const start = compositionStart();
    const pos = e.currentTarget.selectionStart;
    const reading = input().slice(start, pos);
    if (wanakana.isHiragana(reading) && reading.length) {
      setLookupReading(reading);
      setSelectedIndex(0);
      setIsMenuOpen(true);
    }
  }

  return (
    <div class="relative w-full">
      <DropdownMenu open={isMenuOpen()} onOpenChange={setIsMenuOpen} placement="bottom-start">
        <DropdownMenuTrigger as="div" class="w-full outline-none" disabled>
          <TextField>
            <div class="relative w-full">
              <div
                aria-hidden="true"
                class="pointer-events-none absolute inset-0 px-3 py-2 text-base whitespace-pre-wrap select-none">
                <span>{confirmedText()}</span>
                <span class="border-b border-dotted border-current">{unconfirmedText()}</span>
              </div>
              <TextFieldTextArea
                autoResize
                placeholder="Type here..."
                ref={ta}
                value={input()}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                class="caret-foreground bg-transparent text-transparent"
              />
            </div>
          </TextField>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            ta?.focus();
          }}
          class="w-[var(--kb-popper-content-width)]">
          <Suspense fallback={<Spinner />}>
            <Show
              when={suggestions()?.length > 0}
              fallback={
                <div class="text-muted-foreground px-2 py-1.5 text-sm">No results found.</div>
              }>
              <>
                <div ref={listRef} class="max-h-[13rem] overflow-y-auto">
                  <For each={suggestions()}>
                    {(s, idx) => (
                      <DropdownMenuItem
                        ref={(el) => (itemRefs[idx()] = el!)}
                        onSelect={() => commitSuggestion(idx())}
                        onFocus={() => setSelectedIndex(idx())}
                        data-highlighted={selectedIndex() === idx()}
                        class="data-[highlighted=true]:bg-accent data-[highlighted=true]:text-accent-foreground scroll-m-1">
                        {s}
                      </DropdownMenuItem>
                    )}
                  </For>
                </div>
                <div class="text-muted-foreground flex items-center justify-end border-t px-2 py-1.5 text-xs">
                  {selectedIndex() + 1} / {suggestions().length}
                </div>
              </>
            </Show>
          </Suspense>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
