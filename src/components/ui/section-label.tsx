import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionLabelProps {
  /** Two-digit index rendered in the accent mono style, e.g. "01". */
  index: string;
  /** Short mono label after the index, e.g. "Selected research". */
  label: string;
  /** Sentence-style heading; the closing period is added in the accent color. */
  title: string;
  aside?: { href: string; label: string };
}

export function SectionLabel({ index, label, title, aside }: SectionLabelProps) {
  return (
    <div className="mb-10 md:mb-12">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-accent">{index}</span> / {label}
      </p>
      <div className="mt-3 flex items-end justify-between gap-4 border-b border-border pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {title}
          <span className="text-accent">.</span>
        </h2>
        {aside && (
          <Link
            href={aside.href}
            className="group inline-flex shrink-0 items-center gap-1 pb-1 font-mono text-xs text-muted-foreground transition-colors hover:text-accent"
          >
            {aside.label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
