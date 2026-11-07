#!/usr/bin/env bash
# يبني حزمة نظيفة للنشر على Hostinger (أو أي استضافة Apache/PHP).
# الاستخدام:  bash scripts/package-deploy.sh
#
# الحزمة تستبعد دائمًا: .git و docs/ و scripts/ و accounts/config.php
# و accounts/default.php (صفحة Hostinger الافتراضية).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT/dist"
STAMP="$(date +%Y%m%d-%H%M)"
ZIP="$OUT_DIR/sawaunited-deploy-$STAMP.zip"

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
EXCLUDE_ASSETS=("will\.png" "global-map\.png" "favicon\.png")
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

# ---------- فحص أمان قبل الضغط ----------
fail=0
if [ -e "$STAGE/accounts/config.php" ]; then
  echo "✗ خطر: ملف config.php (كلمة سر قاعدة البيانات) موجود في الحزمة" >&2
  fail=1
fi
if [ -d "$STAGE/.git" ] || [ -d "$STAGE/docs" ] || [ -d "$STAGE/scripts" ]; then
  echo "✗ خطر: مجلدات تطوير موجودة في الحزمة" >&2
  fail=1
fi
if grep -rIl --exclude-dir=assets "SawaAccounts#2026" "$STAGE" >/dev/null 2>&1; then
  echo "✗ خطر: كلمة سر قاعدة البيانات القديمة موجودة داخل ملف في الحزمة" >&2
  fail=1
fi
if [ "$fail" -ne 0 ]; then
  rm -rf "$STAGE"
  echo "تم إلغاء بناء الحزمة." >&2
  exit 1
fi

rm -f "$ZIP"
(cd "$STAGE" && zip -qr "$ZIP" .)

echo "✓ تم بناء الحزمة: ${ZIP#$ROOT/}"
echo "  الحجم: $(du -h "$ZIP" | cut -f1)"
echo "  عدد الملفات: $(cd "$STAGE" && find . -type f | wc -l)"
echo
echo "الخطوة التالية:"
echo "  1) ارفع الملف إلى public_html في Hostinger ثم فك الضغط."
echo "  2) أنشئ accounts/config.php على السيرفر من accounts/config.sample.php."
echo "  3) احذف ملف الـzip من السيرفر بعد فك الضغط."
echo "  الدليل الكامل: docs/hostinger-deploy.md"
