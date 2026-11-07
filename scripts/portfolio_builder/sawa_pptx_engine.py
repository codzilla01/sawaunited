# -*- coding: utf-8 -*-
import os
from pptx import Presentation
from pptx.util import Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn
from sawa_data import BRAND, CONTENT
from sawa_pdf_engine import prep_photo, ASSETS_DIR, OUT_DIR, W, H, rx

def rgb(hx):
    hx = hx.lstrip("#")
    return RGBColor(int(hx[0:2], 16), int(hx[2:4], 16), int(hx[4:6], 16))

def set_rtl_para(p, is_rtl, align_mode="start"):
    pPr = p._p.get_or_add_pPr()
    if is_rtl:
        pPr.set("rtl", "1")
        if align_mode == "center":
            p.alignment = PP_ALIGN.CENTER
        elif align_mode == "opp":
            p.alignment = PP_ALIGN.LEFT
        else:
            p.alignment = PP_ALIGN.RIGHT
    else:
        pPr.set("rtl", "0")
        if align_mode == "center":
            p.alignment = PP_ALIGN.CENTER
        elif align_mode == "opp":
            p.alignment = PP_ALIGN.RIGHT
        else:
            p.alignment = PP_ALIGN.LEFT

def add_shape(slide, x, y, w, h, fill=None, stroke=None, stroke_w=0.8, radius=True, rtl=False, dashed=False):
    xx = rx(x, w, rtl)
    st = MSO_SHAPE.ROUNDED_RECTANGLE if radius else MSO_SHAPE.RECTANGLE
    sh = slide.shapes.add_shape(st, Pt(xx), Pt(y), Pt(w), Pt(h))
    if radius and len(sh.adjustments) > 0:
        sh.adjustments[0] = min(0.14, 10.0 / max(min(w, h), 1.0))
    if fill:
        sh.fill.solid()
        sh.fill.fore_color.rgb = rgb(fill)
    else:
        sh.fill.background()
    if stroke:
        sh.line.color.rgb = rgb(stroke)
        sh.line.width = Pt(stroke_w)
        if dashed:
            ln = sh.line._get_or_add_ln()
            prst = ln.makeelement(qn("a:prstDash"), {"val": "dash"})
            ln.append(prst)
    else:
        sh.line.fill.background()
    return sh

def add_txt(slide, x, y, w, h, text, size=10, bold=False, color="#FFFFFF", font=None, rtl=False, align="start", valign="top", line_sp=1.25):
    xx = rx(x, w, rtl)
    tb = slide.shapes.add_textbox(Pt(xx), Pt(y), Pt(w), Pt(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = Pt(2)
    tf.margin_right = Pt(2)
    tf.margin_top = Pt(1)
    tf.margin_bottom = Pt(1)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE if valign == "middle" else MSO_ANCHOR.TOP

    lines = text.split("\n") if isinstance(text, str) else list(text)
    for idx, ln in enumerate(lines):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        set_rtl_para(p, rtl, align)
        p.line_spacing = line_sp
        if idx > 0:
            p.space_before = Pt(3)
        run = p.add_run()
        run.text = ln
        run.font.size = Pt(size)
        run.font.bold = bold
        run.font.color.rgb = rgb(color)
        fname = font or ("Cairo" if rtl else "Manrope")
        run.font.name = fname
        # Ensure Complex Script font name is also set for PowerPoint Arabic rendering
        rPr = run._r.get_or_add_rPr()
        cs = rPr.find(qn("a:cs"))
        if cs is None:
            cs = rPr.makeelement(qn("a:cs"), {"typeface": fname})
            rPr.append(cs)
        else:
            cs.set("typeface", fname)
    return tb

def add_img(slide, x, y, w, h, path, rtl=False):
    xx = rx(x, w, rtl)
    return slide.shapes.add_picture(path, Pt(xx), Pt(y), width=Pt(w), height=Pt(h))

def add_logo_contain(slide, x, y, w, h, rtl=False):
    xx = rx(x, w, rtl)
    logo_p = os.path.join(ASSETS_DIR, "logo-transparent.png")
    # Logo aspect is 1069 x 954 (~1.1205)
    ar = 1069.0 / 954.0
    if w / h > ar:
        nh = h
        nw = h * ar
    else:
        nw = w
        nh = w / ar
    ox = xx + (w - nw) / 2.0
    oy = y + (h - nh) / 2.0
    return slide.shapes.add_picture(logo_p, Pt(ox), Pt(oy), width=Pt(nw), height=Pt(nh))

def ppt_chrome(slide, d, num, total, dark=True, is_exec=False):
    rtl = d["rtl"]
    bg_c = BRAND["obsidian"] if dark else BRAND["ivory"]
    ln_c = BRAND["obsidian_line"] if dark else BRAND["ivory_line"]
    muted_c = BRAND["muted_dark"] if dark else BRAND["muted_light"]
    gold_c = BRAND["gold_bright"] if dark else BRAND["gold_deep"]

    bg = slide.background
    bg.fill.solid()
    bg.fill.fore_color.rgb = rgb(bg_c)

    add_shape(slide, 0, 0, W, 3, fill=BRAND["gold"], radius=False, rtl=False)
    doc_lbl = d["doc_label_exec"] if is_exec else d["doc_label_full"]
    add_txt(slide, 46, 18, 480, 22, doc_lbl, size=8.5, bold=True, color=gold_c, rtl=rtl, align="start")

    add_shape(slide, 812, 14, 102, 30, fill="#080B11", stroke=BRAND["gold"] if not dark else "#243146", stroke_w=0.7, radius=True, rtl=rtl)
    add_logo_contain(slide, 838, 16, 50, 26, rtl=rtl)

    add_shape(slide, 46, 50, W - 92, 0.7, fill=ln_c, radius=False, rtl=False)
    add_shape(slide, 46, 504, W - 92, 0.7, fill=ln_c, radius=False, rtl=False)

    add_txt(slide, 46, 509, 380, 20, d["footer_right"], size=8, bold=True, color=muted_c, rtl=rtl, align="start")
    add_txt(slide, 430, 509, 100, 20, f"{num:02d} / {total:02d}", size=8.5, bold=True, color=gold_c, font="Manrope", rtl=False, align="center")
    add_txt(slide, 560, 509, 354, 20, d["footer_left"], size=8, bold=True, color=muted_c, font="Manrope", rtl=rtl, align="opp")

def ppt_heading(slide, d, kicker, title, sub=None, dark=True, max_w=868, y=58):
    rtl = d["rtl"]
    gold_c = BRAND["gold_bright"] if dark else BRAND["gold_deep"]
    ink_c = BRAND["ink_dark"] if dark else BRAND["ink_light"]
    muted_c = BRAND["muted_dark"] if dark else BRAND["muted_light"]
    add_shape(slide, 46, y + 7, 20, 2.5, fill=BRAND["gold"], radius=False, rtl=rtl)
    add_txt(slide, 72, y, max_w - 26, 18, kicker, size=8.8, bold=True, color=gold_c, rtl=rtl)
    tsz = 19 if (len(title) < 52 and max_w > 520) else 17
    add_txt(slide, 46, y + 18, max_w, 34, title, size=tsz, bold=True, color=ink_c, rtl=rtl, line_sp=1.15)
    if sub:
        add_txt(slide, 46, y + 54, max_w, 32, sub, size=9.8, bold=False, color=muted_c, rtl=rtl, line_sp=1.3)


# ==================== PPTX SLIDE BUILDERS ====================

def p_s01(prs, d, is_exec=False):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    rtl = d["rtl"]
    s = d["s01"]
    sl.background.fill.solid()
    sl.background.fill.fore_color.rgb = rgb(BRAND["obsidian"])
    add_shape(sl, 0, 0, W, 4, fill=BRAND["gold"], radius=False)

    img_p = prep_photo("ecosystem-hero.jpg", 430, 412, radius_pt=20, overlay_alpha=0.22)
    add_img(sl, 484, 34, 430, 412, img_p, rtl=rtl)
    add_shape(sl, 484, 34, 430, 412, fill=None, stroke=BRAND["gold"], stroke_w=0.9, rtl=rtl)

    add_logo_contain(sl, 46, 36, 152, 132, rtl=rtl)
    eyebrow = d["doc_label_exec"] if is_exec else s["eyebrow"]
    add_shape(sl, 46, 180, 396, 26, fill=BRAND["obsidian_card"], stroke=BRAND["gold"], stroke_w=0.7, rtl=rtl)
    add_txt(sl, 58, 184, 372, 20, eyebrow, size=8.2, bold=True, color=BRAND["gold_bright"], rtl=rtl)

    add_txt(sl, 46, 216, 418, 46, s["title"], size=27, bold=True, color=BRAND["ink_dark"], rtl=rtl, line_sp=1.1)
    add_txt(sl, 46, 264, 418, 28, s["subtitle"], size=13.5, bold=True, color=BRAND["gold_bright"], rtl=rtl)
    add_shape(sl, 46, 298, 76, 3, fill=BRAND["gold"], radius=False, rtl=rtl)
    add_txt(sl, 46, 310, 418, 86, s["lead"], size=10.2, bold=False, color=BRAND["silver"], rtl=rtl, line_sp=1.45)
    add_txt(sl, 46, 404, 418, 26, d["tagline"], size=11.5, bold=True, color=BRAND["gold_bright"], rtl=rtl)

    cw = (868 - 36) / 4.0
    for idx, (sec_name, dom, acc_k) in enumerate(s["sectors_bar"]):
        cx = 46 + idx * (cw + 12)
        acc = BRAND[acc_k]
        add_shape(sl, cx, 460, cw, 56, fill=BRAND["obsidian_card"], stroke=BRAND["obsidian_line"], rtl=rtl)
        add_shape(sl, cx, 460, cw, 3.5, fill=acc, radius=False, rtl=rtl)
        add_txt(sl, cx + 12, 468, cw - 24, 20, sec_name, size=9.2, bold=True, color=BRAND["ink_dark"], rtl=rtl)
        add_txt(sl, cx + 12, 490, cw - 24, 18, dom, size=8.2, bold=True, color=acc, font="Manrope", rtl=rtl)

def p_s02(prs, d, num, total, is_exec=False):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    rtl = d["rtl"]
    s = d["s02"]
    ppt_chrome(sl, d, num, total, dark=False, is_exec=is_exec)
    ppt_heading(sl, d, s["kicker"], s["title"], dark=False, max_w=486, y=58)

    add_shape(sl, 46, 128, 488, 224, fill=BRAND["ivory_card"], stroke=BRAND["ivory_line"], rtl=rtl)
    add_txt(sl, 64, 140, 452, 68, s["p1"], size=10, bold=True, color=BRAND["ink_light"], rtl=rtl, line_sp=1.4)
    add_txt(sl, 64, 208, 452, 82, s["p2"], size=9.5, bold=False, color=BRAND["muted_light"], rtl=rtl, line_sp=1.4)
    add_shape(sl, 64, 296, 452, 42, fill=BRAND["ivory2"], stroke=BRAND["gold"], rtl=rtl)
    add_txt(sl, 76, 302, 428, 32, s["quote"], size=9, bold=True, color=BRAND["gold_deep"], rtl=rtl)

    img_p = prep_photo("skyline-corporate.jpg", 364, 286, radius_pt=16, overlay_alpha=0.08)
    add_img(sl, 550, 66, 364, 286, img_p, rtl=rtl)
    add_shape(sl, 550, 66, 364, 286, fill=None, stroke=BRAND["gold"], rtl=rtl)

    kw = (868 - 44) / 5.0
    for idx, (val, lbl) in enumerate(s["kpis"]):
        kx = 46 + idx * (kw + 11)
        add_shape(sl, kx, 368, kw, 96, fill=BRAND["obsidian"], stroke=BRAND["gold"], rtl=rtl)
        add_txt(sl, kx + 12, 378, kw - 24, 36, val, size=21, bold=True, color=BRAND["gold_bright"], font="Manrope", rtl=rtl)
        add_txt(sl, kx + 12, 418, kw - 24, 38, lbl, size=8.6, bold=True, color=BRAND["silver"], rtl=rtl, line_sp=1.25)

    add_txt(sl, 46, 472, 868, 22, s["note"], size=7.8, bold=False, color=BRAND["muted_light"], rtl=rtl)

def p_s03(prs, d, num, total):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    rtl = d["rtl"]
    s = d["s03"]
    ppt_chrome(sl, d, num, total, dark=True)
    ppt_heading(sl, d, s["kicker"], s["title"], dark=True, y=58)

    cw = (868 - 16) / 2.0
    for idx, (ct, cp) in enumerate([(s["vision_t"], s["vision_p"]), (s["mission_t"], s["mission_p"])]):
        cx = 46 + idx * (cw + 16)
        add_shape(sl, cx, 118, cw, 118, fill=BRAND["obsidian_card"], stroke=BRAND["gold"], rtl=rtl)
        add_txt(sl, cx + 20, 128, cw - 36, 24, ct, size=12.5, bold=True, color=BRAND["gold_bright"], rtl=rtl)
        add_txt(sl, cx + 20, 154, cw - 36, 72, cp, size=9.5, bold=False, color=BRAND["silver"], rtl=rtl, line_sp=1.4)

    ow = (868 - 28) / 3.0
    cols = [BRAND["estate"], BRAND["food"], BRAND["oil"]]
    for idx, (ot, op) in enumerate(s["objectives"]):
        ox = 46 + idx * (ow + 14)
        add_shape(sl, ox, 250, ow, 96, fill="#0E1520", stroke=BRAND["obsidian_line"], rtl=rtl)
        add_shape(sl, ox + 16, 264, 34, 3, fill=cols[idx], radius=False, rtl=rtl)
        add_txt(sl, ox + 16, 272, ow - 32, 22, ot, size=10.5, bold=True, color=BRAND["ink_dark"], rtl=rtl)
        add_txt(sl, ox + 16, 294, ow - 32, 44, op, size=8.7, bold=False, color=BRAND["muted_dark"], rtl=rtl, line_sp=1.32)

    vw = (868 - 36) / 4.0
    for idx, (vt, vp) in enumerate(s["values"]):
        vx = 46 + idx * (vw + 12)
        add_shape(sl, vx, 360, vw, 128, fill=BRAND["obsidian_card"], stroke=BRAND["obsidian_line"], rtl=rtl)
        add_shape(sl, vx + 14, 374, 28, 22, fill="#1C2638", stroke=BRAND["gold"], rtl=rtl)
        add_txt(sl, vx + 14, 376, 28, 20, f"0{idx+1}", size=8.5, bold=True, color=BRAND["gold_bright"], font="Manrope", rtl=rtl, align="center")
        add_txt(sl, vx + 14, 402, vw - 28, 22, vt, size=10.2, bold=True, color=BRAND["gold_bright"], rtl=rtl)
        add_txt(sl, vx + 14, 426, vw - 28, 54, vp, size=8.5, bold=False, color=BRAND["silver"], rtl=rtl, line_sp=1.32)

def p_s04(prs, d, num, total, is_exec=False):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    rtl = d["rtl"]
    s = d["s04"]
    ppt_chrome(sl, d, num, total, dark=False, is_exec=is_exec)
    ppt_heading(sl, d, s["kicker"], s["title"], s["sub"], dark=False, y=58)

    add_shape(sl, 250, 152, 460, 52, fill=BRAND["obsidian"], stroke=BRAND["gold"], stroke_w=1.2, rtl=False)
    add_txt(sl, 265, 156, 430, 22, s["hub_title"], size=11.5, bold=True, color=BRAND["gold_bright"], font="Manrope", rtl=rtl, align="center")
    add_txt(sl, 265, 178, 430, 18, s["hub_sub"], size=8.5, bold=True, color=BRAND["silver"], rtl=rtl, align="center")

    cw = (868 - 42) / 4.0
    for idx, (num_s, name, brand_sub, dom, acc_k, desc) in enumerate(s["sectors"]):
        cx = 46 + idx * (cw + 14)
        acc = BRAND[acc_k]
        add_shape(sl, cx, 224, cw, 212, fill=BRAND["ivory_card"], stroke=BRAND["ivory_line"], rtl=rtl)
        add_shape(sl, cx, 224, cw, 5, fill=acc, radius=False, rtl=rtl)
        add_shape(sl, cx + 14, 240, 32, 22, fill=acc, rtl=rtl)
        add_txt(sl, cx + 14, 242, 32, 18, num_s, size=8.5, bold=True, color="#FFFFFF", font="Manrope", rtl=rtl, align="center")
        add_txt(sl, cx + 52, 242, cw - 66, 18, dom, size=8.2, bold=True, color=acc, font="Manrope", rtl=rtl)
        add_txt(sl, cx + 14, 270, cw - 28, 36, name, size=10.5, bold=True, color=BRAND["ink_light"], rtl=rtl, line_sp=1.2)
        add_txt(sl, cx + 14, 308, cw - 28, 20, brand_sub, size=8.5, bold=True, color=BRAND["gold_deep"], rtl=rtl)
        add_txt(sl, cx + 14, 332, cw - 28, 92, desc, size=8.6, bold=False, color=BRAND["muted_light"], rtl=rtl, line_sp=1.35)

    add_shape(sl, 46, 448, 868, 42, fill=BRAND["ivory2"], stroke=BRAND["gold"], rtl=rtl)
    add_txt(sl, 62, 456, 836, 28, s["synergy"], size=8.8, bold=True, color=BRAND["ink_light"], rtl=rtl, align="center")

def p_sector(prs, d, s_key, num, total, dark=True):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    rtl = d["rtl"]
    s = d[s_key]
    acc = BRAND[s["accent"]]
    card_bg = BRAND["obsidian_card"] if dark else BRAND["ivory_card"]
    card_ln = BRAND["obsidian_line"] if dark else BRAND["ivory_line"]
    ink_c = BRAND["ink_dark"] if dark else BRAND["ink_light"]
    sub_c = BRAND["silver"] if dark else BRAND["muted_light"]

    ppt_chrome(sl, d, num, total, dark=dark)
    ppt_heading(sl, d, s["kicker"], s["title"], dark=dark, max_w=560, y=58)

    add_shape(sl, 734, 64, 180, 30, fill=acc, rtl=rtl)
    add_txt(sl, 744, 69, 160, 20, s["domain"], size=9.2, bold=True, color="#FFFFFF", font="Manrope", rtl=rtl, align="center")

    add_shape(sl, 46, 118, 492, 34, fill=card_bg, stroke=acc, rtl=rtl)
    add_txt(sl, 58, 124, 468, 22, s["slogan"], size=9, bold=True, color=acc, rtl=rtl)
    add_txt(sl, 46, 158, 492, 64, s["about"], size=9.1, bold=False, color=sub_c, rtl=rtl, line_sp=1.35)

    add_shape(sl, 46, 226, 492, 168, fill=card_bg, stroke=card_ln, rtl=rtl)
    bullets = [f"✦  {it}" for it in s["services"]]
    add_txt(sl, 60, 234, 464, 154, bullets, size=8.8, bold=True, color=ink_c, rtl=rtl, line_sp=1.28)

    val_bg = "#0E1624" if dark else BRAND["ivory2"]
    add_shape(sl, 46, 402, 492, 88, fill=val_bg, stroke=acc, rtl=rtl)
    add_txt(sl, 60, 408, 464, 20, s["value_t"], size=9.4, bold=True, color=acc, rtl=rtl)
    add_txt(sl, 60, 430, 464, 54, s["value"], size=8.7, bold=False, color=sub_c, rtl=rtl, line_sp=1.32)

    img_p = prep_photo(s["photo"], 360, 232, radius_pt=16, overlay_alpha=0.05)
    add_img(sl, 554, 118, 360, 232, img_p, rtl=rtl)
    add_shape(sl, 554, 118, 360, 232, fill=None, stroke=acc, rtl=rtl)

    for idx, (hv, hl) in enumerate(s["highlights"]):
        ry = 360 + idx * 44
        add_shape(sl, 554, ry, 360, 38, fill=card_bg, stroke=card_ln, rtl=rtl)
        add_shape(sl, 554, ry, 5, 38, fill=acc, radius=False, rtl=rtl)
        add_txt(sl, 568, ry + 9, 122, 22, hv, size=9.4, bold=True, color=acc, rtl=rtl)
        add_txt(sl, 694, ry + 10, 210, 22, hl, size=8.2, bold=True, color=ink_c, rtl=rtl)

def p_s09(prs, d, num, total):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    rtl = d["rtl"]
    s = d["s09"]
    ppt_chrome(sl, d, num, total, dark=True)
    ppt_heading(sl, d, s["kicker"], s["title"], s["sub"], dark=True, y=58)

    cw = (868 - 39) / 4.0
    for idx, (col_t, acc_k, items, target) in enumerate(s["cols"]):
        cx = 46 + idx * (cw + 13)
        acc = BRAND[acc_k]
        add_shape(sl, cx, 156, cw, 334, fill=BRAND["obsidian_card"], stroke=BRAND["obsidian_line"], rtl=rtl)
        add_shape(sl, cx, 156, cw, 44, fill=acc, rtl=rtl)
        add_txt(sl, cx + 10, 168, cw - 20, 24, col_t, size=9.8, bold=True, color="#FFFFFF", rtl=rtl, align="center")
        add_txt(sl, cx + 14, 214, cw - 28, 206, [f"●  {it}" for it in items], size=8.7, bold=False, color=BRAND["silver"], rtl=rtl, line_sp=1.35)
        add_shape(sl, cx + 10, 434, cw - 20, 44, fill="#0B1018", stroke=acc, rtl=rtl)
        add_txt(sl, cx + 14, 442, cw - 28, 30, target, size=7.8, bold=True, color=acc, rtl=rtl, align="center")

def p_s10(prs, d, num, total):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    rtl = d["rtl"]
    s = d["s10"]
    ppt_chrome(sl, d, num, total, dark=False)
    ppt_heading(sl, d, s["kicker"], s["title"], s["sub"], dark=False, y=58)

    photos = ["sector-realestate.jpg", "sector-food.jpg", "sector-automotive.jpg", "sector-petroleum.jpg"]
    cw = (868 - 16) / 2.0
    ch = 160
    for idx, (v_title, v_meta, acc_k, v_desc) in enumerate(s["ventures"]):
        cx = 46 + (idx % 2) * (cw + 16)
        cy = 156 + (idx // 2) * (ch + 14)
        acc = BRAND[acc_k]
        add_shape(sl, cx, cy, cw, ch, fill=BRAND["ivory_card"], stroke=BRAND["ivory_line"], rtl=rtl)
        img_p = prep_photo(photos[idx], 132, ch - 20, radius_pt=10, overlay_alpha=0.06)
        add_img(sl, cx + 10, cy + 10, 132, ch - 20, img_p, rtl=rtl)
        add_txt(sl, cx + 154, cy + 12, cw - 166, 18, v_meta, size=8, bold=True, color=acc, rtl=rtl)
        add_txt(sl, cx + 154, cy + 30, cw - 166, 22, v_title, size=10.2, bold=True, color=BRAND["ink_light"], font="Manrope", rtl=rtl)
        add_txt(sl, cx + 154, cy + 54, cw - 166, 98, v_desc, size=8.1, bold=False, color=BRAND["muted_light"], rtl=rtl, line_sp=1.32)

def p_s11(prs, d, num, total):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    rtl = d["rtl"]
    s11, s12 = d["s11"], d["s12"]
    ppt_chrome(sl, d, num, total, dark=True)
    kicker = "خبراتنا ونموذج العمل · CAPABILITIES & OPERATING MODEL" if rtl else "CAPABILITIES & EXECUTION · SCALE & OPERATING MODEL"
    title = "إمكانيات تشغيلية موثقة.. ومنهجية عمل منضبطة من 5 مراحل" if rtl else "Quantified Operational Scale & Five-Stage Execution Model"
    ppt_heading(sl, d, kicker, title, dark=True, y=58)

    add_shape(sl, 46, 122, 452, 368, fill=BRAND["obsidian_card"], stroke=BRAND["obsidian_line"], rtl=rtl)
    h1 = "مؤشرات القدرة التشغيلية الموثقة" if rtl else "Verified Operational Capacity Benchmarks"
    add_txt(sl, 62, 132, 420, 22, h1, size=10.8, bold=True, color=BRAND["gold_bright"], rtl=rtl)

    for idx, (lbl, val_txt, ratio, acc_k) in enumerate(s11["bars"]):
        ry = 164 + idx * 52
        acc = BRAND[acc_k]
        add_txt(sl, 62, ry, 265, 18, lbl, size=8.2, bold=True, color=BRAND["silver"], rtl=rtl)
        add_txt(sl, 330, ry, 152, 18, val_txt, size=8.2, bold=True, color=acc, rtl=rtl, align="opp")
        add_shape(sl, 62, ry + 22, 420, 9, fill="#090D14", rtl=rtl)
        add_shape(sl, 62, ry + 22, 420 * ratio, 9, fill=acc, rtl=rtl)

    add_shape(sl, 514, 122, 400, 368, fill=BRAND["obsidian_card"], stroke=BRAND["gold"], rtl=rtl)
    h2 = "نموذج العمل المؤسسي (من الفرصة إلى الاستدامة)" if rtl else "5-Stage Institutional Execution Lifecycle"
    add_txt(sl, 530, 132, 368, 22, h2, size=10.8, bold=True, color=BRAND["gold_bright"], rtl=rtl)

    for idx, (st_n, st_t, st_p) in enumerate(s12["steps"]):
        ry = 164 + idx * 63
        add_shape(sl, 530, ry, 368, 56, fill="#0C121C", stroke=BRAND["obsidian_line"], rtl=rtl)
        add_shape(sl, 538, ry + 10, 32, 36, fill=BRAND["gold"], rtl=rtl)
        add_txt(sl, 538, ry + 18, 32, 22, st_n, size=9.2, bold=True, color="#080B10", font="Manrope", rtl=rtl, align="center")
        add_txt(sl, 578, ry + 5, 312, 18, st_t, size=9.2, bold=True, color=BRAND["ink_dark"], rtl=rtl)
        add_txt(sl, 578, ry + 24, 312, 30, st_p, size=7.8, bold=False, color=BRAND["muted_dark"], rtl=rtl, line_sp=1.25)

def p_s12(prs, d, num, total):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    rtl = d["rtl"]
    s = d["s13"]
    ppt_chrome(sl, d, num, total, dark=False)
    ppt_heading(sl, d, s["kicker"], s["title"], s["sub"], dark=False, y=58)

    top_w = (868 - 28) / 3.0
    bot_w = (868 - 14) / 2.0
    accents = [BRAND["gold"], BRAND["oil"], BRAND["estate"], BRAND["food"], BRAND["car"]]
    for idx, (p_num, p_title, p_desc) in enumerate(s["pillars"]):
        if idx < 3:
            cx, cy, cw, ch = 46 + idx * (top_w + 14), 156, top_w, 160
        else:
            cx, cy, cw, ch = 46 + (idx - 3) * (bot_w + 14), 330, bot_w, 154
        acc = accents[idx]
        add_shape(sl, cx, cy, cw, ch, fill=BRAND["ivory_card"], stroke=BRAND["ivory_line"], rtl=rtl)
        add_shape(sl, cx, cy, cw, 4, fill=acc, radius=False, rtl=rtl)
        add_shape(sl, cx + 16, cy + 16, 34, 24, fill=BRAND["obsidian"], rtl=rtl)
        add_txt(sl, cx + 16, cy + 19, 34, 18, p_num, size=8.8, bold=True, color=BRAND["gold_bright"], font="Manrope", rtl=rtl, align="center")
        add_txt(sl, cx + 16, cy + 46, cw - 32, 28, p_title, size=10.6, bold=True, color=BRAND["ink_light"], rtl=rtl, line_sp=1.2)
        add_txt(sl, cx + 16, cy + 78, cw - 32, ch - 88, p_desc, size=8.7, bold=False, color=BRAND["muted_light"], rtl=rtl, line_sp=1.35)

def p_s13(prs, d, num, total):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    rtl = d["rtl"]
    s = d["s14"]
    ppt_chrome(sl, d, num, total, dark=True)
    ppt_heading(sl, d, s["kicker"], s["title"], s["sub"], dark=True, y=58)

    cw = (868 - 28) / 3.0
    accs = [BRAND["oil"], BRAND["food"], BRAND["gold_bright"]]
    for idx, (tag_t, main_t, desc_t) in enumerate(s["verified_badges"]):
        cx = 46 + idx * (cw + 14)
        add_shape(sl, cx, 158, cw, 146, fill=BRAND["obsidian_card"], stroke=accs[idx], rtl=rtl)
        add_txt(sl, cx + 16, 168, cw - 32, 18, tag_t, size=8.2, bold=True, color=accs[idx], rtl=rtl)
        add_txt(sl, cx + 16, 190, cw - 32, 34, main_t, size=10.2, bold=True, color=BRAND["ink_dark"], rtl=rtl, line_sp=1.22)
        add_txt(sl, cx + 16, 230, cw - 32, 66, desc_t, size=8.5, bold=False, color=BRAND["silver"], rtl=rtl, line_sp=1.35)

    add_txt(sl, 46, 316, 868, 22, s["slots_title"], size=9.2, bold=True, color=BRAND["gold_bright"], rtl=rtl)
    sw = (868 - 28) / 3.0
    for idx, slot_lbl in enumerate(s["slots"]):
        sx = 46 + (idx % 3) * (sw + 14)
        sy = 344 + (idx // 3) * 76
        add_shape(sl, sx, sy, sw, 64, fill="#0B1018", stroke=BRAND["gold"], rtl=rtl, dashed=True)
        add_txt(sl, sx + 10, sy + 21, sw - 20, 24, slot_lbl, size=8.8, bold=True, color=BRAND["muted_dark"], rtl=rtl, align="center")

def p_s14(prs, d, num, total, is_exec=False):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    rtl = d["rtl"]
    s = d["s15"]
    ppt_chrome(sl, d, num, total, dark=True, is_exec=is_exec)
    ppt_heading(sl, d, s["kicker"], s["title"], s["sub"], dark=True, y=58)

    img_p = prep_photo("global-map.jpg", 392, 326, radius_pt=16, overlay_alpha=0.0)
    add_img(sl, 522, 158, 392, 326, img_p, rtl=rtl)
    add_shape(sl, 522, 158, 392, 326, fill=None, stroke=BRAND["gold"], rtl=rtl)

    for idx, (c_name, code, sec_list) in enumerate(s["regions"]):
        ry = 158 + idx * 47
        is_exp = (code == "EXP")
        add_shape(sl, 46, ry, 460, 41, fill=BRAND["obsidian_card"], stroke=BRAND["oil"] if is_exp else BRAND["obsidian_line"], rtl=rtl)
        add_shape(sl, 54, ry + 8, 38, 25, fill=BRAND["oil"] if is_exp else BRAND["gold"], rtl=rtl)
        add_txt(sl, 54, ry + 12, 38, 18, code, size=8, bold=True, color="#FFFFFF" if is_exp else "#080A0F", font="Manrope", rtl=rtl, align="center")
        add_txt(sl, 100, ry + 3, 396, 18, c_name, size=9.1, bold=True, color=BRAND["ink_dark"], rtl=rtl)
        add_txt(sl, 100, ry + 21, 396, 18, sec_list, size=7.9, bold=False, color=BRAND["muted_dark"], rtl=rtl)

def p_s15(prs, d, num, total):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    rtl = d["rtl"]
    s = d["s17"]
    ppt_chrome(sl, d, num, total, dark=False)
    ppt_heading(sl, d, s["kicker"], s["title"], s["sub"], dark=False, y=58)

    cw = (868 - 16) / 2.0
    accs = [BRAND["estate"], BRAND["oil"], BRAND["food"], BRAND["car"]]
    for idx, (st_t, st_p) in enumerate(s["standards"]):
        cx = 46 + (idx % 2) * (cw + 16)
        cy = 158 + (idx // 2) * 128
        add_shape(sl, cx, cy, cw, 114, fill=BRAND["ivory_card"], stroke=BRAND["ivory_line"], rtl=rtl)
        add_shape(sl, cx, cy, 6, 114, fill=accs[idx], radius=False, rtl=rtl)
        add_txt(sl, cx + 20, cy + 14, cw - 34, 24, st_t, size=10.8, bold=True, color=BRAND["ink_light"], rtl=rtl)
        add_txt(sl, cx + 20, cy + 42, cw - 34, 64, st_p, size=8.8, bold=False, color=BRAND["muted_light"], rtl=rtl, line_sp=1.35)

    add_shape(sl, 46, 416, 868, 72, fill=BRAND["ivory2"], stroke=BRAND["gold"], rtl=rtl, dashed=True)
    add_txt(sl, 64, 424, 832, 20, s["cert_placeholder_t"], size=9.5, bold=True, color=BRAND["gold_deep"], rtl=rtl, align="center")
    add_txt(sl, 64, 446, 832, 32, s["cert_placeholder_p"], size=8.6, bold=True, color=BRAND["muted_light"], rtl=rtl, align="center")

def p_s16(prs, d, num, total, is_exec=False):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    rtl = d["rtl"]
    s = d["s16"]
    ppt_chrome(sl, d, num, total, dark=True, is_exec=is_exec)
    ppt_heading(sl, d, s["kicker"], s["title"], s["sub"], dark=True, y=58)

    cw = (868 - 16) / 2.0
    for idx, (t_num, t_title, acc_k, t_desc) in enumerate(s["tracks"]):
        cx = 46 + (idx % 2) * (cw + 16)
        cy = 156 + (idx // 2) * 134
        acc = BRAND[acc_k]
        add_shape(sl, cx, cy, cw, 122, fill=BRAND["obsidian_card"], stroke=BRAND["obsidian_line"], rtl=rtl)
        add_shape(sl, cx, cy, cw, 4, fill=acc, radius=False, rtl=rtl)
        add_shape(sl, cx + 16, cy + 14, 32, 22, fill=acc, rtl=rtl)
        add_txt(sl, cx + 16, cy + 16, 32, 18, t_num, size=8.5, bold=True, color="#FFFFFF", font="Manrope", rtl=rtl, align="center")
        add_txt(sl, cx + 56, cy + 14, cw - 72, 22, t_title, size=10.2, bold=True, color=BRAND["ink_dark"], rtl=rtl)
        add_txt(sl, cx + 16, cy + 42, cw - 32, 72, t_desc, size=8.5, bold=False, color=BRAND["silver"], rtl=rtl, line_sp=1.35)

    cta_txt = (
        "دعوة للتعاون: شاركنا مشروعك أو احتياجك التجاري اليوم — وسيقوم الفريق المختص بالرد المباشر وهيكلة الحل الأنسب لأعمالك."
        if rtl else
        "Call to Action: Share your investment mandate, distribution inquiry, or supply requirement — our specialist unit will respond directly."
    )
    add_shape(sl, 46, 434, 868, 56, fill="#161F30", stroke=BRAND["gold"], stroke_w=1.1, rtl=rtl)
    add_txt(sl, 66, 446, 828, 34, cta_txt, size=9.5, bold=True, color=BRAND["gold_bright"], rtl=rtl, align="center")

def p_s17(prs, d, num, total):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    rtl = d["rtl"]
    s = d["s18"]
    ppt_chrome(sl, d, num, total, dark=False)
    kicker = "معلومات الاتصال الرسمية · OFFICIAL CONTACT CHANNELS" if rtl else "OFFICIAL CONTACTS · DIGITAL PORTALS & DIRECT ACCESS"
    title = "قنوات التواصل الرسمية ومنصات المجموعة" if rtl else "Official Group Portals & Direct Communication Channels"
    ppt_heading(sl, d, kicker, title, s["lead"], dark=False, y=58)

    cw = (868 - 16) / 2.0
    for idx, (lbl, val) in enumerate(s["contacts"][:8]):
        cx = 46 + (idx % 2) * (cw + 16)
        cy = 158 + (idx // 2) * 64
        add_shape(sl, cx, cy, cw, 54, fill=BRAND["ivory_card"], stroke=BRAND["ivory_line"], rtl=rtl)
        add_shape(sl, cx, cy, 5, 54, fill=BRAND["gold"], radius=False, rtl=rtl)
        add_txt(sl, cx + 18, cy + 7, cw - 32, 18, lbl, size=8.5, bold=True, color=BRAND["muted_light"], rtl=rtl)
        add_txt(sl, cx + 18, cy + 26, cw - 32, 22, val, size=9.8, bold=True, color=BRAND["ink_light"], font="Manrope", rtl=rtl)

    lbl9, val9 = s["contacts"][8]
    add_shape(sl, 46, 418, 868, 66, fill=BRAND["ivory2"], stroke=BRAND["gold"], rtl=rtl, dashed=True)
    add_txt(sl, 64, 424, 832, 20, lbl9, size=9, bold=True, color=BRAND["gold_deep"], rtl=rtl, align="center")
    add_txt(sl, 64, 445, 832, 26, val9, size=8.8, bold=True, color=BRAND["muted_light"], rtl=rtl, align="center")

def p_s18(prs, d):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    rtl = d["rtl"]
    sl.background.fill.solid()
    sl.background.fill.fore_color.rgb = rgb(BRAND["obsidian"])
    add_shape(sl, 0, 0, W, 4, fill=BRAND["gold"], radius=False)
    add_shape(sl, 0, H - 4, W, 4, fill=BRAND["gold"], radius=False)
    add_shape(sl, 34, 28, W - 68, H - 56, fill=None, stroke="#1E293B", stroke_w=0.9)

    add_logo_contain(sl, W/2 - 110, 56, 220, 184, rtl=False)
    add_txt(sl, 120, 256, 720, 40, d["group_name"], size=23, bold=True, color=BRAND["ink_dark"], rtl=rtl, align="center")
    add_txt(sl, 120, 298, 720, 28, d["tagline"], size=13, bold=True, color=BRAND["gold_bright"], rtl=rtl, align="center")
    add_txt(sl, 110, 330, 740, 28, d["sub_tagline"], size=9.5, bold=False, color=BRAND["muted_dark"], rtl=rtl, align="center")

    add_shape(sl, 270, 376, 420, 38, fill=BRAND["obsidian_card"], stroke=BRAND["gold"], stroke_w=1.0)
    add_txt(sl, 280, 384, 400, 22, "sawaunited.net   |   WhatsApp: +20 101 122 5592", size=9.8, bold=True, color=BRAND["gold_bright"], font="Manrope", rtl=False, align="center")

    doms = [("sawa-united.net", BRAND["estate"]), ("sawafood.net", BRAND["food"]), ("masharycar.net", BRAND["car"]), ("startwalk.net", BRAND["oil"])]
    dw, gap = 176, 20
    sx0 = (W - (4 * dw + 3 * gap)) / 2.0
    for idx, (dm, acc) in enumerate(doms):
        dx = sx0 + idx * (dw + gap)
        add_shape(sl, dx, 436, dw, 36, fill="#0D131E", stroke=acc, stroke_w=0.8)
        add_txt(sl, dx + 8, 444, dw - 16, 20, dm, size=9, bold=True, color=acc, font="Manrope", rtl=False, align="center")


def generate_full_pptx(lang, out_path):
    d = CONTENT[lang]
    prs = Presentation()
    prs.slide_width = Pt(W)
    prs.slide_height = Pt(H)
    total = 18
    p_s01(prs, d, False)
    p_s02(prs, d, 2, total)
    p_s03(prs, d, 3, total)
    p_s04(prs, d, 4, total)
    p_sector(prs, d, "s05", 5, total, dark=True)
    p_sector(prs, d, "s06", 6, total, dark=False)
    p_sector(prs, d, "s07", 7, total, dark=True)
    p_sector(prs, d, "s08", 8, total, dark=False)
    p_s09(prs, d, 9, total)
    p_s10(prs, d, 10, total)
    p_s11(prs, d, 11, total)
    p_s12(prs, d, 12, total)
    p_s13(prs, d, 13, total)
    p_s14(prs, d, 14, total)
    p_s15(prs, d, 15, total)
    p_s16(prs, d, 16, total)
    p_s17(prs, d, 17, total)
    p_s18(prs, d)
    prs.save(out_path)
    print(f"Saved editable PPTX: {out_path} ({len(prs.slides)} slides)")

def generate_exec_pptx(lang, out_path):
    d = CONTENT[lang]
    prs = Presentation()
    prs.slide_width = Pt(W)
    prs.slide_height = Pt(H)
    total = 6
    p_s01(prs, d, True)
    p_s02(prs, d, 2, total, True)
    p_s04(prs, d, 3, total, True)
    p_s14(prs, d, 4, total, True)
    p_s16(prs, d, 5, total, True)
    p_s18(prs, d)
    prs.save(out_path)
    print(f"Saved editable Executive PPTX: {out_path} ({len(prs.slides)} slides)")

if __name__ == "__main__":
    generate_full_pptx("ar", os.path.join(OUT_DIR, "SAWA-UNITED-Corporate-Portfolio-AR.pptx"))
    generate_full_pptx("en", os.path.join(OUT_DIR, "SAWA-UNITED-Corporate-Portfolio-EN.pptx"))
    generate_exec_pptx("ar", os.path.join(OUT_DIR, "SAWA-UNITED-Executive-Profile-AR.pptx"))
    generate_exec_pptx("en", os.path.join(OUT_DIR, "SAWA-UNITED-Executive-Profile-EN.pptx"))
