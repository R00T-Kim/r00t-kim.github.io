"use client";

import { useLocale, useTranslations } from "next-intl";
import { m } from "framer-motion";
import { Rss } from "lucide-react";
import { latestPosts } from "@/data/posts";
import { siteConfig } from "@/config/site";
import { SectionLabel } from "@/components/ui/section-label";
import { PostRow } from "@/components/blog/post-row";

const items = latestPosts(4);

export function RecentPosts() {
  const t = useTranslations("home.posts");
  const ts = useTranslations("home.sections");
  const locale = useLocale();

  return (
    <section id="posts" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionLabel
          index="02"
          label={ts("posts_label")}
          title={ts("posts_title")}
          aside={{ href: `/${locale}/blog`, label: t("all") }}
        />
        <ol className="divide-y divide-border border-b border-border">
          {items.map((post, i) => (
            <m.li
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <PostRow post={post} />
            </m.li>
          ))}
        </ol>
        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
          <span>{t("published_on")}</span>
          <a
            href={siteConfig.social.rss}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-accent"
          >
            <Rss className="h-3.5 w-3.5" />
            {t("rss")}
          </a>
        </p>
      </div>
    </section>
  );
}
