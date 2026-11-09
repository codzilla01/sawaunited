/* ================== SETTINGS ==================
   To use real photos later: upload them into the "assets" folder and put the file name here,
   e.g. photo:"assets/car.jpg". Leave "" to use the built-in illustration. */
const SECTORS = [
  {id:"car",    c:"#B97858", url:"https://masharycar.net/",  dom:"masharycar.net",  photo:""},
  {id:"food",   c:"#78927A", url:"https://sawafood.net/",    dom:"sawafood.net",    photo:""},
  {id:"estate", c:"#D4A64B", url:"https://sawa-united.net/", dom:"sawa-united.net", photo:""},
  {id:"oil",    c:"#6E8FB8", url:"https://startwalk.net/",   dom:"startwalk.net",   photo:""}
];

const ICON = {
  car:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3v-5l2-5h11l4 5h1v5h-2"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M9.5 17h5M5 12h15"/></svg>',
  food:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h18l-2 10H5L3 10z"/><path d="M8 10l3-6M16 10l-3-6"/><path d="M9 14v3M12 14v3M15 14v3"/></svg>',
  estate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V8l6-4v17"/><path d="M11 21V10h8v11"/><path d="M8 10v.01M8 13v.01M8 16v.01M14 13h2M14 16h2"/></svg>',
  oil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/></svg>',
  arr:'<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};
const WHY_ICONS = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15l-3.5 2 1-4-3-2.7 4-.3L12 6l1.5 4 4 .3-3 2.7 1 4z"/><circle cx="12" cy="12" r="10"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>'
];

/* ---------- illustrations ---------- */
const ART = {
car:`<svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice">
<rect width="600" height="420" fill="url(#dots)"/>
<circle cx="430" cy="150" r="120" fill="#B97858" opacity=".35"/><circle cx="430" cy="150" r="74" fill="#D29A7D" opacity=".55"/>
<path d="M0 330V262h40v-30h30v50h40v-72h36v72h30v-42h50v42h40v-96h30v96h40v-54h46v54h40v-32h50v32h40v-62h38v98z" fill="#fff" opacity=".07"/>
<rect y="330" width="600" height="90" fill="#000" opacity=".38"/>
<path d="M0 378H600" stroke="#fff" stroke-opacity=".45" stroke-width="4" stroke-dasharray="40 30"/>
<g stroke="#fff" stroke-opacity=".4" stroke-width="3" stroke-linecap="round"><path d="M30 246H110"/><path d="M10 272H92"/><path d="M44 298H112"/></g>
<ellipse cx="352" cy="350" rx="236" ry="10" fill="#000" opacity=".45"/>
<path d="M130 320C128 294 140 278 170 272L234 262L294 222C308 212 328 206 352 206H422C450 206 472 216 494 236L514 254C542 258 562 272 568 294L570 320Z" fill="url(#gBody)"/>
<path d="M268 258L300 231C310 223 322 218 340 218H380L382 256Z" fill="#0B1220" opacity=".88"/>
<path d="M394 218H420C440 218 458 226 476 244L484 254L396 256Z" fill="#0B1220" opacity=".88"/>
<path d="M150 286H566" stroke="#B97858" stroke-width="5"/>
<path d="M388 262V310" stroke="#9AA6B5" stroke-width="2"/>
<ellipse cx="552" cy="276" rx="12" ry="6" fill="#FFE7A3"/>
<rect x="132" y="288" width="10" height="13" rx="2" fill="#B97858"/>
<g><circle cx="212" cy="320" r="33" fill="#0B0F14"/><circle cx="212" cy="320" r="17" fill="#AEB8C4"/><circle cx="212" cy="320" r="6" fill="#0B0F14"/></g>
<g><circle cx="482" cy="320" r="33" fill="#0B0F14"/><circle cx="482" cy="320" r="17" fill="#AEB8C4"/><circle cx="482" cy="320" r="6" fill="#0B0F14"/></g>
</svg>`,
food:`<svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice">
<rect width="600" height="420" fill="url(#dots)"/>
<circle cx="160" cy="140" r="130" fill="#78927A" opacity=".32"/><circle cx="160" cy="140" r="78" fill="#A2B79E" opacity=".4"/>
<rect y="360" width="600" height="60" fill="#000" opacity=".35"/>
<g stroke="#F7D774" stroke-width="3.5" stroke-linecap="round" fill="#F7D774">
<path d="M520 362C522 300 530 230 540 150" fill="none"/>
<ellipse cx="540" cy="150" rx="7" ry="16"/><ellipse cx="528" cy="178" rx="6" ry="14" transform="rotate(-28 528 178)"/><ellipse cx="548" cy="182" rx="6" ry="14" transform="rotate(28 548 182)"/>
<ellipse cx="524" cy="208" rx="6" ry="14" transform="rotate(-28 524 208)"/><ellipse cx="544" cy="212" rx="6" ry="14" transform="rotate(28 544 212)"/>
<ellipse cx="521" cy="238" rx="6" ry="14" transform="rotate(-28 521 238)"/><ellipse cx="540" cy="242" rx="6" ry="14" transform="rotate(28 540 242)"/>
<path d="M490 362C492 316 486 270 470 220" fill="none" opacity=".7"/>
<ellipse cx="470" cy="220" rx="6" ry="14" opacity=".7" transform="rotate(-16 470 220)"/><ellipse cx="468" cy="248" rx="5" ry="12" opacity=".7" transform="rotate(-44 468 248)"/><ellipse cx="486" cy="246" rx="5" ry="12" opacity=".7" transform="rotate(12 486 246)"/>
</g>
<ellipse cx="300" cy="364" rx="180" ry="10" fill="#000" opacity=".45"/>
<circle cx="214" cy="236" r="38" fill="#E5483B"/><path d="M204 204c6-8 16-10 22-4-8 2-14 6-16 12z" fill="#2E9E5B"/>
<circle cx="288" cy="220" r="46" fill="#F39C12"/><circle cx="276" cy="206" r="8" fill="#fff" opacity=".35"/>
<circle cx="366" cy="230" r="40" fill="#7BD389"/><path d="M366 192c4-10 12-14 20-12-6 4-10 8-12 14z" fill="#2E9E5B"/>
<ellipse cx="428" cy="250" rx="32" ry="25" fill="#F7DC6F"/>
<path d="M150 262H450L420 360H180Z" fill="url(#gBody)"/>
<g stroke="#AEB8C4" stroke-width="3"><path d="M160 294H440"/><path d="M170 326H430"/></g>
<g stroke="#AEB8C4" stroke-width="3"><path d="M230 262L222 360"/><path d="M300 262V360"/><path d="M370 262L378 360"/></g>
<rect x="246" y="300" width="108" height="24" rx="12" fill="#78927A"/>
</svg>`,
estate:`<svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice">
<rect width="600" height="420" fill="url(#dots)"/>
<circle cx="450" cy="120" r="110" fill="#D4A64B" opacity=".3"/><circle cx="450" cy="120" r="64" fill="#E4C67D" opacity=".45"/>
<path d="M0 380V300h30v-40h30v40h30v-60h20v60h500v80z" fill="#fff" opacity=".06"/>
<rect x="70" y="210" width="92" height="170" fill="#E4E9EF"/><rect x="70" y="210" width="92" height="170" fill="url(#win)"/>
<rect x="172" y="110" width="112" height="270" fill="url(#gBody)"/><rect x="172" y="110" width="112" height="270" fill="url(#win)"/>
<rect x="172" y="104" width="112" height="10" fill="#D4A64B"/><rect x="224" y="74" width="6" height="32" fill="#E4E9EF"/>
<rect x="294" y="164" width="96" height="216" fill="#D5DCE5"/><rect x="294" y="164" width="96" height="216" fill="url(#winlit)" opacity=".55"/>
<rect x="400" y="232" width="86" height="148" fill="#EEF1F5"/><rect x="400" y="232" width="86" height="148" fill="url(#win)"/>
<g fill="#D4A64B"><rect x="516" y="66" width="10" height="314"/><rect x="420" y="66" width="170" height="9"/><rect x="560" y="75" width="22" height="20"/></g>
<g stroke="#D4A64B" stroke-width="2" opacity=".8"><path d="M516 90L526 110M526 110L516 130M516 130L526 150M526 150L516 170M516 170L526 190M526 190L516 210M516 210L526 230M526 230L516 250M516 250L526 270M526 270L516 290M516 290L526 310"/></g>
<path d="M452 75V168" stroke="#fff" stroke-width="2"/><rect x="445" y="168" width="14" height="16" rx="2" fill="#fff"/>
<rect y="380" width="600" height="40" fill="#000" opacity=".4"/>
</svg>`,
oil:`<svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice">
<rect width="600" height="420" fill="url(#dots)"/>
<circle cx="150" cy="130" r="120" fill="#6E8FB8" opacity=".32"/><circle cx="150" cy="130" r="70" fill="#A0B8D8" opacity=".42"/>
<rect y="360" width="600" height="60" fill="#000" opacity=".4"/>
<ellipse cx="270" cy="70" rx="22" ry="34" fill="url(#gFire)"/>
<rect x="265" y="86" width="10" height="276" fill="#AEB8C4"/>
<rect x="110" y="150" width="42" height="212" rx="20" fill="url(#gTank)"/>
<rect x="168" y="104" width="50" height="258" rx="24" fill="url(#gTank)"/>
<g stroke="#6E8FB8" stroke-width="4"><path d="M106 200H156M106 260H156M164 160H222M164 230H222M164 300H222"/></g>
<g stroke="#8E9AA8" stroke-width="8" fill="none" stroke-linecap="round"><path d="M218 320H330"/><path d="M152 340H168"/><path d="M218 270C250 270 250 300 300 300H330"/></g>
<rect x="330" y="262" width="122" height="100" fill="url(#gTank)"/><ellipse cx="391" cy="262" rx="61" ry="14" fill="#F4F6F8"/>
<g stroke="#9AA6B5" stroke-width="2" opacity=".7"><path d="M330 296H452M330 330H452"/></g>
<rect x="462" y="284" width="96" height="78" fill="url(#gTank)"/><ellipse cx="510" cy="284" rx="48" ry="11" fill="#F4F6F8"/>
<text x="391" y="320" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="800" font-size="20" fill="#6E8FB8">SW</text>
<path d="M500 110C516 136 534 156 534 182A34 34 0 0 1 466 182C466 156 484 136 500 110Z" fill="url(#gDrop)"/>
<path d="M484 184A16 16 0 0 0 498 200" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"/>
</svg>`
};

/* ---------- translations ---------- */
const T = {
ar:{
  nav1:"القطاعات",nav2:"من نحن",nav3:"روابط القطاعات",nav4:"تواصل معنا",navProjects:"منصات الأعمال",navPortfolio:"الملف المؤسسي",
  navLabel:"التنقل الرئيسي",languageLabel:"اختيار اللغة",businessTabs:"استكشف قطاعات المجموعة",skipToContent:"تخطَّ إلى المحتوى",
  menuOpen:"فتح القائمة",menuClose:"إغلاق القائمة",pauseRotation:"إيقاف العرض التلقائي",resumeRotation:"تشغيل العرض التلقائي",rotationDisabled:"العرض التلقائي متوقف لتفضيل الحركة المخفّضة",themeAction:"التبديل إلى الوضع الفاتح",themeDarkAction:"التبديل إلى الوضع الداكن",whatsappAction:"الرقم المدرج لواتساب غير متحقق؛ تأكد منه قبل الاستخدام",
  heroEyebrow:"مجموعة أعمال متعددة القطاعات",heroTitle:"نبني الأعمال.<br><span>نصنع الأثر.</span>",heroDescription:"يعرض الموقع أربعة قطاعات أعمال وروابط مواقعها، مع وصف موجز لكل قطاع.",heroContact:"تواصل مع فريقنا",heroProfile:"الملف المؤسسي",
  metaTitle:"SAWA UNITED GROUP | مجموعة سوا يونيتد",metaDescription:"يعرض موقع SAWA UNITED GROUP أربعة قطاعات أعمال وروابط مواقعها: العقارات والأغذية والسيارات ومشتقات البترول.",ogDescription:"أربعة قطاعات أعمال وروابط مواقعها كما يوردها الموقع.",
  call:"اتصل بالرقم المدرج",choose:"اكتشف قطاعاتنا",visit:"زيارة الموقع",sector:"القطاع",
  car:{n:"تأجير السيارات",s:"السيارات والتنقل",d:"منصة أعمال في مجال تأجير السيارات والتنقل.",f:["تأجير السيارات","حلول التنقل","موقع القطاع"]},
  food:{n:"المواد الغذائية",s:"توريد الأغذية",d:"منصة أعمال تركز على توريد المواد الغذائية.",f:["المواد الغذائية","التوريد","موقع القطاع"]},
  estate:{n:"العقارات",s:"منصة الأعمال العقارية",d:"منصة أعمال متخصصة في قطاع العقارات.",f:["العقارات","الاستثمار العقاري","موقع القطاع"]},
  oil:{n:"مشتقات البترول",s:"البترول والخدمات الصناعية",d:"منصة أعمال في مجال مشتقات البترول والخدمات الصناعية.",f:["مشتقات البترول","الخدمات الصناعية","موقع القطاع"]},
  k1:"منظومة أعمالنا",t1:"أربعة قطاعات مدرجة",p1:"يعرض الموقع أربعة قطاعات أعمال وروابط المواقع المرتبطة بها.",
  s1:"قطاعات أعمال",s2:"لغات للموقع",s3:"روابط لقطاعات الأعمال",s4:"مجموعة واحدة",
  k2:"كيف نعمل",t2:"معلومات وروابط مباشرة",p2:"تعرّف على أسماء القطاعات وروابط مواقعها. راجع الموقع المرتبط للتفاصيل الحالية.",
  why:[["أربعة قطاعات","أسماء أربعة قطاعات ظاهرة في الموقع."],["روابط المواقع","روابط المواقع القطاعية مدرجة هنا."],["ثلاث لغات","الواجهة الرئيسية متاحة بالعربية والإنجليزية والفرنسية."],["صور توضيحية","الرسوم والصور القطاعية ليست توثيقاً لمشروعات فعلية."],["تحقق من التفاصيل","راجع الموقع القطاعي للتفاصيل والخدمات الحالية."]] ,
  k3:"مواقع القطاعات",t3:"الروابط المدرجة لكل قطاع",
  mapNote:"رسم توضيحي للروابط المدرجة، وليس خريطة لمواقع التشغيل.",platformDiagram:"رسم توضيحي لأربعة مواقع قطاعية مدرجة",
  businessSites:{car:["01","السيارات والتنقل","masharycar.net"],food:["02","الأغذية","sawafood.net"],estate:["03","العقارات","sawa-united.net"],oil:["04","مشتقات البترول","startwalk.net"]},
  t4:"هل لديك استفسار؟",p4:"رقم الاتصال الوارد في ملفات الموقع لم يُتحقق منه؛ يرجى تأكيده قبل الاتصال أو المراسلة.",
  phoneNote:"رقم مدرج في ملفات الموقع؛ تحقق منه قبل الاستخدام.",wa:"واتساب · تحقق من الرقم أولاً",proj:"استكشف منصات الأعمال",fl:"روابط",
  ftag:"نبني الأعمال. نصنع الأثر.",copy:"© 2026 مجموعة سوا يونيتد. جميع الحقوق محفوظة."
},
en:{
  nav1:"Sectors",nav2:"About",nav3:"Sector websites",nav4:"Contact",navProjects:"Business platforms",navPortfolio:"Corporate profile",
  navLabel:"Primary navigation",languageLabel:"Choose language",businessTabs:"Explore the group’s business sectors",skipToContent:"Skip to content",
  menuOpen:"Open menu",menuClose:"Close menu",pauseRotation:"Pause automatic preview",resumeRotation:"Play automatic preview",rotationDisabled:"Automatic preview is disabled by your reduced-motion preference",themeAction:"Switch to light mode",themeDarkAction:"Switch to dark mode",whatsappAction:"The listed WhatsApp number is unverified; confirm it before use",
  heroEyebrow:"A multi-sector business group",heroTitle:"Building businesses.<br><span>Creating impact.</span>",heroDescription:"This website lists four business sectors and links to their websites, with a short summary of each sector.",heroContact:"Talk to our team",heroProfile:"Corporate profile",
  metaTitle:"SAWA UNITED GROUP | Building Businesses. Creating Impact.",metaDescription:"SAWA UNITED GROUP lists four business sectors and their websites: real estate, food, automotive and petroleum products.",ogDescription:"Four business sectors and their listed websites.",
  call:"Call the listed number",choose:"Explore our business sectors",visit:"Visit Website",sector:"Sector",
  car:{n:"Car Rental",s:"Automotive mobility",d:"A business platform focused on car rental and mobility.",f:["Car rental","Mobility","Sector website"]},
  food:{n:"Food Supplies",s:"Food supply",d:"A business platform focused on food supplies.",f:["Food supplies","Supply","Sector website"]},
  estate:{n:"Real Estate",s:"Real estate platform",d:"A business platform focused on real estate.",f:["Real estate","Property investment","Sector website"]},
  oil:{n:"Petroleum Products",s:"Petroleum and industrial services",d:"A business platform focused on petroleum products and industrial services.",f:["Petroleum products","Industrial services","Sector website"]},
  k1:"Our business ecosystem",t1:"Four listed sectors",p1:"This website lists four business sectors and links to their corresponding websites.",
  s1:"Business sectors",s2:"Site languages",s3:"Listed sector websites",s4:"Group identity",
  k2:"How we work",t2:"Information and direct links",p2:"See the sector names and their listed websites. Visit each site for current details.",
  why:[["Four sectors","Four sector names appear on this website."],["Website links","The listed sector websites are linked here."],["Three languages","The homepage is available in Arabic, English and French."],["Illustrative visuals","Sector illustrations are not documentation of actual projects."],["Check current details","Visit each sector website for current information and services."]] ,
  k3:"Sector websites",t3:"Listed websites for each sector",
  mapNote:"Illustrative diagram of listed links, not a map of operating locations.",platformDiagram:"Illustrative diagram of four listed sector websites",
  businessSites:{car:["01","Automotive","masharycar.net"],food:["02","Food","sawafood.net"],estate:["03","Real estate","sawa-united.net"],oil:["04","Petroleum products","startwalk.net"]},
  t4:"Let’s talk about what’s next",p4:"The phone number in the site files has not been verified; please confirm it before calling or messaging.",
  phoneNote:"Listed in site files; confirm before use.",wa:"WhatsApp · verify number first",proj:"Explore business platforms",fl:"Links",
  ftag:"Building businesses. Creating impact.",copy:"© 2026 SAWA UNITED GROUP. All rights reserved."
},
fr:{
  nav1:"Secteurs",nav2:"À propos",nav3:"Sites sectoriels",nav4:"Contact",navProjects:"Plateformes d’activité",navPortfolio:"Profil institutionnel",
  navLabel:"Navigation principale",languageLabel:"Choisir la langue",businessTabs:"Découvrir les secteurs du groupe",skipToContent:"Aller au contenu",
  menuOpen:"Ouvrir le menu",menuClose:"Fermer le menu",pauseRotation:"Mettre l’aperçu en pause",resumeRotation:"Lire l’aperçu automatique",rotationDisabled:"Aperçu automatique désactivé par la préférence de réduction du mouvement",themeAction:"Passer au thème clair",themeDarkAction:"Passer au thème sombre",whatsappAction:"Le numéro WhatsApp indiqué doit être vérifié avant utilisation",
  heroEyebrow:"Un groupe d’entreprises multisectoriel",heroTitle:"Construire des entreprises.<br><span>Créer de l’impact.</span>",heroDescription:"Ce site présente quatre secteurs d’activité et les liens vers leurs sites, avec un bref résumé de chacun.",heroContact:"Parler à notre équipe",heroProfile:"Profil institutionnel",
  metaTitle:"SAWA UNITED GROUP | Bâtir les entreprises. Créer de l’impact.",metaDescription:"SAWA UNITED GROUP répertorie quatre secteurs et leurs sites : immobilier, alimentation, automobile et produits pétroliers.",ogDescription:"Quatre secteurs d’activité et leurs sites répertoriés.",
  call:"Appeler le numéro indiqué",choose:"Découvrez nos secteurs d’activité",visit:"Visiter le site",sector:"Secteur",
  car:{n:"Location de voitures",s:"Mobilité automobile",d:"Une plateforme d’activité consacrée à la location de voitures et à la mobilité.",f:["Location de voitures","Mobilité","Site du secteur"]},
  food:{n:"Produits alimentaires",s:"Approvisionnement alimentaire",d:"Une plateforme d’activité consacrée à l’approvisionnement alimentaire.",f:["Produits alimentaires","Approvisionnement","Site du secteur"]},
  estate:{n:"Immobilier",s:"Plateforme immobilière",d:"Une plateforme d’activité consacrée au secteur immobilier.",f:["Immobilier","Investissement immobilier","Site du secteur"]},
  oil:{n:"Produits pétroliers",s:"Pétrole et services industriels",d:"Une plateforme d’activité consacrée aux produits pétroliers et aux services industriels.",f:["Produits pétroliers","Services industriels","Site du secteur"]},
  k1:"Notre écosystème",t1:"Quatre secteurs répertoriés",p1:"Ce site répertorie quatre secteurs d’activité et les liens vers leurs sites.",
  s1:"Secteurs d’activité",s2:"Langues du site",s3:"Sites sectoriels répertoriés",s4:"Groupe unique",
  k2:"Notre approche",t2:"Informations et liens directs",p2:"Consultez les noms des secteurs et les sites indiqués. Visitez chaque site pour connaître les informations actuelles.",
  why:[["Quatre secteurs","Quatre secteurs sont nommés sur ce site."],["Liens des sites","Les sites sectoriels répertoriés sont accessibles ici."],["Trois langues","La page d’accueil est disponible en arabe, anglais et français."],["Visuels illustratifs","Les illustrations sectorielles ne documentent pas des projets réels."],["Vérifier les informations","Consultez chaque site pour les informations et services actuels."]] ,
  k3:"Sites sectoriels",t3:"Sites répertoriés pour chaque secteur",
  mapNote:"Schéma illustratif des liens répertoriés, et non une carte des lieux d’activité.",platformDiagram:"Schéma illustratif de quatre sites sectoriels répertoriés",
  businessSites:{car:["01","Automobile","masharycar.net"],food:["02","Alimentation","sawafood.net"],estate:["03","Immobilier","sawa-united.net"],oil:["04","Produits pétroliers","startwalk.net"]},
  t4:"Parlons de la suite",p4:"Le numéro de contact indiqué dans les fichiers du site n’a pas été vérifié ; confirmez-le avant tout appel ou message.",
  phoneNote:"Numéro figurant dans les fichiers du site ; à vérifier avant usage.",wa:"WhatsApp · vérifier le numéro",proj:"Découvrir les plateformes",fl:"Liens",
  ftag:"Bâtir des entreprises. Créer de l’impact.",copy:"© 2026 GROUPE SAWA UNITED. Tous droits réservés."
}};

/* Abstract sector-diagram coordinates; they have no geographic meaning. */
const PLATFORMS = [{k:"car",x:220,y:260},{k:"food",x:580,y:260},{k:"estate",x:400,y:155},{k:"oil",x:400,y:380}];

let L="ar", cur=0;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const pad=n=>String(n).padStart(2,"0");

/* ---------- build static structure once ---------- */
function artHTML(s,fit){const svg=fit?ART[s.id].replace('xMidYMid slice','xMidYMin meet'):ART[s.id];return `<div class="art" style="--c:${s.c}" aria-hidden="true">${svg}${s.photo?`<div class="photo" style="background-image:url('${s.photo}')"></div>`:""}</div>`}
$("#layers").innerHTML = SECTORS.map((s,i)=>`<div class="layer${i===0?" on":""}">${artHTML(s,true)}</div>`).join("");
$("#tabs").innerHTML = SECTORS.map((s,i)=>`<button class="tab${i===0?" active":""}" type="button" id="sector-tab-${s.id}" role="tab" aria-controls="stBody" aria-selected="${i===0}" tabindex="${i===0?"0":"-1"}" style="--c:${s.c}" data-i="${i}"><span class="ti" aria-hidden="true">${ICON[s.id]}</span><span><strong></strong><small dir="ltr">${s.dom}</small></span><span class="bar-p" aria-hidden="true"></span></button>`).join("");
$("#panels").innerHTML = SECTORS.map((s,i)=>`<article class="panel${i===0?" active":""}" style="--c:${s.c}" data-i="${i}" role="group" aria-labelledby="sector-panel-title-${s.id}">${artHTML(s)}<div class="p-in"><span class="p-num" aria-hidden="true">${pad(i+1)}</span><button class="p-head" type="button" id="sector-panel-toggle-${s.id}" aria-controls="sector-panel-detail-${s.id}" aria-expanded="${i===0}"><span class="p-ico" aria-hidden="true">${ICON[s.id]}</span><span><span class="panel-title" id="sector-panel-title-${s.id}" role="heading" aria-level="3"></span><span class="p-dom" dir="ltr">${s.dom}</span></span></button><div class="p-more" id="sector-panel-detail-${s.id}" aria-labelledby="sector-panel-toggle-${s.id}" aria-hidden="${i!==0}"${i!==0?" inert":""}><div><p></p><ul></ul><a class="btn" href="${s.url}" target="_blank" rel="noopener noreferrer"><span></span>${ICON.arr}</a></div></div></div></article>`).join("");
$("#map").innerHTML = buildMap();

function buildMap(){
  /* Abstract sector-link diagram — deliberately not a geographic map. */
  let dots="";
  for(let x=24;x<800;x+=20)for(let y=24;y<540;y+=20){
    const v=Math.sin(x*.021)+Math.cos(y*.027)+Math.sin((x+y)*.011);
    if(v>-.2) dots+=`<circle class="dot" cx="${x}" cy="${y}" r="${v>1.2?3:2.4}"/>`;
  }
  const links=PLATFORMS.map(p=>`<path d="M400 267 Q${(400+p.x)/2} ${(267+p.y)/2-24} ${p.x} ${p.y}"/>`).join("");
  const pins=PLATFORMS.map(p=>`<g data-k="${p.k}"><circle class="ring" cx="${p.x}" cy="${p.y}" r="12"/><circle class="pin" cx="${p.x}" cy="${p.y}" r="7"/><text class="lbl" x="${p.x}" y="${p.y-20}" text-anchor="middle"></text></g>`).join("");
  return `<svg viewBox="0 0 800 550" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${dots}<g fill="none" stroke="var(--gold)" stroke-width="1.8" stroke-dasharray="5 7" opacity=".65">${links}</g><circle cx="400" cy="267" r="40" fill="var(--surface)" stroke="var(--gold)" stroke-width="2"/><text x="400" y="273" text-anchor="middle" class="lbl">SAWA</text>${pins}</svg><p class="map-note" data-t="mapNote"></p>`;
}

/* ---------- language ---------- */
function setLang(l){
  if(!T[l]) l="ar";
  L=l;
  const d=T[l];
  document.documentElement.lang=l;
  document.documentElement.dir=l==="ar"?"rtl":"ltr";
  $$("[data-t]").forEach(el=>{
    const v=d[el.dataset.t];
    if(typeof v==="string") el.innerHTML=v;
  });
  $$("[data-t-aria]").forEach(el=>{
    const v=d[el.dataset.tAria];
    if(typeof v==="string") el.setAttribute("aria-label",v);
  });
  $$(".seg button[data-l]").forEach(b=>{
    const selected=b.dataset.l===l;
    b.classList.toggle("on",selected);
    b.setAttribute("aria-pressed",String(selected));
  });
  $$(".tab").forEach((t,i)=>t.querySelector("strong").textContent=d[SECTORS[i].id].n);
  $$(".panel").forEach((p,i)=>{
    const s=d[SECTORS[i].id];
    p.querySelector(".panel-title").textContent=s.n;
    p.querySelector(".p-more p").textContent=s.d;
    p.querySelector("ul").innerHTML=s.f.map(x=>`<li>${x}</li>`).join("");
    p.querySelector(".btn span").textContent=d.visit;
  });
  $("#why").innerHTML=d.why.map((w,i)=>`<div class="card rv in"><div class="ci">${WHY_ICONS[i]}</div><h5>${w[0]}</h5><p>${w[1]}</p></div>`).join("");
  $("#platformList").innerHTML=PLATFORMS.map(p=>{const[code,name,domain]=d.businessSites[p.k];return `<div class="platform-entry" data-k="${p.k}"><code>${code}</code><span>${name}</span><small dir="ltr">${domain}</small></div>`}).join("");
  $$("#map g[data-k]").forEach(g=>g.querySelector("text").textContent=d.businessSites[g.dataset.k][1]);
  $("#fSectors").innerHTML=SECTORS.map(s=>`<a href="${s.url}" target="_blank" rel="noopener noreferrer">${d[s.id].n}</a>`).join("");
  const words=SECTORS.map((s,i)=>`<span class="${i%2?"o":""}"><i style="background:${s.c}"></i>${d[s.id].n}</span>`).join("");
  $("#track").innerHTML=words+words+words+words;
  document.title=d.metaTitle;
  const description=$("#metaDescription");
  if(description) description.content=d.metaDescription;
  const ogTitle=$("#ogTitle"), ogDescription=$("#ogDescription");
  if(ogTitle) ogTitle.content=d.metaTitle;
  if(ogDescription) ogDescription.content=d.ogDescription;
  bindDynamic();
  show(cur,false);
  refreshThemeControl();
  syncRotation();
  if(typeof mobileNav!=="undefined"&&typeof menuButton!=="undefined") setMobileMenu(!mobileNav.hidden);
  try{localStorage.setItem("sawa_lang",l)}catch(e){}
  try{const u=new URL(location.href);u.searchParams.set("lang",l);history.replaceState(null,"",`${u.pathname}${u.search}${u.hash}`)}catch(e){}
}

/* ---------- hero showcase ---------- */
const hero=$("#hero"), stage=$("#stage"), rotationToggle=$("#rotationToggle");
const motionQuery=matchMedia("(prefers-reduced-motion: reduce)");
let userPaused=motionQuery.matches;
let hoverPaused=false;
let focusPaused=false;
let heroVisible=true;

function show(index, userInitiated=false){
  const i=((Number(index)||0)%SECTORS.length+SECTORS.length)%SECTORS.length;
  cur=i;
  if(userInitiated){userPaused=true;syncRotation();}
  const s=SECTORS[i], d=T[L][s.id];
  hero.style.setProperty("--acc",s.c);
  $$(".layer").forEach((el,k)=>el.classList.toggle("on",k===i));
  $$(".tab").forEach((tab,k)=>{
    const selected=k===i;
    tab.classList.toggle("active",selected);
    tab.setAttribute("aria-selected",String(selected));
    tab.tabIndex=selected?0:-1;
  });
  $$(".panel").forEach((panel,k)=>{
    const selected=k===i;
    panel.classList.toggle("active",selected);
    const toggle=panel.querySelector(".p-head");
    const detail=panel.querySelector(".p-more");
    toggle.setAttribute("aria-expanded",String(selected));
    detail.setAttribute("aria-hidden",String(!selected));
    detail.inert=!selected;
  });
  $("#stNum").textContent=`${pad(i+1)} / ${pad(SECTORS.length)}`;
  $("#stDom").textContent=s.dom;
  $("#stBody").setAttribute("aria-labelledby",`sector-tab-${s.id}`);
  $("#stBody").innerHTML=`<div class="fade"><div class="k">${d.s}</div><h2>${d.n}</h2><p>${d.d}</p><a class="btn btn-white" href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${d.n} — ${T[L].visit}">${T[L].visit} ${ICON.arr}</a></div>`;
  const bar=$$(".tab")[i]?.querySelector(".bar-p");
  if(bar){bar.style.animation="none";bar.offsetWidth;bar.style.animation="";}
}

function refreshRotationControl(){
  if(!rotationToggle) return;
  const reduced=motionQuery.matches;
  const paused=userPaused||reduced;
  const label=reduced?T[L].rotationDisabled:(paused?T[L].resumeRotation:T[L].pauseRotation);
  rotationToggle.disabled=reduced;
  rotationToggle.setAttribute("aria-pressed",String(paused));
  rotationToggle.setAttribute("aria-label",label);
  rotationToggle.title=label;
  rotationToggle.querySelector(".rotation-pause-icon").hidden=paused;
  rotationToggle.querySelector(".rotation-play-icon").hidden=!paused;
}
function syncRotation(){
  const paused=userPaused||hoverPaused||focusPaused||document.hidden||!heroVisible||motionQuery.matches;
  hero.classList.toggle("paused",paused);
  refreshRotationControl();
}

$("#tabs").addEventListener("click",event=>{
  const tab=event.target.closest(".tab");
  if(tab) show(tab.dataset.i,true);
});
$("#tabs").addEventListener("keydown",event=>{
  const tab=event.target.closest(".tab");
  if(!tab) return;
  const rtl=document.documentElement.dir==="rtl";
  let next=null;
  if(event.key==="Home") next=0;
  else if(event.key==="End") next=SECTORS.length-1;
  else if(event.key==="ArrowRight") next=(+tab.dataset.i+(rtl?-1:1)+SECTORS.length)%SECTORS.length;
  else if(event.key==="ArrowLeft") next=(+tab.dataset.i+(rtl?1:-1)+SECTORS.length)%SECTORS.length;
  if(next!==null){event.preventDefault();show(next,true);$$(".tab")[next].focus();}
});
  hero.addEventListener("focusin",event=>{
    if(!rotationToggle.contains(event.target)){focusPaused=true;syncRotation();}
  });
  hero.addEventListener("focusout",()=>setTimeout(()=>{
    focusPaused=hero.contains(document.activeElement)&&!rotationToggle.contains(document.activeElement);
    syncRotation();
  },0));
$("#tabs").addEventListener("animationend",event=>{
  if(event.animationName==="fillp"&&!hero.classList.contains("paused")) show((cur+1)%SECTORS.length);
});
rotationToggle.addEventListener("click",()=>{
  userPaused=!userPaused;
  hoverPaused=false;
  syncRotation();
});
stage.addEventListener("pointerenter",event=>{
  if(event.pointerType==="mouse"){hoverPaused=true;syncRotation();}
});
stage.addEventListener("pointerleave",()=>{
  hoverPaused=false;
  stage.style.setProperty("--rx","0deg");
  stage.style.setProperty("--ry","0deg");
  syncRotation();
});
document.addEventListener("visibilitychange",syncRotation);
const handleMotionPreference=event=>{
  if(event.matches) userPaused=true;
  else if(userPaused) userPaused=false;
  syncRotation();
};
if(motionQuery.addEventListener) motionQuery.addEventListener("change",handleMotionPreference);
else if(motionQuery.addListener) motionQuery.addListener(handleMotionPreference);
if("IntersectionObserver" in window){
  const heroObserver=new IntersectionObserver(entries=>{
    heroVisible=entries[0]?.isIntersecting??true;
    syncRotation();
  },{threshold:.08});
  heroObserver.observe(hero);
}
let pointerFrame=false;
if(matchMedia("(pointer:fine)").matches&&!motionQuery.matches){
  stage.addEventListener("pointermove",event=>{
    if(pointerFrame) return;
    pointerFrame=true;
    requestAnimationFrame(()=>{
      const rect=stage.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      stage.style.setProperty("--ry",`${x*6}deg`);
      stage.style.setProperty("--rx",`${-y*6}deg`);
      pointerFrame=false;
    });
  },{passive:true});
  hero.addEventListener("pointermove",event=>{
    if(pointerFrame) return;
    pointerFrame=true;
    requestAnimationFrame(()=>{
      const rect=hero.getBoundingClientRect();
      hero.style.setProperty("--mx",`${event.clientX-rect.left}px`);
      hero.style.setProperty("--my",`${event.clientY-rect.top}px`);
      pointerFrame=false;
    });
  },{passive:true});
}

/* ---------- business panels ---------- */
function activatePanel(panel){
  const index=Number(panel.dataset.i);
  show(index,true);
}
$("#panels").addEventListener("click",event=>{
  const toggle=event.target.closest(".p-head");
  if(toggle) activatePanel(toggle.closest(".panel"));
});
$("#panels").addEventListener("focusin",event=>{
  const toggle=event.target.closest(".p-head");
  if(toggle) activatePanel(toggle.closest(".panel"));
});
if(matchMedia("(hover:hover) and (min-width:1081px)").matches){
  $$(".panel").forEach(panel=>panel.addEventListener("mouseenter",()=>activatePanel(panel)));
}

/* ---------- dynamic details (rebuilt when language changes) ---------- */
function bindDynamic(){
  $$(".card").forEach(card=>card.addEventListener("pointermove",event=>{
    const rect=card.getBoundingClientRect();
    card.style.setProperty("--x",`${event.clientX-rect.left}px`);
    card.style.setProperty("--y",`${event.clientY-rect.top}px`);
  },{passive:true}));
  const highlight=(key,on)=>$$(`[data-k="${key}"]`).forEach(el=>el.classList.toggle("hl",on));
  $$(".platform-entry").forEach(entry=>{
    entry.addEventListener("pointerenter",()=>highlight(entry.dataset.k,true));
    entry.addEventListener("pointerleave",()=>highlight(entry.dataset.k,false));
  });
}
const mapEl=$("#map");
mapEl.addEventListener("pointerover",event=>{
  const group=event.target.closest("g[data-k]");
  if(group&&!group.contains(event.relatedTarget)){
    $$(`[data-k="${group.dataset.k}"]`).forEach(el=>el.classList.add("hl"));
  }
});
mapEl.addEventListener("pointerout",event=>{
  const group=event.target.closest("g[data-k]");
  if(group&&!group.contains(event.relatedTarget)){
    $$(`[data-k="${group.dataset.k}"]`).forEach(el=>el.classList.remove("hl"));
  }
});

/* ---------- theme and language ---------- */
function refreshThemeControl(){
  const dark=document.documentElement.dataset.theme!=="light";
  $$(".theme").forEach(button=>{
    button.setAttribute("aria-pressed",String(dark));
    button.setAttribute("aria-label",dark?T[L].themeAction:T[L].themeDarkAction);
    button.title=dark?T[L].themeAction:T[L].themeDarkAction;
  });
  const themeColor=document.querySelector('meta[name="theme-color"]');
  if(themeColor) themeColor.content=dark?"#07090E":"#F5F2EB";
}
$$(".theme").forEach(button=>button.addEventListener("click",()=>{
  document.documentElement.dataset.theme=document.documentElement.dataset.theme==="dark"?"light":"dark";
  refreshThemeControl();
  try{localStorage.setItem("sawa_theme",document.documentElement.dataset.theme)}catch(e){}
}));
$$(".seg button[data-l]").forEach(button=>button.addEventListener("click",()=>setLang(button.dataset.l)));

/* Responsive navigation works with touch, keyboard, outside click and Escape. */
const menuButton=$("#menuToggle"), mobileNav=$("#mobileNav");
function setMobileMenu(open,returnFocus=false){
  mobileNav.hidden=!open;
  menuButton.setAttribute("aria-expanded",String(open));
  const label=open?T[L].menuClose:T[L].menuOpen;
  menuButton.setAttribute("aria-label",label);
  menuButton.title=label;
  if(!open&&returnFocus) menuButton.focus({preventScroll:true});
}
menuButton.addEventListener("click",()=>setMobileMenu(mobileNav.hidden));
mobileNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>setMobileMenu(false)));
document.addEventListener("keydown",event=>{
  if(event.key==="Escape"&&!mobileNav.hidden) setMobileMenu(false,true);
});
document.addEventListener("click",event=>{
  if(!mobileNav.hidden&&!event.target.closest("#hdr")) setMobileMenu(false);
});

/* ---------- header + scroll progress ---------- */
const hdr=$("#hdr"), prog=$("#progress");
let scrollFrame=false;
function updateScrollState(){
  const y=window.scrollY||0;
  hdr.classList.toggle("solid",y>20);
  const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
  const ratio=Math.min(1,Math.max(0,y/max));
  prog.style.transform=`scaleX(${ratio})`;
  scrollFrame=false;
}
window.addEventListener("scroll",()=>{
  if(scrollFrame)return;
  scrollFrame=true;
  requestAnimationFrame(updateScrollState);
},{passive:true});
updateScrollState();

/* ---------- reveal + counters ---------- */
const io=("IntersectionObserver" in window)?new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting) return; e.target.classList.add("in"); io.unobserve(e.target);
  e.target.querySelectorAll(".cnt").forEach(c=>{const to=+c.dataset.to,t0=performance.now(),dur=1600;
    const step=t=>{const p=Math.min(1,(t-t0)/dur),v=Math.round(to*(1-Math.pow(1-p,3)));c.textContent=v.toLocaleString("en-US");if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)});
}),{threshold:.15}):null;
$$(".rv").forEach(el=>io?io.observe(el):el.classList.add("in"));
if(!io) $$(".cnt").forEach(c=>c.textContent=(+c.dataset.to).toLocaleString("en-US"));

/* ---------- start ---------- */
let start="ar";
try{const q=new URLSearchParams(location.search).get("lang"),s=localStorage.getItem("sawa_lang"),n=(navigator.language||"").slice(0,2);start=q||s||(n==="fr"?"fr":n==="en"?"en":"ar")}catch(e){}
setLang(start);
