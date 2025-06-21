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
import CopyIcon from "~icons/material-symbols/content-copy";
import CheckIcon from "~icons/material-symbols/check";

import { TextField, TextFieldTextArea } from "./ui/TextField";
import { Button } from "./ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

import { createStorageSignal } from "~/utils";

type JishoJapanese = {
  word?: string;
  reading: string;
};
type JishoEntry = {
  japanese: JishoJapanese[];
};
type JishoResponse = {
  data: JishoEntry[];
};

type LastConversion = {
  confirmed: string;
  reading: string;
  start: number;
  end: number;
};

const [jishoCache, setJishoCache] = createStorageSignal<Record<string, string[]>>(
  "jisho-cache",
  {}
);

async function fetchKanjiFromJisho(reading: string): Promise<string[]> {
  if (!reading) return [];

  const cache = jishoCache();
  if (cache[reading]) {
    return cache[reading];
  }

  const JISHO_PROXY_BASE = "https://cors-anywhere.com/";
  const jishoUrl = "https://jisho.org/api/v1/search/words?keyword=" + encodeURIComponent(reading);

  const proxyUrl = JISHO_PROXY_BASE + jishoUrl;
  const hiragana = wanakana.toHiragana(reading);
  const katakana = wanakana.toKatakana(reading);

  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) {
      console.error(`Error fetching from CORS proxy: ${res.status} ${res.statusText}`);
      return [hiragana, katakana];
    }
    const json = (await res.json()) as JishoResponse;
    if (!json?.data) return [hiragana, katakana];

    const unique = new Set(json.data.map((e) => e.japanese[0].word || e.japanese[0].reading));
    const results = [...new Set([hiragana, katakana, ...Array.from(unique)])];

    setJishoCache((prev) => ({ ...prev, [reading]: results }));
    return results;
  } catch (e) {
    console.error("fetchKanjiFromJisho error", e);
    return [hiragana, katakana];
  }
}

const Spinner = () => (
  <div class="flex items-center justify-center p-2">
    <SvgSpinners180Ring class="size-5 animate-spin" />
  </div>
);

export function IMEField() {
  const [lookupReading, setLookupReading] = createSignal<string | null>(null);
  const [suggestions] = createResource(lookupReading, fetchKanjiFromJisho, {
    initialValue: [],
  });
  const [input, setInput] = createSignal("");
  const [compositionStart, setCompositionStart] = createSignal(0);
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  const [confirmedIndex, setConfirmedIndex] = createSignal(0);
  const [isComposing, setIsComposing] = createSignal(false);
  const [conversionHistory, setConversionHistory] = createSignal<LastConversion[]>([]);
  const [copied, setCopied] = createSignal(false);

  let ta: HTMLTextAreaElement | undefined;
  let listRef: HTMLDivElement | undefined;
  let itemRefs: HTMLDivElement[] = [];

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

  createEffect(() => {
    if (!isMenuOpen() || !listRef || itemRefs.length === 0) return;
    const idx = selectedIndex();
    const item = itemRefs[idx];
    const container = listRef!;
    if (!item) return;
    const it = item.offsetTop,
      ib = it + item.offsetHeight,
      ct = container.scrollTop,
      ch = container.clientHeight;
    if (ib > ct + ch) container.scrollTop = ib - ch;
    else if (it < ct) container.scrollTop = it;
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
    setConversionHistory((prev) => [...prev, { confirmed: cand, reading, start, end: newPos }]);
    setLookupReading(null);
    setSelectedIndex(0);
    setIsMenuOpen(false);
    setIsComposing(false);
    setConfirmedIndex(newPos);
    setTimeout(() => ta?.focus(), 0);
  }

  function handleConvert() {
    const start = confirmedIndex();
    const reading = input().slice(start);
    if (wanakana.isHiragana(reading) && reading.length) {
      setCompositionStart(start);
      setLookupReading(reading);
      setSelectedIndex(0);
      setIsMenuOpen(true);
    }
  }

  function handleKeyDown(e: KeyboardEvent & { currentTarget: HTMLTextAreaElement }) {
    if (isMenuOpen()) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        commitSuggestion(selectedIndex());
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions().length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions().length) % suggestions().length);
      }
      return;
    }

    const history = conversionHistory();
    const lc = history.length > 0 ? history[history.length - 1] : null;

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
      setConversionHistory((prev) => prev.slice(0, -1));
      return;
    }

    if (e.key === "Enter" && isComposing()) {
      e.preventDefault();
      const end = e.currentTarget.selectionStart;
      setConfirmedIndex(end);
      setIsComposing(false);
      setConversionHistory([]);
    }

    if (e.key === " " && isComposing()) {
      e.preventDefault();
      handleConvert();
    }
  }

  function handleInput(e: InputEvent & { currentTarget: HTMLTextAreaElement }) {
    const val = e.currentTarget.value;
    setInput(val);

    const lastCommittedCharIndex = confirmedIndex();
    if (input().length < lastCommittedCharIndex) {
      setConversionHistory([]);
    }

    let currentConfirmedIndex = confirmedIndex();

    if (val.length < currentConfirmedIndex) {
      currentConfirmedIndex = val.length;
      setConfirmedIndex(currentConfirmedIndex);
    }

    setIsComposing(val.length > currentConfirmedIndex);
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

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(input());
      setCopied(true);
      ta?.focus();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard write failed", err);
    }
  }

  return (
    <div class="relative w-full">
      <DropdownMenu open={isMenuOpen()} onOpenChange={setIsMenuOpen} placement="bottom-start">
        <DropdownMenuTrigger as="div" class="w-full outline-none" disabled>
          <TextField>
            <div class="relative w-full">
              <div class="absolute top-2 right-2 z-20 flex items-center space-x-2">
                <Show when={unconfirmedText().length > 0 && !isMenuOpen()}>
                  <Button
                    onClick={handleConvert}
                    size="sm"
                    variant="default"
                    class="block lg:hidden">
                    Convert
                  </Button>
                </Show>
                <Show when={input().length > 0}>
                  <Button onClick={handleCopy} size="sm" variant="outline">
                    <Show
                      when={copied()}
                      fallback={
                        <>
                          <CopyIcon class="h-4 w-4" />
                          <span>Copy</span>
                        </>
                      }>
                      <CheckIcon class="h-4 w-4" />
                      <span>Copied!</span>
                    </Show>
                  </Button>
                </Show>
              </div>
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
                autocorrect="off"
                autocapitalize="off"
                spellcheck={false}
              />
            </div>
          </TextField>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            ta?.focus();
          }}>
          <Suspense fallback={<Spinner />}>
            <Show
              when={suggestions()?.length > 0}
              fallback={
                <div class="text-muted-foreground px-2 py-1.5 text-sm">No results found.</div>
              }>
              <div ref={listRef} class="max-h-[13rem] overflow-y-auto">
                <For each={suggestions()}>
                  {(s, idx) => (
                    <DropdownMenuItem
                      ref={(el) => (itemRefs[idx()] = el)}
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
            </Show>
          </Suspense>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
