#!/usr/bin/env python3
"""
ZenVero — 'Career Positioning for the AI Era' cover artwork compositor.

Takes the flat generated abstract composition (base-v2.png) as the ONLY
artwork element, rebuilds an uninterrupted ivory paper field, repositions the
composition, and typesets the exact required copy. No other text.
"""
from PIL import Image, ImageDraw, ImageFont

SRC = '/home/user/.artwork/base-v2.png'
W, H = 1600, 2000
SHIFT_DOWN = 150

F = '/home/user/.artwork/fonts'
PF_BOLD = f'{F}/pf/package/700Bold/PlayfairDisplay_700Bold.ttf'
PF_MED_IT = f'{F}/pf/package/500Medium_Italic/PlayfairDisplay_500Medium_Italic.ttf'
PF_REG = f'{F}/pf/package/400Regular/PlayfairDisplay_400Regular.ttf'
IN_REG = f'{F}/inter/package/400Regular/Inter_400Regular.ttf'
IN_SEMI = f'{F}/inter/package/600SemiBold/Inter_600SemiBold.ttf'

TITLE_1 = 'Career Positioning'
TITLE_2 = 'for the AI Era'
SUBTITLE_LINES = [
    'BUILDING SKILLS, PROOF, VISIBILITY, AND',
    'OPPORTUNITY IN A CHANGING WORLD',
]
CREDIT = 'ZenVero Editorial Studio'

DEEP_GREEN = (23, 57, 43)
BRAND_GREEN = (42, 92, 77)
MUTED_CHARCOAL = (85, 82, 75)
HAIRLINE = (188, 183, 172)


def tracked_width(font, text, tracking=0.0):
    if not text:
        return 0
    w = 0
    for i, ch in enumerate(text):
        w += font.getlength(ch)
        if i < len(text) - 1:
            w += tracking
    return w


def draw_tracked(draw, xy, text, font, fill, tracking=0.0, anchor_x='left'):
    total = tracked_width(font, text, tracking)
    x, y = xy
    if anchor_x == 'center':
        x -= total / 2.0
    for i, ch in enumerate(text):
        draw.text((x, y), ch, font=font, fill=fill, anchor='ls')
        x += font.getlength(ch) + tracking
    return total


def fit_font(path, text, max_width, start=210, tracking=0.0):
    size = start
    while size > 10:
        f = ImageFont.truetype(path, size)
        if tracked_width(f, text, tracking) <= max_width:
            return f, size
        size -= 2
    return ImageFont.truetype(path, 10), 10


def build_base(shift):
    """Normalise to exact 4:5, trim the generator's edge vignette, then slide
    the composition down. The vacated top band is filled by replicating the
    single background row that sits at the seam, which is continuous by
    construction (unlike a mirrored strip, which inverts the paper gradient
    and leaves a visible band)."""
    src = Image.open(SRC).convert('RGB')
    sw, sh = src.size
    tw = int(round(sh * 4 / 5))
    off = (sw - tw) // 2
    TRIM = 40  # the generator leaves a ~250-level bright edge on all four
    # sides (body paper is ~244.7); trim far enough to remove it entirely
    src = src.crop((off + TRIM, TRIM, off + tw - TRIM, sh - TRIM))
    w2, h2 = src.size
    th = int(round(w2 / 0.8))                                # exact 4:5
    trim = (h2 - th) // 2
    src = src.crop((0, trim, w2, trim + th))
    src = src.resize((W, H), Image.LANCZOS)

    base = src.copy()
    # continuity requires matching the row that will sit at the seam AFTER the
    # shift, i.e. src row 0 — not src row `shift`
    seam_row = src.crop((0, 0, W, 1)).resize((W, shift), Image.NEAREST)
    base.paste(seam_row, (0, 0))
    base.paste(src.crop((0, 0, W, H - shift)), (0, shift))
    return base


def composition_top_left_wall(base, y_from, y_to):
    """Leftmost real 'ink' x within a band — used to guarantee no text collision.

    Threshold 120 cleanly separates genuine artwork (plates/lines: diff of
    several hundred) from paper texture (diff ~30), which otherwise creates
    false positives.
    """
    px = base.load()
    bg = px[6, 6]
    best = W
    for y in range(max(0, y_from), min(H, y_to), 2):
        for x in range(0, W, 2):
            p = px[x, y]
            if abs(p[0]-bg[0]) + abs(p[1]-bg[1]) + abs(p[2]-bg[2]) > 120:
                if x < best:
                    best = x
                break
    return best


def compose(base):
    canvas = base.convert('RGB')
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    margin = 150
    col = W - margin * 2

    # masthead hairline
    d.rectangle([margin, 158, W - margin, 159], fill=HAIRLINE + (255,))

    # title
    f1, s1 = fit_font(PF_BOLD, TITLE_1, int(col * 0.965))
    f2 = ImageFont.truetype(PF_MED_IT, int(s1 * 0.80))
    y = 246
    draw_tracked(d, (margin, y + s1), TITLE_1, f1, DEEP_GREEN + (255,),
                 tracking=s1 * 0.005)
    y2 = y + int(s1 * 1.30)
    draw_tracked(d, (margin, y2 + int(s1 * 0.80)), TITLE_2, f2, BRAND_GREEN + (255,))

    # subtitle
    sub_size = 29
    f3 = ImageFont.truetype(IN_REG, sub_size)
    sub_track = sub_size * 0.16
    for ln in SUBTITLE_LINES:
        assert tracked_width(f3, ln, sub_track) <= col, 'subtitle overflow'
    sub_top = y2 + int(s1 * 0.80) + 74
    sub_lh = int(sub_size * 2.0)
    sub_right = 0
    for i, line in enumerate(SUBTITLE_LINES):
        w = draw_tracked(d, (margin, sub_top + i * sub_lh), line, f3,
                         MUTED_CHARCOAL + (255,), tracking=sub_track)
        sub_right = max(sub_right, margin + w)
    sub_bottom = sub_top + (len(SUBTITLE_LINES) - 1) * sub_lh + 14

    # collision guard: text must clear the artwork in its own vertical band
    wall = composition_top_left_wall(canvas, sub_top - 40, sub_bottom + 10)
    print(f'  title size {s1}px | subtitle right edge {sub_right:.0f}px '
          f'| artwork left wall in that band {wall}px')
    assert sub_right < wall - 24, f'COLLISION: subtitle {sub_right} vs artwork {wall}'

    # author credit + supporting rule
    rule_y = H - 262
    d.rectangle([margin, rule_y, margin + 124, rule_y + 1], fill=HAIRLINE + (255,))
    f4 = ImageFont.truetype(IN_SEMI, 23)
    draw_tracked(d, (margin, H - 178), CREDIT.upper(), f4, BRAND_GREEN + (255,),
                 tracking=23 * 0.27)
    return Image.alpha_composite(canvas.convert('RGBA'), layer).convert('RGB')


if __name__ == '__main__':
    base = build_base(SHIFT_DOWN)
    cover = compose(base)
    out = '/home/user/zenvero-storefront/public/covers/career-positioning-ai-era-cover.jpg'
    cover.save(out, 'JPEG', quality=92, subsampling=0, optimize=True)
    print('saved', out, cover.size)
