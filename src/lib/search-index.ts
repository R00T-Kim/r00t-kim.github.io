import { posts, postSummary, postTitle } from "@/data/posts";
import { projects } from "@/data/projects";
import { featuredResearch } from "@/data/featured";
import { careerDetailSections } from "@/data/career-detail";

export type SearchKind = "post" | "project" | "research";

export interface SearchEntry {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle?: string;
  /** Absolute path (already locale-prefixed) or external URL. */
  href: string;
  external: boolean;
  haystack: string;
}

function norm(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

/** Builds the client-side index for the current locale. Called lazily when the dialog opens. */
export function buildSearchIndex(locale: string): SearchEntry[] {
  const isKo = locale === "ko";
  const entries: SearchEntry[] = [];

  for (const item of featuredResearch) {
    const title = isKo ? item.title : item.titleEn;
    entries.push({
      id: `research-${item.id}`,
      kind: "research",
      title,
      subtitle: isKo ? item.kicker : item.kickerEn,
      href: `/${locale}${item.href}`,
      external: false,
      haystack: norm(
        [title, item.title, item.titleEn, item.kicker, item.kickerEn, item.target, item.targetEn, ...item.tags].join(" ")
      ),
    });
  }

  for (const section of careerDetailSections) {
    if (featuredResearch.some((item) => item.id === section.id)) continue;
    const title = isKo ? section.title : section.titleEn;
    entries.push({
      id: `research-${section.id}`,
      kind: "research",
      title,
      href: `/${locale}/career#section-${section.id}`,
      external: false,
      haystack: norm([section.title, section.titleEn].join(" ")),
    });
  }

  for (const project of projects) {
    const title = isKo ? project.title : project.titleEn;
    const href = project.url ?? project.links?.[0]?.url ?? `/${locale}/laboratory`;
    entries.push({
      id: `project-${project.titleEn}`,
      kind: "project",
      title,
      subtitle: isKo ? project.period : project.periodEn,
      href,
      external: href.startsWith("http"),
      haystack: norm(
        [project.title, project.titleEn, ...project.tags, ...project.goals, ...project.goalsEn].join(" ")
      ),
    });
  }

  for (const post of posts) {
    entries.push({
      id: `post-${post.id}`,
      kind: "post",
      title: postTitle(post, locale),
      subtitle: `${post.date}${post.series ? ` · ${post.series}` : ""}`,
      href: `/${locale}/blog/${post.slug}`,
      external: false,
      haystack: norm(
        [post.title, post.titleEn ?? "", postSummary(post, locale), post.series ?? "", ...post.tags].join(" ")
      ),
    });
  }

  return entries;
}

export function searchEntries(index: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const needle = norm(query);
  if (!needle) return index.slice(0, limit);
  const terms = needle.split(" ");
  const scored = index
    .map((entry) => {
      const title = norm(entry.title);
      let score = 0;
      for (const term of terms) {
        if (title.includes(term)) score += 3;
        else if (entry.haystack.includes(term)) score += 1;
        else return null;
      }
      return { entry, score };
    })
    .filter((item): item is { entry: SearchEntry; score: number } => item !== null)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((item) => item.entry);
}
