"use client";

import { useEffect } from "react";

/**
 * Adds a `copy` button to every code block's head bar in the rendered post. Added on the
 * client only, so a visitor without JS never sees a button that does nothing.
 */
export function CodeCopy({ label, done }: { label: string; done: string }) {
  useEffect(() => {
    const buttons: HTMLButtonElement[] = [];
    document.querySelectorAll<HTMLElement>(".post .code-block").forEach((block) => {
      const head = block.querySelector<HTMLElement>(".code-head");
      const pre = block.querySelector("pre");
      if (!head || !pre) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "code-copy";
      button.textContent = label;
      let timer: ReturnType<typeof setTimeout> | undefined;
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ""));
          button.textContent = done;
          clearTimeout(timer);
          timer = setTimeout(() => (button.textContent = label), 1500);
        } catch {
          // Clipboard blocked (insecure context, denied permission): leave the button as is.
        }
      });
      head.appendChild(button);
      buttons.push(button);
    });
    return () => buttons.forEach((button) => button.remove());
  }, [label, done]);

  return null;
}
