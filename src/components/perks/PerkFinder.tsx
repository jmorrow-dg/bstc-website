"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PerkIndexEntry } from "@/lib/perks";

type Kind = "all" | "open" | "example";

type FilterState = {
  kind: Kind;
  cat: string;
  boot: boolean;
  words: string[];
};

function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// `skip` lets each chip count ignore its own filter.
function matches(p: PerkIndexEntry, s: FilterState, skip?: "kind" | "cat") {
  if (skip !== "kind" && s.kind !== "all" && p.kind !== s.kind) return false;
  if (skip !== "cat" && s.cat !== "all" && p.category !== s.cat) return false;
  if (s.boot && p.bootstrappedOk === false) return false;
  return s.words.every((w) => p.hay.includes(w));
}

/**
 * Progressive enhancement over the server-rendered perk list. Without
 * JavaScript the page is the full grouped list with a jump list; once this
 * mounts, the filter form appears and cards are shown or hidden in place.
 */
export default function PerkFinder({
  index,
  categories,
}: {
  index: PerkIndexEntry[];
  categories: string[];
}) {
  const total = index.length;
  const [ready, setReady] = useState(false);
  const [kind, setKind] = useState<Kind>("all");
  const [cat, setCat] = useState("all");
  const [boot, setBoot] = useState(false);
  const [query, setQuery] = useState("");
  const [announce, setAnnounce] = useState(`Showing ${total} of ${total} perks`);
  const searchRef = useRef<HTMLInputElement>(null);

  const state: FilterState = useMemo(
    () => ({
      kind,
      cat,
      boot,
      words: normalise(query).split(/\s+/).filter(Boolean),
    }),
    [kind, cat, boot, query]
  );

  const byId = useMemo(() => new Map(index.map((p) => [p.id, p])), [index]);

  const shown = useMemo(
    () => index.filter((p) => matches(p, state)).length,
    [index, state]
  );

  const kindCounts = useMemo(() => {
    const c = { all: 0, open: 0, example: 0 };
    index.forEach((p) => {
      if (matches(p, state, "kind")) {
        c.all += 1;
        c[p.kind] += 1;
      }
    });
    return c;
  }, [index, state]);

  const catCounts = useMemo(() => {
    const c: Record<string, number> = { all: 0 };
    index.forEach((p) => {
      if (matches(p, state, "cat")) {
        c.all += 1;
        c[p.category] = (c[p.category] || 0) + 1;
      }
    });
    return c;
  }, [index, state]);

  const filtered =
    kind !== "all" || cat !== "all" || boot || state.words.length > 0;

  // Reveal the form and hide the no-JS jump list once we can filter.
  useEffect(() => {
    setReady(true);
    const jump = document.getElementById("perk-jump");
    if (jump) jump.hidden = true;
  }, []);

  // Show or hide the server-rendered cards and categories.
  useEffect(() => {
    if (!ready) return;
    document.querySelectorAll<HTMLElement>("[data-perk-id]").forEach((card) => {
      const entry = byId.get(card.dataset.perkId || "");
      card.hidden = entry ? !matches(entry, state) : false;
    });
    document.querySelectorAll<HTMLElement>("[data-perk-cat]").forEach((section) => {
      let open = 0;
      let examples = 0;
      section.querySelectorAll<HTMLElement>("[data-perk-id]").forEach((card) => {
        if (card.hidden) return;
        if (byId.get(card.dataset.perkId || "")?.kind === "open") open += 1;
        else examples += 1;
      });
      section.hidden = open + examples === 0;
      const line = section.querySelector<HTMLElement>("[data-perk-count]");
      if (line) {
        const bits: string[] = [];
        if (open) bits.push(`${open} open now`);
        if (examples) bits.push(`${examples} ${examples === 1 ? "example" : "examples"}`);
        line.textContent = bits.join(", ");
      }
    });
    const empty = document.getElementById("perk-empty");
    if (empty) empty.hidden = shown !== 0;
  }, [ready, state, byId, shown]);

  // Debounced status line for screen readers.
  useEffect(() => {
    const t = setTimeout(() => setAnnounce(`Showing ${shown} of ${total} perks`), 250);
    return () => clearTimeout(t);
  }, [shown, total]);

  const reset = useCallback(() => {
    setKind("all");
    setCat("all");
    setBoot(false);
    setQuery("");
    searchRef.current?.focus();
  }, []);

  // The empty-state button lives in the server-rendered list.
  useEffect(() => {
    const btn = document.getElementById("perk-empty-clear");
    if (!btn) return;
    btn.addEventListener("click", reset);
    return () => btn.removeEventListener("click", reset);
  }, [reset]);

  return (
    <>
      <form
        className="gl-ff"
        role="search"
        aria-label="Filter perks"
        hidden={!ready}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="gl-ff-row">
          <div className="gl-ff-search">
            <label className="gl-ff-label" htmlFor="perk-q">
              Search
            </label>
            <input
              ref={searchRef}
              id="perk-q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Company, offer or tool, like credits or Notion"
              autoComplete="off"
              aria-describedby="perk-q-hint"
            />
            <p className="gl-ff-hint" id="perk-q-hint">
              Searches company, offer and what the tool does.
            </p>
          </div>
          <fieldset>
            <legend>Show</legend>
            <div className="gl-chips">
              {(
                [
                  ["all", "All"],
                  ["open", "Open now"],
                  ["example", "Examples"],
                ] as [Kind, string][]
              ).map(([value, label]) => (
                <label className="gl-chip" key={value}>
                  <input
                    type="radio"
                    name="kind"
                    value={value}
                    checked={kind === value}
                    onChange={() => setKind(value)}
                  />
                  <span>
                    {label} <b>{kindCounts[value]}</b>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Funding</legend>
            <div className="gl-chips">
              <label className="gl-chip gl-chip--box">
                <input
                  type="checkbox"
                  name="boot"
                  checked={boot}
                  onChange={(e) => setBoot(e.target.checked)}
                  aria-describedby="perk-boot-hint"
                />
                <span>Bootstrapped OK</span>
              </label>
            </div>
            <p className="gl-ff-hint" id="perk-boot-hint">
              Hides perks that need venture funding or a partner.
            </p>
          </fieldset>
        </div>
        <fieldset className="gl-ff-cats">
          <legend>Category</legend>
          <div className="gl-chips">
            {["all", ...categories].map((value) => {
              const n = catCounts[value] || 0;
              return (
                <label className={`gl-chip${n === 0 ? " gl-is-zero" : ""}`} key={value}>
                  <input
                    type="radio"
                    name="cat"
                    value={value}
                    checked={cat === value}
                    onChange={() => setCat(value)}
                  />
                  <span>
                    {value === "all" ? "All categories" : value} <b>{n}</b>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </form>

      <div className="gl-status-row">
        <p className="gl-status" role="status">
          {announce}
        </p>
        {ready && filtered && (
          <button className="gl-btn gl-btn-line gl-btn-sm" type="button" onClick={reset}>
            Clear filters
          </button>
        )}
      </div>
    </>
  );
}
