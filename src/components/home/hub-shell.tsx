"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import type { SearchEntry } from "@/lib/search-index";

interface Dir {
  name: string;
  href: string;
}

interface Entry {
  id: number;
  cmd: string;
  out: React.ReactNode;
}

const COMMANDS = [
  ["ls", "list the directories"],
  ["cd <dir>", "open about_me, blog or laboratory"],
  ["whoami", "who runs this box"],
  ["clear", "clear the screen"],
  ["<anything else>", "search posts, projects and research"],
] as const;

/** The live prompt left at the end of the home session: a handful of commands, everything else is a search. */
export function HubShell({ dirs, name }: { dirs: Dir[]; name: string }) {
  const t = useTranslations("hub");
  const locale = useLocale();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [recall, setRecall] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);
  const searchMod = useRef<typeof import("@/lib/search-index") | null>(null);

  // A plain keystroke anywhere on the page (nothing else focused, no modifier) starts typing here.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1 || event.key === " ") return;
      const active = document.activeElement;
      if (active && active !== document.body) return;
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const dirLinks = (
    <ul className="flex flex-wrap gap-x-6 gap-y-1">
      {dirs.map((dir) => (
        <li key={dir.name}>
          <Link href={dir.href} className="text-foreground transition-colors hover:text-accent">
            {dir.name}
            <span className="text-accent">/</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  const findDir = (arg: string) => dirs.find((dir) => dir.name === arg.replace(/^(\.\/|~\/)/, "").replace(/\/+$/, ""));

  const search = async (query: string): Promise<SearchEntry[]> => {
    searchMod.current ??= await import("@/lib/search-index");
    const { buildSearchIndex, searchEntries } = searchMod.current;
    return searchEntries(buildSearchIndex(locale), query, 5);
  };

  const run = async (raw: string): Promise<React.ReactNode> => {
    const [cmd = "", ...args] = raw.split(/\s+/);
    const arg = args.join(" ");
    switch (cmd) {
      case "help":
        return (
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-0.5">
            {COMMANDS.map(([usage, desc]) => (
              <div key={usage} className="contents">
                <dt className="text-foreground">{usage}</dt>
                <dd>{desc}</dd>
              </div>
            ))}
          </dl>
        );
      case "ls":
        return dirLinks;
      case "whoami":
        return `${siteConfig.author.alias} (${name})`;
      case "cd": {
        if (!arg || arg === "~" || arg === ".") return null;
        const dir = findDir(arg);
        if (!dir) return `cd: ${arg}: No such file or directory`;
        router.push(dir.href);
        return null;
      }
    }
    const results = await search(raw);
    if (!results.length) return `${cmd}: command not found. try 'help'`;
    return (
      <ul className="space-y-0.5">
        {results.map((entry) => (
          <li key={entry.id}>
            <span className="text-accent/70">{entry.kind}/ </span>
            {entry.external ? (
              <a href={entry.href} target="_blank" rel="noopener noreferrer" className="text-foreground transition-colors hover:text-accent">
                {entry.title}
              </a>
            ) : (
              <Link href={entry.href} className="text-foreground transition-colors hover:text-accent">
                {entry.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const raw = input.trim();
    setInput("");
    setRecall(null);
    if (raw === "clear") {
      setEntries([]);
      return;
    }
    const out = raw ? await run(raw) : null;
    setEntries((prev) => [...prev, { id: nextId.current++, cmd: raw, out }]);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const typed = entries.filter((entry) => entry.cmd).map((entry) => entry.cmd);
    if (event.key === "Tab") {
      // Complete a directory name after `cd`.
      const match = /^cd\s+(\S*)$/.exec(input);
      const hit = match && dirs.filter((dir) => dir.name.startsWith(match[1]));
      if (hit?.length === 1) {
        event.preventDefault();
        setInput(`cd ${hit[0].name}/`);
      }
    } else if (event.key === "ArrowUp" && typed.length) {
      event.preventDefault();
      const i = recall === null ? typed.length - 1 : Math.max(recall - 1, 0);
      setRecall(i);
      setInput(typed[i]);
    } else if (event.key === "ArrowDown" && recall !== null) {
      event.preventDefault();
      const i = recall + 1;
      setRecall(i < typed.length ? i : null);
      setInput(i < typed.length ? typed[i] : "");
    }
  };

  const prompt = (
    <>
      <span className="user">{siteConfig.author.alias}@kim</span>
      <span className="text-muted-foreground">:~ # </span>
    </>
  );

  return (
    <div className="font-mono text-sm" onClick={() => inputRef.current?.focus()}>
      <div aria-live="polite" className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id}>
            <p className="prompt">
              {prompt}
              <span className="cmd">{entry.cmd}</span>
            </p>
            {entry.out && <div className="mt-1 text-muted-foreground">{entry.out}</div>}
          </div>
        ))}
      </div>
      <form onSubmit={submit} className={entries.length ? "prompt mt-3 flex" : "prompt flex"}>
        <label htmlFor="hub-shell" className="shrink-0 whitespace-pre">
          {prompt}
        </label>
        <input
          ref={inputRef}
          id="hub-shell"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          aria-label={t("shell_label")}
          placeholder="help"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          className="min-w-0 flex-1 bg-transparent text-base text-foreground caret-accent outline-none placeholder:text-muted-foreground/50 sm:text-sm"
        />
      </form>
    </div>
  );
}
