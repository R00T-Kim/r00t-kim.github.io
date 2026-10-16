/**
 * Layers of the interactive system map on the home hero. Each layer lists the
 * blocks drawn in that row and links to the research that best represents
 * work at that layer. `href` is appended to `/${locale}`.
 */
export interface SystemLayer {
  id: "hardware" | "firmware" | "runtime";
  name: string;
  nameEn: string;
  blocks: string[];
  caption: string;
  captionEn: string;
  linkLabel: string;
  linkLabelEn: string;
  href: string;
}

export const systemLayers: SystemLayer[] = [
  {
    id: "hardware",
    name: "하드웨어",
    nameEn: "Hardware",
    blocks: ["SoC", "Flash", "UART", "JTAG"],
    caption:
      "기기를 열어 디버그 인터페이스를 확보하고 펌웨어를 추출해 분석의 출발점을 만듭니다.",
    captionEn:
      "Open the device, gain a debug interface and extract the firmware to create a starting point for analysis.",
    linkLabel: "Pwn2Own Ireland 2026 · Hue Bridge Pro",
    linkLabelEn: "Pwn2Own Ireland 2026 · Hue Bridge Pro",
    href: "/career#section-pwn2own-hue",
  },
  {
    id: "firmware",
    name: "펌웨어",
    nameEn: "Firmware",
    blocks: ["Bootloader", "Kernel", "Services", "Config"],
    caption:
      "파일시스템과 바이너리를 분석해 공격 표면을 정리하고 취약점의 원인을 찾습니다.",
    captionEn:
      "Analyze the filesystem and binaries to map the attack surface and find the root cause of vulnerabilities.",
    linkLabel: "IoT 스마트 도어벨 · CVE 18건",
    linkLabelEn: "IoT smart doorbell · 18 CVEs",
    href: "/career#section-iot-doorbell",
  },
  {
    id: "runtime",
    name: "실행 흐름",
    nameEn: "Runtime",
    blocks: ["Input", "Parser", "State", "Handler"],
    caption:
      "실제 기기에서 취약점을 재현하고 발견부터 검증까지의 과정을 자동화합니다.",
    captionEn:
      "Reproduce vulnerabilities on real devices and automate the path from discovery to validation.",
    linkLabel: "SCOUT · Automated Exploit Generation",
    linkLabelEn: "SCOUT · Automated Exploit Generation",
    href: "/career#section-scout",
  },
];
