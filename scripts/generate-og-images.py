#!/usr/bin/env python3
"""Regenerate the Open Graph cards in public/assets/og.

The cards are the site's masthead rendered at 1200x630: Chomsky for the
nameplate, IM Fell DW Pica for the kicker and headline, Caslon Ionic for the
meta rows, on the same paper texture the pages use. Edit CARDS below and rerun
whenever the page copy changes.

    pip install "fonttools[woff]" brotli      # once, for the woff2 -> ttf step
    brew install imagemagick                  # once, for `magick`
    python3 scripts/generate-og-images.py

Chomsky and Caslon Ionic are converted from public/fonts; IM Fell DW Pica is
downloaded from Google Fonts. Both are cached in .cache/og-fonts.
"""
import os
import re
import subprocess
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, '.cache', 'og-fonts')
OUT = os.path.join(ROOT, 'public', 'assets', 'og')
TEXTURE = os.path.join(ROOT, 'public', 'assets', 'growth', 'paper-full.webp')
GOOGLE_CSS = ('https://fonts.googleapis.com/css2'
              '?family=IM+Fell+DW+Pica:ital@0;1&display=swap')

W, H = 1200, 630
MX = 96  # side margin

# src/styles.css tokens
PAPER = '#fff9e2'
INK = '#1c1710'
INK_SOFT = '#383838'
GRAY_BODY = '#747474'
RULE = '#c8bfa8'
RED = '#8b1a1a'
GOLD = '#b8902a'
GREEN = '#2c643c'
CREAM = '#f5efd9'

FOOTER = 'THE-GROWTH-MANIFESTO.MOHITHKUMAR808.WORKERS.DEV'


# --------------------------------------------------------------------- fonts

def _woff2_to_ttf(src, dest):
    try:
        from fontTools.ttLib import TTFont
    except ImportError:
        sys.exit('Need fonttools: pip install "fonttools[woff]" brotli')
    font = TTFont(src)
    font.flavor = None
    font.save(dest)


def _download_im_fell():
    """Google serves plain .ttf to a UA it doesn't recognise as woff2-capable."""
    css = urllib.request.urlopen(GOOGLE_CSS).read().decode()
    urls = re.findall(r'https://fonts\.gstatic\.com/\S+?\.ttf', css)
    styles = re.findall(r'font-style:\s*(\w+)', css)
    for style, url in zip(styles, urls):
        dest = os.path.join(CACHE, 'imfell-%s.ttf' % style)
        if not os.path.exists(dest):
            urllib.request.urlretrieve(url, dest)


def fonts():
    os.makedirs(CACHE, exist_ok=True)
    paths = {}
    for name in ('chomsky', 'caslon-ionic'):
        dest = os.path.join(CACHE, name + '.ttf')
        if not os.path.exists(dest):
            _woff2_to_ttf(
                os.path.join(ROOT, 'public', 'fonts', name + '.woff2'), dest)
        paths[name] = dest
    if not os.path.exists(os.path.join(CACHE, 'imfell-normal.ttf')):
        _download_im_fell()
    paths['fell'] = os.path.join(CACHE, 'imfell-normal.ttf')
    paths['fell-italic'] = os.path.join(CACHE, 'imfell-italic.ttf')
    return paths


F = {}


# ------------------------------------------------------------------ measuring

_CACHE = {}


def measure(font, size, kerning, text):
    key = (font, size, kerning, text)
    if key not in _CACHE:
        out = subprocess.run(
            ['magick', '-font', font, '-pointsize', str(size), '-kerning',
             str(kerning), '-format', '%w', 'label:' + text, 'info:'],
            capture_output=True, text=True, check=True)
        _CACHE[key] = int(out.stdout.strip())
    return _CACHE[key]


def advance(font, size, kerning, text):
    """Inline advance of `text`. label: trims edge whitespace and pads, so
    measure between sentinels and subtract the sentinels' own width."""
    return (measure(font, size, kerning, '|' + text + '|')
            - measure(font, size, kerning, '||'))


# -------------------------------------------------------------------- drawing

class Card:
    def __init__(self, dark=False):
        self.ops = []
        self.dark = dark

    def text(self, font, size, color, text, y, align='center', x=None,
             kerning=0):
        w = measure(font, size, kerning, text)
        if align == 'center':
            px = round((W / 2 if x is None else x) - w / 2)
        elif align == 'right':
            px = (x if x is not None else W - MX) - w
        else:
            px = x if x is not None else MX
        self.ops += ['-font', font, '-pointsize', str(size), '-kerning',
                     str(kerning), '-fill', color,
                     '-annotate', '+%d+%d' % (px, y), text]

    def runs(self, font, size, y, parts, kerning=0):
        """parts = [(text, colour), ...] laid out as one centred line."""
        total = sum(advance(font, size, kerning, t) for t, _ in parts)
        px = (W - total) / 2
        for t, color in parts:
            self.ops += ['-font', font, '-pointsize', str(size), '-kerning',
                         str(kerning), '-fill', color,
                         '-annotate', '+%d+%d' % (round(px), y), t]
            px += advance(font, size, kerning, t)

    def line(self, x1, y1, x2, y2, color, width=1):
        self.ops += ['-stroke', color, '-strokewidth', str(width),
                     '-draw', 'line %d,%d %d,%d' % (x1, y1, x2, y2),
                     '-stroke', 'none']

    def render(self, path):
        base = ['magick', '-size', '%dx%d' % (W, H),
                'xc:' + (INK if self.dark else PAPER),
                '(', TEXTURE, '-resize', '%dx%d^' % (W, H),
                '-gravity', 'center', '-extent', '%dx%d' % (W, H)]
        if self.dark:
            # Keep only the flecks: invert the sheet and lay it on faintly.
            base += ['-negate', '-alpha', 'set', '-channel', 'A',
                     '-evaluate', 'set', '12%', '+channel', ')',
                     '-compose', 'over', '-composite']
        else:
            base += ['-alpha', 'set', '-channel', 'A', '-evaluate', 'set',
                     '55%', '+channel', ')', '-compose', 'multiply',
                     '-composite']
        # -gravity inside the group is a global setting and -extent leaves a
        # page offset: reset both, or every -annotate below lands off-centre.
        # JPEG at 4:4:4 — every scraper reads it, and no chroma subsampling
        # means the red and gold display type stays crisp.
        subprocess.run(
            base + ['-alpha', 'remove', '+repage', '-gravity', 'none']
            + self.ops
            + ['-depth', '8', '-sampling-factor', '1x1', '-quality', '90',
               '-strip', '-interlace', 'Plane', path], check=True)


def card(headline, sub, kicker=None, meta_right='', dark=False,
         stats=None, headline2=None):
    c = Card(dark=dark)
    fg = CREAM if dark else INK
    soft = GRAY_BODY if dark else INK_SOFT
    rule = '#4a4136' if dark else RULE

    kicker = kicker or 'EST. 2026  ·  GROWTH INTELLIGENCE FOR AMBITIOUS OPERATORS'
    c.text(F['fell'], 22, fg, kicker, 84, kerning=4.4)
    c.text(F['chomsky'], 108, fg, 'The Growth Manifesto', 214)

    # Double rule, as on the masthead's border-y-[3px] border-double.
    c.line(MX, 252, W - MX, 252, fg, 2)
    c.line(MX, 259, W - MX, 259, fg, 2)

    c.text(F['caslon-ionic'], 20, soft, 'VOL. I  ·  ISSUE 1', 296, align='left')
    c.text(F['caslon-ionic'], 20, soft, meta_right, 296, align='right')
    c.line(MX, 316, W - MX, 316, rule, 1)

    drop = 0 if stats else 18
    if headline2:
        c.runs(F['fell-italic'], 54, 400 + drop, headline)
        c.runs(F['fell-italic'], 54, 462 + drop, headline2)
        sub_y = 516 + drop
    else:
        c.runs(F['fell-italic'], 58, 418 + drop, headline)
        sub_y = 476 + drop
    if sub:
        c.text(F['caslon-ionic'], 25, soft, sub, sub_y)

    if stats:
        top = 540
        c.line(MX, top - 32, W - MX, top - 32, rule, 1)
        span = (W - 2 * MX) / len(stats)
        for i, (value, label, color) in enumerate(stats):
            cx = int(MX + span * (i + 0.5))
            c.text(F['caslon-ionic'], 42, color, value, top + 12, x=cx)
            c.text(F['fell'], 21, soft, label, top + 46, x=cx, kerning=1.6)
            if i:
                x = int(MX + span * i)
                c.line(x, top - 16, x, top + 56, rule, 1)
    else:
        c.line(MX, 566, W - MX, 566, rule, 1)
        c.text(F['fell'], 19, soft, FOOTER, 598, kerning=2.4)
    return c


def build():
    return {
        'og-home': card(
            headline=[('We ', INK), ('engineer growth.', RED)],
            headline2=[('For startups that refuse to wait.', INK)],
            sub=None,
            meta_right='THE PROBLEM  ·  WHO WE WORK WITH  ·  OUR WORK',
            stats=[('5B+', 'IMPRESSIONS', RED),
                   ('10M+', 'USERS ONBOARDED', GOLD),
                   ('2M+', 'REVENUE ADDED', GREEN)],
        ),
        'og-confessions': card(
            kicker='UNFILTERED  ·  ANONYMOUS  ·  TRUE',
            headline=[('The Confession Wall', INK)],
            sub='Honest confessions from founders and operators — no names, no polish.',
            meta_right='THE CONFESSION WALL',
        ),
        'og-founders': card(
            kicker='FOR FOUNDERS  ·  GROWTH INTELLIGENCE FOR AMBITIOUS OPERATORS',
            headline=[('Building an ', INK), ('AI company', RED)],
            headline2=[('that needs to own the US market?', INK)],
            sub='Tell us what you are building. We will tell you how it grows.',
            meta_right='FOR FOUNDERS',
        ),
        'og-vc': card(
            dark=True,
            kicker='FOR VC FIRMS  ·  GROWTH INTELLIGENCE FOR AMBITIOUS OPERATORS',
            headline=[('Running a ', CREAM), ('VC portfolio', GOLD)],
            headline2=[('with AI companies ready to scale?', CREAM)],
            sub='We plug growth systems into the portfolio companies that are ready.',
            meta_right='FOR VC FIRMS',
        ),
    }


if __name__ == '__main__':
    F.update(fonts())
    os.makedirs(OUT, exist_ok=True)
    for name, c in build().items():
        path = os.path.join(OUT, name + '.jpg')
        c.render(path)
        print(name, os.path.getsize(path), 'bytes')
