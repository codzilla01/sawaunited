# دليل النشر على Hostinger — Sawa United

> الهدف: نشر الموقع + تطبيق الحسابات الداخلي بأمان، مع إمكانية الرجوع في أي لحظة.
> المدة المتوقعة: 20–40 دقيقة.

---

## 0) قبل أي شيء — تدوير كلمة سر قاعدة البيانات (إجباري) 🔴

كلمة سر قاعدة البيانات كانت موجودة داخل المستودع وفي تاريخ Git، لذلك تُعتبر **مكشوفة**.

1. ادخل **hPanel → Databases → MySQL Databases**.
2. عند المستخدم `u365473113_accounts` اضغط **Change password** وضع كلمة سر قوية جديدة (12+ حرف، حروف كبيرة/صغيرة/أرقام/رموز).
3. لا تكتبها في أي ملف داخل Git — فقط في `accounts/config.php` على السيرفر.

---

## 1) إعدادات PHP

**hPanel → Websites → Manage → PHP Configuration**

| الإعداد | القيمة |
|---|---|
| إصدار PHP | 8.1 أو أحدث (المشروع يستخدم `strict_types` و`str_contains`) |
| الإضافات المطلوبة | `pdo_mysql`, `mbstring`, `json`, `openssl` |
| `display_errors` | Off (في بيئة الإنتاج) |
| `memory_limit` | 256M أو أكثر |

> تطبيق الحسابات يبني جداول قاعدة البيانات تلقائيًا في أول طلب ناجح إلى `accounts/api.php`، فلا حاجة لاستيراد SQL يدويًا.

---

## 2) إنشاء/تجهيز قاعدة البيانات

**hPanel → Databases → MySQL Databases**

- لو القاعدة موجودة: استخدم نفس الاسم/المستخدم بعد تغيير كلمة السر.
- لو جديدة: أنشئ قاعدة + مستخدم، وأعطِ المستخدم كل الصلاحيات على القاعدة.
- **Host** يبقى `localhost` داخل Hostinger.

القيم المطلوبة لاحقًا في `config.php`:

```php
'db_host' => 'localhost',
'db_name' => 'u365473113_accounts',
'db_user' => 'u365473113_accounts',
'db_pass' => 'كلمة السر الجديدة',
```

---

## 3) بناء حزمة النشر

من جهازك (أو من السيرفر لو عندك SSH):

```bash
bash scripts/package-deploy.sh
```

الناتج: `dist/sawaunited-deploy-YYYYMMDD-HHMM.zip`

الحزمة **لا تحتوي** على:

- `.git/`
- `docs/` و`scripts/`
- `accounts/config.php` (الأسرار)
- `accounts/default.php` (صفحة Hostinger الافتراضية — تم حذفها من المشروع)

وفيها فحص أمان يلغي البناء تلقائيًا لو تسرّبت كلمة السر أو الأسرار.

---

## 4) الرفع

**hPanel → Files → File Manager**

1. افتح `public_html` (أو `public_html/sawaunited.net` لو الدومين مضاف كموقع فرعي).
2. ارفع ملف الـzip.
3. كليك يمين → **Extract** ثم **احذف ملف الـzip** بعد فك الضغط.
4. تأكد من وجود: `index.html` · `projects.html` · `.htaccess` · `robots.txt` · `sitemap.xml` · `assets/` · `css/` · `js/` · `accounts/`.

> بديل: FTP عبر **hPanel → Files → FTP Accounts** أو SSH لو مفعّل.

### 4.1 إنشاء ملف الأسرار على السيرفر فقط

1. ادخل `public_html/accounts/`.
2. انسخ `config.sample.php` → **Duplicate**، وسمِّ النسخة `config.php`.
3. عدّل القيم (اسم القاعدة/المستخدم/كلمة السر الجديدة) ثم **Save**.

بدون هذه الخطوة سيرد الـAPI برسالة `no_config` (وهذا سلوك مقصود وآمن).

---

## 5) الدومين و SSL

1. **hPanel → Domains**: تأكد أن `sawaunited.net` يشير إلى هذا الموقع (A record) وأن `www` مضاف.
2. **hPanel → Security → SSL**: ثبّت شهادة مجانية (Let's Encrypt) وفعّل **Force HTTPS**.
3. بعد التأكد أن كل الصفحات تفتح على `https`، افتح `.htaccess` وفعّل سطر HSTS (موجود معلّقًا في القسم 3).

الملف `.htaccess` يقوم أصلًا بـ:
- تحويل HTTP → HTTPS
- تحويل `www` → بدون `www`
- منع فهرسة المجلدات
- حجب `config.php` وملفات النسخ الاحتياطية والملفات المخفية
- ضغط + تخزين مؤقت للأصول

---

## 6) الكاش

**hPanel → Advanced → Cache Manager (LiteSpeed)**

- بعد كل نشر: **Purge All**.
- استثنِ `/accounts/` من الكاش (تطبيق داخلي بجلسات ولا يجب تخزينه).

---

## 7) البريد

**hPanel → Emails**: أنشئ بريدًا رسميًا (مثل `info@sawaunited.net`) واستخدمه في صفحة التواصل بدل الاعتماد على واتساب فقط.

---

## 8) اختبار ما بعد النشر — Checklist

| # | الاختبار | النتيجة المتوقعة |
|---|---|---|
| 1 | `https://sawaunited.net/` | يفتح على HTTPS بدون تحذير |
| 2 | `http://sawaunited.net/` | يحوّل 301 إلى https |
| 3 | تبديل اللغة AR / EN / FR | يغيّر النص والاتجاه بدون reload |
| 4 | الثيم الفاتح/الغامق | يتبدّل ويُحفظ بعد إعادة التحميل |
| 5 | تبويبات القطاعات + الكارت الجانبي | تعمل الحركة والإيقاف عند المرور |
| 6 | `projects.html` | يفتح، الفلاتر والمودال يعملان |
| 7 | أزرار واتساب | تفتح المحادثة بالرقم الصحيح |
| 8 | `https://sawaunited.net/accounts/` | صفحة الدخول تظهر (وليس خطأ 500) |
| 9 | `https://sawaunited.net/accounts/config.php` | **403 / محجوب** |
| 10 | `https://sawaunited.net/accounts/api.php` بالمتصفح | `405` مع JSON (وليس صفحة خطأ) |
| 11 | `https://sawaunited.net/robots.txt` و`sitemap.xml` | متاحان ويحتويان الروابط الصحيحة |
| 12 | موبايل (عرض 375px) | لا سكرول أفقي، الأزرار ≥ 44px |
| 13 | حجم الصفحة | أقل من ~1MB (حاليًا 8.9MB أصول منها ~7MB غير مستخدمة) |
| 14 | Search Console | أضف الموقع + أرسل الـsitemap |

---

## 9) الرجوع للنسخة السابقة (Rollback)

- احتفظ بآخر حزمة ناجحة على جهازك باسم واضح.
- قبل أي نشر جديد: **hPanel → Files** → انسخ `index.html` و`projects.html` و`.htaccess` إلى مجلد `_backup-YYYYMMDD` (خارج مسار الويب أو داخل مع حجب الوصول).
- للرجوع: ارفع الحزمة القديمة وفك الضغط فوق الملفات الحالية، ثم **Purge cache**.
- فعّل **hPanel → Files → Backups** (نسخ أسبوعية تلقائية).

---

## 10) ما لا يجب رفعه أبدًا

- `accounts/config.php` (محليًا فقط، ويُنشأ على السيرفر)
- `.git/` · `docs/` · `scripts/` · `dist/`
- أي ملف `.sql` أو `.zip` أو `.bak`

تم حجبها جميعًا في `.htaccess` كخط دفاع ثانٍ، لكن الأفضل ألا تصل أصلًا.

---

## 11) ملاحظات خاصة بالمشروع

- **`accounts/` تطبيق داخلي**: لا يُربط من الموقع العام، ومحمي بـ`noindex` (ميتا + هيدر) و`Disallow` في robots.
- **روابط القطاعات خارجية**: `masharycar.net` · `sawafood.net` · `sawa-united.net` · `startwalk.net` — تأكد من ملكية كل دومين وأنه يعمل قبل الإطلاق (لاحظ الفرق بين `sawaunited.net` و`sawa-united.net`).
- **صور المشروعات** حاليًا مستضافة من Unsplash؛ يُفضّل استبدالها بصور مملوكة قبل الإطلاق التجاري.
- **لا Analytics** في النسخة الحالية: أضف معرّف القياس بعد النشر إن رغبت.
