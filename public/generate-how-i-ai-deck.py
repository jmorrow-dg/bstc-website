#!/usr/bin/env python3
"""Canonical How I AI deck generator (config-driven, hard-coded shell).

This is the stable asset for the weekly routine. The 16-slide shell never
changes here. Each week the routine only writes a small JSON config (edition,
date, theme, 5-6 signals, jargon, action, tiers, and an optional special slide)
and runs:

    python3 generate-how-i-ai-deck.py path/to/edition-N.json

Style mirrors Editions 1/3/7/10: charcoal background, red accent, white display
text, muted grey body. No em dashes or en dashes. Australian English.

Slide order (special slide is optional, inserted at position 2):
  01 Title
  (02 Special slide, e.g. a cultural day)   <- optional
  Background
  Money Round
  Jargon Buster
  AI Intel Drop intro
  Signal 01 .. Signal N
  Action of the Week
  By Tier
  Dinner & Drinks
  Builder Spotlights
  Community Wins
  Close / See you at next edition
"""

import json
import os
import sys

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

HERE = os.path.dirname(os.path.abspath(__file__))


# ------------------------------------------------------------------
# Primitives
# ------------------------------------------------------------------
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


def add_date_tag(slide, left, top, text):
    add_textbox(slide, left, top, Inches(8), Inches(0.3), text,
                font_size=11, color=GREY, bold=True)


def add_link(slide, left, top, width, height, text, url, font_size=12,
             color=GOLD):
    tb = slide.shapes.add_textbox(left, top, width, height)
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    run = p.add_run()
    run.text = text
    run.font.size = Pt(font_size)
    run.font.color.rgb = color
    run.font.bold = True
    run.font.name = "Arial"
    run.hyperlink.address = url
    return tb


# ------------------------------------------------------------------
# Deck builder
# ------------------------------------------------------------------
class DeckBuilder:
    def __init__(self, cfg):
        self.cfg = cfg
        self.prs = Presentation()
        self.prs.slide_width = Inches(13.333)
        self.prs.slide_height = Inches(7.5)
        self.signals = cfg["signals"]
        # 11 fixed slides + optional special + optional deep dive + N signals
        self.total = (11 + (1 if cfg.get("special_slide") else 0)
                      + (1 if cfg.get("deep_dive") else 0) + len(self.signals))
        self.n = 0  # running slide number

    def slide(self):
        s = self.prs.slides.add_slide(self.prs.slide_layouts[6])
        add_bg(s)
        self.n += 1
        return s

    def footer(self, slide):
        add_textbox(slide, Inches(0.5), Inches(7.1), Inches(1.5), Inches(0.3),
                    "BSTC", font_size=11, color=GREY_DARK, bold=True)
        add_textbox(slide, Inches(11.5), Inches(7.1), Inches(1.5), Inches(0.3),
                    f"{self.n:02d} / {self.total}", font_size=12, color=GREY,
                    alignment=PP_ALIGN.RIGHT)

    def takeaway(self, slide, left, top, width, text, height=Inches(1.2)):
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

    def stat_cards(self, slide, cards, right_x=Inches(8.6), top=Inches(1.4),
                   card_w=Inches(4.3), card_h=Inches(1.5), gap=Inches(0.2)):
        for i, (headline, caption) in enumerate(cards):
            y = top + (card_h + gap) * i
            add_card(slide, right_x, y, card_w, card_h)
            add_multiline(slide, right_x + Inches(0.25), y + Inches(0.2),
                          card_w - Inches(0.45), card_h - Inches(0.3), [
                {"text": headline, "size": 26, "color": RED, "bold": True},
                {"text": caption, "size": 12, "color": GREY_LIGHT, "spacing_before": 6},
            ])

    def tier_card(self, slide, x, y, width, height, label, heading, bullets, goal):
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

    # ----- slides -----
    def title_slide(self):
        s = self.slide()
        add_tag(s, Inches(0.8), Inches(1.5), "BALI START-UPS & TECH COMMUNITY PRESENTS")
        add_textbox(s, Inches(0.8), Inches(2.2), Inches(10), Inches(1.5),
                    "How I AI", font_size=72, color=WHITE, bold=True)
        add_multiline(s, Inches(0.8), Inches(3.8), Inches(8), Inches(1.2), [
            {"text": f"Edition {self.cfg['edition']}", "size": 32, "color": WHITE, "bold": True},
            {"text": f"{self.cfg['venue']}  ·  {self.cfg['date']}", "size": 20, "color": GREY, "spacing_before": 8},
        ])
        add_textbox(s, Inches(0.8), Inches(5.5), Inches(9), Inches(0.4),
                    "Builders show tools. Operators share workflows. Everyone leaves sharper.",
                    font_size=15, color=GREY)
        self.footer(s)

    def special_slide(self):
        sp = self.cfg["special_slide"]
        s = self.slide()
        add_tag(s, Inches(0.8), Inches(0.6), sp["tag"])
        add_textbox(s, Inches(0.8), Inches(1.05), Inches(11), Inches(0.9),
                    sp["title"], font_size=sp.get("title_size", 46), color=WHITE, bold=True)
        add_accent_line(s, Inches(0.8), Inches(2.05))
        photo_w, photo_h = Inches(5.4), Inches(3.6)
        photo_x, photo_y = Inches(7.1), Inches(2.35)
        frame = s.shapes.add_shape(MSO_SHAPE.RECTANGLE,
                                   photo_x - Inches(0.04), photo_y - Inches(0.04),
                                   photo_w + Inches(0.08), photo_h + Inches(0.08))
        frame.fill.solid()
        frame.fill.fore_color.rgb = GREY_DARK
        frame.line.color.rgb = GOLD
        frame.line.width = Pt(1.5)
        photo = os.path.join(HERE, sp["photo"]) if sp.get("photo") else None
        if photo and os.path.exists(photo):
            s.shapes.add_picture(photo, photo_x, photo_y, photo_w, photo_h)
        else:
            add_textbox(s, photo_x, photo_y + Inches(1.5), photo_w, Inches(0.6),
                        f"Drop {sp.get('photo', 'photo.jpg')} in /public", font_size=15,
                        color=GREY, alignment=PP_ALIGN.CENTER)
        if sp.get("caption"):
            add_textbox(s, photo_x, photo_y + photo_h + Inches(0.1), photo_w, Inches(0.4),
                        sp["caption"], font_size=11, color=GREY, italic=True,
                        alignment=PP_ALIGN.CENTER)
        lines = []
        for i, para in enumerate(sp["body"]):
            lines.append({"text": para, "size": 15,
                          "color": WHITE if i == 0 else GREY_LIGHT,
                          "spacing_before": 0 if i == 0 else 12})
        if sp.get("signoff"):
            lines.append({"text": sp["signoff"], "size": 18, "color": GOLD,
                          "bold": True, "italic": True, "spacing_before": 14})
        add_multiline(s, Inches(0.8), Inches(2.4), Inches(5.9), Inches(4.2), lines)
        self.footer(s)

    def background_slide(self):
        s = self.slide()
        add_tag(s, Inches(0.8), Inches(0.8), "MY BACKGROUND")
        add_textbox(s, Inches(0.8), Inches(1.8), Inches(3.5), Inches(0.6),
                    "Josh Morrow", font_size=28, color=WHITE, bold=True)
        add_multiline(s, Inches(0.8), Inches(2.6), Inches(3.5), Inches(3.0), [
            {"text": "•  5+ years in B2B technology", "size": 16, "color": GREY},
            {"text": "•  Oxford/MIT AI Programmes / Legal Background", "size": 16, "color": GREY, "spacing_before": 10},
            {"text": "•  Co-Founder of Bali Start-Up & Tech (3k+ folks on Meetup/WA)", "size": 16, "color": GREY, "spacing_before": 10},
        ])
        add_textbox(s, Inches(5.0), Inches(1.8), Inches(3.5), Inches(0.6),
                    "David & Goliath", font_size=28, color=WHITE, bold=True)
        add_multiline(s, Inches(5.0), Inches(2.6), Inches(3.5), Inches(3.0), [
            {"text": "•  AI systems firm for ambitious teams", "size": 16, "color": GREY},
            {"text": "•  Australia founded and globally minded", "size": 16, "color": GREY, "spacing_before": 10},
            {"text": "•  We build operating AI infrastructure across revenue, capacity & AI security", "size": 16, "color": GREY, "spacing_before": 10},
        ])
        add_textbox(s, Inches(9.2), Inches(1.8), Inches(3.5), Inches(0.6),
                    "Oligo Security", font_size=28, color=WHITE, bold=True)
        add_multiline(s, Inches(9.2), Inches(2.6), Inches(3.5), Inches(3.0), [
            {"text": "•  Selected as runtime AI security vendor in AWS Security Hub", "size": 16, "color": GREY},
            {"text": "•  Working with security leaders at APAC's largest companies", "size": 16, "color": GREY, "spacing_before": 10},
        ])
        self.footer(s)

    def money_round_slide(self):
        s = self.slide()
        add_tag(s, Inches(0.8), Inches(1.2), "6:30 PM")
        add_textbox(s, Inches(0.8), Inches(2.0), Inches(10), Inches(1.0),
                    "Money Round", font_size=64, color=WHITE, bold=True)
        add_accent_line(s, Inches(0.8), Inches(3.2))
        add_textbox(s, Inches(0.8), Inches(3.5), Inches(8), Inches(0.5),
                    "60-second intros", font_size=28, color=WHITE, bold=True)
        add_textbox(s, Inches(0.8), Inches(4.2), Inches(10), Inches(0.8),
                    "One way AI made you money, saved you money,\nor saved you serious time. No pitches. Just results.",
                    font_size=20, color=GREY)
        add_red_card(s, Inches(0.8), Inches(5.5), Inches(1.8), Inches(1.2))
        add_multiline(s, Inches(0.9), Inches(5.6), Inches(1.6), Inches(1.0), [
            {"text": "60s", "size": 40, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER},
            {"text": "PER PERSON", "size": 11, "color": WHITE, "align": PP_ALIGN.CENTER},
        ])
        add_card(s, Inches(3.0), Inches(5.5), Inches(3.5), Inches(1.2))
        add_multiline(s, Inches(3.1), Inches(5.6), Inches(3.3), Inches(1.0), [
            {"text": "3 Parts", "size": 32, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER},
            {"text": "Tool / Workflow / Result", "size": 13, "color": GREY, "align": PP_ALIGN.CENTER},
        ])
        self.footer(s)

    def jargon_slide(self):
        s = self.slide()
        add_tag(s, Inches(0.8), Inches(0.6), "BEFORE WE START")
        add_textbox(s, Inches(0.8), Inches(1.1), Inches(11), Inches(0.9),
                    "Jargon Buster", font_size=48, color=WHITE, bold=True)
        add_accent_line(s, Inches(0.8), Inches(2.15))
        add_textbox(s, Inches(0.8), Inches(2.45), Inches(11), Inches(0.6),
                    "Five terms you will hear tonight. Lock these in first and the signals land harder.",
                    font_size=16, color=GREY_LIGHT)
        row_top, row_h = Inches(3.3), Inches(0.62)
        for i, (term, definition) in enumerate(self.cfg["jargon"]):
            y = row_top + row_h * i
            add_textbox(s, Inches(0.8), y + Inches(0.08), Inches(3.8), row_h,
                        term, font_size=16, color=RED, bold=True)
            add_textbox(s, Inches(4.8), y + Inches(0.08), Inches(7.9), row_h,
                        definition, font_size=14, color=WHITE)
            add_accent_line(s, Inches(0.8), y + row_h - Inches(0.02),
                            width=Inches(11.9), color=GOLD, thickness=Pt(1))
        add_textbox(s, Inches(0.8), Inches(6.85), Inches(11.9), Inches(0.3),
                    "If any of these feel fuzzy, find me at dinner. No dumb questions in this room.",
                    font_size=13, color=GREY, italic=True)
        self.footer(s)

    def intro_slide(self):
        s = self.slide()
        add_tag(s, Inches(0.8), Inches(1.2), "7:00 PM — AI INTEL DROP")
        add_textbox(s, Inches(0.8), Inches(2.2), Inches(10), Inches(1.0),
                    "This Week in AI", font_size=54, color=WHITE, bold=True)
        add_accent_line(s, Inches(0.8), Inches(3.4))
        add_textbox(s, Inches(0.8), Inches(3.8), Inches(11.5), Inches(0.9),
                    self.cfg["theme_intro"], font_size=18, color=GREY)
        labels = [(f"{self.cfg.get('source_count', '50+')} Sources", 1.5),
                  ("Signal Scoring", 5.0),
                  (f"Top {len(self.signals)} Tonight", 8.5)]
        for i, (label, x) in enumerate(labels):
            add_card(s, Inches(x), Inches(5.4), Inches(2.5), Inches(0.7))
            add_textbox(s, Inches(x), Inches(5.5), Inches(2.5), Inches(0.5),
                        label, font_size=14, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
            if i < 2:
                add_textbox(s, Inches(x + 2.7), Inches(5.45), Inches(0.5), Inches(0.5),
                            "→", font_size=28, color=RED, alignment=PP_ALIGN.CENTER)
        self.footer(s)

    def signal_slide(self, idx, sig):
        s = self.slide()
        add_tag(s, Inches(0.8), Inches(0.6), f"SIGNAL {idx:02d}")
        add_textbox(s, Inches(0.8), Inches(1.1), Inches(8), Inches(1.5),
                    sig["headline"], font_size=sig.get("title_size", 44), color=WHITE, bold=True)
        add_accent_line(s, Inches(0.8), Inches(2.55))
        add_textbox(s, Inches(0.8), Inches(2.85), Inches(7.5), Inches(1.6),
                    sig["blurb"], font_size=15, color=GREY_LIGHT)
        add_date_tag(s, Inches(0.8), Inches(4.55), sig["date_tag"])
        if sig.get("link"):
            add_link(s, Inches(0.8), Inches(4.95), Inches(7.5), Inches(0.3),
                     sig.get("link_text", "Read the announcement"), sig["link"])
        self.takeaway(s, Inches(0.8), Inches(5.85), Inches(7.5), sig["takeaway"], height=Inches(1.2))
        self.stat_cards(s, [tuple(c) for c in sig["cards"]])
        self.footer(s)

    def deep_dive_slide(self):
        d = self.cfg["deep_dive"]
        s = self.slide()
        add_tag(s, Inches(0.8), Inches(0.6), d["tag"])
        add_textbox(s, Inches(0.8), Inches(1.05), Inches(12), Inches(0.9),
                    d["title"], font_size=d.get("title_size", 40), color=WHITE, bold=True)
        add_accent_line(s, Inches(0.8), Inches(2.0))
        add_textbox(s, Inches(0.8), Inches(2.25), Inches(11.7), Inches(0.9),
                    d["thesis"], font_size=15, color=GREY_LIGHT)
        cap_w, cap_h, cap_y = Inches(5.75), Inches(1.75), Inches(3.35)
        for x, side, accent in [(Inches(0.8), d["left"], GOLD),
                                (Inches(6.95), d["right"], RED)]:
            add_card(s, x, cap_y, cap_w, cap_h)
            add_accent_line(s, x, cap_y, width=cap_w, color=accent, thickness=Pt(4))
            add_textbox(s, x + Inches(0.25), cap_y + Inches(0.25), cap_w - Inches(0.5), Inches(0.4),
                        side["label"], font_size=15, color=accent, bold=True)
            add_textbox(s, x + Inches(0.25), cap_y + Inches(0.7), cap_w - Inches(0.5), Inches(1.0),
                        side["body"], font_size=13, color=GREY_LIGHT)
        add_textbox(s, Inches(0.8), Inches(5.25), Inches(11.7), Inches(0.4),
                    d["connector"], font_size=13, color=RED, italic=True, alignment=PP_ALIGN.CENTER)
        add_card(s, Inches(0.8), Inches(5.8), Inches(11.7), Inches(1.15), border_color=RED)
        add_multiline(s, Inches(1.0), Inches(5.95), Inches(11.3), Inches(0.95), [
            {"text": d["punchline"], "size": 22, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER},
            {"text": d["punchline_sub"], "size": 12, "color": GREY_LIGHT,
             "align": PP_ALIGN.CENTER, "spacing_before": 8},
        ])
        self.footer(s)

    def action_slide(self):
        a = self.cfg["action"]
        s = self.slide()
        add_tag(s, Inches(0.8), Inches(0.6), "ACTION OF THE WEEK")
        add_textbox(s, Inches(0.8), Inches(1.1), Inches(10), Inches(1.0),
                    a["title"], font_size=38, color=WHITE, bold=True)
        add_accent_line(s, Inches(0.8), Inches(2.15))
        add_textbox(s, Inches(0.8), Inches(2.45), Inches(9.3), Inches(1.0),
                    a["body"], font_size=15, color=GREY_LIGHT)
        add_red_card(s, Inches(10.5), Inches(1.2), Inches(2.4), Inches(1.8))
        add_multiline(s, Inches(10.5), Inches(1.55), Inches(2.4), Inches(1.4), [
            {"text": "10", "size": 56, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER},
            {"text": "MINUTES", "size": 16, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER, "spacing_before": 2},
            {"text": a.get("time_caption", "To set up the first run"), "size": 10, "color": WHITE, "align": PP_ALIGN.CENTER, "spacing_before": 6},
        ])
        flow_top, flow_h = Inches(3.7), Inches(1.7)
        step_w, step_gap = Inches(2.95), Inches(0.1)
        for i, (num, title, body) in enumerate(a["steps"]):
            x = Inches(0.6) + (step_w + step_gap) * i
            add_card(s, x, flow_top, step_w, flow_h)
            add_circle(s, x + Inches(0.3), flow_top + Inches(0.2), Inches(0.6), fill_color=RED)
            add_textbox(s, x + Inches(0.3), flow_top + Inches(0.28), Inches(0.6), Inches(0.5),
                        num, font_size=15, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
            add_textbox(s, x + Inches(1.0), flow_top + Inches(0.28), step_w - Inches(1.1), Inches(0.45),
                        title, font_size=18, color=WHITE, bold=True)
            add_textbox(s, x + Inches(0.3), flow_top + Inches(0.95), step_w - Inches(0.5), Inches(0.7),
                        body, font_size=12, color=GREY_LIGHT)
            if i < len(a["steps"]) - 1:
                ax = x + step_w + Inches(0.005)
                add_textbox(s, ax - Inches(0.05), flow_top + Inches(0.6), step_gap + Inches(0.1), Inches(0.5),
                            "›", font_size=22, color=RED, bold=True, alignment=PP_ALIGN.CENTER)
        self.takeaway(s, Inches(0.8), Inches(5.75), Inches(11.7), a["takeaway"], height=Inches(1.25))
        self.footer(s)

    def tier_slide(self):
        s = self.slide()
        add_tag(s, Inches(0.8), Inches(0.6), "BY TIER")
        add_textbox(s, Inches(0.8), Inches(1.1), Inches(12), Inches(0.9),
                    "What To Do With This Week's News", font_size=40, color=WHITE, bold=True)
        add_accent_line(s, Inches(0.8), Inches(2.2))
        add_textbox(s, Inches(0.8), Inches(2.5), Inches(12), Inches(0.6),
                    "One action calibrated to where you are right now. Pick your column.",
                    font_size=16, color=GREY_LIGHT)
        tier_w, tier_h = Inches(4.0), Inches(4.1)
        for i, t in enumerate(self.cfg["tiers"]):
            x = Inches(0.5) + (tier_w + Inches(0.15)) * i
            self.tier_card(s, x, Inches(3.3), tier_w, tier_h,
                           t["label"], t["heading"], t["bullets"], t["goal"])
        self.footer(s)

    def dinner_slide(self):
        s = self.slide()
        add_tag(s, Inches(4.5), Inches(2.0), "7:15 PM")
        add_textbox(s, Inches(1.5), Inches(2.8), Inches(10), Inches(1.0),
                    "Dinner & Drinks", font_size=64, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
        add_accent_line(s, Inches(6.2), Inches(4.0))
        add_textbox(s, Inches(2), Inches(4.5), Inches(9), Inches(0.5),
                    "Order up. Best conversations happen over food.",
                    font_size=22, color=GREY, alignment=PP_ALIGN.CENTER)
        add_textbox(s, Inches(2), Inches(5.2), Inches(9), Inches(0.4),
                    "Builder Spotlights start at 7:30 sharp.",
                    font_size=17, color=GREY, alignment=PP_ALIGN.CENTER)
        self.footer(s)

    def spotlights_slide(self):
        s = self.slide()
        add_tag(s, Inches(4.5), Inches(1.5), "7:30 PM")
        add_textbox(s, Inches(1.5), Inches(2.2), Inches(10), Inches(1.0),
                    "Builder Spotlights", font_size=64, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
        add_accent_line(s, Inches(6.2), Inches(3.5))
        for i, x in enumerate([Inches(3.0), Inches(7.5)]):
            add_card(s, x, Inches(4.2), Inches(3.2), Inches(2.2))
            add_multiline(s, x, Inches(4.4), Inches(3.2), Inches(1.8), [
                {"text": f"0{i+1}", "size": 44, "color": RED, "bold": True, "align": PP_ALIGN.CENTER},
                {"text": "10 min + 5 min Q&A", "size": 16, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER, "spacing_before": 8},
                {"text": "[Builder name + what they built]", "size": 13, "color": GREY, "align": PP_ALIGN.CENTER, "spacing_before": 6},
            ])
        self.footer(s)

    def wins_slide(self):
        s = self.slide()
        add_tag(s, Inches(0.8), Inches(0.6), "COMMUNITY WINS")
        add_textbox(s, Inches(0.8), Inches(1.1), Inches(12), Inches(0.9),
                    "Wins From The Room", font_size=44, color=WHITE, bold=True)
        add_accent_line(s, Inches(0.8), Inches(2.2))
        add_textbox(s, Inches(0.8), Inches(2.5), Inches(12), Inches(0.8),
                    "Members who shipped something since last edition. This is what the community looks like "
                    "when it builds in public.",
                    font_size=15, color=GREY_LIGHT)
        card_w, card_h = Inches(4.0), Inches(3.4)
        for i in range(3):
            x = Inches(0.5) + (card_w + Inches(0.15)) * i
            add_card(s, x, Inches(3.5), card_w, card_h)
            avatar_size = Inches(1.1)
            avatar_x = x + (card_w - avatar_size) / 2
            add_circle(s, avatar_x, Inches(3.5) + Inches(0.3), avatar_size,
                       fill_color=GREY_MID, border_color=RED)
            add_textbox(s, avatar_x, Inches(3.5) + Inches(0.58), avatar_size, Inches(0.6),
                        f"M{i+1}", font_size=22, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
            add_textbox(s, x + Inches(0.3), Inches(3.5) + Inches(1.55), card_w - Inches(0.6), Inches(0.4),
                        "[Member name]", font_size=18, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
            add_textbox(s, x + Inches(0.3), Inches(3.5) + Inches(2.0), card_w - Inches(0.6), Inches(0.3),
                        "[Founder or operator title]", font_size=12, color=GREY, italic=True, alignment=PP_ALIGN.CENTER)
            add_textbox(s, x + Inches(0.3), Inches(3.5) + Inches(2.45), card_w - Inches(0.6), Inches(0.9),
                        "[What they shipped, one line, with the result or time saved]",
                        font_size=12, color=GREY_LIGHT, alignment=PP_ALIGN.CENTER)
        add_textbox(s, Inches(0.8), Inches(7.1), Inches(11.9), Inches(0.35),
                    "Want to be on this slide next edition? Tell me what you shipped. "
                    "No pitch needed, just a screenshot and one line.",
                    font_size=13, color=GOLD, italic=True, alignment=PP_ALIGN.CENTER)
        self.footer(s)

    def close_slide(self):
        nxt = self.cfg["edition"] + 1
        s = self.slide()
        add_tag(s, Inches(3.5), Inches(0.8), "THANK YOU")
        add_textbox(s, Inches(1.5), Inches(1.5), Inches(10), Inches(1.2),
                    f"See You at\nEdition {nxt}", font_size=56, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
        add_accent_line(s, Inches(6.2), Inches(3.0))
        for i, platform in enumerate(["YOUTUBE", "INSTAGRAM", "TIKTOK"]):
            x = Inches(2.5) + Inches(i * 3.0)
            add_card(s, x, Inches(3.5), Inches(2.5), Inches(1.2))
            add_multiline(s, x, Inches(3.6), Inches(2.5), Inches(1.0), [
                {"text": platform, "size": 12, "color": GREY, "bold": True, "align": PP_ALIGN.CENTER},
                {"text": "@joshbuildswithai", "size": 17, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER, "spacing_before": 8},
            ])
        add_card(s, Inches(2.5), Inches(5.2), Inches(8.0), Inches(1.8), border_color=RED)
        add_multiline(s, Inches(2.5), Inches(5.4), Inches(8.0), Inches(1.4), [
            {"text": f"NEXT WEDNESDAY · EDITION {nxt} · {self.cfg['next_edition_date']}", "size": 12, "color": RED, "bold": True, "align": PP_ALIGN.CENTER},
            {"text": "Same room. New signals. Two new builders.", "size": 26, "color": WHITE, "bold": True, "align": PP_ALIGN.CENTER, "spacing_before": 8},
            {"text": "Topic announced on MeetUp. RSVP to hold your seat.", "size": 15, "color": GREY, "align": PP_ALIGN.CENTER, "spacing_before": 6},
        ])
        self.footer(s)

    def build(self):
        self.title_slide()
        if self.cfg.get("special_slide"):
            self.special_slide()
        self.background_slide()
        self.money_round_slide()
        self.jargon_slide()
        self.intro_slide()
        for i, sig in enumerate(self.signals, start=1):
            self.signal_slide(i, sig)
        if self.cfg.get("deep_dive"):
            self.deep_dive_slide()
        self.action_slide()
        self.tier_slide()
        self.dinner_slide()
        self.spotlights_slide()
        self.wins_slide()
        self.close_slide()
        return self.prs


def main():
    if len(sys.argv) < 2:
        print("usage: generate-how-i-ai-deck.py <config.json>", file=sys.stderr)
        sys.exit(2)
    with open(sys.argv[1]) as f:
        cfg = json.load(f)
    builder = DeckBuilder(cfg)
    prs = builder.build()
    out = cfg.get("output_path") or os.path.join(HERE, f"how-i-ai-edition-{cfg['edition']}.pptx")
    prs.save(out)
    print(f"Saved to {out}")
    print(f"Slides: {len(prs.slides._sldIdLst)}  (expected {builder.total})")


if __name__ == "__main__":
    main()
