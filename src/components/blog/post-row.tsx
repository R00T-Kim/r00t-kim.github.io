"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { type Post, postSummary, postTitle } from "@/data/posts";
import { Bracket, Tags } from "@/components/ui/term";

interface PostRowProps {
  post: Post;
  showSeries?: boolean;
  /** Heading level: h3 under a section heading (home), h2 directly under a page title (blog). */
  heading?: "h2" | "h3";
}

export function PostRow({ post, showSeries = false, heading = "h3" }: PostRowProps) {
  const Heading = heading;
  const locale = useLocale();
  const tt = useTranslations("post_types");

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group -mx-2 grid gap-1 px-2 py-4 transition-colors hover:bg-muted/30 sm:grid-cols-[6.5rem_6.5rem_minmax(0,1fr)] sm:gap-x-4"
    >
      <time dateTime={post.date} className="font-mono text-xs text-muted-foreground sm:pt-1">
        {post.date}
      </time>
      <span className="sm:pt-1">
        <Bracket accent>{tt(post.type)}</Bracket>
        {locale !== post.lang && (
          <>
            {" "}
            <Bracket>{post.lang}</Bracket>
          </>
        )}
      </span>
      <span className="min-w-0">
        {showSeries && post.series && (
          <span className="mb-1 block font-mono text-xs text-muted-foreground">series/{post.series}</span>
        )}
        <Heading className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-accent md:text-base">
          {postTitle(post, locale)}
        </Heading>
        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{postSummary(post, locale)}</span>
        <Tags tags={post.tags} className="mt-1.5" />
      </span>
    </Link>
  );
}
