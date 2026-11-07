# Sawa United — HTML-first refactor

Repeated page content (navigation links, service cards, project cards, stats, and footer sector links) is now written directly in `index.html`.

JavaScript is only used for behavior:
- project filtering
- mobile menu
- header scroll state
- language/theme toggles
- scroll reveal
- contact form submit prevention

No card/list rendering loop is required for the static content.


### Visual polish v6
- Updated Arabic typography to Tajawal for a cleaner corporate Arabic UI.
- Replaced the hero's primary background with real Dubai photography, with the bundled image retained as a fallback.
- Added a safe UI/UX polish layer for card surfaces, CTA touch targets, readability, focus states, and hover feedback without changing the page structure or JavaScript.


V6: isolated project modal content panel to prevent legacy CSS from hiding project text.


## النشر على Hostinger

```bash
bash scripts/package-deploy.sh   # ينتج dist/sawaunited-deploy-<timestamp>.zip
```

- الحزمة تستبعد `.git/` و`docs/` و`scripts/` و`accounts/config.php` وأصول الصور غير المستخدمة.
- الأسرار تُنشأ على السيرفر فقط من `accounts/config.sample.php`.
- الدليل الكامل خطوة بخطوة: [`docs/hostinger-deploy.md`](docs/hostinger-deploy.md).
