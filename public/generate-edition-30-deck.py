#!/usr/bin/env python3
"""Generate How I AI Edition 30 PPTX.

Style mirrors Edition 3: charcoal background, red accent, white display text,
muted grey body. No em dashes or en dashes. Australian English.

Generated: 4 November 2026

Slide order (13 slides):
  01/13  Title slide
  02/13  Intel Drop intro
  03/13  Jargon Buster
  04/13  Signal 01: Anthropic Files for IPO
  05/13  Signal 02: OpenAI Ships GPT-6.1 Terra
  06/13  Signal 03: OpenAI Cuts Raise by $10B, IPO to 2027
  07/13  Signal 04: Google Launches Gemini 4 Carbon
  08/13  Signal 05: One Hacker, $5,000, 100+ Breaches
  09/13  Action of the Week
  10/13  By Tier
  11/13  Builder Spotlights (placeholder)
  12/13  Community Wins (placeholder)
  13/13  Close slide
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
    add_textbox(slide, left, top, Inches(10), Inches(0.4), text,
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


def add_footer(slide, num, total=13):
    add_textbox(slide, Inches(0.5), Inches(7.1), Inches(1.5), Inches(0.3),
                "BSTC", font_size=11, color=GREY_DARK, bold=True)
    add_textbox(slide, Inches(11.5), Inches(7.1), Inches(1.5), Inches(0.3),
                f"{num:02d} / {total}", font_size=12, color=GREY,
                alignment=PP_ALIGN.RIGHT)


def add_takeaway(slide, left, top, width, text, height=Inches(1.2)):
    """'What this means for you' card with red left bar."""
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
    add_textbox(slide, left, top, Inches(10), Inches(0.3), text,
                font_size=11, color=GREY, bold=True)


def add_tier_card(slide, x, y, width, height, label, heading, bullets, goal):
    """Card with red top border, red label, white heading, grey bullets, red goal."""
    add_card(slide, x, y, width, height,
             border_color=GREY_BORDER, fill_color=GREY_DARK)
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


def add_stat_cards(slide, stats, right_x=Inches(8.6), card_w=Inches(4.3), card_h=Inches(1.5)):
    """Add three right-rail stat cards."""
    for i, (headline, caption) in enumerate(stats):
        y = Inches(1.3) + (card_h + Inches(0.2)) * i
        add_card(slide, right_x, y, card_w, card_h)
        add_multiline(slide, right_x + Inches(0.2), y + Inches(0.2),
                      card_w - Inches(0.4), card_h - Inches(0.3), [
            {"text": headline, "size": 26, "color": RED, "bold": True, "align": PP_ALIGN.LEFT},
            {"text": caption, "size": 12, "color": GREY_LIGHT, "spacing_before": 6},
        ])


# ============================================================
# SLIDE 01: Title
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)

add_textbox(slide, Inches(0.8), Inches(1.5), Inches(12), Inches(2.0),
            "HOW I AI", font_size=96, color=WHITE, bold=True)

add_accent_line(slide, Inches(0.8), Inches(3.6), width=Inches(11.7), color=RED, thickness=Pt(5))

add_textbox(slide, Inches(0.8), Inches(4.0), Inches(12), Inches(0.6),
            "EDITION 30", font_size=28, color=RED, bold=True)
add_textbox(slide, Inches(0.8), Inches(4.7), Inches(12), Inches(0.5),
            "Seoul Soul Project, Canggu  ·  4 November 2026",
            font_size=20, color=GREY_LIGHT)

add_textbox(slide, Inches(10.0), Inches(6.5), Inches(3.0), Inches(0.5),
            "Bali Startups + Tech Community",
            font_size=13, color=GREY, alignment=PP_ALIGN.RIGHT)

add_footer(slide, 1)


# ============================================================
# SLIDE 02: Intel Drop Intro
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "EDITION 30  ·  4 NOVEMBER 2026")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
            "Intel Drop", font_size=56, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(11.5), Inches(0.6),
            "Valuations get real, models get faster, and AI agents show up in threat models.",
            font_size=18, color=GREY_LIGHT)

signals_preview = [
    ("01", "Anthropic Files for IPO: $16.3B Revenue in Six Months", "26 OCT"),
    ("02", "OpenAI Ships GPT-6.1 Terra: 3x Faster, Half the Price", "26 OCT"),
    ("03", "OpenAI Cuts Raise by $10B, IPO Slips to 2027", "31 OCT"),
    ("04", "Google Launches Gemini 4 Carbon for Cyber Defenders", "28 OCT"),
    ("05", "One Hacker, $5,000, 100+ Companies Breached", "19 OCT"),
]

for i, (num, title, date) in enumerate(signals_preview):
    y = Inches(3.3) + Inches(0.65) * i
    add_textbox(slide, Inches(0.8), y, Inches(0.65), Inches(0.5),
                num, font_size=14, color=RED, bold=True)
    add_textbox(slide, Inches(1.6), y, Inches(9.8), Inches(0.5),
                title, font_size=14, color=WHITE)
    add_textbox(slide, Inches(11.5), y, Inches(1.5), Inches(0.5),
                date, font_size=11, color=GREY, alignment=PP_ALIGN.RIGHT)
    add_accent_line(slide, Inches(0.8), y + Inches(0.52),
                    width=Inches(11.9), color=GREY_MID, thickness=Pt(1))

add_footer(slide, 2)


# ============================================================
# SLIDE 03: Jargon Buster
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "BEFORE WE START")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
            "Jargon Buster", font_size=48, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.15))
add_textbox(slide, Inches(0.8), Inches(2.45), Inches(11), Inches(0.6),
            "Five terms you will hear tonight. Lock these in first and the signals land harder.",
            font_size=16, color=GREY_LIGHT)

jargon = [
    ("S-1 Prospectus",
     "The document a company files before going public. It discloses revenues, losses, and risks. How you tell what a company actually earns."),
    ("Inference cost",
     "What you pay per request to run a model, usually per million tokens. The number to watch when deciding if an AI feature is economically viable at scale."),
    ("Cairn",
     "An open-source AI agent framework. Give it a goal, it spins up agents, assigns sub-tasks, and runs until done. Used for good and bad this week."),
    ("Frontier model",
     "The most capable model a lab currently ships publicly. What is frontier today is mid-tier in 12 months. Carbon and Terra are both frontier models right now."),
    ("Staged rollout",
     "Releasing to a limited group first, then widening access. Google gave Gemini 4 Carbon to cybersecurity defenders before the general public."),
]

row_top = Inches(3.3)
row_h = Inches(0.62)
term_left = Inches(0.8)
term_w = Inches(3.8)
def_left = Inches(4.8)
def_w = Inches(7.9)

for i, (term, definition) in enumerate(jargon):
    y = row_top + row_h * i
    add_textbox(slide, term_left, y + Inches(0.08), term_w, row_h,
                term, font_size=16, color=RED, bold=True)
    add_textbox(slide, def_left, y + Inches(0.08), def_w, row_h,
                definition, font_size=14, color=WHITE)
    add_accent_line(slide, term_left, y + row_h - Inches(0.02),
                    width=Inches(11.9), color=GOLD, thickness=Pt(1))

add_textbox(slide, Inches(0.8), Inches(6.85), Inches(11.9), Inches(0.3),
            "If any of these feel fuzzy, find me at dinner. No dumb questions in this room.",
            font_size=13, color=GREY, italic=True)

add_footer(slide, 3)


# ============================================================
# SIGNAL 01: Anthropic Files for IPO  (04/13)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 01")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(7.5), Inches(0.9),
            "Anthropic Files for IPO", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(7.5), Inches(1.6),
            "Anthropic filed its S-1 with the SEC on 26 October, targeting a Nasdaq listing "
            "under the ticker ANT. The filing reports $16.29 billion in first-half 2026 revenue, "
            "up from roughly $1.2 billion in H1 2025. The $80.7 billion net loss is primarily "
            "an accounting charge on equity grants, not cash spent.",
            font_size=15, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(4.2), "26 OCTOBER 2026  ·  SEC EDGAR S-1 FILING")

add_takeaway(slide, Inches(0.8), Inches(4.75), Inches(7.5),
             "If you price, evaluate, or build on top of Claude, the S-1 is the first honest "
             "window into what Anthropic actually earns. API prices are likely to shift "
             "post-IPO as shareholders push for margin. Build in pricing flexibility now, "
             "not after the first bill that surprises you.",
             height=Inches(1.5))

add_stat_cards(slide, [
    ("$16.3B", "H1 2026 revenue (vs $1.2B in H1 2025)"),
    ("13x", "Year-over-year revenue growth"),
    ("$1.5T+", "Reported target IPO valuation range"),
])

add_footer(slide, 4)


# ============================================================
# SIGNAL 02: OpenAI Ships GPT-6.1 Terra  (05/13)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 02")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(7.5), Inches(1.8),
            "OpenAI Ships\nGPT-6.1 Terra", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.1))
add_textbox(slide, Inches(0.8), Inches(3.4), Inches(7.5), Inches(1.3),
            "OpenAI released GPT-6.1 Terra on 26 October at $1 per million input tokens "
            "and $5 per million output, half the cost of GPT-6.1 Sol. The model focuses "
            "on computer-use and agentic tasks, completing them more than three times "
            "faster than GPT-6 Astra. For the hardest coding and research work, "
            "OpenAI still recommends Sol or Astra.",
            font_size=15, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(4.85), "26 OCTOBER 2026  ·  OPENAI")

add_takeaway(slide, Inches(0.8), Inches(5.4), Inches(7.5),
             "If you are running agents for browser or desktop tasks, Terra's speed-to-cost "
             "ratio is worth re-benchmarking. The race to the bottom on inference pricing "
             "is good for builders: treat published prices as maximums, not floors.",
             height=Inches(1.3))

add_stat_cards(slide, [
    ("3x+", "Faster at computer-use tasks vs GPT-6 Astra"),
    ("$1 / $5", "Per million tokens (Sol is $2 / $10)"),
    ("91 tok/s", "Measured output throughput"),
])

add_footer(slide, 5)


# ============================================================
# SIGNAL 03: OpenAI Cuts Raise  (06/13)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 03")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(7.5), Inches(1.8),
            "OpenAI Cuts Raise\nby $10B, IPO to 2027", font_size=40, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.1))
add_textbox(slide, Inches(0.8), Inches(3.4), Inches(7.5), Inches(1.4),
            "OpenAI reduced its current fundraising target from $30 billion to roughly $20 "
            "billion, and trimmed its target valuation from $1.4 trillion to $1.25 trillion, "
            "as AI-related public market stocks sold off in October. The company's IPO, once "
            "targeted for 2026, is now expected no earlier than mid-2027.",
            font_size=15, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(4.95), "31 OCTOBER 2026  ·  FINANCIAL TIMES")

add_takeaway(slide, Inches(0.8), Inches(5.5), Inches(7.5),
             "Back-to-back with Signal 01, the contrast is sharp: Anthropic posts 13x revenue "
             "growth and files to go public while OpenAI trims its raise. For builders on "
             "either platform, the message is the same: stress-test your unit economics for "
             "a world where API pricing reflects actual costs, not investor patience.",
             height=Inches(1.4))

add_stat_cards(slide, [
    ("$20B", "New raise target (down from $30B)"),
    ("$1.25T", "Target valuation (down from $1.4T)"),
    ("2027", "Earliest expected IPO date"),
])

add_footer(slide, 6)


# ============================================================
# SIGNAL 04: Google Launches Gemini 4 Carbon  (07/13)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 04")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(7.5), Inches(1.8),
            "Google Launches\nGemini 4 Carbon", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.1))
add_textbox(slide, Inches(0.8), Inches(3.4), Inches(7.5), Inches(1.4),
            "Google announced Gemini 4 Carbon on 28 October, initially available only to "
            "select cybersecurity professionals through its Fairwind Program. The model "
            "claims 88.2% on SEC-bench Pro for vulnerability detection and more than "
            "double the secure-code generation success rate of its predecessor Argon. "
            "No confirmed general availability date.",
            font_size=15, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(4.95), "28 OCTOBER 2026  ·  GOOGLE DEEPMIND")

add_takeaway(slide, Inches(0.8), Inches(5.5), Inches(7.5),
             "The leading labs are now competing specifically on security capability, not just "
             "benchmark performance. If you use AI for code review, penetration testing, or "
             "secure development, the tooling is improving fast. The staged rollout to "
             "defenders first is worth watching as a model for responsible deployment.",
             height=Inches(1.4))

add_stat_cards(slide, [
    ("88.2%", "Vulnerability detection on SEC-bench Pro"),
    ("2x", "Secure code generation uplift over Argon"),
    ("$2 / $10", "Introductory API pricing per million tokens"),
])

add_footer(slide, 7)


# ============================================================
# SIGNAL 05: $5,000 AI Agent Hack  (08/13)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 05")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(7.5), Inches(1.8),
            "One Hacker, $5,000,\n100+ Breaches", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.1))
add_textbox(slide, Inches(0.8), Inches(3.4), Inches(7.5), Inches(1.4),
            "A hacker used the Cairn AI agent framework to breach more than 100 company "
            "websites, spending approximately $5,000 in API costs across the campaign. "
            "Agents received brief instructions and ran autonomously for an average of "
            "23 hours per successful breach. Reuters independently verified the victims "
            "from exposed Cairn control panels.",
            font_size=15, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(4.95), "19 OCTOBER 2026  ·  REUTERS / NORFORGE")

add_takeaway(slide, Inches(0.8), Inches(5.5), Inches(7.5),
             "If an attacker can breach 100 companies for $50 per target, your legacy "
             "security perimeter is priced into obsolescence. The same agent autonomy that "
             "makes your internal workflows faster makes automated attacks cheaper and more "
             "scalable. Add AI agents to your threat model this week.",
             height=Inches(1.4))

add_stat_cards(slide, [
    ("100+", "Company websites breached"),
    ("$5,000", "Total estimated API cost (~$50 per breach)"),
    ("23 hrs", "Average time per successful breach"),
])

add_footer(slide, 8)


# ============================================================
# SLIDE 09: Action of the Week
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "ACTION OF THE WEEK")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(10), Inches(1.0),
            "Map Your AI Agent Attack Surface", font_size=38, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(9.5), Inches(1.0),
            "Tied to Signal 05. The Cairn hack made clear that AI agents are now a "
            "standard part of attacker toolkits. Thirty minutes to know your exposure "
            "before someone else maps it for you.",
            font_size=15, color=GREY_LIGHT)

badge_x = Inches(10.5)
badge_y = Inches(1.2)
badge_w = Inches(2.4)
badge_h = Inches(1.8)
add_red_card(slide, badge_x, badge_y, badge_w, badge_h)
add_multiline(slide, badge_x, badge_y + Inches(0.35), badge_w, badge_h - Inches(0.4), [
    {"text": "30", "size": 56, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "MINUTES", "size": 16, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER, "spacing_before": 2},
    {"text": "Start to finish", "size": 10, "color": WHITE,
     "align": PP_ALIGN.CENTER, "spacing_before": 6},
])

steps = [
    ("01", "List", "Every AI tool and agent running in your stack"),
    ("02", "Map", "What systems each one can reach: email, files, databases, APIs"),
    ("03", "Assess", "Blast radius if one was compromised or acted against intent"),
    ("04", "Update", "Add AI agents to your incident response plan"),
]
flow_top = Inches(3.7)
flow_h = Inches(1.7)
step_w = Inches(2.95)
step_gap = Inches(0.1)
flow_start_x = Inches(0.6)
for i, (num, title, body) in enumerate(steps):
    x = flow_start_x + (step_w + step_gap) * i
    add_card(slide, x, flow_top, step_w, flow_h)
    circle_size = Inches(0.6)
    add_circle(slide, x + Inches(0.3), flow_top + Inches(0.2), circle_size, fill_color=RED)
    add_textbox(slide, x + Inches(0.3), flow_top + Inches(0.28), circle_size, Inches(0.5),
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
             "The Cairn hacker spent $50 per target and averaged 23 hours per breach. If you "
             "do not know what your AI tools can reach, you cannot prioritise what to protect. "
             "This map is not for a future security review. Do it now.",
             height=Inches(1.25))

add_footer(slide, 9)


# ============================================================
# SLIDE 10: By Tier
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
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
        "heading": "Start with the hack",
        "bullets": [
            "Read the Cairn story from Reuters (Signal 05)",
            "Ask an AI: 'If I connected you to my Google account, what could you do?'",
            "List every app with 'continue with Google' access on your phone right now",
        ],
        "goal": "Goal: understand the attack surface before you build on it",
    },
    {
        "label": "TIER 2, OPERATOR",
        "heading": "Audit your AI stack",
        "bullets": [
            "List every AI tool connected to your business systems",
            "For each, check what permissions it holds and what it can reach",
            "Read the Anthropic S-1 intro section if you are an API customer",
        ],
        "goal": "Goal: know your exposure and your vendor's economics",
    },
    {
        "label": "TIER 3, BUILDER",
        "heading": "Harden your agents",
        "bullets": [
            "Run Signal 05 through your threat model: same framework, same method, your product",
            "Enforce minimum-privilege credentials and short-lived tokens for every agent",
            "Log every agent action with the identity that triggered it",
        ],
        "goal": "Goal: do not be in next month's Reuters story",
    },
]
tier_w = Inches(4.0)
tier_h = Inches(4.1)
tier_top = Inches(3.3)
tier_gap = Inches(0.15)
tier_start = Inches(0.5)
for i, t in enumerate(tiers):
    x = tier_start + (tier_w + tier_gap) * i
    add_tier_card(slide, x, tier_top, tier_w, tier_h,
                  t["label"], t["heading"], t["bullets"], t["goal"])

add_footer(slide, 10)


# ============================================================
# SLIDE 11: Builder Spotlights (placeholder)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "BUILDER SPOTLIGHTS")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(12), Inches(0.9),
            "What Builders Are Shipping", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(12), Inches(0.8),
            "BSTC members who built or shipped something with AI this week. Fill before presenting.",
            font_size=15, color=GREY_LIGHT)

spotlights = [
    {
        "name": "[Builder 1 name]",
        "role": "[Founder / Operator / Engineer, Company]",
        "shipped": "[One sentence: what they built, what it replaced, and the result.]",
        "initial": "B1",
    },
    {
        "name": "[Builder 2 name]",
        "role": "[Founder or operator title]",
        "shipped": "[One sentence: what they built, what it replaced, and the result.]",
        "initial": "B2",
    },
    {
        "name": "[Builder 3 name]",
        "role": "[Founder or operator title]",
        "shipped": "[One sentence: what they built, what it replaced, and the result.]",
        "initial": "B3",
    },
]
card_w = Inches(4.0)
card_h = Inches(3.6)
card_top = Inches(3.4)
card_gap = Inches(0.15)
card_start = Inches(0.5)
for i, s in enumerate(spotlights):
    x = card_start + (card_w + card_gap) * i
    add_card(slide, x, card_top, card_w, card_h)
    avatar_size = Inches(1.1)
    avatar_x = x + (card_w - avatar_size) / 2
    add_circle(slide, avatar_x, card_top + Inches(0.3), avatar_size,
               fill_color=GREY_MID, border_color=RED)
    add_textbox(slide, avatar_x, card_top + Inches(0.58), avatar_size, Inches(0.6),
                s["initial"], font_size=22, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), card_top + Inches(1.6), card_w - Inches(0.6), Inches(0.4),
                s["name"], font_size=17, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), card_top + Inches(2.05), card_w - Inches(0.6), Inches(0.3),
                s["role"], font_size=11, color=GREY, italic=True, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), card_top + Inches(2.45), card_w - Inches(0.6), Inches(0.9),
                s["shipped"], font_size=12, color=GREY_LIGHT, alignment=PP_ALIGN.CENTER)

add_footer(slide, 11)


# ============================================================
# SLIDE 12: Community Wins (placeholder)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "COMMUNITY WINS")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(12), Inches(0.9),
            "Wins From The Room", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(12), Inches(0.8),
            "Three members shipped something since last edition. Fill before presenting. "
            "No pitch needed, just a screenshot and one line.",
            font_size=15, color=GREY_LIGHT)

wins = [
    {
        "name": "[Member 1 name]",
        "role": "[Founder, Company  /  Operator, Industry]",
        "shipped": "[What they built, automated, or shipped. One or two sentences. Keep it concrete.]",
        "initial": "M1",
    },
    {
        "name": "[Member 2 name]",
        "role": "[Founder or operator title]",
        "shipped": "[What they built, automated, or shipped. One or two sentences. Keep it concrete.]",
        "initial": "M2",
    },
    {
        "name": "[Member 3 name]",
        "role": "[Founder or operator title]",
        "shipped": "[What they built, automated, or shipped. One or two sentences. Keep it concrete.]",
        "initial": "M3",
    },
]
card_w = Inches(4.0)
card_h = Inches(3.4)
card_top = Inches(3.5)
card_gap = Inches(0.15)
card_start = Inches(0.5)
for i, w in enumerate(wins):
    x = card_start + (card_w + card_gap) * i
    add_card(slide, x, card_top, card_w, card_h)
    avatar_size = Inches(1.1)
    avatar_x = x + (card_w - avatar_size) / 2
    add_circle(slide, avatar_x, card_top + Inches(0.3), avatar_size,
               fill_color=GREY_MID, border_color=RED)
    add_textbox(slide, avatar_x, card_top + Inches(0.58), avatar_size, Inches(0.6),
                w["initial"], font_size=22, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), card_top + Inches(1.55), card_w - Inches(0.6), Inches(0.4),
                w["name"], font_size=18, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), card_top + Inches(2.0), card_w - Inches(0.6), Inches(0.3),
                w["role"], font_size=12, color=GREY, italic=True, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), card_top + Inches(2.45), card_w - Inches(0.6), Inches(0.9),
                w["shipped"], font_size=12, color=GREY_LIGHT, alignment=PP_ALIGN.CENTER)

add_textbox(slide, Inches(0.8), Inches(7.1), Inches(11.9), Inches(0.35),
            "Want to be on this slide next edition? Tell me what you shipped. "
            "No pitch needed, just a screenshot and one line.",
            font_size=13, color=GOLD, italic=True, alignment=PP_ALIGN.CENTER)

add_footer(slide, 12)


# ============================================================
# SLIDE 13: Close
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)

add_textbox(slide, Inches(0.8), Inches(0.6), Inches(12), Inches(0.9),
            "HOW I AI  ·  BSTC", font_size=20, color=RED, bold=True)

add_accent_line(slide, Inches(0.8), Inches(2.0), width=Inches(11.7), color=RED, thickness=Pt(5))

add_textbox(slide, Inches(0.8), Inches(2.4), Inches(12), Inches(1.4),
            "See You at Edition 31", font_size=52, color=WHITE, bold=True)

add_textbox(slide, Inches(0.8), Inches(3.95), Inches(12), Inches(0.6),
            "Wednesday 11 November 2026  ·  Seoul Soul Project, Canggu  ·  6:30pm WITA",
            font_size=18, color=GREY_LIGHT)

add_textbox(slide, Inches(0.8), Inches(5.5), Inches(12), Inches(0.6),
            "Until next Wednesday, build something.",
            font_size=20, color=GREY, italic=True)

add_footer(slide, 13)


# ============================================================
# SAVE
# ============================================================
output_path = "/home/user/bstc-website/public/how-i-ai-edition-30.pptx"
prs.save(output_path)
print(f"Saved to {output_path}")
