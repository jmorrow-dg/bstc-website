#!/usr/bin/env python3
"""Generate How I AI Edition 33 PPTX.

Style mirrors Edition 3: charcoal background, red accent, white display text,
muted grey body. No em dashes or en dashes. Australian English.

Event: Seoul Soul Project, Canggu -- 25 November 2026

Slide order (16 slides total):
  1. Title                     (01/16)
  2. About How I AI            (02/16)
  3. Intel Drop Intro          (03/16)
  4. Jargon Buster             (04/16)
  5. Signal 01, Anthropic IPO  (05/16)
  6. Signal 02, Claude Ship    (06/16)
  7. Signal 03, Gemini 4 Neon  (07/16)
  8. Signal 04, GPT-6.2 Astra  (08/16)
  9. Signal 05, Banks/Agents   (09/16)
 10. Action of the Week        (10/16)
 11. By Tier                   (11/16)
 12. Builder Spotlight 1       (12/16) -- placeholder
 13. Builder Spotlight 2       (13/16) -- placeholder
 14. Builder Spotlight 3       (14/16) -- placeholder
 15. Community Wins            (15/16) -- placeholder
 16. Close                     (16/16)
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


def add_stat_cards(slide, stats, right_x=Inches(8.6)):
    """Add three right-rail stat cards, stacked."""
    card_w = Inches(4.3)
    card_h = Inches(1.5)
    for i, (headline, caption) in enumerate(stats):
        y = Inches(1.3) + (card_h + Inches(0.2)) * i
        add_card(slide, right_x, y, card_w, card_h)
        add_multiline(slide, right_x + Inches(0.2), y + Inches(0.2),
                      card_w - Inches(0.4), card_h - Inches(0.3), [
            {"text": headline, "size": 26, "color": RED, "bold": True, "align": PP_ALIGN.LEFT},
            {"text": caption, "size": 12, "color": GREY_LIGHT, "spacing_before": 6},
        ])


# ============================================================
# SLIDE 01: Title  (01/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_accent_line(slide, Inches(0.8), Inches(2.0), width=Inches(0.8), color=RED, thickness=Pt(6))
add_textbox(slide, Inches(0.8), Inches(0.6), Inches(10), Inches(0.5),
            "HOW I AI", font_size=16, color=RED, bold=True)
add_textbox(slide, Inches(0.8), Inches(2.3), Inches(10), Inches(1.2),
            "Edition 33", font_size=64, color=WHITE, bold=True)
add_textbox(slide, Inches(0.8), Inches(3.7), Inches(10), Inches(0.6),
            "Seoul Soul Project, Canggu  ·  25 November 2026",
            font_size=22, color=GREY_LIGHT)
add_accent_line(slide, Inches(0.8), Inches(4.5), width=Inches(11.7), color=GREY_MID, thickness=Pt(1))
add_textbox(slide, Inches(0.8), Inches(4.75), Inches(11.7), Inches(0.5),
            "Bali Start-ups & Tech Community", font_size=16, color=GREY)
add_red_card(slide, Inches(11.5), Inches(0.4), Inches(1.3), Inches(1.3))
add_textbox(slide, Inches(11.5), Inches(0.6), Inches(1.3), Inches(0.9),
            "33", font_size=48, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
add_footer(slide, 1)


# ============================================================
# SLIDE 02: About How I AI  (02/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "ABOUT TONIGHT")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
            "What Is How I AI?", font_size=48, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(11), Inches(0.8),
            "A weekly session for builders, operators and founders in Bali. "
            "Signal over noise. Practical takeaways. No keynote hype.",
            font_size=16, color=GREY_LIGHT)

format_items = [
    ("01", "Intel Drop", "Five AI signals from the last seven days. What happened, what it means for you."),
    ("02", "Jargon Buster", "Five terms from tonight's signals. Lock them in first."),
    ("03", "Builder Spotlights", "Community members showing what they shipped this week."),
    ("04", "Action of the Week", "One thing you can do before next Wednesday."),
]
flow_top = Inches(3.5)
flow_h = Inches(1.6)
step_w = Inches(2.95)
step_gap = Inches(0.1)
flow_start_x = Inches(0.6)
for i, (num, title, body) in enumerate(format_items):
    x = flow_start_x + (step_w + step_gap) * i
    add_card(slide, x, flow_top, step_w, flow_h)
    circle_size = Inches(0.6)
    add_circle(slide, x + Inches(0.3), flow_top + Inches(0.2), circle_size, fill_color=RED)
    add_textbox(slide, x + Inches(0.3), flow_top + Inches(0.28), circle_size, Inches(0.5),
                num, font_size=15, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(1.0), flow_top + Inches(0.28), step_w - Inches(1.1), Inches(0.45),
                title, font_size=18, color=WHITE, bold=True)
    add_textbox(slide, x + Inches(0.3), flow_top + Inches(0.95), step_w - Inches(0.5), Inches(0.6),
                body, font_size=11, color=GREY_LIGHT)
add_footer(slide, 2)


# ============================================================
# SLIDE 03: Intel Drop Intro  (03/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "INTEL DROP  ·  EDITION 33")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(1.2),
            "Agents in the Real World", font_size=56, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.5))
add_textbox(slide, Inches(0.8), Inches(2.8), Inches(11), Inches(0.8),
            "From code reviews to bank accounts, AI agents moved from demos into "
            "production this week, and the rules have not caught up.",
            font_size=18, color=GREY_LIGHT)

signals_preview = [
    ("01", "Anthropic IPO: $83, Record $81B Raise"),
    ("02", "Claude Ship: AI Agents Now Review and Approve Your PRs"),
    ("03", "Google Gemini 4 Neon at $3 per Million Tokens"),
    ("04", "OpenAI GPT-6.2 Astra: First High Self-Improvement Threshold Model"),
    ("05", "Banks: If Your AI Agent Gets Hacked, That Is on You"),
]
for i, (num, title) in enumerate(signals_preview):
    y = Inches(3.8) + Inches(0.56) * i
    add_textbox(slide, Inches(0.8), y, Inches(0.7), Inches(0.5),
                num, font_size=16, color=RED, bold=True)
    add_accent_line(slide, Inches(1.5), y + Inches(0.18),
                    width=Inches(0.3), color=RED, thickness=Pt(2))
    add_textbox(slide, Inches(1.9), y, Inches(10), Inches(0.5),
                title, font_size=16, color=WHITE)
    add_accent_line(slide, Inches(0.8), y + Inches(0.52),
                    width=Inches(11.7), color=GREY_MID, thickness=Pt(1))
add_footer(slide, 3)


# ============================================================
# SLIDE 04: Jargon Buster  (04/16)
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
    ("IPO",
     "When a private company sells shares to the public for the first time and lists on a stock exchange. Anthropic just did this on Nasdaq under ANT."),
    ("Self-Improvement Threshold",
     "OpenAI's internal safety rating for how well a model can improve its own code. 'High' means stricter access controls apply."),
    ("PR Steward",
     "An AI agent that handles failing CI checks, merge conflicts, and code review feedback without human review of each change."),
    ("Delegation chain",
     "The sequence of authorised actions one AI agent passes to another or to a service. Banks now hold customers liable for the whole chain."),
    ("Inference cost",
     "The price per token when a model runs. The metric that determines whether your AI feature is profitable at scale."),
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
add_footer(slide, 4)


# ============================================================
# SIGNAL 01: Anthropic IPO  (05/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 01")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(8), Inches(1.8),
            "Anthropic Goes\nPublic at $83", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.0))
add_textbox(slide, Inches(0.8), Inches(3.3), Inches(7.5), Inches(1.4),
            "Anthropic priced its Nasdaq IPO at $83 per share on November 18, above its "
            "$70 to $78 range, raising $81.3 billion and surpassing SpaceX's $75 billion record. "
            "Trading opened on November 19 under ticker ANT at a fully diluted valuation "
            "of around $1.5 trillion. The seven co-founders each sold around 3.4 million shares.",
            font_size=15, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(4.85), "18 NOVEMBER 2026  ·  TECHCRUNCH  ·  CNBC")

add_takeaway(slide, Inches(0.8), Inches(5.4), Inches(7.5),
             "The lab you have been building on is now a publicly traded company. Quarterly "
             "earnings calls, analyst pressure, and new incentives to monetise are all in play. "
             "Watch how roadmap priorities and pricing policy shift. Being early to a platform "
             "that just IPOed is leverage as long as you have exportable data and portable workflows.",
             height=Inches(1.55))

add_stat_cards(slide, [
    ("$1.5T", "Fully diluted valuation at IPO"),
    ("$81.3B", "Capital raised, largest IPO on record, surpassing SpaceX"),
    ("$83", "Final price per share, above the $70 to $78 range"),
])
add_footer(slide, 5)


# ============================================================
# SIGNAL 02: Claude Ship  (06/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 02")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(8), Inches(2.0),
            "Claude Ship:\nAI Agents Review\nand Approve PRs",
            font_size=38, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.3))
add_textbox(slide, Inches(0.8), Inches(3.6), Inches(7.5), Inches(1.3),
            "Anthropic launched Claude Ship on November 23, bundling three GitHub PR agents "
            "for Claude Team and Enterprise plans. Code Review (now GA) deploys parallel agents, "
            "verifies bugs, and ranks by severity. PR Steward (beta) fixes failing CI and merge "
            "conflicts. Claude Approvals (beta) can approve routine changes under team-defined policies.",
            font_size=14, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(5.05), "23 NOVEMBER 2026  ·  TECHCRUNCH")

add_takeaway(slide, Inches(0.8), Inches(5.55), Inches(7.5),
             "Automated code review is now a subscription line item. The agents run in parallel "
             "and filter false positives before they reach a human reviewer. For small teams this "
             "is leverage; for larger teams it is a workflow redesign. Risk: approval agents "
             "normalise skipping human eyes. Set a policy on what routine means before the agent decides.",
             height=Inches(1.4))

add_stat_cards(slide, [
    ("3 agents", "Code Review, PR Steward, Claude Approvals in bundle"),
    ("2x", "Self-reported doubling of merged PRs on Anthropic's own Claude Code team"),
    ("1 /ship", "New slash command to start the full workflow from Claude Code"),
])
add_footer(slide, 6)


# ============================================================
# SIGNAL 03: Google Gemini 4 Neon  (07/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 03")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(8), Inches(2.0),
            "Google Ships\nGemini 4 Neon:\nCarbon Quality,\nFlash Speed",
            font_size=36, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.3))
add_textbox(slide, Inches(0.8), Inches(3.6), Inches(7.5), Inches(1.3),
            "Google released Gemini 4 Neon on November 18, its mid-tier model between Hydrogen "
            "(everyday tasks) and Carbon (heavy reasoning). It is live through the API at "
            "$3 per million input tokens and $15 per million output, with a 1-million-token "
            "context window. Google benchmarked it against Claude Opus 5.5 and GPT-6.2 Sol.",
            font_size=14, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(5.05), "18 NOVEMBER 2026  ·  9TO5GOOGLE  ·  ARTIFICIAL ANALYSIS")

add_takeaway(slide, Inches(0.8), Inches(5.55), Inches(7.5),
             "Google has shipped four Gemini 4 models in roughly seven weeks. Each one "
             "undercuts the previous tier on price while claiming comparable quality. "
             "For builders pricing inference on mid-complexity workflows, Neon is worth "
             "a 30-minute benchmark run. The race to the bottom on inference costs is not done.",
             height=Inches(1.4))

add_stat_cards(slide, [
    ("$3 / M", "Input token price, in line with Kimi K3 and competitive with Sol"),
    ("1M tokens", "Context window, full codebase or document analysis in one pass"),
    ("4th model", "4th Gemini 4 release in roughly seven weeks"),
])
add_footer(slide, 7)


# ============================================================
# SIGNAL 04: OpenAI GPT-6.2 Astra + Sol  (08/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 04")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(8), Inches(2.0),
            "GPT-6.2 Astra:\nFirst High Self-\nImprovement Model",
            font_size=38, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.3))
add_textbox(slide, Inches(0.8), Inches(3.6), Inches(7.5), Inches(1.3),
            "OpenAI released GPT-6.2 Astra (frontier) and Sol (efficient) on November 17, "
            "shipping simultaneously to ChatGPT Work, Codex, and the API. Astra is the first "
            "externally deployed model to reach OpenAI's High Self-Improvement threshold, "
            "triggering tighter safeguards for cyber assistance. Independent tests rank Astra "
            "second behind Claude Fable 5.2 on some coding benchmarks.",
            font_size=14, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(5.05), "17 NOVEMBER 2026  ·  OPENAI  ·  DECRYPT")

add_takeaway(slide, Inches(0.8), Inches(5.55), Inches(7.5),
             "High Self-Improvement Threshold is new jargon worth knowing. It means the model "
             "passed internal checks for the risk it could meaningfully improve its own code. "
             "That is a capability milestone, not a threat, and comes with stricter access "
             "controls for security tasks. Sol at $2 per million input tokens gives a "
             "budget-priced OpenAI option for mid-tier workloads.",
             height=Inches(1.4))

add_stat_cards(slide, [
    ("$2 / M", "Sol input price, budget option for mid-tier workloads"),
    ("High", "First model at OpenAI's High Self-Improvement threshold"),
    ("$8 / M", "Astra input price, in line with Claude Fable 5.2"),
])
add_footer(slide, 8)


# ============================================================
# SIGNAL 05: Banks / AI Agent Liability  (09/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 05")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(8), Inches(2.0),
            "Banks: If Your AI\nAgent Gets Hacked,\nThat Is on You",
            font_size=38, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.3))
add_textbox(slide, Inches(0.8), Inches(3.6), Inches(7.5), Inches(1.3),
            "Citi, PNC and Citizens updated their terms on November 18 to hold customers "
            "responsible for transactions made by third-party AI agents, including losses "
            "from a hacked agent. JPMorgan and Bank of America adopted similar policies last "
            "month. Wells Fargo's updated agreement, effective November 24, treats every "
            "agent transaction as customer-authorised.",
            font_size=14, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(5.05), "18 NOVEMBER 2026  ·  TECHCRUNCH")

add_takeaway(slide, Inches(0.8), Inches(5.55), Inches(7.5),
             "If you are building an AI agent that touches any financial account, you are "
             "operating in a liability vacuum. The agent's actions are legally the user's "
             "actions, even if the agent was compromised. Disclose this clearly in your terms, "
             "require user review for transactions above a threshold, and treat financial-scope "
             "OAuth grants with the same care as production database access.",
             height=Inches(1.4))

add_stat_cards(slide, [
    ("5 banks", "Citi, PNC, Citizens, JPMorgan, Bank of America now shift liability to users"),
    ("$9.6T", "Combined assets covered by these updated AI agent liability policies"),
    ("49%", "Financial firms that have an AI incident response playbook"),
])
add_footer(slide, 9)


# ============================================================
# SLIDE 10: Action of the Week  (10/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "ACTION OF THE WEEK")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(10), Inches(1.0),
            "Define Your Routine PR Policy Before the Agent Does",
            font_size=36, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(9.5), Inches(1.0),
            "Claude Ship is live. If your team is on Claude Team or Enterprise, the approval "
            "agent can merge PRs without a human review. Set the policy before the defaults set it for you.",
            font_size=15, color=GREY_LIGHT)

add_red_card(slide, Inches(10.5), Inches(1.2), Inches(2.4), Inches(1.8))
add_multiline(slide, Inches(10.5), Inches(1.55), Inches(2.4), Inches(1.4), [
    {"text": "20", "size": 56, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "MINUTES", "size": 16, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER, "spacing_before": 2},
    {"text": "To set a policy today", "size": 10, "color": WHITE, "align": PP_ALIGN.CENTER, "spacing_before": 6},
])

steps = [
    ("01", "Define", "What is a routine PR for your team? Docs, deps, tests, translations?"),
    ("02", "List", "What can never be auto-approved? Auth, payments, schema changes, security?"),
    ("03", "Set limits", "In Claude Code admin: set a spend limit for Code Review and PR Steward"),
    ("04", "Start safe", "Run Claude Approvals in observe-only mode for two weeks before enabling"),
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
             "Claude Approvals can merge code without a human reviewing it. If you turn it on "
             "without a written policy, the default is: approve anything the agent considers "
             "low risk. That definition belongs to you, not the model. Write it down first.",
             height=Inches(1.25))
add_footer(slide, 10)


# ============================================================
# SLIDE 11: By Tier  (11/16)
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
        "heading": "Start with Claude Ship",
        "bullets": [
            "Sign up for a Claude Team trial",
            "Connect your GitHub and open a practice PR",
            "Run /ship and read what Code Review flags",
            "No production repo needed. Use a test project.",
        ],
        "goal": "Goal: see what AI code review actually catches",
    },
    {
        "label": "TIER 2, OPERATOR",
        "heading": "Set your PR policy",
        "bullets": [
            "List the PR types your team handles most: docs, deps, hotfixes, features",
            "Decide which ones a human must always review",
            "Write it down as a one-page policy before enabling Claude Approvals",
            "Check if your financial tools have updated terms on agent liability",
        ],
        "goal": "Goal: know what your agents can and cannot decide",
    },
    {
        "label": "TIER 3, BUILDER",
        "heading": "Reprice your inference stack",
        "bullets": [
            "Compare Gemini 4 Neon at $3/$15 and GPT-6.2 Sol at $2/$10 against current costs",
            "Run a 100-request benchmark on your most common task",
            "If your product touches financial accounts, update terms to clarify agent liability",
        ],
        "goal": "Goal: cut inference costs without cutting quality",
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
# SLIDES 12-14: Builder Spotlights  (12-14/16) -- PLACEHOLDERS
# ============================================================
for spotlight_num in range(1, 4):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_bg(slide)
    add_tag(slide, Inches(0.8), Inches(0.6), f"BUILDER SPOTLIGHT  {spotlight_num:02d}")
    add_textbox(slide, Inches(0.8), Inches(1.1), Inches(12), Inches(0.9),
                "What Did You Ship?", font_size=44, color=WHITE, bold=True)
    add_accent_line(slide, Inches(0.8), Inches(2.2))
    add_card(slide, Inches(0.8), Inches(2.5), Inches(11.7), Inches(4.5),
             border_color=RED, fill_color=GREY_DARK)
    add_textbox(slide, Inches(1.2), Inches(3.5), Inches(11), Inches(1.0),
                "[Builder name and company]",
                font_size=28, color=GREY_LIGHT, bold=True)
    add_textbox(slide, Inches(1.2), Inches(4.5), Inches(11), Inches(2.0),
                "[What they built, what it does, how long it took, what AI tools they used. "
                "Fill this in before Wednesday.]",
                font_size=18, color=GREY, italic=True)
    add_footer(slide, 11 + spotlight_num)


# ============================================================
# SLIDE 15: Community Wins  (15/16) -- PLACEHOLDER
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "COMMUNITY WINS")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(12), Inches(0.9),
            "Wins From The Room", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(12), Inches(0.8),
            "Three members shipped something since last edition. This is what the community "
            "looks like when it builds in public.",
            font_size=15, color=GREY_LIGHT)

wins = [
    {"name": "[Member 1 name]", "role": "[Founder, Company  /  Operator, Industry]",
     "shipped": "Tell me what you shipped before Wednesday and I will put it here. "
                "One line, one screenshot, that is all it takes.",
     "initial": "M1"},
    {"name": "[Member 2 name]", "role": "[Founder or operator title]",
     "shipped": "Tell me what you shipped before Wednesday and I will put it here. "
                "One line, one screenshot, that is all it takes.",
     "initial": "M2"},
    {"name": "[Member 3 name]", "role": "[Founder or operator title]",
     "shipped": "Tell me what you shipped before Wednesday and I will put it here. "
                "One line, one screenshot, that is all it takes.",
     "initial": "M3"},
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
add_footer(slide, 15)


# ============================================================
# SLIDE 16: Close  (16/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_accent_line(slide, Inches(0.8), Inches(2.5), width=Inches(0.8), color=RED, thickness=Pt(6))
add_textbox(slide, Inches(0.8), Inches(0.6), Inches(10), Inches(0.5),
            "HOW I AI", font_size=16, color=RED, bold=True)
add_textbox(slide, Inches(0.8), Inches(2.8), Inches(10), Inches(1.2),
            "See You at Edition 34", font_size=52, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(4.2), width=Inches(11.7), color=GREY_MID, thickness=Pt(1))
add_textbox(slide, Inches(0.8), Inches(4.5), Inches(11.7), Inches(0.6),
            "NEXT WEDNESDAY  ·  Edition 34  ·  2 December 2026  ·  Seoul Soul Project, Canggu",
            font_size=18, color=GREY_LIGHT)
add_textbox(slide, Inches(0.8), Inches(5.3), Inches(11.7), Inches(0.5),
            "If you shipped something with AI this week, tell me before Wednesday. "
            "It belongs on the Builder Spotlight.",
            font_size=14, color=GREY)
add_red_card(slide, Inches(11.5), Inches(0.4), Inches(1.3), Inches(1.3))
add_textbox(slide, Inches(11.5), Inches(0.6), Inches(1.3), Inches(0.9),
            "34", font_size=48, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
add_footer(slide, 16)


# ============================================================
# SAVE
# ============================================================
output_path = "/home/user/bstc-website/public/how-i-ai-edition-33.pptx"
prs.save(output_path)
print(f"Saved to {output_path}")
