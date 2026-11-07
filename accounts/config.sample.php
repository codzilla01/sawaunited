<?php
/*
 * نموذج إعدادات — انسخه باسم config.php على السيرفر فقط.
 *
 * ⚠️ مهم:
 *  - ملف config.php لا يُرفع إلى Git ولا يُشارك مع أي حد.
 *  - ملف config.php محمي من القراءة عبر المتصفح بواسطة accounts/.htaccess.
 *  - كلمة السر القديمة كانت موجودة في تاريخ Git، لذلك يجب تغييرها من
 *    hPanel ← Databases قبل النشر (راجع docs/hostinger-deploy.md).
 */
return [
  'driver'  => 'mysql',
  'db_host' => 'localhost',
  'db_name' => 'uXXXXXXXX_accounts',
  'db_user' => 'uXXXXXXXX_accounts',
  'db_pass' => 'اكتب كلمة سر قوية هنا',
];
