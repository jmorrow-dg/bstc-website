#!/usr/bin/env python3
"""Generate How I AI Edition 1 PPTX deck with BSTC branding."""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# BSTC Brand colours
CHARCOAL = RGBColor(0x11, 0x11, 0x11)
WHITE = RGBColor(0xF5, 0xF5, 0xF5)
RED = RGBColor(0xC8, 0x1E, 0x1E)
RED_DARK = RGBColor(0x8B, 0x1A, 0x1A)
GREY = RGBColor(0x88, 0x88, 0x88)
GREY_DARK = RGBColor(0x33, 0x33, 0x33)
GREY_BORDER = RGBColor(0x22, 0x22, 0x22)

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)


def add_bg(slide):
    """Set slide background to charcoal."""
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = CHARCOAL


def add_textbox(slide, left, top, width, height, text, font_size=18,
                color=WHITE, bold=False, italic=False, alignment=PP_ALIGN.LEFT,
                font_name="Arial"):
    """Add a simple textbox."""
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.color.rgb = color
    p.font.bold = bold
    p.font.italic = italic
    p.font.name = font_name
    p.alignment = alignment
    return txBox


def add_multiline(slide, left, top, width, height, lines, default_size=18,
                  default_color=WHITE, line_spacing=1.5):
    """Add textbox with multiple formatted paragraphs.
    lines: list of dicts with keys: text, size, color, bold, italic, spacing_before
    """
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    for i, line in enumerate(lines):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.text = line.get("text", "")
        p.font.size = Pt(line.get("size", default_size))
        p.font.color.rgb = line.get("color", default_color)
        p.font.bold = line.get("bold", False)
        p.font.italic = line.get("italic", False)
        p.font.name = line.get("font", "Arial")
        p.alignment = line.get("align", PP_ALIGN.LEFT)
        if line.get("spacing_before"):
            p.space_before = Pt(line["spacing_before"])
    return txBox


def add_tag(slide, left, top, text):
    """Add a red uppercase tag label."""
    add_textbox(slide, left, top, Inches(6), Inches(0.4), text,
                font_size=13, color=RED, bold=True)


def add_slide_number(slide, num, total=15):
    """Add slide number bottom-right."""
    add_textbox(slide, Inches(11.5), Inches(7.0), Inches(1.5), Inches(0.3),
                f"{num:02d} / {total}", font_size=12, color=GREY,
                alignment=PP_ALIGN.RIGHT)


def add_watermark(slide):
    """Add BSTC watermark bottom-left."""
    add_textbox(slide, Inches(0.5), Inches(7.0), Inches(1.5), Inches(0.3),
                "BSTC", font_size=11, color=GREY_DARK, bold=True)


def add_accent_line(slide, left, top, width=Inches(0.8)):
    """Add a red accent line."""
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, Pt(4))
    shape.fill.solid()
    shape.fill.fore_color.rgb = RED
    shape.line.fill.background()
    return shape


def add_card(slide, left, top, width, height, border_color=GREY_BORDER):
    """Add a dark card rectangle."""
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = GREY_DARK
    shape.line.color.rgb = border_color
    shape.line.width = Pt(1)
    return shape


def add_red_card(slide, left, top, width, height):
    """Add a red gradient-style card."""
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = RED
    shape.line.fill.background()
    return shape


def add_footer(slide, num):
    add_watermark(slide)
    add_slide_number(slide, num)


def add_signal_takeaway(slide, left, top, width, text):
    """Add a 'What this means for you' card with red left border."""
    card = add_card(slide, left, top, width, Inches(1.0))
    # Red left border accent
    border = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, Pt(4), Inches(1.0))
    border.fill.solid()
    border.fill.fore_color.rgb = RED
    border.line.fill.background()
    add_multiline(slide, left + Inches(0.2), top + Inches(0.1), width - Inches(0.3), Inches(0.9), [
        {"text": "What this means for you:", "size": 14, "color": WHITE, "bold": True},
        {"text": text, "size": 13, "color": GREY, "spacing_before": 6},
    ])


# ============================================================
# SLIDE 1: Title
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(1.5), "BALI START-UPS & TECH COMMUNITY PRESENTS")
add_textbox(slide, Inches(0.8), Inches(2.2), Inches(10), Inches(1.5),
            "How I AI", font_size=72, color=WHITE, bold=True, font_name="Arial")
add_multiline(slide, Inches(0.8), Inches(3.8), Inches(6), Inches(1.2), [
    {"text": "Edition 1", "size": 32, "color": WHITE, "bold": True},
    {"text": "Seoul Soul Project, Canggu \u2014 15 April 2026", "size": 20, "color": GREY, "spacing_before": 8},
])
add_textbox(slide, Inches(0.8), Inches(5.5), Inches(8), Inches(0.4),
            "Builders show tools. Operators share workflows. Everyone leaves sharper.",
            font_size=15, color=GREY)
add_footer(slide, 1)

# ============================================================
# SLIDE 2: My Background
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.8), "MY BACKGROUND")

# Column 1: Josh Morrow
add_textbox(slide, Inches(0.8), Inches(1.8), Inches(3.5), Inches(0.6),
            "Josh Morrow", font_size=28, color=WHITE, bold=True)
add_multiline(slide, Inches(0.8), Inches(2.6), Inches(3.5), Inches(3.0), [
    {"text": "\u2022  5+ years in B2B technology", "size": 16, "color": GREY},
    {"text": "\u2022  Oxford/MIT AI Programmes / Legal Background", "size": 16, "color": GREY, "spacing_before": 10},
    {"text": "\u2022  Co-Founder of Bali Start-Up & Tech (3k+ folks on Meetup/WA)", "size": 16, "color": GREY, "spacing_before": 10},
])

# Column 2: David & Goliath
add_textbox(slide, Inches(5.0), Inches(1.8), Inches(3.5), Inches(0.6),
            "David & Goliath", font_size=28, color=WHITE, bold=True)
add_multiline(slide, Inches(5.0), Inches(2.6), Inches(3.5), Inches(3.0), [
    {"text": "\u2022  AI systems firm for ambitious teams", "size": 16, "color": GREY},
    {"text": "\u2022  Australia founded and globally minded", "size": 16, "color": GREY, "spacing_before": 10},
    {"text": "\u2022  We build operating AI infrastructure across revenue, capacity & AI security", "size": 16, "color": GREY, "spacing_before": 10},
])

# Column 3: Oligo Security
add_textbox(slide, Inches(9.2), Inches(1.8), Inches(3.5), Inches(0.6),
            "Oligo Security", font_size=28, color=WHITE, bold=True)
add_multiline(slide, Inches(9.2), Inches(2.6), Inches(3.5), Inches(3.0), [
    {"text": "\u2022  Selected as runtime AI security vendor in AWS Security Hub", "size": 16, "color": GREY},
    {"text": "\u2022  Working with security leaders at APAC's largest companies", "size": 16, "color": GREY, "spacing_before": 10},
])

add_footer(slide, 2)

# ============================================================
# SLIDE 3: Money Round
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(1.2), "6:30 PM")
add_textbox(slide, Inches(0.8), Inches(2.0), Inches(10), Inches(1.0),
            "Money Round", font_size=64, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.2))
add_textbox(slide, Inches(0.8), Inches(3.5), Inches(8), Inches(0.5),
            "60-second intros", font_size=28, color=WHITE, bold=True)
add_textbox(slide, Inches(0.8), Inches(4.2), Inches(10), Inches(0.8),
            "One way AI made you money, saved you money,\nor saved you serious time. No pitches. Just results.",
            font_size=20, color=GREY)

# Stats
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
# SLIDE 4: AI Intel Drop Intro
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(1.2), "7:00 PM \u2014 AI INTEL DROP")
add_textbox(slide, Inches(0.8), Inches(2.2), Inches(10), Inches(1.0),
            "This Week in AI", font_size=54, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.4))
add_textbox(slide, Inches(0.8), Inches(3.8), Inches(8), Inches(0.8),
            "The 5 signals that matter most from the last 7 days.\nWhat happened, and what it means for you.",
            font_size=20, color=GREY)

# Pipeline visual
for i, (label, x) in enumerate([("50+ Sources", 1.5), ("Signal Scoring", 5.0), ("Top 5 Tonight", 8.5)]):
    add_card(slide, Inches(x), Inches(5.2), Inches(2.5), Inches(0.7))
    add_textbox(slide, Inches(x), Inches(5.3), Inches(2.5), Inches(0.5),
                label, font_size=14, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    if i < 2:
        add_textbox(slide, Inches(x + 2.7), Inches(5.25), Inches(0.5), Inches(0.5),
                    "\u2192", font_size=28, color=RED, alignment=PP_ALIGN.CENTER)

add_footer(slide, 4)

# ============================================================
# SLIDE 5: Signal 1 — Stanford AI Index
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.8), "SIGNAL 01")
add_textbox(slide, Inches(0.8), Inches(1.5), Inches(6), Inches(0.8),
            "Stanford AI Index 2026", font_size=42, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.5))
add_textbox(slide, Inches(0.8), Inches(2.9), Inches(5.5), Inches(1.0),
            "AI agent task success rate jumped from 20% to 77% in 12 months. GenAI hit 53% population adoption in 3 years.",
            font_size=18, color=GREY)
add_signal_takeaway(slide, Inches(0.8), Inches(4.3), Inches(5.5),
                    "If you tried AI agents 6 months ago and they felt unreliable, try again. The reliability gap just closed. The early-mover window is shrinking.")

# Right side: visual comparison
add_card(slide, Inches(8.0), Inches(2.0), Inches(1.8), Inches(1.8))
add_multiline(slide, Inches(8.0), Inches(2.3), Inches(1.8), Inches(1.2), [
    {"text": "20%", "size": 32, "color": GREY, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "2025", "size": 13, "color": GREY, "align": PP_ALIGN.CENTER, "spacing_before": 8},
])

add_textbox(slide, Inches(10.0), Inches(2.8), Inches(0.6), Inches(0.5),
            "\u2192", font_size=32, color=RED, alignment=PP_ALIGN.CENTER)

add_red_card(slide, Inches(10.8), Inches(1.6), Inches(2.0), Inches(2.4))
add_multiline(slide, Inches(10.8), Inches(2.0), Inches(2.0), Inches(1.5), [
    {"text": "77%", "size": 48, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "2026", "size": 13, "color": WHITE, "align": PP_ALIGN.CENTER, "spacing_before": 8},
])

add_footer(slide, 5)

# ============================================================
# SLIDE 6: Signal 2 — Project Glasswing
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.8), "SIGNAL 02")
add_textbox(slide, Inches(0.8), Inches(1.5), Inches(7), Inches(1.0),
            "Anthropic's Model Too\nDangerous to Release", font_size=42, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.0))
add_textbox(slide, Inches(0.8), Inches(3.4), Inches(6), Inches(0.8),
            "Project Glasswing: first frontier model deliberately withheld from public release due to offensive security capability.",
            font_size=18, color=GREY)
add_signal_takeaway(slide, Inches(0.8), Inches(4.6), Inches(6),
                    "Security hygiene is no longer optional. Patch management is existential. The defender window is open but finite.")

# Stats cards
add_card(slide, Inches(8.5), Inches(2.0), Inches(4.0), Inches(1.4))
add_multiline(slide, Inches(8.5), Inches(2.2), Inches(4.0), Inches(1.0), [
    {"text": "83%", "size": 40, "color": RED, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "First-attempt exploit success", "size": 13, "color": GREY, "align": PP_ALIGN.CENTER, "spacing_before": 4},
])
add_card(slide, Inches(8.5), Inches(3.8), Inches(4.0), Inches(1.4))
add_multiline(slide, Inches(8.5), Inches(4.0), Inches(4.0), Inches(1.0), [
    {"text": "10,000+", "size": 40, "color": RED, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "Zero-days found autonomously", "size": 13, "color": GREY, "align": PP_ALIGN.CENTER, "spacing_before": 4},
])

add_footer(slide, 6)

# ============================================================
# SLIDE 7: And Just This Week — Glasswing Deep Dive
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "LATEST DEVELOPMENTS")
add_textbox(slide, Inches(0.8), Inches(1.2), Inches(11), Inches(0.9),
            "And just this week...", font_size=56, color=WHITE, bold=True,
            font_name="Arial")

# Left: Tweet recreation
add_card(slide, Inches(0.8), Inches(2.5), Inches(4.5), Inches(4.2), border_color=GREY_BORDER)
add_multiline(slide, Inches(1.1), Inches(2.7), Inches(4.0), Inches(0.5), [
    {"text": "Anthropic \u2714  @AnthropicAI", "size": 14, "color": WHITE, "bold": True},
])
add_multiline(slide, Inches(1.1), Inches(3.2), Inches(4.0), Inches(1.5), [
    {"text": "Introducing Project Glasswing: an urgent initiative to help secure the world's most critical software.", "size": 14, "color": WHITE},
    {"text": "", "size": 8, "color": WHITE},
    {"text": "It's powered by our newest frontier model, Claude Mythos Preview, which can find software vulnerabilities better than all but the most skilled humans.", "size": 14, "color": WHITE},
])
add_card(slide, Inches(1.1), Inches(4.8), Inches(3.8), Inches(1.0), border_color=GREY_BORDER)
add_multiline(slide, Inches(1.3), Inches(4.9), Inches(3.4), Inches(0.8), [
    {"text": "Project Glasswing", "size": 20, "color": WHITE, "bold": True},
    {"text": "Securing critical software for the AI era", "size": 11, "color": GREY},
])
add_textbox(slide, Inches(1.1), Inches(6.0), Inches(3.8), Inches(0.3),
            "2:06 AM \u00b7 Apr 8, 2026 \u00b7 14.4M Views", font_size=11, color=GREY)
add_textbox(slide, Inches(1.1), Inches(6.3), Inches(3.8), Inches(0.3),
            "1.2K replies    7K reposts    28K likes", font_size=12, color=GREY)

# Right: Bullet points
bullets = [
    'Anthropic sandboxed its new model "Mythos" and told it to escape, it chained vulnerabilities, broke containment and got out',
    'Mythos has uncovered "thousands" of zero-days across every major OS and browser',
    "Anthropic is refusing public release and launching Glasswing, a defensive-only coalition with Apple, Google, Nvidia etc",
]
for i, bullet in enumerate(bullets):
    y = Inches(2.8) + Inches(i * 1.3)
    add_textbox(slide, Inches(5.8), y, Inches(0.3), Inches(0.3),
                "\u2022", font_size=24, color=RED)
    add_textbox(slide, Inches(6.2), y, Inches(6.5), Inches(1.0),
                bullet, font_size=18, color=WHITE)

add_textbox(slide, Inches(0.8), Inches(6.8), Inches(12), Inches(0.4),
            "Anthropic's new model broke out of its sandbox", font_size=17,
            color=RED, bold=True, alignment=PP_ALIGN.CENTER)

add_footer(slide, 7)

# ============================================================
# SLIDE 8: Signal 3 — DeepSeek V4
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.8), "SIGNAL 03")
add_textbox(slide, Inches(0.8), Inches(1.5), Inches(5.5), Inches(0.8),
            "DeepSeek V4", font_size=42, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.5))
add_textbox(slide, Inches(0.8), Inches(2.9), Inches(5.5), Inches(0.8),
            "Near-frontier performance. Fraction of the cost. One trillion parameters trained for $5.2M.",
            font_size=18, color=GREY)
add_signal_takeaway(slide, Inches(0.8), Inches(4.2), Inches(5.5),
                    "Your AI cost assumptions from 6 months ago are stale. Frontier capability is getting dramatically cheaper. Barriers to entry are collapsing.")

# Cost comparison card
add_card(slide, Inches(7.5), Inches(1.8), Inches(5.0), Inches(2.5))
add_textbox(slide, Inches(7.5), Inches(2.0), Inches(5.0), Inches(0.3),
            "COST PER MILLION TOKENS", font_size=12, color=GREY,
            bold=True, alignment=PP_ALIGN.CENTER)
add_textbox(slide, Inches(7.8), Inches(2.6), Inches(2.0), Inches(0.8),
            "$2.00+", font_size=32, color=GREY, bold=True, alignment=PP_ALIGN.CENTER)
add_textbox(slide, Inches(7.8), Inches(3.3), Inches(2.0), Inches(0.3),
            "Western Models", font_size=12, color=GREY, alignment=PP_ALIGN.CENTER)
add_textbox(slide, Inches(9.8), Inches(2.8), Inches(0.5), Inches(0.5),
            "\u2192", font_size=28, color=RED, alignment=PP_ALIGN.CENTER)
add_textbox(slide, Inches(10.3), Inches(2.5), Inches(2.0), Inches(0.8),
            "$0.28", font_size=40, color=RED, bold=True, alignment=PP_ALIGN.CENTER)
add_textbox(slide, Inches(10.3), Inches(3.3), Inches(2.0), Inches(0.3),
            "DeepSeek V4", font_size=12, color=GREY, alignment=PP_ALIGN.CENTER)

# 1T card
add_card(slide, Inches(7.5), Inches(4.8), Inches(5.0), Inches(1.2))
add_multiline(slide, Inches(7.5), Inches(4.9), Inches(5.0), Inches(1.0), [
    {"text": "1T", "size": 44, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "Parameters (Mixture-of-Experts)", "size": 13, "color": GREY, "align": PP_ALIGN.CENTER},
])

add_footer(slide, 8)

# ============================================================
# SLIDE 9: Signal 4 — Google AI Mode
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.8), "SIGNAL 04")
add_textbox(slide, Inches(0.8), Inches(1.5), Inches(7), Inches(1.0),
            "Google AI Mode Is\nEating Your Traffic", font_size=42, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.0))
add_textbox(slide, Inches(0.8), Inches(3.4), Inches(6), Inches(0.8),
            "Google now answers questions directly with AI. Users get what they need without clicking through to your site.",
            font_size=18, color=GREY)
add_signal_takeaway(slide, Inches(0.8), Inches(4.6), Inches(6),
                    "The game changed from ranking on page one to being cited in the AI answer. SEO is becoming AEO (Answer Engine Optimisation).")

# SEO -> AEO visual
add_card(slide, Inches(8.5), Inches(2.2), Inches(3.5), Inches(1.2))
add_multiline(slide, Inches(8.5), Inches(2.4), Inches(3.5), Inches(0.8), [
    {"text": "SEO", "size": 24, "color": GREY, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "Search Engine Optimisation", "size": 12, "color": GREY, "align": PP_ALIGN.CENTER},
])

add_textbox(slide, Inches(9.8), Inches(3.6), Inches(1.0), Inches(0.5),
            "\u2193", font_size=32, color=RED, alignment=PP_ALIGN.CENTER)

add_card(slide, Inches(8.5), Inches(4.3), Inches(3.5), Inches(1.3), border_color=RED)
add_multiline(slide, Inches(8.5), Inches(4.5), Inches(3.5), Inches(0.8), [
    {"text": "AEO", "size": 28, "color": RED, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "Answer Engine Optimisation", "size": 12, "color": GREY, "align": PP_ALIGN.CENTER},
])

add_footer(slide, 9)

# ============================================================
# SLIDE 10: Signal 5 — Shopify AI Toolkit
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.8), "SIGNAL 05")
add_textbox(slide, Inches(0.8), Inches(1.5), Inches(7), Inches(1.0),
            "Shopify Ships\nAgent-Native Commerce", font_size=42, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.0))
add_textbox(slide, Inches(0.8), Inches(3.4), Inches(6), Inches(0.8),
            "First major SaaS platform to ship infrastructure where AI agents manage your store directly. Not a chatbot overlay. Real agent infrastructure.",
            font_size=18, color=GREY)
add_signal_takeaway(slide, Inches(0.8), Inches(4.6), Inches(6),
                    "One operator can now do what required a team. Every SaaS platform will follow Shopify's lead. Watch for agent toolkits from your vendors.")

# Supported tools
tools = ["Claude Code", "OpenAI Codex", "Cursor", "Gemini CLI"]
for i, tool in enumerate(tools):
    y = Inches(2.2) + Inches(i * 0.9)
    add_card(slide, Inches(8.5), y, Inches(3.5), Inches(0.7))
    add_textbox(slide, Inches(8.7), y + Inches(0.1), Inches(0.3), Inches(0.4),
                "\u25b6", font_size=14, color=RED)
    add_textbox(slide, Inches(9.1), y + Inches(0.1), Inches(2.8), Inches(0.4),
                tool, font_size=16, color=WHITE, bold=True)

add_textbox(slide, Inches(8.5), Inches(5.9), Inches(3.5), Inches(0.3),
            "Via MCP Server Architecture", font_size=11, color=GREY, alignment=PP_ALIGN.CENTER)

add_footer(slide, 10)

# ============================================================
# SLIDE 11: Getting Started — 3 Tiers
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.8), "HOW TO GET STARTED")
add_textbox(slide, Inches(0.8), Inches(1.4), Inches(10), Inches(0.8),
            "Pick Your Level", font_size=48, color=WHITE, bold=True)

tiers = [
    {
        "label": "TIER 1: EXPLORER",
        "title": "Never Used AI Seriously",
        "items": [
            "Pick one daily task (email, research, writing)",
            "Use free tier: ChatGPT, Claude, or Gemini",
            "Commit to 2 weeks straight",
            "Goal: build the muscle",
        ],
        "highlight": False,
    },
    {
        "label": "TIER 2: OPERATOR",
        "title": "Using AI, Not Systematically",
        "items": [
            "Build a personal AI stack",
            "Claude for deep work, ChatGPT for quick answers, Perplexity for research",
            "Start saving your best prompts",
            "Your prompts are your IP",
        ],
        "highlight": True,
    },
    {
        "label": "TIER 3: BUILDER",
        "title": "Ready to Build",
        "items": [
            "Agent frameworks: Claude Code, Cursor, MCP",
            "77% success rate = production ready",
            "Start with internal ops, not customer-facing",
            "Build confidence, then scale",
        ],
        "highlight": False,
    },
]

for i, tier in enumerate(tiers):
    x = Inches(0.8) + Inches(i * 4.1)
    border = RED if tier["highlight"] else GREY_BORDER
    add_card(slide, x, Inches(2.6), Inches(3.8), Inches(4.2), border_color=border)
    add_textbox(slide, x + Inches(0.3), Inches(2.9), Inches(3.2), Inches(0.3),
                tier["label"], font_size=12, color=RED, bold=True)
    add_textbox(slide, x + Inches(0.3), Inches(3.4), Inches(3.2), Inches(0.4),
                tier["title"], font_size=18, color=WHITE, bold=True)
    items_text = "\n".join(f"\u2022  {item}" for item in tier["items"])
    add_textbox(slide, x + Inches(0.3), Inches(4.1), Inches(3.2), Inches(2.5),
                items_text, font_size=14, color=GREY)

add_footer(slide, 11)

# ============================================================
# SLIDE 12: Token Optimisation Setup
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_textbox(slide, Inches(0.8), Inches(0.6), Inches(10), Inches(0.8),
            "Token optimisation setup", font_size=44, color=WHITE, bold=True)
add_textbox(slide, Inches(8.5), Inches(0.75), Inches(3), Inches(0.4),
            "(take a photo)", font_size=20, color=GREY)

# Left column
add_textbox(slide, Inches(0.8), Inches(1.6), Inches(6), Inches(0.3),
            "The prompt that sets Sonnet default and Opus for complex tasks:",
            font_size=15, color=RED, italic=True)
add_textbox(slide, Inches(0.8), Inches(2.1), Inches(6), Inches(0.4),
            "90% intelligence at 20% cost", font_size=22, color=RED, bold=True)

add_textbox(slide, Inches(0.8), Inches(2.8), Inches(5.5), Inches(0.8),
            "Run your daily Claude Code session with Sonnet as the default executor: claude --model claude-sonnet-4-6\n\nThen in your project's CLAUDE.md, add:",
            font_size=15, color=WHITE)

# Code block
add_card(slide, Inches(0.8), Inches(4.2), Inches(5.8), Inches(2.8))
add_textbox(slide, Inches(1.0), Inches(4.4), Inches(5.4), Inches(2.4),
            '"When facing architectural decisions, ambiguous requirements, multi-file refactors, or complex debugging, use the Agent tool with model: "opus" to reason through the approach before executing. For all other tasks (file reads, edits, grep, tests, single-file changes), handle them directly without escalating. The Opus advisor reads the same shared context, so there is no loss of continuity."',
            font_size=13, color=GREY, font_name="Courier New")

# Right column: Claude tweet recreation
add_card(slide, Inches(7.2), Inches(1.6), Inches(5.3), Inches(2.2))
add_multiline(slide, Inches(7.5), Inches(1.8), Inches(4.8), Inches(0.4), [
    {"text": "Claude \u2714  @claudeai", "size": 14, "color": WHITE, "bold": True},
])
add_multiline(slide, Inches(7.5), Inches(2.3), Inches(4.8), Inches(1.2), [
    {"text": "We're bringing the advisor strategy to the Claude Platform.", "size": 14, "color": WHITE, "bold": True},
    {"text": "", "size": 6},
    {"text": "Pair Opus as an advisor with Sonnet or Haiku as an executor, and get near Opus-level intelligence in your agents at a fraction of the cost.", "size": 14, "color": GREY},
])

# Advisor strategy diagram
add_card(slide, Inches(7.2), Inches(4.2), Inches(5.3), Inches(2.8))
add_textbox(slide, Inches(7.2), Inches(4.4), Inches(5.3), Inches(0.3),
            "THE ADVISOR STRATEGY", font_size=12, color=GREY,
            bold=True, alignment=PP_ALIGN.CENTER)

# Executor box
add_red_card(slide, Inches(7.8), Inches(5.0), Inches(2.0), Inches(1.0))
add_multiline(slide, Inches(7.8), Inches(5.1), Inches(2.0), Inches(0.8), [
    {"text": "Executor", "size": 15, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "Sonnet", "size": 12, "color": WHITE, "align": PP_ALIGN.CENTER},
])
add_textbox(slide, Inches(7.8), Inches(6.1), Inches(2.0), Inches(0.3),
            "Runs every turn", font_size=11, color=GREY, alignment=PP_ALIGN.CENTER)

# Arrow
add_textbox(slide, Inches(10.0), Inches(5.2), Inches(0.6), Inches(0.5),
            "\u21c4", font_size=24, color=RED, alignment=PP_ALIGN.CENTER)

# Advisor box
add_red_card(slide, Inches(10.7), Inches(5.0), Inches(2.0), Inches(1.0))
add_multiline(slide, Inches(10.7), Inches(5.1), Inches(2.0), Inches(0.8), [
    {"text": "Advisor", "size": 15, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "Opus", "size": 12, "color": WHITE, "align": PP_ALIGN.CENTER},
])
add_textbox(slide, Inches(10.7), Inches(6.1), Inches(2.0), Inches(0.3),
            "On demand", font_size=11, color=GREY, alignment=PP_ALIGN.CENTER)

add_textbox(slide, Inches(7.2), Inches(6.6), Inches(5.3), Inches(0.3),
            "Shared context \u2014 no loss of continuity", font_size=12,
            color=GREY, alignment=PP_ALIGN.CENTER)

add_footer(slide, 12)

# ============================================================
# SLIDE 13: Dinner Break
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(4.5), Inches(2.0), "7:15 PM")
add_textbox(slide, Inches(1.5), Inches(2.8), Inches(10), Inches(1.0),
            "Dinner & Drinks", font_size=64, color=WHITE, bold=True,
            alignment=PP_ALIGN.CENTER)
add_accent_line(slide, Inches(6.2), Inches(4.0))
add_textbox(slide, Inches(2), Inches(4.5), Inches(9), Inches(0.5),
            "Order up. Best conversations happen over food.",
            font_size=22, color=GREY, alignment=PP_ALIGN.CENTER)
add_textbox(slide, Inches(2), Inches(5.2), Inches(9), Inches(0.4),
            "Builder Spotlights start at 7:30 sharp.",
            font_size=17, color=GREY, alignment=PP_ALIGN.CENTER)
add_footer(slide, 13)

# ============================================================
# SLIDE 14: Builder Spotlights
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(4.5), Inches(1.5), "7:30 PM")
add_textbox(slide, Inches(1.5), Inches(2.2), Inches(10), Inches(1.0),
            "Builder Spotlights", font_size=64, color=WHITE, bold=True,
            alignment=PP_ALIGN.CENTER)
add_accent_line(slide, Inches(6.2), Inches(3.5))

# Two builder cards
for i, x in enumerate([Inches(3.0), Inches(7.5)]):
    add_card(slide, x, Inches(4.2), Inches(3.2), Inches(2.2))
    add_multiline(slide, x, Inches(4.4), Inches(3.2), Inches(1.8), [
        {"text": f"0{i+1}", "size": 44, "color": RED, "bold": True, "align": PP_ALIGN.CENTER},
        {"text": "10 min + 5 min Q&A", "size": 16, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER, "spacing_before": 8},
        {"text": "What you built. How you built it.\nWhat it does for your business.", "size": 13, "color": GREY, "align": PP_ALIGN.CENTER, "spacing_before": 6},
    ])

add_footer(slide, 14)

# ============================================================
# SLIDE 15: Close / Socials / Next Week
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(3.5), Inches(0.8), "THANK YOU")
add_textbox(slide, Inches(1.5), Inches(1.5), Inches(10), Inches(1.2),
            "See You at\nEdition 2", font_size=56, color=WHITE, bold=True,
            alignment=PP_ALIGN.CENTER)
add_accent_line(slide, Inches(6.2), Inches(3.0))

# Social cards
platforms = ["YOUTUBE", "INSTAGRAM", "TIKTOK"]
for i, platform in enumerate(platforms):
    x = Inches(2.5) + Inches(i * 3.0)
    add_card(slide, x, Inches(3.5), Inches(2.5), Inches(1.2))
    add_multiline(slide, x, Inches(3.6), Inches(2.5), Inches(1.0), [
        {"text": platform, "size": 12, "color": GREY, "bold": True, "align": PP_ALIGN.CENTER},
        {"text": "@joshbuildswithai", "size": 17, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER, "spacing_before": 8},
    ])

# Next week preview card
add_card(slide, Inches(2.5), Inches(5.2), Inches(8.0), Inches(1.8), border_color=RED)
add_multiline(slide, Inches(2.5), Inches(5.4), Inches(8.0), Inches(1.4), [
    {"text": "NEXT WEEK \u2014 EDITION 2", "size": 12, "color": RED, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "Paperclip & Hermes Workflows", "size": 26, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER, "spacing_before": 8},
    {"text": "Turning conversations into revenue. Automating outreach at scale.", "size": 15, "color": GREY, "align": PP_ALIGN.CENTER, "spacing_before": 6},
])

add_footer(slide, 15)


# ============================================================
# SAVE
# ============================================================
output_path = "/Users/joshmorrowdavidgoliath/bstc-website/public/how-i-ai-edition-1.pptx"
prs.save(output_path)
print(f"Saved to {output_path}")
