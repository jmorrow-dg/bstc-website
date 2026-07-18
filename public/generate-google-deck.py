#!/usr/bin/env python3
"""Generate the Google x BSTC partnership deck as an editable PPTX.

House template (dark slides, Georgia display, BSTC red) with Google blue as the
partner accent. Built for the developer-ecosystem call with David McLaughlin,
Sami Kizilbash, Manikantan Krishnamurthy and Brett Morgan.
Run from repo root:  python3 public/generate-google-deck.py
Output: ~/Desktop/Google x BSTC - Partnership Intro (v2).pptx
"""
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# ---- palette ----
BG     = RGBColor(0x0E, 0x0E, 0x0E)
PANEL  = RGBColor(0x18, 0x18, 0x18)
WHITE  = RGBColor(0xF5, 0xF5, 0xF5)
SOFT   = RGBColor(0xCF, 0xCF, 0xCF)
GREY   = RGBColor(0x9A, 0x9A, 0x9A)
GREY2  = RGBColor(0x6E, 0x6E, 0x6E)
RED    = RGBColor(0xC8, 0x1E, 0x1E)
LINE   = RGBColor(0x33, 0x33, 0x33)
GBLUE  = RGBColor(0x42, 0x85, 0xF4)
GRED   = RGBColor(0xEA, 0x43, 0x35)
GYEL   = RGBColor(0xFB, 0xBC, 0x05)
GGRN   = RGBColor(0x34, 0xA8, 0x53)

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
topbar(s, "Partnership Proposal", "July 2026 · Confidential")
kicker(s, LM, 2.25, "A builder-ecosystem partnership", GBLUE)
block(s, LM, 2.5, 2.6, 0.6, [R("Google", WHITE, bold=True, font=SANS, size=32)])
for i, col in enumerate([GBLUE, GRED, GYEL, GGRN]):
    rect(s, LM + 0.02 + i * 0.52, 3.12, 0.48, 0.05, fill=col)
block(s, 3.4, 2.5, 0.5, 0.6, [R("×", GREY2, font=SERIF, size=30)])
s.shapes.add_picture("public/images/bstc-badge.png", Inches(4.0), Inches(2.5), height=Inches(0.66))
block(s, 4.85, 2.5, 6, 0.7,
      [[R("BSTC", WHITE, bold=True, font=SERIF, size=27)],
       [R("BALI STARTUPS & TECH COMMUNITY", GREY, font=MONO, size=7.5)]], ls=1.0)
h1(s, LM, 3.55,
   [[R("Put Google's AI stack in the hands", WHITE, bold=True, font=SERIF)],
    [R("of Bali's builders.", RED, bold=True, font=SERIF)]], size=40)
meta = [("Prepared for", "David McLaughlin & team, Google"), ("From", "BSTC"), ("Context", "Partnership call · July 2026")]
for i, (lbl, val) in enumerate(meta):
    x = LM + i * 3.9
    block(s, x, 5.65, 3.8, 0.25, [R(lbl.upper(), GREY2, font=MONO, size=7.5)])
    block(s, x, 5.9, 3.8, 0.35, [R(val, WHITE, bold=True, font=SERIF, size=13)])
footer(s, "Google × BSTC", "01")

# ============ 2 · WHY NOW ============
s = slide()
topbar(s, "Why now", "Google × BSTC")
kicker(s, LM, 1.0, "The timing")
h1(s, LM, 1.34, [[R("The cost of starting a company ", WHITE, bold=True, font=SERIF),
                 R("just collapsed.", RED, bold=True, font=SERIF)]])
block(s, LM, 2.25, 11.4, 0.9,
      ["AI has democratised building. A single founder can now design, build and ship what used "
       "to take a funded team, and a new wave of early-stage founders is the result. It is "
       "accelerating, and they are choosing their AI stack right now."],
      size=13.5, color=SOFT, ls=1.4)
cw = (CW - 0.68) / 3
twocols = [
    ("Democratised building", "Anyone can ship",
     "AI and no-code tools have removed the technical barrier. An idea becomes a live product without a dev team."),
    ("An AI-native wave", "More builders than ever",
     "Solo founders and small teams use AI to go from idea to launch in weeks, not quarters. The volume is rising fast."),
]
for i, (hh, ti, body) in enumerate(twocols):
    x = LM + i * (cw + 0.34)
    block(s, x, 3.35, cw, 0.25, [R(hh.upper(), RED, font=MONO, size=8)])
    block(s, x, 3.62, cw, 0.4, [R(ti, WHITE, bold=True, font=SERIF, size=16)])
    block(s, x, 4.12, cw, 1.0, [body], size=10.5, color=GREY, ls=1.35)
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
      ["They build with AI from day one, and they are picking their models, tools and APIs now. "
       "The window to make Gemini their default is open."], size=13.5, color=SOFT, ls=1.4)
footer(s, "Why now", "02")

# ============ 3 · THE FIT ============
s = slide()
topbar(s, "Why this works", "Google × BSTC")
kicker(s, LM, 1.55, "The thesis")
h1(s, LM, 1.95, [[R("You want builders building ", WHITE, bold=True, font=SERIF),
                 R("on Gemini", WHITE, bold=False, italic=True, font=SERIF),
                 R(".", WHITE, bold=True, font=SERIF)],
                [R("We have a room full of them.", RED, bold=True, font=SERIF)]])
block(s, LM, 3.85, 11.0, 1.4,
      ["Bali has quietly become a real hub for AI-native startups. BSTC is its centre of "
       "gravity: 2,500+ founders, engineers and operators, building with AI from day one. "
       "That is your developer audience, in one room, every month."],
      size=14, color=SOFT, ls=1.5)
footer(s, "The fit", "03")

# ============ 4 · COMMUNITY ============
s = slide()
topbar(s, "The community", "Google × BSTC")
kicker(s, LM, 1.0, "Size & reach")
h1(s, LM, 1.34, [[R("Bali's builder community, ", WHITE, bold=True, font=SERIF),
                 R("in one place", RED, bold=True, font=SERIF)]])
stats = [
    ("2,500+", "Founders, engineers & operators in the community"),
    ("37", "Monthly flagship networking nights, and counting"),
    ("40–80", "High-signal attendees at every flagship night"),
    ("4", "Event formats: networking, How I Build with AI, builder sessions, roundtables"),
    ("10+", "Editions of the How I Build with AI series"),
    ("26", "Events run in the last 12 months"),
]
bw = (CW - 0.6) / 3
bh = 1.55
for i, (n, lbl) in enumerate(stats):
    r, c = divmod(i, 3)
    x = LM + c * (bw + 0.3)
    y = 2.5 + r * (bh + 0.28)
    rect(s, x, y, bw, bh, fill=PANEL, line=LINE, lw=1)
    block(s, x + 0.28, y + 0.24, bw - 0.5, 0.7, [R(n, WHITE, bold=True, font=SERIF, size=34)])
    block(s, x + 0.28, y + 0.95, bw - 0.5, 0.55, [lbl], size=10.5, color=GREY, ls=1.3)
footer(s, "The community", "04")

# ============ 5 · GROWTH ============
s = slide()
topbar(s, "Momentum", "Google × BSTC")
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

# ============ 6 · THE FIT FOR GOOGLE ============
s = slide()
topbar(s, "The fit for Google", "Google × BSTC")
kicker(s, LM, 1.0, "Why Google, specifically")
h1(s, LM, 1.34, [[R("Exactly who ", WHITE, bold=True, font=SERIF),
                 R("Google's AI stack", GBLUE, bold=True, font=SERIF),
                 R(" is built for", WHITE, bold=True, font=SERIF)]])
acols = [
    ("Who they are", "AI-native builders",
     "Founders and small teams building products with LLMs at the core. They prototype fast, ship weekly, and demo what they build to each other."),
    ("What they need", "A serious AI stack",
     "A free on-ramp and a path to scale: AI Studio and the Gemini API free tier to start building today, Antigravity for agentic development, Cloud when they grow."),
    ("Where you fit", "The default platform",
     "Be the stack the community learns, builds and demos with, through the series built for exactly that: How I Build with AI."),
]
cw = (CW - 0.68) / 3
for i, (hh, ti, body) in enumerate(acols):
    x = LM + i * (cw + 0.34)
    block(s, x, 2.7, cw, 0.25, [R(hh.upper(), RED, font=MONO, size=8)])
    block(s, x, 2.98, cw, 0.4, [R(ti, WHITE, bold=True, font=SERIF, size=16)])
    block(s, x, 3.5, cw, 1.3, [body], size=10.5, color=GREY, ls=1.4)
block(s, LM, 5.2, 11.2, 0.8,
      ["Your team asked whether our startups want to hear about Gemini API, AI Studio and "
       "Antigravity. They do, and we already run the stage built for it: a monthly series where "
       "builders show exactly how they build with AI."], size=13.5, color=SOFT, ls=1.45)
footer(s, "The audience", "06")

# ============ 7 · VISION ============
s = slide()
topbar(s, "Where we're going", "Google × BSTC")
kicker(s, LM, 1.0, "Vision")
h1(s, LM, 1.34, [[R("From monthly meetups to ", WHITE, bold=True, font=SERIF),
                 R("the region's flagship", RED, bold=True, font=SERIF)]])
rect(s, LM, 2.95, CW, 0.012, fill=LINE)
road = [
    ("Now", "Monthly flagships", "2,500+ members, four event formats, every month in Canggu.", RED),
    ("2026", "The Podcast", "Launching soon. Founder stories and operator playbooks, with partner segments.", GBLUE),
    ("2026", "Owned insights", "Aggregated, anonymised ecosystem data from our member CRM.", GBLUE),
    ("2027", "Annual Conference", "Bali's flagship startup & tech conference. The headline stage.", GBLUE),
]
cw = CW / 4
for i, (when, what, d, dot) in enumerate(road):
    x = LM + i * cw
    oval(s, x, 3.15, 0.16, dot)
    block(s, x, 3.5, cw - 0.3, 0.25, [R(when.upper(), GREY, font=MONO, size=8.5)])
    block(s, x, 3.78, cw - 0.3, 0.4, [R(what, WHITE, bold=True, font=SERIF, size=15)])
    block(s, x, 4.28, cw - 0.3, 1.2, [d], size=10, color=GREY, ls=1.35)
block(s, LM, 5.75, 11.4, 0.6,
      ["A partner who joins now grows with us, from the monthly room to the podcast feed to the "
       "2027 conference stage. Google Cloud is building an AI corridor from Southeast Asia to "
       "Silicon Valley. This community sits inside it."], size=12.5, color=SOFT, ls=1.4)
footer(s, "Vision", "07")

# ============ 8 · THE PARTNERSHIP ============
s = slide()
topbar(s, "The proposal", "Google × BSTC")
kicker(s, LM, 1.0, "What we run together")
h1(s, LM, 1.34, [[R("Make Google the stack ", WHITE, bold=True, font=SERIF),
                 R("Bali builds on.", RED, bold=True, font=SERIF)]])
block(s, LM, 2.3, 11.4, 0.6,
      ["Google as the AI platform across BSTC's surfaces: the flagship nights, the How I Build "
       "with AI series, the podcast, and the 2027 conference."], size=13, color=SOFT, ls=1.4)
offers = [
    ("Gemini on stage", "How I Build with AI editions built around Gemini API and AI Studio. Live builds by members, not slide decks."),
    ("Antigravity build nights", "Hands-on sessions in Google's agentic development platform while it is in free public preview. Builders ship something real in the room."),
    ("Founder pathways", "Google for Startups surfaced to every member: cloud credit pathways up to US$350K for eligible AI-first startups, application-based."),
    ("The flagship stage", "A standing invitation for your DevRel and ecosystem team on the monthly night that defines the scene, whenever you are in region."),
]
bw = (CW - 0.4) / 2
bh = 1.42
for i, (ti, body) in enumerate(offers):
    r, c = divmod(i, 2)
    x = LM + c * (bw + 0.4)
    y = 3.15 + r * (bh + 0.26)
    rect(s, x, y, bw, bh, fill=PANEL, line=LINE, lw=1)
    block(s, x + 0.28, y + 0.2, bw - 0.5, 0.35, [R(ti, WHITE, bold=True, font=SERIF, size=15)])
    block(s, x + 0.28, y + 0.62, bw - 0.5, 0.7, [body], size=10, color=GREY, ls=1.35)
footer(s, "The proposal", "08")

# ============ 9 · WAYS TO PARTNER ============
s = slide()
topbar(s, "Ways to partner", "Google × BSTC")
kicker(s, LM, 1.0, "The shape of it")
h1(s, LM, 1.34, [[R("Two ways to partner. ", WHITE, bold=True, font=SERIF),
                 R("Annual goes deepest.", RED, bold=True, font=SERIF)]], size=30)
colw = (CW - 0.5) / 2
tiers = [
    ("QUARTERLY", "Community Partner", GREY, [
        "One How I Build with AI edition on Gemini API + AI Studio",
        "Speaker slot at each monthly flagship night",
        "One Antigravity build night",
        "Founder pathways in the member guide and WhatsApp",
    ]),
    ("RECOMMENDED · ANNUAL", "Strategic AI Partner", GBLUE, [
        "AI-platform exclusivity: no competing model provider on our stages",
        "The full How I Build with AI track, built on the Gemini stack",
        "Quarterly Antigravity build nights",
        "Podcast presence as it launches",
        "First call on the 2027 conference headline stage",
    ]),
]
for i, (tag, name, tagcol, items) in enumerate(tiers):
    x = LM + i * (colw + 0.5)
    hgt = 4.0
    rect(s, x, 2.35, colw, hgt, fill=PANEL, line=(GBLUE if i == 1 else LINE), lw=(1.5 if i == 1 else 1))
    block(s, x + 0.3, 2.6, colw - 0.6, 0.25, [R(tag, tagcol, font=MONO, size=8.5)])
    block(s, x + 0.3, 2.9, colw - 0.6, 0.45, [R(name, WHITE, bold=True, font=SERIF, size=20)])
    yy = 3.55
    for it in items:
        block(s, x + 0.3, yy, 0.3, 0.3, [R("+", tagcol if i == 1 else RED, bold=True, size=12)])
        block(s, x + 0.62, yy, colw - 0.95, 0.55, [it], size=10.5, color=SOFT, ls=1.25)
        yy += 0.52
footer(s, "Ways to partner", "09")

# ============ 10 · NEXT STEPS ============
s = slide()
topbar(s, "Next steps", "Google × BSTC")
kicker(s, LM, 1.55, "Let's build it")
h1(s, LM, 1.95, [[R("Be the platform Bali's builders", WHITE, bold=True, font=SERIF)],
                [R("reach for when they ship.", RED, bold=True, font=SERIF)]], size=36)
block(s, LM, 3.6, 11.2, 1.0,
      ["You asked whether our startups want to hear about Gemini API, AI Studio and Antigravity. "
       "They do. Pick a date, and Gemini is on the How I Build with AI stage within a month."],
      size=14, color=SOFT, ls=1.5)
steps = [
    ("01", "Lock the first edition", "A Gemini API + AI Studio edition of How I Build with AI, targeting August."),
    ("02", "Shape the partnership", "Quarterly or annual, and whether AI-platform exclusivity is on the table."),
    ("03", "Open the pathways", "Google for Startups intro for members, and an Antigravity build night on the calendar."),
]
cw = (CW - 0.68) / 3
for i, (n, ti, body) in enumerate(steps):
    x = LM + i * (cw + 0.34)
    block(s, x, 4.75, cw, 0.4, [R(n, GBLUE, bold=True, font=SERIF, size=20)])
    block(s, x, 5.2, cw, 0.35, [R(ti, WHITE, bold=True, font=SERIF, size=14)])
    block(s, x, 5.6, cw, 0.8, [body], size=10, color=GREY, ls=1.35)
footer(s, "Google × BSTC · Partnership Proposal", "10")

out = os.path.expanduser("~/Desktop/Google x BSTC - Partnership Intro (v2).pptx")
prs.save(out)
print("WROTE", out)
