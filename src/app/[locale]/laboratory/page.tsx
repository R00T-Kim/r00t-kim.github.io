import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageIntro } from "@/components/ui/page-intro";
import { Projects } from "@/components/sections/projects";
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
  const t = await getTranslations({ locale, namespace: "laboratory_page" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/laboratory`,
      languages: {
        ko: `${siteConfig.url}/ko/laboratoryoratory`,
        en: `${siteConfig.url}/en/laboratoryoratory`,
        "x-default": `${siteConfig.url}/ko/laboratoryoratory`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "ko" ? "ko_KR" : "en_US",
      url: `${siteConfig.url}/${locale}/laboratory`,
      siteName: `${siteConfig.author.name.en} Portfolio`,
      images: [ogImage],
    },
  };
}

export default async function LaboratoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "laboratory_page" });

  return (
    <>
      <Header />
      <main>
        <PageIntro
          command="ls laboratory/"
          title={t("heading")}
          description={t("description")}
        />
        <Projects showHeading={false} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
