#!/usr/bin/env python3
"""Generate How I AI Edition 31 PPTX.

Style mirrors Edition 3: charcoal background, red accent, white display text,
muted grey body. No em dashes or en dashes. Australian English.
Generated: 11 November 2026.

16-slide structure:
  01. Title
  02. Intel Drop intro
  03. Signal 01, Meta Acquires Conductor
  04. Signal 02, CrowdStrike AI Kill Switch
  05. Signal 03, OpenAI Images 2.6
  06. Signal 04, Claude Code MCP Security Patch
  07. Signal 05, Anthropic IPO and Spending Stall
  08. Jargon Buster
  09. Builder Spotlight A (placeholder)
  10. Builder Spotlight B (placeholder)
  11. Action of the Week
  12. By Tier
  13. Community Win 1 (placeholder)
  14. Community Win 2 (placeholder)
  15. Community Win 3 (placeholder)
  16. Close
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


def add_stat_cards(slide, stats, right_x=Inches(8.6), card_w=Inches(4.3), card_h=Inches(1.5)):
    """Three right-rail stat cards."""
    for i, (headline, caption) in enumerate(stats):
        y = Inches(1.3) + (card_h + Inches(0.2)) * i
        add_card(slide, right_x, y, card_w, card_h)
        add_multiline(slide, right_x + Inches(0.2), y + Inches(0.2),
                      card_w - Inches(0.4), card_h - Inches(0.3), [
            {"text": headline, "size": 26, "color": RED, "bold": True, "align": PP_ALIGN.LEFT},
            {"text": caption, "size": 12, "color": GREY_LIGHT, "spacing_before": 6},
        ])


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


# ============================================================
# SLIDE 01: Title
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_accent_line(slide, Inches(0), Inches(5.0), width=Inches(13.333), color=RED, thickness=Pt(6))
add_textbox(slide, Inches(0.8), Inches(0.8), Inches(12), Inches(0.6),
            "HOW I AI", font_size=20, color=RED, bold=True)
add_textbox(slide, Inches(0.8), Inches(1.6), Inches(10), Inches(2.0),
            "Edition 31", font_size=72, color=WHITE, bold=True)
add_textbox(slide, Inches(0.8), Inches(3.8), Inches(10), Inches(0.6),
            "Seoul Soul Project, Canggu  .  11 November 2026",
            font_size=22, color=GREY_LIGHT)
add_textbox(slide, Inches(0.8), Inches(4.5), Inches(10), Inches(0.5),
            "6:30pm WITA", font_size=16, color=GREY)
add_textbox(slide, Inches(0.8), Inches(5.5), Inches(11.9), Inches(0.4),
            "Bali Start-ups and Tech Community", font_size=14, color=GREY, italic=True)
add_footer(slide, 1)


# ============================================================
# SLIDE 02: Intel Drop Intro
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "INTEL DROP")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
            "5 Signals This Week", font_size=48, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(11), Inches(0.6),
            "Agents go mainstream: acquisitions, shutdowns, and the security bill arriving.",
            font_size=18, color=GREY_LIGHT)

intel_signals = [
    ("01", "Meta buys Conductor", "Multi-agent coding goes mainstream"),
    ("02", "CrowdStrike AI Kill Switch", "Agent security becomes an enterprise product"),
    ("03", "OpenAI Images 2.6", "Native GIFs and SVGs, 50 percent faster"),
    ("04", "Claude Code patches MCP OAuth leak", "Security in developer tooling is real"),
    ("05", "Anthropic nears IPO as spending stalls", "The subsidy era is compressing"),
]
for i, (num, title, sub) in enumerate(intel_signals):
    y = Inches(3.2) + Inches(0.68) * i
    add_textbox(slide, Inches(0.8), y, Inches(0.7), Inches(0.55),
                num, font_size=18, color=RED, bold=True)
    add_textbox(slide, Inches(1.6), y, Inches(5.2), Inches(0.55),
                title, font_size=16, color=WHITE, bold=True)
    add_textbox(slide, Inches(7.1), y, Inches(5.5), Inches(0.55),
                sub, font_size=14, color=GREY)
add_footer(slide, 2)


# ============================================================
# SIGNAL 01: Meta Buys Conductor  (03/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 01")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(7.5), Inches(1.4),
            "Meta Buys\nConductor", font_size=46, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.75))
add_textbox(slide, Inches(0.8), Inches(3.0), Inches(7.5), Inches(1.5),
            "Meta acquired AI coding startup Conductor on 4 November, confirming that "
            "parallel-agent workflows are now a strategic asset. Conductor lets teams run "
            "Claude Code, Codex, Cursor, and OpenCode in isolated sandboxes at the same time, "
            "then review and merge results. The founding team joins Meta Superintelligence "
            "Labs. Conductor Cloud stops accepting new messages on 13 November and shuts down "
            "on 20 November.",
            font_size=14, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(4.65), "4 NOVEMBER 2026  .  AXIOS  .  INFOWORLD")
add_takeaway(slide, Inches(0.8), Inches(5.2), Inches(7.5),
             "If you are on Conductor Cloud, 13 November is your last day to export workflows. "
             "For teams not on Conductor: the multi-agent pattern (run agents in parallel, "
             "merge the best result) is becoming native in major platforms. Plan for it in "
             "your stack before your competitors do.",
             height=Inches(1.4))
add_stat_cards(slide, [
    ("Nov 20", "Conductor Cloud shutdown deadline"),
    ("4 agents", "Supported in parallel: Claude Code, Codex, Cursor, OpenCode"),
    ("2 founders", "Join Meta Superintelligence Labs"),
])
add_footer(slide, 3)


# ============================================================
# SIGNAL 02: CrowdStrike AI Kill Switch  (04/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 02")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(7.5), Inches(1.8),
            "CrowdStrike\nBuilds an AI\nKill Switch", font_size=38, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.2))
add_textbox(slide, Inches(0.8), Inches(3.45), Inches(7.5), Inches(1.3),
            "At Fal.Con Europe on 3 November, CrowdStrike announced agreements to acquire "
            "Fiddler AI and Dreadnode, adding agent observability and red-teaming to its Falcon "
            "platform. It also launched an AI Kill Switch in Falcon Guardian that terminates a "
            "rogue agent and severs its network access immediately. The combined deal is "
            "reported at around $495 million.",
            font_size=14, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(4.9), "3 NOVEMBER 2026  .  CROWDSTRIKE FAL.CON EUROPE")
add_takeaway(slide, Inches(0.8), Inches(5.4), Inches(7.5),
             "AI agent security is now a funded product category. If you build agents that "
             "connect to company data, the question your security team will ask in 2027 is "
             "whether you can explain what the agent did and stop it mid-flight. Add audit "
             "logs to every agent action now, before it becomes a compliance requirement.",
             height=Inches(1.4))
add_stat_cards(slide, [
    ("~$495M", "Combined reported deal value: Fiddler AI and Dreadnode"),
    ("2 deals", "Fiddler (observability) and Dreadnode (red-teaming), same day"),
    ("1 switch", "Terminate agent and cut network access in Falcon Guardian"),
])
add_footer(slide, 4)


# ============================================================
# SIGNAL 03: OpenAI Images 2.6  (05/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 03")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(7.5), Inches(1.4),
            "OpenAI Images 2.6\nShips GIFs and SVGs", font_size=38, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.75))
add_textbox(slide, Inches(0.8), Inches(3.0), Inches(7.5), Inches(1.5),
            "OpenAI launched GPT Image 2.6 on 4 November with native GIF creation, SVG export "
            "via the API, and a 50 percent speed improvement over Images 2.5. Two variants: "
            "Flare for speed (around 6 seconds at low quality) and Sunburst for detailed, "
            "consistent output. The platform now generates roughly 4 billion images per week.",
            font_size=14, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(4.65), "4 NOVEMBER 2026  .  OPENAI.COM")
add_takeaway(slide, Inches(0.8), Inches(5.2), Inches(7.5),
             "GIF output from a prompt is a direct unlock for social content, product "
             "walkthroughs, and marketing automation. SVG export means vector assets are one "
             "API call away. If your product generates or manages creative assets, Images 2.6 "
             "either cuts a step in your pipeline or adds a capability your competitors will "
             "ship within weeks.",
             height=Inches(1.4))
add_stat_cards(slide, [
    ("50% faster", "Generation speed vs Images 2.5"),
    ("~6 sec", "Low-quality Flare generation time"),
    ("4B", "Images generated per week on the platform"),
])
add_footer(slide, 5)


# ============================================================
# SIGNAL 04: Claude Code MCP Security Patch  (06/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 04")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(7.5), Inches(1.8),
            "Claude Code Patches\nan MCP OAuth\nToken Leak", font_size=36, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.2))
add_textbox(slide, Inches(0.8), Inches(3.45), Inches(7.5), Inches(1.3),
            "Claude Code 2.1.321, released 9 November, fixed two security issues: MCP OAuth "
            "requests were sending refresh tokens to the wrong host, and a sandboxed read-only "
            "Bash command could escape the sandbox. The build also makes Claude Fable 5.2 the "
            "default model. Fast mode on Vertex is available globally in the follow-on "
            "2.1.322 build.",
            font_size=14, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(4.9), "9 NOVEMBER 2026  .  CLAUDE CODE CHANGELOG")
add_takeaway(slide, Inches(0.8), Inches(5.4), Inches(7.5),
             "The MCP OAuth leak is subtle and high-impact: a misconfigured request sends a "
             "refresh token to a host you did not authorise. Update Claude Code now. Add MCP "
             "token handling to your security checklist alongside OAuth scope audits and "
             "API key rotation.",
             height=Inches(1.4))
add_stat_cards(slide, [
    ("2 patches", "MCP OAuth token leak and sandbox bypass, one release"),
    ("Fable 5.2", "Now the default model in Claude Code 2.1.321"),
    ("Vertex", "Fast mode live globally, us and eu, in 2.1.322"),
])
add_footer(slide, 6)


# ============================================================
# SIGNAL 05: Anthropic IPO and Spending Stall  (07/16)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "SIGNAL 05")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(7.5), Inches(1.8),
            "Anthropic Nears IPO\nas Enterprise AI\nSpend Stalls", font_size=36, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(3.2))
add_textbox(slide, Inches(0.8), Inches(3.45), Inches(7.5), Inches(1.3),
            "Anthropic filed for an IPO with a potential roadshow the week of 9 November. Its "
            "prospectus shows a 12-fold revenue jump alongside $518 billion in compute "
            "commitments. Meanwhile, Ramp data shows enterprise AI spend grew only 1.5 percent "
            "in August and September, against 42 percent in July, as token volumes kept rising "
            "due to price cuts.",
            font_size=14, color=GREY_LIGHT)
add_date_tag(slide, Inches(0.8), Inches(4.9), "NOVEMBER 2026  .  RAMP  .  RENAISSANCE CAPITAL")
add_takeaway(slide, Inches(0.8), Inches(5.4), Inches(7.5),
             "Spend growth stalling while volumes rise means prices are falling faster than "
             "usage is growing. If your product's margins assume stable or rising per-token "
             "costs, revisit that model. The IPO prospectus puts Anthropic's true unit "
             "economics in public view for the first time. The market reaction will signal "
             "where enterprise AI pricing goes next.",
             height=Inches(1.4))
add_stat_cards(slide, [
    ("1.5%", "Enterprise AI spend growth, Aug to Sep (Ramp), vs 42% in July"),
    ("12x", "Revenue jump shown in Anthropic's IPO prospectus"),
    ("$518B", "Compute commitments disclosed in prospectus"),
])
add_footer(slide, 7)


# ============================================================
# SLIDE 08: Jargon Buster
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
    ("Multi-agent orchestration",
     "Running several AI agents in parallel on the same task, each in an isolated environment. Results are compared and the best is merged."),
    ("MCP OAuth token",
     "The access key an MCP server receives when a user connects it to a resource. If leaked to the wrong host, it opens your data until it expires."),
    ("Agent observability",
     "Monitoring what a running agent does, step by step, so you can audit its actions, explain them, or stop the agent mid-task."),
    ("IPO prospectus",
     "The legal document a company files when listing on a stock exchange. Anthropic's is the first public view of frontier AI unit economics."),
    ("Sandbox",
     "An isolated environment where code or an agent runs without access to production systems. Contains the blast radius if something goes wrong."),
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
                term, font_size=14, color=RED, bold=True)
    add_textbox(slide, def_left, y + Inches(0.08), def_w, row_h,
                definition, font_size=12, color=WHITE)
    add_accent_line(slide, term_left, y + row_h - Inches(0.02),
                    width=Inches(11.9), color=GOLD, thickness=Pt(1))

add_textbox(slide, Inches(0.8), Inches(6.85), Inches(11.9), Inches(0.3),
            "If any of these feel fuzzy, find me at dinner. No dumb questions in this room.",
            font_size=13, color=GREY, italic=True)
add_footer(slide, 8)


# ============================================================
# SLIDE 09: Builder Spotlight A (placeholder)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "BUILDER SPOTLIGHT")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
            "What Are You Building?", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(11), Inches(0.8),
            "Three builders from the room. What they are shipping and why it matters.",
            font_size=15, color=GREY_LIGHT)

spotlights = [
    {"name": "[Builder 1 name]", "role": "[Title, Company]",
     "building": "[What they are building. What problem it solves and who the customer is.]",
     "initial": "B1"},
    {"name": "[Builder 2 name]", "role": "[Title, Company]",
     "building": "[What they are building, one or two sentences.]",
     "initial": "B2"},
    {"name": "[Builder 3 name]", "role": "[Title, Company]",
     "building": "[What they are building, one or two sentences.]",
     "initial": "B3"},
]

card_w = Inches(4.0)
card_h = Inches(3.4)
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
    add_textbox(slide, x + Inches(0.3), card_top + Inches(1.55), card_w - Inches(0.6), Inches(0.4),
                s["name"], font_size=16, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), card_top + Inches(2.0), card_w - Inches(0.6), Inches(0.3),
                s["role"], font_size=11, color=GREY, italic=True, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + Inches(0.3), card_top + Inches(2.4), card_w - Inches(0.6), Inches(0.9),
                s["building"], font_size=11, color=GREY_LIGHT, alignment=PP_ALIGN.CENTER)
add_footer(slide, 9)


# ============================================================
# SLIDE 10: Builder Spotlight B (placeholder)
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "BUILDER SPOTLIGHT")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
            "What Are You Building?", font_size=44, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(11), Inches(0.8),
            "Reserve this slide for a live demo, a guest spotlight, or a Q and A prompt.",
            font_size=15, color=GREY_LIGHT)
add_card(slide, Inches(0.9), Inches(3.4), Inches(11.5), Inches(3.5))
add_textbox(slide, Inches(1.2), Inches(3.7), Inches(11.0), Inches(2.5),
            "[PLACEHOLDER: Fill in before presenting. Add a builder demo, a live coding "
            "session, or a guest spotlight here. If unused, delete this slide.]",
            font_size=18, color=GREY, italic=True, alignment=PP_ALIGN.CENTER)
add_footer(slide, 10)


# ============================================================
# SLIDE 11: Action of the Week
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_tag(slide, Inches(0.8), Inches(0.6), "ACTION OF THE WEEK")
add_textbox(slide, Inches(0.8), Inches(1.1), Inches(10), Inches(1.0),
            "Update Claude Code and Audit Your MCP Connections",
            font_size=32, color=WHITE, bold=True)
add_accent_line(slide, Inches(0.8), Inches(2.2))
add_textbox(slide, Inches(0.8), Inches(2.5), Inches(9.5), Inches(1.0),
            "The highest-leverage action from this week's signals. "
            "Signal 04 is a live security patch. If you use MCP servers, do this before Friday.",
            font_size=15, color=GREY_LIGHT)

badge_x = Inches(10.5)
badge_y = Inches(1.2)
badge_w = Inches(2.4)
badge_h = Inches(1.8)
add_red_card(slide, badge_x, badge_y, badge_w, badge_h)
add_multiline(slide, badge_x, badge_y + Inches(0.35), badge_w, badge_h - Inches(0.4), [
    {"text": "15", "size": 56, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER},
    {"text": "MINUTES", "size": 16, "color": WHITE, "bold": True,
     "align": PP_ALIGN.CENTER, "spacing_before": 2},
    {"text": "Average time to complete", "size": 10, "color": WHITE,
     "align": PP_ALIGN.CENTER, "spacing_before": 6},
])

steps = [
    ("01", "Update", "claude update  or  npm i -g @anthropic-ai/claude-code"),
    ("02", "List", "Open ~/.claude/settings.json. Find mcpServers. Count them."),
    ("03", "Audit", "For each server: what can it access? When was it last used?"),
    ("04", "Revoke", "Remove any MCP server unused in 30 days. Reconnect takes 30 seconds."),
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
                body, font_size=11, color=GREY_LIGHT)
    if i < 3:
        ax = x + step_w + Inches(0.005)
        add_textbox(slide, ax - Inches(0.05), flow_top + Inches(0.6),
                    step_gap + Inches(0.1), Inches(0.5),
                    "›", font_size=22, color=RED, bold=True, alignment=PP_ALIGN.CENTER)

add_takeaway(slide, Inches(0.8), Inches(5.75), Inches(11.7),
             "Claude Code was quietly sending MCP refresh tokens to the wrong host. That is "
             "the kind of bug that sits undetected until someone checks. Update now, audit what "
             "you have connected, and treat your MCP server list the same way you treat your "
             "OAuth grants: if you are not actively using it, revoke it.",
             height=Inches(1.25))
add_footer(slide, 11)


# ============================================================
# SLIDE 12: By Tier
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
        "heading": "Learn the vocabulary",
        "bullets": [
            "Install Claude Code free tier this week",
            "Ask it: 'What is MCP and what can it connect to on my machine?'",
            "If you use any AI tool that asks for Google or Slack login, check its permissions at myaccount.google.com/permissions",
        ],
        "goal": "Goal: understand what AI agents can reach before granting more access",
    },
    {
        "label": "TIER 2, OPERATOR",
        "heading": "Patch and audit this week",
        "bullets": [
            "Run claude update and confirm you are on 2.1.321 or later",
            "Open ~/.claude/settings.json and list your mcpServers connections",
            "If you are on Conductor Cloud, export workflows before 13 November",
        ],
        "goal": "Goal: close the MCP token-leak exposure from Signal 04 today",
    },
    {
        "label": "TIER 3, BUILDER",
        "heading": "Secure and re-price",
        "bullets": [
            "If your product issues tokens to MCP servers, validate that the redirect host matches the registered endpoint",
            "Add structured logging to every agent action with the initiating identity",
            "Re-stress-test your margins: if per-token costs fall 20 percent in 2027, does your product still work?",
        ],
        "goal": "Goal: ship agents that survive a security audit and a margin compression",
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
add_footer(slide, 12)


# ============================================================
# SLIDES 13-15: Community Wins (placeholder)
# ============================================================
for slide_num, win_num in [(13, 1), (14, 2), (15, 3)]:
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_bg(slide)
    add_tag(slide, Inches(0.8), Inches(0.6), "COMMUNITY WIN")
    add_textbox(slide, Inches(0.8), Inches(1.1), Inches(12), Inches(0.9),
                f"Win {win_num} From the Room", font_size=44, color=WHITE, bold=True)
    add_accent_line(slide, Inches(0.8), Inches(2.2))
    add_textbox(slide, Inches(0.8), Inches(2.5), Inches(12), Inches(0.8),
                "A member shipped something since last edition. This is what the community "
                "looks like when it builds in public.",
                font_size=15, color=GREY_LIGHT)

    win_card_w = Inches(11.5)
    win_card_h = Inches(3.6)
    add_card(slide, Inches(0.9), Inches(3.3), win_card_w, win_card_h)
    avatar_size = Inches(1.4)
    avatar_x = Inches(0.9) + Inches(0.4)
    add_circle(slide, avatar_x, Inches(3.3) + Inches(0.5), avatar_size,
               fill_color=GREY_MID, border_color=RED)
    add_textbox(slide, avatar_x, Inches(3.3) + Inches(0.75), avatar_size, Inches(0.7),
                f"M{win_num}", font_size=22, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, Inches(3.1), Inches(3.6), Inches(8.8), Inches(0.5),
                f"[Member {win_num} name]", font_size=20, color=WHITE, bold=True)
    add_textbox(slide, Inches(3.1), Inches(4.2), Inches(8.8), Inches(0.4),
                "[Founder, Company  /  Operator, Industry]",
                font_size=13, color=GREY, italic=True)
    add_textbox(slide, Inches(3.1), Inches(4.75), Inches(8.8), Inches(1.5),
                "[What they shipped since last edition. One or two sentences: what problem "
                "it solves, how they used AI to build or run it, and the result.]",
                font_size=14, color=GREY_LIGHT)
    add_textbox(slide, Inches(0.8), Inches(7.1), Inches(11.9), Inches(0.35),
                "Want to be on this slide next edition? Tell me what you shipped. "
                "No pitch needed, just a screenshot and one line.",
                font_size=13, color=GOLD, italic=True, alignment=PP_ALIGN.CENTER)
    add_footer(slide, slide_num)


# ============================================================
# SLIDE 16: Close
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide)
add_accent_line(slide, Inches(0), Inches(5.0), width=Inches(13.333), color=RED, thickness=Pt(6))
add_textbox(slide, Inches(0.8), Inches(0.8), Inches(12), Inches(0.6),
            "HOW I AI", font_size=20, color=RED, bold=True)
add_textbox(slide, Inches(0.8), Inches(1.6), Inches(12), Inches(2.0),
            "See You at Edition 32", font_size=56, color=WHITE, bold=True)
add_textbox(slide, Inches(0.8), Inches(3.8), Inches(12), Inches(0.7),
            "Wednesday 18 November 2026  .  Seoul Soul Project, Canggu",
            font_size=22, color=GREY_LIGHT)
add_textbox(slide, Inches(0.8), Inches(4.5), Inches(12), Inches(0.5),
            "6:30pm WITA", font_size=16, color=GREY)
add_textbox(slide, Inches(0.8), Inches(5.5), Inches(12), Inches(0.6),
            "Bring a build. Bring a question. Bring someone who should be in this room.",
            font_size=16, color=GREY, italic=True)
add_textbox(slide, Inches(0.8), Inches(6.3), Inches(12), Inches(0.4),
            "bali.tech  .  #how-i-ai", font_size=13, color=GREY_DARK)
add_footer(slide, 16)


# ============================================================
# SAVE
# ============================================================
output_path = "/home/user/bstc-website/public/how-i-ai-edition-31.pptx"
prs.save(output_path)
print(f"Saved to {output_path}")
