import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calculator, Droplets, TrendingUp, Users, FileText, Lock, Check,
  ChevronRight, Globe, Plus, X, Activity, Apple, Heart, AlertCircle,
  ArrowRight, Sparkles, ClipboardList, UserPlus, Search, Calendar,
  Trash2, Edit3, Download, Crown, Zap, Scale, Ruler, Cake, Printer,
  BarChart2, Leaf, Shield, Star, Info
} from "lucide-react";

/* ============================================================
   I18N — Turkish + English
============================================================ */
const STR = {
  tr: {
    appName: "NutriBase",
    tagline: "Beslenme hesapları ve klinik takip",
    free: "Ücretsiz", pro: "Pro",
    nav: { calc: "Hesap Makinesi", track: "Takip", clients: "Danışanlar", templates: "Hastalık Şablonları", upgrade: "Pro'ya Geç" },
    hero: {
      eyebrow: "Kalori · Su · Makro · Klinik Şablonlar",
      title: "Beslenme bilimini herkes için netleştir",
      sub: "Bireyler için doğru hesaplama, diyetisyenler için klinik düzeyde araçlar — tek uygulamada.",
      ctaFree: "Ücretsiz Başla", ctaPro: "Diyetisyen misiniz?",
    },
    stats: { templates: "Hastalık Şablonu", languages: "Dil Desteği", formula: "Bilimsel Formül", free: "Ücretsiz Erişim" },
    howItWorks: {
      title: "Nasıl Çalışır?",
      step1Title: "Bilgilerini Gir",
      step1Desc: "Yaş, kilo, boy ve aktivite düzeyini gir.",
      step2Title: "Anında Hesapla",
      step2Desc: "BMR, TDEE, su ihtiyacı ve makrolarını saniyeler içinde gör.",
      step3Title: "Takip Et & İlerle",
      step3Desc: "Günlük kayıtlarınla ilerleni izle, diyetisyensen danışanlarını yönet.",
    },
    calc: {
      title: "Günlük İhtiyaç Hesaplama",
      sub: "Bilgilerini gir, BMR, TDEE, su ve makro ihtiyacını hemen gör.",
      gender: "Cinsiyet", male: "Erkek", female: "Kadın",
      age: "Yaş", height: "Boy (cm)", weight: "Kilo (kg)",
      activity: "Aktivite Düzeyi",
      act1: "Hareketsiz (masa başı, spor yok)",
      act2: "Hafif aktif (haftada 1-3 gün)",
      act3: "Orta aktif (haftada 3-5 gün)",
      act4: "Çok aktif (haftada 6-7 gün)",
      act5: "Üst düzey aktif (ağır iş + günlük spor)",
      goal: "Hedef",
      goalLose: "Kilo Vermek", goalMaintain: "Kiloyu Korumak", goalGain: "Kilo Almak",
      calculate: "Hesapla",
      results: "Sonuçların",
      bmr: "Bazal Metabolizma (BMR)", bmrDesc: "Vücudunun dinlenirken yaktığı enerji",
      tdee: "Günlük Toplam İhtiyaç (TDEE)", tdeeDesc: "Aktivite dahil günlük toplam kalori",
      target: "Hedef Kalori", targetDesc: "Hedefine göre önerilen günlük alım",
      water: "Su İhtiyacı", waterDesc: "Günlük önerilen su tüketimi",
      bmi: "Vücut Kitle İndeksi (VKİ)", bmiDesc: "Boy ve kilona göre vücut ağırlığı kategorisi",
      macros: "Makro Dağılımı",
      protein: "Protein", carbs: "Karbonhidrat", fat: "Yağ",
      perDay: "/ gün", liters: "litre", kcal: "kcal",
      bmiUnder: "Zayıf", bmiNormal: "Normal", bmiOver: "Fazla Kilolu", bmiObese: "Obez",
      disclaimer: "Bu hesaplamalar genel formüllere dayanır ve bireysel tıbbi tavsiye yerine geçmez. Özel sağlık durumların için bir diyetisyene danış.",
      saveEntry: "Bugüne Kaydet",
      saved: "Kaydedildi!",
    },
    track: {
      title: "Günlük Takip",
      sub: "Kayıtlı hesaplamalarını ve ilerlemeni gör.",
      empty: "Henüz kayıt yok. Hesap makinesinden bir hesaplama yapıp kaydet.",
      date: "Tarih", weight: "Kilo", target: "Hedef Kalori", water: "Su",
      delete: "Sil",
      weightTrend: "Kilo Değişimi",
    },
    upsell: {
      title: "Bu özellik Pro'da",
      sub: "Danışan yönetimi ve hastalık şablonları yalnızca diyetisyenler için açık Pro pakette bulunur.",
      cta: "Pro'yu İncele",
    },
    pro: {
      badge: "DİYETİSYEN PRO",
      landingTitle: "Klinik pratiğin için tasarlandı",
      landingSub: "Danışan kayıtları, hastalık bazlı diyet şablonları ve klinik notlar — hepsi tek yerde.",
      feature1: "Sınırsız danışan kaydı ve geçmiş takibi",
      feature2: "12+ hastalık için hazır diyet şablonu kütüphanesi",
      feature3: "Şablonları danışana özel düzenleyip dışa aktarma",
      feature4: "Klinik notlar ve ilerleme grafikleri",
      priceMonthly: "Aylık", priceYearly: "Yıllık (2 ay bedava)",
      subscribe: "Demo Aboneliği Başlat",
      demoNote: "Bu bir demo akışıdır — gerçek ödeme alınmaz.",
      cardNumber: "Kart Numarası", expiry: "SK/YY", cvc: "CVC", name: "Kart Üzerindeki İsim",
      confirm: "Aboneliği Onayla",
      processing: "İşleniyor...",
      success: "Pro'ya hoş geldin!",
      successSub: "Artık tüm klinik araçlara erişimin var.",
      goToApp: "Panele Git",
    },
    clients: {
      title: "Danışanlarım",
      add: "Yeni Danışan",
      search: "Danışan ara...",
      empty: "Henüz danışan eklenmedi.",
      name: "Ad Soyad / Kod",
      age: "Yaş", gender: "Cinsiyet", height: "Boy", weight: "Güncel Kilo",
      condition: "Sağlık Durumu", conditionNone: "Özel durum yok",
      notes: "Klinik Notlar",
      save: "Kaydet", cancel: "Vazgeç",
      viewProfile: "Profili Gör",
      lastVisit: "Son Kayıt",
      newEntry: "Yeni Ölçüm Ekle",
      history: "Geçmiş",
      privacyNote: "Gizlilik için gerçek kimlik yerine rumuz veya danışan kodu kullanmanız önerilir.",
      assignTemplate: "Şablon Ata",
      delete: "Danışanı Sil",
      confirmDelete: "Bu danışanı ve tüm kayıtlarını silmek istediğine emin misin?",
    },
    templates: {
      title: "Hastalık Diyet Şablonları",
      sub: "Klinik referans amaçlıdır. Danışana özel olarak sen düzenleyip onaylamalısın.",
      use: "Şablonu Kullan",
      overview: "Genel Bakış",
      restrictions: "Kısıtlamalar",
      recommended: "Önerilen Gıdalar",
      avoid: "Kaçınılması Gerekenler",
      sampleMenu: "Örnek Günlük Menü",
      breakfast: "Kahvaltı", lunch: "Öğle Yemeği", dinner: "Akşam Yemeği", snack: "Ara Öğün",
      medicalNote: "Bu şablon genel klinik kılavuzlara dayanır; ilaç etkileşimleri ve bireysel laboratuvar değerleri mutlaka dikkate alınmalıdır.",
      backToList: "Listeye Dön",
      print: "Yazdır / PDF",
    },
    footer: {
      desc: "Bireyler için beslenme hesaplamaları, diyetisyenler için klinik takip araçları.",
      links: "Bağlantılar",
      calc: "Hesap Makinesi",
      track: "Takip",
      pro: "Pro",
      rights: "Tüm hakları saklıdır.",
      disclaimer: "Bu uygulama tıbbi tavsiye vermez. Sağlık kararları için bir uzmana danışın.",
    },
    common: { close: "Kapat", back: "Geri", next: "İleri", optional: "isteğe bağlı", loading: "Yükleniyor..." },
  },
  en: {
    appName: "NutriBase",
    tagline: "Nutrition calculations and clinical tracking",
    free: "Free", pro: "Pro",
    nav: { calc: "Calculator", track: "Tracking", clients: "Clients", templates: "Condition Templates", upgrade: "Upgrade to Pro" },
    hero: {
      eyebrow: "Calories · Water · Macros · Clinical Templates",
      title: "Make nutrition science clear for everyone",
      sub: "Accurate calculations for individuals, clinical-grade tools for dietitians — in one app.",
      ctaFree: "Start Free", ctaPro: "Are you a dietitian?",
    },
    stats: { templates: "Condition Templates", languages: "Languages", formula: "Scientific Formula", free: "Free Access" },
    howItWorks: {
      title: "How It Works",
      step1Title: "Enter Your Details",
      step1Desc: "Enter your age, weight, height and activity level.",
      step2Title: "Calculate Instantly",
      step2Desc: "See your BMR, TDEE, water and macro needs in seconds.",
      step3Title: "Track & Progress",
      step3Desc: "Monitor your progress with daily logs; manage clients if you're a dietitian.",
    },
    calc: {
      title: "Daily Needs Calculator",
      sub: "Enter your details to see your BMR, TDEE, water and macro needs instantly.",
      gender: "Gender", male: "Male", female: "Female",
      age: "Age", height: "Height (cm)", weight: "Weight (kg)",
      activity: "Activity Level",
      act1: "Sedentary (desk job, no exercise)",
      act2: "Lightly active (1-3 days/week)",
      act3: "Moderately active (3-5 days/week)",
      act4: "Very active (6-7 days/week)",
      act5: "Extremely active (physical job + daily training)",
      goal: "Goal",
      goalLose: "Lose Weight", goalMaintain: "Maintain Weight", goalGain: "Gain Weight",
      calculate: "Calculate",
      results: "Your Results",
      bmr: "Basal Metabolic Rate (BMR)", bmrDesc: "Energy your body burns at rest",
      tdee: "Total Daily Energy (TDEE)", tdeeDesc: "Total daily calories including activity",
      target: "Target Calories", targetDesc: "Recommended daily intake for your goal",
      water: "Water Needs", waterDesc: "Recommended daily water intake",
      bmi: "Body Mass Index (BMI)", bmiDesc: "Body weight category based on height and weight",
      macros: "Macro Breakdown",
      protein: "Protein", carbs: "Carbs", fat: "Fat",
      perDay: "/ day", liters: "liters", kcal: "kcal",
      bmiUnder: "Underweight", bmiNormal: "Normal", bmiOver: "Overweight", bmiObese: "Obese",
      disclaimer: "These calculations use general formulas and are not a substitute for individual medical advice. Consult a dietitian for specific health conditions.",
      saveEntry: "Save to Today",
      saved: "Saved!",
    },
    track: {
      title: "Daily Tracking",
      sub: "View your saved calculations and progress.",
      empty: "No entries yet. Run a calculation and save it.",
      date: "Date", weight: "Weight", target: "Target Cal", water: "Water",
      delete: "Delete",
      weightTrend: "Weight Trend",
    },
    upsell: {
      title: "This feature is Pro",
      sub: "Client management and condition templates are available only in the Pro plan for dietitians.",
      cta: "See Pro",
    },
    pro: {
      badge: "DIETITIAN PRO",
      landingTitle: "Built for your clinical practice",
      landingSub: "Client records, condition-based diet templates, and clinical notes — all in one place.",
      feature1: "Unlimited client records and history tracking",
      feature2: "Ready-made diet template library for 12+ conditions",
      feature3: "Customize templates per client and export them",
      feature4: "Clinical notes and progress charts",
      priceMonthly: "Monthly", priceYearly: "Yearly (2 months free)",
      subscribe: "Start Demo Subscription",
      demoNote: "This is a demo flow — no real payment is taken.",
      cardNumber: "Card Number", expiry: "MM/YY", cvc: "CVC", name: "Name on Card",
      confirm: "Confirm Subscription",
      processing: "Processing...",
      success: "Welcome to Pro!",
      successSub: "You now have access to all clinical tools.",
      goToApp: "Go to Dashboard",
    },
    clients: {
      title: "My Clients",
      add: "New Client",
      search: "Search clients...",
      empty: "No clients added yet.",
      name: "Name / Code",
      age: "Age", gender: "Gender", height: "Height", weight: "Current Weight",
      condition: "Health Condition", conditionNone: "No specific condition",
      notes: "Clinical Notes",
      save: "Save", cancel: "Cancel",
      viewProfile: "View Profile",
      lastVisit: "Last Entry",
      newEntry: "Add New Measurement",
      history: "History",
      privacyNote: "For privacy, we recommend using a pseudonym or client code instead of a real identity.",
      assignTemplate: "Assign Template",
      delete: "Delete Client",
      confirmDelete: "Are you sure you want to delete this client and all their records?",
    },
    templates: {
      title: "Condition Diet Templates",
      sub: "For clinical reference only. You must customize and approve for each client.",
      use: "Use Template",
      overview: "Overview",
      restrictions: "Restrictions",
      recommended: "Recommended Foods",
      avoid: "Foods to Avoid",
      sampleMenu: "Sample Daily Menu",
      breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack",
      medicalNote: "This template is based on general clinical guidelines; medication interactions and individual lab values must always be considered.",
      backToList: "Back to List",
      print: "Print / PDF",
    },
    footer: {
      desc: "Nutrition calculations for individuals, clinical tracking tools for dietitians.",
      links: "Links",
      calc: "Calculator",
      track: "Tracking",
      pro: "Pro",
      rights: "All rights reserved.",
      disclaimer: "This app does not provide medical advice. Consult a professional for health decisions.",
    },
    common: { close: "Close", back: "Back", next: "Next", optional: "optional", loading: "Loading..." },
  },
};

/* ============================================================
   DESIGN TOKENS
============================================================ */
const COLORS = {
  ink: "#0E2A3D",
  inkSoft: "#1B3F56",
  paper: "#FAF8F3",
  paperDim: "#F1EDE3",
  coral: "#E8623F",
  coralSoft: "#FBE2D8",
  line: "#D8D2C4",
  sage: "#5C7A6E",
  gold: "#C9A14A",
};

/* ============================================================
   HEALTH CONDITION TEMPLATES — 12 conditions
============================================================ */
const CONDITIONS = [
  {
    id: "diabetes2",
    nameTr: "Tip 2 Diyabet", nameEn: "Type 2 Diabetes",
    icon: "🩸",
    overviewTr: "Kan şekeri regülasyonunu desteklemek için düşük glisemik indeksli, kompleks karbonhidrat ağırlıklı, düzenli öğün saatlerine dayalı bir yaklaşım.",
    overviewEn: "An approach based on low glycemic index, complex carbohydrates, and consistent meal timing to support blood sugar regulation.",
    restrictionsTr: ["Basit/rafine şeker", "Şekerli içecekler", "Beyaz un ürünleri", "Yüksek glisemik indeksli meyveler (aşırı miktarda)"],
    restrictionsEn: ["Simple/refined sugar", "Sugary beverages", "White flour products", "High-GI fruits (in excess)"],
    recommendedTr: ["Tam tahıllar (bulgur, yulaf, kepekli ekmek)", "Lifli sebzeler", "Yağsız protein kaynakları", "Baklagiller", "Düşük GI meyveler (elma, armut, böğürtlen)"],
    recommendedEn: ["Whole grains (bulgur, oats, whole wheat bread)", "Fibrous vegetables", "Lean protein sources", "Legumes", "Low-GI fruits (apple, pear, berries)"],
    avoidTr: ["Şekerli tatlılar", "Meyve suları", "Beyaz pirinç (sık tüketim)", "İşlenmiş atıştırmalıklar"],
    avoidEn: ["Sugary desserts", "Fruit juices", "White rice (frequent consumption)", "Processed snacks"],
    menuTr: { breakfast: "2 yumurta + tam tahıllı ekmek + domates/salatalık", lunch: "Izgara tavuk + bulgur pilavı + yeşil salata", dinner: "Balık + buharda sebze + az yağlı yoğurt", snack: "Bir avuç ceviz + elma" },
    menuEn: { breakfast: "2 eggs + whole grain bread + tomato/cucumber", lunch: "Grilled chicken + bulgur pilaf + green salad", dinner: "Fish + steamed vegetables + low-fat yogurt", snack: "A handful of walnuts + an apple" },
  },
  {
    id: "hypertension",
    nameTr: "Hipertansiyon", nameEn: "Hypertension",
    icon: "❤️",
    overviewTr: "DASH diyeti prensiplerine dayalı, sodyum kısıtlamalı ve potasyum/magnezyum açısından zengin bir beslenme modeli.",
    overviewEn: "A sodium-restricted, potassium and magnesium-rich nutrition model based on DASH diet principles.",
    restrictionsTr: ["Tuz (günde 5g altı)", "İşlenmiş/konserve gıdalar", "Turşu, salamura", "Hazır soslar"],
    restrictionsEn: ["Salt (under 5g/day)", "Processed/canned foods", "Pickles, brined foods", "Ready-made sauces"],
    recommendedTr: ["Taze sebze ve meyve", "Az yağlı süt ürünleri", "Tam tahıllar", "Kuruyemiş (tuzsuz)", "Zeytinyağı"],
    recommendedEn: ["Fresh vegetables and fruit", "Low-fat dairy", "Whole grains", "Unsalted nuts", "Olive oil"],
    avoidTr: ["Sucuk, salam, sosis", "Cips ve tuzlu atıştırmalıklar", "Hazır çorbalar", "Fast food"],
    avoidEn: ["Cured meats, sausages", "Chips and salty snacks", "Instant soups", "Fast food"],
    menuTr: { breakfast: "Az tuzlu peynir + domates + tam tahıllı ekmek", lunch: "Mercimek çorbası (az tuz) + tavuk + salata", dinner: "Fırında balık + sebze + bulgur", snack: "Tuzsuz badem + meyve" },
    menuEn: { breakfast: "Low-salt cheese + tomato + whole grain bread", lunch: "Lentil soup (low salt) + chicken + salad", dinner: "Baked fish + vegetables + bulgur", snack: "Unsalted almonds + fruit" },
  },
  {
    id: "ckd",
    nameTr: "Kronik Böbrek Hastalığı", nameEn: "Chronic Kidney Disease",
    icon: "🫘",
    overviewTr: "Protein, potasyum, fosfor ve sodyum kısıtlaması gerektiren, evreye göre kişiselleştirilmesi şart olan bir beslenme planı.",
    overviewEn: "A nutrition plan requiring protein, potassium, phosphorus, and sodium restriction, which must be personalized by disease stage.",
    restrictionsTr: ["Yüksek potasyumlu gıdalar (muz, kuru meyve, patates)", "Yüksek fosforlu gıdalar (süt ürünleri, kuruyemiş aşırı)", "Aşırı protein", "Tuz"],
    restrictionsEn: ["High-potassium foods (banana, dried fruit, potato)", "High-phosphorus foods (excess dairy, nuts)", "Excess protein", "Salt"],
    recommendedTr: ["Kontrollü porsiyonlarda kaliteli protein", "Düşük potasyumlu sebzeler (lahana, karnabahar)", "Beyaz ekmek (evreye göre)", "Bitkisel yağlar"],
    recommendedEn: ["Quality protein in controlled portions", "Low-potassium vegetables (cabbage, cauliflower)", "White bread (stage-dependent)", "Plant oils"],
    avoidTr: ["Muz, kayısı, kuru üzüm", "Tam tahıllı ürünler (ileri evrede)", "İşlenmiş et", "Kola ve koyu içecekler (fosfor)"],
    avoidEn: ["Banana, apricot, raisins", "Whole grain products (advanced stage)", "Processed meat", "Cola and dark beverages (phosphorus)"],
    menuTr: { breakfast: "Haşlanmış yumurta + beyaz ekmek + salatalık", lunch: "Kontrollü porsiyon tavuk + pirinç + haşlanmış sebze", dinner: "Az protein + pirinç + salata", snack: "Elma dilimleri" },
    menuEn: { breakfast: "Boiled egg + white bread + cucumber", lunch: "Controlled portion chicken + rice + boiled vegetables", dinner: "Low protein + rice + salad", snack: "Apple slices" },
    warning: true,
  },
  {
    id: "celiac",
    nameTr: "Çölyak Hastalığı", nameEn: "Celiac Disease",
    icon: "🌾",
    overviewTr: "Glütensiz yaşam zorunludur. Buğday, arpa, çavdar ve bunların türevlerinin tamamen diyetten çıkarılması gerekir.",
    overviewEn: "A strict gluten-free lifestyle is mandatory. Wheat, barley, rye, and their derivatives must be completely eliminated.",
    restrictionsTr: ["Buğday, arpa, çavdar", "Normal ekmek, makarna, bulgur", "Bira", "Gizli gluten içeren işlenmiş gıdalar"],
    restrictionsEn: ["Wheat, barley, rye", "Regular bread, pasta, bulgur", "Beer", "Processed foods with hidden gluten"],
    recommendedTr: ["Pirinç, mısır, kinoa", "Glütensiz etiketli ürünler", "Taze et, balık, sebze, meyve", "Baklagiller (doğal hali)"],
    recommendedEn: ["Rice, corn, quinoa", "Certified gluten-free products", "Fresh meat, fish, vegetables, fruit", "Legumes (natural form)"],
    avoidTr: ["Normal undan yapılan her şey", "Soya sosu (çoğu marka)", "İşlenmiş et ürünleri (gluten katkılı)", "Malt içeren ürünler"],
    avoidEn: ["Anything made with regular flour", "Soy sauce (most brands)", "Processed meats (gluten additives)", "Malt-containing products"],
    menuTr: { breakfast: "Yumurta + pirinç unu ekmeği + peynir", lunch: "Izgara et + pirinç pilavı + salata", dinner: "Balık + kinoa + sebze", snack: "Taze meyve + glütensiz kraker" },
    menuEn: { breakfast: "Eggs + rice flour bread + cheese", lunch: "Grilled meat + rice pilaf + salad", dinner: "Fish + quinoa + vegetables", snack: "Fresh fruit + gluten-free crackers" },
  },
  {
    id: "pcos",
    nameTr: "PKOS (Polikistik Over Sendromu)", nameEn: "PCOS",
    icon: "🌸",
    overviewTr: "İnsülin direncini azaltmaya odaklı, düşük glisemik yüklü, anti-inflamatuar bir beslenme yaklaşımı.",
    overviewEn: "An anti-inflammatory, low glycemic load nutrition approach focused on reducing insulin resistance.",
    restrictionsTr: ["Rafine şeker", "İşlenmiş karbonhidratlar", "Trans yağlar", "Aşırı kafein"],
    restrictionsEn: ["Refined sugar", "Processed carbohydrates", "Trans fats", "Excess caffeine"],
    recommendedTr: ["Yüksek lifli gıdalar", "Omega-3 kaynakları (balık, keten tohumu)", "Tarçın", "Yeşil yapraklı sebzeler", "Kaliteli protein"],
    recommendedEn: ["High-fiber foods", "Omega-3 sources (fish, flaxseed)", "Cinnamon", "Leafy greens", "Quality protein"],
    avoidTr: ["Şekerli atıştırmalıklar", "Beyaz ekmek/pirinç", "Margarin", "Fast food"],
    avoidEn: ["Sugary snacks", "White bread/rice", "Margarine", "Fast food"],
    menuTr: { breakfast: "Yulaf ezmesi + tarçın + ceviz + yaban mersini", lunch: "Somon + kinoa + brokoli", dinner: "Tavuk + bol sebze + zeytinyağı", snack: "Keten tohumlu yoğurt" },
    menuEn: { breakfast: "Oatmeal + cinnamon + walnuts + blueberries", lunch: "Salmon + quinoa + broccoli", dinner: "Chicken + plenty of vegetables + olive oil", snack: "Yogurt with flaxseed" },
  },
  {
    id: "ibs",
    nameTr: "İrritabl Bağırsak Sendromu (IBS)", nameEn: "Irritable Bowel Syndrome (IBS)",
    icon: "🌀",
    overviewTr: "Düşük FODMAP yaklaşımıyla sindirim semptomlarını azaltmayı hedefleyen, kademeli eliminasyon ve yeniden giriş temelli plan.",
    overviewEn: "A plan based on the low-FODMAP approach, using gradual elimination and reintroduction to reduce digestive symptoms.",
    restrictionsTr: ["Soğan, sarımsak", "Buğday (yüksek miktarda)", "Süt ürünleri (laktoz intoleransı varsa)", "Yapay tatlandırıcılar"],
    restrictionsEn: ["Onion, garlic", "Wheat (in large amounts)", "Dairy (if lactose intolerant)", "Artificial sweeteners"],
    recommendedTr: ["Düşük FODMAP sebzeler (havuç, kabak)", "Laktozsuz süt ürünleri", "Yulaf", "Yağsız protein"],
    recommendedEn: ["Low-FODMAP vegetables (carrot, zucchini)", "Lactose-free dairy", "Oats", "Lean protein"],
    avoidTr: ["Baklagiller (aşırı)", "Elma, armut (aşırı)", "Gazlı içecekler", "Şekersiz sakız (sorbitol)"],
    avoidEn: ["Legumes (excess)", "Apple, pear (excess)", "Carbonated drinks", "Sugar-free gum (sorbitol)"],
    menuTr: { breakfast: "Yulaf + laktozsuz süt + muz", lunch: "Izgara tavuk + pirinç + havuç", dinner: "Balık + kabak + patates", snack: "Laktozsuz yoğurt" },
    menuEn: { breakfast: "Oats + lactose-free milk + banana", lunch: "Grilled chicken + rice + carrot", dinner: "Fish + zucchini + potato", snack: "Lactose-free yogurt" },
  },
  {
    id: "obesity",
    nameTr: "Obezite", nameEn: "Obesity",
    icon: "⚖️",
    overviewTr: "Sürdürülebilir kilo kaybı için enerji kısıtlı, yüksek protein ve lif içerikli, doygunluğu artıran bir beslenme planı. Açlık hissi minimize edilmeli, sağlıklı alışkanlıklar önceliklendirilmelidir.",
    overviewEn: "An energy-restricted, high-protein and high-fiber nutrition plan to promote satiety and sustainable weight loss. Hunger should be minimized and healthy habits prioritized.",
    restrictionsTr: ["Yüksek kalorili işlenmiş gıdalar", "Şekerli içecekler ve alkol", "Yağlı fast food", "Aşırı porsiyon"],
    restrictionsEn: ["High-calorie processed foods", "Sugary drinks and alcohol", "High-fat fast food", "Oversized portions"],
    recommendedTr: ["Yüksek protein (tavuk, balık, baklagil, yumurta)", "Bol sebze ve yeşillik", "Tam tahıllar", "Düşük kalorili hacimli gıdalar", "Su ve çay"],
    recommendedEn: ["High protein (chicken, fish, legumes, eggs)", "Plenty of vegetables and greens", "Whole grains", "Low-calorie volume foods", "Water and tea"],
    avoidTr: ["Asitli ve şekerli içecekler", "Cips, kraker, bisküvi", "Hazır yemekler", "Kızartmalar"],
    avoidEn: ["Acidic and sugary drinks", "Chips, crackers, biscuits", "Ready meals", "Fried foods"],
    menuTr: { breakfast: "3 yumurta (haşlama/omlet) + domates + salatalık + 1 dilim tam tahıllı ekmek", lunch: "Izgara tavuk göğsü + bol yeşil salata + az zeytinyağı", dinner: "Buharda brokoli + az pilav veya bulgur + yoğurt", snack: "1 avuç badem veya havuç çubukları" },
    menuEn: { breakfast: "3 eggs (boiled/omelet) + tomato + cucumber + 1 slice whole grain bread", lunch: "Grilled chicken breast + big green salad + a little olive oil", dinner: "Steamed broccoli + small portion rice or bulgur + yogurt", snack: "A handful of almonds or carrot sticks" },
  },
  {
    id: "anemia",
    nameTr: "Demir Eksikliği Anemisi", nameEn: "Iron Deficiency Anemia",
    icon: "🩺",
    overviewTr: "Demir emilimini artırmak için C vitamini ile birlikte demir açısından zengin gıdaların tüketimine odaklanan beslenme planı. Emilimi engelleyen faktörler minimize edilmelidir.",
    overviewEn: "A nutrition plan focused on consuming iron-rich foods alongside vitamin C to enhance iron absorption. Factors that inhibit absorption should be minimized.",
    restrictionsTr: ["Demirle birlikte çay/kahve", "Kalsiyum takviyeleri öğünle beraber", "İşlenmemiş kepek (aşırı)"],
    restrictionsEn: ["Tea/coffee with iron-rich meals", "Calcium supplements with meals", "Unprocessed bran (excess)"],
    recommendedTr: ["Kırmızı et, tavuk, hindi", "Yeşil yapraklı sebzeler (ıspanak, pazı)", "Baklagiller (mercimek, nohut)", "C vitamini kaynakları (limon, portakal, biber)", "Kuruyemiş (kabak çekirdeği)"],
    recommendedEn: ["Red meat, chicken, turkey", "Leafy greens (spinach, chard)", "Legumes (lentils, chickpeas)", "Vitamin C sources (lemon, orange, bell pepper)", "Nuts (pumpkin seeds)"],
    avoidTr: ["Öğünle birlikte çay/kahve içmek", "Fazla işlenmiş gıdalar", "Kola ve fosfatlı içecekler"],
    avoidEn: ["Drinking tea/coffee with meals", "Heavily processed foods", "Cola and phosphate-rich drinks"],
    menuTr: { breakfast: "Yumurta + pekmez + portakal suyu + tam tahıllı ekmek", lunch: "Kıymalı mercimek çorbası + taze limon + ıspanaklı salata", dinner: "Sote ıspanak + kırmızı et + pilav", snack: "Kuru kayısı + portakal" },
    menuEn: { breakfast: "Eggs + molasses + orange juice + whole grain bread", lunch: "Minced meat lentil soup + fresh lemon + spinach salad", dinner: "Sautéed spinach + red meat + rice pilaf", snack: "Dried apricots + orange" },
  },
  {
    id: "gout",
    nameTr: "Gut Hastalığı", nameEn: "Gout",
    icon: "🦵",
    overviewTr: "Ürik asit seviyelerini düşürmeye yönelik, pürin açısından kısıtlı ve bol sıvı tüketimine dayalı bir beslenme planı.",
    overviewEn: "A purine-restricted, high-fluid nutrition plan aimed at reducing uric acid levels.",
    restrictionsTr: ["Sakatat (ciğer, böbrek)", "Deniz ürünleri (özellikle midye, hamsi)", "Alkol (özellikle bira)", "Fruktoz zengini gıdalar"],
    restrictionsEn: ["Organ meats (liver, kidney)", "Seafood (especially mussels, anchovies)", "Alcohol (especially beer)", "Fructose-rich foods"],
    recommendedTr: ["Bol su (günde 2-3 litre)", "Düşük yağlı süt ürünleri", "Sebzeler", "Yulaf, pirinç, bulgur", "Kiraz ve vişne (ürik asit düşürücü)"],
    recommendedEn: ["Plenty of water (2-3 liters/day)", "Low-fat dairy", "Vegetables", "Oats, rice, bulgur", "Cherries and sour cherries (uric acid-lowering)"],
    avoidTr: ["Kırmızı et (aşırı)", "Alkollü içecekler", "Şekerli meşrubatlar", "Sakatat"],
    avoidEn: ["Red meat (excess)", "Alcoholic beverages", "Sugary soft drinks", "Organ meats"],
    menuTr: { breakfast: "Yulaf ezmesi + az yağlı yoğurt + meyve", lunch: "Tavuk + pirinç + bol salata", dinner: "Sebze çorbası + peynirli tam tahıllı ekmek", snack: "Kiraz veya vişne + su" },
    menuEn: { breakfast: "Oatmeal + low-fat yogurt + fruit", lunch: "Chicken + rice + plenty of salad", dinner: "Vegetable soup + cheese on whole grain bread", snack: "Cherries or sour cherries + water" },
  },
  {
    id: "osteoporosis",
    nameTr: "Osteoporoz", nameEn: "Osteoporosis",
    icon: "🦴",
    overviewTr: "Kemik yoğunluğunu korumak ve artırmak için kalsiyum, D vitamini ve K vitamini açısından zengin, asit yükü düşük bir beslenme planı.",
    overviewEn: "A calcium, vitamin D and vitamin K-rich, low acid-load nutrition plan to maintain and improve bone density.",
    restrictionsTr: ["Aşırı kafein (kemikten kalsiyum çıkarır)", "Aşırı tuz", "Alkol", "Yüksek fosforlu içecekler (kola)"],
    restrictionsEn: ["Excess caffeine (leaches calcium from bones)", "Excess salt", "Alcohol", "High-phosphorus drinks (cola)"],
    recommendedTr: ["Süt ürünleri (kalsiyum)", "Yeşil yapraklı sebzeler (K vitamini)", "Somon, sardalya (D vitamini + kalsiyum)", "Soya ürünleri", "Susam ve tahin"],
    recommendedEn: ["Dairy products (calcium)", "Leafy greens (vitamin K)", "Salmon, sardines (vitamin D + calcium)", "Soy products", "Sesame and tahini"],
    avoidTr: ["Aşırı kahve/çay", "Aşırı tuzlu gıdalar", "Alkol", "Kola"],
    avoidEn: ["Excess coffee/tea", "Overly salty foods", "Alcohol", "Cola"],
    menuTr: { breakfast: "Süzme yoğurt + tahin + meyve + kepekli ekmek", lunch: "Somon + brokoli + az yağlı peynir + salata", dinner: "Az yağlı peynirli omlet + ıspanak + tam tahıllı ekmek", snack: "Susam ezmesi + ayran" },
    menuEn: { breakfast: "Strained yogurt + tahini + fruit + whole grain bread", lunch: "Salmon + broccoli + low-fat cheese + salad", dinner: "Low-fat cheese omelet + spinach + whole grain bread", snack: "Sesame paste + ayran (yogurt drink)" },
  },
  {
    id: "hypothyroid",
    nameTr: "Hipotiroidizm", nameEn: "Hypothyroidism",
    icon: "🦋",
    overviewTr: "Tiroid fonksiyonunu desteklemek için iyot, selenyum ve çinko açısından zengin, metabolizmayı destekleyen bir beslenme planı. Guatrojenik gıdalar pişirilerek tüketilmelidir.",
    overviewEn: "A nutrition plan rich in iodine, selenium and zinc to support thyroid function and metabolism. Goitrogenic foods should be consumed cooked.",
    restrictionsTr: ["Ham lahana, karnabahar, brokoli (soya ile birlikte değil)", "Aşırı soya ürünleri", "İşlenmiş gıdalar", "Aşırı gluten (eşzamanlı çölyak varsa)"],
    restrictionsEn: ["Raw cabbage, cauliflower, broccoli (not with soy)", "Excessive soy products", "Processed foods", "Excess gluten (if concurrent celiac)"],
    recommendedTr: ["Deniz ürünleri (iyot)", "Yumurta", "Kuruyemiş (selenyum için Brezilya fındığı)", "Et ve kümes hayvanları", "Tam tahıllar"],
    recommendedEn: ["Seafood (iodine)", "Eggs", "Nuts (Brazil nuts for selenium)", "Meat and poultry", "Whole grains"],
    avoidTr: ["İşlenmiş ve hazır gıdalar", "Aşırı karbonhidrat", "Soya sütü/tofu (aşırı)", "Alkol"],
    avoidEn: ["Processed and ready-made foods", "Excess carbohydrates", "Soy milk/tofu (excess)", "Alcohol"],
    menuTr: { breakfast: "Yumurta + peynir + tam tahıllı ekmek + domates", lunch: "Balık (levrek/somon) + pişmiş brokoli + pirinç", dinner: "Tavuk + mercimek + sebze", snack: "Brezilya fındığı (2-3 adet) + portakal" },
    menuEn: { breakfast: "Eggs + cheese + whole grain bread + tomato", lunch: "Fish (sea bass/salmon) + cooked broccoli + rice", dinner: "Chicken + lentils + vegetables", snack: "Brazil nuts (2-3 pieces) + orange" },
  },
  {
    id: "reflux",
    nameTr: "Gastroözofageal Reflü (GERD)", nameEn: "Gastroesophageal Reflux (GERD)",
    icon: "🔥",
    overviewTr: "Asit reflüsünü azaltmak için düşük asitli, az yağlı ve küçük öğünlere dayalı bir beslenme planı. Yemek sonrası yatmaktan kaçınılmalıdır.",
    overviewEn: "A low-acid, low-fat nutrition plan based on small meals to reduce acid reflux. Lying down after meals should be avoided.",
    restrictionsTr: ["Asitli meyveler (portakal, limon, domates)", "Kafein ve çay", "Alkol", "Yağlı ve kızartılmış yiyecekler", "Baharat ve acı"],
    restrictionsEn: ["Acidic fruits (orange, lemon, tomato)", "Caffeine and tea", "Alcohol", "Fatty and fried foods", "Spices and spicy foods"],
    recommendedTr: ["Muz, elma, armut", "Yulaf ezmesi", "Az yağlı protein (tavuk, balık)", "Zencefil (az miktarda)", "Haşlanmış veya buharda pişmiş sebzeler"],
    recommendedEn: ["Banana, apple, pear", "Oatmeal", "Low-fat protein (chicken, fish)", "Ginger (in small amounts)", "Boiled or steamed vegetables"],
    avoidTr: ["Domates ve sosları", "Kahve ve çay", "Çikolata ve nane", "Kızartmalar ve hazır gıdalar", "Karbonatlı içecekler"],
    avoidEn: ["Tomatoes and their sauces", "Coffee and tea", "Chocolate and mint", "Fried foods and ready meals", "Carbonated beverages"],
    menuTr: { breakfast: "Yulaf ezmesi + muz + az yağlı süt", lunch: "Haşlanmış tavuk + pilav + buharda havuç", dinner: "Balık + patates püresi + haşlanmış kabak", snack: "Elma veya armut + az yağlı yoğurt" },
    menuEn: { breakfast: "Oatmeal + banana + low-fat milk", lunch: "Boiled chicken + rice + steamed carrots", dinner: "Fish + mashed potato + steamed zucchini", snack: "Apple or pear + low-fat yogurt" },
  },
];

/* ============================================================
   STORAGE HELPERS
============================================================ */
const LS_PREFIX = "nutribase:";
async function storeGet(key) {
  try { const raw = localStorage.getItem(LS_PREFIX + key); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}
async function storeSet(key, value) {
  try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(value)); return true; }
  catch { return false; }
}
async function storeDelete(key) {
  try { localStorage.removeItem(LS_PREFIX + key); return true; } catch { return false; }
}
async function storeList(prefix) {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(LS_PREFIX + prefix)) keys.push(k.slice(LS_PREFIX.length));
    }
    return keys;
  } catch { return []; }
}

/* ============================================================
   CALCULATIONS
============================================================ */
function calcBMR({ gender, age, height, weight }) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}
function calcBMI(height, weight) {
  const h = Number(height) / 100;
  return (Number(weight) / (h * h)).toFixed(1);
}
function bmiCategory(bmi, t) {
  const v = parseFloat(bmi);
  if (v < 18.5) return { label: t.calc.bmiUnder, color: "#3B82F6" };
  if (v < 25) return { label: t.calc.bmiNormal, color: "#5C7A6E" };
  if (v < 30) return { label: t.calc.bmiOver, color: "#C9A14A" };
  return { label: t.calc.bmiObese, color: "#E8623F" };
}
const ACTIVITY_FACTORS = [1.2, 1.375, 1.55, 1.725, 1.9];
function calcAll({ gender, age, height, weight, activityIdx, goal }) {
  const bmr = calcBMR({ gender, age: Number(age), height: Number(height), weight: Number(weight) });
  const tdee = bmr * ACTIVITY_FACTORS[activityIdx];
  let target = tdee;
  if (goal === "lose") target = tdee - 400;
  if (goal === "gain") target = tdee + 300;
  const water = (Number(weight) * 0.035).toFixed(1);
  const protein = Math.round((target * 0.30) / 4);
  const carbs = Math.round((target * 0.40) / 4);
  const fat = Math.round((target * 0.30) / 9);
  const bmi = calcBMI(height, weight);
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), target: Math.round(target), water, protein, carbs, fat, bmi };
}

/* ============================================================
   UI PRIMITIVES
============================================================ */
function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="19" stroke={COLORS.ink} strokeWidth="1.5" />
      <path d="M13 26V14L27 26V14" stroke={COLORS.coral} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        border: `3px solid ${COLORS.line}`, borderTopColor: COLORS.coral,
        animation: "nb-spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes nb-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label style={{ display: "block", marginBottom: 18 }}>
      <span style={{ display: "block", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.ink, opacity: 0.55, marginBottom: 7, fontWeight: 600 }}>{label}</span>
      {children}
      {hint && <span style={{ display: "block", fontSize: 12, color: COLORS.ink, opacity: 0.4, marginTop: 4 }}>{hint}</span>}
    </label>
  );
}

const inputStyle = {
  width: "100%", padding: "12px 14px", fontSize: 16, borderRadius: 8,
  border: `1.5px solid ${COLORS.line}`, background: COLORS.paper, color: COLORS.ink,
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

function TextInput(props) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      style={{ ...inputStyle, borderColor: focused ? COLORS.coral : COLORS.line, ...(props.style || {}) }}
    />
  );
}

function SegButton({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {options.map((opt) => (
        <button key={opt.value} type="button" onClick={() => onChange(opt.value)} style={{
          flex: 1, padding: "11px 10px", borderRadius: 8, fontSize: 14, fontWeight: 600,
          border: `1.5px solid ${value === opt.value ? COLORS.ink : COLORS.line}`,
          background: value === opt.value ? COLORS.ink : COLORS.paper,
          color: value === opt.value ? COLORS.paper : COLORS.ink,
          cursor: "pointer", transition: "all 0.15s",
        }}>{opt.label}</button>
      ))}
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={(e) => onChange(Number(e.target.value))} style={{
      ...inputStyle, cursor: "pointer", appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230E2A3D' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
    }}>
      {options.map((o, i) => <option key={i} value={i}>{o}</option>)}
    </select>
  );
}

function Button({ children, onClick, variant = "primary", style = {}, type = "button", disabled }) {
  const base = { padding: "13px 24px", borderRadius: 9, fontSize: 15, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", border: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", transition: "all 0.15s", opacity: disabled ? 0.5 : 1 };
  const variants = {
    primary: { background: COLORS.ink, color: COLORS.paper },
    coral: { background: COLORS.coral, color: "#fff" },
    ghost: { background: "transparent", color: COLORS.ink, border: `1.5px solid ${COLORS.line}` },
    text: { background: "transparent", color: COLORS.coral, padding: "8px 4px" },
  };
  return <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
}

function Card({ children, style = {} }) {
  return <div style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: 24, ...style }}>{children}</div>;
}

function StatBlock({ icon, label, value, unit, sub, accent }) {
  return (
    <div style={{ background: accent ? COLORS.ink : "#fff", border: `1px solid ${accent ? COLORS.ink : COLORS.line}`, borderRadius: 14, padding: "22px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color: accent ? COLORS.coralSoft : COLORS.sage }}>
        {icon}
        <span style={{ fontSize: 11.5, letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700 }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 34, fontWeight: 800, color: accent ? "#fff" : COLORS.ink, fontFamily: "'Source Serif 4', Georgia, serif" }}>{value}</span>
        <span style={{ fontSize: 14, color: accent ? COLORS.paperDim : COLORS.ink, opacity: 0.6, fontWeight: 600 }}>{unit}</span>
      </div>
      {sub && <div style={{ fontSize: 12.5, color: accent ? COLORS.paperDim : COLORS.ink, opacity: accent ? 0.75 : 0.45, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function ProBadgeTag({ small }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: COLORS.gold, color: "#3A2D0A", fontSize: small ? 10 : 11, fontWeight: 800, padding: small ? "2px 7px" : "3px 9px", borderRadius: 20, letterSpacing: "0.04em" }}>
      <Crown size={small ? 10 : 12} /> PRO
    </span>
  );
}

/* ============================================================
   APP ROOT
============================================================ */
export default function App() {
  const [lang, setLang] = useState("tr");
  const t = STR[lang];
  const [page, setPage] = useState("landing");
  const [isPro, setIsPro] = useState(false);
  const [loadingPro, setLoadingPro] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  useEffect(() => {
    (async () => {
      const proStatus = await storeGet("user:isPro");
      setIsPro(!!proStatus);
      setLoadingPro(false);
    })();
  }, []);

  const goPro = useCallback(async () => {
    setIsPro(true);
    await storeSet("user:isPro", true);
  }, []);

  const navigate = (p) => { setPage(p); window.scrollTo(0, 0); };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.paper, color: COLORS.ink, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::selection { background: ${COLORS.coral}; color: #fff; }
        input:focus, select:focus { outline: none; }
        @media (max-width: 720px) {
          .nb-grid-2 { grid-template-columns: 1fr !important; }
          .nb-grid-3 { grid-template-columns: 1fr !important; }
          .nb-hide-mobile { display: none !important; }
        }
        .nb-page-enter { animation: fadeIn 0.22s ease both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media print {
          .nb-no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>

      <TopNav t={t} lang={lang} setLang={setLang} page={page} navigate={navigate} isPro={isPro} />

      <main className="nb-page-enter" key={page}>
        {page === "landing" && <Landing t={t} navigate={navigate} lang={lang} />}
        {page === "calc" && <CalcPage t={t} lang={lang} navigate={navigate} />}
        {page === "track" && <TrackPage t={t} lang={lang} />}
        {page === "clients" && (isPro ? <ClientsPage t={t} lang={lang} navigate={navigate} setSelectedClientId={setSelectedClientId} /> : <Upsell t={t} navigate={navigate} />)}
        {page === "clientProfile" && (isPro ? <ClientProfilePage t={t} lang={lang} clientId={selectedClientId} navigate={navigate} /> : <Upsell t={t} navigate={navigate} />)}
        {page === "templates" && (isPro ? <TemplatesPage t={t} lang={lang} navigate={navigate} setSelectedTemplateId={setSelectedTemplateId} /> : <Upsell t={t} navigate={navigate} />)}
        {page === "templateDetail" && (isPro ? <TemplateDetailPage t={t} lang={lang} templateId={selectedTemplateId} navigate={navigate} /> : <Upsell t={t} navigate={navigate} />)}
        {page === "proLanding" && <ProLanding t={t} navigate={navigate} isPro={isPro} />}
        {page === "proCheckout" && <ProCheckout t={t} navigate={navigate} goPro={goPro} />}
      </main>

      <Footer t={t} navigate={navigate} />
    </div>
  );
}

/* ============================================================
   NAV
============================================================ */
function TopNav({ t, lang, setLang, page, navigate, isPro }) {
  const navItems = [
    { key: "calc", label: t.nav.calc, icon: <Calculator size={15} /> },
    { key: "track", label: t.nav.track, icon: <TrendingUp size={15} /> },
    { key: "clients", label: t.nav.clients, icon: <Users size={15} />, pro: true },
    { key: "templates", label: t.nav.templates, icon: <FileText size={15} />, pro: true },
  ];
  return (
    <header style={{ borderBottom: `1px solid ${COLORS.line}`, background: COLORS.paper, position: "sticky", top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("landing")}>
          <Logo />
          <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 800, fontSize: 19, letterSpacing: "-0.01em" }}>{t.appName}</span>
          {isPro && <ProBadgeTag small />}
        </div>

        <nav className="nb-hide-mobile" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {navItems.map((item) => (
            <button key={item.key} onClick={() => navigate(item.key)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8,
              border: "none", background: page === item.key ? COLORS.paperDim : "transparent",
              color: COLORS.ink, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
            }}>
              {item.icon}{item.label}
              {item.pro && !isPro && <Lock size={10} style={{ marginLeft: 2, opacity: 0.5 }} />}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setLang(lang === "tr" ? "en" : "tr")} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 11px", borderRadius: 7, border: `1px solid ${COLORS.line}`, background: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer", color: COLORS.ink }}>
            <Globe size={13} /> {lang === "tr" ? "EN" : "TR"}
          </button>
          {!isPro && (
            <Button variant="coral" onClick={() => navigate("proLanding")} style={{ padding: "9px 16px", fontSize: 13 }} className="nb-hide-mobile">
              <Crown size={13} /> {t.nav.upgrade}
            </Button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", overflowX: "auto", gap: 6, padding: "0 16px 12px", borderTop: `1px solid ${COLORS.line}`, paddingTop: 10 }} className="nb-mobile-nav">
        {navItems.map((item) => (
          <button key={item.key} onClick={() => navigate(item.key)} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 20, whiteSpace: "nowrap",
            border: `1px solid ${page === item.key ? COLORS.ink : COLORS.line}`,
            background: page === item.key ? COLORS.ink : "#fff",
            color: page === item.key ? "#fff" : COLORS.ink, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
          }}>
            {item.icon}{item.label}{item.pro && !isPro && <Lock size={9} />}
          </button>
        ))}
      </div>
      <style>{`@media (min-width: 721px) { .nb-mobile-nav { display: none !important; } }`}</style>
    </header>
  );
}

/* ============================================================
   FOOTER
============================================================ */
function Footer({ t, navigate }) {
  return (
    <footer style={{ borderTop: `1px solid ${COLORS.line}`, background: COLORS.paper, padding: "48px 24px 32px", marginTop: 60 }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 40, marginBottom: 40 }} className="nb-grid-3">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Logo size={24} />
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 800, fontSize: 17 }}>{t.appName}</span>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.65, color: COLORS.ink, opacity: 0.6, margin: 0, maxWidth: 300 }}>{t.footer.desc}</p>
          </div>
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.ink, opacity: 0.5, margin: "0 0 14px" }}>{t.footer.links}</h4>
            {[
              { label: t.footer.calc, page: "calc" },
              { label: t.footer.track, page: "track" },
              { label: t.footer.pro, page: "proLanding" },
            ].map((l) => (
              <button key={l.page} onClick={() => navigate(l.page)} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontSize: 13.5, color: COLORS.ink, opacity: 0.65, padding: "4px 0", fontFamily: "inherit", textAlign: "left" }}>
                {l.label}
              </button>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.ink, opacity: 0.5, margin: "0 0 14px" }}>Pro</h4>
            {[
              { label: t.nav.clients, page: "clients" },
              { label: t.nav.templates, page: "templates" },
            ].map((l) => (
              <button key={l.page} onClick={() => navigate(l.page)} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontSize: 13.5, color: COLORS.ink, opacity: 0.65, padding: "4px 0", fontFamily: "inherit", textAlign: "left" }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${COLORS.line}`, paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: 12, color: COLORS.ink, opacity: 0.4 }}>
          <span>© 2026 {t.appName}. {t.footer.rights}</span>
          <span>{t.footer.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   LANDING
============================================================ */
function Landing({ t, navigate, lang }) {
  return (
    <div>
      {/* Hero */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "80px 24px 60px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 60, alignItems: "center" }} className="nb-grid-2">
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.coral, marginBottom: 18 }}>
            <Sparkles size={13} /> {t.hero.eyebrow}
          </div>
          <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "clamp(34px, 5vw, 54px)", fontWeight: 700, lineHeight: 1.08, margin: "0 0 22px", letterSpacing: "-0.015em" }}>
            {t.hero.title}
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: COLORS.ink, opacity: 0.7, maxWidth: 480, marginBottom: 32 }}>
            {t.hero.sub}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button variant="primary" onClick={() => navigate("calc")} style={{ padding: "15px 26px" }}>
              {t.hero.ctaFree} <ArrowRight size={16} />
            </Button>
            <Button variant="ghost" onClick={() => navigate("proLanding")} style={{ padding: "15px 26px" }}>
              {t.hero.ctaPro}
            </Button>
          </div>
        </div>
        <div><LandingVisual /></div>
      </section>

      {/* Stats strip */}
      <section style={{ background: COLORS.ink, padding: "28px 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, textAlign: "center" }} className="nb-grid-2">
          {[
            { value: "12+", label: t.stats.templates },
            { value: "2", label: t.stats.languages },
            { value: "1", label: t.stats.formula },
            { value: "100%", label: t.stats.free },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 32, fontWeight: 800, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.paperDim, opacity: 0.7, marginTop: 4, letterSpacing: "0.04em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 24px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="nb-grid-3">
          <FeatureTile icon={<Calculator size={20} />} title={lang === "tr" ? "Doğru Hesaplama" : "Accurate Calculation"} desc={lang === "tr" ? "Bilimsel formüllerle BMR, TDEE, BMİ, su ve makro ihtiyacı." : "BMR, TDEE, BMI, water and macro needs via scientific formulas."} />
          <FeatureTile icon={<Users size={20} />} title={lang === "tr" ? "Danışan Yönetimi" : "Client Management"} desc={lang === "tr" ? "Diyetisyenler için kalıcı danışan kayıtları ve geçmiş." : "Persistent client records and history for dietitians."} pro />
          <FeatureTile icon={<FileText size={20} />} title={lang === "tr" ? "Klinik Şablonlar" : "Clinical Templates"} desc={lang === "tr" ? "12+ hastalık için referans diyet planları, yazdırma desteği." : "Reference diet plans for 12+ conditions with print support."} pro />
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 24px 80px" }}>
        <h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 30, fontWeight: 700, margin: "0 0 40px", textAlign: "center" }}>{t.howItWorks.title}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }} className="nb-grid-3">
          {[
            { num: "01", title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc, icon: <Scale size={22} /> },
            { num: "02", title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc, icon: <Calculator size={22} /> },
            { num: "03", title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc, icon: <TrendingUp size={22} /> },
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: COLORS.coral, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  {step.icon}
                </div>
                <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 28, fontWeight: 800, color: COLORS.line }}>{step.num}</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>{step.title}</h3>
              <p style={{ fontSize: 13.5, color: COLORS.ink, opacity: 0.6, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeatureTile({ icon, title, desc, pro }) {
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: COLORS.paperDim, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.coral }}>{icon}</div>
        {pro && <ProBadgeTag small />}
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>{title}</h3>
      <p style={{ fontSize: 13.5, color: COLORS.ink, opacity: 0.6, lineHeight: 1.5, margin: 0 }}>{desc}</p>
    </Card>
  );
}

function LandingVisual() {
  return (
    <svg viewBox="0 0 420 420" style={{ width: "100%", height: "auto" }}>
      <circle cx="210" cy="210" r="200" fill={COLORS.paperDim} />
      <circle cx="210" cy="210" r="150" fill="none" stroke={COLORS.line} strokeWidth="1" strokeDasharray="3 6" />
      <circle cx="210" cy="210" r="118" fill="#fff" stroke={COLORS.line} strokeWidth="1.5" />
      <circle cx="210" cy="210" r="95" fill="none" stroke={COLORS.ink} strokeWidth="26" strokeDasharray="180 597" strokeDashoffset="0" transform="rotate(-90 210 210)" />
      <circle cx="210" cy="210" r="95" fill="none" stroke={COLORS.coral} strokeWidth="26" strokeDasharray="240 597" strokeDashoffset="-180" transform="rotate(-90 210 210)" />
      <circle cx="210" cy="210" r="95" fill="none" stroke={COLORS.sage} strokeWidth="26" strokeDasharray="177 597" strokeDashoffset="-420" transform="rotate(-90 210 210)" />
      <circle cx="210" cy="210" r="68" fill={COLORS.paper} />
      <text x="210" y="203" textAnchor="middle" fontFamily="'Source Serif 4', Georgia, serif" fontSize="30" fontWeight="800" fill={COLORS.ink}>2150</text>
      <text x="210" y="224" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill={COLORS.ink} opacity="0.5" letterSpacing="1">KCAL / GÜN</text>
      <g transform="translate(70,80)"><path d="M14 0 C20 12 28 20 28 30 A14 14 0 1 1 0 30 C0 20 8 12 14 0 Z" fill={COLORS.sage} opacity="0.85" /></g>
      <g transform="translate(330,90)"><rect x="0" y="0" width="30" height="38" rx="6" fill={COLORS.gold} opacity="0.85" /></g>
    </svg>
  );
}

/* ============================================================
   CALCULATOR PAGE
============================================================ */
function CalcPage({ t, lang, navigate }) {
  const [form, setForm] = useState({ gender: "female", age: "30", height: "165", weight: "65", activityIdx: 1, goal: "maintain" });
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleCalc = () => {
    if (!form.age || !form.height || !form.weight) return;
    setResult(calcAll(form));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!result) return;
    const today = new Date().toISOString().slice(0, 10);
    const entry = { date: today, weight: form.weight, target: result.target, water: result.water, ts: Date.now() };
    await storeSet(`entry:${Date.now()}`, entry);
    setSaved(true);
  };

  const goalOptions = [{ value: "lose", label: t.calc.goalLose }, { value: "maintain", label: t.calc.goalMaintain }, { value: "gain", label: t.calc.goalGain }];
  const genderOptions = [{ value: "female", label: t.calc.female }, { value: "male", label: t.calc.male }];
  const activityLabels = [t.calc.act1, t.calc.act2, t.calc.act3, t.calc.act4, t.calc.act5];

  const bmiData = result ? bmiCategory(result.bmi, t) : null;

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 32, fontWeight: 700, margin: "0 0 8px" }}>{t.calc.title}</h1>
        <p style={{ color: COLORS.ink, opacity: 0.6, fontSize: 15, margin: 0 }}>{t.calc.sub}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 28 }} className="nb-grid-2">
        <Card>
          <Field label={t.calc.gender}><SegButton options={genderOptions} value={form.gender} onChange={(v) => update("gender", v)} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label={t.calc.age}><TextInput type="number" value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="30" /></Field>
            <Field label={t.calc.height}><TextInput type="number" value={form.height} onChange={(e) => update("height", e.target.value)} placeholder="165" /></Field>
          </div>
          <Field label={t.calc.weight}><TextInput type="number" value={form.weight} onChange={(e) => update("weight", e.target.value)} placeholder="65" /></Field>
          <Field label={t.calc.activity}><Select value={form.activityIdx} onChange={(v) => update("activityIdx", v)} options={activityLabels} /></Field>
          <Field label={t.calc.goal}><SegButton options={goalOptions} value={form.goal} onChange={(v) => update("goal", v)} /></Field>
          <Button variant="primary" onClick={handleCalc} style={{ width: "100%", marginTop: 6, padding: "14px" }}>
            <Calculator size={16} /> {t.calc.calculate}
          </Button>
        </Card>

        <div>
          {!result && (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${COLORS.line}`, borderRadius: 14, minHeight: 320, padding: 40 }}>
              <div style={{ textAlign: "center", color: COLORS.ink, opacity: 0.4 }}>
                <Calculator size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                <p style={{ fontSize: 14, margin: 0 }}>{lang === "tr" ? "Sonuçlar burada görünecek" : "Results will appear here"}</p>
              </div>
            </div>
          )}
          {result && (
            <div>
              <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.ink, opacity: 0.5, marginBottom: 14 }}>{t.calc.results}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <StatBlock icon={<Activity size={14} />} label={t.calc.bmr} value={result.bmr} unit={t.calc.kcal} sub={t.calc.bmrDesc} />
                <StatBlock icon={<TrendingUp size={14} />} label={t.calc.tdee} value={result.tdee} unit={t.calc.kcal} sub={t.calc.tdeeDesc} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <StatBlock icon={<Apple size={14} />} label={t.calc.target} value={result.target} unit={t.calc.kcal} sub={t.calc.targetDesc} accent />
                <StatBlock icon={<Droplets size={14} />} label={t.calc.water} value={result.water} unit={t.calc.liters} sub={t.calc.waterDesc} />
              </div>

              {/* BMI Card */}
              <div style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: COLORS.sage }}>
                  <Scale size={14} />
                  <span style={{ fontSize: 11.5, letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700 }}>{t.calc.bmi}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div>
                    <span style={{ fontSize: 34, fontWeight: 800, color: COLORS.ink, fontFamily: "'Source Serif 4', Georgia, serif" }}>{result.bmi}</span>
                  </div>
                  <div>
                    <span style={{ display: "inline-block", background: bmiData.color + "20", color: bmiData.color, fontWeight: 700, fontSize: 13, padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${bmiData.color}40` }}>{bmiData.label}</span>
                    <div style={{ fontSize: 12, color: COLORS.ink, opacity: 0.45, marginTop: 4 }}>{t.calc.bmiDesc}</div>
                  </div>
                </div>
                {/* BMI scale */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: "flex", height: 6, borderRadius: 4, overflow: "hidden", gap: 2 }}>
                    {[["#3B82F6", "18.5"], ["#5C7A6E", "25"], ["#C9A14A", "30"], ["#E8623F", "∞"]].map(([col], i) => (
                      <div key={i} style={{ flex: 1, background: col, opacity: 0.7 }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.ink, opacity: 0.4, marginTop: 3 }}>
                    <span>{t.calc.bmiUnder}</span><span>{t.calc.bmiNormal}</span><span>{t.calc.bmiOver}</span><span>{t.calc.bmiObese}</span>
                  </div>
                </div>
              </div>

              <Card style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: COLORS.ink, opacity: 0.5, margin: "0 0 16px" }}>{t.calc.macros}</h3>
                <MacroBar protein={result.protein} carbs={result.carbs} fat={result.fat} t={t} />
              </Card>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Button variant="coral" onClick={handleSave}>
                  <Plus size={15} /> {t.calc.saveEntry}
                </Button>
                {saved && <span style={{ color: COLORS.sage, fontSize: 13.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Check size={15} /> {t.calc.saved}</span>}
              </div>

              <p style={{ fontSize: 12, color: COLORS.ink, opacity: 0.45, marginTop: 22, lineHeight: 1.6, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                {t.calc.disclaimer}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MacroBar({ protein, carbs, fat, t }) {
  const total = protein * 4 + carbs * 4 + fat * 9;
  const pPct = ((protein * 4) / total) * 100;
  const cPct = ((carbs * 4) / total) * 100;
  const fPct = ((fat * 9) / total) * 100;
  const rows = [
    { label: t.calc.protein, value: protein, pct: pPct, color: COLORS.ink },
    { label: t.calc.carbs, value: carbs, pct: cPct, color: COLORS.coral },
    { label: t.calc.fat, value: fat, pct: fPct, color: COLORS.sage },
  ];
  return (
    <div>
      <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", marginBottom: 18 }}>
        {rows.map((r, i) => <div key={i} style={{ width: `${r.pct}%`, background: r.color }} />)}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? `1px solid ${COLORS.paperDim}` : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: r.color, display: "inline-block" }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{r.label}</span>
            <span style={{ fontSize: 12, color: COLORS.ink, opacity: 0.4 }}>{r.pct.toFixed(0)}%</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{r.value}g</span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   TRACK PAGE
============================================================ */
function TrackPage({ t, lang }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const keys = await storeList("entry:");
    const items = [];
    for (const k of keys) { const v = await storeGet(k); if (v) items.push({ ...v, key: k }); }
    items.sort((a, b) => b.ts - a.ts);
    setEntries(items);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (key) => { await storeDelete(key); load(); };

  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 32, fontWeight: 700, margin: "0 0 8px" }}>{t.track.title}</h1>
        <p style={{ color: COLORS.ink, opacity: 0.6, fontSize: 15, margin: 0 }}>{t.track.sub}</p>
      </div>
      {loading && <Spinner />}
      {!loading && entries.length === 0 && (
        <div style={{ border: `1.5px dashed ${COLORS.line}`, borderRadius: 14, padding: 50, textAlign: "center", color: COLORS.ink, opacity: 0.45 }}>
          <ClipboardList size={28} style={{ marginBottom: 10 }} />
          <p style={{ margin: 0, fontSize: 14 }}>{t.track.empty}</p>
        </div>
      )}
      {!loading && entries.length > 0 && (
        <>
          {entries.length > 1 && <WeightChart entries={entries} t={t} />}
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: COLORS.paperDim }}>
                  {[t.track.date, t.track.weight, t.track.target, t.track.water, ""].map((h, i) => (
                    <th key={i} style={{ textAlign: "left", padding: "12px 18px", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: COLORS.ink, opacity: 0.55 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.key} style={{ borderTop: `1px solid ${COLORS.paperDim}` }}>
                    <td style={{ padding: "12px 18px", fontSize: 14, fontWeight: 600 }}>{e.date}</td>
                    <td style={{ padding: "12px 18px", fontSize: 14 }}>{e.weight} kg</td>
                    <td style={{ padding: "12px 18px", fontSize: 14 }}>{e.target} {t.calc.kcal}</td>
                    <td style={{ padding: "12px 18px", fontSize: 14 }}>{e.water} L</td>
                    <td style={{ padding: "12px 18px", textAlign: "right" }}>
                      <button onClick={() => handleDelete(e.key)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.ink, opacity: 0.35 }}><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </section>
  );
}

function WeightChart({ entries, t }) {
  const sorted = [...entries].sort((a, b) => a.ts - b.ts);
  const weights = sorted.map((e) => Number(e.weight));
  const min = Math.min(...weights) - 1;
  const max = Math.max(...weights) + 1;
  const range = max - min || 1;
  const w = 800, h = 160, pad = 20;
  const points = sorted.map((e, i) => {
    const x = pad + (i / Math.max(sorted.length - 1, 1)) * (w - pad * 2);
    const y = h - pad - ((Number(e.weight) - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  return (
    <Card style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: COLORS.ink, opacity: 0.5, margin: "0 0 16px" }}>{t.track.weightTrend}</h3>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto" }} preserveAspectRatio="none">
        <polyline points={points.join(" ")} fill="none" stroke={COLORS.coral} strokeWidth="2.5" />
        {sorted.map((e, i) => {
          const x = pad + (i / Math.max(sorted.length - 1, 1)) * (w - pad * 2);
          const y = h - pad - ((Number(e.weight) - min) / range) * (h - pad * 2);
          return <circle key={i} cx={x} cy={y} r="4" fill={COLORS.ink} />;
        })}
      </svg>
    </Card>
  );
}

/* ============================================================
   UPSELL
============================================================ */
function Upsell({ t, navigate }) {
  return (
    <section style={{ maxWidth: 600, margin: "0 auto", padding: "100px 24px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: COLORS.paperDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: COLORS.gold }}>
        <Lock size={26} />
      </div>
      <h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 26, fontWeight: 700, margin: "0 0 10px" }}>{t.upsell.title}</h2>
      <p style={{ color: COLORS.ink, opacity: 0.6, fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>{t.upsell.sub}</p>
      <Button variant="coral" onClick={() => navigate("proLanding")} style={{ padding: "14px 28px" }}>
        <Crown size={16} /> {t.upsell.cta}
      </Button>
    </section>
  );
}

/* ============================================================
   PRO LANDING
============================================================ */
function ProLanding({ t, navigate, isPro }) {
  const features = [t.pro.feature1, t.pro.feature2, t.pro.feature3, t.pro.feature4];
  return (
    <section style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px 90px" }}>
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <ProBadgeTag />
        <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 36, fontWeight: 700, margin: "16px 0 12px" }}>{t.pro.landingTitle}</h1>
        <p style={{ color: COLORS.ink, opacity: 0.6, fontSize: 16, maxWidth: 480, margin: "0 auto" }}>{t.pro.landingSub}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 44 }} className="nb-grid-2">
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 18 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: COLORS.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={14} /></div>
            <span style={{ fontSize: 14.5, lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
      {!isPro ? (
        <div style={{ textAlign: "center" }}>
          <Button variant="coral" onClick={() => navigate("proCheckout")} style={{ padding: "16px 32px", fontSize: 16 }}>
            <Crown size={17} /> {t.pro.subscribe}
          </Button>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Button variant="primary" onClick={() => navigate("clients")} style={{ padding: "16px 32px", fontSize: 16 }}>
            {t.pro.goToApp} <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   PRO CHECKOUT
============================================================ */
function ProCheckout({ t, navigate, goPro }) {
  const [plan, setPlan] = useState("yearly");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(async () => { await goPro(); setProcessing(false); setDone(true); }, 1400);
  };

  if (done) {
    return (
      <section style={{ maxWidth: 480, margin: "0 auto", padding: "100px 24px", textAlign: "center" }}>
        <div style={{ width: 70, height: 70, borderRadius: "50%", background: COLORS.sage, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Check size={32} color="#fff" />
        </div>
        <h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 26, fontWeight: 700, margin: "0 0 8px" }}>{t.pro.success}</h2>
        <p style={{ color: COLORS.ink, opacity: 0.6, marginBottom: 28 }}>{t.pro.successSub}</p>
        <Button variant="primary" onClick={() => navigate("clients")} style={{ padding: "14px 28px" }}>
          {t.pro.goToApp} <ArrowRight size={16} />
        </Button>
      </section>
    );
  }

  return (
    <section style={{ maxWidth: 480, margin: "0 auto", padding: "60px 24px 90px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <ProBadgeTag />
        <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 26, fontWeight: 700, margin: "14px 0 6px" }}>{t.pro.subscribe}</h1>
        <p style={{ fontSize: 12.5, color: COLORS.gold, fontWeight: 600 }}>{t.pro.demoNote}</p>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
        {[{ k: "monthly", label: t.pro.priceMonthly, price: "₺149" }, { k: "yearly", label: t.pro.priceYearly, price: "₺1.490" }].map((p) => (
          <button key={p.k} onClick={() => setPlan(p.k)} style={{ flex: 1, padding: "16px 14px", borderRadius: 12, cursor: "pointer", textAlign: "left", border: `2px solid ${plan === p.k ? COLORS.coral : COLORS.line}`, background: plan === p.k ? COLORS.coralSoft : "#fff" }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, opacity: 0.7, marginBottom: 4 }}>{p.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Source Serif 4', Georgia, serif" }}>{p.price}</div>
          </button>
        ))}
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <Field label={t.pro.name}><TextInput required value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="Ada Yılmaz" /></Field>
          <Field label={t.pro.cardNumber}><TextInput required value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="4242 4242 4242 4242" maxLength={19} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label={t.pro.expiry}><TextInput required value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="12/28" /></Field>
            <Field label={t.pro.cvc}><TextInput required value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} placeholder="123" maxLength={4} /></Field>
          </div>
          <Button type="submit" variant="coral" disabled={processing} style={{ width: "100%", padding: "15px", marginTop: 8 }}>
            {processing ? t.pro.processing : <>{t.pro.confirm} <ArrowRight size={15} /></>}
          </Button>
        </form>
      </Card>
    </section>
  );
}

/* ============================================================
   CLIENTS LIST
============================================================ */
function ClientsPage({ t, lang, navigate, setSelectedClientId }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", age: "", gender: "female", height: "", weight: "", condition: "", notes: "" });

  const load = useCallback(async () => {
    setLoading(true);
    const keys = await storeList("client:");
    const items = [];
    for (const k of keys) { const v = await storeGet(k); if (v) items.push({ ...v, key: k }); }
    items.sort((a, b) => b.createdAt - a.createdAt);
    setClients(items);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    const id = `client:${Date.now()}`;
    await storeSet(id, { ...form, createdAt: Date.now(), id });
    setForm({ name: "", age: "", gender: "female", height: "", weight: "", condition: "", notes: "" });
    setShowForm(false);
    load();
  };

  const handleDelete = async (key) => {
    if (!window.confirm(t.clients.confirmDelete)) return;
    await storeDelete(key);
    load();
  };

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <section style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 14 }}>
        <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 30, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
          {t.clients.title} <ProBadgeTag small />
        </h1>
        <Button variant="coral" onClick={() => setShowForm(!showForm)}><UserPlus size={16} /> {t.clients.add}</Button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 24 }}>
          <form onSubmit={handleAdd}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
              <Field label={t.clients.name}><TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={lang === "tr" ? "örn. Danışan-014" : "e.g. Client-014"} /></Field>
              <Field label={t.clients.age}><TextInput type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <Field label={t.clients.gender}><SegButton options={[{ value: "female", label: t.calc.female }, { value: "male", label: t.calc.male }]} value={form.gender} onChange={(v) => setForm({ ...form, gender: v })} /></Field>
              <Field label={t.clients.height}><TextInput type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} /></Field>
              <Field label={t.clients.weight}><TextInput type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></Field>
            </div>
            <Field label={t.clients.condition}><TextInput value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} placeholder={t.clients.conditionNone} /></Field>
            <Field label={t.clients.notes}>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
            </Field>
            <p style={{ fontSize: 12, color: COLORS.gold, opacity: 0.9, marginBottom: 16, display: "flex", gap: 6 }}>
              <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} /> {t.clients.privacyNote}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <Button type="submit" variant="primary">{t.clients.save}</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>{t.clients.cancel}</Button>
            </div>
          </form>
        </Card>
      )}

      <Field label="">
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: 13, opacity: 0.4 }} />
          <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.clients.search} style={{ paddingLeft: 38 }} />
        </div>
      </Field>

      {loading && <Spinner />}
      {!loading && filtered.length === 0 && (
        <div style={{ border: `1.5px dashed ${COLORS.line}`, borderRadius: 14, padding: 50, textAlign: "center", color: COLORS.ink, opacity: 0.45 }}>
          <Users size={28} style={{ marginBottom: 10 }} /><p style={{ margin: 0, fontSize: 14 }}>{t.clients.empty}</p>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }} className="nb-grid-2">
        {filtered.map((c) => (
          <Card key={c.key}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 4px" }}>{c.name}</h3>
                <p style={{ fontSize: 13, color: COLORS.ink, opacity: 0.55, margin: 0 }}>
                  {c.age && `${c.age} ${lang === "tr" ? "yaş" : "yrs"}`}{c.weight && ` · ${c.weight} kg`}{c.height && ` · ${c.height} cm`}
                </p>
                {c.condition && <span style={{ display: "inline-block", marginTop: 8, fontSize: 11.5, fontWeight: 600, background: COLORS.coralSoft, color: COLORS.coral, padding: "3px 9px", borderRadius: 20 }}>{c.condition}</span>}
              </div>
              <button onClick={() => handleDelete(c.key)} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.3 }}><Trash2 size={15} /></button>
            </div>
            <div style={{ marginTop: 16 }}>
              <Button variant="ghost" onClick={() => { setSelectedClientId(c.key); navigate("clientProfile"); }} style={{ fontSize: 13, padding: "8px 14px" }}>
                {t.clients.viewProfile} <ChevronRight size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   CLIENT PROFILE
============================================================ */
function ClientProfilePage({ t, lang, clientId, navigate }) {
  const [client, setClient] = useState(null);
  const [history, setHistory] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState({ weight: "", note: "" });

  const load = useCallback(async () => {
    if (!clientId) return;
    const c = await storeGet(clientId);
    setClient(c);
    const keys = await storeList(`${clientId}:history:`);
    const items = [];
    for (const k of keys) { const v = await storeGet(k); if (v) items.push({ ...v, key: k }); }
    items.sort((a, b) => b.ts - a.ts);
    setHistory(items);
  }, [clientId]);

  useEffect(() => { load(); }, [load]);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!newEntry.weight) return;
    const ts = Date.now();
    await storeSet(`${clientId}:history:${ts}`, { weight: newEntry.weight, note: newEntry.note, ts, date: new Date().toISOString().slice(0, 10) });
    setNewEntry({ weight: "", note: "" });
    setShowAdd(false);
    load();
  };

  if (!client) return <section style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px" }}><Spinner /></section>;

  return (
    <section style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px" }}>
      <button onClick={() => navigate("clients")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: COLORS.ink, opacity: 0.55, marginBottom: 20, padding: 0, fontWeight: 600 }}>
        ← {t.common.back}
      </button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 28, fontWeight: 700, margin: "0 0 6px" }}>{client.name}</h1>
          <p style={{ fontSize: 14, color: COLORS.ink, opacity: 0.55, margin: 0 }}>
            {client.age && `${client.age} ${lang === "tr" ? "yaş" : "yrs"}`} · {client.gender === "male" ? t.calc.male : t.calc.female} · {client.height} cm
          </p>
        </div>
        {client.condition && <span style={{ fontSize: 12.5, fontWeight: 600, background: COLORS.coralSoft, color: COLORS.coral, padding: "5px 12px", borderRadius: 20 }}>{client.condition}</span>}
      </div>
      {client.notes && (
        <Card style={{ marginBottom: 20, background: COLORS.paperDim, border: "none" }}>
          <h4 style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", opacity: 0.5, margin: "0 0 8px" }}>{t.clients.notes}</h4>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{client.notes}</p>
        </Card>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{t.clients.history}</h3>
        <Button variant="ghost" onClick={() => setShowAdd(!showAdd)} style={{ fontSize: 13, padding: "8px 14px" }}>
          <Plus size={14} /> {t.clients.newEntry}
        </Button>
      </div>
      {showAdd && (
        <Card style={{ marginBottom: 16 }}>
          <form onSubmit={handleAddEntry}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
              <Field label={t.clients.weight}><TextInput type="number" required value={newEntry.weight} onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })} /></Field>
              <Field label={t.clients.notes}><TextInput value={newEntry.note} onChange={(e) => setNewEntry({ ...newEntry, note: e.target.value })} /></Field>
            </div>
            <Button type="submit" variant="primary">{t.clients.save}</Button>
          </form>
        </Card>
      )}
      {history.length > 1 && <WeightChart entries={history} t={t} />}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {history.length === 0 && <p style={{ padding: 24, fontSize: 14, opacity: 0.5, margin: 0 }}>{t.track.empty}</p>}
        {history.map((h, i) => (
          <div key={h.key} style={{ display: "flex", justifyContent: "space-between", padding: "14px 20px", borderTop: i > 0 ? `1px solid ${COLORS.paperDim}` : "none" }}>
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{h.date}</span>
            <span style={{ fontSize: 13.5 }}>{h.weight} kg</span>
            <span style={{ fontSize: 13, opacity: 0.5 }}>{h.note}</span>
          </div>
        ))}
      </Card>
    </section>
  );
}

/* ============================================================
   TEMPLATES LIST
============================================================ */
function TemplatesPage({ t, lang, navigate, setSelectedTemplateId }) {
  return (
    <section style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 30, fontWeight: 700, margin: "0 0 6px", display: "flex", alignItems: "center", gap: 10 }}>
          {t.templates.title} <ProBadgeTag small />
        </h1>
        <p style={{ color: COLORS.ink, opacity: 0.6, fontSize: 14.5, margin: 0 }}>{t.templates.sub}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="nb-grid-3">
        {CONDITIONS.map((c) => (
          <Card key={c.id} style={{ cursor: "pointer", transition: "box-shadow 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(14,42,61,0.1)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            <div onClick={() => { setSelectedTemplateId(c.id); navigate("templateDetail"); }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 28 }}>{c.icon}</span>
                {c.warning && <AlertCircle size={15} color={COLORS.coral} />}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "12px 0 6px" }}>{lang === "tr" ? c.nameTr : c.nameEn}</h3>
              <p style={{ fontSize: 12.5, color: COLORS.ink, opacity: 0.55, lineHeight: 1.5, margin: "0 0 14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {lang === "tr" ? c.overviewTr : c.overviewEn}
              </p>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.coral, display: "flex", alignItems: "center", gap: 4 }}>
                {t.templates.use} <ChevronRight size={13} />
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   TEMPLATE DETAIL
============================================================ */
function TemplateDetailPage({ t, lang, templateId, navigate }) {
  const c = CONDITIONS.find((x) => x.id === templateId);
  if (!c) return null;

  const restrictions = lang === "tr" ? c.restrictionsTr : c.restrictionsEn;
  const recommended = lang === "tr" ? c.recommendedTr : c.recommendedEn;
  const avoid = lang === "tr" ? c.avoidTr : c.avoidEn;
  const menu = lang === "tr" ? c.menuTr : c.menuEn;

  const handlePrint = () => window.print();

  return (
    <section style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px 90px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }} className="nb-no-print">
        <button onClick={() => navigate("templates")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: COLORS.ink, opacity: 0.55, padding: 0, fontWeight: 600 }}>
          ← {t.templates.backToList}
        </button>
        <Button variant="ghost" onClick={handlePrint} style={{ fontSize: 13, padding: "8px 14px" }}>
          <Printer size={14} /> {t.templates.print}
        </Button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <span style={{ fontSize: 44 }}>{c.icon}</span>
        <div>
          <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 28, fontWeight: 700, margin: "0 0 6px" }}>{lang === "tr" ? c.nameTr : c.nameEn}</h1>
          <ProBadgeTag small />
        </div>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.5, margin: "0 0 10px" }}>{t.templates.overview}</h3>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65 }}>{lang === "tr" ? c.overviewTr : c.overviewEn}</p>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }} className="nb-grid-2">
        <Card>
          <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.5, margin: "0 0 12px", color: COLORS.sage }}>{t.templates.recommended}</h3>
          {recommended.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 9, fontSize: 13.5 }}>
              <Check size={14} color={COLORS.sage} style={{ flexShrink: 0, marginTop: 2 }} /> {r}
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.5, margin: "0 0 12px", color: COLORS.coral }}>{t.templates.avoid}</h3>
          {avoid.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 9, fontSize: 13.5 }}>
              <X size={14} color={COLORS.coral} style={{ flexShrink: 0, marginTop: 2 }} /> {r}
            </div>
          ))}
        </Card>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.5, margin: "0 0 14px" }}>{t.templates.restrictions}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {restrictions.map((r, i) => <span key={i} style={{ fontSize: 12.5, fontWeight: 600, background: COLORS.paperDim, padding: "6px 12px", borderRadius: 20 }}>{r}</span>)}
        </div>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.5, margin: "0 0 16px" }}>{t.templates.sampleMenu}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="nb-grid-2">
          {[
            { label: t.templates.breakfast, val: menu.breakfast },
            { label: t.templates.lunch, val: menu.lunch },
            { label: t.templates.dinner, val: menu.dinner },
            { label: t.templates.snack, val: menu.snack },
          ].map((m, i) => (
            <div key={i} style={{ background: COLORS.paperDim, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.coral, marginBottom: 5, letterSpacing: "0.04em", textTransform: "uppercase" }}>{m.label}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>{m.val}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "flex", gap: 10, padding: 16, background: "#FFF8F0", border: `1px solid ${COLORS.gold}40`, borderRadius: 10 }}>
        <AlertCircle size={16} color={COLORS.gold} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: COLORS.ink, opacity: 0.75 }}>{t.templates.medicalNote}</p>
      </div>
    </section>
  );
}
