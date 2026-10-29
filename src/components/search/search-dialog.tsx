"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, CornerDownLeft, Search, X } from "lucide-react";
import type { SearchEntry } from "@/lib/search-index";
import { cn } from "@/lib/utils";

type IndexModule = typeof import("@/lib/search-index");

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const t = useTranslations("search");
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [searchFn, setSearchFn] = useState<IndexModule["searchEntries"] | null>(null);
  const [cursor, setCursor] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  // Load the index only when the dialog is first opened.
  useEffect(() => {
    if (!open || index) return;
    let cancelled = false;
    import("@/lib/search-index").then((mod) => {
      if (cancelled) return;
      setIndex(mod.buildSearchIndex(locale));
      setSearchFn(() => mod.searchEntries);
    });
    return () => {
      cancelled = true;
    };
  }, [open, index, locale]);

  const results = index && searchFn ? searchFn(index, query) : [];
  const activeIndex = Math.min(cursor, Math.max(results.length - 1, 0));

  const go = (entry: SearchEntry) => {
    onOpenChange(false);
    if (entry.external) {
      window.open(entry.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(entry.href);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      go(results[activeIndex]);
    }
  };

  useEffect(() => {
    const item = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          setQuery("");
          setCursor(0);
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed top-[12vh] left-1/2 z-[70] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-card shadow-2xl focus:outline-none"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{t("title")}</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCursor(0);
              }}
              onKeyDown={onKeyDown}
              placeholder={t("placeholder")}
              aria-label={t("title")}
              className="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none"
            />
            <Dialog.Close
              aria-label={t("close")}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <ul ref={listRef} className="max-h-[50vh] overflow-y-auto py-2" role="listbox">
            {results.map((entry, i) => (
              <li key={entry.id} role="option" aria-selected={i === activeIndex}>
                <button
                  type="button"
                  onClick={() => go(entry)}
                  onMouseEnter={() => setCursor(i)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                    i === activeIndex ? "bg-accent/10" : "hover:bg-muted/50"
                  )}
                >
                  <span className="w-16 shrink-0 font-mono text-xs uppercase tracking-wider text-accent">
                    {t(`kind_${entry.kind}`)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-foreground">
                      {entry.title}
                    </span>
                    {entry.subtitle && (
                      <span className="block truncate font-mono text-xs text-muted-foreground">
                        {entry.subtitle}
                      </span>
                    )}
                  </span>
                  {entry.external ? (
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  ) : (
                    <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                </button>
              </li>
            ))}
            {index && results.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                {t("empty")}
              </li>
            )}
          </ul>

          <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2 font-mono text-xs text-muted-foreground">
            <span>{t("hint")}</span>
            <span className="hidden gap-3 sm:flex">
              <span>↑↓ {t("navigate")}</span>
              <span>↵ {t("select")}</span>
              <span>esc {t("close")}</span>
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
