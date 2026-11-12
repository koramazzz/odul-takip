"""Uygulama simgesini çizer: siyah saçlı, siyah-beyaz çubuklu formalı bir çocuk.

Kullanım: python3 tools/make_icon.py  (icons/ klasörüne yazar)
"""
from pathlib import Path

from PIL import Image, ImageDraw

CANVAS = 1024  # büyük çizilip küçültülür, kenarlar yumuşak çıkar
SIZES = (192, 512)
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "icons"

BACKGROUND = "#14995a"
SKIN = "#f6c9a0"
SKIN_SHADE = "#e9b488"
HAIR = "#15161a"
WHITE = "#ffffff"
CHEEK = (240, 120, 110, 110)
STRIPE_WIDTH = 62
CENTER_X = CANVAS // 2


def ellipse_box(cx, cy, rx, ry):
    return [cx - rx, cy - ry, cx + rx, cy + ry]


def draw_jersey(image):
    """Omuzlar: dikey siyah-beyaz çubuklar, elips biçiminde kesilir."""
    stripes = Image.new("RGBA", image.size, WHITE)
    draw = ImageDraw.Draw(stripes)
    first_stripe = CENTER_X - STRIPE_WIDTH // 2
    for x in range(first_stripe % (2 * STRIPE_WIDTH) - 2 * STRIPE_WIDTH, CANVAS, 2 * STRIPE_WIDTH):
        draw.rectangle([x, 0, x + STRIPE_WIDTH, CANVAS], fill=HAIR)
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).ellipse(ellipse_box(CENTER_X, 1040, 350, 290), fill=255)
    image.paste(stripes, (0, 0), mask)


def draw_head(draw):
    draw.rounded_rectangle([CENTER_X - 70, 640, CENTER_X + 70, 790], radius=40, fill=SKIN_SHADE)  # boyun
    draw.ellipse(ellipse_box(CENTER_X, 790, 105, 40), fill=WHITE)  # yaka
    draw.ellipse(ellipse_box(CENTER_X, 772, 78, 30), fill=SKIN_SHADE)
    for side in (-1, 1):  # kulaklar
        draw.ellipse(ellipse_box(CENTER_X + side * 228, 500, 42, 52), fill=SKIN)
    draw.ellipse(ellipse_box(CENTER_X, 440, 250, 250), fill=HAIR)  # saç
    draw.ellipse(ellipse_box(CENTER_X, 505, 215, 205), fill=SKIN)  # yüz
    fringe = [(300, 420), (360, 300), (430, 400), (500, 290), (575, 400), (650, 300), (724, 420), (700, 250), (512, 200), (324, 250)]
    draw.polygon(fringe, fill=HAIR)  # perçem


def draw_face(image, draw):
    for side in (-1, 1):
        eye_x = CENTER_X + side * 84
        draw.ellipse(ellipse_box(eye_x, 510, 24, 28), fill=HAIR)
        draw.ellipse(ellipse_box(eye_x + 8, 500, 8, 8), fill=WHITE)
        draw.arc(ellipse_box(eye_x, 462, 40, 22), 200, 340, fill=HAIR, width=12)  # kaş
    draw.arc(ellipse_box(CENTER_X, 570, 78, 62), 20, 160, fill=HAIR, width=14)  # gülümseme
    cheeks = Image.new("RGBA", image.size, (0, 0, 0, 0))
    cheek_draw = ImageDraw.Draw(cheeks)
    for side in (-1, 1):
        cheek_draw.ellipse(ellipse_box(CENTER_X + side * 140, 580, 34, 24), fill=CHEEK)
    image.alpha_composite(cheeks)


def build_icon():
    image = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    ImageDraw.Draw(image).rounded_rectangle([0, 0, CANVAS - 1, CANVAS - 1], radius=CANVAS // 5, fill=BACKGROUND)
    draw_jersey(image)
    draw = ImageDraw.Draw(image)
    draw_head(draw)
    draw_face(image, draw)
    corners = Image.new("L", image.size, 0)
    ImageDraw.Draw(corners).rounded_rectangle([0, 0, CANVAS - 1, CANVAS - 1], radius=CANVAS // 5, fill=255)
    image.putalpha(corners)
    return image


def main():
    icon = build_icon()
    for size in SIZES:
        icon.resize((size, size), Image.LANCZOS).save(OUTPUT_DIR / f"icon-{size}.png")


if __name__ == "__main__":
    main()
