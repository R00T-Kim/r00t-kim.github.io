"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { m } from "framer-motion";
import { ArrowRight, ExternalLink, FileText } from "lucide-react";
import { featuredResearch, type FeaturedItem } from "@/data/featured";
import { postById } from "@/data/posts";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

const inView = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export function FeaturedResearch() {
  const t = useTranslations("home.featured");
  const ts = useTranslations("home.sections");
  const locale = useLocale();
  const [main, ...rest] = featuredResearch;

  return (
    <section id="featured" className="bg-section-alt py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionLabel
          index="01"
          label={ts("featured_label")}
          title={ts("featured_title")}
          aside={{ href: `/${locale}/about_me#career-highlights`, label: t("all") }}
        />
        <div className="grid gap-4">
          <FeaturedCard item={main} large />
          <div className="grid gap-4 md:grid-cols-2">
            {rest.map((item, i) => (
              <FeaturedCard key={item.id} item={item} index={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({
  item,
  large = false,
  index = 0,
}: {
  item: FeaturedItem;
  large?: boolean;
  index?: number;
}) {
  const t = useTranslations("home.featured");
  const locale = useLocale();
  const isKo = locale === "ko";
  const pick = (ko: string, en: string) => (isKo ? ko : en);
  const related = item.relatedPostId ? postById(item.relatedPostId) : undefined;

  return (
    <m.article
      {...inView}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className={cn(
        "group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/40",
        large && "md:p-8 lg:grid lg:grid-cols-[1.15fr_1fr] lg:gap-x-12"
      )}
    >
      <div className={cn(large && "flex flex-col")}>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          {pick(item.kicker, item.kickerEn)}
        </p>
        <h3
          className={cn(
            "mt-3 font-bold tracking-tight text-foreground",
            large ? "text-2xl md:text-3xl" : "text-lg"
          )}
        >
          <Link
            href={`/${locale}${item.href}`}
            className="after:absolute after:inset-0 after:rounded-xl"
          >
            {pick(item.title, item.titleEn)}
          </Link>
        </h3>

        <dl className="mt-5 grid gap-4 text-sm">
          <Row label={t("target")} value={pick(item.target, item.targetEn)} />
          <Row label={t("work")} value={pick(item.work, item.workEn)} />
          <Row label={t("result")} value={pick(item.result, item.resultEn)} strong />
        </dl>
      </div>

      {large && item.stats && (
        <div className="mt-6 flex flex-col justify-center lg:mt-0">
          <ChainDiagram count={Number(item.stats[0].value) || 5} />
          <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
            {item.stats.map((stat) => (
              <div key={stat.labelEn} className="bg-card px-4 py-3">
                <div className="font-mono text-xl font-semibold text-foreground">
                  {stat.value}
                </div>
                <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {pick(stat.label, stat.labelEn)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={cn("mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-sm", large && "lg:col-span-2")}>
        <span className="inline-flex items-center gap-1 font-medium text-accent">
          {t("read_more")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
        {item.external && (
          <a
            href={item.external.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {pick(item.external.label, item.external.labelEn)}
          </a>
        )}
        {related && (
          <a
            href={related.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <FileText className="h-3.5 w-3.5" />
            {t("related_post")}
          </a>
        )}
      </div>

      <div className={cn("mt-4 flex flex-wrap gap-x-3 gap-y-1", large && "lg:col-span-2")}>
        {item.tags.map((tag) => (
          <span key={tag} className="font-mono text-[11px] text-muted-foreground">
            #{tag}
          </span>
        ))}
      </div>
    </m.article>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1 leading-relaxed",
          strong ? "font-medium text-foreground" : "text-foreground/80"
        )}
      >
        {value}
      </dd>
    </div>
  );
}

/** Abstract chain: numbered findings linked in series toward a verified demo. */
function ChainDiagram({ count }: { count: number }) {
  const width = 600;
  const height = 72;
  const startX = 36;
  const gap = 84;
  const endX = startX + gap * count;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block h-auto w-full"
      aria-hidden="true"
      focusable="false"
    >
      <line
        x1={startX}
        y1={height / 2}
        x2={endX - 8}
        y2={height / 2}
        strokeWidth={1}
        className="stroke-border"
      />
      <line
        x1={startX}
        y1={height / 2}
        x2={endX - 8}
        y2={height / 2}
        strokeWidth={1}
        className="dash-flow stroke-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {Array.from({ length: count }).map((_, i) => {
        const cx = startX + gap * i;
        return (
          <g key={i}>
            <circle
              cx={cx}
              cy={height / 2}
              r={16}
              strokeWidth={1}
              className="fill-card stroke-accent"
            />
            <text
              x={cx}
              y={height / 2 + 4}
              textAnchor="middle"
              className="fill-foreground font-mono text-[11px]"
            >
              {String(i + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}
      <g>
        <rect
          x={endX - 8}
          y={height / 2 - 16}
          width={110}
          height={32}
          rx={6}
          strokeWidth={1}
          className="fill-accent/15 stroke-accent"
        />
        <text
          x={endX - 8 + 55}
          y={height / 2 + 4}
          textAnchor="middle"
          className="fill-foreground font-mono text-[11px]"
        >
          ✓ on-site demo
        </text>
      </g>
    </svg>
  );
}
