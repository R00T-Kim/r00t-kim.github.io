"use client";

import { useEffect, useState } from "react";
import type { PostHeading } from "@/lib/post-content";
import { cn } from "@/lib/utils";

/** `tree` branch glyphs for each heading: h2 are the top level, h3 hang under the h2 before them. */
function branches(headings: PostHeading[]): string[] {
  return headings.map((heading, i) => {
    const rest = headings.slice(i + 1);
    const nextTop = rest.findIndex((h) => h.depth === 2);
    if (heading.depth === 2) return nextTop === -1 ? "└── " : "├── ";
    // h3: is there another h3 before the next h2?
    const siblings = nextTop === -1 ? rest : rest.slice(0, nextTop);
    const lastChild = !siblings.some((h) => h.depth === 3);
    const parentLast = nextTop === -1;
    return `${parentLast ? "    " : "│   "}${lastChild ? "└── " : "├── "}`;
  });
}

/** The post's headings printed like `tree`, with the section being read in the accent colour. */
export function PostToc({ headings, label }: { headings: PostHeading[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);
    // The section being read is the last heading that has scrolled above the top quarter of the screen.
    const update = () => {
      const line = window.innerHeight * 0.25;
      let current: string | null = null;
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headings]);

  const glyphs = branches(headings);

  return (
    <nav aria-label={label} className="font-mono text-xs leading-relaxed">
      <p className="text-muted-foreground">.</p>
      <ul>
        {headings.map((heading, i) => (
          <li key={heading.id} className="flex">
            <span aria-hidden="true" className="shrink-0 whitespace-pre text-muted-foreground/60">
              {glyphs[i]}
            </span>
            <a
              href={`#${heading.id}`}
              aria-current={active === heading.id ? "location" : undefined}
              className={cn(
                "min-w-0 truncate transition-colors hover:text-accent",
                active === heading.id ? "text-accent" : "text-muted-foreground"
              )}
              title={heading.text}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
