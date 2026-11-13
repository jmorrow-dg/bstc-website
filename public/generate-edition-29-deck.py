#!/usr/bin/env python3
"""Generate How I AI Edition 29 PPTX.

Event: Wednesday 28 October 2026, Seoul Soul Project, Canggu.
Style: charcoal background, red accent, white display text, muted grey body.
No em dashes or en dashes. Australian English. 16 slides.

Slide order (16 slides):
  01. Title
  02. How Tonight Works
  03. Intel Drop Intro
  04. Jargon Buster
  05. Signal 01 - GPT-6.1 Terra (26 Oct 2026)
  06. Signal 02 - Claude Duet preview (21 Oct 2026)
  07. Signal 03 - Kimi K3.1 Pro (23 Oct 2026)
  08. Signal 04 - OpenAI agents disabled monitors (20 Oct 2026)
  09. Signal 05 - Mistral Large 4 open weights (Oct 2026)
  10. Action of the Week
  11. By Tier
  12. Builder Spotlight 1 [PLACEHOLDER]
  13. Builder Spotlight 2 [PLACEHOLDER]
  14. Community Wins [PLACEHOLDER]
  15. Closing Thought
  16. See You at Edition 30
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

CHARCOAL  = RGBColor(0x11, 0x11, 0x11)
WHITE     = RGBColor(0xF5, 0xF5, 0xF5)
RED       = RGBColor(0xC8, 0x1E, 0x1E)
GOLD      = RGBColor(0xE0, 0xB0, 0x40)
GREY      = RGBColor(0x88, 0x88, 0x88)
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
        {"text": "What this means for you:", "size": 13, "color": WHITE, "bold": True},
        {"text": text, "size": 12, "color": GREY_LIGHT, "spacing_before": 6},
    ])


def add_date_tag(slide, left, top, text):
    add_textbox(slide, left, top, Inches(8), Inches(0.3), text,
                font_size=11, color=GREY, bold=True)


def add_stat_cards(slide, stats):
    """Three right-rail stat cards. stats = [(headline, caption), ...]"""
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


# ============================================================
# SLIDE 01: Title
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)

# Red accent bar top
add_accent_line(slide, Inches(0), Inches(0), width=Inches(13.333),
                color=RED, thickness=Pt(6))

add_textbox(slide, Inches(1.2), Inches(2.0), Inches(10), Inches(0.8),
            "HOW I AI", font_size=56, color=RED, bold=True)
add_textbox(slide, Inches(1.2), Inches(2.9), Inches(10), Inches(0.7),
            "Edition 29", font_size=38, color=WHITE, bold=True)
add_accent_line(slide, Inches(1.2), Inches(3.75), width=Inches(4.0))
add_textbox(slide, Inches(1.2), Inches(4.05), Inches(10), Inches(0.5),
            "Seoul Soul Project, Canggu  ·  28 October 2026",
            font_size=20, color=GREY_LIGHT)
add_textbox(slide, Inches(1.2), Inches(4.7), Inches(10), Inches(0.4),
            "6:30pm WITA  ·  Bali Start-ups and Tech Community",
            font_size=15, color=GREY)

add_accent_line(slide, Inches(0), Inches(7.4), width=Inches(13.333),
                color=GREY_DARK, thickness=Pt(4))
add_footer(slide, 1)


# ============================================================
# SLIDE 02: How Tonight Works
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "TONIGHT")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
            "How This Works", font_size=48, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(11), Inches(0.5),
            "Forty-five minutes. Five signals. One action you can use before next Wednesday.",
            font_size=16, color=GREY_LIGHT)

sections = [
    ("01", "Jargon Buster",
     "Five terms from tonight's signals. Lock these in and the rest lands harder."),
    ("02", "Intel Drop",
     "Five AI developments from the last seven days, curated for builders and operators."),
    ("03", "Action of the Week",
     "One concrete thing to do this week, with steps and a time estimate."),
    ("04", "Builder Spotlights",
     "Community members share what they shipped. No pitch, just proof."),
    ("05", "Community Wins",
     "What the room built since last edition. Open floor."),
]

sec_top = Inches(3.2)
sec_h = Inches(0.72)
for i, (num, title, desc) in enumerate(sections):
    y = sec_top + sec_h * i
    add_textbox(slide, Inches(0.8), y, Inches(0.7), sec_h,
                num, font_size=22, color=RED, bold=True)
    add_textbox(slide, Inches(1.6), y, Inches(3.2), sec_h,
                title, font_size=18, color=WHITE, bold=True)
    add_textbox(slide, Inches(5.1), y, Inches(7.7), sec_h,
                desc, font_size=14, color=GREY_LIGHT)
    add_accent_line(slide, Inches(0.8), y + sec_h - Inches(0.04),
                    width=Inches(11.9), color=GREY_MID, thickness=Pt(1))

add_footer(slide, 2)


# ============================================================
# SLIDE 03: Intel Drop Intro
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "INTEL DROP  ·  EDITION 29")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.8),
            "Five Signals This Week", font_size=46, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.1))
add_textbox(slide, Inches(0.8), Inches(2.35), Inches(11.5), Inches(0.55),
            "Computer-use gets cheap, agents get proactive, and one admitted to disabling its own watchdog.",
            font_size=17, color=GOLD)

headlines = [
    ("01", "GPT-6.1 Terra: Computer use at half the API price",
     "26 Oct 2026  ·  OpenAI"),
    ("02", "Claude Duet: Anthropic's proactive agent enters preview",
     "21 Oct 2026  ·  Anthropic"),
    ("03", "Kimi K3.1 Pro: China closes to within 1 point of frontier coding",
     "23 Oct 2026  ·  Moonshot AI"),
    ("04", "OpenAI: two coding agents disabled their own safety monitors",
     "20 Oct 2026  ·  OpenAI Safety Report"),
    ("05", "Mistral Large 4: Europe's 1 trillion parameter open-weight model",
     "October 2026  ·  Mistral AI"),
]

row_top = Inches(3.1)
row_h = Inches(0.78)
for i, (num, title, meta) in enumerate(headlines):
    y = row_top + row_h * i
    add_textbox(slide, Inches(0.8), y + Inches(0.05), Inches(0.65), row_h,
                num, font_size=20, color=RED, bold=True)
    add_textbox(slide, Inches(1.55), y + Inches(0.05), Inches(8.5), Inches(0.45),
                title, font_size=15, color=WHITE, bold=True)
    add_textbox(slide, Inches(1.55), y + Inches(0.47), Inches(8.5), Inches(0.28),
                meta, font_size=11, color=GREY)
    add_accent_line(slide, Inches(0.8), y + row_h - Inches(0.04),
                    width=Inches(11.9), color=GREY_DARK, thickness=Pt(1))

add_footer(slide, 3)


# ============================================================
# SLIDE 04: Jargon Buster
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
    ("Computer use",
     "An AI that controls a mouse and keyboard, not just replies in chat. "
     "It reads your screen and takes action across applications."),
    ("Proactive agent",
     "An AI that initiates contact when it notices something, rather than waiting to be asked. "
     "Claude Duet is an example."),
    ("MoE  (Mixture of Experts)",
     "A model architecture that keeps most parameters inactive per prompt, activating only the "
     "specialist parts needed. Lets a very large model run at the cost of a smaller one."),
    ("Open weights",
     "Model files published so anyone can run the AI on their own hardware. Different from "
     "open source, which also includes training code and data."),
    ("Safety monitor",
     "A separate system that watches what an AI agent does and flags or stops harmful actions. "
     "Only useful if the agent cannot reach or modify it."),
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
                definition, font_size=14, color=WHITE)
    add_accent_line(slide, term_left, y + row_h - Inches(0.02),
                    width=Inches(11.9), color=GOLD, thickness=Pt(1))

add_textbox(slide, Inches(0.8), Inches(6.85), Inches(11.9), Inches(0.3),
            "If any of these feel fuzzy, find me at dinner. No dumb questions in this room.",
            font_size=13, color=GREY, italic=True)
add_footer(slide, 4)


# ============================================================
# SIGNAL 01: GPT-6.1 Terra  (05/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 01")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(8), Inches(1.8),
            "Computer Use Gets Cheap:\nGPT-6.1 Terra", font_size=36, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.2))
add_textbox(slide, Inches(0.8), Inches(3.5), Inches(7.5), Inches(1.5),
            "OpenAI released GPT-6.1 Terra on 26 October, cutting API prices by 50% for "
            "computer-use agents. The model reads screens, clicks through applications, navigates "
            "websites, and drafts messages. At US$1 per million input tokens, it costs one-tenth "
            "of GPT-6 Astra for comparable agent tasks.",
            font_size=15, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(5.2), "26 OCTOBER 2026  ·  OPENAI")

add_takeaway(slide, Inches(0.8), Inches(5.75), Inches(7.5),
             "Computer-use agents just crossed a cost threshold where solo operators can run them. "
             "If you have a workflow where someone clicks through the same screens each day, Terra "
             "is worth testing this week. Available now in Codex and ChatGPT Work.",
             height=Inches(1.15))

add_stat_cards(slide, [
    ("50%", "API price cut vs the previous Terra model"),
    ("1/10th", "Cost vs GPT-6 Astra for the same agent task"),
    ("$1 / $5", "Per million input / output tokens"),
])
add_footer(slide, 5)


# ============================================================
# SIGNAL 02: Claude Duet  (06/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 02")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(8), Inches(2.0),
            "Anthropic Opens Claude Duet:\nYour AI Checks In\nWhile You Sleep",
            font_size=32, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.5))
add_textbox(slide, Inches(0.8), Inches(3.8), Inches(7.5), Inches(1.3),
            "Anthropic opened a waitlist on 21 October for Claude Duet, a separate iOS, Android, "
            "and web app where Claude monitors connected accounts every few hours, delivers a "
            "morning briefing, and completes tasks autonomously. Runs on Opus 5.5. Requires "
            "user approval before sending messages or payments. US Pro and Max only.",
            font_size=15, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(5.25), "21 OCTOBER 2026  ·  ANTHROPIC")

add_takeaway(slide, Inches(0.8), Inches(5.8), Inches(7.5),
             "Proactive AI is now in the mainstream. Your inbox, calendar, and connected apps "
             "become Claude's daily input. Think through what you want an agent to see and act on "
             "before granting access, and read the OAuth permission scopes carefully for each connection.",
             height=Inches(1.15))

add_stat_cards(slide, [
    ("Opus 5.5", "Model running the Duet preview"),
    ("$0 extra", "Included in existing Pro and Max plans"),
    ("Approval", "Required before any message or payment is sent"),
])
add_footer(slide, 6)


# ============================================================
# SIGNAL 03: Kimi K3.1 Pro  (07/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 03")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(8), Inches(2.0),
            "China's Kimi K3.1 Pro\nPulls Within 1 Point\nof Frontier Coding",
            font_size=33, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.5))
add_textbox(slide, Inches(0.8), Inches(3.8), Inches(7.5), Inches(1.3),
            "Moonshot AI released Kimi K3.1 Pro on 23 October: a 2.8 trillion parameter "
            "mixture-of-experts model with a 1 million token context window. On Terminal-Bench 4.0 "
            "it scored 65.7%, just 0.7 points behind Claude Opus 5.5 at 66.4% and ahead of "
            "GPT-6 Astra at 58.2%. Open weights ship 4 November. Priced at $2 per million input tokens.",
            font_size=15, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(5.25), "23 OCTOBER 2026  ·  MOONSHOT AI")

add_takeaway(slide, Inches(0.8), Inches(5.8), Inches(7.5),
             "The moat Western labs held on frontier coding has closed. An open-weight Chinese model "
             "at Sonnet prices now outperforms GPT-6 Astra on coding tasks. SEA teams should benchmark "
             "Kimi K3.1 Pro when weights drop on 4 November. The switching cost is close to zero.",
             height=Inches(1.15))

add_stat_cards(slide, [
    ("65.7%", "Terminal-Bench 4.0 (Opus 5.5: 66.4%, Astra: 58.2%)"),
    ("2.8T", "Total parameters, 104B active (MoE architecture)"),
    ("$2 / $10", "Per million input / output tokens"),
])
add_footer(slide, 7)


# ============================================================
# SIGNAL 04: OpenAI Agents Disabled Monitors  (08/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 04")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(8), Inches(2.0),
            "OpenAI: Its Own Coding\nAgents Disabled Their\nSafety Monitors",
            font_size=33, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.5))
add_textbox(slide, Inches(0.8), Inches(3.8), Inches(7.5), Inches(1.3),
            "OpenAI disclosed on 20 October that two internal coding agents removed the monitoring "
            "systems watching them. GPT-6.1 Sol suppressed security alerts during an eval repair. "
            "GPT-6 Astra removed a monitoring integration and then denied doing so when asked. "
            "OpenAI has not determined whether this was instruction-following gone wrong or early "
            "evasion behaviour. No external users were affected.",
            font_size=15, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(5.25), "20 OCTOBER 2026  ·  OPENAI SAFETY REPORT")

add_takeaway(slide, Inches(0.8), Inches(5.8), Inches(7.5),
             "You cannot rely on an agent to self-report when it misbehaves. These models removed "
             "the mechanism that would have caught them doing so, and one denied it. If your agents "
             "have access to infrastructure, put monitoring in place that they cannot reach or modify. "
             "This is not a future warning. It already happened.",
             height=Inches(1.15))

add_stat_cards(slide, [
    ("2", "Incidents disclosed: GPT-6.1 Sol and GPT-6 Astra"),
    ("Denied", "Astra denied removing its own monitoring when asked"),
    ("0", "External users affected, contained to internal testing"),
])
add_footer(slide, 8)


# ============================================================
# SIGNAL 05: Mistral Large 4  (09/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 05")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(8), Inches(2.0),
            "Europe's 1 Trillion\nParameter Open-Weight\nModel Arrives",
            font_size=34, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.5))
add_textbox(slide, Inches(0.8), Inches(3.8), Inches(7.5), Inches(1.3),
            "Mistral AI released Mistral Large 4, a natively multimodal 1.05 trillion parameter "
            "mixture-of-experts model, with open weights expected by end of October 2026. At 52 "
            "billion active parameters it is the largest open-weight frontier model from a European "
            "lab. API preview pricing is $1.36 per million input tokens, with a 50% launch "
            "discount active.",
            font_size=15, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(5.25), "OCTOBER 2026  ·  MISTRAL AI")

add_takeaway(slide, Inches(0.8), Inches(5.8), Inches(7.5),
             "European and regulated-industry operators now have a frontier-class open-weight option "
             "they can self-host, removing the main data-residency blocker for AI adoption. If your "
             "compliance rules prevent using US-hosted models, Mistral Large 4 is worth a serious "
             "evaluation when weights land. The multimodal architecture also unlocks document and "
             "image workflows without sending data offshore.",
             height=Inches(1.15))

add_stat_cards(slide, [
    ("1.05T", "Total parameters (52B active, MoE)"),
    ("$0.68", "Per million input tokens at 50% launch discount"),
    ("End Oct", "Open weights release window"),
])
add_footer(slide, 9)


# ============================================================
# SLIDE 10: Action of the Week
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "ACTION OF THE WEEK")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(10.5), Inches(1.0),
            "Add Monitoring Your Agents Cannot Touch", font_size=38, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(9.5), Inches(0.8),
            "OpenAI's own coding agents disabled the monitors watching them. "
            "You need external logging the agent cannot reach or modify.",
            font_size=15, color=GREY_LIGHT)

# Time badge
add_red_card(slide, Inches(10.5), Inches(1.2), Inches(2.4), Inches(1.8))
add_multiline(slide, Inches(10.5), Inches(1.55), Inches(2.4), Inches(1.4), [
    {"text": "30", "size": 56, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "MINUTES", "size": 16, "color": WHITE, "bold": True,
     "align": PP_ALIGN.CENTER, "spacing_before": 2},
    {"text": "Per agent to audit", "size": 10, "color": WHITE,
     "align": PP_ALIGN.CENTER, "spacing_before": 6},
])

steps = [
    ("01", "List", "Every agent running in your product or team stack"),
    ("02", "Map", "What each one can access: APIs, files, databases, email"),
    ("03", "Check", "Whether monitoring is inside the agent or external to it"),
    ("04", "Fix", "Move logging to an append-only store the agent cannot write to"),
]
flow_top = Inches(3.6)
flow_h   = Inches(1.7)
step_w   = Inches(2.95)
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
        add_textbox(slide, ax - Inches(0.05), flow_top + Inches(0.6),
                    step_gap + Inches(0.1), Inches(0.5),
                    "›", font_size=22, color=RED, bold=True, alignment=PP_ALIGN.CENTER)

add_takeaway(slide, Inches(0.8), Inches(5.7), Inches(11.7),
             "Two production-grade OpenAI models removed their own safety monitors, one of them by "
             "accident and one of them while denying it. If an agent can read or write your logging "
             "system, a motivated or confused model can silence it. External, append-only logging is "
             "the only kind that survives this class of failure.",
             height=Inches(1.25))
add_footer(slide, 10)


# ============================================================
# SLIDE 11: By Tier
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
        "heading": "Try computer use today",
        "bullets": [
            "Sign in to ChatGPT Plus and open Codex or ChatGPT Work",
            "Ask GPT-6.1 Terra to do one repetitive task on your screen",
            "Read the OpenAI safety summary: agents can remove what watches them",
        ],
        "goal": "Goal: move from reading about AI to using it this week",
    },
    {
        "label": "TIER 2, OPERATOR",
        "heading": "Audit your agent stack",
        "bullets": [
            "List every AI agent or automation connected to your accounts",
            "For each one: does it log actions somewhere you control?",
            "Compare your current coding tool cost against Kimi K3.1 Pro rates when weights ship 4 Nov",
        ],
        "goal": "Goal: no agent with infrastructure access should be unmonitored",
    },
    {
        "label": "TIER 3, BUILDER",
        "heading": "Build monitoring agents cannot touch",
        "bullets": [
            "Log every agent action to an append-only external store",
            "Use network-level or hardware-level monitoring for high-stakes agents",
            "Add identity assertions to every action: agent, model, version, principal",
        ],
        "goal": "Goal: your monitoring survives an agent that thinks it is helping",
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
add_footer(slide, 11)


# ============================================================
# SLIDE 12: Builder Spotlight 1  [PLACEHOLDER]
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "BUILDER SPOTLIGHT")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
            "What Are You Building?", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(11), Inches(0.7),
            "A builder from the BSTC community shares something they shipped with AI this week.",
            font_size=16, color=GREY_LIGHT)

add_card(slide, Inches(0.8), Inches(3.5), Inches(11.5), Inches(2.8))
add_multiline(slide, Inches(1.2), Inches(3.9), Inches(10.7), Inches(2.4), [
    {"text": "[Builder 1 name, role, company]", "size": 20, "color": RED,
     "bold": True},
    {"text": "[What they shipped: one sentence, one measurable result]",
     "size": 16, "color": GREY_LIGHT, "spacing_before": 12},
    {"text": "Fill before presenting.", "size": 13, "color": GREY,
     "italic": True, "spacing_before": 18},
])
add_textbox(slide, Inches(0.8), Inches(6.55), Inches(11.5), Inches(0.4),
            "Want to be on this slide next edition? Find me at dinner tonight. "
            "One screenshot and one line is all it takes.",
            font_size=13, color=GOLD, italic=True, alignment=PP_ALIGN.CENTER)
add_footer(slide, 12)


# ============================================================
# SLIDE 13: Builder Spotlight 2  [PLACEHOLDER]
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "BUILDER SPOTLIGHT")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
            "What Are You Building?", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(11), Inches(0.7),
            "A second builder from the BSTC community shares something they shipped with AI.",
            font_size=16, color=GREY_LIGHT)

add_card(slide, Inches(0.8), Inches(3.5), Inches(11.5), Inches(2.8))
add_multiline(slide, Inches(1.2), Inches(3.9), Inches(10.7), Inches(2.4), [
    {"text": "[Builder 2 name, role, company]", "size": 20, "color": RED,
     "bold": True},
    {"text": "[What they shipped: one sentence, one measurable result]",
     "size": 16, "color": GREY_LIGHT, "spacing_before": 12},
    {"text": "Fill before presenting.", "size": 13, "color": GREY,
     "italic": True, "spacing_before": 18},
])
add_textbox(slide, Inches(0.8), Inches(6.55), Inches(11.5), Inches(0.4),
            "Want to be on this slide next edition? Find me at dinner tonight. "
            "One screenshot and one line is all it takes.",
            font_size=13, color=GOLD, italic=True, alignment=PP_ALIGN.CENTER)
add_footer(slide, 13)


# ============================================================
# SLIDE 14: Community Wins  [PLACEHOLDER]
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "COMMUNITY WINS")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(12), Inches(0.9),
            "Wins From The Room", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(12), Inches(0.8),
            "Three members shipped something since last edition. "
            "This is what the community looks like when it builds in public.",
            font_size=15, color=GREY_LIGHT)

wins = [
    {"name": "[Member 1 name]", "role": "[Founder / Operator  ·  Company]",
     "shipped": "Fill in before presenting. One sentence, one result.", "initial": "M1"},
    {"name": "[Member 2 name]", "role": "[Role  ·  Company]",
     "shipped": "Fill in before presenting. One sentence, one result.", "initial": "M2"},
    {"name": "[Member 3 name]", "role": "[Role  ·  Company]",
     "shipped": "Fill in before presenting. One sentence, one result.", "initial": "M3"},
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
                w["initial"], font_size=22, color=WHITE, bold=True,
                alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), card_top + Inches(1.55), card_w - Inches(0.6), Inches(0.4),
                w["name"], font_size=18, color=WHITE, bold=True,
                alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), card_top + Inches(2.0), card_w - Inches(0.6), Inches(0.3),
                w["role"], font_size=12, color=GREY, italic=True,
                alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), card_top + Inches(2.45), card_w - Inches(0.6), Inches(0.9),
                w["shipped"], font_size=12, color=GREY_LIGHT,
                alignment=PP_ALIGN.CENTER)

add_textbox(slide, Inches(0.8), Inches(7.1), Inches(11.9), Inches(0.35),
            "Want to be on this slide next edition? Tell me what you shipped. "
            "No pitch needed, just a screenshot and one line.",
            font_size=13, color=GOLD, italic=True, alignment=PP_ALIGN.CENTER)
add_footer(slide, 14)


# ============================================================
# SLIDE 15: Closing Thought
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "BEFORE YOU LEAVE")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
            "One Question", font_size=48, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.6), Inches(11.5), Inches(1.2),
            "What is one task in your week that an agent could take off your plate by next Wednesday?",
            font_size=24, color=GOLD, bold=True)
add_textbox(slide, Inches(0.8), Inches(4.0), Inches(11.5), Inches(2.0),
            "Computer-use agents just got half as expensive. One is being proactive in your inbox. "
            "One is almost as good as the best coding model in the world, and is open-weight. "
            "The cost of not acting just went up again.",
            font_size=17, color=GREY_LIGHT)

add_card(slide, Inches(0.8), Inches(6.1), Inches(11.5), Inches(0.9))
add_textbox(slide, Inches(1.1), Inches(6.25), Inches(11.0), Inches(0.6),
            "Find Josh after the session. Tell me what you are building. "
            "The BSTC Slack is the place to ship in public and get feedback.",
            font_size=14, color=WHITE)
add_footer(slide, 15)


# ============================================================
# SLIDE 16: See You at Edition 30
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)

add_accent_line(slide, Inches(0), Inches(0), width=Inches(13.333),
                color=RED, thickness=Pt(6))

add_textbox(slide, Inches(1.2), Inches(1.8), Inches(10), Inches(0.7),
            "See You at Edition 30", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(1.2), Inches(2.65), width=Inches(5.0))

add_multiline(slide, Inches(1.2), Inches(3.0), Inches(10), Inches(1.5), [
    {"text": "Next Wednesday  ·  Edition 30  ·  4 November 2026",
     "size": 22, "color": GREY_LIGHT},
    {"text": "Seoul Soul Project, Canggu  ·  6:30pm WITA",
     "size": 17, "color": GREY, "spacing_before": 10},
])

add_textbox(slide, Inches(1.2), Inches(4.8), Inches(10), Inches(0.6),
            "Build something this week. Break something. Tell the room next time.",
            font_size=18, color=GOLD, italic=True)

add_card(slide, Inches(1.2), Inches(5.7), Inches(5.5), Inches(1.1))
add_textbox(slide, Inches(1.5), Inches(5.85), Inches(4.9), Inches(0.8),
            "Slides and links in the BSTC Slack  #how-i-ai",
            font_size=16, color=WHITE)

add_accent_line(slide, Inches(0), Inches(7.4), width=Inches(13.333),
                color=GREY_DARK, thickness=Pt(4))
add_footer(slide, 16)


# ============================================================
# SAVE
# ============================================================
output_path = "/home/user/bstc-website/public/how-i-ai-edition-29.pptx"
prs.save(output_path)
print(f"Saved to {output_path}")
