// Tests for the header's Sign in link: src/lib/members-app.mjs, rendered by
// src/components/layout/Navbar.tsx. Run with the rest: npm test
//
// The address checks need no dependencies. The header checks render the real
// Navbar with React, so they need the site's own dependencies (npm install)
// and are skipped without them.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import * as membersApp from "../src/lib/members-app.mjs";

const { MEMBERS_APP_URL, signInLink } = membersApp;
const ADDRESS = "https://members.example.com/app";

test("no address set means no Sign in link", () => {
  for (const unset of ["", "   ", null, undefined]) {
    assert.equal(signInLink(unset), null, JSON.stringify(unset));
  }
});

test("a set address is the link, exactly", () => {
  assert.deepEqual(signInLink(ADDRESS), { label: "Sign in", href: ADDRESS });
  assert.deepEqual(signInLink(` ${ADDRESS}\n`), { label: "Sign in", href: ADDRESS }, "spaces around it are dropped");
  assert.equal(signInLink(`${ADDRESS}?from=bstc`).href, `${ADDRESS}?from=bstc`);
});

test("an address that isn't a full https one fails loudly instead of hiding the link", () => {
  for (const bad of ["members.example.com/app", "/app", "http://members.example.com/app", "javascript:alert(1)", "mailto:hello@example.com"]) {
    assert.throws(() => signInLink(bad), /must be a full https:\/\/ address/, bad);
  }
});

test("the value the site ships with is empty or a full https address", () => {
  assert.doesNotThrow(() => signInLink(MEMBERS_APP_URL));
});

// The link ships off. Switching it on is its own PR, which sets MEMBERS_APP_URL
// and changes this test to expect that address, so the link never goes on as a
// side effect of some other change.
test("it ships off: MEMBERS_APP_URL is empty", () => {
  assert.equal(
    MEMBERS_APP_URL,
    "",
    "Sign in is switched on. That's its own PR, which changes this test to expect the address.",
  );
});

// The header checks.
const require = createRequire(import.meta.url);
const optional = (name) => {
  try {
    return require(name);
  } catch {
    return null;
  }
};
const ts = optional("typescript");
const React = optional("react");
const jsxRuntime = optional("react/jsx-runtime");
const server = optional("react-dom/server");
const skip = ts && React && jsxRuntime && server ? false : "needs the site's dependencies (npm install)";
const source = (path) => fileURLToPath(new URL(path, import.meta.url));

// Compiles a .ts or .tsx file to CommonJS and runs it with only the imports given.
function run(file, imports) {
  const { outputText } = ts.transpileModule(readFileSync(file, "utf8"), {
    fileName: file,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });
  const compiled = { exports: {} };
  const importer = (id) => {
    if (!(id in imports)) throw new Error(`${file} imports ${id}, which this test doesn't provide`);
    return imports[id];
  };
  new Function("require", "module", "exports", outputText)(importer, compiled, compiled.exports);
  return compiled.exports;
}

// The real Navbar as HTML, with MEMBERS_APP_URL set to `address`. menuOpen
// renders the phone menu open: it's the header's only state, and starts false.
function header(address, { menuOpen = false } = {}) {
  const react = menuOpen
    ? { ...React, useState: (initial) => React.useState(initial === false ? true : initial) }
    : React;
  const Link = ({ href, children, ...rest }) => React.createElement("a", { href, ...rest }, children);
  const { default: Navbar } = run(source("../src/components/layout/Navbar.tsx"), {
    react,
    "react/jsx-runtime": jsxRuntime,
    "next/link": { __esModule: true, default: Link },
    "next/navigation": { usePathname: () => "/" },
    "lucide-react": { Menu: () => null, X: () => null },
    "@/lib/constants": run(source("../src/lib/constants.ts"), {}),
    "@/lib/members-app.mjs": { ...membersApp, MEMBERS_APP_URL: address },
  });
  return server.renderToStaticMarkup(React.createElement(Navbar));
}

const DESKTOP = `<a href="${ADDRESS}" class="gl-top-signin">Sign in</a>`;
const PHONE = `<a href="${ADDRESS}" class="gl-btn gl-btn-line">Sign in</a>`;
const count = (html, part) => html.split(part).length - 1;

test("unset, the header has no Sign in link, on desktop or in the phone menu", { skip }, () => {
  for (const menuOpen of [false, true]) {
    const html = header("", { menuOpen });
    assert.match(html, /Join the community/, "the header rendered");
    assert.equal(html.includes('id="mobile-menu"'), menuOpen, "the phone menu is open only when asked");
    assert.doesNotMatch(html, /\bsign ?in/i, "no link, class or anything else of it");
  }
});

test("set, the desktop header and the phone menu both link the address", { skip }, () => {
  const closed = header(ADDRESS);
  assert.equal(count(closed, ADDRESS), 1, "with the phone menu closed, only the desktop link");
  assert.ok(closed.includes(`${DESKTOP}<a href="/join?src=nav" `), "just before Join the community");

  const open = header(ADDRESS, { menuOpen: true });
  const menu = open.slice(open.indexOf('id="mobile-menu"'));
  assert.equal(count(menu, PHONE), 1);
  assert.ok(menu.includes(`>Join the community</a>${PHONE}`), "under the menu's Join the community");
});

test("set, the link is all that changes in the header", { skip }, () => {
  for (const menuOpen of [false, true]) {
    const on = header(ADDRESS, { menuOpen });
    const off = header("", { menuOpen });
    assert.equal(on.replace(DESKTOP, "").replace(PHONE, "").replace(" gl-top-row--signin", ""), off);
  }
});

test("a mistyped address stops the header rendering, so the build fails", { skip }, () => {
  assert.throws(() => header("members.example.com/app"), /must be a full https:\/\/ address/);
});
