"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { siteConfig } from "@/config/site";
import { experiences } from "@/data/experience";
import { HubShell } from "@/components/home/hub-shell";

// A believable "just got root" session. The last command, `ls`, lists the site.
const CMDS = ["whoami", "id", "uname -a", "cat /etc/shadow", "ls"];

/** Home: a root shell that types itself out on load, ending with `ls` of the directories. */
export function Hub() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const name = isKo ? siteConfig.author.name.ko : siteConfig.author.name.en;
  const role = isKo ? siteConfig.author.title.ko : siteConfig.author.title.en;
  const current = experiences.find((item) => item.endDate === null);
  const company = current ? (isKo ? current.company : current.companyEn) : "";

  const dirs = siteConfig.nav.map((item) => ({
    name: item.key,
    href: `/${locale}${item.href}`,
  }));

  const mono = "mt-2 font-mono text-sm text-muted-foreground";
  const outputs = [
    // whoami
    <div key="whoami">
      <h1 className="mt-3 text-4xl font-bold leading-none tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl">
        {name}
      </h1>
      <p className="mt-3 font-mono text-sm text-muted-foreground">
        {siteConfig.author.handles.join(" · ")}
        <span className="mx-1.5">·</span>
        {role}
        {company ? ` @ ${company}` : ""}
      </p>
    </div>,
    // id
    <p key="id" className={mono}>
      uid=0(<span className="text-accent">{siteConfig.author.alias}</span>) gid=0(root)
      groups=0(root)
    </p>,
    // uname -a
    <p key="uname" className={`${mono} break-all`}>
      Linux kim 6.6.0-gnosis #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux
    </p>,
    // cat /etc/shadow
    <p key="shadow" className={`${mono} break-all`}>
      root:
      <span className="text-accent">
        Gnosis is to be surprised at everything
      </span>
      :20089:0:99999:7:::
    </p>,
    // ls
    <ul key="ls" className="mt-5 flex flex-wrap gap-x-8 gap-y-3 sm:gap-x-12 lg:gap-x-16">
      {dirs.map((dir) => (
        <li key={dir.name}>
          <Link
            href={dir.href}
            className="group inline-block font-mono text-[clamp(36px,5vw,56px)] font-medium tracking-tight text-foreground transition-colors hover:text-accent"
          >
            {dir.name}
            <span className="text-accent">/</span>
          </Link>
        </li>
      ))}
    </ul>,
  ];

  // The whole session is always in the markup (crawlers and no-JS visitors read it),
  // and whatever has not been "typed" yet is .hub-pending: hidden but still taking its
  // space, so nothing shifts while it types. prefers-reduced-motion jumps straight to done.
  const [playing, setPlaying] = useState(true);
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const [outShown, setOutShown] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sleep = (ms: number) =>
      new Promise((r) => setTimeout(r, reduce ? 0 : ms));
    (async () => {
      await sleep(350); // a beat before the first keystroke
      for (let s = 0; s < CMDS.length; s++) {
        if (cancelled) return;
        if (s > 0) {
          setStep(s);
          setOutShown(false);
          setTyped(0);
        }
        const cmd = CMDS[s];
        if (reduce) {
          setTyped(cmd.length);
        } else {
          for (let c = 1; c <= cmd.length; c++) {
            if (cancelled) return;
            setTyped(c);
            await sleep(36 + Math.random() * 58); // human-ish keystrokes
          }
        }
        if (cancelled) return;
        await sleep(220);
        setOutShown(true);
        if (s < CMDS.length - 1) await sleep(440);
      }
      if (!cancelled) setPlaying(false); // settle: everything shown, no cursor
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6 md:pt-36 md:pb-32 lg:px-8">
      <noscript>
        <style>{".hub-pending{visibility:visible}.hub-cursor{display:none}"}</style>
      </noscript>
      <div className="space-y-7 md:space-y-9">
        {CMDS.map((cmd, i) => {
          const visible = !playing || i <= step;
          const active = playing && i === step;
          const cut = active ? typed : cmd.length;
          const showOutput = !playing || i < step || (active && outShown);
          return (
            <div key={cmd} className={visible ? undefined : "hub-pending"}>
              <p className="prompt text-sm">
                <span className="user">{siteConfig.author.alias}@kim</span>
                <span className="text-muted-foreground">:~ # </span>
                <span className="cmd">
                  {cmd.slice(0, cut)}
                  {active && (
                    <span aria-hidden="true" className="hub-cursor cursor-blink text-accent">
                      ▍
                    </span>
                  )}
                  {cut < cmd.length && <span className="hub-pending">{cmd.slice(cut)}</span>}
                </span>
              </p>
              <div className={showOutput ? undefined : "hub-pending"}>{outputs[i]}</div>
            </div>
          );
        })}
        {!playing && <HubShell dirs={dirs} name={name} />}
      </div>
    </section>
  );
}
