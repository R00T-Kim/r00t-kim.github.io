import { promises as fs } from "node:fs";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

/** Reads content/posts/<slug>.md and renders it to HTML at build time. Server only. */
export async function renderPost(slug: string): Promise<string> {
  const source = await fs.readFile(path.join(CONTENT_DIR, `${slug}.md`), "utf8");
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: false, ignoreMissing: true })
    .use(rehypeStringify)
    .process(source);
  // wrap tables so wide ones scroll instead of widening the page
  return String(file).replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, "</table></div>");
}

/** Rough reading time in minutes for Korean + Latin text. */
export async function readingMinutes(slug: string): Promise<number> {
  const source = await fs.readFile(path.join(CONTENT_DIR, `${slug}.md`), "utf8");
  const chars = source.replace(/```[\s\S]*?```/g, "").length;
  return Math.max(1, Math.round(chars / 700));
}
