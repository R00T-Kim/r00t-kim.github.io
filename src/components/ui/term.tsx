import Link from "next/link";
import { cn } from "@/lib/utils";

/** Terminal-style primitives shared by the inner pages. */

/** `# command` style link (root prompt). External by default; pass `internal` for app routes. */
export function Cmd({
  href,
  children,
  internal = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  internal?: boolean;
  className?: string;
}) {
  const classes = cn(
    "inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-accent",
    className
  );
  const body = (
    <>
      <span className="text-accent/70">#</span>
      {children}
    </>
  );
  if (internal) {
    return (
      <Link href={href} className={classes}>
        {body}
      </Link>
    );
  }
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={classes}
    >
      {body}
    </a>
  );
}

/** `#tag` list. Spaces become underscores so each tag reads as one token. */
export function Tags({ tags, className }: { tags: string[]; className?: string }) {
  if (!tags.length) return null;
  return (
    <p className={cn("flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground", className)}>
      {tags.map((tag) => (
        <span key={tag}>#{tag.replace(/\s+/g, "_")}</span>
      ))}
    </p>
  );
}

/** `- item` bullet list, markdown style. */
export function Bullets({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("space-y-1.5 text-sm leading-relaxed text-foreground/85", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span aria-hidden="true" className="shrink-0 text-muted-foreground">
            -
          </span>
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** `### Sub heading` */
export function SubHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("mb-4 mt-10 text-lg font-semibold text-foreground first:mt-0", className)}>
      <span className="text-accent">### </span>
      {children}
    </h3>
  );
}

/** `[tag]` inline marker. */
export function Bracket({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span className={cn("font-mono text-xs", accent ? "text-accent" : "text-muted-foreground")}>
      [{children}]
    </span>
  );
}

/** One output line: fixed mono column on the left (date, period), content on the right. */
export function Line({
  left,
  children,
  className,
}: {
  left: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1 border-t border-border py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6", className)}>
      <div className="font-mono text-xs text-muted-foreground sm:pt-1">{left}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
