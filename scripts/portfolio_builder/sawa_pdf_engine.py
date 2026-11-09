# -*- coding: utf-8 -*-
import os, html as htmllib
import pymupdf
from PIL import Image, ImageOps, ImageDraw
from sawa_data import BRAND, CONTENT

W, H = 960.0, 540.0
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ASSETS_DIR = os.path.join(ROOT_DIR, "portfolio", "assets")
OUT_DIR = os.path.join(ROOT_DIR, "portfolio")
PREP_DIR = os.environ.get("SAWA_PREP_DIR", "/tmp/prepared_imgs")
os.makedirs(PREP_DIR, exist_ok=True)

FONT_ARCH = pymupdf.Archive(os.environ.get("SAWA_FONT_DIR", os.path.join(os.path.dirname(__file__), "fonts")))

BASE_CSS = """
@font-face { font-family: 'Cairo'; src: url(Cairo-Regular.ttf); font-weight: 400; }
@font-face { font-family: 'Cairo'; src: url(Cairo-SemiBold.ttf); font-weight: 600; }
@font-face { font-family: 'Cairo'; src: url(Cairo-Bold.ttf); font-weight: 700; }
@font-face { font-family: 'Cairo'; src: url(Cairo-ExtraBold.ttf); font-weight: 800; }
@font-face { font-family: 'Manrope'; src: url(Manrope-Regular.ttf); font-weight: 400; }
@font-face { font-family: 'Manrope'; src: url(Manrope-SemiBold.ttf); font-weight: 600; }
@font-face { font-family: 'Manrope'; src: url(Manrope-Bold.ttf); font-weight: 700; }
@font-face { font-family: 'Manrope'; src: url(Manrope-ExtraBold.ttf); font-weight: 800; }
* { margin: 0; padding: 0; }
"""

def hex_rgb(hx):
    hx = hx.lstrip("#")
    return (int(hx[0:2], 16)/255.0, int(hx[2:4], 16)/255.0, int(hx[4:6], 16)/255.0)

def rx(x, w, rtl):
    return (W - x - w) if rtl else x

def mrect(x, y, w, h, rtl=False):
    xx = rx(x, w, rtl)
    return pymupdf.Rect(xx, y, xx + w, y + h)

def prep_photo(filename, w_pt, h_pt, radius_pt=14, overlay_alpha=0.0, key_suffix=""):
    scale = 2.0
    pw, ph = max(1, int(round(w_pt * scale))), max(1, int(round(h_pt * scale)))
    pr = int(round(radius_pt * scale))
    cache_name = f"{os.path.splitext(filename)[0]}_{pw}x{ph}_r{pr}_a{int(overlay_alpha*100)}{key_suffix}.png"
    out_path = os.path.join(PREP_DIR, cache_name)
    if os.path.exists(out_path):
        return out_path
    raw = Image.open(os.path.join(ASSETS_DIR, filename)).convert("RGBA")
    base = Image.new("RGBA", raw.size, (10, 14, 22, 255))
    src = Image.alpha_composite(base, raw)
    fitted = ImageOps.fit(src, (pw, ph), method=Image.Resampling.LANCZOS)
    if overlay_alpha > 0:
        ov = Image.new("RGBA", (pw, ph), (7, 9, 14, int(255 * overlay_alpha)))
        fitted = Image.alpha_composite(fitted, ov)
    if pr > 0:
        mask = Image.new("L", (pw, ph), 0)
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle((0, 0, pw - 1, ph - 1), radius=pr, fill=255)
        fitted.putalpha(mask)
    fitted.save(out_path, "PNG", optimize=True)
    return out_path

OVERFLOWS = []

def tbox(page, x, y, w, h, html_inner, rtl=False, align="start", pad=0, tag=""):
    r = mrect(x, y, w, h, rtl)
    if pad:
        r = pymupdf.Rect(r.x0 + pad, r.y0 + pad, r.x1 - pad, r.y1 - pad)
    # Remember MuPDF behavior verified earlier:
    # Under dir="rtl", default alignment is FLUSH RIGHT ("start"), text-align:center centers, and dir="ltr" aligns left.
    if rtl:
        if align == "start":
            wrapper = f'<div dir="rtl" style="font-family:\'Cairo\',\'Manrope\';">{html_inner}</div>'
        elif align == "center":
            wrapper = f'<div dir="rtl" style="font-family:\'Cairo\',\'Manrope\'; text-align:center;">{html_inner}</div>'
        elif align == "ltr_left":
            wrapper = f'<div dir="ltr" style="font-family:\'Manrope\',\'Cairo\'; text-align:left;">{html_inner}</div>'
        elif align == "ltr_right":
            wrapper = f'<div dir="ltr" style="font-family:\'Manrope\',\'Cairo\'; text-align:right;">{html_inner}</div>'
        else:
            wrapper = f'<div dir="rtl" style="font-family:\'Cairo\',\'Manrope\';">{html_inner}</div>'
    else:
        ta = "left" if align == "start" else ("right" if align == "end" else "center")
        wrapper = f'<div dir="ltr" style="font-family:\'Manrope\',\'Cairo\'; text-align:{ta};">{html_inner}</div>'
    spare, scale = page.insert_htmlbox(r, wrapper, css=BASE_CSS, archive=FONT_ARCH, scale_low=0.72)
    if scale < 0.999 or spare < 0:
        OVERFLOWS.append((tag, spare, scale))
    return spare, scale

def draw_box(page, x, y, w, h, fill=None, stroke=None, stroke_w=0.8, radius=12, rtl=False, dashes=None):
    r = mrect(x, y, w, h, rtl)
    rad = min(radius / max(min(w, h), 1.0), 0.48) if radius > 0 else None
    page.draw_rect(
        r,
        color=hex_rgb(stroke) if stroke else None,
        fill=hex_rgb(fill) if fill else None,
        width=stroke_w,
        radius=rad,
        dashes=dashes,
    )
    return r

def draw_bg_and_chrome(page, d, slide_num, total_slides, dark=True, is_exec=False):
    rtl = d["rtl"]
    bg = BRAND["obsidian"] if dark else BRAND["ivory"]
    line_c = BRAND["obsidian_line"] if dark else BRAND["ivory_line"]
    muted_c = BRAND["muted_dark"] if dark else BRAND["muted_light"]
    gold_c = BRAND["gold_bright"] if dark else BRAND["gold_deep"]

    page.draw_rect(page.rect, color=None, fill=hex_rgb(bg))

    # Subtle architectural corner accent lines
    sh = page.new_shape()
    if dark:
        # Subtle warm gold top hairline
        page.draw_rect(pymupdf.Rect(0, 0, W, 3), color=None, fill=hex_rgb(BRAND["gold"]))
    else:
        page.draw_rect(pymupdf.Rect(0, 0, W, 3), color=None, fill=hex_rgb(BRAND["gold"]))

    # Top Header Bar (y=18..48)
    doc_lbl = d["doc_label_exec"] if is_exec else d["doc_label_full"]
    tbox(
        page, 46, 20, 480, 22,
        f'<span style="font-size:8.5pt; font-weight:700; color:{gold_c}; letter-spacing:0.6pt;">{htmllib.escape(doc_lbl)}</span>',
        rtl=rtl, align="start", tag=f"hdr_{slide_num}"
    )
    # Mini obsidian logo chip on opposite top corner
    chip_x = 812
    draw_box(page, chip_x, 14, 102, 30, fill="#080B11", stroke=BRAND["gold"] if not dark else "#243146", stroke_w=0.7, radius=8, rtl=rtl)
    logo_r = mrect(chip_x + 26, 16, 50, 26, rtl=rtl)
    page.insert_image(logo_r, filename=os.path.join(ASSETS_DIR, "logo-transparent.png"), keep_proportion=True)

    # Hairline under header
    page.draw_line(pymupdf.Point(46, 50), pymupdf.Point(W - 46, 50), color=hex_rgb(line_c), width=0.6)

    # Bottom Footer Bar (y=508..530)
    page.draw_line(pymupdf.Point(46, 504), pymupdf.Point(W - 46, 504), color=hex_rgb(line_c), width=0.6)
    tbox(
        page, 46, 510, 380, 20,
        f'<span style="font-size:8pt; font-weight:600; color:{muted_c};">{htmllib.escape(d["footer_right"])}</span>',
        rtl=rtl, align="start", tag=f"ftrR_{slide_num}"
    )
    # Page number pill in center
    pg_str = f"{slide_num:02d} / {total_slides:02d}"
    tbox(
        page, 430, 510, 100, 20,
        f'<span style="font-family:\'Manrope\'; font-size:8.5pt; font-weight:800; color:{gold_c};">{pg_str}</span>',
        rtl=False, align="center", tag=f"pg_{slide_num}"
    )
    # LTR domain + phone on opposite footer side
    opp_align = "ltr_left" if rtl else "end"
    tbox(
        page, 560, 510, 354, 20,
        f'<span style="font-family:\'Manrope\'; font-size:8pt; font-weight:600; color:{muted_c};">{htmllib.escape(d["footer_left"])}</span>',
        rtl=rtl, align=opp_align, tag=f"ftrL_{slide_num}"
    )

def section_heading(page, d, kicker, title, sub=None, dark=True, max_w=868, y=60):
    rtl = d["rtl"]
    gold_c = BRAND["gold_bright"] if dark else BRAND["gold_deep"]
    ink_c = BRAND["ink_dark"] if dark else BRAND["ink_light"]
    muted_c = BRAND["muted_dark"] if dark else BRAND["muted_light"]
    h_font = "Cairo" if rtl else "Manrope"

    # Gold accent bar next to kicker
    draw_box(page, 46, y + 6, 20, 2.5, fill=BRAND["gold"], radius=1, rtl=rtl)
    tbox(
        page, 72, y, max_w - 26, 18,
        f'<span style="font-family:\'{h_font}\'; font-size:8.8pt; font-weight:800; color:{gold_c};">{htmllib.escape(kicker)}</span>',
        rtl=rtl, align="start", tag="kicker"
    )
    title_sz = "19.5pt" if (len(title) < 52 and max_w > 520) else "17.5pt"
    tbox(
        page, 46, y + 19, max_w, 36,
        f'<span style="font-family:\'{h_font}\'; font-size:{title_sz}; font-weight:800; color:{ink_c}; line-height:1.22;">{htmllib.escape(title)}</span>',
        rtl=rtl, align="start", tag="title"
    )
    if sub:
        tbox(
            page, 46, y + 54, max_w, 34,
            f'<span style="font-size:10pt; font-weight:500; color:{muted_c}; line-height:1.45;">{htmllib.escape(sub)}</span>',
            rtl=rtl, align="start", tag="sub"
        )
        return y + 92
    return y + 60


# ==================== SLIDE BUILDERS (18 FULL SLIDES) ====================

def build_s01_cover(doc, d, is_exec=False):
    page = doc.new_page(width=W, height=H)
    rtl = d["rtl"]
    s = d["s01"]
    h_font = "Cairo" if rtl else "Manrope"

    page.draw_rect(page.rect, color=None, fill=hex_rgb(BRAND["obsidian"]))
    page.draw_rect(pymupdf.Rect(0, 0, W, 4), color=None, fill=hex_rgb(BRAND["gold"]))

    # Visual half: panoramic ecosystem hero photo framed on opposite side
    img_path = prep_photo("ecosystem-hero.jpg", 430, 412, radius_pt=20, overlay_alpha=0.22)
    img_r = mrect(484, 34, 430, 412, rtl=rtl)
    page.insert_image(img_r, filename=img_path)
    draw_box(page, 484, 34, 430, 412, fill=None, stroke=BRAND["gold"], stroke_w=0.9, radius=20, rtl=rtl)
    visual_note = "صورة توضيحية" if rtl else "Illustrative image"
    draw_box(page, 754, 414, 144, 22, fill=BRAND["obsidian"], stroke=BRAND["gold"], stroke_w=0.6, radius=8, rtl=rtl)
    tbox(page, 762, 418, 128, 14, f'<span style="font-size:7.5pt;font-weight:700;color:{BRAND["silver"]};">{visual_note}</span>', rtl=rtl, align="center", tag="s01_visual_note")

    # Prominent official 3D Metallic Logo
    logo_r = mrect(46, 36, 152, 132, rtl=rtl)
    page.insert_image(logo_r, filename=os.path.join(ASSETS_DIR, "logo-transparent.png"), keep_proportion=True)

    eyebrow = d["doc_label_exec"] if is_exec else s["eyebrow"]
    draw_box(page, 46, 180, 396, 26, fill=BRAND["obsidian_card"], stroke=BRAND["gold"], stroke_w=0.7, radius=13, rtl=rtl)
    tbox(
        page, 58, 185, 372, 18,
        f'<span style="font-family:\'Manrope\',\'Cairo\'; font-size:8.2pt; font-weight:800; color:{BRAND["gold_bright"]};">{htmllib.escape(eyebrow)}</span>',
        rtl=rtl, align="start", tag="s01_eye"
    )

    tbox(
        page, 46, 218, 418, 48,
        f'<span style="font-family:\'{h_font}\'; font-size:29pt; font-weight:800; color:{BRAND["ink_dark"]}; line-height:1.15;">{htmllib.escape(s["title"])}</span>',
        rtl=rtl, align="start", tag="s01_title"
    )
    tbox(
        page, 46, 264, 418, 28,
        f'<span style="font-family:\'Cairo\',\'Manrope\'; font-size:14pt; font-weight:700; color:{BRAND["gold_bright"]};">{htmllib.escape(s["subtitle"])}</span>',
        rtl=rtl, align="start", tag="s01_sub"
    )

    # Gold divider bar
    draw_box(page, 46, 298, 76, 3, fill=BRAND["gold"], radius=1.5, rtl=rtl)

    tbox(
        page, 46, 312, 418, 86,
        f'<span style="font-size:10.5pt; font-weight:500; color:{BRAND["silver"]}; line-height:1.58;">{htmllib.escape(s["lead"])}</span>',
        rtl=rtl, align="start", tag="s01_lead"
    )

    tbox(
        page, 46, 404, 418, 26,
        f'<span style="font-family:\'{h_font}\'; font-size:11.5pt; font-weight:800; color:{BRAND["gold_bright"]};">{htmllib.escape(d["tagline"])}</span>',
        rtl=rtl, align="start", tag="s01_tag"
    )

    # Bottom 4-sector dock spanning full width
    dock_y = 460
    cw = (868 - 3 * 12) / 4.0
    for idx, (sec_name, dom, acc_key) in enumerate(s["sectors_bar"]):
        cx = 46 + idx * (cw + 12)
        acc = BRAND[acc_key]
        draw_box(page, cx, dock_y, cw, 56, fill=BRAND["obsidian_card"], stroke=BRAND["obsidian_line"], stroke_w=0.8, radius=11, rtl=rtl)
        draw_box(page, cx, dock_y, cw, 3.5, fill=acc, radius=2, rtl=rtl)
        tbox(
            page, cx + 12, dock_y + 10, cw - 24, 20,
            f'<span style="font-family:\'{h_font}\'; font-size:9.5pt; font-weight:800; color:{BRAND["ink_dark"]};">{htmllib.escape(sec_name)}</span>',
            rtl=rtl, align="start", tag=f"s01_sec_{idx}"
        )
        tbox(
            page, cx + 12, dock_y + 31, cw - 24, 18,
            f'<span style="font-family:\'Manrope\'; font-size:8.2pt; font-weight:700; color:{acc};">{htmllib.escape(dom)}</span>',
            rtl=rtl, align="ltr_right" if rtl else "start", tag=f"s01_dom_{idx}"
        )

def build_s02_about(doc, d, num, total, is_exec=False):
    page = doc.new_page(width=W, height=H)
    rtl = d["rtl"]
    s = d["s02"]
    h_font = "Cairo" if rtl else "Manrope"

    draw_bg_and_chrome(page, d, num, total, dark=False, is_exec=is_exec)
    y0 = section_heading(page, d, s["kicker"], s["title"], dark=False, max_w=486, y=58)

    # Narrative card on start side
    draw_box(page, 46, 128, 488, 224, fill=BRAND["ivory_card"], stroke=BRAND["ivory_line"], stroke_w=0.9, radius=14, rtl=rtl)
    tbox(
        page, 64, 142, 452, 68,
        f'<span style="font-size:10.3pt; font-weight:600; color:{BRAND["ink_light"]}; line-height:1.56;">{htmllib.escape(s["p1"])}</span>',
        rtl=rtl, align="start", tag="s02_p1"
    )
    tbox(
        page, 64, 210, 452, 82,
        f'<span style="font-size:9.8pt; font-weight:400; color:{BRAND["muted_light"]}; line-height:1.56;">{htmllib.escape(s["p2"])}</span>',
        rtl=rtl, align="start", tag="s02_p2"
    )
    # Quote strip inside narrative card
    draw_box(page, 64, 296, 452, 42, fill=BRAND["ivory2"], stroke=BRAND["gold"], stroke_w=0.8, radius=9, rtl=rtl)
    tbox(
        page, 76, 303, 428, 30,
        f'<span style="font-family:\'{h_font}\'; font-size:9.2pt; font-weight:700; color:{BRAND["gold_deep"]}; line-height:1.4;">{htmllib.escape(s["quote"])}</span>',
        rtl=rtl, align="start", tag="s02_q"
    )

    # Corporate Skyline Photo on opposite side
    img_p = prep_photo("skyline-corporate.jpg", 364, 286, radius_pt=16, overlay_alpha=0.08)
    page.insert_image(mrect(550, 66, 364, 286, rtl=rtl), filename=img_p)
    draw_box(page, 550, 66, 364, 286, fill=None, stroke=BRAND["gold"], stroke_w=0.9, radius=16, rtl=rtl)
    visual_note = "صورة توضيحية" if rtl else "Illustrative image"
    draw_box(page, 748, 320, 150, 22, fill=BRAND["obsidian"], stroke=BRAND["gold"], stroke_w=0.6, radius=8, rtl=rtl)
    tbox(page, 756, 324, 134, 14, f'<span style="font-size:7.5pt;font-weight:700;color:{BRAND["silver"]};">{visual_note}</span>', rtl=rtl, align="center", tag="s02_visual_note")

    # Structural website-content cards across bottom
    kw = (868 - 4 * 11) / 5.0
    ky = 368
    for idx, (val, lbl) in enumerate(s["kpis"]):
        kx = 46 + idx * (kw + 11)
        draw_box(page, kx, ky, kw, 96, fill=BRAND["obsidian"], stroke=BRAND["gold"], stroke_w=0.8, radius=12, rtl=rtl)
        tbox(
            page, kx + 12, ky + 12, kw - 24, 36,
            f'<span style="font-family:\'Manrope\'; font-size:22pt; font-weight:800; color:{BRAND["gold_bright"]};">{htmllib.escape(val)}</span>',
            rtl=rtl, align="ltr_right" if rtl else "start", tag=f"s02_kv_{idx}"
        )
        tbox(
            page, kx + 12, ky + 52, kw - 24, 36,
            f'<span style="font-size:8.8pt; font-weight:600; color:{BRAND["silver"]}; line-height:1.35;">{htmllib.escape(lbl)}</span>',
            rtl=rtl, align="start", tag=f"s02_kl_{idx}"
        )

    tbox(
        page, 46, 472, 868, 22,
        f'<span style="font-size:8pt; font-weight:500; color:{BRAND["muted_light"]};">{htmllib.escape(s["note"])}</span>',
        rtl=rtl, align="start", tag="s02_note"
    )

def build_s03_vision(doc, d, num, total):
    page = doc.new_page(width=W, height=H)
    rtl = d["rtl"]
    s = d["s03"]
    h_font = "Cairo" if rtl else "Manrope"

    draw_bg_and_chrome(page, d, num, total, dark=True)
    section_heading(page, d, s["kicker"], s["title"], dark=True, y=58)

    # Top Twin Cards: Vision & Mission
    cw = (868 - 16) / 2.0
    for idx, (ct, cp, acc) in enumerate([
        (s["vision_t"], s["vision_p"], BRAND["gold_bright"]),
        (s["mission_t"], s["mission_p"], BRAND["estate"]),
    ]):
        cx = 46 + idx * (cw + 16)
        draw_box(page, cx, 118, cw, 118, fill=BRAND["obsidian_card"], stroke=BRAND["gold"], stroke_w=0.9, radius=14, rtl=rtl)
        draw_box(page, cx, 118, 6, 118, fill=acc, radius=3, rtl=rtl)
        tbox(
            page, cx + 20, 130, cw - 34, 24,
            f'<span style="font-family:\'{h_font}\'; font-size:13pt; font-weight:800; color:{BRAND["gold_bright"]};">{htmllib.escape(ct)}</span>',
            rtl=rtl, align="start", tag=f"s03_vm_t{idx}"
        )
        tbox(
            page, cx + 20, 156, cw - 34, 70,
            f'<span style="font-size:9.8pt; font-weight:500; color:{BRAND["silver"]}; line-height:1.55;">{htmllib.escape(cp)}</span>',
            rtl=rtl, align="start", tag=f"s03_vm_p{idx}"
        )

    # Middle 3 Strategic Objectives (BUILD / OPERATE / INVEST)
    ow = (868 - 2 * 14) / 3.0
    oy = 250
    obj_colors = [BRAND["estate"], BRAND["food"], BRAND["oil"]]
    for idx, (ot, op) in enumerate(s["objectives"]):
        ox = 46 + idx * (ow + 14)
        draw_box(page, ox, oy, ow, 96, fill="#0E1520", stroke=BRAND["obsidian_line"], stroke_w=0.8, radius=12, rtl=rtl)
        draw_box(page, ox + 16, oy + 14, 34, 3, fill=obj_colors[idx], radius=1.5, rtl=rtl)
        tbox(
            page, ox + 16, oy + 22, ow - 32, 22,
            f'<span style="font-family:\'{h_font}\'; font-size:11pt; font-weight:800; color:{BRAND["ink_dark"]};">{htmllib.escape(ot)}</span>',
            rtl=rtl, align="start", tag=f"s03_ot_{idx}"
        )
        tbox(
            page, ox + 16, oy + 45, ow - 32, 44,
            f'<span style="font-size:8.9pt; font-weight:400; color:{BRAND["muted_dark"]}; line-height:1.45;">{htmllib.escape(op)}</span>',
            rtl=rtl, align="start", tag=f"s03_op_{idx}"
        )

    # Bottom 4 Core Values
    vw = (868 - 3 * 12) / 4.0
    vy = 360
    for idx, (vt, vp) in enumerate(s["values"]):
        vx = 46 + idx * (vw + 12)
        draw_box(page, vx, vy, vw, 128, fill=BRAND["obsidian_card"], stroke=BRAND["obsidian_line"], stroke_w=0.8, radius=12, rtl=rtl)
        # Number badge
        draw_box(page, vx + 14, vy + 14, 28, 22, fill="#1C2638", stroke=BRAND["gold"], stroke_w=0.6, radius=6, rtl=rtl)
        tbox(
            page, vx + 14, vy + 17, 28, 18,
            f'<span style="font-family:\'Manrope\'; font-size:8.5pt; font-weight:800; color:{BRAND["gold_bright"]};">0{idx+1}</span>',
            rtl=False if not rtl else True, align="center", tag=f"s03_vn_{idx}"
        )
        tbox(
            page, vx + 14, vy + 44, vw - 28, 22,
            f'<span style="font-family:\'{h_font}\'; font-size:10.5pt; font-weight:800; color:{BRAND["gold_bright"]};">{htmllib.escape(vt)}</span>',
            rtl=rtl, align="start", tag=f"s03_vt_{idx}"
        )
        tbox(
            page, vx + 14, vy + 68, vw - 28, 52,
            f'<span style="font-size:8.7pt; font-weight:400; color:{BRAND["silver"]}; line-height:1.42;">{htmllib.escape(vp)}</span>',
            rtl=rtl, align="start", tag=f"s03_vp_{idx}"
        )

def build_s04_ecosystem(doc, d, num, total, is_exec=False):
    page = doc.new_page(width=W, height=H)
    rtl = d["rtl"]
    s = d["s04"]
    h_font = "Cairo" if rtl else "Manrope"

    draw_bg_and_chrome(page, d, num, total, dark=False, is_exec=is_exec)
    section_heading(page, d, s["kicker"], s["title"], s["sub"], dark=False, y=58)

    # Central Parent Hub Bar
    draw_box(page, 250, 152, 460, 52, fill=BRAND["obsidian"], stroke=BRAND["gold"], stroke_w=1.2, radius=14, rtl=False)
    tbox(
        page, 265, 158, 430, 22,
        f'<span style="font-family:\'Manrope\',\'Cairo\'; font-size:12pt; font-weight:800; color:{BRAND["gold_bright"]};">{htmllib.escape(s["hub_title"])}</span>',
        rtl=rtl, align="center", tag="s04_hub_t"
    )
    tbox(
        page, 265, 180, 430, 18,
        f'<span style="font-size:8.5pt; font-weight:600; color:{BRAND["silver"]};">{htmllib.escape(s["hub_sub"])}</span>',
        rtl=rtl, align="center", tag="s04_hub_s"
    )

    # Connector lines from Hub down to 4 sector cards
    cw = (868 - 3 * 14) / 4.0
    cy = 224
    page.draw_line(pymupdf.Point(480, 204), pymupdf.Point(480, 214), color=hex_rgb(BRAND["gold"]), width=1.4)
    c_first = rx(46 + cw/2, 0, rtl)
    c_last = rx(46 + 3*(cw+14) + cw/2, 0, rtl)
    page.draw_line(pymupdf.Point(min(c_first, c_last), 214), pymupdf.Point(max(c_first, c_last), 214), color=hex_rgb(BRAND["gold"]), width=1.2)

    for idx, (num_s, name, brand_sub, dom, acc_k, desc) in enumerate(s["sectors"]):
        cx = 46 + idx * (cw + 14)
        acc = BRAND[acc_k]
        mid_x = rx(cx + cw/2, 0, rtl)
        page.draw_line(pymupdf.Point(mid_x, 214), pymupdf.Point(mid_x, cy), color=hex_rgb(acc), width=1.4)

        draw_box(page, cx, cy, cw, 212, fill=BRAND["ivory_card"], stroke=BRAND["ivory_line"], stroke_w=1.0, radius=14, rtl=rtl)
        draw_box(page, cx, cy, cw, 5, fill=acc, radius=2.5, rtl=rtl)

        # Sector number + domain pill
        draw_box(page, cx + 14, cy + 16, 32, 22, fill=acc, radius=6, rtl=rtl)
        tbox(
            page, cx + 14, cy + 19, 32, 18,
            f'<span style="font-family:\'Manrope\'; font-size:8.8pt; font-weight:800; color:#FFFFFF;">{num_s}</span>',
            rtl=rtl, align="center", tag=f"s04_n_{idx}"
        )
        tbox(
            page, cx + 52, cy + 19, cw - 66, 18,
            f'<span style="font-family:\'Manrope\'; font-size:8.2pt; font-weight:800; color:{acc};">{htmllib.escape(dom)}</span>',
            rtl=rtl, align="ltr_right" if rtl else "start", tag=f"s04_d_{idx}"
        )

        tbox(
            page, cx + 14, cy + 48, cw - 28, 38,
            f'<span style="font-family:\'{h_font}\'; font-size:11pt; font-weight:800; color:{BRAND["ink_light"]}; line-height:1.28;">{htmllib.escape(name)}</span>',
            rtl=rtl, align="start", tag=f"s04_nm_{idx}"
        )
        tbox(
            page, cx + 14, cy + 88, cw - 28, 20,
            f'<span style="font-family:\'Manrope\',\'Cairo\'; font-size:8.6pt; font-weight:700; color:{BRAND["gold_deep"]};">{htmllib.escape(brand_sub)}</span>',
            rtl=rtl, align="ltr_right" if rtl else "start", tag=f"s04_bs_{idx}"
        )
        tbox(
            page, cx + 14, cy + 112, cw - 28, 90,
            f'<span style="font-size:8.8pt; font-weight:500; color:{BRAND["muted_light"]}; line-height:1.48;">{htmllib.escape(desc)}</span>',
            rtl=rtl, align="start", tag=f"s04_ds_{idx}"
        )

    # Bottom Synergy Strip
    draw_box(page, 46, 448, 868, 42, fill=BRAND["ivory2"], stroke=BRAND["gold"], stroke_w=0.8, radius=10, rtl=rtl)
    tbox(
        page, 62, 456, 836, 28,
        f'<span style="font-family:\'{h_font}\'; font-size:9pt; font-weight:700; color:{BRAND["ink_light"]};">{htmllib.escape(s["synergy"])}</span>',
        rtl=rtl, align="center", tag="s04_syn"
    )

def build_sector_page(doc, d, s_key, num, total, dark=True):
    page = doc.new_page(width=W, height=H)
    rtl = d["rtl"]
    s = d[s_key]
    acc = BRAND[s["accent"]]
    h_font = "Cairo" if rtl else "Manrope"
    card_bg = BRAND["obsidian_card"] if dark else BRAND["ivory_card"]
    card_ln = BRAND["obsidian_line"] if dark else BRAND["ivory_line"]
    ink_c = BRAND["ink_dark"] if dark else BRAND["ink_light"]
    sub_c = BRAND["silver"] if dark else BRAND["muted_light"]

    draw_bg_and_chrome(page, d, num, total, dark=dark)
    section_heading(page, d, s["kicker"], s["title"], dark=dark, max_w=560, y=58)

    # Domain badge on opposite side of title
    draw_box(page, 734, 64, 180, 30, fill=acc, radius=15, rtl=rtl)
    tbox(
        page, 744, 70, 160, 20,
        f'<span dir="ltr" style="font-family:\'Manrope\'; font-size:9.5pt; font-weight:800; color:#FFFFFF;">{htmllib.escape(s["domain"])}</span>',
        rtl=rtl, align="center", tag=f"{s_key}_dom"
    )

    # Start Column (width 492): Slogan + About + Services + Value
    draw_box(page, 46, 118, 492, 34, fill=card_bg, stroke=acc, stroke_w=0.9, radius=9, rtl=rtl)
    tbox(
        page, 58, 125, 468, 22,
        f'<span style="font-family:\'{h_font}\'; font-size:9.2pt; font-weight:700; color:{acc};">{htmllib.escape(s["slogan"])}</span>',
        rtl=rtl, align="start", tag=f"{s_key}_slg"
    )

    tbox(
        page, 46, 158, 492, 66,
        f'<span style="font-size:9.3pt; font-weight:500; color:{sub_c}; line-height:1.48;">{htmllib.escape(s["about"])}</span>',
        rtl=rtl, align="start", tag=f"{s_key}_abt"
    )

    # Services Card
    draw_box(page, 46, 226, 492, 168, fill=card_bg, stroke=card_ln, stroke_w=0.8, radius=12, rtl=rtl)
    bullets_html = "".join(
        f'<div style="margin-bottom:4.5pt; font-size:9pt; font-weight:600; color:{ink_c}; line-height:1.38;">'
        f'<span style="color:{acc}; font-weight:800;">✦ </span>{htmllib.escape(item)}</div>'
        for item in s["services"]
    )
    tbox(page, 60, 236, 464, 152, bullets_html, rtl=rtl, align="start", tag=f"{s_key}_srv")

    # Value Proposition Box
    val_bg = "#0E1624" if dark else BRAND["ivory2"]
    draw_box(page, 46, 402, 492, 88, fill=val_bg, stroke=acc, stroke_w=0.8, radius=12, rtl=rtl)
    tbox(
        page, 60, 410, 464, 20,
        f'<span style="font-family:\'{h_font}\'; font-size:9.6pt; font-weight:800; color:{acc};">{htmllib.escape(s["value_t"])}</span>',
        rtl=rtl, align="start", tag=f"{s_key}_vt"
    )
    tbox(
        page, 60, 431, 464, 54,
        f'<span style="font-size:8.9pt; font-weight:500; color:{sub_c}; line-height:1.45;">{htmllib.escape(s["value"])}</span>',
        rtl=rtl, align="start", tag=f"{s_key}_vp"
    )

    # Opposite Column (x=554, width=360): Hero Photo + 3 Highlight Metric Cards
    img_p = prep_photo(s["photo"], 360, 232, radius_pt=16, overlay_alpha=0.05)
    page.insert_image(mrect(554, 118, 360, 232, rtl=rtl), filename=img_p)
    draw_box(page, 554, 118, 360, 232, fill=None, stroke=acc, stroke_w=1.0, radius=16, rtl=rtl)
    visual_note = "صورة توضيحية — ليست صورة مشروع" if rtl else "Illustrative — not a project photo"
    draw_box(page, 690, 318, 212, 22, fill=BRAND["obsidian"], stroke=acc, stroke_w=0.6, radius=8, rtl=rtl)
    tbox(page, 698, 322, 196, 14, f'<span style="font-size:7.1pt;font-weight:700;color:{BRAND["silver"]};">{htmllib.escape(visual_note)}</span>', rtl=rtl, align="center", tag=f"{s_key}_visual_note")

    # 3 Stacked Information Cards under photo
    hy = 360
    for idx, (hv, hl) in enumerate(s["highlights"]):
        ry = hy + idx * 44
        draw_box(page, 554, ry, 360, 38, fill=card_bg, stroke=card_ln, stroke_w=0.8, radius=9, rtl=rtl)
        draw_box(page, 554, ry, 5, 38, fill=acc, radius=2.5, rtl=rtl)
        tbox(
            page, 568, ry + 9, 122, 22,
            f'<span style="font-family:\'{h_font}\'; font-size:9.8pt; font-weight:800; color:{acc};">{htmllib.escape(hv)}</span>',
            rtl=rtl, align="start", tag=f"{s_key}_hv_{idx}"
        )
        tbox(
            page, 694, ry + 10, 210, 22,
            f'<span style="font-size:8.4pt; font-weight:600; color:{ink_c};">{htmllib.escape(hl)}</span>',
            rtl=rtl, align="start", tag=f"{s_key}_hl_{idx}"
        )

def build_s09_services(doc, d, num, total):
    page = doc.new_page(width=W, height=H)
    rtl = d["rtl"]
    s = d["s09"]
    h_font = "Cairo" if rtl else "Manrope"

    draw_bg_and_chrome(page, d, num, total, dark=True)
    section_heading(page, d, s["kicker"], s["title"], s["sub"], dark=True, y=58)

    cw = (868 - 3 * 13) / 4.0
    cy = 156
    for idx, (col_t, acc_k, items, target) in enumerate(s["cols"]):
        cx = 46 + idx * (cw + 13)
        acc = BRAND[acc_k]
        draw_box(page, cx, cy, cw, 334, fill=BRAND["obsidian_card"], stroke=BRAND["obsidian_line"], stroke_w=0.9, radius=14, rtl=rtl)
        draw_box(page, cx, cy, cw, 44, fill=acc, radius=12, rtl=rtl)
        tbox(
            page, cx + 12, cy + 12, cw - 24, 24,
            f'<span style="font-family:\'{h_font}\'; font-size:10pt; font-weight:800; color:#FFFFFF;">{htmllib.escape(col_t)}</span>',
            rtl=rtl, align="center", tag=f"s09_ct_{idx}"
        )
        b_html = "".join(
            f'<div style="margin-bottom:9pt; font-size:8.9pt; font-weight:500; color:{BRAND["silver"]}; line-height:1.42;">'
            f'<span style="color:{acc}; font-weight:800;">● </span>{htmllib.escape(it)}</div>'
            for it in items
        )
        tbox(page, cx + 14, cy + 58, cw - 28, 212, b_html, rtl=rtl, align="start", tag=f"s09_it_{idx}")

        draw_box(page, cx + 10, cy + 278, cw - 20, 44, fill="#0B1018", stroke=acc, stroke_w=0.6, radius=9, rtl=rtl)
        tbox(
            page, cx + 16, cy + 286, cw - 32, 30,
            f'<span style="font-size:8pt; font-weight:700; color:{acc}; line-height:1.35;">{htmllib.escape(target)}</span>',
            rtl=rtl, align="center", tag=f"s09_tg_{idx}"
        )

def build_s10_projects(doc, d, num, total):
    page = doc.new_page(width=W, height=H)
    rtl = d["rtl"]
    s = d["s10"]
    h_font = "Cairo" if rtl else "Manrope"

    draw_bg_and_chrome(page, d, num, total, dark=False)
    section_heading(page, d, s["kicker"], s["title"], s["sub"], dark=False, y=58)

    photos = ["sector-realestate.jpg", "sector-food.jpg", "sector-automotive.jpg", "sector-petroleum.jpg"]
    cw = (868 - 16) / 2.0
    ch = 160
    for idx, (v_title, v_meta, acc_k, v_desc) in enumerate(s["ventures"]):
        col = idx % 2
        row = idx // 2
        cx = 46 + col * (cw + 16)
        cy = 156 + row * (ch + 14)
        acc = BRAND[acc_k]

        draw_box(page, cx, cy, cw, ch, fill=BRAND["ivory_card"], stroke=BRAND["ivory_line"], stroke_w=1.0, radius=14, rtl=rtl)
        # Photo thumbnail inside card
        img_p = prep_photo(photos[idx], 132, ch - 20, radius_pt=10, overlay_alpha=0.06)
        page.insert_image(mrect(cx + 10, cy + 10, 132, ch - 20, rtl=rtl), filename=img_p)
        visual_note = "توضيحية فقط" if rtl else "Illustrative only"
        draw_box(page, cx + 14, cy + 125, 124, 20, fill=BRAND["obsidian"], stroke=BRAND["gold"], stroke_w=0.5, radius=7, rtl=rtl)
        tbox(page, cx + 18, cy + 128, 116, 14, f'<span style="font-size:6.7pt;font-weight:700;color:{BRAND["silver"]};">{visual_note}</span>', rtl=rtl, align="center", tag=f"s10_visual_note_{idx}")

        tbox(
            page, cx + 154, cy + 12, cw - 166, 18,
            f'<span style="font-size:8pt; font-weight:800; color:{acc};">{htmllib.escape(v_meta)}</span>',
            rtl=rtl, align="start", tag=f"s10_vm_{idx}"
        )
        tbox(
            page, cx + 154, cy + 30, cw - 166, 22,
            f'<span style="font-family:\'Manrope\'; font-size:10.5pt; font-weight:800; color:{BRAND["ink_light"]};">{htmllib.escape(v_title)}</span>',
            rtl=rtl, align="ltr_right" if rtl else "start", tag=f"s10_vt_{idx}"
        )
        tbox(
            page, cx + 154, cy + 54, cw - 166, 98,
            f'<span style="font-size:8.3pt; font-weight:500; color:{BRAND["muted_light"]}; line-height:1.42;">{htmllib.escape(v_desc)}</span>',
            rtl=rtl, align="start", tag=f"s10_vd_{idx}"
        )

def build_s11_capabilities_and_model(doc, d, num, total):
    """Shows the website-content inventory and reader verification steps on slide 11."""
    page = doc.new_page(width=W, height=H)
    rtl = d["rtl"]
    s11 = d["s11"]
    s12 = d["s12"]
    h_font = "Cairo" if rtl else "Manrope"

    draw_bg_and_chrome(page, d, num, total, dark=True)
    section_heading(page, d, s11["kicker"], s11["title"], s11["sub"], dark=True, y=58)

    # The panels sit below the disclosure subtitle; counts refer only to visible site content.
    draw_box(page, 46, 158, 452, 332, fill=BRAND["obsidian_card"], stroke=BRAND["obsidian_line"], stroke_w=0.9, radius=14, rtl=rtl)
    sub_h1 = "عناصر المحتوى المدرجة" if rtl else "Listed website content"
    tbox(
        page, 62, 166, 420, 22,
        f'<span style="font-family:\'{h_font}\'; font-size:11pt; font-weight:800; color:{BRAND["gold_bright"]};">{htmllib.escape(sub_h1)}</span>',
        rtl=rtl, align="start", tag="s11_h1"
    )

    by = 196
    for idx, (lbl, val_txt, ratio, acc_k) in enumerate(s11["bars"]):
        ry = by + idx * 46
        acc = BRAND[acc_k]
        tbox(
            page, 62, ry, 280, 18,
            f'<span style="font-size:8.4pt; font-weight:600; color:{BRAND["silver"]};">{htmllib.escape(lbl)}</span>',
            rtl=rtl, align="start", tag=f"s11_bl_{idx}"
        )
        if rtl:
            # Place at mirrored x (rx(320, 162, True) = 478..640) aligned to left end of the RTL row!
            r_val = mrect(320, ry, 162, 18, rtl=True)
            page.insert_htmlbox(
                r_val,
                f'<div dir="rtl" style="font-family:\'Cairo\',\'Manrope\'; font-size:8.2pt; font-weight:800; color:{acc}; text-align:right;">&#x200F;{htmllib.escape(val_txt)}</div>',
                css=BASE_CSS, archive=FONT_ARCH, scale_low=0.75
            )
        else:
            tbox(
                page, 336, ry, 146, 18,
                f'<span style="font-family:\'Manrope\'; font-size:8.4pt; font-weight:800; color:{acc};">{htmllib.escape(val_txt)}</span>',
                rtl=False, align="end", tag=f"s11_bv_{idx}"
            )
        # Track & Fill bar
        draw_box(page, 62, ry + 22, 420, 9, fill="#090D14", radius=4.5, rtl=rtl)
        draw_box(page, 62, ry + 22, 420 * ratio, 9, fill=acc, radius=4.5, rtl=rtl)

    # Reader guidance is kept separate from the website-content counts.
    draw_box(page, 514, 158, 400, 332, fill=BRAND["obsidian_card"], stroke=BRAND["gold"], stroke_w=0.9, radius=14, rtl=rtl)
    sub_h2 = "قائمة تحقق للقارئ" if rtl else "Reader verification checklist"
    tbox(
        page, 530, 166, 368, 22,
        f'<span style="font-family:\'{h_font}\'; font-size:11pt; font-weight:800; color:{BRAND["gold_bright"]};">{htmllib.escape(sub_h2)}</span>',
        rtl=rtl, align="start", tag="s11_h2"
    )

    sy = 196
    for idx, (st_n, st_t, st_p) in enumerate(s12["steps"]):
        ry = sy + idx * 55
        draw_box(page, 530, ry, 368, 52, fill="#0C121C", stroke=BRAND["obsidian_line"], stroke_w=0.7, radius=10, rtl=rtl)
        draw_box(page, 538, ry + 8, 32, 36, fill=BRAND["gold"], radius=7, rtl=rtl)
        tbox(
            page, 538, ry + 16, 32, 22,
            f'<span style="font-family:\'Manrope\'; font-size:9.5pt; font-weight:800; color:#080B10;">{st_n}</span>',
            rtl=rtl, align="center", tag=f"s11_sn_{idx}"
        )
        tbox(
            page, 578, ry + 4, 312, 18,
            f'<span style="font-family:\'{h_font}\'; font-size:9.4pt; font-weight:800; color:{BRAND["ink_dark"]};">{htmllib.escape(st_t)}</span>',
            rtl=rtl, align="start", tag=f"s11_st_{idx}"
        )
        tbox(
            page, 578, ry + 22, 312, 28,
            f'<span style="font-size:7.9pt; font-weight:400; color:{BRAND["muted_dark"]}; line-height:1.35;">{htmllib.escape(st_p)}</span>',
            rtl=rtl, align="start", tag=f"s11_sp_{idx}"
        )

def build_s12_competitive(doc, d, num, total, is_exec=False):
    page = doc.new_page(width=W, height=H)
    rtl = d["rtl"]
    s = d["s13"]
    h_font = "Cairo" if rtl else "Manrope"

    draw_bg_and_chrome(page, d, num, total, dark=False, is_exec=is_exec)
    section_heading(page, d, s["kicker"], s["title"], s["sub"], dark=False, y=58)

    # Signature 3 + 2 Bento Grid matching sawaunited.net
    top_w = (868 - 2 * 14) / 3.0
    bot_w = (868 - 14) / 2.0
    accents = [BRAND["gold"], BRAND["oil"], BRAND["estate"], BRAND["food"], BRAND["car"]]

    for idx, (p_num, p_title, p_desc) in enumerate(s["pillars"]):
        if idx < 3:
            cx = 46 + idx * (top_w + 14)
            cy, cw, ch = 156, top_w, 160
        else:
            cx = 46 + (idx - 3) * (bot_w + 14)
            cy, cw, ch = 330, bot_w, 154
        acc = accents[idx]
        draw_box(page, cx, cy, cw, ch, fill=BRAND["ivory_card"], stroke=BRAND["ivory_line"], stroke_w=1.0, radius=14, rtl=rtl)
        draw_box(page, cx, cy, cw, 4, fill=acc, radius=2, rtl=rtl)
        draw_box(page, cx + 16, cy + 16, 34, 24, fill=BRAND["obsidian"], radius=6, rtl=rtl)
        tbox(
            page, cx + 16, cy + 20, 34, 18,
            f'<span style="font-family:\'Manrope\'; font-size:9pt; font-weight:800; color:{BRAND["gold_bright"]};">{p_num}</span>',
            rtl=rtl, align="center", tag=f"s12_pn_{idx}"
        )
        tbox(
            page, cx + 16, cy + 48, cw - 32, 28,
            f'<span style="font-family:\'{h_font}\'; font-size:11pt; font-weight:800; color:{BRAND["ink_light"]}; line-height:1.25;">{htmllib.escape(p_title)}</span>',
            rtl=rtl, align="start", tag=f"s12_pt_{idx}"
        )
        tbox(
            page, cx + 16, cy + 80, cw - 32, ch - 90,
            f'<span style="font-size:8.9pt; font-weight:500; color:{BRAND["muted_light"]}; line-height:1.46;">{htmllib.escape(p_desc)}</span>',
            rtl=rtl, align="start", tag=f"s12_pd_{idx}"
        )

def build_s13_partners(doc, d, num, total):
    page = doc.new_page(width=W, height=H)
    rtl = d["rtl"]
    s = d["s14"]
    h_font = "Cairo" if rtl else "Manrope"

    draw_bg_and_chrome(page, d, num, total, dark=True)
    section_heading(page, d, s["kicker"], s["title"], s["sub"], dark=True, y=58)

    # Top 3 Verified Institutional Credibility Cards
    cw = (868 - 2 * 14) / 3.0
    acc_list = [BRAND["oil"], BRAND["food"], BRAND["gold_bright"]]
    for idx, (tag_t, main_t, desc_t) in enumerate(s["verified_badges"]):
        cx = 46 + idx * (cw + 14)
        acc = acc_list[idx]
        draw_box(page, cx, 158, cw, 146, fill=BRAND["obsidian_card"], stroke=acc, stroke_w=0.9, radius=14, rtl=rtl)
        tbox(
            page, cx + 16, 170, cw - 32, 18,
            f'<span style="font-size:8.2pt; font-weight:800; color:{acc};">{htmllib.escape(tag_t)}</span>',
            rtl=rtl, align="start", tag=f"s13_bt_{idx}"
        )
        tbox(
            page, cx + 16, 192, cw - 32, 34,
            f'<span style="font-family:\'{h_font}\'; font-size:10.5pt; font-weight:800; color:{BRAND["ink_dark"]}; line-height:1.28;">{htmllib.escape(main_t)}</span>',
            rtl=rtl, align="start", tag=f"s13_bm_{idx}"
        )
        tbox(
            page, cx + 16, 232, cw - 32, 64,
            f'<span style="font-size:8.6pt; font-weight:400; color:{BRAND["silver"]}; line-height:1.45;">{htmllib.escape(desc_t)}</span>',
            rtl=rtl, align="start", tag=f"s13_bd_{idx}"
        )

    # Bottom Reserved Logo Showcase Grid (Zero Fabrication!)
    tbox(
        page, 46, 318, 868, 20,
        f'<span style="font-family:\'{h_font}\'; font-size:9.5pt; font-weight:700; color:{BRAND["gold_bright"]};">{htmllib.escape(s["slots_title"])}</span>',
        rtl=rtl, align="start", tag="s13_slt_h"
    )
    sw = (868 - 2 * 14) / 3.0
    sh_h = 64
    for idx, slot_lbl in enumerate(s["slots"]):
        col = idx % 3
        row = idx // 3
        sx = 46 + col * (sw + 14)
        sy = 344 + row * (sh_h + 12)
        draw_box(page, sx, sy, sw, sh_h, fill="#0B1018", stroke=BRAND["gold"], stroke_w=0.8, radius=10, rtl=rtl, dashes="[4 4] 0")
        tbox(
            page, sx + 12, sy + 22, sw - 24, 24,
            f'<span style="font-size:8.8pt; font-weight:600; color:{BRAND["muted_dark"]};">{htmllib.escape(slot_lbl)}</span>',
            rtl=rtl, align="center", tag=f"s13_sl_{idx}"
        )

def build_s14_websites(doc, d, num, total, is_exec=False):
    page = doc.new_page(width=W, height=H)
    rtl = d["rtl"]
    s = d["s15"]
    h_font = "Cairo" if rtl else "Manrope"

    draw_bg_and_chrome(page, d, num, total, dark=True, is_exec=is_exec)
    section_heading(page, d, s["kicker"], s["title"], s["sub"], dark=True, y=58)

    # Abstract website-link diagram; intentionally does not imply a geographic footprint.
    draw_box(page, 522, 158, 392, 326, fill=BRAND["obsidian_card"], stroke=BRAND["gold"], stroke_w=1.0, radius=16, rtl=rtl)
    draw_box(page, 596, 174, 244, 42, fill=BRAND["obsidian"], stroke=BRAND["gold"], stroke_w=0.8, radius=10, rtl=rtl)
    group_label = "SAWA UNITED GROUP"
    tbox(page, 606, 184, 224, 20, f"<span style='font-family:Manrope;font-size:10pt;font-weight:800;color:{BRAND['gold_bright']};'>{group_label}</span>", rtl=rtl, align="center", tag="s14_diagram_group")
    visual_note = "مخطط توضيحي — لا يحدد مواقع التشغيل" if rtl else "Illustrative diagram — no operating locations shown"
    for idx, (sector_name, code, domain) in enumerate(s["websites"]):
        col, row = idx % 2, idx // 2
        cx, cy = 540 + col * 184, 238 + row * 102
        draw_box(page, cx, cy, 168, 82, fill="#0B1018", stroke=BRAND["obsidian_line"], stroke_w=0.8, radius=10, rtl=rtl)
        tbox(page, cx + 10, cy + 12, 148, 26, f"<span style='font-family:{h_font};font-size:8.5pt;font-weight:800;color:{BRAND['ink_dark']};'>{htmllib.escape(sector_name)}</span>", rtl=rtl, align="center", tag=f"s14_diagram_sector_{idx}")
        tbox(page, cx + 10, cy + 44, 148, 22, f"<span style='font-family:Manrope;font-size:7.8pt;font-weight:700;color:{BRAND['gold_bright']};'>{htmllib.escape(domain)}</span>", rtl=rtl, align="center", tag=f"s14_diagram_domain_{idx}")
    tbox(page, 542, 448, 352, 26, f'<span style="font-size:7.4pt;font-weight:600;color:{BRAND["muted_dark"]};">{htmllib.escape(visual_note)}</span>', rtl=rtl, align="center", tag="s14_diagram_note")

    # Four listed website rows on the opposite side.
    ry0 = 158
    for idx, (sector_name, code, domain) in enumerate(s["websites"]):
        ry = ry0 + idx * 47
        stroke_c = BRAND["obsidian_line"]
        draw_box(page, 46, ry, 460, 41, fill=BRAND["obsidian_card"], stroke=stroke_c, stroke_w=0.8, radius=9, rtl=rtl)
        badge_bg = BRAND["gold"]
        badge_fg = "#080A0F"
        draw_box(page, 54, ry + 8, 38, 25, fill=badge_bg, radius=6, rtl=rtl)
        tbox(
            page, 54, ry + 13, 38, 18,
            f'<span style="font-family:\'Manrope\'; font-size:8.2pt; font-weight:800; color:{badge_fg};">{code}</span>',
            rtl=rtl, align="center", tag=f"s14_cd_{idx}"
        )
        tbox(
            page, 100, ry + 4, 396, 17,
            f'<span style="font-family:\'{h_font}\'; font-size:9.3pt; font-weight:800; color:{BRAND["ink_dark"]};">{htmllib.escape(sector_name)}</span>',
            rtl=rtl, align="start", tag=f"s14_cn_{idx}"
        )
        tbox(
            page, 100, ry + 21, 396, 17,
            f'<span style="font-size:8pt; font-weight:500; color:{BRAND["muted_dark"]};">{htmllib.escape(domain)}</span>',
            rtl=rtl, align="start", tag=f"s14_cs_{idx}"
        )

def build_s15_quality(doc, d, num, total):
    page = doc.new_page(width=W, height=H)
    rtl = d["rtl"]
    s = d["s17"]
    h_font = "Cairo" if rtl else "Manrope"

    draw_bg_and_chrome(page, d, num, total, dark=False)
    section_heading(page, d, s["kicker"], s["title"], s["sub"], dark=False, y=58)

    cw = (868 - 16) / 2.0
    ch = 114
    acc_list = [BRAND["estate"], BRAND["oil"], BRAND["food"], BRAND["car"]]
    for idx, (st_t, st_p) in enumerate(s["standards"]):
        col = idx % 2
        row = idx // 2
        cx = 46 + col * (cw + 16)
        cy = 158 + row * (ch + 14)
        acc = acc_list[idx]
        draw_box(page, cx, cy, cw, ch, fill=BRAND["ivory_card"], stroke=BRAND["ivory_line"], stroke_w=1.0, radius=14, rtl=rtl)
        draw_box(page, cx, cy, 6, ch, fill=acc, radius=3, rtl=rtl)
        tbox(
            page, cx + 20, cy + 16, cw - 34, 24,
            f'<span style="font-family:\'{h_font}\'; font-size:11.2pt; font-weight:800; color:{BRAND["ink_light"]};">{htmllib.escape(st_t)}</span>',
            rtl=rtl, align="start", tag=f"s15_st_{idx}"
        )
        tbox(
            page, cx + 20, cy + 44, cw - 34, 62,
            f'<span style="font-size:9pt; font-weight:500; color:{BRAND["muted_light"]}; line-height:1.48;">{htmllib.escape(st_p)}</span>',
            rtl=rtl, align="start", tag=f"s15_sp_{idx}"
        )

    # Reserved Certification Slot
    draw_box(page, 46, 416, 868, 72, fill=BRAND["ivory2"], stroke=BRAND["gold"], stroke_w=0.9, radius=12, rtl=rtl, dashes="[5 4] 0")
    tbox(
        page, 64, 426, 832, 20,
        f'<span style="font-family:\'{h_font}\'; font-size:9.8pt; font-weight:800; color:{BRAND["gold_deep"]};">{htmllib.escape(s["cert_placeholder_t"])}</span>',
        rtl=rtl, align="center", tag="s15_ct"
    )
    tbox(
        page, 64, 448, 832, 32,
        f'<span style="font-size:8.8pt; font-weight:600; color:{BRAND["muted_light"]};">{htmllib.escape(s["cert_placeholder_p"])}</span>',
        rtl=rtl, align="center", tag="s15_cp"
    )

def build_s16_partnerships_cta(doc, d, num, total, is_exec=False):
    page = doc.new_page(width=W, height=H)
    rtl = d["rtl"]
    s = d["s16"]
    h_font = "Cairo" if rtl else "Manrope"

    draw_bg_and_chrome(page, d, num, total, dark=True, is_exec=is_exec)
    section_heading(page, d, s["kicker"], s["title"], s["sub"], dark=True, y=58)

    cw = (868 - 16) / 2.0
    ch = 122
    for idx, (t_num, t_title, acc_k, t_desc) in enumerate(s["tracks"]):
        col = idx % 2
        row = idx // 2
        cx = 46 + col * (cw + 16)
        cy = 156 + row * (ch + 12)
        acc = BRAND[acc_k]
        draw_box(page, cx, cy, cw, ch, fill=BRAND["obsidian_card"], stroke=BRAND["obsidian_line"], stroke_w=0.9, radius=14, rtl=rtl)
        draw_box(page, cx, cy, cw, 4, fill=acc, radius=2, rtl=rtl)
        draw_box(page, cx + 16, cy + 14, 32, 22, fill=acc, radius=6, rtl=rtl)
        tbox(
            page, cx + 16, cy + 17, 32, 18,
            f'<span style="font-family:\'Manrope\'; font-size:8.6pt; font-weight:800; color:#FFFFFF;">{t_num}</span>',
            rtl=rtl, align="center", tag=f"s16_tn_{idx}"
        )
        tbox(
            page, cx + 56, cy + 15, cw - 72, 22,
            f'<span style="font-family:\'{h_font}\'; font-size:10.5pt; font-weight:800; color:{BRAND["ink_dark"]};">{htmllib.escape(t_title)}</span>',
            rtl=rtl, align="start", tag=f"s16_tt_{idx}"
        )
        tbox(
            page, cx + 16, cy + 44, cw - 32, 70,
            f'<span style="font-size:8.7pt; font-weight:400; color:{BRAND["silver"]}; line-height:1.45;">{htmllib.escape(t_desc)}</span>',
            rtl=rtl, align="start", tag=f"s16_td_{idx}"
        )

    # Executive Call-To-Action Banner at Bottom
    cta_txt = (
        "للتفاصيل الحالية، استخدم الموقع المرتبط بالقطاع وتحقق مباشرة من الخدمات والشروط."
        if rtl else
        "For current details, use the relevant sector website and confirm services and terms directly."
    )
    draw_box(page, 46, 434, 868, 56, fill="#161F30", stroke=BRAND["gold"], stroke_w=1.1, radius=12, rtl=rtl)
    tbox(
        page, 66, 446, 828, 36,
        f'<span style="font-family:\'{h_font}\'; font-size:9.8pt; font-weight:800; color:{BRAND["gold_bright"]}; line-height:1.4;">{htmllib.escape(cta_txt)}</span>',
        rtl=rtl, align="center", tag="s16_cta"
    )

def build_s17_contacts(doc, d, num, total):
    page = doc.new_page(width=W, height=H)
    rtl = d["rtl"]
    s = d["s18"]
    h_font = "Cairo" if rtl else "Manrope"

    draw_bg_and_chrome(page, d, num, total, dark=False)
    section_heading(page, d, s["kicker"], s["title"], s["lead"], dark=False, y=58)

    # 2-Column Contact Directory (first 8 items in 2x4 grid, 9th item spanning bottom placeholder)
    cw = (868 - 16) / 2.0
    for idx, (lbl, val) in enumerate(s["contacts"][:8]):
        col = idx % 2
        row = idx // 2
        cx = 46 + col * (cw + 16)
        cy = 158 + row * 64
        draw_box(page, cx, cy, cw, 54, fill=BRAND["ivory_card"], stroke=BRAND["ivory_line"], stroke_w=0.9, radius=11, rtl=rtl)
        draw_box(page, cx, cy, 5, 54, fill=BRAND["gold"], radius=2.5, rtl=rtl)
        tbox(
            page, cx + 18, cy + 8, cw - 32, 18,
            f'<span style="font-family:\'{h_font}\'; font-size:8.6pt; font-weight:700; color:{BRAND["muted_light"]};">{htmllib.escape(lbl)}</span>',
            rtl=rtl, align="start", tag=f"s17_cl_{idx}"
        )
        tbox(
            page, cx + 18, cy + 27, cw - 32, 22,
            f'<span style="font-family:\'Manrope\'; font-size:10pt; font-weight:800; color:{BRAND["ink_light"]};">{htmllib.escape(val)}</span>',
            rtl=rtl, align="ltr_right" if rtl else "start", tag=f"s17_cv_{idx}"
        )

    # 9th Row: Reserved HQ Address & Central Corporate Email Slot
    lbl9, val9 = s["contacts"][8]
    draw_box(page, 46, 418, 868, 66, fill=BRAND["ivory2"], stroke=BRAND["gold"], stroke_w=0.9, radius=11, rtl=rtl, dashes="[5 4] 0")
    tbox(
        page, 64, 426, 832, 18,
        f'<span style="font-family:\'{h_font}\'; font-size:9pt; font-weight:800; color:{BRAND["gold_deep"]};">{htmllib.escape(lbl9)}</span>',
        rtl=rtl, align="center", tag="s17_cl_8"
    )
    tbox(
        page, 64, 446, 832, 26,
        f'<span style="font-size:9pt; font-weight:600; color:{BRAND["muted_light"]};">{htmllib.escape(val9)}</span>',
        rtl=rtl, align="center", tag="s17_cv_8"
    )

def build_s18_closing(doc, d, is_exec=False):
    page = doc.new_page(width=W, height=H)
    rtl = d["rtl"]
    h_font = "Cairo" if rtl else "Manrope"

    page.draw_rect(page.rect, color=None, fill=hex_rgb(BRAND["obsidian"]))
    page.draw_rect(pymupdf.Rect(0, 0, W, 4), color=None, fill=hex_rgb(BRAND["gold"]))
    page.draw_rect(pymupdf.Rect(0, H - 4, W, H), color=None, fill=hex_rgb(BRAND["gold"]))

    # Subtle framing border
    draw_box(page, 34, 28, W - 68, H - 56, fill=None, stroke="#1E293B", stroke_w=0.9, radius=20, rtl=False)

    # Centered Iconic 3D Logo
    logo_r = pymupdf.Rect(W/2 - 110, 56, W/2 + 110, 240)
    page.insert_image(logo_r, filename=os.path.join(ASSETS_DIR, "logo-transparent.png"), keep_proportion=True)

    tbox(
        page, 120, 258, 720, 40,
        f'<span style="font-family:\'{h_font}\'; font-size:24pt; font-weight:800; color:{BRAND["ink_dark"]};">{htmllib.escape(d["group_name"])}</span>',
        rtl=rtl, align="center", tag="s18_gn"
    )
    tbox(
        page, 120, 300, 720, 28,
        f'<span style="font-family:\'{h_font}\'; font-size:13.5pt; font-weight:800; color:{BRAND["gold_bright"]};">{htmllib.escape(d["tagline"])}</span>',
        rtl=rtl, align="center", tag="s18_tg"
    )
    tbox(
        page, 110, 332, 740, 28,
        f'<span style="font-size:9.8pt; font-weight:500; color:{BRAND["muted_dark"]};">{htmllib.escape(d["sub_tagline"])}</span>',
        rtl=rtl, align="center", tag="s18_stg"
    )

    # Contact details from the site files; label the phone as unverified before use.
    contact_line = (
        "sawaunited.net | رقم مدرج في ملفات الموقع؛ تحقق قبل الاستخدام: +20 101 122 5592"
        if rtl else
        "sawaunited.net | Number listed in site files; confirm before use: +20 101 122 5592"
    )
    draw_box(page, 270, 376, 420, 38, fill=BRAND["obsidian_card"], stroke=BRAND["gold"], stroke_w=1.0, radius=19, rtl=False)
    tbox(
        page, 280, 386, 400, 22,
        f'<span style="font-family:\'Manrope\'; font-size:8.8pt; font-weight:800; color:{BRAND["gold_bright"]};">{htmllib.escape(contact_line)}</span>',
        rtl=rtl, align="center", tag="s18_pill"
    )

    # 4 Official Ecosystem Portals along bottom
    doms = [
        ("sawa-united.net", BRAND["estate"]),
        ("sawafood.net", BRAND["food"]),
        ("masharycar.net", BRAND["car"]),
        ("startwalk.net", BRAND["oil"]),
    ]
    dw = 176
    gap = 20
    start_x = (W - (4 * dw + 3 * gap)) / 2.0
    for idx, (dm, acc) in enumerate(doms):
        dx = start_x + idx * (dw + gap)
        draw_box(page, dx, 436, dw, 36, fill="#0D131E", stroke=acc, stroke_w=0.8, radius=9, rtl=False)
        tbox(
            page, dx + 8, 446, dw - 16, 20,
            f'<span style="font-family:\'Manrope\'; font-size:9pt; font-weight:800; color:{acc};">{dm}</span>',
            rtl=False, align="center", tag=f"s18_dm_{idx}"
        )


def generate_full_pdf(lang, out_pdf):
    d = CONTENT[lang]
    doc = pymupdf.open()
    total = 18
    build_s01_cover(doc, d, is_exec=False)                           # 01
    build_s02_about(doc, d, 2, total)                                # 02
    build_s03_vision(doc, d, 3, total)                               # 03
    build_s04_ecosystem(doc, d, 4, total)                            # 04
    build_sector_page(doc, d, "s05", 5, total, dark=True)            # 05 Real Estate
    build_sector_page(doc, d, "s06", 6, total, dark=False)           # 06 Food
    build_sector_page(doc, d, "s07", 7, total, dark=True)            # 07 Car Rental
    build_sector_page(doc, d, "s08", 8, total, dark=False)           # 08 Petroleum
    build_s09_services(doc, d, 9, total)                             # 09 Services
    build_s10_projects(doc, d, 10, total)                            # 10 Projects
    build_s11_capabilities_and_model(doc, d, 11, total)              # 11 Capabilities & Model
    build_s12_competitive(doc, d, 12, total)                         # 12 Why SAWA UNITED
    build_s13_partners(doc, d, 13, total)                            # 13 Partners & Clients
    build_s14_websites(doc, d, 14, total)                             # 14 Listed website links
    build_s15_quality(doc, d, 15, total)                             # 15 Quality & HSE
    build_s16_partnerships_cta(doc, d, 16, total)                    # 16 Partnerships & CTA
    build_s17_contacts(doc, d, 17, total)                            # 17 Contacts
    build_s18_closing(doc, d, is_exec=False)                         # 18 Closing Cover
    doc.save(out_pdf, garbage=4, deflate=True)
    doc.close()
    print(f"Saved {out_pdf} (18 pages)")

def generate_exec_pdf(lang, out_pdf):
    """Generates a razor-sharp 6-page Executive Profile for rapid B2B meetings & correspondence."""
    d = CONTENT[lang]
    doc = pymupdf.open()
    total = 6
    build_s01_cover(doc, d, is_exec=True)                            # 01 Executive Cover
    build_s02_about(doc, d, 2, total, is_exec=True)                  # 02 Content inventory and scope
    build_s04_ecosystem(doc, d, 3, total, is_exec=True)              # 03 4-Sector Business Ecosystem
    build_s14_websites(doc, d, 4, total, is_exec=True)                # 04 Listed website links
    build_s16_partnerships_cta(doc, d, 5, total, is_exec=True)       # 05 Partnership Tracks & CTA
    build_s18_closing(doc, d, is_exec=True)                          # 06 Direct Contact & Closing Cover
    doc.save(out_pdf, garbage=4, deflate=True)
    doc.close()
    print(f"Saved {out_pdf} (6 pages)")

if __name__ == "__main__":
    generate_full_pdf("ar", os.path.join(OUT_DIR, "SAWA-UNITED-Corporate-Portfolio-AR.pdf"))
    generate_full_pdf("en", os.path.join(OUT_DIR, "SAWA-UNITED-Corporate-Portfolio-EN.pdf"))
    generate_exec_pdf("ar", os.path.join(OUT_DIR, "SAWA-UNITED-Executive-Profile-AR.pdf"))
    generate_exec_pdf("en", os.path.join(OUT_DIR, "SAWA-UNITED-Executive-Profile-EN.pdf"))
    print("Total overflow/auto-scale notices:", len(OVERFLOWS))
    for item in OVERFLOWS[:25]:
        print("  OVERFLOW:", item)
