#!/usr/bin/env python3
"""Generate How I AI Edition 7 PPTX (27 May 2026).

Style mirrors Edition 1/3: charcoal background, red accent, white display text,
muted grey body. No em dashes or en dashes. Australian English.

Full deck, 16 slides:
  01 Title
  02 My Background
  03 Money Round
  04 Jargon Buster
  05 AI Intel Drop intro
  06 Signal 01  Google Gemini Spark
  07 Signal 02  Cursor Composer 2.5
  08 Signal 03  Anthropic self-hosted sandboxes + MCP tunnels
  09 Signal 04  OpenAI confidential IPO filing
  10 Signal 05  OpenAI Codex desktop agent
  11 Action of the Week
  12 By Tier
  13 Dinner & Drinks
  14 Builder Spotlights
  15 Community Wins
  16 Close / See you at Edition 8
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

CHARCOAL = RGBColor(0x11, 0x11, 0x11)
WHITE = RGBColor(0xF5, 0xF5, 0xF5)
RED = RGBColor(0xC8, 0x1E, 0x1E)
GOLD = RGBColor(0xE0, 0xB0, 0x40)
GREY = RGBColor(0x88, 0x88, 0x88)
GREY_LIGHT = RGBColor(0xAA, 0xAA, 0xAA)
GREY_DARK = RGBColor(0x33, 0x33, 0x33)
GREY_MID = RGBColor(0x44, 0x44, 0x44)
GREY_BORDER = RGBColor(0x22, 0x22, 0x22)

TOTAL = 16

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)


def add_bg(slide):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = CHARCOAL


def add_textbox(slide, left, top, width, height, text, font_size=18,
                color=WHITE, bold=False, italic=False, alignment=PP_ALIGN.LEFT,
                font_name="Arial"):
    tb = slide.shapes.add_textbox(left, top, width, height)
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.color.rgb = color
    p.font.bold = bold
    p.font.italic = italic
    p.font.name = font_name
    p.alignment = alignment
    return tb


def add_multiline(slide, left, top, width, height, lines, default_size=18,
                  default_color=WHITE):
    tb = slide.shapes.add_textbox(left, top, width, height)
    tf = tb.text_frame
    tf.word_wrap = True
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = line.get("text", "")
        p.font.size = Pt(line.get("size", default_size))
        p.font.color.rgb = line.get("color", default_color)
        p.font.bold = line.get("bold", False)
        p.font.italic = line.get("italic", False)
        p.font.name = line.get("font", "Arial")
        p.alignment = line.get("align", PP_ALIGN.LEFT)
        if line.get("spacing_before"):
            p.space_before = Pt(line["spacing_before"])
    return tb


def add_tag(slide, left, top, text):
    add_textbox(slide, left, top, Inches(8), Inches(0.4), text,
                font_size=13, color=RED, bold=True)


def add_accent_line(slide, left, top, width=Inches(0.8), color=RED, thickness=Pt(4)):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, thickness)
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    return shape


def add_card(slide, left, top, width, height, border_color=GREY_BORDER,
             fill_color=GREY_DARK):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    shape.line.color.rgb = border_color
    shape.line.width = Pt(1)
    return shape


def add_red_card(slide, left, top, width, height):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = RED
    shape.line.fill.background()
    return shape


def add_circle(slide, left, top, size, fill_color=GREY_MID, border_color=None):
    shape = slide.shapes.add_shape(MSO_SHAPE.OVAL, left, top, size, size)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    if border_color is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = border_color
        shape.line.width = Pt(2)
    return shape


def add_footer(slide, num, total=TOTAL):
    add_textbox(slide, Inches(0.5), Inches(7.1), Inches(1.5), Inches(0.3),
                "BSTC", font_size=11, color=GREY_DARK, bold=True)
    add_textbox(slide, Inches(11.5), Inches(7.1), Inches(1.5), Inches(0.3),
                f"{num:02d} / {total}", font_size=12, color=GREY,
                alignment=PP_ALIGN.RIGHT)


def add_takeaway(slide, left, top, width, text, height=Inches(1.2)):
    add_card(slide, left, top, width, height)
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, Pt(4), height)
    bar.fill.solid()
    bar.fill.fore_color.rgb = RED
    bar.line.fill.background()
    add_multiline(slide, left + Inches(0.2), top + Inches(0.12),
                  width - Inches(0.35), height - Inches(0.2), [
        {"text": "What this means for you:", "size": 13, "color": WHITE, "bold": True},
        {"text": text, "size": 12, "color": GREY_LIGHT, "spacing_before": 6},
    ])


def add_date_tag(slide, left, top, text):
    add_textbox(slide, left, top, Inches(8), Inches(0.3), text,
                font_size=11, color=GREY, bold=True)


def add_stat_cards(slide, cards, right_x=Inches(8.6), top=Inches(1.4),
                   card_w=Inches(4.3), card_h=Inches(1.5), gap=Inches(0.2)):
    """Right-rail stat cards: list of (headline, caption)."""
    for i, (headline, caption) in enumerate(cards):
        y = top + (card_h + gap) * i
        add_card(slide, right_x, y, card_w, card_h)
        add_multiline(slide, right_x + Inches(0.25), y + Inches(0.2),
                      card_w - Inches(0.45), card_h - Inches(0.3), [
            {"text": headline, "size": 26, "color": RED, "bold": True},
            {"text": caption, "size": 12, "color": GREY_LIGHT, "spacing_before": 6},
        ])


def add_tier_card(slide, x, y, width, height, label, heading, bullets, goal):
    add_card(slide, x, y, width, height, border_color=GREY_BORDER, fill_color=GREY_DARK)
    add_accent_line(slide, x, y, width=width, thickness=Pt(4))
    add_textbox(slide, x + Inches(0.3), y + Inches(0.25), width - Inches(0.6), Inches(0.3),
                label, font_size=12, color=RED, bold=True)
    add_textbox(slide, x + Inches(0.3), y + Inches(0.65), width - Inches(0.6), Inches(0.6),
                heading, font_size=20, color=WHITE, bold=True)
    items_text = "\n\n".join(f"•  {item}" for item in bullets)
    add_textbox(slide, x + Inches(0.3), y + Inches(1.5), width - Inches(0.6), height - Inches(2.3),
                items_text, font_size=12, color=GREY_LIGHT)
    add_textbox(slide, x + Inches(0.3), y + height - Inches(0.7), width - Inches(0.6), Inches(0.4),
                goal, font_size=12, color=RED, bold=True, italic=True)


def new_slide():
    s = prs.slides.add_slide(prs.slide_layouts[6])
    add_bg(s)
    return s


def signal_slide(num, slide_no, headline, blurb, date_tag, takeaway, cards,
                 title_size=44, title_w=Inches(8)):
    slide = new_slide()
    add_tag(slide, Inches(0.8), Inches(0.6), f"SIGNAL 0{num}")
    add_textbox(slide, Inches(0.8), Inches(1.1), title_w, Inches(1.5),
                headline, font_size=title_size, color=WHITE, bold=True)
    add_accent_line(slide, Inches(0.8), Inches(2.55))
    add_textbox(slide, Inches(0.8), Inches(2.85), Inches(7.5), Inches(1.6),
                blurb, font_size=15, color=GREY_LIGHT)
    add_date_tag(slide, Inches(0.8), Inches(4.55), date_tag)
    add_takeaway(slide, Inches(0.8), Inches(5.85), Inches(7.5), takeaway, height=Inches(1.2))
    add_stat_cards(slide, cards)
    add_footer(slide, slide_no)
    return slide


# ============================================================
# 01  TITLE
# ============================================================
slide = new_slide()
add_tag(slide, Inches(0.8), Inches(1.5), "BALI START-UPS & TECH COMMUNITY PRESENTS")
add_textbox(slide, Inches(0.8), Inches(2.2), Inches(10), Inches(1.5),
            "How I AI", font_size=72, color=WHITE, bold=True)
add_multiline(slide, Inches(0.8), Inches(3.8), Inches(8), Inches(1.2), [
    {"text": "Edition 7", "size": 32, "color": WHITE, "bold": True},
    {"text": "Seoul Soul Project, Canggu  ·  27 May 2026", "size": 20, "color": GREY, "spacing_before": 8},
])
add_textbox(slide, Inches(0.8), Inches(5.5), Inches(9), Inches(0.4),
            "Builders show tools. Operators share workflows. Everyone leaves sharper.",
            font_size=15, color=GREY)
add_footer(slide, 1)

# ============================================================
# 02  MY BACKGROUND
# ============================================================
slide = new_slide()
add_tag(slide, Inches(0.8), Inches(0.8), "MY BACKGROUND")
add_textbox(slide, Inches(0.8), Inches(1.8), Inches(3.5), Inches(0.6),
            "Josh Morrow", font_size=28, color=WHITE, bold=True)
add_multiline(slide, Inches(0.8), Inches(2.6), Inches(3.5), Inches(3.0), [
    {"text": "•  5+ years in B2B technology", "size": 16, "color": GREY},
    {"text": "•  Oxford/MIT AI Programmes / Legal Background", "size": 16, "color": GREY, "spacing_before": 10},
    {"text": "•  Co-Founder of Bali Start-Up & Tech (3k+ folks on Meetup/WA)", "size": 16, "color": GREY, "spacing_before": 10},
])
add_textbox(slide, Inches(5.0), Inches(1.8), Inches(3.5), Inches(0.6),
            "David & Goliath", font_size=28, color=WHITE, bold=True)
add_multiline(slide, Inches(5.0), Inches(2.6), Inches(3.5), Inches(3.0), [
    {"text": "•  AI systems firm for ambitious teams", "size": 16, "color": GREY},
    {"text": "•  Australia founded and globally minded", "size": 16, "color": GREY, "spacing_before": 10},
    {"text": "•  We build operating AI infrastructure across revenue, capacity & AI security", "size": 16, "color": GREY, "spacing_before": 10},
])
add_textbox(slide, Inches(9.2), Inches(1.8), Inches(3.5), Inches(0.6),
            "Oligo Security", font_size=28, color=WHITE, bold=True)
add_multiline(slide, Inches(9.2), Inches(2.6), Inches(3.5), Inches(3.0), [
    {"text": "•  Selected as runtime AI security vendor in AWS Security Hub", "size": 16, "color": GREY},
    {"text": "•  Working with security leaders at APAC's largest companies", "size": 16, "color": GREY, "spacing_before": 10},
])
add_footer(slide, 2)

# ============================================================
# 03  MONEY ROUND
# ============================================================
slide = new_slide()
add_tag(slide, Inches(0.8), Inches(1.2), "6:30 PM")
add_textbox(slide, Inches(0.8), Inches(2.0), Inches(10), Inches(1.0),
            "Money Round", font_size=64, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.2))
add_textbox(slide, Inches(0.8), Inches(3.5), Inches(8), Inches(0.5),
            "60-second intros", font_size=28, color=WHITE, bold=True)
add_textbox(slide, Inches(0.8), Inches(4.2), Inches(10), Inches(0.8),
            "One way AI made you money, saved you money,\nor saved you serious time. No pitches. Just results.",
            font_size=20, color=GREY)
add_red_card(slide, Inches(0.8), Inches(5.5), Inches(1.8), Inches(1.2))
add_multiline(slide, Inches(0.9), Inches(5.6), Inches(1.6), Inches(1.0), [
    {"text": "60s", "size": 40, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "PER PERSON", "size": 11, "color": WHITE, "align": PP_ALIGN.CENTER},
])
add_card(slide, Inches(3.0), Inches(5.5), Inches(3.5), Inches(1.2))
add_multiline(slide, Inches(3.1), Inches(5.6), Inches(3.3), Inches(1.0), [
    {"text": "3 Parts", "size": 32, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "Tool / Workflow / Result", "size": 13, "color": GREY, "align": PP_ALIGN.CENTER},
])
add_footer(slide, 3)

# ============================================================
# 04  JARGON BUSTER
# ============================================================
slide = new_slide()
add_tag(slide, Inches(0.8), Inches(0.6), "BEFORE WE START")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
            "Jargon Buster", font_size=48, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.15))
add_textbox(slide, Inches(0.8), Inches(2.45), Inches(11), Inches(0.6),
            "Five terms you will hear tonight. Lock these in first and the signals land harder.",
            font_size=16, color=GREY_LIGHT)
jargon = [
    ("Agent",
     "AI that takes actions on your behalf, not just answers questions."),
    ("Computer Use",
     "An agent driving real apps on a screen, clicking and typing, not just calling an API."),
    ("MCP  (Model Context Protocol)",
     "The USB-C of AI tools. Lets agents plug into your systems in a standard way."),
    ("MoE  (Mixture of Experts)",
     "A model that routes each request to a slice of its parameters, cutting cost per call."),
    ("S-1  /  Confidential IPO",
     "The filing a company makes to sell shares publicly. Confidential keeps it private until close to listing."),
]
row_top = Inches(3.3)
row_h = Inches(0.62)
for i, (term, definition) in enumerate(jargon):
    y = row_top + row_h * i
    add_textbox(slide, Inches(0.8), y + Inches(0.08), Inches(3.8), row_h,
                term, font_size=16, color=RED, bold=True)
    add_textbox(slide, Inches(4.8), y + Inches(0.08), Inches(7.9), row_h,
                definition, font_size=14, color=WHITE)
    add_accent_line(slide, Inches(0.8), y + row_h - Inches(0.02),
                    width=Inches(11.9), color=GOLD, thickness=Pt(1))
add_textbox(slide, Inches(0.8), Inches(6.85), Inches(11.9), Inches(0.3),
            "If any of these feel fuzzy, find me at dinner. No dumb questions in this room.",
            font_size=13, color=GREY, italic=True)
add_footer(slide, 4)

# ============================================================
# 05  AI INTEL DROP intro
# ============================================================
slide = new_slide()
add_tag(slide, Inches(0.8), Inches(1.2), "7:00 PM — AI INTEL DROP")
add_textbox(slide, Inches(0.8), Inches(2.2), Inches(10), Inches(1.0),
            "This Week in AI", font_size=54, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.4))
add_textbox(slide, Inches(0.8), Inches(3.8), Inches(9), Inches(0.8),
            "Five signals from the last seven days. What happened, and what it means for you.\nThe theme this week: agents stop needing you in the room.",
            font_size=20, color=GREY)
for i, (label, x) in enumerate([("50+ Sources", 1.5), ("Signal Scoring", 5.0), ("Top 5 Tonight", 8.5)]):
    add_card(slide, Inches(x), Inches(5.4), Inches(2.5), Inches(0.7))
    add_textbox(slide, Inches(x), Inches(5.5), Inches(2.5), Inches(0.5),
                label, font_size=14, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    if i < 2:
        add_textbox(slide, Inches(x + 2.7), Inches(5.45), Inches(0.5), Inches(0.5),
                    "→", font_size=28, color=RED, alignment=PP_ALIGN.CENTER)
add_footer(slide, 5)

# ============================================================
# 06  SIGNAL 01  Gemini Spark
# ============================================================
signal_slide(
    1, 6,
    "Google Launches\nGemini Spark",
    "Google's first 24/7 personal AI agent. It runs on Google Cloud virtual machines and keeps "
    "working when your device is off. Built on Gemini 3.5 Flash and the Antigravity harness, it is "
    "structured around Tasks, Skills, and Schedules, with native Workspace and MCP support.",
    "ANNOUNCED GOOGLE I/O 20 MAY 2026  ·  BETA FROM 25 MAY",
    "Always-on agents just became a consumer subscription, not an enterprise pilot. The bottleneck is "
    "no longer cost or access, it is workflow design. The win is specifying the recurring, low-judgement "
    "work worth running overnight.",
    [
        ("24 / 7", "Keeps running when your device is off"),
        ("MCP", "Canva, OpenTable, Instacart at launch"),
        ("Tasks / Skills / Schedules", "Not just chat, a recurring operations layer"),
    ],
)

# ============================================================
# 07  SIGNAL 02  Cursor Composer 2.5
# ============================================================
signal_slide(
    2, 7,
    "Cursor Composer 2.5",
    "Cursor's new coding model is built on Moonshot's open Kimi K2.5, a roughly 1 trillion parameter "
    "Mixture-of-Experts base. It matches Claude Opus 4.7 and GPT-5.5 on coding benchmarks at roughly "
    "one-tenth of the cost per task.",
    "18 MAY 2026",
    "Frontier-grade coding is now a tenth of what it cost months ago. If your build budget assumed "
    "Opus-tier pricing, re-cost it. Open-weight bases plus targeted post-training are closing the gap fast.",
    [
        ("1 / 10", "Cost per task vs Opus 4.7"),
        ("79.8%", "SWE-Bench Multilingual"),
        ("$0.50", "Per million input tokens"),
    ],
    title_size=48,
)

# ============================================================
# 08  SIGNAL 03  Anthropic sandboxes + MCP tunnels
# ============================================================
signal_slide(
    3, 8,
    "Claude Agents Move\nInside Your Perimeter",
    "At Code with Claude London, Anthropic shipped self-hosted sandboxes and MCP tunnels for Claude "
    "Managed Agents. Tool execution and private MCP servers stay inside your own network. The "
    "orchestration loop stays with Anthropic. No public endpoints, no inbound firewall rules.",
    "19 MAY 2026  ·  CODE WITH CLAUDE LONDON",
    "The 'we cannot use agents because of data exposure' objection just weakened. Agents can reach "
    "internal databases and APIs through one outbound connection. Map which internal workflows are "
    "now safe to automate.",
    [
        ("Self-hosted", "Sandboxes, public beta"),
        ("MCP Tunnels", "Reach private servers, research preview"),
        ("0", "Inbound firewall rules required"),
    ],
    title_size=40,
)

# ============================================================
# 09  SIGNAL 04  OpenAI IPO
# ============================================================
signal_slide(
    4, 9,
    "OpenAI Files\nConfidentially for IPO",
    "OpenAI filed a confidential S-1 with the SEC, targeting a public listing as early as September "
    "2026 at a valuation between $852 billion and over $1 trillion. It would be the largest IPO in "
    "history. Annualised revenue is around $25 billion.",
    "22 MAY 2026",
    "The market is pricing AI as durable infrastructure, not a bubble to wait out. Capital and "
    "competition will intensify, not slow. Build on the assumption that these tools keep getting "
    "better and cheaper.",
    [
        ("$1T+", "Target listing valuation"),
        ("$25B", "Annualised revenue"),
        ("Sept 2026", "Earliest listing window"),
    ],
    title_size=40,
)

# ============================================================
# 10  SIGNAL 05  Codex desktop agent
# ============================================================
signal_slide(
    5, 10,
    "Codex Becomes a\nDesktop Agent",
    "OpenAI Codex can now control desktop apps, watch your screen, and keep running after your Mac "
    "locks, driven remotely from Codex Mobile. Start a multi-hour refactor at your desk, walk away, "
    "and approve commits or answer the agent's questions from a restaurant.",
    "24 MAY 2026",
    "The coding agent no longer needs you at the keyboard. Long-running build and refactor jobs run "
    "while you are at dinner, with your phone as the approval surface. The constraint shifts from "
    "hours at the desk to how well you can specify and supervise overnight work.",
    [
        ("Locked-use", "Works after your Mac locks"),
        ("Phone", "Is now the control surface"),
        ("Multi-hour", "Tasks run unattended"),
    ],
    title_size=44,
)

# ============================================================
# 11  ACTION OF THE WEEK
# ============================================================
slide = new_slide()
add_tag(slide, Inches(0.8), Inches(0.6), "ACTION OF THE WEEK")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(10), Inches(1.0),
            "Hand One Recurring Task to an Agent", font_size=38, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.15))
add_textbox(slide, Inches(0.8), Inches(2.45), Inches(9.3), Inches(1.0),
            "Every signal tonight points the same way: agents run while you are away. The highest-leverage "
            "move before next Wednesday is to ship one. Ten minutes to set up.",
            font_size=15, color=GREY_LIGHT)
add_red_card(slide, Inches(10.5), Inches(1.2), Inches(2.4), Inches(1.8))
add_multiline(slide, Inches(10.5), Inches(1.55), Inches(2.4), Inches(1.4), [
    {"text": "10", "size": 56, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "MINUTES", "size": 16, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER, "spacing_before": 2},
    {"text": "To set up the first run", "size": 10, "color": WHITE, "align": PP_ALIGN.CENTER, "spacing_before": 6},
])
steps = [
    ("01", "Pick", "One recurring, low-judgement job: inbox triage, a research digest, PR review"),
    ("02", "Spec", "Write the inputs, the steps, and what 'done' looks like in plain language"),
    ("03", "Run", "Execute once with you watching. Correct it. Save it as a Skill or prompt"),
    ("04", "Schedule", "Hand it off: Gemini Spark, Codex cloud, or a Claude routine"),
]
flow_top = Inches(3.7)
flow_h = Inches(1.7)
step_w = Inches(2.95)
step_gap = Inches(0.1)
for i, (num, title, body) in enumerate(steps):
    x = Inches(0.6) + (step_w + step_gap) * i
    add_card(slide, x, flow_top, step_w, flow_h)
    add_circle(slide, x + Inches(0.3), flow_top + Inches(0.2), Inches(0.6), fill_color=RED)
    add_textbox(slide, x + Inches(0.3), flow_top + Inches(0.28), Inches(0.6), Inches(0.5),
                num, font_size=15, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(1.0), flow_top + Inches(0.28), step_w - Inches(1.1), Inches(0.45),
                title, font_size=18, color=WHITE, bold=True)
    add_textbox(slide, x + Inches(0.3), flow_top + Inches(0.95), step_w - Inches(0.5), Inches(0.7),
                body, font_size=12, color=GREY_LIGHT)
    if i < 3:
        ax = x + step_w + Inches(0.005)
        add_textbox(slide, ax - Inches(0.05), flow_top + Inches(0.6), step_gap + Inches(0.1), Inches(0.5),
                    "›", font_size=22, color=RED, bold=True, alignment=PP_ALIGN.CENTER)
add_takeaway(slide, Inches(0.8), Inches(5.75), Inches(11.7),
             "The teams that win the next year are not the ones with the best model access. They are the "
             "ones who can specify recurring work clearly enough to hand it off. Start with one task this "
             "week. The muscle compounds.",
             height=Inches(1.25))
add_footer(slide, 11)

# ============================================================
# 12  BY TIER
# ============================================================
slide = new_slide()
add_tag(slide, Inches(0.8), Inches(0.6), "BY TIER")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(12), Inches(0.9),
            "What To Do With This Week's News", font_size=40, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(12), Inches(0.6),
            "One action calibrated to where you are right now. Pick your column.",
            font_size=16, color=GREY_LIGHT)
tiers = [
    {
        "label": "TIER 1, EXPLORER",
        "heading": "Try a hands-off agent",
        "bullets": [
            "Open Gemini, Claude, or ChatGPT and give it one recurring task to do for you",
            "Ask it to draft your Monday inbox summary or a weekly research digest",
            "Notice what it gets right and where you had to step in",
        ],
        "goal": "Goal: feel what hands-off actually feels like",
    },
    {
        "label": "TIER 2, OPERATOR",
        "heading": "Map your recurring work",
        "bullets": [
            "List five weekly tasks that are low-judgement and repeatable",
            "Spec the easiest one as inputs, steps, and a 'done' definition",
            "Schedule it with Gemini Spark, Codex cloud, or a Claude routine",
        ],
        "goal": "Goal: move AI from a chat tool to an operations layer",
    },
    {
        "label": "TIER 3, BUILDER",
        "heading": "Ship an async agent",
        "bullets": [
            "Use Codex local-to-cloud handoff for long refactors that outlast your session",
            "For internal data, run a Claude self-hosted sandbox and an MCP tunnel, not a public endpoint",
            "Log every agent action with the identity that triggered it",
        ],
        "goal": "Goal: agents that run while you sleep, safely",
    },
]
tier_w = Inches(4.0)
tier_h = Inches(4.1)
for i, t in enumerate(tiers):
    x = Inches(0.5) + (tier_w + Inches(0.15)) * i
    add_tier_card(slide, x, Inches(3.3), tier_w, tier_h,
                  t["label"], t["heading"], t["bullets"], t["goal"])
add_footer(slide, 12)

# ============================================================
# 13  DINNER & DRINKS
# ============================================================
slide = new_slide()
add_tag(slide, Inches(4.5), Inches(2.0), "7:15 PM")
add_textbox(slide, Inches(1.5), Inches(2.8), Inches(10), Inches(1.0),
            "Dinner & Drinks", font_size=64, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
add_accent_line(slide, Inches(6.2), Inches(4.0))
add_textbox(slide, Inches(2), Inches(4.5), Inches(9), Inches(0.5),
            "Order up. Best conversations happen over food.",
            font_size=22, color=GREY, alignment=PP_ALIGN.CENTER)
add_textbox(slide, Inches(2), Inches(5.2), Inches(9), Inches(0.4),
            "Builder Spotlights start at 7:30 sharp.",
            font_size=17, color=GREY, alignment=PP_ALIGN.CENTER)
add_footer(slide, 13)

# ============================================================
# 14  BUILDER SPOTLIGHTS
# ============================================================
slide = new_slide()
add_tag(slide, Inches(4.5), Inches(1.5), "7:30 PM")
add_textbox(slide, Inches(1.5), Inches(2.2), Inches(10), Inches(1.0),
            "Builder Spotlights", font_size=64, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
add_accent_line(slide, Inches(6.2), Inches(3.5))
for i, x in enumerate([Inches(3.0), Inches(7.5)]):
    add_card(slide, x, Inches(4.2), Inches(3.2), Inches(2.2))
    add_multiline(slide, x, Inches(4.4), Inches(3.2), Inches(1.8), [
        {"text": f"0{i+1}", "size": 44, "color": RED, "bold": True, "align": PP_ALIGN.CENTER},
        {"text": "10 min + 5 min Q&A", "size": 16, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER, "spacing_before": 8},
        {"text": "[Builder name + what they built]", "size": 13, "color": GREY, "align": PP_ALIGN.CENTER, "spacing_before": 6},
    ])
add_footer(slide, 14)

# ============================================================
# 15  COMMUNITY WINS
# ============================================================
slide = new_slide()
add_tag(slide, Inches(0.8), Inches(0.6), "COMMUNITY WINS")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(12), Inches(0.9),
            "Wins From The Room", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(12), Inches(0.8),
            "Members who shipped something since last edition. This is what the community looks like "
            "when it builds in public.",
            font_size=15, color=GREY_LIGHT)
wins = [
    {"name": "[Member 1 name]", "role": "[Founder or operator title]",
     "shipped": "[What they shipped, one line, with the result or time saved]", "initial": "M1"},
    {"name": "[Member 2 name]", "role": "[Founder or operator title]",
     "shipped": "[What they shipped, one line, with the result or time saved]", "initial": "M2"},
    {"name": "[Member 3 name]", "role": "[Founder or operator title]",
     "shipped": "[What they shipped, one line, with the result or time saved]", "initial": "M3"},
]
card_w = Inches(4.0)
card_h = Inches(3.4)
for i, w in enumerate(wins):
    x = Inches(0.5) + (card_w + Inches(0.15)) * i
    add_card(slide, x, Inches(3.5), card_w, card_h)
    avatar_size = Inches(1.1)
    avatar_x = x + (card_w - avatar_size) / 2
    add_circle(slide, avatar_x, Inches(3.5) + Inches(0.3), avatar_size,
               fill_color=GREY_MID, border_color=RED)
    add_textbox(slide, avatar_x, Inches(3.5) + Inches(0.58), avatar_size, Inches(0.6),
                w["initial"], font_size=22, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), Inches(3.5) + Inches(1.55), card_w - Inches(0.6), Inches(0.4),
                w["name"], font_size=18, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), Inches(3.5) + Inches(2.0), card_w - Inches(0.6), Inches(0.3),
                w["role"], font_size=12, color=GREY, italic=True, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), Inches(3.5) + Inches(2.45), card_w - Inches(0.6), Inches(0.9),
                w["shipped"], font_size=12, color=GREY_LIGHT, alignment=PP_ALIGN.CENTER)
add_textbox(slide, Inches(0.8), Inches(7.1), Inches(11.9), Inches(0.35),
            "Want to be on this slide next edition? Tell me what you shipped. "
            "No pitch needed, just a screenshot and one line.",
            font_size=13, color=GOLD, italic=True, alignment=PP_ALIGN.CENTER)
add_footer(slide, 15)

# ============================================================
# 16  CLOSE / NEXT EDITION
# ============================================================
slide = new_slide()
add_tag(slide, Inches(3.5), Inches(0.8), "THANK YOU")
add_textbox(slide, Inches(1.5), Inches(1.5), Inches(10), Inches(1.2),
            "See You at\nEdition 8", font_size=56, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
add_accent_line(slide, Inches(6.2), Inches(3.0))
platforms = ["YOUTUBE", "INSTAGRAM", "TIKTOK"]
for i, platform in enumerate(platforms):
    x = Inches(2.5) + Inches(i * 3.0)
    add_card(slide, x, Inches(3.5), Inches(2.5), Inches(1.2))
    add_multiline(slide, x, Inches(3.6), Inches(2.5), Inches(1.0), [
        {"text": platform, "size": 12, "color": GREY, "bold": True, "align": PP_ALIGN.CENTER},
        {"text": "@joshbuildswithai", "size": 17, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER, "spacing_before": 8},
    ])
add_card(slide, Inches(2.5), Inches(5.2), Inches(8.0), Inches(1.8), border_color=RED)
add_multiline(slide, Inches(2.5), Inches(5.4), Inches(8.0), Inches(1.4), [
    {"text": "NEXT WEDNESDAY · EDITION 8 · 3 JUNE", "size": 12, "color": RED, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "Same room. New signals. Two new builders.", "size": 26, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER, "spacing_before": 8},
    {"text": "Topic announced on MeetUp. RSVP to hold your seat.", "size": 15, "color": GREY, "align": PP_ALIGN.CENTER, "spacing_before": 6},
])
add_footer(slide, 16)

# ============================================================
# SAVE
# ============================================================
output_path = "/Users/joshmorrowdavidgoliath/bstc-website/public/how-i-ai-edition-7.pptx"
prs.save(output_path)
print(f"Saved to {output_path}")
