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

export interface PostHeading {
  id: string;
  depth: 2 | 3;
  text: string;
}

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const textOf = (node: HastNode): string =>
  node.type === "text" ? (node.value ?? "") : (node.children ?? []).map(textOf).join("");

/**
 * Wraps every <pre> in div.code-block with a head bar naming its language (from the
 * fence label, `text` when there is none), and collects h2/h3 for the table of contents.
 */
function rehypeCodeFrameAndHeadings(headings: PostHeading[]) {
  return () => (tree: HastNode) => {
    const walk = (node: HastNode) => {
      const children = node.children;
      if (!children) return;
      children.forEach((child, i) => {
        if (child.tagName === "h2" || child.tagName === "h3") {
          const id = child.properties?.id;
          if (typeof id === "string") headings.push({ id, depth: child.tagName === "h2" ? 2 : 3, text: textOf(child).trim() });
        }
        if (child.tagName === "pre") {
          const code = child.children?.find((c) => c.tagName === "code");
          const classes = (code?.properties?.className as string[] | undefined) ?? [];
          // An unlabelled fence is prose, a diagram or output: name it `text` rather than leave the bar blank.
          const lang = classes.find((c) => c.startsWith("language-"))?.slice("language-".length) ?? "text";
          children[i] = {
            type: "element",
            tagName: "div",
            properties: { className: ["code-block"] },
            children: [
              {
                type: "element",
                tagName: "div",
                properties: { className: ["code-head"] },
                children: [{ type: "element", tagName: "span", properties: { className: lang === "text" ? ["code-lang", "code-lang-plain"] : ["code-lang"] }, children: [{ type: "text", value: lang }] }],
              },
              child,
            ],
          };
          return;
        }
        walk(child);
      });
    };
    walk(tree);
  };
}

/** Reads content/posts/<slug>.md and renders it to HTML at build time, with its h2/h3 headings. Server only. */
export async function renderPost(slug: string): Promise<{ html: string; headings: PostHeading[] }> {
  const source = await fs.readFile(path.join(CONTENT_DIR, `${slug}.md`), "utf8");
  const headings: PostHeading[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: false, ignoreMissing: true })
    .use(rehypeCodeFrameAndHeadings(headings))
    .use(rehypeStringify)
    .process(source);
  // wrap tables so wide ones scroll instead of widening the page
  const html = String(file).replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, "</table></div>");
  return { html, headings };
}

/** Rough reading time in minutes for Korean + Latin text. */
export async function readingMinutes(slug: string): Promise<number> {
  const source = await fs.readFile(path.join(CONTENT_DIR, `${slug}.md`), "utf8");
  const chars = source.replace(/```[\s\S]*?```/g, "").length;
  return Math.max(1, Math.round(chars / 700));
}
