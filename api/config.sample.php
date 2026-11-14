<?php
/**
 * SAWA UNITED GROUP — Ecosystem API configuration (sample)
 * --------------------------------------------------------------------------
 * 1) انسخ هذا الملف إلى api/config.php على السيرفر (Hostinger).
 * 2) غيّر البريد وكلمة المرور قبل النشر الفعلي.
 * 3) لإنشاء بصمة كلمة مرور جديدة:
 *    php -r 'echo hash("sha256", "EMAIL:PASSWORD:SALT");'
 *
 * Never commit api/config.php — it is ignored by .gitignore and by the
 * deployment packaging script.
 */

return array(
    // حساب المطور الوحيد المسموح له بالدخول إلى /super-admin
    'email'     => 'developer@sawaunited.net',

    // sha256("developer@sawaunited.net:SawaMaster@2026!:sawa-2026-dev-salt-9f3a")
    'pass_hash' => '3c4c30e941f00f50d4230e69a8d4a610766cb1d7cfb9be4970af2c2461b52d68',

    // الملح المستخدم في حساب البصمة (غيّره مع كلمة المرور)
    'salt'      => 'sawa-2026-dev-salt-9f3a',

    'role'      => 'SUPER_DEVELOPER_ADMIN',

    // اتركه فارغًا ليُشتق تلقائيًا من مسار السيرفر، أو ضع قيمة عشوائية طويلة
    'secret'    => '',

    // نطاقات إضافية مسموحة (مفصولة بفاصلة) — اتركه فارغًا لنفس الدومين فقط
    'allow_origin' => '',
);
