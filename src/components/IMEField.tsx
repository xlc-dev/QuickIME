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

async function fetchKanjiFromJisho(reading: string): Promise<string[]> {
  if (!reading) return [];
  const jishoUrl = "https://jisho.org/api/v1/search/words?keyword=" + encodeURIComponent(reading);
  const proxyUrl = "https://thingproxy.freeboard.io/fetch/" + encodeURIComponent(jishoUrl);
  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) return [];
    const json = (await res.json()) as JishoResponse;
    if (!json?.data) return [];
    const set = new Set(json.data.map((e) => e.japanese[0].word || e.japanese[0].reading));
    return Array.from(set);
  } catch {
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
    if (ta) {
      wanakana.bind(ta);
      ta.value = "";
      setInput("");
      ta.focus();
    }
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

  function handleKeyDown(
    e: KeyboardEvent & {
      currentTarget: HTMLTextAreaElement;
    }
  ) {
    if (isMenuOpen()) {
      const len = suggestions().length;
      if (len > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const newIndex = (selectedIndex() + 1) % len;
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
        if (e.key === "ArrowUp") {
          e.preventDefault();
          const newIndex = (selectedIndex() - 1 + len) % len;
          setSelectedIndex(newIndex);
          const item = itemRefs[newIndex];
          const container = listRef;
          if (item && container) {
            const itop = item.offsetTop;
            const ibot = itop + item.offsetHeight;
            const ctop = container.scrollTop;
            const cheight = container.clientHeight;
            if (itop < ctop) {
              container.scrollTop = itop;
            } else if (ibot > ctop + cheight) {
              container.scrollTop = ibot - cheight;
            }
          }
          return;
        }
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        commitSuggestion(selectedIndex());
        return;
      }
    }

    if (
      e.key === "Backspace" &&
      lastConversion() &&
      e.currentTarget.selectionStart === lastConversion()!.end &&
      e.currentTarget.selectionEnd === lastConversion()!.end
    ) {
      e.preventDefault();
      const conv = lastConversion()!;
      const before = input().slice(0, conv.start);
      const after = input().slice(conv.end);
      const newVal = before + conv.reading + after;
      setInput(newVal);
      const newPos = conv.start + conv.reading.length;
      if (ta) {
        ta.value = newVal;
        ta.setSelectionRange(newPos, newPos);
      }
      setConfirmedIndex(conv.start);
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
        const katakana = wanakana.toKatakana(reading);
        const before = input().slice(0, start);
        const after = input().slice(pos);
        const newVal = before + katakana + after;
        setInput(newVal);
        const end = before.length + katakana.length;
        if (ta) {
          ta.value = newVal;
          ta.setSelectionRange(end, end);
        }
        setLastConversion({
          confirmed: katakana,
          reading,
          start,
          end,
        });
        setConfirmedIndex(end);
        setIsComposing(false);
      }
      return;
    }

    if (e.key === " ") {
      const pos = e.currentTarget.selectionStart;
      const reading = input().slice(confirmedIndex(), pos);
      if (wanakana.isHiragana(reading) && reading.length) {
        e.preventDefault();
        setCompositionStart(confirmedIndex());
        setLookupReading(reading);
        setSelectedIndex(0);
        setIsMenuOpen(true);
        return;
      }
    }
  }

  function handleInput(
    e: InputEvent & {
      currentTarget: HTMLTextAreaElement;
    }
  ) {
    const val = e.currentTarget.value;
    setInput(val);
    setIsComposing(val.length > confirmedIndex());
    setLastConversion(null);
    if (isMenuOpen()) {
      setIsMenuOpen(false);
      setLookupReading(null);
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
                  <span>
                    {selectedIndex() + 1} / {suggestions().length}
                  </span>
                </div>
              </>
            </Show>
          </Suspense>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
