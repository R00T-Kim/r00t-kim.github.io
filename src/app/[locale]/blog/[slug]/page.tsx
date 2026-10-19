import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Bracket, Cmd, Tags } from "@/components/ui/term";
import { postBySlug, postSummary, postTitle, sortedPosts } from "@/data/posts";
import { readingMinutes, renderPost } from "@/lib/post-content";
import { ogImage, siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => sortedPosts().map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};
  const title = postTitle(post, locale);
  const description = postSummary(post, locale);
  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog/${slug}`,
      languages: {
        ko: `${siteConfig.url}/ko/blog/${slug}`,
        en: `${siteConfig.url}/en/blog/${slug}`,
        "x-default": `${siteConfig.url}/ko/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      locale: "ko_KR",
      url: `${siteConfig.url}/${locale}/blog/${slug}`,
      siteName: `${siteConfig.author.name.en} Portfolio`,
      images: [ogImage],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = postBySlug(slug);
  if (!post) notFound();
  const t = await getTranslations({ locale, namespace: "post_page" });
  const tt = await getTranslations({ locale, namespace: "post_types" });
  const [html, minutes] = await Promise.all([renderPost(slug), readingMinutes(slug)]);
  const all = sortedPosts();
  const index = all.findIndex((item) => item.slug === slug);
  const newer = index > 0 ? all[index - 1] : undefined;
  const older = index < all.length - 1 ? all[index + 1] : undefined;

  return (
    <>
      <Header />
      <main>
        <div className="border-b border-border pt-28 pb-10 md:pt-36 md:pb-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="prompt text-sm">
              <span className="user">gnosis@kim</span>
              <span className="text-muted-foreground">:~ # </span>
              <span className="cmd">cat blog/{slug}.md</span>
            </p>
            <h1 className="mt-5 text-3xl font-bold leading-snug tracking-tight text-foreground md:text-4xl">
              <span className="text-accent"># </span>
              {postTitle(post, locale)}
            </h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-xs text-muted-foreground">
              <time dateTime={post.date}>{post.date}</time>
              <Bracket accent>{tt(post.type)}</Bracket>
              {post.series && <span>series/{post.series}</span>}
              <span>{t("reading_time", { minutes })}</span>
              {locale !== post.lang && <Bracket>{post.lang}</Bracket>}
            </p>
            <Tags tags={post.tags} className="mt-3" />
          </div>
        </div>

        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="post" lang={post.lang} dangerouslySetInnerHTML={{ __html: html }} />

          <div className="mt-14 border-t border-border pt-6 font-mono text-sm">
            <p className="flex flex-wrap gap-x-6 gap-y-2">
              <Cmd href={post.url}>open original ↗</Cmd>
              <Cmd href={`/${locale}/blog`} internal>
                cd ../
              </Cmd>
            </p>
            <nav className="mt-6 grid gap-3 sm:grid-cols-2" aria-label={t("nav")}>
              {older && (
                <Link href={`/${locale}/blog/${older.slug}`} className="group block min-w-0 text-muted-foreground transition-colors hover:text-accent">
                  <span className="block text-xs">{t("older")}</span>
                  <span className="block truncate text-foreground group-hover:text-accent">{postTitle(older, locale)}</span>
                </Link>
              )}
              {newer && (
                <Link href={`/${locale}/blog/${newer.slug}`} className="group block min-w-0 text-muted-foreground transition-colors hover:text-accent sm:text-right">
                  <span className="block text-xs">{t("newer")}</span>
                  <span className="block truncate text-foreground group-hover:text-accent">{postTitle(newer, locale)}</span>
                </Link>
              )}
            </nav>
          </div>
        </article>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
