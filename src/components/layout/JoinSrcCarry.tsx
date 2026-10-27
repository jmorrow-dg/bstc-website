"use client";

import { useEffect } from "react";

// Carries the ?src= a visitor arrived with (a partner link such as
// /new-to-bali?src=partner-<slug>, a newsletter or a QR code) through to
// /join, so the signup is credited to the source that sent them rather than to
// the on-page placement. Same rules as the join form: lower-case [a-z0-9-],
// at most 60 characters. Kept for the browser session only.
const KEY = "bstc_src";
const VALID = /^[a-z0-9-]{1,60}$/;

function readStored(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export default function JoinSrcCarry() {
  useEffect(() => {
    const incoming = new URLSearchParams(window.location.search)
      .get("src")
      ?.toLowerCase();
    if (incoming && VALID.test(incoming)) {
      try {
        sessionStorage.setItem(KEY, incoming);
      } catch {
        // Storage blocked: the on-page placement tag still applies.
      }
    }

    const onClick = (event: MouseEvent) => {
      const src = readStored();
      if (!src) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== "/join") {
        return;
      }
      url.searchParams.set("src", src);
      link.href = url.toString();
      const newTab =
        event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0;
      if (newTab) return;
      event.preventDefault();
      event.stopPropagation();
      window.location.assign(url.toString());
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
