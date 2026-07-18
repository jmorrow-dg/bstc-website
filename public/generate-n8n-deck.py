#!/usr/bin/env python3
"""Generate the n8n x BSTC partnership deck as an editable PPTX.

Mirrors the HTML/PDF design: dark slides, Georgia display, BSTC red + n8n coral.
Run from repo root:  python3 public/generate-n8n-deck.py
Output: public/n8n-bstc-partnership-deck.pptx
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# ---- palette ----
BG     = RGBColor(0x0E, 0x0E, 0x0E)
PANEL  = RGBColor(0x18, 0x18, 0x18)
HEROBG = RGBColor(0x20, 0x14, 0x14)
WHITE  = RGBColor(0xF5, 0xF5, 0xF5)
SOFT   = RGBColor(0xCF, 0xCF, 0xCF)
GREY   = RGBColor(0x9A, 0x9A, 0x9A)
GREY2  = RGBColor(0x6E, 0x6E, 0x6E)
RED    = RGBColor(0xC8, 0x1E, 0x1E)
CORAL  = RGBColor(0xEA, 0x4B, 0x71)   # n8n coral
AMBER  = RGBColor(0xE8, 0xB0, 0x4B)
LINE   = RGBColor(0x33, 0x33, 0x33)

SERIF = "Georgia"
SANS  = "Helvetica Neue"
MONO  = "Courier New"

LM, RM, TM = 0.9, 0.9, 0.62
W, H = 13.333, 7.5
CW = W - LM - RM

prs = Presentation()
prs.slide_width = Inches(W)
prs.slide_height = Inches(H)
BLANK = prs.slide_layouts[6]


def R(text, color=WHITE, bold=False, italic=False, font=SANS, size=None):
    return dict(text=text, color=color, bold=bold, italic=italic, font=font, size=size)


def slide():
    s = prs.slides.add_slide(BLANK)
    f = s.background.fill
    f.solid(); f.fore_color.rgb = BG
    return s


def block(s, l, t, w, h, paras, size=14, align=PP_ALIGN.LEFT,
          anchor=MSO_ANCHOR.TOP, ls=1.0, font=SANS, color=WHITE, space=None):
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
        if space is not None:
            p.space_after = Pt(space)
        runs = para if isinstance(para, list) else [para]
        for run in runs:
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


def kicker(s, l, t, text, color=RED):
    block(s, l, t, 8, 0.25, [R(text.upper(), color, font=MONO, size=9.5)])


def topbar(s, left, right):
    block(s, LM, TM - 0.32, 6, 0.25, [R(left.upper(), GREY, font=MONO, size=8.5)])
    block(s, W - RM - 5, TM - 0.32, 5, 0.25, [R(right.upper(), GREY, font=MONO, size=8.5)],
          align=PP_ALIGN.RIGHT)


def footer(s, left, num):
    rect(s, LM, 6.66, CW, 0.012, fill=RGBColor(0x2A, 0x2A, 0x2A))
    block(s, LM, 6.74, 8, 0.3, [R(left.upper(), GREY2, font=MONO, size=7.5)])
    block(s, W - RM - 1, 6.74, 1, 0.3, [R(num, GREY2, font=MONO, size=7.5)], align=PP_ALIGN.RIGHT)


def h1(s, l, t, paras, size=33):
    block(s, l, t, CW, 1.6, paras, size=size, font=SERIF, ls=1.04)


# ============ 1 · COVER ============
s = slide()
topbar(s, "Partnership Proposal", "June 2026 · Confidential")
kicker(s, LM, 2.25, "A category-exclusive partnership")
s.shapes.add_picture("public/images/n8n-logo.png", Inches(LM), Inches(2.58), height=Inches(0.6))
block(s, 3.35, 2.55, 0.5, 0.6, [R("×", GREY2, font=SERIF, size=30)])
s.shapes.add_picture("public/images/bstc-badge.png", Inches(3.95), Inches(2.55), height=Inches(0.66))
block(s, 4.8, 2.55, 6, 0.7,
      [[R("BSTC", WHITE, bold=True, font=SERIF, size=27)],
       [R("BALI STARTUPS & TECH COMMUNITY", GREY, font=MONO, size=7.5)]], ls=1.0)
h1(s, LM, 3.55,
   [[R("Own the automation category in", WHITE, bold=True, font=SERIF)],
    [R("Bali's builder ecosystem.", RED, bold=True, font=SERIF)]], size=40)
meta = [("Prepared for", "The n8n team"), ("From", "BSTC"), ("Re", "Community partnership")]
for i, (lbl, val) in enumerate(meta):
    x = LM + i * 2.7
    block(s, x, 5.65, 2.6, 0.25, [R(lbl.upper(), GREY2, font=MONO, size=7.5)])
    block(s, x, 5.9, 2.6, 0.35, [R(val, WHITE, bold=True, font=SERIF, size=13)])
footer(s, "n8n × BSTC", "01")

# ============ 2 · WHY NOW ============
s = slide()
topbar(s, "Why now", "n8n × BSTC")
kicker(s, LM, 1.0, "The timing")
h1(s, LM, 1.34, [[R("The cost of building a company ", WHITE, bold=True, font=SERIF),
                 R("just collapsed.", RED, bold=True, font=SERIF)]])
block(s, LM, 2.25, 11.4, 0.9,
      ["AI has democratised building. A single founder can now design, build and automate what "
       "used to take a funded team, and a new wave of AI-native builders is the result. It is "
       "accelerating, and they are wiring up their tooling right now."],
      size=13.5, color=SOFT, ls=1.4)
cw = (CW - 0.68) / 3
twocols = [
    ("Democratised building", "Anyone can ship",
     "AI and no-code tools have removed the technical barrier. An idea becomes a live, automated product without a dev team."),
    ("An AI-native wave", "Everyone automates now",
     "Solo founders and small teams wire tools together and orchestrate AI agents to do the work of ten. The volume is rising fast."),
]
for i, (hh, ti, body) in enumerate(twocols):
    x = LM + i * (cw + 0.34)
    block(s, x, 3.35, cw, 0.25, [R(hh.upper(), RED, font=MONO, size=8)])
    block(s, x, 3.62, cw, 0.4, [R(ti, WHITE, bold=True, font=SERIF, size=16)])
    block(s, x, 4.12, cw, 1.0, [body], size=10.5, color=GREY, ls=1.35)
# column 3: the member-request surge (real data)
x3 = LM + 2 * (cw + 0.34)
block(s, x3, 3.35, cw, 0.25, [R("THE LAST SIX MONTHS", RED, font=MONO, size=8)])
block(s, x3, 3.62, cw, 0.4, [[R("About ", WHITE, bold=True, font=SERIF, size=16),
                              R("10x", RED, bold=True, font=SERIF, size=16),
                              R(" the requests", WHITE, bold=True, font=SERIF, size=16)]])
vals = [10, 8, 14, 104, 98, 117]
mx = max(vals); baseY = 4.98; areaH = 0.92; bw_ = 0.34; gap_ = 0.17
for j, v in enumerate(vals):
    bx = x3 + j * (bw_ + gap_)
    bhh = max(areaH * v / mx, 0.05)
    rect(s, bx, baseY - bhh, bw_, bhh, fill=(GREY2 if j < 3 else RED))
    block(s, bx - 0.08, baseY + 0.04, bw_ + 0.16, 0.2, [R(str(v), GREY, font=MONO, size=6.5)], align=PP_ALIGN.CENTER)
block(s, x3, baseY + 0.26, cw, 0.3, [R("New member requests / month", GREY, size=9)])
block(s, LM, 5.55, 11.4, 0.7,
      ["They automate from day one, and they are choosing their tooling stack now. "
       "The window to become their default is open."], size=13.5, color=SOFT, ls=1.4)
footer(s, "Why now", "02")

# ============ 3 · THE FIT ============
s = slide()
topbar(s, "Why this works", "n8n × BSTC")
kicker(s, LM, 1.55, "The thesis")
h1(s, LM, 1.95, [[R("You power the builders ", WHITE, bold=True, font=SERIF),
                 R("automating", WHITE, bold=False, italic=True, font=SERIF),
                 R(" their work.", WHITE, bold=True, font=SERIF)],
                [R("So do we.", RED, bold=True, font=SERIF)]])
block(s, LM, 3.85, 11.0, 1.4,
      ["Bali has quietly become a real hub for global-first builders. BSTC is its centre of "
       "gravity: 2,500+ founders, engineers and operators, most of them automating everything "
       "they can and building with AI from day one. That is your user, in one room, every month."],
      size=14, color=SOFT, ls=1.5)
footer(s, "The fit", "03")

# ============ 4 · COMMUNITY ============
s = slide()
topbar(s, "The community", "n8n × BSTC")
kicker(s, LM, 1.0, "Size & reach")
h1(s, LM, 1.34, [[R("Bali's builder community, ", WHITE, bold=True, font=SERIF),
                 R("in one place", RED, bold=True, font=SERIF)]])
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
    ncol = AMBER if n == "[ ]" else WHITE
    block(s, x + 0.28, y + 0.24, bw - 0.5, 0.7, [R(n, ncol, bold=True, font=SERIF, size=34)])
    if "(confirm)" in lbl:
        block(s, x + 0.28, y + 0.95, bw - 0.5, 0.55,
              [[R("Events run in the last 12 months  ", GREY), R("(confirm)", CORAL)]], size=10.5, ls=1.3)
    else:
        block(s, x + 0.28, y + 0.95, bw - 0.5, 0.55, [lbl], size=10.5, color=GREY, ls=1.3)
footer(s, "The community", "04")

# ============ 5 · GROWTH ============
s = slide()
topbar(s, "Momentum", "n8n × BSTC")
kicker(s, LM, 1.0, "Growth")
h1(s, LM, 1.34, [[R("Compounding every month, ", WHITE, bold=True, font=SERIF),
                 R("with zero paid acquisition", RED, bold=True, font=SERIF)]], size=30)
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
# right: 240% YoY hero + directional bars
block(s, 8.1, 2.45, 4.4, 1.0, [R("240%", RED, bold=True, font=SERIF, size=56)])
block(s, 8.15, 3.6, 4.4, 0.3, [R("MEMBER GROWTH, YEAR ON YEAR", GREY, font=MONO, size=8.5)])
base_x, base_y, bh_max = 8.15, 5.55, 1.25
for i, (yr, frac) in enumerate([("2023", .18), ("2024", .38), ("2025", .62), ("2026", 1.0)]):
    bx = base_x + i * 1.0
    bhh = bh_max * frac
    rect(s, bx, base_y - bhh, 0.72, bhh, fill=RED)
    block(s, bx - 0.1, base_y + 0.06, 0.92, 0.25, [R(yr, GREY, font=MONO, size=7.5)], align=PP_ALIGN.CENTER)
block(s, base_x, base_y + 0.4, 4.2, 0.3, ["Directional trajectory · members year on year"], size=8.5, color=GREY)
footer(s, "Growth", "05")

# ============ 6 · AUDIENCE ============
s = slide()
topbar(s, "The fit for n8n", "n8n × BSTC")
kicker(s, LM, 1.0, "Why n8n, specifically")
h1(s, LM, 1.34, [[R("Exactly who ", WHITE, bold=True, font=SERIF),
                 R("n8n", CORAL, bold=True, font=SERIF),
                 R(" is built for", WHITE, bold=True, font=SERIF)]])
acols = [
    ("Who they are", "AI-native builders",
     "Founders, engineers and operators who automate everything and build with AI. n8n is already in their stack, or about to be."),
    ("What they need", "Workflow & AI automation",
     "Connecting tools, orchestrating AI agents, automating ops end to end. The exact problems n8n solves, felt daily."),
    ("Where you fit", "The default tool",
     "Be the automation platform the community learns hands-on and defaults to, through workshops and the How I Build with AI series."),
]
cw = (CW - 0.68) / 3
for i, (hh, ti, body) in enumerate(acols):
    x = LM + i * (cw + 0.34)
    block(s, x, 2.7, cw, 0.25, [R(hh.upper(), RED, font=MONO, size=8)])
    block(s, x, 2.98, cw, 0.4, [R(ti, WHITE, bold=True, font=SERIF, size=16)])
    block(s, x, 3.5, cw, 1.3, [body], size=10.5, color=GREY, ls=1.4)
block(s, LM, 5.2, 11.2, 0.8,
      ["Our How I Build with AI series is a natural home for n8n. Hands-on automation workshops "
       "turn the room into power users, and power users into advocates."], size=13.5, color=SOFT, ls=1.45)
footer(s, "The audience", "06")

# ============ 7 · VISION ============
s = slide()
topbar(s, "Where we're going", "n8n × BSTC")
kicker(s, LM, 1.0, "Vision")
h1(s, LM, 1.34, [[R("From monthly meetups to ", WHITE, bold=True, font=SERIF),
                 R("the region's flagship", RED, bold=True, font=SERIF)]])
rect(s, LM, 2.95, CW, 0.012, fill=LINE)
road = [
    ("Now", "Monthly flagships", "2,500+ members, four event formats, every month in Canggu.", RED),
    ("2026", "The Podcast", "Launching soon. Builder stories and operator playbooks, with partner segments.", CORAL),
    ("2026", "Owned insights", "Aggregated, anonymised ecosystem data from our member CRM.", CORAL),
    ("2027", "Annual Conference", "Bali's flagship startup & tech conference. The headline stage.", CORAL),
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

# ============ 8 · PARTNERSHIP ============
s = slide()
topbar(s, "The proposal", "n8n × BSTC")
kicker(s, LM, 1.0, "Category exclusivity")
h1(s, LM, 1.34, [[R("Own the category. Be our ", WHITE, bold=True, font=SERIF),
                 R("only", RED, bold=True, font=SERIF),
                 R(" automation partner.", WHITE, bold=True, font=SERIF)]])
block(s, LM, 2.3, 11.4, 0.7,
      [[R("n8n", CORAL), R(" as the sole automation and workflow brand across every BSTC surface "
        "for the term: events, workshops, podcast and the 2027 conference. No competing automation tool in the room.", SOFT)]],
      size=13, ls=1.4)
incl = [
    ("Flagship event sponsorship", "Your brand on the monthly room that defines the scene."),
    ("Hands-on n8n workshops", "The How I Build with AI series, built around n8n."),
    ("Builder perks", "n8n Cloud credits, Pro seats and setup support for members."),
    ("Podcast presence", "Partner segments and host reads as the show launches."),
    ("Conference 2027", "Headline automation partner of Bali's flagship event."),
    ("Ecosystem insights", "Aggregated, anonymised data on how Bali builders build."),
]
iw = (CW - 0.44) / 3
ih = 1.25
for i, (t, sub) in enumerate(incl):
    r, c = divmod(i, 3)
    x = LM + c * (iw + 0.22)
    y = 3.35 + r * (ih + 0.22)
    rect(s, x, y, iw, ih, fill=PANEL, line=LINE, lw=1)
    block(s, x + 0.24, y + 0.22, iw - 0.45, 0.5, [R(t, WHITE, bold=True, size=11.5)])
    block(s, x + 0.24, y + 0.66, iw - 0.45, 0.5, [sub], size=9.5, color=GREY, ls=1.3)
footer(s, "The partnership", "08")

# ============ 9 · WAYS TO PARTNER (exploratory, no pricing) ============
s = slide()
topbar(s, "Ways to partner", "n8n × BSTC")
kicker(s, LM, 1.0, "The shape of it")
h1(s, LM, 1.34, [[R("Two ways to partner. ", WHITE, bold=True, font=SERIF),
                 R("Annual goes deepest.", RED, bold=True, font=SERIF)]])
py, ph = 2.5, 3.3
qw = CW * 0.42
rect(s, LM, py, qw, ph, fill=PANEL, line=LINE, lw=1)
block(s, LM + 0.4, py + 0.34, qw - 0.8, 0.3, [R("QUARTERLY", GREY, font=MONO, size=8)])
block(s, LM + 0.4, py + 0.62, qw - 0.8, 0.5, [R("Category Partner", WHITE, bold=True, font=SERIF, size=21)])
block(s, LM + 0.4, py + 1.16, qw - 0.8, 0.3, [R("Exclusive automation partner · one quarter", GREY, size=10)])
qitems = ["Category exclusivity for the quarter", "Flagship event sponsorship",
          "One hands-on n8n workshop", "Builder perks in the member guide"]
yy = py + 1.72
for it in qitems:
    block(s, LM + 0.4, yy, qw - 0.8, 0.32, [[R("+  ", RED, bold=True), R(it, SOFT)]], size=10.5, ls=1.2)
    yy += 0.36
ax = LM + qw + 0.34
aw = CW - qw - 0.34
rect(s, ax, py, aw, ph, fill=HEROBG, line=RED, lw=1.4)
block(s, ax + 0.42, py + 0.34, aw - 0.84, 0.3, [R("RECOMMENDED · ANNUAL", RED, font=MONO, size=8)])
block(s, ax + 0.42, py + 0.62, aw - 0.84, 0.5, [R("Strategic Partner", WHITE, bold=True, font=SERIF, size=21)])
block(s, ax + 0.42, py + 1.16, aw - 0.84, 0.3, [R("Exclusive automation partner · the full year", GREY, size=10)])
aitems = ["Category exclusivity for the full year", "Every flagship night, all four formats",
          "Full n8n workshop track, How I Build with AI", "Podcast presence as it launches",
          "Headline automation partner, Conference 2027", "Aggregated ecosystem insights"]
yy = py + 1.72
for it in aitems:
    block(s, ax + 0.42, yy, aw - 0.84, 0.27, [[R("+  ", RED, bold=True), R(it, SOFT)]], size=10.5, ls=1.1)
    yy += 0.265
block(s, LM, py + ph + 0.16, 11.4, 0.4,
      ["Scope and investment are a conversation for when the fit is clear. This is a starting point, not a pitch."],
      size=10, color=GREY)
footer(s, "Ways to partner", "09")

# ============ 10 · CLOSE ============
s = slide()
topbar(s, "Next steps", "n8n × BSTC")
kicker(s, LM, 1.95, "Let's build it")
h1(s, LM, 2.35, [[R("Be the tool Bali's builders", WHITE, bold=True, font=SERIF)],
                [R("reach for when they ", WHITE, bold=True, font=SERIF),
                 R("automate.", WHITE, bold=False, italic=True, font=SERIF)]], size=40)
block(s, LM, 4.35, 11.2, 0.9,
      ["The builders wiring up their stack are already in our community, learning with AI every "
       "month. We are offering you the whole automation category, for a year, including the stage "
       "we are building for 2027. Let's find the shape that fits."], size=13.5, color=SOFT, ls=1.45)
cta = [("The ask", "Annual category exclusivity"), ("The next step", "An intro call"), ("Contact", "BSTC")]
for i, (lbl, val) in enumerate(cta):
    x = LM + i * 3.7
    block(s, x, 5.6, 3.6, 0.25, [R(lbl.upper(), GREY2, font=MONO, size=8)])
    block(s, x, 5.86, 3.6, 0.4, [R(val, WHITE, bold=True, font=SERIF, size=15)])
footer(s, "n8n × BSTC · Partnership Proposal", "10")

prs.save("public/n8n-bstc-partnership-deck.pptx")
print("Saved public/n8n-bstc-partnership-deck.pptx —", len(prs.slides._sldIdLst), "slides")
