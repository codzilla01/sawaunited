#!/usr/bin/env bash
# يبني حزمة نظيفة للنشر على Hostinger (أو أي استضافة Apache/PHP).
#
# الاستخدام:
#   bash scripts/package-deploy.sh                       # ينتج dist/sawaunited-deploy-<ts>.zip
#   bash scripts/package-deploy.sh --stage dist/site     # ينتج مجلدًا مفكوكًا (للنشر التلقائي)
#   bash scripts/package-deploy.sh --no-zip --stage dist/site
#
# الحزمة تستبعد دائمًا: .git و docs/ و scripts/ و .github/ و accounts/config.php
# و accounts/default.php (صفحة Hostinger الافتراضية) والأصول غير المستخدمة.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT/dist"
STAMP="$(date +%Y%m%d-%H%M)"
ZIP="$OUT_DIR/sawaunited-deploy-$STAMP.zip"
STAGE_OUT=""
MAKE_ZIP=1

while [ $# -gt 0 ]; do
  case "$1" in
    --stage)  STAGE_OUT="${2:-}"; shift 2 ;;
    --no-zip) MAKE_ZIP=0; shift ;;
    -h|--help) sed -n '2,12p' "$0"; exit 0 ;;
    *) echo "خيار غير معروف: $1" >&2; exit 2 ;;
  esac
done

mkdir -p "$OUT_DIR"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

copy() {
  local rel="$1"
  if [ ! -e "$ROOT/$rel" ]; then
    echo "✗ مفقود: $rel" >&2
    exit 1
  fi
  mkdir -p "$STAGE/$(dirname "$rel")"
  cp -R "$ROOT/$rel" "$STAGE/$rel"
}

# ---------- الموقع العام ----------
for f in index.html projects.html robots.txt sitemap.xml .htaccess; do copy "$f"; done
copy css/styles.css
copy js

# أصول غير مستخدمة في أي صفحة — تُستبعد لتقليل حجم النشر (تبقى في المستودع)
EXCLUDE_ASSETS=("will\\.png" "global-map\\.png" "favicon\\.png")
shopt -s nullglob
for f in "$ROOT"/assets/*; do
  name="$(basename "$f")"
  skip=0
  for pat in "${EXCLUDE_ASSETS[@]}"; do
    [[ "$name" =~ ^${pat}$ ]] && skip=1
  done
  [ "$skip" -eq 1 ] && continue
  copy "assets/$name"
done
shopt -u nullglob

# ---------- التطبيق الداخلي (بدون الأسرار) ----------
copy accounts/index.html
copy accounts/api.php
copy accounts/.htaccess
copy accounts/config.sample.php

# ---------- فحص أمان قبل التسليم ----------
fail=0
if [ -e "$STAGE/accounts/config.php" ]; then
  echo "✗ خطر: ملف config.php (كلمة سر قاعدة البيانات) موجود في الحزمة" >&2
  fail=1
fi
for d in .git docs scripts .github; do
  if [ -e "$STAGE/$d" ]; then
    echo "✗ خطر: $d موجود في الحزمة" >&2
    fail=1
  fi
done
if grep -rIl --exclude-dir=assets "SawaAccounts#2026" "$STAGE" >/dev/null 2>&1; then
  echo "✗ خطر: كلمة سر قاعدة البيانات القديمة موجودة داخل ملف في الحزمة" >&2
  fail=1
fi
if [ "$fail" -ne 0 ]; then
  echo "تم إلغاء البناء." >&2
  exit 1
fi

# ---------- الإخراج ----------
if [ -n "$STAGE_OUT" ]; then
  rm -rf "$STAGE_OUT"
  mkdir -p "$(dirname "$STAGE_OUT")"
  cp -R "$STAGE" "$STAGE_OUT"
  echo "✓ مجلد النشر جاهز: ${STAGE_OUT#$ROOT/}"
  echo "  الحجم: $(du -sh "$STAGE_OUT" | cut -f1) — عدد الملفات: $(find "$STAGE_OUT" -type f | wc -l)"
fi

if [ "$MAKE_ZIP" -eq 1 ]; then
  rm -f "$ZIP"
  (cd "$STAGE" && zip -qr "$ZIP" .)
  echo "✓ تم بناء الحزمة: ${ZIP#$ROOT/}"
  echo "  الحجم: $(du -h "$ZIP" | cut -f1) — عدد الملفات: $(cd "$STAGE" && find . -type f | wc -l)"
fi

echo
echo "الخطوة التالية (يدويًا):"
echo "  1) ارفع الحزمة إلى public_html في Hostinger ثم فك الضغط."
echo "  2) أنشئ accounts/config.php على السيرفر من accounts/config.sample.php."
echo "  3) احذف ملف الـzip من السيرفر بعد فك الضغط."
echo "  للنشر التلقائي: .github/workflows/deploy-hostinger.yml (راجع docs/hostinger-deploy.md)."
