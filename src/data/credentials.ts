export interface Certification {
  name: string;
  nameEn: string;
  date: string;
  issuer: string;
  issuerEn: string;
  url?: string;
  highlight?: boolean;
  category: "security" | "kubernetes" | "general";
}

export interface Award {
  title: string;
  titleEn: string;
  issuer: string;
  issuerEn: string;
  date: string;
  highlight?: boolean;
}

export const certifications: Certification[] = [];

export const awards: Award[] = [
  {
    title: "AutoHack 2025 COSS 협의회 의장상",
    titleEn: "AutoHack 2025 COSS Council Chair Award",
    issuer: "국민대학교 미래자동차사업단",
    issuerEn: "Kookmin University Future Automotive Division",
    date: "2025.11",
    highlight: true,
  },
  {
    title: "우수논문상",
    titleEn: "Best Paper Award",
    issuer: "한국인터넷정보학회 추계학술대회 (국방정보기술연구회)",
    issuerEn: "KSII Autumn Conference (Defense IT Research Society)",
    date: "2025.10",
    highlight: true,
  },
];
