#!/usr/bin/env python3
"""Generate How I AI Edition 27 PPTX.

Style mirrors Edition 3/7: charcoal background, red accent, white display text,
muted grey body. No em dashes or en dashes. Australian English.

Event: Wednesday 14 October 2026 at Seoul Soul Project, Canggu.

Slide order (16-slide full deck):
  01 / 16  Title
  02 / 16  About BSTC
  03 / 16  Agenda
  04 / 16  Intel Drop intro
  05 / 16  Jargon Buster
  06 / 16  Signal 01  Claude Haiku 5.5
  07 / 16  Signal 02  Meta Muse Wonder
  08 / 16  Signal 03  ChatGPT Intelligent UI
  09 / 16  Signal 04  Google Gemini Code Assist sunset
  10 / 16  Signal 05  TypeSafe AI Jev at $7.5B
  11 / 16  Action of the Week
  12 / 16  By Tier
  13 / 16  Builder Spotlight 1 (placeholder)
  14 / 16  Builder Spotlight 2 (placeholder)
  15 / 16  Community Wins (placeholder)
  16 / 16  Close
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

CHARCOAL    = RGBColor(0x11, 0x11, 0x11)
WHITE       = RGBColor(0xF5, 0xF5, 0xF5)
RED         = RGBColor(0xC8, 0x1E, 0x1E)
GOLD        = RGBColor(0xE0, 0xB0, 0x40)
GREY        = RGBColor(0x88, 0x88, 0x88)
GREY_LIGHT  = RGBColor(0xAA, 0xAA, 0xAA)
GREY_DARK   = RGBColor(0x33, 0x33, 0x33)
GREY_MID    = RGBColor(0x44, 0x44, 0x44)
GREY_BORDER = RGBColor(0x22, 0x22, 0x22)

prs = Presentation()
prs.slide_width  = Inches(13.333)
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
    shape = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    shape.line.color.rgb = border_color
    shape.line.width = Pt(1)
    return shape


def add_red_card(slide, left, top, width, height):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
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


def add_footer(slide, num, total=16):
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
        {"text": "What this means for you:", "size": 13,
         "color": WHITE, "bold": True},
        {"text": text, "size": 12, "color": GREY_LIGHT, "spacing_before": 6},
    ])


def add_date_tag(slide, left, top, text):
    add_textbox(slide, left, top, Inches(8), Inches(0.3), text,
                font_size=11, color=GREY, bold=True)


def add_stat_cards(slide, stats):
    """Three right-rail stat cards.  stats = [(big_value, caption), ...]"""
    card_w = Inches(4.3)
    card_h = Inches(1.5)
    right_x = Inches(8.6)
    for i, (headline, caption) in enumerate(stats):
        y = Inches(1.3) + (card_h + Inches(0.2)) * i
        add_card(slide, right_x, y, card_w, card_h)
        add_multiline(slide, right_x + Inches(0.2), y + Inches(0.2),
                      card_w - Inches(0.4), card_h - Inches(0.3), [
            {"text": headline, "size": 26, "color": RED, "bold": True,
             "align": PP_ALIGN.LEFT},
            {"text": caption, "size": 12, "color": GREY_LIGHT,
             "spacing_before": 6},
        ])


def add_tier_card(slide, x, y, width, height, label, heading, bullets, goal):
    """Card with red top border, red label, white heading, grey bullets, red goal."""
    add_card(slide, x, y, width, height,
             border_color=GREY_BORDER, fill_color=GREY_DARK)
    add_accent_line(slide, x, y, width=width, thickness=Pt(4))
    add_textbox(slide, x + Inches(0.3), y + Inches(0.25),
                width - Inches(0.6), Inches(0.3),
                label, font_size=12, color=RED, bold=True)
    add_textbox(slide, x + Inches(0.3), y + Inches(0.65),
                width - Inches(0.6), Inches(0.6),
                heading, font_size=20, color=WHITE, bold=True)
    items_text = "\n\n".join(f"•  {item}" for item in bullets)
    add_textbox(slide, x + Inches(0.3), y + Inches(1.5),
                width - Inches(0.6), height - Inches(2.3),
                items_text, font_size=12, color=GREY_LIGHT)
    add_textbox(slide, x + Inches(0.3), y + height - Inches(0.7),
                width - Inches(0.6), Inches(0.4),
                goal, font_size=12, color=RED, bold=True, italic=True)


# ============================================================
# SLIDE 01 / 16  Title
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)

add_accent_line(slide, Inches(0.8), Inches(1.8), width=Inches(1.5))
add_textbox(slide, Inches(0.8), Inches(2.0), Inches(10), Inches(0.7),
            "HOW I AI", font_size=56, color=RED, bold=True)
add_textbox(slide, Inches(0.8), Inches(2.85), Inches(10), Inches(0.7),
            "Edition 27", font_size=40, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.7), width=Inches(11.9),
                color=GREY_DARK, thickness=Pt(1))
add_textbox(slide, Inches(0.8), Inches(3.9), Inches(12), Inches(0.5),
            "Seoul Soul Project, Canggu  ·  14 October 2026",
            font_size=20, color=GREY_LIGHT)
add_textbox(slide, Inches(0.8), Inches(4.5), Inches(12), Inches(0.4),
            "Bali Start-ups and Tech Community", font_size=16, color=GREY)
add_textbox(slide, Inches(0.8), Inches(6.8), Inches(12), Inches(0.4),
            "bstc.community  ·  every Wednesday 6:30pm WITA",
            font_size=13, color=GREY, italic=True)
add_footer(slide, 1)


# ============================================================
# SLIDE 02 / 16  About BSTC
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "ABOUT BSTC")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
            "What We Are", font_size=48, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.15))

pillars = [
    ("Every Wednesday", "6:30pm WITA at Seoul Soul Project, Canggu"),
    ("Who is here",     "Founders, operators, engineers, and curious people "
                        "building with AI in Southeast Asia"),
    ("What we do",      "Share real signals. Skip the hype. "
                        "Leave with something to try this week."),
    ("No pitch deck",   "This is a community room, not a conference stage. "
                        "Bring your problems."),
]
for i, (label, body) in enumerate(pillars):
    y = Inches(2.55) + Inches(0.9) * i
    add_textbox(slide, Inches(0.8), y, Inches(3.5), Inches(0.55),
                label, font_size=16, color=RED, bold=True)
    add_textbox(slide, Inches(4.4), y, Inches(8.5), Inches(0.55),
                body, font_size=15, color=WHITE)
    add_accent_line(slide, Inches(0.8), y + Inches(0.65),
                    width=Inches(11.9), color=GREY_DARK, thickness=Pt(1))
add_footer(slide, 2)


# ============================================================
# SLIDE 03 / 16  Agenda
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "TONIGHT")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
            "Agenda", font_size=48, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.15))

agenda = [
    ("6:30pm", "Doors open, grab a drink"),
    ("6:45pm", "Jargon Buster  (5 terms to lock in now)"),
    ("7:00pm", "Intel Drop  (5 signals from the last 7 days)"),
    ("7:30pm", "Action of the Week and By Tier"),
    ("7:40pm", "Builder Spotlights"),
    ("7:55pm", "Community Wins  /  Open Floor"),
    ("8:10pm", "Dinner and informal networking"),
]
for i, (time, item) in enumerate(agenda):
    y = Inches(2.55) + Inches(0.58) * i
    add_textbox(slide, Inches(0.8), y, Inches(1.5), Inches(0.5),
                time, font_size=15, color=RED, bold=True)
    add_textbox(slide, Inches(2.6), y, Inches(9.8), Inches(0.5),
                item, font_size=15, color=WHITE)
add_footer(slide, 3)


# ============================================================
# SLIDE 04 / 16  Intel Drop intro
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "INTEL DROP")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
            "5 Signals, 7 Days", font_size=48, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(11), Inches(0.7),
            "This week: pricing floors drop, agent memory improves, "
            "and a non-text model reaches $7.5B. The cost of building with AI "
            "is falling on two fronts at once.",
            font_size=16, color=GREY_LIGHT)

signals_preview = [
    ("01", "Claude Haiku 5.5",           "75% cheaper. Built for sub-agents."),
    ("02", "Meta Muse Wonder",            "Frontier agent model. Active Memory."),
    ("03", "ChatGPT Intelligent UI",      "AI-built interfaces, not just text."),
    ("04", "Google kills Gemini Code Assist sales", "Consolidation accelerates."),
    ("05", "TypeSafe AI Jev at $7.5B",    "Non-text decision models arrive."),
]
for i, (num, title, blurb) in enumerate(signals_preview):
    y = Inches(3.4) + Inches(0.65) * i
    add_textbox(slide, Inches(0.8), y, Inches(0.7), Inches(0.5),
                num, font_size=18, color=RED, bold=True)
    add_textbox(slide, Inches(1.6), y, Inches(4.5), Inches(0.5),
                title, font_size=16, color=WHITE, bold=True)
    add_textbox(slide, Inches(6.3), y, Inches(6.5), Inches(0.5),
                blurb, font_size=14, color=GREY_LIGHT)
add_footer(slide, 4)


# ============================================================
# SLIDE 05 / 16  Jargon Buster
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "BEFORE WE START")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
            "Jargon Buster", font_size=48, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.15))
add_textbox(slide, Inches(0.8), Inches(2.45), Inches(11), Inches(0.6),
            "Five terms from this week's signals. Lock these in first and "
            "the Intel Drop will land harder.",
            font_size=16, color=GREY_LIGHT)

jargon = [
    ("Sub-agent",
     "A smaller, cheaper AI model inside a larger pipeline that handles "
     "routine steps so the expensive model only handles the hard ones."),
    ("Active Memory",
     "An agent's ability to recall information from earlier conversations, "
     "not just the current session. Like a human colleague who remembers "
     "what you discussed last week."),
    ("Intelligent UI",
     "An interface that the AI builds on the fly around your specific task: "
     "buttons, charts, forms, instead of a wall of text."),
    ("Decision model",
     "An AI model trained to output choices, scores, or probabilities rather "
     "than generating prose. Faster and cheaper for routing and classification."),
    ("Product sunset",
     "When a vendor stops selling a product line and migrates users to a "
     "replacement. You keep what you have until the deadline, then you move."),
]
row_top = Inches(3.3)
row_h   = Inches(0.62)
term_left = Inches(0.8)
term_w    = Inches(3.8)
def_left  = Inches(4.8)
def_w     = Inches(7.9)
for i, (term, definition) in enumerate(jargon):
    y = row_top + row_h * i
    add_textbox(slide, term_left, y + Inches(0.08), term_w, row_h,
                term, font_size=16, color=RED, bold=True)
    add_textbox(slide, def_left, y + Inches(0.08), def_w, row_h,
                definition, font_size=13, color=WHITE)
    add_accent_line(slide, term_left, y + row_h - Inches(0.02),
                    width=Inches(11.9), color=GOLD, thickness=Pt(1))
add_textbox(slide, Inches(0.8), Inches(6.85), Inches(11.9), Inches(0.3),
            "If any of these feel fuzzy, find me at dinner. "
            "No dumb questions in this room.",
            font_size=13, color=GREY, italic=True)
add_footer(slide, 5)


# ============================================================
# SIGNAL 01  Claude Haiku 5.5  (06 / 16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 01")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(7.5), Inches(1.8),
            "Anthropic Cuts\nSmall-Model Prices 75%",
            font_size=38, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.1))
add_textbox(slide, Inches(0.8), Inches(3.4), Inches(7.5), Inches(1.4),
            "Anthropic released Claude Haiku 5.5 on 7 October, the cheapest and "
            "fastest model in the Claude family. At $0.10 per million input tokens "
            "and $0.50 per million output tokens, it is 75% cheaper than Haiku 4.5. "
            "The model is the first Haiku with an adjustable effort setting, "
            "positioning it as a capable sub-agent alongside Opus 5.5 and Sonnet 5.5 "
            "for high-volume, cost-sensitive work.",
            font_size=14, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(5.0), "7 OCTOBER 2026  ·  ANTHROPIC")
add_takeaway(slide, Inches(0.8), Inches(5.5), Inches(7.5),
             "Multi-step agent pipelines just got cheaper to run. Route "
             "routine steps (routing, extraction, formatting, scoring) to "
             "Haiku 5.5 and escalate only reasoning-heavy steps to Sonnet or "
             "Opus. That two-tier architecture was always the right design. "
             "Now the numbers actually work.",
             height=Inches(1.5))
add_stat_cards(slide, [
    ("$0.10 / M",  "Input tokens. Haiku 5.5 API price"),
    ("75%",        "Cheaper than Haiku 4.5 on average"),
    ("1M tokens",  "Context window"),
])
add_footer(slide, 6)


# ============================================================
# SIGNAL 02  Meta Muse Wonder  (07 / 16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 02")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(7.5), Inches(1.8),
            "Meta Launches\nFrontier Agent Models",
            font_size=38, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.1))
add_textbox(slide, Inches(0.8), Inches(3.4), Inches(7.5), Inches(1.5),
            "Meta's Superintelligence Labs released Muse Wonder and Muse Wonder Full "
            "on 12 October, its first frontier models designed for personal and "
            "professional agents. The models introduce Active Memory for "
            "cross-conversation recall and Active Focus to keep agents on task when "
            "an approach fails. Meta claims frontier performance against GPT-6 and "
            "Claude models on agentic benchmarks. Independent verification is not yet "
            "available.",
            font_size=14, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(5.1), "12 OCTOBER 2026  ·  META SUPERINTELLIGENCE LABS")
add_takeaway(slide, Inches(0.8), Inches(5.6), Inches(7.5),
             "Meta is now competing at the frontier, not just in open-source. "
             "The stronger Wonder Full model is paywalled inside Muse Code. "
             "Evaluate whether the API-accessible Wonder model fits your use "
             "case before treating Meta as a drop-in option.",
             height=Inches(1.4))
add_stat_cards(slide, [
    ("Active Memory",   "Cross-conversation context recall for agents"),
    ("$20 / $100 mo",  "Muse app access tiers for consumers"),
    ("API available",   "Wonder model only. Wonder Full is subscriber-only"),
])
add_footer(slide, 7)


# ============================================================
# SIGNAL 03  ChatGPT Intelligent UI  (08 / 16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 03")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(7.5), Inches(1.8),
            "ChatGPT Builds\nIts Own Interfaces",
            font_size=38, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.1))
add_textbox(slide, Inches(0.8), Inches(3.4), Inches(7.5), Inches(1.5),
            "OpenAI rolled out Intelligent UI on 7 October, letting ChatGPT "
            "respond with tappable buttons, interactive charts, editable graphs, "
            "forms, and task-specific calculators instead of plain text. Running "
            "on GPT-6 Sol for paid tiers and GPT-6 Luna for free accounts, the "
            "model now decides whether to send a text reply or build a small "
            "interface around what the user is trying to do.",
            font_size=14, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(5.1), "7 OCTOBER 2026  ·  OPENAI")
add_takeaway(slide, Inches(0.8), Inches(5.6), Inches(7.5),
             "If your product's value proposition is 'a nicer interface on "
             "top of ChatGPT,' your moat just got thinner. ChatGPT now "
             "generates interfaces for itself. Shift your differentiation "
             "to data, workflow integrations, or domain expertise that the "
             "base model cannot replicate.",
             height=Inches(1.4))
add_stat_cards(slide, [
    ("GPT-6 Sol",       "Powers paid tiers (Plus, Pro, Business, Enterprise)"),
    ("GPT-6 Luna",      "Powers Free and Go tiers"),
    ("7 Oct 2026",      "Rollout started. Text-only opt-out available"),
])
add_footer(slide, 8)


# ============================================================
# SIGNAL 04  Google ends Gemini Code Assist sales  (09 / 16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 04")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(7.5), Inches(1.8),
            "Google Stops Selling\nGemini Code Assist",
            font_size=38, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.1))
add_textbox(slide, Inches(0.8), Inches(3.4), Inches(7.5), Inches(1.5),
            "On 9 October, Google stopped accepting new Standard and Enterprise "
            "subscriptions for Gemini Code Assist, redirecting customers to "
            "Antigravity. Existing plans continue until contract end, with monthly "
            "renewals available until 31 December 2027 and annual plans until "
            "31 January 2027. The consumer Gemini CLI was already retired on "
            "18 June 2026. Google is consolidating its AI developer tooling "
            "under the Antigravity brand.",
            font_size=14, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(5.1), "9 OCTOBER 2026  ·  GOOGLE")
add_takeaway(slide, Inches(0.8), Inches(5.6), Inches(7.5),
             "Major AI vendors are closing product lines faster than most "
             "teams audit their tooling stack. If any AI tool you depend on "
             "is not a vendor's current flagship, check its roadmap now. "
             "Migrating on your schedule is far cheaper than migrating "
             "on a vendor's deadline.",
             height=Inches(1.4))
add_stat_cards(slide, [
    ("Oct 9, 2026",    "Last day for new Code Assist subscriptions"),
    ("Dec 31, 2027",   "Monthly renewal deadline for existing plans"),
    ("Antigravity",    "Google's replacement. Included in Gemini Enterprise"),
])
add_footer(slide, 9)


# ============================================================
# SIGNAL 05  TypeSafe AI Jev at $7.5B  (10 / 16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 05")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(7.5), Inches(1.8),
            "A Non-Text Model\nHits $7.5B in Three Weeks",
            font_size=38, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.1))
add_textbox(slide, Inches(0.8), Inches(3.4), Inches(7.5), Inches(1.5),
            "TypeSafe AI raised $870 million at a $7.5 billion valuation on "
            "9 October, just three weeks after launching Jev on 15 September. "
            "Jev is a decision model: it returns choices, scores, and probabilities "
            "rather than generated text, making it purpose-built for "
            "classification, routing, and risk-scoring in enterprise pipelines. "
            "Andreessen Horowitz led the round, with Sequoia and DCVC participating. "
            "TypeSafe claims roughly one-third of the Fortune 500 are customers, "
            "but has not named them.",
            font_size=14, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(5.1), "9 OCTOBER 2026  ·  TYPESAFE AI  ·  a16z / SEQUOIA")
add_takeaway(slide, Inches(0.8), Inches(5.6), Inches(7.5),
             "Not every AI problem needs a language model. If your product "
             "uses a large model to choose between options, a decision model "
             "could replace that call at a fraction of the cost and latency. "
             "Jev is the first well-funded signal that this category is real.",
             height=Inches(1.4))
add_stat_cards(slide, [
    ("$870M",          "Raised at $7.5B valuation in a single round"),
    ("3 weeks",        "From Jev launch (15 Sep) to this funding round"),
    ("$200M to $7.5B", "Valuation jump: September seed to October Series A"),
])
add_footer(slide, 10)


# ============================================================
# SLIDE 11 / 16  Action of the Week
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "ACTION OF THE WEEK")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(10), Inches(1.0),
            "Try a Two-Tier Agent Pipeline This Week",
            font_size=36, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(9.5), Inches(0.8),
            "Haiku 5.5 makes the economics viable. This is the week to test it. "
            "One hour, real cost data, and a clear answer on whether the "
            "two-tier approach works for your use case.",
            font_size=15, color=GREY_LIGHT)

badge_x = Inches(10.5)
badge_y = Inches(1.2)
badge_w = Inches(2.4)
badge_h = Inches(1.8)
add_red_card(slide, badge_x, badge_y, badge_w, badge_h)
add_multiline(slide, badge_x, badge_y + Inches(0.3), badge_w, badge_h - Inches(0.3), [
    {"text": "60",       "size": 56, "color": WHITE, "bold": True,
     "align": PP_ALIGN.CENTER},
    {"text": "MINUTES",  "size": 16, "color": WHITE, "bold": True,
     "align": PP_ALIGN.CENTER, "spacing_before": 2},
    {"text": "To try this",  "size": 10, "color": WHITE,
     "align": PP_ALIGN.CENTER, "spacing_before": 6},
])

steps = [
    ("01", "Pick a task",    "One repeating task in your product: routing, tagging, summarising"),
    ("02", "Run Sonnet",     "Run 20 examples through claude-sonnet-5-5 and note cost plus quality"),
    ("03", "Run Haiku 5.5",  "Run the same 20 through claude-haiku-5-5 at adjustable effort"),
    ("04", "Compare",        "Note where Haiku 5.5 matches quality. Route those calls permanently"),
]
flow_top   = Inches(3.7)
flow_h     = Inches(1.7)
step_w     = Inches(2.95)
step_gap   = Inches(0.1)
flow_start = Inches(0.6)
for i, (num, title, body) in enumerate(steps):
    x = flow_start + (step_w + step_gap) * i
    add_card(slide, x, flow_top, step_w, flow_h)
    circle_size = Inches(0.6)
    add_circle(slide, x + Inches(0.3), flow_top + Inches(0.2),
               circle_size, fill_color=RED)
    add_textbox(slide, x + Inches(0.3), flow_top + Inches(0.28),
                circle_size, Inches(0.5),
                num, font_size=15, color=WHITE, bold=True,
                alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(1.0), flow_top + Inches(0.28),
                step_w - Inches(1.1), Inches(0.45),
                title, font_size=18, color=WHITE, bold=True)
    add_textbox(slide, x + Inches(0.3), flow_top + Inches(0.95),
                step_w - Inches(0.5), Inches(0.7),
                body, font_size=12, color=GREY_LIGHT)
    if i < 3:
        ax = x + step_w + Inches(0.005)
        add_textbox(slide, ax - Inches(0.05), flow_top + Inches(0.6),
                    step_gap + Inches(0.1), Inches(0.5),
                    "›", font_size=22, color=RED, bold=True,
                    alignment=PP_ALIGN.CENTER)

add_takeaway(slide, Inches(0.8), Inches(5.75), Inches(11.7),
             "Most AI products overspend on the last 20% of steps that a cheap "
             "model handles just as well. Signal 01 gave you a 75% cheaper "
             "option for those steps. The only cost is one hour to find out "
             "where the quality line is.",
             height=Inches(1.25))
add_footer(slide, 11)


# ============================================================
# SLIDE 12 / 16  By Tier
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "BY TIER")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(12), Inches(0.9),
            "What To Do With This Week's News",
            font_size=40, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(12), Inches(0.6),
            "One action calibrated to where you are right now. Pick your column.",
            font_size=16, color=GREY_LIGHT)

tiers = [
    {
        "label":   "TIER 1, EXPLORER",
        "heading": "Test Haiku 5.5 today",
        "bullets": [
            "Open claude.ai or the API console",
            "Ask the same question to claude-haiku-5-5 and claude-sonnet-5-5",
            "Compare the answers. Notice where quality differs and where it does not",
        ],
        "goal": "Goal: get a feel for where cheap models are good enough",
    },
    {
        "label":   "TIER 2, OPERATOR",
        "heading": "Audit your AI tooling stack",
        "bullets": [
            "List every AI tool your team uses today",
            "For each one, check: is this the vendor's current flagship product?",
            "Flag anything on a sunset path and plan the migration before the deadline",
        ],
        "goal": "Goal: know your migration risk before it becomes urgent",
    },
    {
        "label":   "TIER 3, BUILDER",
        "heading": "Build a model router",
        "bullets": [
            "Classify incoming requests by complexity (simple, moderate, complex)",
            "Route simple and moderate to claude-haiku-5-5 with adjustable effort",
            "Reserve claude-sonnet-5-5 or opus for complex reasoning only",
        ],
        "goal": "Goal: cut AI cost 50% to 70% without degrading output quality",
    },
]
tier_w   = Inches(4.0)
tier_h   = Inches(4.1)
tier_top = Inches(3.3)
tier_gap = Inches(0.15)
tier_start = Inches(0.5)
for i, t in enumerate(tiers):
    x = tier_start + (tier_w + tier_gap) * i
    add_tier_card(slide, x, tier_top, tier_w, tier_h,
                  t["label"], t["heading"], t["bullets"], t["goal"])
add_footer(slide, 12)


# ============================================================
# SLIDE 13 / 16  Builder Spotlight 1 (placeholder)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "BUILDER SPOTLIGHT")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(12), Inches(0.9),
            "Spotlight 1", font_size=48, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_card(slide, Inches(0.8), Inches(2.5), Inches(11.7), Inches(4.5))
add_textbox(slide, Inches(2.5), Inches(3.8), Inches(8.5), Inches(1.8),
            "[Builder name, company]\n"
            "[What they built and how they use AI in it]\n"
            "[Key result or metric]",
            font_size=22, color=GREY, italic=True, alignment=PP_ALIGN.CENTER)
add_footer(slide, 13)


# ============================================================
# SLIDE 14 / 16  Builder Spotlight 2 (placeholder)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "BUILDER SPOTLIGHT")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(12), Inches(0.9),
            "Spotlight 2", font_size=48, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_card(slide, Inches(0.8), Inches(2.5), Inches(11.7), Inches(4.5))
add_textbox(slide, Inches(2.5), Inches(3.8), Inches(8.5), Inches(1.8),
            "[Builder name, company]\n"
            "[What they built and how they use AI in it]\n"
            "[Key result or metric]",
            font_size=22, color=GREY, italic=True, alignment=PP_ALIGN.CENTER)
add_footer(slide, 14)


# ============================================================
# SLIDE 15 / 16  Community Wins (placeholder)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "COMMUNITY WINS")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(12), Inches(0.9),
            "Wins From The Room", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(12), Inches(0.8),
            "Members who shipped something since Edition 26. "
            "This is what the community looks like when it builds in public.",
            font_size=15, color=GREY_LIGHT)

wins = [
    {"name": "[Member 1 name]",
     "role": "[Founder, Company  /  Operator, Industry]",
     "shipped": "Tell me what you shipped this week.",
     "initial": "M1"},
    {"name": "[Member 2 name]",
     "role": "[Founder or operator title]",
     "shipped": "One line. No pitch. Just the thing you built.",
     "initial": "M2"},
    {"name": "[Member 3 name]",
     "role": "[Founder or operator title]",
     "shipped": "Even a small win counts here.",
     "initial": "M3"},
]
card_w   = Inches(4.0)
card_h   = Inches(3.4)
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
                w["initial"], font_size=22, color=WHITE, bold=True,
                alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), card_top + Inches(1.55),
                card_w - Inches(0.6), Inches(0.4),
                w["name"], font_size=18, color=WHITE, bold=True,
                alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), card_top + Inches(2.0),
                card_w - Inches(0.6), Inches(0.3),
                w["role"], font_size=12, color=GREY, italic=True,
                alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), card_top + Inches(2.45),
                card_w - Inches(0.6), Inches(0.9),
                w["shipped"], font_size=12, color=GREY_LIGHT,
                alignment=PP_ALIGN.CENTER)

add_textbox(slide, Inches(0.8), Inches(7.1), Inches(11.9), Inches(0.35),
            "Want to be on this slide next edition? Tell me what you shipped. "
            "No pitch needed, just a screenshot and one line.",
            font_size=13, color=GOLD, italic=True, alignment=PP_ALIGN.CENTER)
add_footer(slide, 15)


# ============================================================
# SLIDE 16 / 16  Close
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_accent_line(slide, Inches(0.8), Inches(1.8), width=Inches(1.5))
add_textbox(slide, Inches(0.8), Inches(2.0), Inches(11), Inches(0.8),
            "See You at Edition 28", font_size=48, color=WHITE, bold=True)
add_textbox(slide, Inches(0.8), Inches(2.95), Inches(11), Inches(0.6),
            "Next Wednesday  ·  21 October 2026  ·  Seoul Soul Project, Canggu",
            font_size=22, color=GREY_LIGHT)
add_accent_line(slide, Inches(0.8), Inches(3.75), width=Inches(11.9),
                color=GREY_DARK, thickness=Pt(1))
add_textbox(slide, Inches(0.8), Inches(4.05), Inches(11), Inches(0.5),
            "6:30pm WITA  ·  bstc.community",
            font_size=18, color=GREY)
add_textbox(slide, Inches(0.8), Inches(5.0), Inches(11), Inches(0.5),
            "Bring one thing you tried from tonight. Even if it failed.",
            font_size=16, color=GREY_LIGHT, italic=True)
add_footer(slide, 16)


# ============================================================
# SAVE
# ============================================================
output_path = "public/how-i-ai-edition-27.pptx"
prs.save(output_path)
print(f"Saved to {output_path}")
