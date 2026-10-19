import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageIntro } from "@/components/ui/page-intro";
import { PostList } from "@/components/blog/post-list";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { ogImage, siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog_page" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog`,
      languages: {
        ko: `${siteConfig.url}/ko/blog`,
        en: `${siteConfig.url}/en/blog`,
        "x-default": `${siteConfig.url}/ko/blog`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "ko" ? "ko_KR" : "en_US",
      url: `${siteConfig.url}/${locale}/blog`,
      siteName: `${siteConfig.author.name.en} Portfolio`,
      images: [ogImage],
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog_page" });

  return (
    <>
      <Header />
      <main>
        <PageIntro
          command="ls -lt blog/"
          title={t("heading")}
          description={t("description")}
        />
        <section className="bg-background py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <PostList />
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
