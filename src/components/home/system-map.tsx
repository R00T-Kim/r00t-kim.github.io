"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { systemLayers } from "@/data/system-map";
import { cn } from "@/lib/utils";

const BLOCK_W = 96;
const BLOCK_H = 44;
const COL_GAP = 112;
const ROW_GAP = 112;
const X0 = 44;
const Y0 = 30;
const VIEW_W = 520;
const VIEW_H = Y0 + ROW_GAP * (systemLayers.length - 1) + BLOCK_H + 20;

const blockX = (col: number) => X0 + col * COL_GAP;
const blockCX = (col: number) => blockX(col) + BLOCK_W / 2;
const rowY = (row: number) => Y0 + row * ROW_GAP;

interface Connection {
  from: number;
  to: number;
  row: number;
}

// Vertical links between matching blocks plus one diagonal per column.
const connections: Connection[] = systemLayers.slice(0, -1).flatMap((_, row) => {
  const straight = systemLayers[row].blocks.map((_, col) => ({ from: col, to: col, row }));
  const diagonal = systemLayers[row].blocks
    .slice(0, -1)
    .map((_, col) => ({ from: col, to: col + 1, row }));
  return [...straight, ...diagonal];
});

export function SystemMap() {
  const t = useTranslations("home.map");
  const locale = useLocale();
  const isKo = locale === "ko";
  const [active, setActive] = useState(0);
  const [autoCycle, setAutoCycle] = useState(true);

  useEffect(() => {
    if (!autoCycle) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % systemLayers.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [autoCycle]);

  const select = (index: number) => {
    setActive(index);
    setAutoCycle(false);
  };

  const layer = systemLayers[active];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Title bar */}
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2 font-mono text-xs text-muted-foreground">
        <span className="truncate">
          <span className="text-accent">gnosis@oobs</span>:~/research/
          {t("window_title")}
        </span>
        <span className="shrink-0">
          :{t("layer")} <span className="text-foreground">{layer.id}</span>
        </span>
      </div>

      {/* Diagram */}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="block h-auto w-full"
        aria-hidden="true"
        focusable="false"
      >
        {connections.map(({ from, to, row }) => {
          const isActive = row === active || row + 1 === active;
          const isDiagonal = from !== to;
          return (
            <line
              key={`${row}-${from}-${to}`}
              x1={blockCX(from)}
              y1={rowY(row) + BLOCK_H}
              x2={blockCX(to)}
              y2={rowY(row + 1)}
              strokeWidth={1}
              className={cn(
                "transition-[stroke,opacity] duration-300",
                isActive ? "stroke-accent dash-flow" : "stroke-border",
                isDiagonal && !isActive && "opacity-50"
              )}
            />
          );
        })}

        {systemLayers.map((item, row) => {
          const isActive = row === active;
          return (
            <g
              key={item.id}
              onClick={() => select(row)}
              className="cursor-pointer"
            >
              <text
                x={X0}
                y={rowY(row) - 9}
                className={cn(
                  "font-mono text-[11px] uppercase tracking-[0.2em] transition-[fill] duration-300",
                  isActive ? "fill-accent" : "fill-muted-foreground"
                )}
              >
                {isKo ? item.name : item.nameEn}
              </text>
              {item.blocks.map((block, col) => (
                <g key={block}>
                  <rect
                    x={blockX(col)}
                    y={rowY(row)}
                    width={BLOCK_W}
                    height={BLOCK_H}
                    rx={6}
                    strokeWidth={1}
                    className={cn(
                      "transition-[fill,stroke] duration-300",
                      isActive
                        ? "fill-accent/15 stroke-accent"
                        : "fill-muted/60 stroke-border"
                    )}
                  />
                  <text
                    x={blockCX(col)}
                    y={rowY(row) + BLOCK_H / 2 + 4}
                    textAnchor="middle"
                    className={cn(
                      "font-mono text-[11px] transition-[fill] duration-300",
                      isActive ? "fill-foreground" : "fill-muted-foreground"
                    )}
                  >
                    {block}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
      </svg>

      {/* Layer selector */}
      <div className="flex border-t border-border">
        {systemLayers.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={index === active}
            onClick={() => select(index)}
            className={cn(
              "flex-1 border-r border-border px-3 py-2.5 font-mono text-xs transition-colors last:border-r-0",
              index === active
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            )}
          >
            {index + 1}. {isKo ? item.name : item.nameEn}
          </button>
        ))}
      </div>

      {/* Caption */}
      <div className="border-t border-border px-4 py-4" aria-live="polite">
        <p className="text-sm leading-relaxed text-foreground/80">
          {isKo ? layer.caption : layer.captionEn}
        </p>
        <Link
          href={`/${locale}${layer.href}`}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          {isKo ? layer.linkLabel : layer.linkLabelEn}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Status strip */}
      <div className="flex items-center justify-between border-t border-border bg-muted/40 font-mono text-xs">
        <div className="flex min-w-0 items-center">
          <span className="shrink-0 bg-accent px-2 py-1 font-semibold text-accent-foreground">
            {t("status_mode")}
          </span>
          <span className="truncate px-3 py-1 text-muted-foreground">
            {t("hint")}
          </span>
        </div>
        <span className="shrink-0 px-3 py-1 text-muted-foreground">
          {active + 1}/{systemLayers.length}
        </span>
      </div>
    </div>
  );
}
