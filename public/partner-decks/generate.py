#!/usr/bin/env python3
"""BSTC category-exclusivity partnership deck — config-driven generator.

Turns a small JSON config into a 10-slide, editable PPTX (and a PDF if
LibreOffice is installed). Partner-specific copy lives in the config; the
BSTC-shared proof (community stats, growth, member-request surge, vision) is
baked in here so it stays consistent across every partner deck.

Usage, from the repo root:
    python3 public/partner-decks/generate.py public/partner-decks/n8n.json

Output: public/<slug>-bstc-partnership-deck.pptx  (+ .pdf if soffice is found)

To make a new partner deck, see public/partner-decks/README.md.

Rich-text format used in the config for coloured headlines:
    a headline is a list of PARAGRAPHS; each paragraph is a list of RUNS;
    a run is [text, colour, italic?]  e.g.  ["just collapsed.", "red"]
    colours: white | red | accent | soft | grey | grey2
    italic true renders the em style (italic, not bold).
"""
import json
import shutil
import subprocess
import sys

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

try:
    from PIL import Image
except ImportError:
    Image = None

# ---- palette (BSTC brand; accent is per-partner from the config) ----
BG     = RGBColor(0x0E, 0x0E, 0x0E)
PANEL  = RGBColor(0x18, 0x18, 0x18)
HEROBG = RGBColor(0x20, 0x14, 0x14)
WHITE  = RGBColor(0xF5, 0xF5, 0xF5)
SOFT   = RGBColor(0xCF, 0xCF, 0xCF)
GREY   = RGBColor(0x9A, 0x9A, 0x9A)
GREY2  = RGBColor(0x6E, 0x6E, 0x6E)
RED    = RGBColor(0xC8, 0x1E, 0x1E)
AMBER  = RGBColor(0xE8, 0xB0, 0x4B)
LINE   = RGBColor(0x33, 0x33, 0x33)

SERIF = "Georgia"
SANS  = "Helvetica Neue"
MONO  = "Courier New"

LM, RM, TM = 0.9, 0.9, 0.62
W, H = 13.333, 7.5
CW = W - LM - RM


def hex_rgb(h):
    h = h.lstrip("#")
    return RGBColor(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


# ---------- generic pptx helpers ----------
def R(text, color=WHITE, bold=False, italic=False, font=SANS, size=None):
    return dict(text=text, color=color, bold=bold, italic=italic, font=font, size=size)


def block(s, l, t, w, h, paras, size=14, align=PP_ALIGN.LEFT,
          anchor=MSO_ANCHOR.TOP, ls=1.0, font=SANS, color=WHITE):
    tb = s.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    for pi, para in enumerate(paras):
        p = tf.paragraphs[0] if pi == 0 else tf.add_paragraph()
        p.alignment = align
        if ls:
            p.line_spacing = ls
        for run in (para if isinstance(para, list) else [para]):
            if isinstance(run, str):
                run = R(run, color, font=font)
            r = p.add_run()
            r.text = run["text"]
            r.font.size = Pt(run["size"] if run["size"] else size)
            r.font.bold = run["bold"]
            r.font.italic = run["italic"]
            r.font.name = run["font"]
            r.font.color.rgb = run["color"]
    return tb


def rect(s, l, t, w, h, fill=None, line=None, lw=1.0):
    sp = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(l), Inches(t), Inches(w), Inches(h))
    sp.shadow.inherit = False
    if fill is None:
        sp.fill.background()
    else:
        sp.fill.solid(); sp.fill.fore_color.rgb = fill
    if line is None:
        sp.line.fill.background()
    else:
        sp.line.color.rgb = line; sp.line.width = Pt(lw)
    return sp


def oval(s, l, t, d, fill):
    sp = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(l), Inches(t), Inches(d), Inches(d))
    sp.shadow.inherit = False
    sp.fill.solid(); sp.fill.fore_color.rgb = fill
    sp.line.fill.background()
    return sp


# ---------- main ----------
def build(cfg_path):
    with open(cfg_path) as f:
        cfg = json.load(f)

    P = cfg["partner"]
    ACCENT = hex_rgb(P["accent"])
    NAME = P["name"]
    SLUG = P["slug"]
    LOGO = P["logo"]
    LOGO_H = float(P.get("logo_height", 0.55))
    CMAP = {"white": WHITE, "red": RED, "accent": ACCENT, "soft": SOFT,
            "grey": GREY, "grey2": GREY2, "amber": AMBER}
    XBRAND = f"{NAME} × BSTC"

    prs = Presentation()
    prs.slide_width = Inches(W)
    prs.slide_height = Inches(H)
    BLANK = prs.slide_layouts[6]

    def slide():
        s = prs.slides.add_slide(BLANK)
        fl = s.background.fill
        fl.solid(); fl.fore_color.rgb = BG
        return s

    def rich(spec, font=SERIF, size=None):
        """Config rich-text -> block() paragraphs. Run = [text, colour, italic?]."""
        out = []
        for para in spec:
            row = []
            for run in para:
                text = run[0]
                ck = run[1] if len(run) > 1 else "white"
                ital = bool(run[2]) if len(run) > 2 else False
                row.append(R(text, CMAP.get(ck, WHITE), bold=not ital,
                             italic=ital, font=font, size=size))
            out.append(row)
        return out

    def kicker(s, l, t, text, color=RED):
        block(s, l, t, 8, 0.25, [R(text.upper(), color, font=MONO, size=9.5)])

    def topbar(s, left):
        block(s, LM, TM - 0.32, 6, 0.25, [R(left.upper(), GREY, font=MONO, size=8.5)])
        block(s, W - RM - 5, TM - 0.32, 5, 0.25, [R(XBRAND.upper(), GREY, font=MONO, size=8.5)],
              align=PP_ALIGN.RIGHT)

    def footer(s, left, num):
        rect(s, LM, 6.66, CW, 0.012, fill=RGBColor(0x2A, 0x2A, 0x2A))
        block(s, LM, 6.74, 8, 0.3, [R(left.upper(), GREY2, font=MONO, size=7.5)])
        block(s, W - RM - 1, 6.74, 1, 0.3, [R(num, GREY2, font=MONO, size=7.5)], align=PP_ALIGN.RIGHT)

    def h1(s, l, t, spec, size=33):
        block(s, l, t, CW, 1.6, rich(spec, size=size), size=size, font=SERIF, ls=1.04)

    # ===== 1 · COVER =====
    s = slide()
    block(s, LM, TM - 0.32, 6, 0.25, [R("PARTNERSHIP PROPOSAL", GREY, font=MONO, size=8.5)])
    block(s, W - RM - 5, TM - 0.32, 5, 0.25,
          [R(cfg["cover"].get("dateline", "June 2026 · Confidential").upper(), GREY, font=MONO, size=8.5)],
          align=PP_ALIGN.RIGHT)
    kicker(s, LM, 2.25, "A category-exclusive partnership")
    # logo lockup — compute the partner-logo width so × / badge sit right after it
    logo_w = LOGO_H * 3.6
    if Image is not None:
        try:
            iw, ih = Image.open(LOGO).size
            logo_w = LOGO_H * iw / ih
        except Exception:
            pass
    s.shapes.add_picture(LOGO, Inches(LM), Inches(2.88 - LOGO_H / 2), height=Inches(LOGO_H))
    xx = LM + logo_w + 0.28
    block(s, xx, 2.55, 0.5, 0.6, [R("×", GREY2, font=SERIF, size=30)])
    bx = xx + 0.6
    s.shapes.add_picture("public/images/bstc-badge.png", Inches(bx), Inches(2.55), height=Inches(0.66))
    block(s, bx + 0.85, 2.55, 6, 0.7,
          [[R("BSTC", WHITE, bold=True, font=SERIF, size=27)],
           [R("BALI STARTUPS & TECH COMMUNITY", GREY, font=MONO, size=7.5)]], ls=1.0)
    h1(s, LM, 3.55, cfg["cover"]["headline"], size=40)
    for i, (lbl, val) in enumerate(cfg["cover"]["meta"]):
        x = LM + i * 2.7
        block(s, x, 5.65, 2.6, 0.25, [R(lbl.upper(), GREY2, font=MONO, size=7.5)])
        block(s, x, 5.9, 2.6, 0.35, [R(val, WHITE, bold=True, font=SERIF, size=13)])
    footer(s, XBRAND, "01")

    # ===== 2 · WHY NOW =====
    wn = cfg["why_now"]
    s = slide()
    topbar(s, "Why now")
    kicker(s, LM, 1.0, "The timing")
    h1(s, LM, 1.34, wn["headline"])
    block(s, LM, 2.25, 11.4, 0.9, [wn["lead"]], size=13.5, color=SOFT, ls=1.4)
    cw = (CW - 0.68) / 3
    for i, (hh, ti, body) in enumerate(wn["cols"]):
        x = LM + i * (cw + 0.34)
        block(s, x, 3.35, cw, 0.25, [R(hh.upper(), RED, font=MONO, size=8)])
        block(s, x, 3.62, cw, 0.4, [R(ti, WHITE, bold=True, font=SERIF, size=16)])
        block(s, x, 4.12, cw, 1.0, [body], size=10.5, color=GREY, ls=1.35)
    # column 3: BSTC member-request surge (baked-in proof)
    x3 = LM + 2 * (cw + 0.34)
    block(s, x3, 3.35, cw, 0.25, [R("THE LAST SIX MONTHS", RED, font=MONO, size=8)])
    block(s, x3, 3.62, cw, 0.4, [[R("About ", WHITE, bold=True, font=SERIF, size=16),
                                  R("10x", RED, bold=True, font=SERIF, size=16),
                                  R(" the requests", WHITE, bold=True, font=SERIF, size=16)]])
    vals = [10, 8, 14, 104, 98, 117]
    mx = max(vals); baseY = 4.98; areaH = 0.92; bw_ = 0.34; gap_ = 0.17
    for j, v in enumerate(vals):
        bxx = x3 + j * (bw_ + gap_)
        bhh = max(areaH * v / mx, 0.05)
        rect(s, bxx, baseY - bhh, bw_, bhh, fill=(GREY2 if j < 3 else RED))
        block(s, bxx - 0.08, baseY + 0.04, bw_ + 0.16, 0.2, [R(str(v), GREY, font=MONO, size=6.5)], align=PP_ALIGN.CENTER)
    block(s, x3, baseY + 0.26, cw, 0.3, [R("New member requests / month", GREY, size=9)])
    block(s, LM, 5.55, 11.4, 0.7, [wn["punchline"]], size=13.5, color=SOFT, ls=1.4)
    footer(s, "Why now", "02")

    # ===== 3 · THE FIT (thesis) =====
    s = slide()
    topbar(s, "Why this works")
    kicker(s, LM, 1.55, "The thesis")
    h1(s, LM, 1.95, cfg["thesis"]["headline"])
    block(s, LM, 3.85, 11.0, 1.4, [cfg["thesis"]["lead"]], size=14, color=SOFT, ls=1.5)
    footer(s, "The fit", "03")

    # ===== 4 · COMMUNITY (baked-in stats) =====
    s = slide()
    topbar(s, "The community")
    kicker(s, LM, 1.0, "Size & reach")
    h1(s, LM, 1.34, cfg["community_headline"])
    stats = [
        ("2,500+", "Founders, engineers & operators in the community"),
        ("37", "Monthly flagship networking nights, and counting"),
        ("40–80", "High-signal attendees at every flagship night"),
        ("4", "Event formats: networking, How I Build with AI, builder sessions, roundtables"),
        ("10+", "Editions of the How I Build with AI series"),
        ("[ ]", "Events run in the last 12 months  (confirm)"),
    ]
    bw = (CW - 0.6) / 3
    bh = 1.55
    for i, (n, lbl) in enumerate(stats):
        r, c = divmod(i, 3)
        x = LM + c * (bw + 0.3)
        y = 2.5 + r * (bh + 0.28)
        rect(s, x, y, bw, bh, fill=PANEL, line=LINE, lw=1)
        block(s, x + 0.28, y + 0.24, bw - 0.5, 0.7, [R(n, AMBER if n == "[ ]" else WHITE, bold=True, font=SERIF, size=34)])
        if "(confirm)" in lbl:
            block(s, x + 0.28, y + 0.95, bw - 0.5, 0.55,
                  [[R("Events run in the last 12 months  ", GREY), R("(confirm)", ACCENT)]], size=10.5, ls=1.3)
        else:
            block(s, x + 0.28, y + 0.95, bw - 0.5, 0.55, [lbl], size=10.5, color=GREY, ls=1.3)
    footer(s, "The community", "04")

    # ===== 5 · GROWTH (baked-in) =====
    s = slide()
    topbar(s, "Momentum")
    kicker(s, LM, 1.0, "Growth")
    h1(s, LM, 1.34, [[["Compounding every month, ", "white"], ["with zero paid acquisition", "red"]]], size=30)
    bullets = [
        [R("3+ years of monthly flagships", WHITE, bold=True), R(", now on edition 37, never missed a month.", SOFT)],
        [R("Word-of-mouth only. ", WHITE, bold=True), R("Growth is organic, driven by the quality of the room, not ad spend.", SOFT)],
        [R("An owned audience. ", WHITE, bold=True), R("Every member now flows into our CRM with email and consent.", SOFT)],
    ]
    y = 2.7
    for b in bullets:
        rect(s, LM, y + 0.05, 0.16, 0.16, fill=RED)
        block(s, LM + 0.36, y, 6.3, 0.6, [b], size=12.5, ls=1.35)
        y += 0.85
    block(s, 8.1, 2.45, 4.4, 1.0, [R("240%", RED, bold=True, font=SERIF, size=56)])
    block(s, 8.15, 3.6, 4.4, 0.3, [R("MEMBER GROWTH, YEAR ON YEAR", GREY, font=MONO, size=8.5)])
    base_x, base_y, bh_max = 8.15, 5.55, 1.25
    for i, (yr, frac) in enumerate([("2023", .18), ("2024", .38), ("2025", .62), ("2026", 1.0)]):
        bxx = base_x + i * 1.0
        rect(s, bxx, base_y - bh_max * frac, 0.72, bh_max * frac, fill=RED)
        block(s, bxx - 0.1, base_y + 0.06, 0.92, 0.25, [R(yr, GREY, font=MONO, size=7.5)], align=PP_ALIGN.CENTER)
    block(s, base_x, base_y + 0.4, 4.2, 0.3, ["Directional trajectory · members year on year"], size=8.5, color=GREY)
    footer(s, "Growth", "05")

    # ===== 6 · THE FIT FOR <PARTNER> =====
    ft = cfg["fit"]
    s = slide()
    topbar(s, f"The fit for {NAME}")
    kicker(s, LM, 1.0, ft["kicker"])
    h1(s, LM, 1.34, ft["title"])
    cw = (CW - 0.68) / 3
    for i, (hh, ti, body) in enumerate(ft["cols"]):
        x = LM + i * (cw + 0.34)
        block(s, x, 2.7, cw, 0.25, [R(hh.upper(), RED, font=MONO, size=8)])
        block(s, x, 2.98, cw, 0.4, [R(ti, WHITE, bold=True, font=SERIF, size=16)])
        block(s, x, 3.5, cw, 1.3, [body], size=10.5, color=GREY, ls=1.4)
    block(s, LM, 5.2, 11.2, 0.8, [ft["lead"]], size=13.5, color=SOFT, ls=1.45)
    footer(s, "The audience", "06")

    # ===== 7 · VISION (baked-in) =====
    s = slide()
    topbar(s, "Where we're going")
    kicker(s, LM, 1.0, "Vision")
    h1(s, LM, 1.34, [[["From monthly meetups to ", "white"], ["the region's flagship", "red"]]])
    rect(s, LM, 2.95, CW, 0.012, fill=LINE)
    road = [
        ("Now", "Monthly flagships", "2,500+ members, four event formats, every month in Canggu.", RED),
        ("2026", "The Podcast", "Launching soon. Founder and operator stories, with partner segments.", ACCENT),
        ("2026", "Owned insights", "Aggregated, anonymised ecosystem data from our member CRM.", ACCENT),
        ("2027", "Annual Conference", "Bali's flagship startup & tech conference. The headline stage.", ACCENT),
    ]
    cw = CW / 4
    for i, (when, what, d, dot) in enumerate(road):
        x = LM + i * cw
        oval(s, x, 3.15, 0.16, dot)
        block(s, x + 0.32, 3.12, cw - 0.4, 0.25, [R(when.upper(), GREY, font=MONO, size=8.5)])
        block(s, x + 0.32, 3.4, cw - 0.4, 0.4, [R(what, WHITE, bold=True, font=SERIF, size=15)])
        block(s, x + 0.32, 3.85, cw - 0.45, 1.1, [d], size=9.5, color=GREY, ls=1.35)
    block(s, LM, 5.5, 11.2, 0.7,
          ["A partner who joins now grows with us, from the monthly room to the podcast feed to "
           "the 2027 conference stage."], size=13.5, color=SOFT, ls=1.45)
    footer(s, "Vision", "07")

    # ===== 8 · CATEGORY EXCLUSIVITY =====
    ex = cfg["exclusivity"]
    s = slide()
    topbar(s, "The proposal")
    kicker(s, LM, 1.0, "Category exclusivity")
    h1(s, LM, 1.34, ex["headline"])
    lead_runs = [R(t, CMAP.get(c, SOFT)) for (t, c) in ex["lead_runs"]]
    block(s, LM, 2.3, 11.4, 0.7, [lead_runs], size=13, ls=1.4)
    iw = (CW - 0.44) / 3
    ih = 1.25
    for i, (t, sub) in enumerate(ex["incl"]):
        r, c = divmod(i, 3)
        x = LM + c * (iw + 0.22)
        y = 3.35 + r * (ih + 0.22)
        rect(s, x, y, iw, ih, fill=PANEL, line=LINE, lw=1)
        block(s, x + 0.24, y + 0.22, iw - 0.45, 0.5, [R(t, WHITE, bold=True, size=11.5)])
        block(s, x + 0.24, y + 0.66, iw - 0.45, 0.5, [sub], size=9.5, color=GREY, ls=1.3)
    footer(s, "The partnership", "08")

    # ===== 9 · WAYS TO PARTNER (no pricing) =====
    pk = cfg["packages"]
    s = slide()
    topbar(s, "Ways to partner")
    kicker(s, LM, 1.0, "The shape of it")
    h1(s, LM, 1.34, [[["Two ways to partner. ", "white"], ["Annual goes deepest.", "red"]]])
    py, ph = 2.5, 3.3
    qw = CW * 0.42
    rect(s, LM, py, qw, ph, fill=PANEL, line=LINE, lw=1)
    block(s, LM + 0.4, py + 0.34, qw - 0.8, 0.3, [R("QUARTERLY", GREY, font=MONO, size=8)])
    block(s, LM + 0.4, py + 0.62, qw - 0.8, 0.5, [R("Category Partner", WHITE, bold=True, font=SERIF, size=21)])
    block(s, LM + 0.4, py + 1.16, qw - 0.8, 0.3, [R(pk["term"] + " · one quarter", GREY, size=10)])
    yy = py + 1.72
    for it in pk["quarterly_items"]:
        block(s, LM + 0.4, yy, qw - 0.8, 0.32, [[R("+  ", RED, bold=True), R(it, SOFT)]], size=10.5, ls=1.2)
        yy += 0.36
    ax = LM + qw + 0.34
    aw = CW - qw - 0.34
    rect(s, ax, py, aw, ph, fill=HEROBG, line=RED, lw=1.4)
    block(s, ax + 0.42, py + 0.34, aw - 0.84, 0.3, [R("RECOMMENDED · ANNUAL", RED, font=MONO, size=8)])
    block(s, ax + 0.42, py + 0.62, aw - 0.84, 0.5, [R("Strategic Partner", WHITE, bold=True, font=SERIF, size=21)])
    block(s, ax + 0.42, py + 1.16, aw - 0.84, 0.3, [R(pk["term"] + " · the full year", GREY, size=10)])
    yy = py + 1.72
    for it in pk["annual_items"]:
        block(s, ax + 0.42, yy, aw - 0.84, 0.27, [[R("+  ", RED, bold=True), R(it, SOFT)]], size=10.5, ls=1.1)
        yy += 0.265
    block(s, LM, py + ph + 0.16, 11.4, 0.4, [pk.get("note",
          "Scope and investment are a conversation for when the fit is clear. This is a starting point, not a pitch.")],
          size=10, color=GREY)
    footer(s, "Ways to partner", "09")

    # ===== 10 · CLOSE =====
    cl = cfg["close"]
    s = slide()
    topbar(s, "Next steps")
    kicker(s, LM, 1.95, "Let's build it")
    h1(s, LM, 2.35, cl["headline"], size=40)
    block(s, LM, 4.35, 11.2, 0.9, [cl["lead"]], size=13.5, color=SOFT, ls=1.45)
    for i, (lbl, val) in enumerate(cl["cta"]):
        x = LM + i * 3.7
        block(s, x, 5.6, 3.6, 0.25, [R(lbl.upper(), GREY2, font=MONO, size=8)])
        block(s, x, 5.86, 3.6, 0.4, [R(val, WHITE, bold=True, font=SERIF, size=15)])
    footer(s, XBRAND + " · Partnership Proposal", "10")

    out = f"public/{SLUG}-bstc-partnership-deck.pptx"
    prs.save(out)
    print(f"Saved {out} — {len(prs.slides._sldIdLst)} slides")

    # best-effort PDF via LibreOffice
    soffice = shutil.which("soffice") or "/Applications/LibreOffice.app/Contents/MacOS/soffice"
    if shutil.which(soffice) or subprocess.run(["test", "-x", soffice]).returncode == 0:
        try:
            subprocess.run([soffice, "--headless", "--convert-to", "pdf", "--outdir", "public", out],
                           check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=90)
            print(f"Saved public/{SLUG}-bstc-partnership-deck.pdf")
        except Exception as e:
            print("PDF skipped:", e)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: python3 public/partner-decks/generate.py <config.json>")
    build(sys.argv[1])
