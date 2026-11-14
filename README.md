# SAWA UNITED GROUP — digital ecosystem platform

منصة رقمية متعددة القطاعات لمجموعة سوا يونيتد (٦ أكتوبر، الجيزة — مصر)، مبنية كملفات HTML/CSS/JS ثابتة
مع واجهة PHP خفيفة، لتعمل مباشرة على استضافة **Hostinger** المشتركة دون أي خطوة بناء.

## What ships

| Path | Purpose |
| --- | --- |
| `index.html` | الصفحة العامة: بوابة القطاعات الخمسة، عدادات KPI، رحلة المشتري، حاسبة العائد والسداد، كتالوج سوا فود وبوابة الشراكة B2B، أسطول مشاري كارز وحجز «الدفع عند الاستلام»، حاسبة توريد البترول، تتبع الشحنات وعرض السعر، خريطة الحضور، والتواصل عبر واتساب. |
| `projects.html` | منصات الأعمال الخمس بأسلوب بطاقات موحّد. |
| `portfolio/` | الملف المؤسسي والتنزيلات (PDF/PPTX) — **كما هو دون تغيير**. |
| `accounts/` | تطبيق الحسابات والحضور الداخلي — **كما هو دون تغيير**. |
| `super-admin/` | مركز قيادة المطور: بوابة دخول مزدوجة (بيانات + WebAuthn بصمة/Face ID) ووحدات إدارة كاملة. |
| `api/ecosystem.php` | حفظ ومزامنة البيانات على السيرفر (JSON) + تسجيل العملاء المحتملين والحجوزات. |
| `js/data.js` | البيانات الأساسية لكل القطاعات + قاموس الترجمة AR/EN/FR. |
| `js/ecosystem-store.js` | طبقة الحالة: LocalStorage + PHP API + تصدير/استيراد JSON + مزامنة فورية بين التبويبات. |
| `css/ecosystem.css` | نظام التصميم الجديد (Obsidian/Slate/Champagne Gold/Alabaster). |

## المزامنة الحية

```
/super-admin (تعديل) ──> SAWAStore.commit()
        ├─ localStorage  (فوري)
        ├─ BroadcastChannel + storage event  (كل التبويبات والصفحات)
        └─ api/ecosystem.php  (Hostinger، حفظ على القرص)
                  └─ api/data/ecosystem.json  + 20 نسخة احتياطية دوّارة
```

أي تعديل في مركز القيادة يظهر على `index.html` و`projects.html` بدون تحديث الصفحة. لو كانت واجهة PHP
غير متاحة (معاينة ثابتة) يعمل الموقع بكامل وظائفه على LocalStorage مع إشارة `LOCAL · SYNC` في التذييل.

## الوصول إلى /super-admin

1. البريد الافتراضي: `developer@sawaunited.net` — كلمة المرور: `SawaMaster@2026!` (الدور `SUPER_DEVELOPER_ADMIN`).
2. العامل الثاني: WebAuthn (`navigator.credentials.create` / `.get`) لإصبع أو Face ID؛ وعلى الأجهزة بدون
   مستشعر يعمل وضع المحاكاة تلقائيًا لتجربة التدفق كاملًا.
3. **مهم:** على السيرفر أنشئ `api/config.php` من `api/config.sample.php` وغيّر كلمة المرور والملح:
   `php -r 'echo hash("sha256", "EMAIL:PASSWORD:SALT");'` ثم ضع الناتج في `pass_hash`.

## النشر على Hostinger

```bash
bash scripts/package-deploy.sh                       # dist/sawaunited-deploy-<ts>.zip
bash scripts/package-deploy.sh --stage dist/site     # مجلد جاهز للنشر التلقائي
```

- الحزمة تتضمن `super-admin/` و`api/` وتستبعد `.git/`, `docs/`, `scripts/`, `accounts/config.php`, `api/config.php`, `api/data/`.
- أنشئ `accounts/config.php` و`api/config.php` على السيرفر، واضبط `api/data` على صلاحية 755 قابلة للكتابة.
- رابط مختصر: `https://sawaunited.net/super-admin/` (DirectoryIndex + قاعدة rewrite في `.htaccess`).
- الدليل الكامل: [`docs/hostinger-deploy.md`](docs/hostinger-deploy.md) · النشر التلقائي عبر `.github/workflows/deploy-hostinger.yml`.

## حسابات وأمان

- كل الرؤوس الأمنية (CSP-lite، nosniff، referrer، permissions) + `noindex` على مركز القيادة.
- `api/.htaccess` يمنع الوصول المباشر إلى `api/data/*.json` و`api/config.php`.
- كل عملية في المركز تُسجّل في سجل تدقيق داخلي (`audit`) مع مراجعة كاملة في تبويب «Biometrics & security».
