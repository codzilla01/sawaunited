# -*- coding: utf-8 -*-
"""
Verified Bilingual Content Repository for SAWA UNITED GROUP Corporate Portfolio
All metrics, domains, sectors, products, markets, and credentials are strictly sourced
from official SAWA UNITED platforms (sawaunited.net, sawa-united.net, sawafood.net,
masharycar.net, startwalk.net) with structured placeholders where external data is unpublished.
"""

BRAND = {
    "obsidian": "#07090E",
    "obsidian2": "#0D131D",
    "obsidian_card": "#121A27",
    "obsidian_line": "#233044",
    "ivory": "#F7F5F0",
    "ivory2": "#EFECE4",
    "ivory_card": "#FFFFFF",
    "ivory_line": "#DDD7C8",
    "gold": "#D4A033",
    "gold_bright": "#E3B85A",
    "gold_deep": "#9E7215",
    "silver": "#E8EEF5",
    "muted_dark": "#94A3B8",
    "muted_light": "#526071",
    "ink_dark": "#F4F7FB",
    "ink_light": "#0B1018",
    "estate": "#D4A033",
    "food": "#22A45D",
    "car": "#F26B3A",
    "oil": "#2F7BEA",
}

CONTENT = {
    "ar": {
        "rtl": True,
        "group_name": "مجموعة سوا يونيتد",
        "group_en": "SAWA UNITED GROUP",
        "doc_label_full": "الملف التعريفي وبورتفوليو الأعمال المؤسسي · 2026",
        "doc_label_exec": "الملف التنفيذي المختصر · 2026",
        "tagline": "نبني الأعمال. نصنع الأثر.",
        "sub_tagline": "أربعة قطاعات استراتيجية.. معيار مؤسسي واحد للأداء والثقة والنمو المستدام",
        "footer_left": "sawaunited.net  |  +20 101 122 5592",
        "footer_right": "مجموعة سوا يونيتد — بورتفوليو الأعمال المؤسسي",

        # Slide 01: Cover
        "s01": {
            "eyebrow": "CORPORATE PROFILE & BUSINESS PORTFOLIO · 2026",
            "title": "مجموعة سوا يونيتد",
            "subtitle": "SAWA UNITED GROUP",
            "lead": "منظومة أعمال متنوعة تبني وتدير وتستثمر في منصات قطاعية متخصصة عبر أسواق الشرق الأوسط وأفريقيا، برؤية استثمارية طويلة الأمد وتنفيذ تشغيلي منضبط.",
            "sectors_bar": [
                ("العقارات والاستثمار", "sawa-united.net", "estate"),
                ("المواد الغذائية والإمداد", "sawafood.net", "food"),
                ("تأجير السيارات والتنقل", "masharycar.net", "car"),
                ("مشتقات البترول والصناعة", "startwalk.net", "oil"),
            ],
        },

        # Slide 02: About Us
        "s02": {
            "num": "02",
            "kicker": "من نحن · WHO WE ARE",
            "title": "مؤسسة متعددة القطاعات.. تبني الأصول وتصنع الفرص",
            "p1": "تُعد SAWA UNITED GROUP مجموعة أعمال متنوعة تركز على بناء الشركات، وتطوير الأصول، وابتكار فرص تجارية واستثمارية عملية عبر الأسواق الإقليمية الرئيسية.",
            "p2": "تجمع فلسفتنا المؤسسية بين الحوكمة المركزية والمنصات التشغيلية المتخصصة؛ حيث يعمل كل قطاع تحت إدارة خبيرة تدرك تفاصيل السوق المحلي، بينما يلتزم بمعيار المجموعة الموحد في الشفافية، وجودة التنفيذ، وبناء العلاقات المستدامة.",
            "quote": "«نهتم بأدق التفاصيل التشغيلية والاستثمارية، لنمنح عملاءنا وشركاءنا قاعدة صلبة للنمو بثقة.»",
            "kpis": [
                ("15+", "سنة من النمو والخبرة المؤسسية"),
                ("4", "قطاعات أعمال رئيسية متخصصة"),
                ("12", "سوقاً مترابطاً عبر الإقليم والتصدير"),
                ("40+", "مشروعاً ومبادرة أعمال منجزة"),
                ("2,500+", "فرد ضمن فرق العمل والمنظومة"),
            ],
            "note": "* ملاحظة توثيقية: يمتد الإرث التشغيلي الصناعي داخل المجموعة (قطاع مشتقات البترول — START WALK) منذ عام 2002 بأكثر من 24 عاماً من الخبرة الميدانية.",
        },

        # Slide 03: Vision, Mission & Values
        "s03": {
            "num": "03",
            "kicker": "البوصلة الاستراتيجية · VISION & MISSION",
            "title": "رؤيتنا ورسالتنا ومنظومة قيمنا المؤسسية",
            "vision_t": "رؤيتنا المستقبلية",
            "vision_p": "أن نكون المجموعة الإقليمية الأكثر موثوقية وتأثيراً في ربط الأسواق وبناء منصات أعمال رائدة تحقق قيمة اقتصادية مستدامة طويلة الأجل عبر قطاعات الاقتصاد الحقيقي.",
            "mission_t": "رسالتنا المؤسسية",
            "mission_p": "تطوير وإدارة منصات متخصصة في العقارات والأغذية والتنقل والطاقة، تقدم حلولاً عملية عالية الجودة بشفافية مطلقة، وتفتح آفاق شراكات رابحة للعملاء والمستثمرين والموردين.",
            "objectives_t": "المرتكزات والأهداف الاستراتيجية",
            "objectives": [
                ("نبني (BUILD)", "تأسيس وتطوير منصات أعمال قطاعية قابلة للتوسع الإقليمي بمعايير تشغيل حديثة."),
                ("ندير (OPERATE)", "إدارة سلاسل الإمداد والأساطيل والأصول بكفاءة تشغيلية عالية والتزام صارم بالمواعيد."),
                ("نستثمر (INVEST)", "توجيه رأس المال والقدرات نحو أصول ومشروعات ذات عوائد حقيقية مستدامة بعيدة عن المضاربة."),
            ],
            "values": [
                ("الانضباط التنفيذي", "تحويل الفرص المدروسة إلى نتائج ملموسة وفق جداول زمنية ومعايير دقيقة."),
                ("الشفافية والمساءلة", "وضوح تام في المعلومات والتسعير والأرقام في كل تعاقد ومعاملة تجارية."),
                ("الجودة الانتقائية", "انتقاء العقار والمنتج والأسطول والمورد بعناية قبل تقديمه للعميل."),
                ("شراكات طويلة الأمد", "بناء علاقات عمل ممتدة تقوم على الثقة المتبادلة وتكامل المصالح."),
            ],
        },

        # Slide 04: Business Ecosystem
        "s04": {
            "num": "04",
            "kicker": "منظومة أعمالنا · BUSINESS ECOSYSTEM",
            "title": "أربعة قطاعات حيوية.. تحت مظلة مؤسسية واحدة",
            "sub": "تعمل SAWA UNITED من خلال أربع منصات متخصصة تغطي ركائز الاقتصاد الحقيقي، وتتكامل فيما بينها تشغيلياً ولوجستياً وتجارياً.",
            "hub_title": "SAWA UNITED GROUP",
            "hub_sub": "الإدارة الاستراتيجية · معايير الجودة · تكامل الأسواق",
            "sectors": [
                ("01", "العقارات والاستثمار العقاري", "SAWA UNITED Real Estate", "sawa-united.net", "estate",
                 "فرص عقارية منتقاة للسكن والاستثمار والتشغيل التجاري في مصر والمغرب مع مرافقة استشارية حتى التسليم."),
                ("02", "المواد الغذائية وسلاسل الإمداد", "SAWA FOOD & Sawa Select", "sawafood.net", "food",
                 "شبكة توزيع وتوريد إقليمية تربط أكثر من 120 علامة تجارية بـ 1,400+ شريك تجزئة عبر 5 أسواق."),
                ("03", "تأجير السيارات وحلول التنقل", "MASHARY CARS", "masharycar.net", "car",
                 "أسطول حديث للإيجار اليومي والشهري للأفراد والشركات في مصر والإمارات والمغرب بنظام الدفع عند الاستلام."),
                ("04", "مشتقات البترول والخدمات الصناعية", "START WALK", "startwalk.net", "oil",
                 "شركة مسجلة بالهيئة المصرية العامة للبترول منذ 2002 لتوريد الوقود والزيوت والنقل الصناعي والتصدير."),
            ],
            "synergy": "التكامل التشغيلي للمنظومة: الطاقة والزيوت تدعم الأساطيل والمصانع  ←  الأساطيل واللوجستيات تحرّك سلاسل الغذاء والتنقل  ←  الأصول العقارية تحتضن الأعمال والاستثمار.",
        },

        # Slide 05: Sector 1 — Real Estate
        "s05": {
            "num": "05",
            "kicker": "القطاع الأول · REAL ESTATE SECTOR",
            "title": "التطوير والاستثمار العقاري — SAWA UNITED",
            "domain": "sawa-united.net",
            "accent": "estate",
            "photo": "sector-realestate.jpg",
            "slogan": "«ننتقي العقار بعناية قبل عرضه.. بيتك واستثمارك في مصر حتى وأنت في الخارج»",
            "about": "تقدم منصة SAWA UNITED العقارية تجربة استثمارية وسكنية واضحة تقوم على الفحص المسبق للفرص، وتنظيم البيانات بدقة، ومرافقة المستثمر المحلي والدولي خطوة بخطوة من الاكتشاف والمقارنة حتى المعاينة الميدانية والتسليم.",
            "services": [
                "الاستثمار في الفيلات المستقلة والمجتمعات السكنية الراقية",
                "الشقق السكنية والفندقية المخدومة (Serviced Apartments)",
                "المكاتب الإدارية والوحدات التجارية ذات الواجهات الرئيسية",
                "الأراضي الاستثمارية في المواقع الاستراتيجية سريعة النمو",
                "الاستشارات العقارية عن بُعد للمغتربين والمستثمرين الدوليين",
            ],
            "value_t": "القيمة المضافة للعميل والمستثمر",
            "value": "اختصار وقت البحث عبر عقارات موثقة (Verified)، معلومات شفافة غير مضللة، ومستشار عقاري مباشر يرتب الزيارات ويتابع حتى الاستلام.",
            "highlights": [
                ("مصر والمغرب", "الأسواق العقارية النشطة على المنصة"),
                ("5 وجهات", "القاهرة الجديدة · العاصمة · الساحل · الإسكندرية · المعادي"),
                ("4 مراحل", "اكتشف ← قارن ← تواصل ← عاين واستلم"),
            ],
        },

        # Slide 06: Sector 2 — Food Supplies
        "s06": {
            "num": "06",
            "kicker": "القطاع الثاني · FOOD SUPPLIES & FMCG",
            "title": "المواد الغذائية وسلاسل الإمداد — SAWA FOOD",
            "domain": "sawafood.net",
            "accent": "food",
            "photo": "sector-food.jpg",
            "slogan": "«غذاء أفضل.. أقرب إلى كل سوق عبر شبكة توزيع إقليمية موثوقة»",
            "about": "تعمل Sawa Food كحلقة وصل استراتيجية بين المصنعين الملتزمين بالجودة والموزعين وتجار الجملة ومنافذ التجزئة في الشرق الأوسط، مع تطوير خط منتجات مختارة يحمل علامة Sawa Select.",
            "services": [
                "التوريد بالجملة (Wholesale Supply) للمنتجات الغذائية والسلع الأساسية",
                "التوزيع الإقليمي وبناء شبكات الوكلاء والموزعين في الأسواق العربية",
                "تزويد سلاسل التجزئة والمتاجر (+1,400 منفذ شريك) بإمداد منتظم",
                "تمكين المصنعين من إدراج وتوسيع انتشار علاماتهم التجارية إقليمياً",
                "منتجات Sawa Select: الشاي الأسود الفاخر، السمن النقي، والأرز طويل الحبة",
            ],
            "value_t": "القيمة المضافة للشركاء التجاريين",
            "value": "حماية استمرارية التوريد وتوافر المنتج، فحص صارم للجودة وتجانس المواصفات من المصدر، ومعرفة ميدانية عميقة بمتطلبات كل سوق محلي.",
            "highlights": [
                ("250+", "منتجاً غذائياً منتقى بعناية"),
                ("120+", "علامة تجارية غذائية موثوقة"),
                ("1,400+", "شريك تجزئة في 5 أسواق إقليمية"),
            ],
        },

        # Slide 07: Sector 3 — Automotive
        "s07": {
            "num": "07",
            "kicker": "القطاع الثالث · AUTOMOTIVE & MOBILITY",
            "title": "تأجير السيارات وحلول التنقل — MASHARY CARS",
            "domain": "masharycar.net",
            "accent": "car",
            "photo": "sector-automotive.jpg",
            "slogan": "«تنقّل بثقة ومرونة.. أسطول حديث للأفراد والشركات بدون تعقيدات»",
            "about": "توفر منصة Mashary Cars حلول تأجير سيارات يومية وشهرية ومؤسسية عبر أسطول متنوع يغطي مصر والإمارات العربية المتحدة والمغرب، مع تجربة حجز رقمية مبسطة وتأكيد فوري مباشر.",
            "services": [
                "التأجير اليومي والشهري للأفراد ورجال الأعمال والمسافرين",
                "حلول عقود الأساطيل والنقل للشركات والمؤسسات (Vans & Buses)",
                "فئات شاملة: الاقتصادية والسيدان، الدفع الرباعي SUV، الفاخرة والرياضية",
                "تلبية الطلبات الخاصة لطرازات محددة خارج القائمة المعروضة",
                "خيارات استلام مرنة في وجهات متعددة مع إمكانية توفير سائق",
            ],
            "value_t": "القيمة التنافسية للعميل",
            "value": "ميزة الدفع عند استلام السيارة (Pay on Delivery) دون اشتراط دفع إلكتروني مسبق، تسعير واضح بدون رسوم خفية، ودعم فوري عبر واتساب.",
            "highlights": [
                ("3 دول", "أسطول تشغيلي في مصر · الإمارات · المغرب"),
                ("6 فئات", "اقتصادي · سيدان · عائلي · SUV · فاخر · باصات"),
                ("0% مقدم أونلاين", "الدفع المباشر عند استلام السيارة"),
            ],
        },

        # Slide 08: Sector 4 — Petroleum
        "s08": {
            "num": "08",
            "kicker": "القطاع الرابع · PETROLEUM & INDUSTRIAL",
            "title": "مشتقات البترول والزيوت الصناعية — START WALK",
            "domain": "startwalk.net",
            "accent": "oil",
            "photo": "sector-petroleum.jpg",
            "slogan": "«خبرة صناعية منذ 2002.. مسجلة لدى الهيئة المصرية العامة للبترول»",
            "about": "شركة مصرية ذات مسؤولية محدودة تأسست عام 2002 ومسجلة رسمياً بالهيئة المصرية العامة للبترول (EGPC). تتخصص في نقل وتوزيع المنتجات البترولية وتسويق زيوت التزييت المحلية والدولية وخدمة القطاعات الصناعية والمعدات الثقيلة في مصر وأسواق التصدير.",
            "services": [
                "توريد الوقود لمواقع العمل والمشروعات عبر أسطول نقل وصهاريج متطورة",
                "وحدات التزود بالوقود المتنقلة (Mobile Fuel Units) لتقليل زمن وتكلفة التوقف",
                "توريد زيوت المحركات والزيوت الصناعية وزيوت وفلاتر المعدات الثقيلة بالدعم الفني",
                "توريد وصيانة طلمبات الوقود وتنظيف الخزانات والمنشآت البترولية",
                "المقاولات والتوريدات المحجرية (الرمل، السن، وخلطات الأسفلت للطرق)",
            ],
            "value_t": "القيمة المضافة للقطاعات الصناعية والمشروعات",
            "value": "شريك واحد يدمج التوريد البترولي والنقل المجهز والصيانة الميدانية مع سجل موثق يتجاوز 90 مليون لتر والتزام صارم بالسلامة والمواعيد.",
            "highlights": [
                ("90M+ لتر", "حجم المنتجات والزيوت الموزعة"),
                ("25+ شاحنة", "أسطول نقل متطور · +384 عميلاً"),
                ("24+ عاماً", "خبرة منذ 2002 وتصدير لـ 3 دول أفريقية"),
            ],
        },

        # Slide 09: Integrated Services Matrix
        "s09": {
            "num": "09",
            "kicker": "منظومة الخدمات والحلول · SERVICES & SOLUTIONS",
            "title": "حلول تجارية ومؤسسية متكاملة عبر القطاعات",
            "sub": "صُممت خدمات المجموعة لتلبية احتياجات الشركات الكبرى (B2B) والمستثمرين والعملاء الأفراد (B2C) بمرونة تعاقدية عالية.",
            "cols": [
                ("الحلول العقارية والاستثمارية", "estate", [
                    "وساطة واستشارات عقارية انتقائية",
                    "فرص الأراضي والوحدات التجارية والإدارية",
                    "إدارة رحلة الشراء للمغتربين عن بُعد",
                    "المتابعة الميدانية حتى التسليم النهائي",
                ], "المستثمرون · الشركات · الأفراد"),
                ("حلول الإمداد والتوزيع الغذائي", "food", [
                    "توريد الجملة للسلع الغذائية الأساسية",
                    "إدارة التوزيع الإقليمي في 5 أسواق",
                    "تمثيل وتوسيع انتشار العلامات المصنّعة",
                    "توريد منتجات علامة Sawa Select",
                ], "الموزعون · تجار الجملة · التجزئة · المصانع"),
                ("حلول الأساطيل والتنقل المؤسسي", "car", [
                    "عقود تأجير شهري وسنوي للشركات",
                    "تأجير يومي للسيارات الفاخرة والاقتصادية",
                    "توفير حافلات وفانات نقل فرق العمل",
                    "توفير سيارات خاصة بسائق وحسب الطلب",
                ], "الشركات · الوفود · الأفراد · السياحة"),
                ("حلول الطاقة والإمداد الصناعي", "oil", [
                    "توريد الوقود ووحدات التموين المتنقلة",
                    "زيوت المحركات والمصانع والمعدات الثقيلة",
                    "نقل المنتجات البترولية والمعدات الثقيلة",
                    "صيانة الطلمبات والخزانات وتوريدات الطرق",
                ], "المصانع · شركات المقاولات · البترول · التصدير"),
            ],
        },

        # Slide 10: Projects & Portfolio
        "s10": {
            "num": "10",
            "kicker": "مشروعاتنا وأعمالنا · PORTFOLIO & VENTURES",
            "title": "منصات ومشروعات موثقة على أرض الواقع",
            "sub": "نماذج فعلية من المنصات التشغيلية والأصول العقارية والمنتجات المنفذة ضمن منظومة SAWA UNITED.",
            "ventures": [
                ("SAWA UNITED REAL ESTATE", "العقارات · مصر والمغرب · 2026", "estate",
                 "منصة عقارية تضم وحدات سكنية وإدارية وتجارية وأراضي مختارة: فيلا التجمع الخامس (420 م²)، أرض جولدن سكوير (2,000 م²)، تجاري العاصمة الإدارية (380 م²)، الساحل الشمالي سيدي عبد الرحمن (240 م²)، سموحة (165 م²)، والمعادي (180 م²)."),
                ("SAWA FOOD & SAWA SELECT", "الأغذية · الشرق الأوسط وشمال أفريقيا · 2024", "food",
                 "منصة إمداد وتوزيع غذائي إقليمية تضم +250 منتجاً و+120 علامة تجارية، إلى جانب إطلاق تشكيلة Sawa Select (الشاي الأسود الفاخر، السمن النقي، الأرز طويل الحبة)."),
                ("MASHARY CARS FLEET", "السيارات · الإمارات ومصر والمغرب · 2025", "car",
                 "منصة تأجير وتنقل إقليمية تشغّل أسطولاً متنوعاً يبدأ من الفئات الاقتصادية الأوتوماتيكية الحديثة وصولاً إلى سيارات الدفع الرباعي والسيارات الفاخرة وحافلات الشركات."),
                ("START WALK ENERGY & INDUSTRIAL", "البترول والصناعة · مصر والتصدير · 2026", "oil",
                 "منظومة إمداد ونقل وصيانة بترولية وصناعية راسخة منذ 2002، حققت توزيع أكثر من 90 مليون لتر وخدمة +384 عميلاً مع عمليات تصدير نشطة إلى ليبيا والسودان وجنوب أفريقيا."),
            ],
        },

        # Slide 11: Capabilities & Expertise
        "s11": {
            "num": "11",
            "kicker": "خبراتنا وإمكانياتنا · CAPABILITIES & SCALE",
            "title": "قدرات تشغيلية وإدارية ولوجستية تُترجم بالأرقام",
            "sub": "ترتكز قوة SAWA UNITED على بنية تشغيلية حقيقية وكوادر بشرية متخصصة وشبكات توزيع ممتدة.",
            "bars": [
                ("حجم التوزيع البترولي والزيوت (START WALK)", "90,000,000+ لتر", 0.94, "oil"),
                ("شبكة منافذ وشركاء التجزئة الغذائية (SAWA FOOD)", "1,400+ شريك تجزئة", 0.88, "food"),
                ("قاعدة الكفاءات وفرق العمل بالمجموعة", "2,500+ فرد متخصص", 0.85, "estate"),
                ("قاعدة العملاء الصناعيين والمؤسسيين (قطاع الطاقة)", "384+ شركة وعميل", 0.78, "oil"),
                ("محفظة العلامات والمنتجات الغذائية المدارة", "250+ منتج / 120+ علامة", 0.74, "food"),
                ("الأسطول اللوجستي والمشروعات المنجزة", "40+ مشروعاً / 25+ شاحنة صهريج", 0.70, "car"),
            ],
            "caps": [
                ("حوكمة متعددة القطاعات", "إدارة تنفيذية متمرسة قادرة على تشغيل قطاعات خدمية وصناعية وتجارية متباينة بكفاءة موحدة."),
                ("بنية لوجستية وأساطيل مملوكة", "شاحنات نقل منتجات بترولية مجهزة، وحدات وقود متنقلة، وسلاسل إمداد غذائية عابرة للحدود."),
                ("جاهزية رقمية وتجارية", "منصات رقمية متخصصة لكل قطاع مرتبطة بقنوات استجابة فورية لخدمة عملاء الشركات والأفراد."),
            ],
        },

        # Slide 12: Business Model
        "s12": {
            "num": "12",
            "kicker": "نموذج العمل · OPERATING MODEL",
            "title": "منهجية مؤسسية متكاملة من دراسة الفرصة حتى الاستدامة",
            "sub": "نتبع دورة عمل منضبطة من خمس مراحل تضمن تقليل المخاطر وتعظيم القيمة للعميل والشريك في كل صفقة ومشروع.",
            "steps": [
                ("01", "الرصد والفحص المسبق", "دراسة احتياج السوق أو العميل، والتحقق المسبق من جودة الأصل العقاري أو المورد أو متطلبات الموقع الصناعي."),
                ("02", "هيكلة الحل والتسعير", "تصميم عرض فني وتجاري مخصص بتسعير واضح وشفاف يتناسب مع حجم التوريد أو الهدف الاستثماري."),
                ("03", "التعاقد وتخصيص الفريق", "إرساء أطر تعاقدية مسؤولة وتوجيه العميل إلى الفريق القطاعي المختص لإدارة التنفيذ المباشر."),
                ("04", "التنفيذ واللوجستيات", "تشغيل سلاسل الإمداد والأساطيل وإدارة التسليم الميداني وفق أعلى معايير السلامة والالتزام الزمني."),
                ("05", "المتابعة وبناء الشراكة", "استمرار الدعم الفني والاستشاري بعد التسليم لتحويل المعاملة الفردية إلى شراكة نمو طويلة الأمد."),
            ],
            "bottom_note": "نموذج استجابة مرن: نقطة تواصل موحدة على مستوى المجموعة توجه كل فرصة فوراً إلى وحدة الأعمال المختصة.",
        },

        # Slide 13: Competitive Value / Why SAWA UNITED
        "s13": {
            "num": "13",
            "kicker": "القيمة التنافسية · WHY SAWA UNITED?",
            "title": "لماذا تختار المؤسسات والمستثمرون SAWA UNITED؟",
            "sub": "خمس مزايا تنافسية أصيلة تمنح شركاءنا أفضلية حقيقية في الأسواق المحلية والإقليمية:",
            "pillars": [
                ("01", "قيادة ذات خبرة متعددة القطاعات", "خبرة إدارية متراكمة تمتد لأكثر من 15 عاماً على مستوى المجموعة (ومنذ 2002 في القطاع البترولي) تمنحنا رؤية أشمل للفرص وإدارة المخاطر."),
                ("02", "أسواق وقدرات مترابطة إقليمياً", "حضور يربط بين مصر والخليج والمغرب العربي وأسواق التصدير الأفريقية، مما يفتح لشركائنا قنوات نفاذ فورية لأسواق متعددة."),
                ("03", "عقلية استثمارية طويلة المدى", "لا نسعى وراء المكاسب قصيرة الأجل؛ بل نصمم كل مشروع وعقد توريد لبناء أصول راسخة وعوائد مستدامة."),
                ("04", "تشغيل مسؤول وشفافية كاملة", "وضوح مطلق في المواصفات والتسعير والأرقام؛ من العقارات المفحوصة مسبقاً إلى الدفع عند الاستلام في قطاع السيارات."),
                ("05", "شراكات مصممة للبقاء والنمو", "نعمل كذراع تشغيلي واستراتيجي مساند لعملائنا وموردينا، مع التزام كامل باستمرارية الإمداد وجودة ما بعد البيع."),
            ],
        },

        # Slide 14: Partners & Clients
        "s14": {
            "num": "14",
            "kicker": "شركاء النجاح والاعتمادات · PARTNERS & CLIENTS",
            "title": "منظومة ثقة مبنية على الاعتمادات الرسمية وشبكات الشركاء",
            "sub": "تلتزم المجموعة بأعلى معايير الدقة المؤسسية؛ حيث نعرض الاعتمادات والمؤشرات الموثقة رسمياً مع تخصيص مساحات لإدراج شعارات الشركاء والعملاء وفق أذونات النشر المعتمدة.",
            "verified_badges": [
                ("اعتماد حكومي موثق", "الهيئة المصرية العامة للبترول (EGPC)", "شركة START WALK مسجلة رسمياً لدى الهيئة المصرية العامة للبترول منذ تأسيسها عام 2002."),
                ("شبكة العلامات والمصنعين", "+120 علامة تجارية غذائية ومصنّع زيوت", "شراكات توزيع وتوريد مع مصنعي الأغذية ومصنعي زيوت التزييت المحليين والدوليين."),
                ("قاعدة العملاء والمنافذ", "+1,400 شريك تجزئة  |  +384 عميلاً صناعياً", "ثقة تجارية راسخة تشمل سلاسل التجزئة وتجار الجملة والشركات الصناعية ومواقع المقاولات."),
            ],
            "slots_title": "مساحات مخصصة لإدراج شعارات شركاء النجاح والعملاء المعتمدين (قيد التخصيص الرسمي)",
            "slots": [
                "[ شعار شريك استراتيجي 01 ]",
                "[ شعار شريك صناعي / توريد 02 ]",
                "[ شعار سلسلة تجزئة / موزع 03 ]",
                "[ شعار عميل مؤسسي 04 ]",
                "[ شعار مطور / شريك عقاري 05 ]",
                "[ شعار شريك دولي 06 ]",
            ],
        },

        # Slide 15: Markets & Geographic Scope
        "s15": {
            "num": "15",
            "kicker": "الأسواق ونطاق العمل · REGIONAL & EXPORT REACH",
            "title": "حضور إقليمي فاعل وشبكة تصدير عابرة للحدود",
            "sub": "تدير المجموعة عملياتها عبر شبكة مترابطة تشمل 12 سوقاً من خلال مقرات ومنصات تشغيلية وشبكات توزيع وتصدير موثقة:",
            "regions": [
                ("مصر (المركز التشغيلي الرئيسي)", "EG", "العقارات · الأغذية · السيارات · البترول والصناعة"),
                ("الإمارات العربية المتحدة", "AE", "تواجد المجموعة · تأجير السيارات · شبكة الأغذية"),
                ("المملكة العربية السعودية", "SA", "تواجد المجموعة · شبكة التوزيع الغذائي الإقليمية"),
                ("المملكة المغربية", "MA", "تواجد المجموعة · الاستثمار العقاري · تأجير السيارات"),
                ("دولة الكويت", "KW", "تواجد المجموعة وشبكة العلاقات التجارية الخليجية"),
                ("المملكة الأردنية الهاشمية", "JO", "شبكة توزيع ومنافذ بيع منتجات Sawa Food"),
                ("أسواق التصدير الأفريقية", "EXP", "تصدير الزيوت والمنتجات البترولية: ليبيا · السودان · جنوب أفريقيا"),
            ],
        },

        # Slide 16: Partnership & Cooperation Opportunities
        "s16": {
            "num": "16",
            "kicker": "فرص التعاون والشراكات · PARTNERSHIP TRACKS",
            "title": "مسارات مفتوحة للتعاون التجاري والاستثماري الإقليمي",
            "sub": "ترحب SAWA UNITED ببناء تحالفات استراتيجية وشراكات عمل مع المؤسسات والمستثمرين والمصنعين عبر أربعة مسارات رئيسية:",
            "tracks": [
                ("01", "شراكات الاستثمار والتطوير العقاري", "estate",
                 "التعاون مع المطورين العقاريين وملاك الأصول والمستثمرين الأفراد والمؤسسات لتسويق وتطوير الفرص السكنية والتجارية والأراضي الاستثمارية في مصر والمغرب."),
                ("02", "وكالات التوزيع والتصنيع الغذائي", "food",
                 "انضمام الموزعين الإقليميين وتجار الجملة وسلاسل التجزئة، أو شراكة المصنعين الراغبين في إدراج منتجاتهم وتوسيع حصتهم السوقية عبر شبكة Sawa Food في 5 دول."),
                ("03", "عقود توريد الطاقة والخدمات الصناعية", "oil",
                 "اتفاقيات توريد الوقود والزيوت الصناعية طويل الأجل، تأجير وحدات التموين المتنقلة، النقل البترولي المجهز، وتوكيلات التصدير للأسواق الأفريقية."),
                ("04", "عقود الأساطيل والتنقل للشركات", "car",
                 "برامج تأجير شهري وسنوي مخصصة للشركات والوفود والمؤسسات بأساطيل حديثة وحلول تشغيل مرنة في مصر والإمارات والمغرب."),
            ],
        },

        # Slide 17: Quality, Governance & Commitment
        "s17": {
            "num": "17",
            "kicker": "الجودة والالتزام المؤسسي · QUALITY & GOVERNANCE",
            "title": "معايير راسخة في الجودة والسلامة والشفافية",
            "sub": "يمثل الالتزام بالمعايير المهنية والرقابية حجر الزاوية في حماية سمعة المجموعة ومصالح عملائها وشركائها:",
            "standards": [
                ("الفحص والانتقاء المسبق", "لا يُعرض أي عقار أو منتج غذائي قبل تقييمه والتحقق من جودته ومواصفاته وملاءمته الفعلية لاحتياج العميل."),
                ("السلامة المهنية وحماية البيئة (HSE)", "تطبيق مبدأ «السلامة أولاً» وحماية البيئة وإدارة الموارد بكفاءة في كافة عمليات النقل والتخزين والتموين البترولي."),
                ("الامتثال القانوني والتنظيمي", "العمل عبر كيانات قانونية مسجلة ومعتمدة (بما يشمل التسجيل الرسمي بالهيئة المصرية العامة للبترول منذ عام 2002)."),
                ("شفافية التعامل والالتزام الزمني", "وضوح كامل في شروط التعاقد والأسعار، واستجابة لوجستية منضبطة تضمن التسليم في الموعد المحدد."),
            ],
            "cert_placeholder_t": "مساحة مخصصة لشهادات الجودة والمطابقة الإضافية",
            "cert_placeholder_p": "[ مساحة مخصصة لإدراج أرقام وشعارات شهادات ISO / السلامة الغذائيـة / الاعتمادات المهنية المعتمدة عند التحديث ]",
        },

        # Slide 18: Call to Action, Contact & Closing Cover
        "s18": {
            "num": "18",
            "kicker": "تواصل معنا · LET'S BUILD TOGETHER",
            "title": "لنبنِ معاً شراكة تصنع أثراً مستداماً",
            "lead": "فريق تطوير الأعمال والفرق القطاعية المختصة في مجموعة سوا يونيتد على أتم الاستعداد لبحث فرص التعاون والاستثمار والتوريد.",
            "contacts": [
                ("البوابة الرئيسية للمجموعة", "https://sawaunited.net"),
                ("منصة العقارات والاستثمار", "https://sawa-united.net"),
                ("منصة الأغذية والتوزيع", "https://sawafood.net"),
                ("منصة تأجير السيارات", "https://masharycar.net"),
                ("منصة البترول والصناعة", "https://startwalk.net"),
                ("الهاتف وواتساب الأعمال الموحد", "+20 101 122 5592  (wa.me/201011225592)"),
                ("الصفحة الرسمية على فيسبوك", "facebook.com/Sawaunited.net"),
                ("البريد الإلكتروني (قطاع البترول)", "info@startwalk.com"),
                ("البريد المؤسسي والعنوان الرئيسي", "[ مساحة مخصصة لإدراج البريد المركزي وعنوان المقر الرئيسي ]"),
            ],
            "closing_motto": "SAWA UNITED GROUP  —  نبني الأعمال. نصنع الأثر.",
        },
    },

    "en": {
        "rtl": False,
        "group_name": "SAWA UNITED GROUP",
        "group_en": "مجموعة سوا يونيتد",
        "doc_label_full": "CORPORATE PROFILE & BUSINESS PORTFOLIO · 2026",
        "doc_label_exec": "EXECUTIVE CORPORATE PROFILE · 2026",
        "tagline": "Building Businesses. Creating Impact.",
        "sub_tagline": "Four Specialized Sectors · One Institutional Standard for Performance, Trust & Long-Term Value",
        "footer_left": "sawaunited.net  |  +20 101 122 5592",
        "footer_right": "SAWA UNITED GROUP — Corporate Business Portfolio",

        # Slide 01: Cover
        "s01": {
            "eyebrow": "CORPORATE PROFILE & BUSINESS PORTFOLIO · 2026",
            "title": "SAWA UNITED GROUP",
            "subtitle": "مجموعة سوا يونيتد",
            "lead": "A diversified multi-sector business group building, operating, and investing in specialized commercial platforms across the Middle East and Africa — driven by disciplined execution and a long-term value horizon.",
            "sectors_bar": [
                ("Real Estate & Investment", "sawa-united.net", "estate"),
                ("Food Supplies & FMCG", "sawafood.net", "food"),
                ("Car Rental & Mobility", "masharycar.net", "car"),
                ("Petroleum & Industrial", "startwalk.net", "oil"),
            ],
        },

        # Slide 02: About Us
        "s02": {
            "num": "02",
            "kicker": "WHO WE ARE · CORPORATE OVERVIEW",
            "title": "A Diversified Holding Platform Built for Sustainable Growth",
            "p1": "SAWA UNITED GROUP is a multi-sector enterprise dedicated to building resilient businesses, developing real-economy assets, and unlocking practical commercial opportunities across high-growth regional markets.",
            "p2": "Our institutional architecture combines unified group governance with agile, sector-focused operating platforms. Each subsidiary is led by domain specialists with deep local market intelligence while adhering to one uncompromising group standard for transparency, reliability, and execution.",
            "quote": "“We take care of operational precision and asset quality — empowering our clients and partners to build with confidence.”",
            "kpis": [
                ("15+", "Years of Institutional Growth"),
                ("4", "Core Operating Business Sectors"),
                ("12", "Connected Regional & Export Markets"),
                ("40+", "Delivered Ventures & Projects"),
                ("2,500+", "People Across Our Ecosystem"),
            ],
            "note": "* Verification Note: Within the Group’s energy & industrial arm (START WALK), operational heritage extends back to 2002 — representing 24+ years of specialized field execution.",
        },

        # Slide 03: Vision, Mission & Values
        "s03": {
            "num": "03",
            "kicker": "STRATEGIC COMPASS · VISION & MISSION",
            "title": "Vision, Mission, Strategic Pillars & Core Values",
            "vision_t": "Our Vision",
            "vision_p": "To stand as a premier regional business group connecting key markets and scaling high-performing platforms that generate enduring economic value across vital real-economy sectors.",
            "mission_t": "Our Mission",
            "mission_p": "To build and operate specialized platforms in real estate, food distribution, mobility, and petroleum supply — delivering dependable quality, transparent terms, and mutually rewarding long-term partnerships.",
            "objectives_t": "Strategic Operating Pillars",
            "objectives": [
                ("BUILD", "Establish and scale sector-focused commercial platforms backed by modern operational systems."),
                ("OPERATE", "Manage supply chains, fleets, and assets with rigorous reliability, safety, and on-time delivery."),
                ("INVEST", "Deploy capital and capabilities into tangible, high-conviction opportunities built for lasting value."),
            ],
            "values": [
                ("Disciplined Execution", "Translating vetted opportunities into measurable outcomes on schedule and to specification."),
                ("Radical Transparency", "Complete clarity and accountability across pricing, documentation, and operational reporting."),
                ("Curated Quality", "Pre-vetting every property, food product, vehicle, and industrial supply source prior to market."),
                ("Enduring Partnerships", "Cultivating multi-year commercial relationships anchored in mutual trust and shared growth."),
            ],
        },

        # Slide 04: Business Ecosystem
        "s04": {
            "num": "04",
            "kicker": "OUR BUSINESS ECOSYSTEM · GROUP STRUCTURE",
            "title": "Four Focused Sectors. One Institutional Standard.",
            "sub": "SAWA UNITED operates through four specialized platforms spanning core pillars of the real economy — creating commercial, logistical, and operational synergies across markets.",
            "hub_title": "SAWA UNITED GROUP",
            "hub_sub": "Strategic Governance · Shared Standards · Cross-Market Network",
            "sectors": [
                ("01", "Real Estate & Property Investment", "SAWA UNITED Real Estate", "sawa-united.net", "estate",
                 "Curated residential, commercial, and land opportunities in Egypt and Morocco with end-to-end advisory through handover."),
                ("02", "Food Supplies & FMCG Distribution", "SAWA FOOD & Sawa Select", "sawafood.net", "food",
                 "Regional sourcing and wholesale network connecting 120+ trusted food brands with 1,400+ retail partners across 5 markets."),
                ("03", "Automotive & Mobility Solutions", "MASHARY CARS", "masharycar.net", "car",
                 "Modern daily, monthly, and corporate car rental fleet across Egypt, UAE, and Morocco featuring zero-upfront Pay on Delivery."),
                ("04", "Petroleum Products & Industrial Supply", "START WALK", "startwalk.net", "oil",
                 "EGPC-registered petroleum & lubricants operator established in 2002, serving 384+ clients across Egypt and export markets."),
            ],
            "synergy": "Ecosystem Synergy: Energy & lubricants power fleets & industry  →  Logistics & mobility connect regional food trade  →  Real estate anchors commercial & residential assets.",
        },

        # Slide 05: Sector 1 — Real Estate
        "s05": {
            "num": "05",
            "kicker": "SECTOR 01 · REAL ESTATE & INVESTMENT",
            "title": "Real Estate & Property Advisory — SAWA UNITED",
            "domain": "sawa-united.net",
            "accent": "estate",
            "photo": "sector-realestate.jpg",
            "slogan": "“We select the property before we present it — your home & investment in Egypt, even from abroad.”",
            "about": "SAWA UNITED’s real estate platform delivers a structured, transparent acquisition journey. Every residential, commercial, and land opportunity is vetted prior to listing, supported by dedicated advisors guiding domestic and international buyers through handover.",
            "services": [
                "Standalone villas & gated residential community acquisitions",
                "Premium apartments & turnkey serviced apartments",
                "Prime-frontage commercial spaces & administrative offices",
                "Strategic investment land plots in high-appreciation corridors",
                "Remote cross-border advisory, comparison & scheduled site visits",
            ],
            "value_t": "Client & Investor Value Proposition",
            "value": "Eliminates market noise through pre-verified listings, structured comparative data, and single-point advisory support from initial inquiry to final handover.",
            "highlights": [
                ("Egypt & Morocco", "Active Real Estate Platform Markets"),
                ("5 Prime Hubs", "New Cairo · New Capital · North Coast · Alexandria · Maadi"),
                ("4-Step Journey", "Discover → Compare → Consult Advisor → Visit & Handover"),
            ],
        },

        # Slide 06: Sector 2 — Food Supplies
        "s06": {
            "num": "06",
            "kicker": "SECTOR 02 · FOOD SUPPLIES & DISTRIBUTION",
            "title": "Regional Food Distribution — SAWA FOOD",
            "domain": "sawafood.net",
            "accent": "food",
            "photo": "sector-food.jpg",
            "slogan": "“Better food, brought closer — connecting trusted makers to regional markets.”",
            "about": "Sawa Food operates an integrated regional sourcing, wholesale, and retail distribution ecosystem across MENA, partnering directly with committed manufacturers while offering its curated flagship line, Sawa Select.",
            "services": [
                "Bulk wholesale food & fresh produce supply for commercial buyers",
                "Multi-country regional brand distribution & market entry execution",
                "Direct retail supply coverage across 1,400+ partner stores & outlets",
                "Manufacturer onboarding to scale high-quality food products across MENA",
                "Sawa Select line: Premium Black Tea, Pure Ghee & Long Grain Rice",
            ],
            "value_t": "Partner & Market Value Proposition",
            "value": "Protects product continuity, shelf availability, and quality consistency through vetted manufacturing partners and responsive end-to-end regional logistics.",
            "highlights": [
                ("250+", "Curated Food & Staple SKUs"),
                ("120+", "Trusted Food Brand Partners"),
                ("1,400+", "Retail Partners Across 5 Markets"),
            ],
        },

        # Slide 07: Sector 3 — Automotive
        "s07": {
            "num": "07",
            "kicker": "SECTOR 03 · AUTOMOTIVE & MOBILITY",
            "title": "Fleet Rental & Corporate Mobility — MASHARY CARS",
            "domain": "masharycar.net",
            "accent": "car",
            "photo": "sector-automotive.jpg",
            "slogan": "“Move with confidence — modern individual & corporate fleets with frictionless booking.”",
            "about": "Mashary Cars provides daily, monthly, and corporate vehicle rental solutions across Egypt, the UAE, and Morocco, pairing a diverse late-model fleet with transparent pricing and instant WhatsApp confirmation.",
            "services": [
                "Daily & monthly vehicle rentals for executives, residents & travelers",
                "Corporate fleet solutions, staff transport vans & executive buses",
                "Full category spectrum: Economy, Sedan, Family, SUV, Luxury & Performance",
                "Bespoke sourcing for special-request vehicle models upon inquiry",
                "Flexible multi-destination pickup & optional chauffeur service",
            ],
            "value_t": "Client & Corporate Value Proposition",
            "value": "Zero upfront online payment risk via Pay on Delivery, transparent daily/monthly rates, verified vehicle categories, and rapid human confirmation.",
            "highlights": [
                ("3 Countries", "Active Fleet in Egypt · UAE · Morocco"),
                ("6 Categories", "Economy · Sedan · SUV · Family · Luxury · Van & Bus"),
                ("Pay on Delivery", "Zero Upfront Online Payment Required"),
            ],
        },

        # Slide 08: Sector 4 — Petroleum
        "s08": {
            "num": "08",
            "kicker": "SECTOR 04 · PETROLEUM & INDUSTRIAL SUPPLY",
            "title": "Lubricants, Fuel & Industrial Services — START WALK",
            "domain": "startwalk.net",
            "accent": "oil",
            "photo": "sector-petroleum.jpg",
            "slogan": "“Trusted since 2002 — Registered with the Egyptian General Petroleum Corporation (EGPC).”",
            "about": "Established in 2002 as an Egyptian LLC registered with EGPC, START WALK specializes in petroleum product transport, local and international lubricant oil distribution, facility maintenance, and industrial site supplies across Egypt and African export markets.",
            "services": [
                "On-site bulk fuel supply & equipped petroleum/heavy-equipment transport fleet",
                "Mobile Fuel Units engineered to minimize work-site downtime and operating cost",
                "Engine, industrial, heavy-equipment & specialty oils plus heavy-duty filters",
                "Fuel pump supply, petroleum facility maintenance & storage tank cleaning",
                "Contracting & road-works supplies: sand, gravel & asphalt mixtures",
            ],
            "value_t": "Industrial & B2B Value Proposition",
            "value": "Single-source industrial partner combining EGPC-registered compliance, 90M+ liters of proven delivery volume, technical lubrication support, and strict HSE discipline.",
            "highlights": [
                ("90M+ Liters", "Cumulative Petroleum & Lubricant Volume"),
                ("25+ Trucks", "Equipped Fleet Serving 384+ Clients"),
                ("24+ Years", "Operating Since 2002 + 3 Export Markets"),
            ],
        },

        # Slide 09: Integrated Services Matrix
        "s09": {
            "num": "09",
            "kicker": "COMMERCIAL OFFERING · SERVICES & SOLUTIONS",
            "title": "Integrated B2B & B2C Solutions Across Four Sectors",
            "sub": "Structured commercial offerings tailored to institutional enterprises, investors, retail networks, and individual clients.",
            "cols": [
                ("Real Estate Advisory", "estate", [
                    "Pre-vetted property selection & brokerage",
                    "Commercial, office & investment land sourcing",
                    "Cross-border acquisition support for expats",
                    "End-to-end follow-up through handover",
                ], "Investors · Corporates · Homeowners"),
                ("Food Supply & FMCG", "food", [
                    "Bulk wholesale staples & fresh produce supply",
                    "5-market regional brand distribution",
                    "Retail shelf supply (1,400+ partner outlets)",
                    "Private-label Sawa Select staple products",
                ], "Distributors · Wholesalers · Retailers · Makers"),
                ("Mobility & Fleet Rental", "car", [
                    "Corporate monthly & long-term fleet contracts",
                    "Executive luxury, SUV & economy daily rental",
                    "Commercial vans, buses & chauffeur options",
                    "Pay-on-delivery multi-location vehicle handover",
                ], "Enterprises · Delegations · Individuals"),
                ("Petroleum & Industrial", "oil", [
                    "Work-site fuel delivery & Mobile Fuel Units",
                    "Automotive, industrial & heavy-equipment oils",
                    "Equipped tanker transport & tank maintenance",
                    "Fuel pumps, filters & road asphalt supplies",
                ], "Factories · Contractors · Energy · Export"),
            ],
        },

        # Slide 10: Projects & Portfolio
        "s10": {
            "num": "10",
            "kicker": "TRACK RECORD · FEATURED VENTURES & ASSETS",
            "title": "Documented Platforms, Ventures & Asset Highlights",
            "sub": "Active operating platforms, property offerings, and commercial product lines across the SAWA UNITED ecosystem.",
            "ventures": [
                ("SAWA UNITED REAL ESTATE", "Real Estate · Egypt & Morocco · 2026", "estate",
                 "Curated residential, commercial, and land portfolio across Egypt’s premier corridors: Fifth Settlement Villa (420 m²), Golden Square Investment Land (2,000 m²), New Capital Commercial Space (380 m²), North Coast Sidi Abdel Rahman (240 m²), Smouha (165 m²), and Maadi (180 m²)."),
                ("SAWA FOOD & SAWA SELECT", "Food & FMCG · MENA Region · 2024", "food",
                 "Regional food distribution platform managing 250+ curated SKUs and 120+ brands across 5 markets, anchored by the Sawa Select range (Premium Black Tea, Pure Ghee, and Long Grain Rice)."),
                ("MASHARY CARS MOBILITY", "Automotive · UAE, Egypt & Morocco · 2025", "car",
                 "Cross-market mobility platform operating modern Economy, Sedan, SUV, Luxury, and Corporate Van/Bus fleets with streamlined digital booking and zero-upfront Pay on Delivery."),
                ("START WALK ENERGY", "Petroleum & Industrial · Egypt & Export · 2026", "oil",
                 "EGPC-registered industrial energy platform operating since 2002 with 90M+ liters distributed, 25+ specialized trucks, 384+ clients, and active exports to Libya, Sudan, and South Africa."),
            ],
        },

        # Slide 11: Capabilities & Scale
        "s11": {
            "num": "11",
            "kicker": "OPERATIONAL STRENGTH · CAPABILITIES & SCALE",
            "title": "Quantified Infrastructure, Human Capital & Reach",
            "sub": "SAWA UNITED’s execution capacity is backed by documented operational metrics, owned logistics assets, and specialized teams.",
            "bars": [
                ("Petroleum & Lubricant Volume Distributed (START WALK)", "90,000,000+ Liters", 0.94, "oil"),
                ("Regional Food Retail Partner Network (SAWA FOOD)", "1,400+ Retail Partners", 0.88, "food"),
                ("Group-Wide Workforce & Sector Specialists", "2,500+ Professionals", 0.85, "estate"),
                ("Industrial & Corporate Energy Accounts", "384+ B2B Clients", 0.78, "oil"),
                ("Curated Food Brand & Product Portfolio", "250+ SKUs / 120+ Brands", 0.74, "food"),
                ("Delivered Ventures & Specialized Tanker Fleet", "40+ Projects / 25+ Trucks", 0.70, "car"),
            ],
            "caps": [
                ("Multi-Sector Executive Governance", "Seasoned leadership harmonizing capital allocation, compliance, and service standards across four distinct industries."),
                ("Physical Fleet & Supply Infrastructure", "Equipped petroleum transport trucks, mobile fueling units, multi-country rental fleets, and regional wholesale hubs."),
                ("Digital-First Commercial Platforms", "Dedicated web portals per business unit integrated with direct advisory and rapid WhatsApp B2B/B2C response."),
            ],
        },

        # Slide 12: Business Model
        "s12": {
            "num": "12",
            "kicker": "BUSINESS MODEL · EXECUTION METHODOLOGY",
            "title": "Disciplined End-to-End Commercial Operating Model",
            "sub": "Every client engagement, supply contract, and investment follows a structured five-stage lifecycle engineered for clarity and reliability.",
            "steps": [
                ("01", "Opportunity Vetting", "Rigorous assessment of market demand, property credentials, manufacturer quality, or industrial site specifications."),
                ("02", "Solution Structuring", "Tailored commercial and technical scoping with transparent pricing aligned to volume, duration, or investment goals."),
                ("03", "Specialist Routing", "Clear contractual alignment and immediate assignment to the dedicated sector team responsible for execution."),
                ("04", "Disciplined Delivery", "Controlled fleet dispatch, supply-chain logistics, or site handover adhering to strict timelines and safety protocols."),
                ("05", "Post-Handover Growth", "Ongoing technical support, account management, and replenishment turning initial transactions into lasting partnerships."),
            ],
            "bottom_note": "Unified Gateway Advantage: A single institutional entry point seamlessly connects partners to specialized sector execution teams.",
        },

        # Slide 13: Competitive Value / Why SAWA UNITED
        "s13": {
            "num": "13",
            "kicker": "COMPETITIVE ADVANTAGE · WHY SAWA UNITED?",
            "title": "Why Leading Enterprises & Investors Partner With Us",
            "sub": "Five institutional differentiators set SAWA UNITED apart from fragmented single-market operators:",
            "pillars": [
                ("01", "Experienced Multi-Sector Leadership", "15+ years of group growth combined with 24+ years of industrial energy roots enable superior cross-cycle resilience and judgment."),
                ("02", "Connected Regional Markets & Capabilities", "Active commercial corridors linking Egypt, the GCC, North Africa, and Sub-Saharan export destinations unlock rapid cross-border scaling."),
                ("03", "Long-Term Value & Investment Mindset", "Capital and operational decisions prioritize durable asset value, supply continuity, and sustainable returns over short-term gains."),
                ("04", "Responsible, Transparent Operations", "Unambiguous pricing, pre-verified properties, EGPC regulatory registration, and customer-first terms such as Pay on Delivery."),
                ("05", "Partnerships Engineered to Last", "High-retention B2B relationships across 1,400+ retailers, 120+ brands, and 384+ industrial clients built on consistent fulfillment."),
            ],
        },

        # Slide 14: Partners & Clients
        "s14": {
            "num": "14",
            "kicker": "ECOSYSTEM TRUST · PARTNERS, CLIENTS & ACCREDITATIONS",
            "title": "Institutional Credibility & Partner Network",
            "sub": "In strict adherence to corporate disclosure standards, we present verified registrations and partner ecosystem metrics alongside reserved slots for authorized client logos.",
            "verified_badges": [
                ("Regulatory Registration", "Egyptian General Petroleum Corp. (EGPC)", "START WALK LLC is officially registered with EGPC since 2002 for petroleum transport, lubricants, and industrial services."),
                ("Manufacturing & Brand Network", "120+ Food Brands & Global Lubricant Makers", "Direct distribution alliances with vetted regional food producers and local/international lubricant oil manufacturers."),
                ("Active Commercial Footprint", "1,400+ Retail Partners  |  384+ Industrial Clients", "Proven fulfillment across supermarkets, wholesalers, industrial factories, contracting sites, and corporate fleet accounts."),
            ],
            "slots_title": "Reserved Showcase Slots — Authorized Partner & Corporate Client Logos (To Be Populated Upon Release Approval)",
            "slots": [
                "[ Strategic Partner Logo 01 ]",
                "[ Industrial / Supply Partner 02 ]",
                "[ Retail / Distribution Partner 03 ]",
                "[ Enterprise Client Logo 04 ]",
                "[ Real Estate Partner Logo 05 ]",
                "[ International Partner Logo 06 ]",
            ],
        },

        # Slide 15: Markets & Geographic Scope
        "s15": {
            "num": "15",
            "kicker": "GEOGRAPHIC FOOTPRINT · REGIONAL & EXPORT MARKETS",
            "title": "Connected Presence Across MENA & African Export Routes",
            "sub": "SAWA UNITED operates across a connected 12-market network anchored by core MENA hubs and active African export corridors:",
            "regions": [
                ("Arab Republic of Egypt (Core Hub)", "EG", "Real Estate · Food Supplies · Car Rental · Petroleum & Industrial"),
                ("United Arab Emirates", "AE", "Group Presence · Mashary Cars Fleet · Sawa Food Network"),
                ("Kingdom of Saudi Arabia", "SA", "Group Presence · Sawa Food Regional Distribution"),
                ("Kingdom of Morocco", "MA", "Group Presence · Real Estate Platform · Mashary Cars Fleet"),
                ("State of Kuwait", "KW", "Group Presence & GCC Commercial Network"),
                ("Hashemite Kingdom of Jordan", "JO", "Sawa Food Wholesale & Retail Store Network"),
                ("African Export Corridors", "EXP", "START WALK Petroleum & Lubricants Exports: Libya · Sudan · South Africa"),
            ],
        },

        # Slide 16: Partnership & Cooperation Opportunities
        "s16": {
            "num": "16",
            "kicker": "STRATEGIC ALLIANCES · COOPERATION OPPORTUNITIES",
            "title": "Structured Pathways for Commercial & Investment Collaboration",
            "sub": "We welcome institutional partners, investors, manufacturers, and corporate buyers across four dedicated engagement tracks:",
            "tracks": [
                ("01", "Real Estate Co-Investment & Development", "estate",
                 "Joint ventures, project marketing mandates, commercial off-take, and curated portfolio acquisitions with developers and investors in Egypt and Morocco."),
                ("02", "Regional Food Distribution & Brand Onboarding", "food",
                 "Regional distributor appointments, bulk wholesale supply agreements, retail chain partnerships, and manufacturer onboarding into Sawa Food’s 5-market network."),
                ("03", "Industrial Fuel, Lubricants & Export Supply", "oil",
                 "Long-term site fuel contracts, Mobile Fuel Unit deployment, industrial lubrication supply, tank maintenance, and regional export distribution partnerships."),
                ("04", "Corporate Mobility & Fleet Outsourcing", "car",
                 "Dedicated monthly and annual corporate vehicle leasing, executive transport, and multi-destination mobility programs across Egypt, UAE, and Morocco."),
            ],
        },

        # Slide 17: Quality, Governance & Commitment
        "s17": {
            "num": "17",
            "kicker": "GOVERNANCE & STANDARDS · QUALITY & COMMITMENT",
            "title": "Uncompromising Quality, HSE & Operational Integrity",
            "sub": "Shared institutional standards govern every platform within SAWA UNITED to safeguard partner trust and operational continuity:",
            "standards": [
                ("Pre-Market Vetting & Curation", "Every real estate asset, food SKU, and fleet vehicle undergoes strict quality, documentation, and suitability verification prior to offering."),
                ("Health, Safety & Environment (HSE)", "Strict adherence to ‘Safety First’ protocols, environmental protection, and resource efficiency across fuel transport, storage, and industrial sites."),
                ("Regulatory & Legal Compliance", "Operations anchored by registered legal entities, including official registration with the Egyptian General Petroleum Corporation since 2002."),
                ("Commercial Clarity & On-Time Fulfillment", "Transparent pricing structures, responsive end-to-end logistics, and accountable client support across every transaction."),
            ],
            "cert_placeholder_t": "Reserved Institutional Slot — Quality & Compliance Certifications",
            "cert_placeholder_p": "[ Reserved space for authorized ISO / Food Safety / HSE / Corporate Registration certificate numbers & seals upon formal issuance ]",
        },

        # Slide 18: Call to Action, Contact & Closing Cover
        "s18": {
            "num": "18",
            "kicker": "CONNECT WITH US · CALL TO ACTION & CONTACTS",
            "title": "Let’s Build Lasting Value Together",
            "lead": "Our executive business development team and specialized sector advisors are ready to discuss partnerships, investments, and commercial supply inquiries.",
            "contacts": [
                ("Group Corporate Portal", "https://sawaunited.net"),
                ("Real Estate Platform", "https://sawa-united.net"),
                ("Food Supplies Platform", "https://sawafood.net"),
                ("Automotive & Mobility Portal", "https://masharycar.net"),
                ("Petroleum & Industrial Portal", "https://startwalk.net"),
                ("Unified Direct Phone & WhatsApp", "+20 101 122 5592  (wa.me/201011225592)"),
                ("Official Facebook Page", "facebook.com/Sawaunited.net"),
                ("Sector Email (Petroleum — START WALK)", "info@startwalk.com"),
                ("Group HQ Address & Central Email", "[ Reserved Slot — Official Corporate Email & Headquarters Street Address ]"),
            ],
            "closing_motto": "SAWA UNITED GROUP  —  Building Businesses. Creating Impact.",
        },
    },
}
