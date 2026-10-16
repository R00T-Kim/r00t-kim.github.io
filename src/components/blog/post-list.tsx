"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { type PostType, postSummary, postTitle, postTypes, sortedPosts } from "@/data/posts";
import { siteConfig } from "@/config/site";
import { PostRow } from "@/components/blog/post-row";
import { Cmd } from "@/components/ui/term";
import { cn } from "@/lib/utils";

const allPosts = sortedPosts();

export function PostList() {
  const t = useTranslations("blog_page");
  const tt = useTranslations("post_types");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<PostType | "all">("all");

  const needle = query.trim().toLowerCase();
  const filtered = allPosts.filter((post) => {
    if (type !== "all" && post.type !== type) return false;
    if (!needle) return true;
    return [postTitle(post, locale), post.title, postSummary(post, locale), post.series ?? "", ...post.tags]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  const filters: (PostType | "all")[] = ["all", ...postTypes];

  return (
    <div className="font-mono">
      {/* filters as a flag line: --type=all | analysis | note | retrospective */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm" role="group" aria-label={t("title")}>
        <span className="text-muted-foreground">--type=</span>
        {filters.map((key, i) => (
          <span key={key} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden="true" className="text-border">|</span>}
            <button
              type="button"
              aria-pressed={type === key}
              onClick={() => setType(key)}
              className={cn(
                "transition-colors",
                type === key ? "text-accent underline underline-offset-4" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {key === "all" ? t("all_types") : tt(key)}
            </button>
          </span>
        ))}
      </div>

      {/* search as a grep prompt */}
      <label className="mt-3 flex items-center gap-2 border-b border-border pb-2 text-sm">
        <span className="shrink-0 text-muted-foreground">
          <span className="text-accent/70">#</span> grep -i &quot;
        </span>
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("search_placeholder")}
          className="min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus-visible:outline-none"
        />
        <span className="shrink-0 text-muted-foreground">&quot; blog/</span>
      </label>

      <p className="mt-5 text-xs text-muted-foreground" aria-live="polite">
        {t("count", { count: filtered.length })}
      </p>

      <ol className="mt-1 divide-y divide-border border-y border-border">
        {filtered.map((post) => (
          <li key={post.id}>
            <PostRow post={post} showSeries heading="h2" />
          </li>
        ))}
      </ol>
      {filtered.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">{t("empty")}</p>}

      <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <span>{t("published_on")}</span>
        <Cmd href={siteConfig.social.blog} className="text-xs">
          open blog
        </Cmd>
      </p>
    </div>
  );
}
