import React, { useState, useEffect, useCallback } from "react";
import {
  Calculator, Droplets, TrendingUp, Users, FileText, Lock, Check,
  ChevronRight, Globe, Plus, X, Activity, Apple, AlertCircle,
  ArrowRight, Sparkles, ClipboardList, UserPlus, Search, Trash2,
  Crown, Scale, Printer, ChevronDown, ChevronUp, Leaf
} from "lucide-react";

const C = {
  ink:"#0E2A3D",paper:"#FAF8F3",paperDim:"#F1EDE3",
  coral:"#E8623F",coralSoft:"#FBE2D8",line:"#D8D2C4",sage:"#5C7A6E",gold:"#C9A14A",
};

const NUTRIENTS = [
  {i:0, tr:"Enerji",               en:"Energy",              unit:"kcal", imp:true},
  {i:1, tr:"Protein",              en:"Protein",             unit:"g",    imp:true},
  {i:2, tr:"Toplam Yağ",           en:"Total Fat",           unit:"g",    imp:true},
  {i:3, tr:"Karbonhidrat",         en:"Carbohydrates",       unit:"g",    imp:true},
  {i:4, tr:"Diyet Lifi",           en:"Dietary Fiber",       unit:"g",    imp:true},
  {i:5, tr:"Su",                   en:"Water",               unit:"g",    imp:false},
  {i:6, tr:"Şeker",                en:"Sugar",               unit:"g",    imp:true},
  {i:7, tr:"Doymuş Yağ",           en:"Saturated Fat",       unit:"g",    imp:true},
  {i:8, tr:"Tekli Doymamış Yağ",   en:"Monounsaturated Fat", unit:"g",    imp:false},
  {i:9, tr:"Çoklu Doymamış Yağ",   en:"Polyunsaturated Fat", unit:"g",    imp:false},
  {i:10,tr:"Trans Yağ",            en:"Trans Fat",           unit:"g",    imp:false},
  {i:11,tr:"Kolesterol",           en:"Cholesterol",         unit:"mg",   imp:true},
  {i:12,tr:"Sodyum",               en:"Sodium",              unit:"mg",   imp:true},
  {i:13,tr:"Potasyum",             en:"Potassium",           unit:"mg",   imp:false},
  {i:14,tr:"Kalsiyum",             en:"Calcium",             unit:"mg",   imp:true},
  {i:15,tr:"Demir",                en:"Iron",                unit:"mg",   imp:true},
  {i:16,tr:"Magnezyum",            en:"Magnesium",           unit:"mg",   imp:false},
  {i:17,tr:"Fosfor",               en:"Phosphorus",          unit:"mg",   imp:false},
  {i:18,tr:"Çinko",                en:"Zinc",                unit:"mg",   imp:false},
  {i:19,tr:"Vitamin A",            en:"Vitamin A",           unit:"mcg",  imp:true},
  {i:20,tr:"Vitamin C",            en:"Vitamin C",           unit:"mg",   imp:true},
  {i:21,tr:"Vitamin D",            en:"Vitamin D",           unit:"mcg",  imp:true},
  {i:22,tr:"Vitamin E",            en:"Vitamin E",           unit:"mg",   imp:false},
  {i:23,tr:"Vitamin B12",          en:"Vitamin B12",         unit:"mcg",  imp:true},
  {i:24,tr:"Folat",                en:"Folate",              unit:"mcg",  imp:false},
  {i:25,tr:"Vitamin B6",           en:"Vitamin B6",          unit:"mg",   imp:false},
];

// Food DB — 26 values per 100g (TurKomp + USDA)
const FOODS = [
  {id:1, tr:"Beyaz Ekmek",           en:"White Bread",           cat:"tahıl",      v:[265,9,3.2,49,2.7,37,5,0.7,0.6,1.4,0,0,491,115,151,2.9,26,108,0.7,0,0,0,0.2,0,29,0.1]},
  {id:2, tr:"Tam Buğday Ekmeği",     en:"Whole Wheat Bread",     cat:"tahıl",      v:[247,13,4.2,41,6.9,38,5.7,0.8,0.7,1.9,0,0,448,248,73,3.9,82,253,1.9,0,0.1,0,0.5,0,43,0.3]},
  {id:3, tr:"Pirinç Pilavı",         en:"Cooked Rice",           cat:"tahıl",      v:[130,2.7,0.3,28,0.4,69,0,0.1,0.1,0.1,0,0,1,35,10,0.2,12,43,0.5,0,0,0,0,0,3,0.1]},
  {id:4, tr:"Bulgur (Pişmiş)",       en:"Cooked Bulgur",         cat:"tahıl",      v:[83,3.1,0.2,18.6,4.5,78,0.1,0,0,0.1,0,0,5,68,10,1,32,40,0.6,0,0,0,0.1,0,18,0.1]},
  {id:5, tr:"Yulaf Ezmesi",          en:"Oatmeal",               cat:"tahıl",      v:[71,2.5,1.5,12,1.7,84,0,0.3,0.5,0.6,0,0,49,61,11,0.8,26,77,0.8,1,0,0,0.1,0,5,0]},
  {id:6, tr:"Makarna (Pişmiş)",      en:"Cooked Pasta",          cat:"tahıl",      v:[158,5.8,0.9,30.9,1.8,62,0.6,0.2,0.1,0.3,0,0,1,45,7,1.3,18,58,0.5,0,0,0,0,0,7,0.1]},
  {id:7, tr:"Kinoa (Pişmiş)",        en:"Cooked Quinoa",         cat:"tahıl",      v:[120,4.4,1.9,21.3,2.8,72,0.9,0.2,0.5,1,0,0,7,172,17,1.5,64,152,1.1,1,0,0,0.6,0,42,0.1]},
  {id:8, tr:"Tavuk Göğsü",           en:"Chicken Breast",        cat:"et",         v:[165,31,3.6,0,0,65,0,1,1.2,0.8,0,85,74,256,15,1,29,220,1,9,0,0.1,0.3,0.3,4,0.9]},
  {id:9, tr:"Tavuk But",             en:"Chicken Thigh",         cat:"et",         v:[209,26,11,0,0,64,0,3,4.3,2.5,0,93,84,220,12,1.3,22,179,2.5,29,0,0.1,0.4,0.4,5,0.6]},
  {id:10,tr:"Kıyma (Dana)",          en:"Ground Beef",           cat:"et",         v:[254,17.2,20,0,0,62,0,7.9,8.7,0.7,0.6,80,72,270,17,2.2,20,158,4.8,0,0,0.1,0.2,2.5,8,0.3]},
  {id:11,tr:"Dana Eti (Yağsız)",     en:"Lean Beef",             cat:"et",         v:[215,26.3,11.8,0,0,62,0,4.5,5.4,0.4,0.4,90,55,316,18,2.7,23,198,5.3,0,0,0.1,0.2,2.2,8,0.4]},
  {id:12,tr:"Hindi Göğsü",           en:"Turkey Breast",         cat:"et",         v:[135,30,1,0,0,69,0,0.3,0.2,0.3,0,84,50,298,12,1.4,32,203,2.1,0,0,0.1,0.2,0.5,6,0.9]},
  {id:13,tr:"Kuzu But",              en:"Lamb Leg",              cat:"et",         v:[258,25.6,16.5,0,0,58,0,7.3,6.9,1.2,0.5,97,72,310,17,2.5,24,195,4.2,0,0,0.5,0.2,2.8,18,0.1]},
  {id:14,tr:"Somon",                 en:"Salmon",                cat:"balık",      v:[208,20,13,0,0,67,0,3.1,6.1,2.3,0,63,59,363,13,0.8,30,252,0.6,50,0,14.5,1.9,3.2,25,0.6]},
  {id:15,tr:"Ton Balığı (Konserve)", en:"Canned Tuna",           cat:"balık",      v:[132,29,1,0,0,69,0,0.3,0.2,0.4,0,42,396,237,11,1.3,31,267,0.9,20,0,3.7,0.5,2.5,5,0.4]},
  {id:16,tr:"Levrek",                en:"Sea Bass",              cat:"balık",      v:[97,18.4,2,0,0,79,0,0.4,0.5,0.6,0,53,68,328,10,0.3,29,202,0.4,30,0,2.1,0.6,1.2,14,0.4]},
  {id:17,tr:"Hamsi",                 en:"Anchovy",               cat:"balık",      v:[131,20.4,4.8,0,0,74,0,1.3,1.2,1.6,0,60,104,383,232,3.3,41,234,1.7,15,0,4.1,0.4,1.1,9,0.1]},
  {id:18,tr:"Çipura",                en:"Sea Bream",             cat:"balık",      v:[95,18.1,2.6,0,0,79,0,0.5,0.9,0.8,0,55,72,310,12,0.5,31,195,0.6,25,0,3.2,0.7,1.5,12,0.4]},
  {id:19,tr:"Sardalye",              en:"Sardine",               cat:"balık",      v:[208,24.6,11.5,0,0,60,0,1.5,3.9,5.2,0,142,505,397,382,2.9,39,490,1.3,54,0,10.9,2,8.9,10,0.2]},
  {id:20,tr:"Yumurta (Tam)",         en:"Whole Egg",             cat:"yumurta-süt",v:[143,13,9.5,0.7,0,76,0.4,3.1,3.7,1.5,0,372,142,138,56,1.8,12,198,1.3,149,0,2,1,1.1,47,0.2]},
  {id:21,tr:"Tam Yağlı Süt",         en:"Whole Milk",            cat:"yumurta-süt",v:[61,3.2,3.3,4.8,0,88,5.1,1.9,0.8,0.2,0.1,10,43,150,113,0,11,84,0.4,46,0.9,0.1,0.1,0.5,5,0]},
  {id:22,tr:"Yoğurt (Tam Yağlı)",    en:"Full-fat Yogurt",       cat:"yumurta-süt",v:[61,3.5,3.3,4.7,0,88,4.7,2.1,0.9,0.1,0.1,13,46,141,121,0,12,95,0.6,27,0.5,0.1,0.1,0.4,7,0.1]},
  {id:23,tr:"Süzme Yoğurt",          en:"Greek Yogurt",          cat:"yumurta-süt",v:[59,10,0.4,3.6,0,81,3.2,0.1,0.1,0,0,5,36,141,110,0.1,11,135,0.5,0,0,0.1,0,0.5,8,0.1]},
  {id:24,tr:"Beyaz Peynir",          en:"Feta Cheese",           cat:"yumurta-süt",v:[264,14,21,4,0,55,4,14.9,4.6,0.6,0.5,89,1116,62,493,0.6,19,337,2.9,422,0,0.4,0.5,1.7,32,0.4]},
  {id:25,tr:"Kaşar Peyniri",         en:"Kashar Cheese",         cat:"yumurta-süt",v:[390,25,31,1.3,0,39,0.5,20,8.9,1,0.5,105,650,98,760,0.3,28,512,3.2,310,0,0.5,0.6,1.2,18,0.1]},
  {id:26,tr:"Ayran",                 en:"Ayran",                 cat:"yumurta-süt",v:[36,1.7,1.8,3,0,93,3,1.2,0.5,0.1,0,8,216,95,80,0.1,8,61,0.3,21,0.2,0.1,0,0.3,4,0]},
  {id:27,tr:"Mercimek (Pişmiş)",     en:"Cooked Lentils",        cat:"baklagil",   v:[116,9,0.4,20,7.9,70,1.8,0.1,0.1,0.2,0,0,2,369,19,3.3,36,178,1.3,8,1.5,0,0.1,0,181,0.2]},
  {id:28,tr:"Nohut (Pişmiş)",        en:"Cooked Chickpeas",      cat:"baklagil",   v:[164,8.9,2.6,27.4,7.6,60,4.8,0.3,0.6,1.2,0,0,7,291,49,2.9,48,168,1.5,27,1.3,0,0.6,0,172,0.1]},
  {id:29,tr:"Kuru Fasulye",          en:"White Beans",           cat:"baklagil",   v:[139,9.7,0.5,25,6.3,63,0.3,0.1,0,0.3,0,0,2,561,90,3.7,63,144,1,0,0,0,0.2,0,164,0.1]},
  {id:30,tr:"Domates",               en:"Tomato",                cat:"sebze",      v:[18,0.9,0.2,3.9,1.2,94,2.6,0,0,0.1,0,0,5,237,10,0.3,11,24,0.2,42,14,0,0.5,0,15,0.1]},
  {id:31,tr:"Salatalık",             en:"Cucumber",              cat:"sebze",      v:[15,0.7,0.1,3.6,0.5,95,1.7,0,0,0,0,0,2,147,16,0.3,13,24,0.2,5,2.8,0,0,0,7,0]},
  {id:32,tr:"Ispanak",               en:"Spinach",               cat:"sebze",      v:[23,2.9,0.4,3.6,2.2,91,0.4,0.1,0,0.2,0,0,79,558,99,2.7,79,49,0.5,469,28,0,2,0,194,0.2]},
  {id:33,tr:"Brokoli",               en:"Broccoli",              cat:"sebze",      v:[34,2.8,0.4,6.6,2.6,89,1.7,0.1,0,0.1,0,0,33,316,47,0.7,21,66,0.4,31,89,0,0.8,0,63,0.2]},
  {id:34,tr:"Havuç",                 en:"Carrot",                cat:"sebze",      v:[41,0.9,0.2,9.6,2.8,88,4.7,0,0,0.1,0,0,69,320,33,0.3,12,35,0.2,835,5.9,0,0.7,0,19,0.1]},
  {id:35,tr:"Kabak",                 en:"Zucchini",              cat:"sebze",      v:[17,1.2,0.3,3.1,1,95,2.5,0.1,0,0.1,0,0,8,261,16,0.4,18,38,0.3,10,17.9,0,0.1,0,24,0.2]},
  {id:36,tr:"Patates (Haşlanmış)",   en:"Boiled Potato",         cat:"sebze",      v:[87,1.9,0.1,20,1.8,77,0.9,0,0,0,0,0,5,379,5,0.3,20,40,0.3,0,7.4,0,0,0,9,0.3]},
  {id:37,tr:"Kırmızı Biber",         en:"Red Bell Pepper",       cat:"sebze",      v:[31,1,0.3,6,2.1,92,4.2,0,0,0.2,0,0,4,211,7,0.4,12,26,0.3,157,128,0,1.6,0,46,0.3]},
  {id:38,tr:"Patlıcan",              en:"Eggplant",              cat:"sebze",      v:[25,1,0.2,5.9,3,92,3.5,0,0,0.1,0,0,2,229,9,0.2,14,24,0.2,1,2.2,0,0.3,0,22,0.1]},
  {id:39,tr:"Elma",                  en:"Apple",                 cat:"meyve",      v:[52,0.3,0.2,13.8,2.4,86,10.4,0,0,0.1,0,0,1,107,6,0.1,5,11,0,3,4.6,0,0.2,0,3,0]},
  {id:40,tr:"Muz",                   en:"Banana",                cat:"meyve",      v:[89,1.1,0.3,22.8,2.6,75,12.2,0.1,0,0.1,0,0,1,358,5,0.3,27,22,0.2,3,8.7,0,0.1,0,20,0.4]},
  {id:41,tr:"Portakal",              en:"Orange",                cat:"meyve",      v:[47,0.9,0.1,11.8,2.4,87,9.4,0,0,0,0,0,0,181,40,0.1,10,14,0.1,11,53,0,0.2,0,30,0.1]},
  {id:42,tr:"Yaban Mersini",         en:"Blueberry",             cat:"meyve",      v:[57,0.7,0.3,14.5,2.4,84,9.9,0,0,0.1,0,0,1,77,6,0.3,6,12,0.2,3,9.7,0,0.6,0,6,0.1]},
  {id:43,tr:"Armut",                 en:"Pear",                  cat:"meyve",      v:[57,0.4,0.1,15.2,3.1,84,9.8,0,0,0,0,0,1,116,9,0.2,7,12,0.1,1,4.3,0,0.1,0,7,0]},
  {id:44,tr:"Kuru Kayısı",           en:"Dried Apricot",         cat:"meyve",      v:[241,3.4,0.5,62.6,7.3,31,53.4,0,0.2,0.1,0,0,10,1162,55,2.7,32,71,0.4,180,1,0,4.3,0,13,0.1]},
  {id:45,tr:"Avokado",               en:"Avocado",               cat:"meyve",      v:[160,2,14.7,8.5,6.7,73,0.7,2.1,9.8,1.8,0,0,7,485,12,0.6,29,52,0.6,7,10,0,2.1,0,81,0.3]},
  {id:46,tr:"Ceviz",                 en:"Walnut",                cat:"kuruyemiş",  v:[654,15.2,65.2,13.7,6.7,4,2.6,6.1,8.9,47.2,0,0,2,441,98,2.9,158,346,3.1,1,1.3,0,0.7,0,98,0.5]},
  {id:47,tr:"Badem",                 en:"Almond",                cat:"kuruyemiş",  v:[579,21.2,49.9,21.6,12.5,4,4.4,3.8,31.6,12.4,0,0,1,733,264,3.7,270,481,3.1,0,0,0,25.6,0,44,0.1]},
  {id:48,tr:"Fındık",                en:"Hazelnut",              cat:"kuruyemiş",  v:[628,15,60.8,16.7,9.7,5,4.3,4.5,45.6,7.9,0,0,0,680,114,4.7,163,290,2.4,1,6.3,0,15.3,0,113,0.6]},
  {id:49,tr:"Kabak Çekirdeği",       en:"Pumpkin Seeds",         cat:"kuruyemiş",  v:[559,30.2,49,10.7,6,5,1.4,8.7,16.2,20.8,0,0,7,809,46,8.8,592,1233,7.8,16,1.9,0,2.2,0,57,0.1]},
  {id:50,tr:"Keten Tohumu",          en:"Flaxseed",              cat:"kuruyemiş",  v:[534,18.3,42.2,28.9,27.3,7,1.5,3.7,7.5,28.7,0,0,30,813,255,5.7,392,642,4.3,0,0.6,0,19.9,0,87,0.5]},
  {id:51,tr:"Tahin",                 en:"Tahini",                cat:"kuruyemiş",  v:[595,17,53.8,21.2,9.3,3,0.5,7.5,20.4,23.6,0,0,115,414,426,8.9,95,701,4.6,0,0,0,0.5,0,98,0.2]},
  {id:52,tr:"Zeytinyağı",            en:"Olive Oil",             cat:"yağ",        v:[884,0,100,0,0,0,0,13.8,73,10.5,0,0,2,1,1,0.1,0,0,0,0,0,0,14.4,0,0,0]},
  {id:53,tr:"Tereyağı",              en:"Butter",                cat:"yağ",        v:[717,0.9,81.1,0.1,0,16,0.1,51.4,21,3,3.3,215,643,24,24,0,2,24,0.1,684,0,0,2.3,0.2,3,0]},
  {id:54,tr:"Pekmez",                en:"Grape Molasses",        cat:"diğer",      v:[284,0.4,0.1,74,0,22,68,0,0,0,0,0,21,370,55,2.8,18,24,0.1,0,1.4,0,0,0,0,0.1]},
  {id:55,tr:"Bal",                   en:"Honey",                 cat:"diğer",      v:[304,0.3,0,82.4,0.2,17,82.1,0,0,0,0,0,4,52,6,0.4,2,4,0.2,0,0.5,0,0,0,2,0]},
  {id:56,tr:"Humus",                 en:"Hummus",                cat:"baklagil",   v:[166,7.9,9.6,14.3,6,65,0.3,1.4,5.2,2.4,0,0,379,228,38,2.4,36,176,1.5,0,3.9,0,0.6,0,72,0.2]},
];

const COND = [
  {id:"diabetes2",tr:"Tip 2 Diyabet",en:"Type 2 Diabetes",icon:"🩸",
   ovTr:"Kan şekeri regülasyonunu desteklemek için düşük glisemik indeksli, kompleks karbonhidrat ağırlıklı, düzenli öğün saatlerine dayalı bir yaklaşım.",
   ovEn:"A low glycemic index approach with complex carbs and consistent meal timing to support blood sugar regulation.",
   resTr:["Basit/rafine şeker","Şekerli içecekler","Beyaz un ürünleri","Yüksek GI meyveler (aşırı)"],
   resEn:["Simple/refined sugar","Sugary beverages","White flour products","High-GI fruits in excess"],
   recTr:["Tam tahıllar (bulgur, yulaf, kepekli ekmek)","Lifli sebzeler","Yağsız protein kaynakları","Baklagiller","Düşük GI meyveler (elma, armut, böğürtlen)"],
   recEn:["Whole grains (bulgur, oats, whole wheat)","Fibrous vegetables","Lean protein sources","Legumes","Low-GI fruits (apple, pear, berries)"],
   avTr:["Şekerli tatlılar ve pastalar","Meyve suları","Beyaz pirinç (sık tüketim)","İşlenmiş atıştırmalıklar"],
   avEn:["Sugary desserts and pastries","Fruit juices","White rice frequently","Processed snacks"],
   mTr:{b:"2 yumurta + tam tahıllı ekmek + domates + salatalık",l:"Izgara tavuk + bulgur pilavı + yeşil salata",d:"Balık + buharda sebze + az yağlı yoğurt",s:"Bir avuç ceviz + elma"},
   mEn:{b:"2 eggs + whole grain bread + tomato + cucumber",l:"Grilled chicken + bulgur pilaf + green salad",d:"Fish + steamed vegetables + low-fat yogurt",s:"A handful of walnuts + apple"}},

  {id:"hypertension",tr:"Hipertansiyon",en:"Hypertension",icon:"❤️",
   ovTr:"DASH diyeti prensiplerine dayalı, sodyum kısıtlamalı ve potasyum/magnezyum açısından zengin bir beslenme modeli.",
   ovEn:"A sodium-restricted, potassium and magnesium-rich nutrition model based on DASH diet principles.",
   resTr:["Tuz (günde 5g altında tutulmalı)","İşlenmiş ve konserve gıdalar","Turşu ve salamura","Hazır soslar ve çorbalar"],
   resEn:["Salt (keep under 5g/day)","Processed and canned foods","Pickles and brined foods","Ready-made sauces and soups"],
   recTr:["Taze sebze ve meyveler","Az yağlı süt ürünleri","Tam tahıllar","Tuzsuz kuruyemiş","Zeytinyağı"],
   recEn:["Fresh vegetables and fruits","Low-fat dairy products","Whole grains","Unsalted nuts","Olive oil"],
   avTr:["Sucuk, salam ve sosis","Cips ve tuzlu atıştırmalıklar","Hazır çorbalar","Fast food"],
   avEn:["Cured meats and sausages","Chips and salty snacks","Instant soups","Fast food"],
   mTr:{b:"Az tuzlu beyaz peynir + domates + tam tahıllı ekmek",l:"Mercimek çorbası (tuzsuz) + ızgara tavuk + salata",d:"Fırında levrek + sebze + bulgur pilavı",s:"Tuzsuz badem + taze meyve"},
   mEn:{b:"Low-salt cheese + tomato + whole grain bread",l:"Lentil soup (no salt) + grilled chicken + salad",d:"Baked sea bass + vegetables + bulgur pilaf",s:"Unsalted almonds + fresh fruit"}},

  {id:"ckd",tr:"Kronik Böbrek Hastalığı",en:"Chronic Kidney Disease",icon:"🫘",warn:true,
   ovTr:"Protein, potasyum, fosfor ve sodyum kısıtlaması gerektiren, evreye göre kişiselleştirilmesi şart olan bir beslenme planı. Mutlaka nefroloji diyetisyeni ile çalışılmalıdır.",
   ovEn:"A nutrition plan requiring protein, potassium, phosphorus, and sodium restriction, personalized by disease stage. Must work with a nephrology dietitian.",
   resTr:["Yüksek potasyumlu gıdalar (muz, kuru meyve, patates)","Yüksek fosforlu gıdalar (süt ürünleri, kuruyemiş)","Aşırı protein tüketimi","Tuz ve sodyumlu gıdalar"],
   resEn:["High-potassium foods (banana, dried fruit, potato)","High-phosphorus foods (dairy, nuts)","Excess protein intake","Salt and sodium-rich foods"],
   recTr:["Kontrollü porsiyonlarda kaliteli protein","Düşük potasyumlu sebzeler (lahana, karnabahar)","Beyaz ekmek (evreye göre)","Bitkisel yağlar"],
   recEn:["Quality protein in controlled portions","Low-potassium vegetables (cabbage, cauliflower)","White bread (stage-dependent)","Plant-based oils"],
   avTr:["Muz, kayısı ve kuru üzüm","Tam tahıllı ürünler (ileri evrede)","İşlenmiş et ürünleri","Kola ve koyu içecekler (fosfor içerir)"],
   avEn:["Banana, apricot, and raisins","Whole grain products (advanced stage)","Processed meat products","Cola and dark beverages (contain phosphorus)"],
   mTr:{b:"Haşlanmış yumurta + beyaz ekmek + salatalık",l:"Kontrollü porsiyon tavuk + beyaz pirinç + haşlanmış sebze",d:"Az protein + beyaz pirinç + az yağlı salata",s:"Elma dilimleri"},
   mEn:{b:"Boiled egg + white bread + cucumber",l:"Controlled portion chicken + white rice + boiled vegetables",d:"Low protein + white rice + light salad",s:"Apple slices"}},

  {id:"celiac",tr:"Çölyak Hastalığı",en:"Celiac Disease",icon:"🌾",
   ovTr:"Glütensiz yaşam zorunludur. Buğday, arpa, çavdar ve türevleri tamamen diyetten çıkarılmalıdır. Çapraz bulaşmaya dikkat edilmelidir.",
   ovEn:"A strict gluten-free lifestyle is mandatory. Wheat, barley, rye, and their derivatives must be eliminated. Cross-contamination must be avoided.",
   resTr:["Buğday, arpa ve çavdar içeren tüm ürünler","Normal ekmek, makarna ve bulgur","Bira ve malt içecekleri","Gizli gluten içeren işlenmiş gıdalar"],
   resEn:["All products containing wheat, barley, or rye","Regular bread, pasta, and bulgur","Beer and malt beverages","Processed foods with hidden gluten"],
   recTr:["Pirinç, mısır ve kinoa","Glütensiz etiketli ürünler","Taze et, balık, sebze ve meyve","Baklagiller (doğal halinde)","Yumurta ve süt ürünleri"],
   recEn:["Rice, corn, and quinoa","Certified gluten-free products","Fresh meat, fish, vegetables, and fruit","Legumes (natural form)","Eggs and dairy products"],
   avTr:["Normal undan yapılan her şey","Soya sosu (çoğu marka gluten içerir)","İşlenmiş et ürünleri (gluten katkılı)","Malt şurubu içeren ürünler"],
   avEn:["Anything made with regular flour","Soy sauce (most brands contain gluten)","Processed meats with gluten additives","Products containing malt syrup"],
   mTr:{b:"Scrambled yumurta + pirinç unu ekmeği + beyaz peynir",l:"Izgara et + pirinç pilavı + mevsim salatası",d:"Fırında balık + kinoa + sebze",s:"Taze meyve + glütensiz kraker"},
   mEn:{b:"Scrambled eggs + rice flour bread + feta cheese",l:"Grilled meat + rice pilaf + seasonal salad",d:"Baked fish + quinoa + vegetables",s:"Fresh fruit + gluten-free crackers"}},

  {id:"pcos",tr:"PKOS (Polikistik Over Sendromu)",en:"PCOS",icon:"🌸",
   ovTr:"İnsülin direncini azaltmaya odaklı, düşük glisemik yüklü, anti-inflamatuar bir beslenme yaklaşımı. Kilo yönetimi ve hormonal denge desteklenmelidir.",
   ovEn:"An anti-inflammatory, low glycemic load approach focused on reducing insulin resistance. Weight management and hormonal balance should be supported.",
   resTr:["Rafine şeker ve şekerli ürünler","İşlenmiş karbonhidratlar","Trans yağlar ve margarin","Aşırı kafein tüketimi"],
   resEn:["Refined sugar and sugary products","Processed carbohydrates","Trans fats and margarine","Excess caffeine consumption"],
   recTr:["Yüksek lifli gıdalar","Omega-3 kaynakları (somon, keten tohumu, ceviz)","Tarçın (insülin duyarlılığını artırır)","Yeşil yapraklı sebzeler","Kaliteli protein kaynakları"],
   recEn:["High-fiber foods","Omega-3 sources (salmon, flaxseed, walnuts)","Cinnamon (improves insulin sensitivity)","Leafy green vegetables","Quality protein sources"],
   avTr:["Şekerli atıştırmalıklar ve içecekler","Beyaz ekmek ve beyaz pirinç","Kızartılmış gıdalar","Fast food ve işlenmiş ürünler"],
   avEn:["Sugary snacks and drinks","White bread and white rice","Fried foods","Fast food and processed products"],
   mTr:{b:"Yulaf ezmesi + tarçın + ceviz + yaban mersini",l:"Izgara somon + kinoa + brokoli",d:"Tavuk + bol sebze + zeytinyağı + tam tahıllı ekmek",s:"Keten tohumlu süzme yoğurt"},
   mEn:{b:"Oatmeal + cinnamon + walnuts + blueberries",l:"Grilled salmon + quinoa + broccoli",d:"Chicken + plenty of vegetables + olive oil + whole grain bread",s:"Greek yogurt with flaxseed"}},

  {id:"ibs",tr:"İrritabl Bağırsak Sendromu (IBS)",en:"IBS",icon:"🌀",
   ovTr:"Düşük FODMAP yaklaşımıyla sindirim semptomlarını azaltmayı hedefleyen, kademeli eliminasyon ve yeniden giriş temelli plan. Bireysel tetikleyiciler belirlenmeli.",
   ovEn:"A low-FODMAP plan using gradual elimination and reintroduction to reduce digestive symptoms. Individual triggers should be identified.",
   resTr:["Soğan ve sarımsak (yüksek FODMAP)","Buğday ürünleri (yüksek miktarda)","Laktoz intoleransı varsa süt ürünleri","Yapay tatlandırıcılar (sorbitol, maltitol)"],
   resEn:["Onion and garlic (high FODMAP)","Wheat products in large amounts","Dairy if lactose intolerant","Artificial sweeteners (sorbitol, maltitol)"],
   recTr:["Düşük FODMAP sebzeler (havuç, kabak, salatalık)","Laktozsuz süt ürünleri","Yulaf ezmesi","Yağsız protein kaynakları","Pirinç ve patates"],
   recEn:["Low-FODMAP vegetables (carrot, zucchini, cucumber)","Lactose-free dairy products","Oatmeal","Lean protein sources","Rice and potato"],
   avTr:["Baklagiller (aşırı miktarda)","Elma ve armut (aşırı)","Gazlı ve karbonatlı içecekler","Şekersiz sakız (sorbitol içerir)"],
   avEn:["Legumes in excess","Apple and pear in excess","Carbonated drinks","Sugar-free gum (contains sorbitol)"],
   mTr:{b:"Yulaf ezmesi + laktozsuz süt + muz",l:"Izgara tavuk + beyaz pirinç + haşlanmış havuç",d:"Balık + kabak + haşlanmış patates",s:"Laktozsuz yoğurt"},
   mEn:{b:"Oatmeal + lactose-free milk + banana",l:"Grilled chicken + white rice + boiled carrot",d:"Fish + zucchini + boiled potato",s:"Lactose-free yogurt"}},

  {id:"obesity",tr:"Obezite",en:"Obesity",icon:"⚖️",
   ovTr:"Sürdürülebilir kilo kaybı için enerji kısıtlı, yüksek protein ve lif içerikli, doygunluğu artıran bir beslenme planı. Açlık hissi minimize edilmeli, yavaş ve kalıcı değişim hedeflenmeli.",
   ovEn:"An energy-restricted, high-protein and high-fiber plan to promote satiety and sustainable weight loss. Hunger should be minimized; slow and permanent change should be targeted.",
   resTr:["Yüksek kalorili işlenmiş gıdalar","Şekerli içecekler ve alkol","Yağlı fast food","Aşırı porsiyon tüketimi"],
   resEn:["High-calorie processed foods","Sugary drinks and alcohol","High-fat fast food","Oversized portion consumption"],
   recTr:["Yüksek protein (tavuk, balık, baklagil, yumurta)","Bol sebze ve yeşillik","Tam tahıllar","Düşük kalorili hacimli gıdalar","Su, bitkisel çay"],
   recEn:["High protein (chicken, fish, legumes, eggs)","Plenty of vegetables and greens","Whole grains","Low-calorie high-volume foods","Water, herbal tea"],
   avTr:["Asitli ve şekerli içecekler","Cips, kraker ve bisküvi","Hazır yemekler","Kızartılmış gıdalar"],
   avEn:["Sugary and acidic drinks","Chips, crackers, and biscuits","Ready meals","Fried foods"],
   mTr:{b:"3 yumurta (haşlama/omlet) + domates + salatalık + 1 dilim tam tahıllı ekmek",l:"Izgara tavuk göğsü + bol yeşil salata + az zeytinyağı",d:"Buharda brokoli + az bulgur veya pilav + yoğurt",s:"1 avuç badem veya havuç çubukları"},
   mEn:{b:"3 eggs (boiled/omelet) + tomato + cucumber + 1 slice whole grain bread",l:"Grilled chicken breast + big green salad + a little olive oil",d:"Steamed broccoli + small bulgur or rice + yogurt",s:"A handful of almonds or carrot sticks"}},

  {id:"anemia",tr:"Demir Eksikliği Anemisi",en:"Iron Deficiency Anemia",icon:"🩺",
   ovTr:"Demir emilimini artırmak için C vitamini ile birlikte demir açısından zengin gıdaların tüketimine odaklanan beslenme planı. Emilimi engelleyen faktörler minimize edilmelidir.",
   ovEn:"A nutrition plan focused on consuming iron-rich foods with vitamin C to enhance absorption. Factors that inhibit absorption should be minimized.",
   resTr:["Demir zengini öğünlerle birlikte çay/kahve","Kalsiyum takviyeleri öğün saatlerinde","İşlenmemiş kepek (aşırı tüketim)"],
   resEn:["Tea/coffee with iron-rich meals","Calcium supplements at meal times","Unprocessed bran in excess"],
   recTr:["Kırmızı et, tavuk ve hindi","Yeşil yapraklı sebzeler (ıspanak, pazı, roka)","Baklagiller (mercimek, nohut, kuru fasulye)","C vitamini kaynakları (limon, portakal, kırmızı biber)","Kabak çekirdeği ve pekmez"],
   recEn:["Red meat, chicken, and turkey","Leafy greens (spinach, chard, arugula)","Legumes (lentils, chickpeas, white beans)","Vitamin C sources (lemon, orange, red pepper)","Pumpkin seeds and grape molasses"],
   avTr:["Öğünle birlikte çay veya kahve içmek","Fazla işlenmiş ve rafine gıdalar","Kola ve fosfatlı içecekler"],
   avEn:["Drinking tea or coffee with meals","Heavily processed and refined foods","Cola and phosphate-rich beverages"],
   mTr:{b:"2 yumurta + pekmez + portakal suyu + tam tahıllı ekmek",l:"Kıymalı mercimek çorbası + taze limon + ıspanak salatası",d:"Sote ıspanak + az kırmızı et + pilav",s:"Kuru kayısı + portakal"},
   mEn:{b:"2 eggs + molasses + orange juice + whole grain bread",l:"Minced meat lentil soup + fresh lemon + spinach salad",d:"Sautéed spinach + small portion red meat + rice pilaf",s:"Dried apricots + orange"}},

  {id:"gout",tr:"Gut Hastalığı",en:"Gout",icon:"🦵",
   ovTr:"Ürik asit seviyelerini düşürmeye yönelik, pürin açısından kısıtlı ve bol sıvı tüketimine dayalı bir beslenme planı. Akut atak döneminde kısıtlamalar daha sıkı tutulmalıdır.",
   ovEn:"A purine-restricted, high-fluid nutrition plan to lower uric acid levels. Restrictions should be stricter during acute attack periods.",
   resTr:["Sakatat (ciğer, böbrek, beyin)","Deniz ürünleri (midye, hamsi, sardalye)","Alkol (özellikle bira)","Fruktoz ve yüksek şekerli gıdalar"],
   resEn:["Organ meats (liver, kidney, brain)","Seafood (mussels, anchovies, sardines)","Alcohol (especially beer)","Fructose and high-sugar foods"],
   recTr:["Bol su (günde en az 2-3 litre)","Düşük yağlı süt ürünleri","Sebzeler (çoğu düşük pürin)","Yulaf, pirinç ve bulgur","Kiraz ve vişne (ürik asit düşürücü etkisi var)"],
   recEn:["Plenty of water (at least 2-3 liters/day)","Low-fat dairy products","Vegetables (most are low in purines)","Oats, rice, and bulgur","Cherries and sour cherries (uric acid-lowering effect)"],
   avTr:["Kırmızı et (aşırı tüketim)","Alkollü içecekler","Şekerli meşrubatlar ve meyve suyu","Sakatat her türlüsü"],
   avEn:["Red meat in excess","Alcoholic beverages","Sugary soft drinks and fruit juice","All types of organ meat"],
   mTr:{b:"Yulaf ezmesi + az yağlı yoğurt + meyve",l:"Izgara tavuk + beyaz pirinç + bol yeşil salata",d:"Sebze çorbası + beyaz peynirli tam tahıllı ekmek",s:"Kiraz veya vişne + bol su"},
   mEn:{b:"Oatmeal + low-fat yogurt + fruit",l:"Grilled chicken + white rice + plenty of green salad",d:"Vegetable soup + whole grain bread with cheese",s:"Cherries or sour cherries + plenty of water"}},

  {id:"osteoporosis",tr:"Osteoporoz",en:"Osteoporosis",icon:"🦴",
   ovTr:"Kemik yoğunluğunu korumak ve artırmak için kalsiyum, D vitamini ve K vitamini açısından zengin, asit yükü düşük bir beslenme planı. Egzersiz ile desteklenmelidir.",
   ovEn:"A calcium, vitamin D and vitamin K-rich, low acid-load nutrition plan to maintain and improve bone density. Should be supported with exercise.",
   resTr:["Aşırı kafein tüketimi (kemikten kalsiyum çıkarır)","Aşırı tuz tüketimi","Alkol","Yüksek fosforlu içecekler (kola)"],
   resEn:["Excess caffeine (leaches calcium from bones)","Excess salt","Alcohol","High-phosphorus beverages (cola)"],
   recTr:["Süt, yoğurt ve peynir (kalsiyum kaynağı)","Yeşil yapraklı sebzeler (K vitamini kaynağı)","Somon ve sardalye (D vitamini + kalsiyum)","Soya ürünleri ve tofu","Susam, tahin ve chia tohumu"],
   recEn:["Milk, yogurt, and cheese (calcium source)","Leafy green vegetables (vitamin K source)","Salmon and sardines (vitamin D + calcium)","Soy products and tofu","Sesame, tahini, and chia seeds"],
   avTr:["Aşırı kahve ve çay (günde 3'ten fazla)","Aşırı tuzlu gıdalar","Alkollü içecekler","Kola ve fosforik asitli içecekler"],
   avEn:["Excess coffee and tea (more than 3 cups/day)","Overly salty foods","Alcoholic beverages","Cola and phosphoric acid-containing drinks"],
   mTr:{b:"Süzme yoğurt + tahin + taze meyve + kepekli ekmek",l:"Fırında somon + brokoli + az yağlı beyaz peynir + salata",d:"Az yağlı peynirli omlet + ıspanak + tam tahıllı ekmek",s:"Susam ezmesi + ayran"},
   mEn:{b:"Strained yogurt + tahini + fresh fruit + whole grain bread",l:"Baked salmon + broccoli + low-fat cheese + salad",d:"Low-fat cheese omelet + spinach + whole grain bread",s:"Sesame paste + ayran (yogurt drink)"}},

  {id:"hypothyroid",tr:"Hipotiroidizm",en:"Hypothyroidism",icon:"🦋",
   ovTr:"Tiroid fonksiyonunu desteklemek için iyot, selenyum ve çinko açısından zengin, metabolizmayı destekleyen bir beslenme planı. Guatrojenik gıdalar pişirilerek tüketilmelidir.",
   ovEn:"A nutrition plan rich in iodine, selenium, and zinc to support thyroid function and metabolism. Goitrogenic foods should be consumed cooked.",
   resTr:["Ham lahana, karnabahar ve brokoli (çiğ halde aşırı)","Aşırı soya ürünleri","İşlenmiş ve hazır gıdalar","Aşırı gluten (eşzamanlı çölyak varsa)"],
   resEn:["Raw cabbage, cauliflower, and broccoli in excess","Excessive soy products","Processed and ready-made foods","Excess gluten if concurrent celiac"],
   recTr:["Deniz ürünleri ve iyotlu tuz (iyot kaynağı)","Yumurta","Brezilya fındığı (günde 2-3 adet, selenyum)","Et ve kümes hayvanları","Tam tahıllar ve baklagiller"],
   recEn:["Seafood and iodized salt (iodine source)","Eggs","Brazil nuts (2-3 per day for selenium)","Meat and poultry","Whole grains and legumes"],
   avTr:["İşlenmiş ve hazır gıdalar","Aşırı karbonhidrat ve şeker","Soya sütü veya tofu (aşırı tüketim)","Alkol"],
   avEn:["Processed and ready-made foods","Excess carbohydrates and sugar","Soy milk or tofu in excess","Alcohol"],
   mTr:{b:"2 yumurta + kaşar peyniri + tam tahıllı ekmek + domates",l:"Balık (levrek veya somon) + pişmiş brokoli + pirinç",d:"Tavuk + mercimek + sebze",s:"Brezilya fındığı (2-3 adet) + portakal"},
   mEn:{b:"2 eggs + kashar cheese + whole grain bread + tomato",l:"Fish (sea bass or salmon) + cooked broccoli + rice",d:"Chicken + lentils + vegetables",s:"Brazil nuts (2-3 pieces) + orange"}},

  {id:"reflux",tr:"Gastroözofageal Reflü (GERD)",en:"GERD / Acid Reflux",icon:"🔥",
   ovTr:"Asit reflüsünü azaltmak için düşük asitli, az yağlı ve küçük öğünlere dayalı bir beslenme planı. Yemek sonrası yatmaktan kaçınılmalı, baş yukarıda uyunmalıdır.",
   ovEn:"A low-acid, low-fat plan based on small meals to reduce acid reflux. Avoid lying down after meals; sleep with head elevated.",
   resTr:["Asitli meyveler (portakal, limon, domates)","Kafein, kahve ve çay","Alkol","Yağlı ve kızartılmış yiyecekler","Baharat, acı ve nane"],
   resEn:["Acidic fruits (orange, lemon, tomato)","Caffeine, coffee, and tea","Alcohol","Fatty and fried foods","Spices, spicy foods, and mint"],
   recTr:["Muz, elma ve armut","Yulaf ezmesi ve tam tahıllar","Az yağlı protein (tavuk göğsü, balık)","Zencefil (az miktarda)","Haşlanmış veya buharda pişmiş sebzeler"],
   recEn:["Banana, apple, and pear","Oatmeal and whole grains","Low-fat protein (chicken breast, fish)","Ginger in small amounts","Boiled or steamed vegetables"],
   avTr:["Domates ve domates sosları","Kahve, çay ve gazlı içecekler","Çikolata ve nane","Kızartmalar ve yağlı yiyecekler","Gece geç saatlerde yemek"],
   avEn:["Tomatoes and tomato sauces","Coffee, tea, and carbonated drinks","Chocolate and mint","Fried and fatty foods","Eating late at night"],
   mTr:{b:"Yulaf ezmesi + muz + az yağlı süt",l:"Haşlanmış tavuk göğsü + beyaz pirinç + buharda havuç",d:"Balık + patates püresi + haşlanmış kabak",s:"Elma veya armut + az yağlı yoğurt"},
   mEn:{b:"Oatmeal + banana + low-fat milk",l:"Boiled chicken breast + white rice + steamed carrots",d:"Fish + mashed potato + steamed zucchini",s:"Apple or pear + low-fat yogurt"}},
];

const STR = {
  tr:{
    appName:"NutriBase",
    nav:{calc:"Hesap Makinesi",food:"Besin Ara",track:"Takip",clients:"Danışanlar",templates:"Hastalık Şablonları",upgrade:"Pro'ya Geç"},
    hero:{eyebrow:"Kalori · Su · Makro · Klinik Şablonlar",title:"Beslenme bilimini herkes için netleştir",sub:"Bireyler için doğru hesaplama, diyetisyenler için klinik düzeyde araçlar — tek uygulamada.",ctaFree:"Ücretsiz Başla",ctaPro:"Diyetisyen misiniz?"},
    stats:{t1:"Hastalık Şablonu",t2:"Dil Desteği",t3:"Besin Kaydı",t4:"Ücretsiz Erişim"},
    hiw:{title:"Nasıl Çalışır?",s1t:"Bilgilerini Gir",s1d:"Yaş, kilo, boy ve aktivite düzeyini gir.",s2t:"Anında Hesapla",s2d:"BMR, TDEE, BMİ, su ve makrolarını saniyeler içinde gör.",s3t:"Takip Et & İlerle",s3d:"Günlük kayıtlarınla ilerlemeni izle; diyetisyensen danışanlarını yönet."},
    calc:{title:"Günlük İhtiyaç Hesaplama",sub:"Bilgilerini gir, BMR, TDEE, BMİ, su ve makro ihtiyacını hemen gör.",gender:"Cinsiyet",male:"Erkek",female:"Kadın",age:"Yaş",height:"Boy (cm)",weight:"Kilo (kg)",activity:"Aktivite Düzeyi",act:["Hareketsiz (masa başı, spor yok)","Hafif aktif (haftada 1-3 gün)","Orta aktif (haftada 3-5 gün)","Çok aktif (haftada 6-7 gün)","Üst düzey aktif (ağır iş + günlük spor)"],goal:"Hedef",goalLose:"Kilo Vermek",goalMaintain:"Kiloyu Korumak",goalGain:"Kilo Almak",calculate:"Hesapla",results:"Sonuçların",bmr:"Bazal Metabolizma (BMR)",bmrD:"Vücudunun dinlenirken yaktığı enerji",tdee:"Toplam İhtiyaç (TDEE)",tdeeD:"Aktivite dahil günlük toplam kalori",target:"Hedef Kalori",targetD:"Hedefine göre önerilen günlük alım",water:"Su İhtiyacı",waterD:"Günlük önerilen su tüketimi",bmi:"Vücut Kitle İndeksi (BMİ)",bmiD:"Boy ve kilona göre ağırlık kategorisi",macros:"Makro Dağılımı",protein:"Protein",carbs:"Karbonhidrat",fat:"Yağ",kcal:"kcal",liters:"litre",bmiUnder:"Zayıf",bmiNormal:"Normal",bmiOver:"Fazla Kilolu",bmiObese:"Obez",disclaimer:"Bu hesaplamalar genel formüllere dayanır ve bireysel tıbbi tavsiye yerine geçmez.",saveEntry:"Bugüne Kaydet",saved:"Kaydedildi!"},
    food:{title:"Besin Arama",sub:"Besin adı yazın, miktarını girin — 26 besin değerini görün.",ph:"Besin adı yazın (örn: yumurta, tavuk, elma...)",amount:"Miktar (gram)",impN:"Önemli Değerler",allN:"Tüm 26 Değer (PRO)",showAll:"↓ Tümünü Gör",showLess:"↑ Az Göster",src:"Kaynak: TurKomp + USDA veritabanları",notFound:"Besin bulunamadı. Farklı bir kelime deneyin.",selPrompt:"Soldan bir besin seçin",cats:{tahıl:"Tahıllar",et:"Etler",balık:"Balıklar","yumurta-süt":"Yumurta & Süt Ürünleri",baklagil:"Baklagiller",sebze:"Sebzeler",meyve:"Meyveler",kuruyemiş:"Kuruyemiş & Tohumlar",yağ:"Yağlar",diğer:"Diğer"}},
    track:{title:"Günlük Takip",sub:"Kayıtlı hesaplamalarını ve ilerlemeni gör.",empty:"Henüz kayıt yok. Hesap makinesinden hesaplama yapıp kaydet.",date:"Tarih",weight:"Kilo",target:"Hedef Kalori",water:"Su",trend:"Kilo Değişimi"},
    upsell:{title:"Bu özellik Pro'da",sub:"Danışan yönetimi ve hastalık şablonları yalnızca Pro pakette bulunur.",cta:"Pro'yu İncele"},
    pro:{badge:"DİYETİSYEN PRO",title:"Klinik pratiğin için tasarlandı",sub:"Danışan kayıtları, hastalık bazlı diyet şablonları ve klinik notlar — hepsi tek yerde.",f1:"Sınırsız danışan kaydı ve geçmiş takibi",f2:"12 hastalık için hazır diyet şablonu kütüphanesi",f3:"Şablonları danışana özel düzenleyip dışa aktarma",f4:"Danışan başına 26 besin değeri klinik takibi",pM:"Aylık",pY:"Yıllık (2 ay bedava)",demo:"Demo Aboneliği Başlat",demoNote:"Bu bir demo akışıdır — gerçek ödeme alınmaz.",cardNum:"Kart Numarası",expiry:"SK/YY",cvc:"CVC",cardName:"Kart Üzerindeki İsim",confirm:"Aboneliği Onayla",proc:"İşleniyor...",success:"Pro'ya hoş geldin!",successSub:"Artık tüm klinik araçlara erişimin var.",goApp:"Panele Git"},
    clients:{title:"Danışanlarım",add:"Yeni Danışan",search:"Danışan ara...",empty:"Henüz danışan eklenmedi.",nameL:"Ad Soyad / Kod",age:"Yaş",gender:"Cinsiyet",height:"Boy",weight:"Güncel Kilo",condition:"Sağlık Durumu",condNone:"Özel durum yok",notes:"Klinik Notlar",save:"Kaydet",cancel:"Vazgeç",view:"Profili Gör",newM:"Yeni Ölçüm Ekle",newN:"Besin Değeri Girişi",hist:"Ölçüm Geçmişi",nutriHist:"Besin Değeri Geçmişi",privacy:"Gizlilik için gerçek kimlik yerine rumuz veya danışan kodu kullanmanız önerilir.",confirmDel:"Bu danışanı ve tüm kayıtlarını silmek istediğine emin misin?"},
    tpl:{title:"Hastalık Diyet Şablonları",sub:"Klinik referans amaçlıdır. Danışana özel olarak düzenleyip onaylamalısın.",use:"Şablonu İncele",overview:"Genel Bakış",res:"Kısıtlamalar",rec:"Önerilen Gıdalar",avoid:"Kaçınılması Gerekenler",menu:"Örnek Günlük Menü",b:"Kahvaltı",l:"Öğle",d:"Akşam",s:"Ara Öğün",note:"Bu şablon genel klinik kılavuzlara dayanır; ilaç etkileşimleri ve bireysel laboratuvar değerleri mutlaka dikkate alınmalıdır.",back:"Listeye Dön",print:"Yazdır / PDF"},
    footer:{desc:"Bireyler için beslenme hesaplamaları, diyetisyenler için klinik takip araçları.",links:"Bağlantılar",rights:"Tüm hakları saklıdır.",disc:"Bu uygulama tıbbi tavsiye vermez."},
    common:{back:"Geri"},
  },
  en:{
    appName:"NutriBase",
    nav:{calc:"Calculator",food:"Food Search",track:"Tracking",clients:"Clients",templates:"Condition Templates",upgrade:"Upgrade to Pro"},
    hero:{eyebrow:"Calories · Water · Macros · Clinical Templates",title:"Make nutrition science clear for everyone",sub:"Accurate calculations for individuals, clinical-grade tools for dietitians — in one app.",ctaFree:"Start Free",ctaPro:"Are you a dietitian?"},
    stats:{t1:"Condition Templates",t2:"Languages",t3:"Food Records",t4:"Free Access"},
    hiw:{title:"How It Works",s1t:"Enter Your Details",s1d:"Enter your age, weight, height and activity level.",s2t:"Calculate Instantly",s2d:"See your BMR, TDEE, BMI, water and macro needs in seconds.",s3t:"Track & Progress",s3d:"Monitor your progress with daily logs; manage clients if you're a dietitian."},
    calc:{title:"Daily Needs Calculator",sub:"Enter your details to see your BMR, TDEE, BMI, water and macro needs instantly.",gender:"Gender",male:"Male",female:"Female",age:"Age",height:"Height (cm)",weight:"Weight (kg)",activity:"Activity Level",act:["Sedentary (desk job, no exercise)","Lightly active (1-3 days/week)","Moderately active (3-5 days/week)","Very active (6-7 days/week)","Extremely active (physical job + daily training)"],goal:"Goal",goalLose:"Lose Weight",goalMaintain:"Maintain Weight",goalGain:"Gain Weight",calculate:"Calculate",results:"Your Results",bmr:"Basal Metabolic Rate (BMR)",bmrD:"Energy your body burns at rest",tdee:"Total Daily Energy (TDEE)",tdeeD:"Total daily calories including activity",target:"Target Calories",targetD:"Recommended daily intake for your goal",water:"Water Needs",waterD:"Recommended daily water intake",bmi:"Body Mass Index (BMI)",bmiD:"Body weight category based on height and weight",macros:"Macro Breakdown",protein:"Protein",carbs:"Carbs",fat:"Fat",kcal:"kcal",liters:"liters",bmiUnder:"Underweight",bmiNormal:"Normal",bmiOver:"Overweight",bmiObese:"Obese",disclaimer:"These calculations use general formulas and are not a substitute for individual medical advice.",saveEntry:"Save to Today",saved:"Saved!"},
    food:{title:"Food Search",sub:"Type a food name, enter the amount — see 26 nutritional values.",ph:"Type food name (e.g. egg, chicken, apple...)",amount:"Amount (grams)",impN:"Key Nutrients",allN:"All 26 Nutrients (PRO)",showAll:"↓ Show All",showLess:"↑ Show Less",src:"Source: TurKomp + USDA databases",notFound:"Food not found. Try a different word.",selPrompt:"Select a food on the left",cats:{tahıl:"Grains",et:"Meat",balık:"Fish","yumurta-süt":"Eggs & Dairy",baklagil:"Legumes",sebze:"Vegetables",meyve:"Fruits",kuruyemiş:"Nuts & Seeds",yağ:"Oils",diğer:"Other"}},
    track:{title:"Daily Tracking",sub:"View your saved calculations and progress.",empty:"No entries yet. Run a calculation and save it.",date:"Date",weight:"Weight",target:"Target Cal",water:"Water",trend:"Weight Trend"},
    upsell:{title:"This feature is Pro",sub:"Client management and condition templates are available only in the Pro plan.",cta:"See Pro"},
    pro:{badge:"DIETITIAN PRO",title:"Built for your clinical practice",sub:"Client records, condition-based diet templates, and clinical notes — all in one place.",f1:"Unlimited client records and history tracking",f2:"Ready-made diet template library for 12 conditions",f3:"Customize templates per client and export them",f4:"26-value clinical nutrition tracking per client",pM:"Monthly",pY:"Yearly (2 months free)",demo:"Start Demo Subscription",demoNote:"This is a demo flow — no real payment is taken.",cardNum:"Card Number",expiry:"MM/YY",cvc:"CVC",cardName:"Name on Card",confirm:"Confirm Subscription",proc:"Processing...",success:"Welcome to Pro!",successSub:"You now have access to all clinical tools.",goApp:"Go to Dashboard"},
    clients:{title:"My Clients",add:"New Client",search:"Search clients...",empty:"No clients added yet.",nameL:"Name / Code",age:"Age",gender:"Gender",height:"Height",weight:"Current Weight",condition:"Health Condition",condNone:"No specific condition",notes:"Clinical Notes",save:"Save",cancel:"Cancel",view:"View Profile",newM:"Add Measurement",newN:"Add Nutrition Entry",hist:"Measurement History",nutriHist:"Nutrition History",privacy:"For privacy, use a pseudonym or client code instead of a real name.",confirmDel:"Are you sure you want to delete this client and all their records?"},
    tpl:{title:"Condition Diet Templates",sub:"For clinical reference only. You must customize and approve for each client.",use:"View Template",overview:"Overview",res:"Restrictions",rec:"Recommended Foods",avoid:"Foods to Avoid",menu:"Sample Daily Menu",b:"Breakfast",l:"Lunch",d:"Dinner",s:"Snack",note:"This template is based on general clinical guidelines; medication interactions and individual lab values must always be considered.",back:"Back to List",print:"Print / PDF"},
    footer:{desc:"Nutrition calculations for individuals, clinical tracking tools for dietitians.",links:"Links",rights:"All rights reserved.",disc:"This app does not provide medical advice."},
    common:{back:"Back"},
  },
};

const LS="nb:";
const sg=async k=>{try{const r=localStorage.getItem(LS+k);return r?JSON.parse(r):null;}catch{return null;}};
const ss=async(k,v)=>{try{localStorage.setItem(LS+k,JSON.stringify(v));return true;}catch{return false;}};
const sd=async k=>{try{localStorage.removeItem(LS+k);return true;}catch{return false;}};
const sl=async p=>{try{const ks=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(LS+p))ks.push(k.slice(LS.length));}return ks;}catch{return[];}};

function calcBMR({gender,age,height,weight}){const b=10*weight+6.25*height-5*age;return gender==="male"?b+5:b-161;}
const ACT=[1.2,1.375,1.55,1.725,1.9];
function calcAll({gender,age,height,weight,actIdx,goal}){
  const bmr=calcBMR({gender,age:+age,height:+height,weight:+weight});
  const tdee=bmr*ACT[actIdx];
  let target=tdee;
  if(goal==="lose")target=tdee-400;
  if(goal==="gain")target=tdee+300;
  const h=+height/100;
  return{bmr:Math.round(bmr),tdee:Math.round(tdee),target:Math.round(target),water:(+weight*0.035).toFixed(1),protein:Math.round((target*0.30)/4),carbs:Math.round((target*0.40)/4),fat:Math.round((target*0.30)/9),bmi:(+weight/(h*h)).toFixed(1)};
}
function bmiCat(bmi,t){const v=parseFloat(bmi);if(v<18.5)return{l:t.calc.bmiUnder,col:"#3B82F6"};if(v<25)return{l:t.calc.bmiNormal,col:C.sage};if(v<30)return{l:t.calc.bmiOver,col:C.gold};return{l:t.calc.bmiObese,col:C.coral};}

function Logo({sz=28}){return<svg width={sz} height={sz} viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke={C.ink} strokeWidth="1.5"/><path d="M13 26V14L27 26V14" stroke={C.coral} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function Spin(){return<div style={{display:"flex",justifyContent:"center",padding:40}}><div style={{width:28,height:28,borderRadius:"50%",border:`3px solid ${C.line}`,borderTopColor:C.coral,animation:"nbsp 0.7s linear infinite"}}/><style>{"@keyframes nbsp{to{transform:rotate(360deg)}}"}</style></div>;}
function PBadge({sm}){return<span style={{display:"inline-flex",alignItems:"center",gap:4,background:C.gold,color:"#3A2D0A",fontSize:sm?10:11,fontWeight:800,padding:sm?"2px 7px":"3px 9px",borderRadius:20}}><Crown size={sm?10:12}/> PRO</span>;}
const iSt={width:"100%",padding:"12px 14px",fontSize:16,borderRadius:8,border:`1.5px solid ${C.line}`,background:C.paper,color:C.ink,outline:"none",fontFamily:"inherit",boxSizing:"border-box"};
function TIn(p){const[f,sF]=useState(false);return<input {...p} onFocus={e=>{sF(true);p.onFocus?.(e);}} onBlur={e=>{sF(false);p.onBlur?.(e);}} style={{...iSt,borderColor:f?C.coral:C.line,...(p.style||{})}}/>;}
function Fld({label,children}){return<label style={{display:"block",marginBottom:18}}><span style={{display:"block",fontSize:12,letterSpacing:"0.06em",textTransform:"uppercase",color:C.ink,opacity:0.55,marginBottom:7,fontWeight:600}}>{label}</span>{children}</label>;}
function SegBtn({opts,val,onChg}){return<div style={{display:"flex",gap:8}}>{opts.map(o=><button key={o.v} type="button" onClick={()=>onChg(o.v)} style={{flex:1,padding:"11px 10px",borderRadius:8,fontSize:14,fontWeight:600,border:`1.5px solid ${val===o.v?C.ink:C.line}`,background:val===o.v?C.ink:C.paper,color:val===o.v?C.paper:C.ink,cursor:"pointer"}}>{o.l}</button>)}</div>;}
function Sel({val,onChg,opts}){return<select value={val} onChange={e=>onChg(Number(e.target.value))} style={{...iSt,cursor:"pointer",appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230E2A3D' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center"}}>{opts.map((o,i)=><option key={i} value={i}>{o}</option>)}</select>;}
function Btn({ch,onClick,vr="primary",st={},tp="button",dis}){const b={padding:"13px 24px",borderRadius:9,fontSize:15,fontWeight:600,cursor:dis?"not-allowed":"pointer",border:"none",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"inherit",transition:"all 0.15s",opacity:dis?0.5:1};const vs={primary:{background:C.ink,color:C.paper},coral:{background:C.coral,color:"#fff"},ghost:{background:"transparent",color:C.ink,border:`1.5px solid ${C.line}`}};return<button type={tp} onClick={onClick} disabled={dis} style={{...b,...vs[vr],...st}}>{ch}</button>;}
function Card({ch,st={}}){return<div style={{background:"#fff",border:`1px solid ${C.line}`,borderRadius:14,padding:24,...st}}>{ch}</div>;}
function SBk({icon,label,val,unit,sub,acc}){return<div style={{background:acc?C.ink:"#fff",border:`1px solid ${acc?C.ink:C.line}`,borderRadius:14,padding:"22px 20px"}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,color:acc?C.coralSoft:C.sage}}>{icon}<span style={{fontSize:11.5,letterSpacing:"0.07em",textTransform:"uppercase",fontWeight:700}}>{label}</span></div><div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontSize:34,fontWeight:800,color:acc?"#fff":C.ink,fontFamily:"'Source Serif 4',Georgia,serif"}}>{val}</span><span style={{fontSize:14,color:acc?C.paperDim:C.ink,opacity:0.6,fontWeight:600}}>{unit}</span></div>{sub&&<div style={{fontSize:12.5,color:acc?C.paperDim:C.ink,opacity:acc?0.75:0.45,marginTop:6}}>{sub}</div>}</div>;}

export default function App(){
  const[lang,setLang]=useState("tr");
  const t=STR[lang];
  const[page,setPage]=useState("landing");
  const[isPro,setIsPro]=useState(false);
  const[selClient,setSelClient]=useState(null);
  const[selTpl,setSelTpl]=useState(null);
  useEffect(()=>{(async()=>{const p=await sg("user:isPro");setIsPro(!!p);})();},[]);
  const goPro=useCallback(async()=>{setIsPro(true);await ss("user:isPro",true);},[]);
  const nav=p=>{setPage(p);window.scrollTo(0,0);};
  return(
    <div style={{minHeight:"100vh",background:C.paper,color:C.ink,fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif"}}>
      <style>{`*{box-sizing:border-box;}body{margin:0;}::selection{background:${C.coral};color:#fff;}@keyframes nbF{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.nbP{animation:nbF 0.2s ease both;}@media(max-width:720px){.g2{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr!important;}.hm{display:none!important;}}@media print{.np{display:none!important;}}`}</style>
      <NavBar t={t} lang={lang} setLang={setLang} page={page} nav={nav} isPro={isPro}/>
      <main className="nbP" key={page}>
        {page==="landing"&&<Landing t={t} nav={nav} lang={lang}/>}
        {page==="calc"&&<CalcPage t={t} lang={lang}/>}
        {page==="food"&&<FoodPage t={t} lang={lang} isPro={isPro}/>}
        {page==="track"&&<TrackPage t={t}/>}
        {page==="clients"&&(isPro?<ClientsPage t={t} lang={lang} nav={nav} setSel={setSelClient}/>:<Upsell t={t} nav={nav}/>)}
        {page==="clientProfile"&&(isPro?<ClientProfile t={t} lang={lang} clientId={selClient} nav={nav}/>:<Upsell t={t} nav={nav}/>)}
        {page==="templates"&&(isPro?<TemplatesPage t={t} lang={lang} nav={nav} setSel={setSelTpl}/>:<Upsell t={t} nav={nav}/>)}
        {page==="templateDetail"&&(isPro?<TemplateDetail t={t} lang={lang} id={selTpl} nav={nav}/>:<Upsell t={t} nav={nav}/>)}
        {page==="proLanding"&&<ProLanding t={t} nav={nav} isPro={isPro}/>}
        {page==="proCheckout"&&<ProCheckout t={t} nav={nav} goPro={goPro}/>}
      </main>
      <FooterBar t={t} nav={nav}/>
    </div>
  );
}

function NavBar({t,lang,setLang,page,nav,isPro}){
  const items=[{k:"calc",l:t.nav.calc,icon:<Calculator size={15}/>},{k:"food",l:t.nav.food,icon:<Search size={15}/>},{k:"track",l:t.nav.track,icon:<TrendingUp size={15}/>},{k:"clients",l:t.nav.clients,icon:<Users size={15}/>,pro:true},{k:"templates",l:t.nav.templates,icon:<FileText size={15}/>,pro:true}];
  return(
    <header style={{borderBottom:`1px solid ${C.line}`,background:C.paper,position:"sticky",top:0,zIndex:40}}>
      <div style={{maxWidth:1180,margin:"0 auto",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>nav("landing")}><Logo/><span style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:800,fontSize:19}}>{t.appName}</span>{isPro&&<PBadge sm/>}</div>
        <nav className="hm" style={{display:"flex",alignItems:"center",gap:4}}>{items.map(i=><button key={i.k} onClick={()=>nav(i.k)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:"none",background:page===i.k?C.paperDim:"transparent",color:C.ink,fontSize:13.5,fontWeight:600,cursor:"pointer"}}>{i.icon}{i.l}{i.pro&&!isPro&&<Lock size={10} style={{marginLeft:2,opacity:0.5}}/>}</button>)}</nav>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setLang(lang==="tr"?"en":"tr")} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 11px",borderRadius:7,border:`1px solid ${C.line}`,background:"#fff",fontSize:12.5,fontWeight:700,cursor:"pointer",color:C.ink}}><Globe size={13}/> {lang==="tr"?"EN":"TR"}</button>
          {!isPro&&<Btn ch={<><Crown size={13}/> {t.nav.upgrade}</>} vr="coral" onClick={()=>nav("proLanding")} st={{padding:"9px 16px",fontSize:13}} className="hm"/>}
        </div>
      </div>
      <div style={{display:"flex",overflowX:"auto",gap:6,padding:"10px 16px 12px",borderTop:`1px solid ${C.line}`}} className="mnav">
        {items.map(i=><button key={i.k} onClick={()=>nav(i.k)} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 12px",borderRadius:20,whiteSpace:"nowrap",border:`1px solid ${page===i.k?C.ink:C.line}`,background:page===i.k?C.ink:"#fff",color:page===i.k?"#fff":C.ink,fontSize:12.5,fontWeight:600,cursor:"pointer"}}>{i.icon}{i.l}{i.pro&&!isPro&&<Lock size={9}/>}</button>)}
      </div>
      <style>{"@media(min-width:721px){.mnav{display:none!important;}}"}</style>
    </header>
  );
}

function FooterBar({t,nav}){
  return(
    <footer style={{borderTop:`1px solid ${C.line}`,background:C.paper,padding:"48px 24px 32px",marginTop:60}}>
      <div style={{maxWidth:1180,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:40,marginBottom:40}} className="g3">
          <div><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><Logo sz={24}/><span style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:800,fontSize:17}}>{t.appName}</span></div><p style={{fontSize:13.5,lineHeight:1.65,color:C.ink,opacity:0.6,margin:0,maxWidth:300}}>{t.footer.desc}</p></div>
          <div><h4 style={{fontSize:12,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:C.ink,opacity:0.5,margin:"0 0 14px"}}>{t.footer.links}</h4>{[{l:t.nav.calc,p:"calc"},{l:t.nav.food,p:"food"},{l:t.nav.track,p:"track"},{l:"Pro",p:"proLanding"}].map(x=><button key={x.p} onClick={()=>nav(x.p)} style={{display:"block",background:"none",border:"none",cursor:"pointer",fontSize:13.5,color:C.ink,opacity:0.65,padding:"4px 0",fontFamily:"inherit",textAlign:"left"}}>{x.l}</button>)}</div>
          <div><h4 style={{fontSize:12,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:C.ink,opacity:0.5,margin:"0 0 14px"}}>Pro</h4>{[{l:t.nav.clients,p:"clients"},{l:t.nav.templates,p:"templates"}].map(x=><button key={x.p} onClick={()=>nav(x.p)} style={{display:"block",background:"none",border:"none",cursor:"pointer",fontSize:13.5,color:C.ink,opacity:0.65,padding:"4px 0",fontFamily:"inherit",textAlign:"left"}}>{x.l}</button>)}</div>
        </div>
        <div style={{borderTop:`1px solid ${C.line}`,paddingTop:20,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,fontSize:12,color:C.ink,opacity:0.4}}><span>© 2026 {t.appName}. {t.footer.rights}</span><span>{t.footer.disc}</span></div>
      </div>
    </footer>
  );
}

function Landing({t,nav,lang}){
  return(
    <div>
      <section style={{maxWidth:1180,margin:"0 auto",padding:"80px 24px 60px",display:"grid",gridTemplateColumns:"1.1fr 0.9fr",gap:60,alignItems:"center"}} className="g2">
        <div>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:C.coral,marginBottom:18}}><Sparkles size={13}/> {t.hero.eyebrow}</div>
          <h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:"clamp(34px,5vw,54px)",fontWeight:700,lineHeight:1.08,margin:"0 0 22px",letterSpacing:"-0.015em"}}>{t.hero.title}</h1>
          <p style={{fontSize:17,lineHeight:1.6,color:C.ink,opacity:0.7,maxWidth:480,marginBottom:32}}>{t.hero.sub}</p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Btn ch={<>{t.hero.ctaFree} <ArrowRight size={16}/></>} vr="primary" onClick={()=>nav("calc")} st={{padding:"15px 26px"}}/>
            <Btn ch={t.hero.ctaPro} vr="ghost" onClick={()=>nav("proLanding")} st={{padding:"15px 26px"}}/>
          </div>
        </div>
        <div><LViz/></div>
      </section>
      <section style={{background:C.ink,padding:"28px 24px"}}>
        <div style={{maxWidth:1180,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20,textAlign:"center"}} className="g2">
          {[{v:"12+",l:t.stats.t1},{v:"2",l:t.stats.t2},{v:"56+",l:t.stats.t3},{v:"100%",l:t.stats.t4}].map((s,i)=><div key={i}><div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:32,fontWeight:800,color:"#fff"}}>{s.v}</div><div style={{fontSize:12,fontWeight:600,color:C.paperDim,opacity:0.7,marginTop:4}}>{s.l}</div></div>)}
        </div>
      </section>
      <section style={{maxWidth:1180,margin:"0 auto",padding:"60px 24px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}} className="g3">
          {[{icon:<Calculator size={20}/>,t:lang==="tr"?"Doğru Hesaplama":"Accurate Calculation",d:lang==="tr"?"BMR, TDEE, BMİ, su ve makro ihtiyacı bilimsel formüllerle.":"BMR, TDEE, BMI, water and macro needs via scientific formulas."},
            {icon:<Search size={20}/>,t:lang==="tr"?"Besin Veritabanı":"Food Database",d:lang==="tr"?"56+ besin için TurKomp+USDA verileriyle 26 besin değeri.":"26 nutritional values for 56+ foods via TurKomp+USDA."},
            {icon:<FileText size={20}/>,t:lang==="tr"?"Klinik Şablonlar":"Clinical Templates",d:lang==="tr"?"12 hastalık için referans diyet planları.":"Reference diet plans for 12 conditions.",pro:true}
          ].map((f,i)=><Card key={i} st={{}}>
            <ch><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}><div style={{width:38,height:38,borderRadius:10,background:C.paperDim,display:"flex",alignItems:"center",justifyContent:"center",color:C.coral}}>{f.icon}</div>{f.pro&&<PBadge sm/>}</div><h3 style={{fontSize:16,fontWeight:700,margin:"0 0 6px"}}>{f.t}</h3><p style={{fontSize:13.5,color:C.ink,opacity:0.6,lineHeight:1.5,margin:0}}>{f.d}</p></ch>
          </Card>)}
        </div>
      </section>
      <section style={{maxWidth:1180,margin:"0 auto",padding:"60px 24px 80px"}}>
        <h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:30,fontWeight:700,margin:"0 0 40px",textAlign:"center"}}>{t.hiw.title}</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:28}} className="g3">
          {[{n:"01",t:t.hiw.s1t,d:t.hiw.s1d,icon:<Scale size={22}/>},{n:"02",t:t.hiw.s2t,d:t.hiw.s2d,icon:<Calculator size={22}/>},{n:"03",t:t.hiw.s3t,d:t.hiw.s3d,icon:<TrendingUp size={22}/>}].map((s,i)=>(
            <div key={i}><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}><div style={{width:44,height:44,borderRadius:12,background:C.coral,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{s.icon}</div><span style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:28,fontWeight:800,color:C.line}}>{s.n}</span></div><h3 style={{fontSize:17,fontWeight:700,margin:"0 0 8px"}}>{s.t}</h3><p style={{fontSize:13.5,color:C.ink,opacity:0.6,lineHeight:1.6,margin:0}}>{s.d}</p></div>
          ))}
        </div>
      </section>
    </div>
  );
}

function LViz(){return<svg viewBox="0 0 420 420" style={{width:"100%",height:"auto"}}><circle cx="210" cy="210" r="200" fill={C.paperDim}/><circle cx="210" cy="210" r="150" fill="none" stroke={C.line} strokeWidth="1" strokeDasharray="3 6"/><circle cx="210" cy="210" r="118" fill="#fff" stroke={C.line} strokeWidth="1.5"/><circle cx="210" cy="210" r="95" fill="none" stroke={C.ink} strokeWidth="26" strokeDasharray="180 597" strokeDashoffset="0" transform="rotate(-90 210 210)"/><circle cx="210" cy="210" r="95" fill="none" stroke={C.coral} strokeWidth="26" strokeDasharray="240 597" strokeDashoffset="-180" transform="rotate(-90 210 210)"/><circle cx="210" cy="210" r="95" fill="none" stroke={C.sage} strokeWidth="26" strokeDasharray="177 597" strokeDashoffset="-420" transform="rotate(-90 210 210)"/><circle cx="210" cy="210" r="68" fill={C.paper}/><text x="210" y="203" textAnchor="middle" fontFamily="'Source Serif 4',Georgia,serif" fontSize="30" fontWeight="800" fill={C.ink}>2150</text><text x="210" y="224" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11" fill={C.ink} opacity="0.5" letterSpacing="1">KCAL / GÜN</text><path d="M84 110 C90 122 98 130 98 140 A14 14 0 1 1 70 140 C70 130 78 122 84 110 Z" fill={C.sage} opacity="0.85"/><rect x="330" y="90" width="30" height="38" rx="6" fill={C.gold} opacity="0.85"/></svg>;}

function CalcPage({t,lang}){
  const[form,setForm]=useState({gender:"female",age:"30",height:"165",weight:"65",actIdx:1,goal:"maintain"});
  const[result,setResult]=useState(null);
  const[saved,setSaved]=useState(false);
  const upd=(k,v)=>setForm(f=>({...f,[k]:v}));
  const go=()=>{if(!form.age||!form.height||!form.weight)return;setResult(calcAll(form));setSaved(false);};
  const save=async()=>{if(!result)return;await ss(`entry:${Date.now()}`,{date:new Date().toISOString().slice(0,10),weight:form.weight,target:result.target,water:result.water,ts:Date.now()});setSaved(true);};
  const bmi=result?bmiCat(result.bmi,t):null;
  return(
    <section style={{maxWidth:1100,margin:"0 auto",padding:"48px 24px 80px"}}>
      <h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:32,fontWeight:700,margin:"0 0 8px"}}>{t.calc.title}</h1>
      <p style={{color:C.ink,opacity:0.6,fontSize:15,margin:"0 0 36px"}}>{t.calc.sub}</p>
      <div style={{display:"grid",gridTemplateColumns:"380px 1fr",gap:28}} className="g2">
        <Card st={{}}>
          <ch>
            <Fld label={t.calc.gender}><SegBtn opts={[{v:"female",l:t.calc.female},{v:"male",l:t.calc.male}]} val={form.gender} onChg={v=>upd("gender",v)}/></Fld>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Fld label={t.calc.age}><TIn type="number" value={form.age} onChange={e=>upd("age",e.target.value)} placeholder="30"/></Fld><Fld label={t.calc.height}><TIn type="number" value={form.height} onChange={e=>upd("height",e.target.value)} placeholder="165"/></Fld></div>
            <Fld label={t.calc.weight}><TIn type="number" value={form.weight} onChange={e=>upd("weight",e.target.value)} placeholder="65"/></Fld>
            <Fld label={t.calc.activity}><Sel val={form.actIdx} onChg={v=>upd("actIdx",v)} opts={t.calc.act}/></Fld>
            <Fld label={t.calc.goal}><SegBtn opts={[{v:"lose",l:t.calc.goalLose},{v:"maintain",l:t.calc.goalMaintain},{v:"gain",l:t.calc.goalGain}]} val={form.goal} onChg={v=>upd("goal",v)}/></Fld>
            <Btn ch={<><Calculator size={16}/> {t.calc.calculate}</>} vr="primary" onClick={go} st={{width:"100%",marginTop:6,padding:"14px"}}/>
          </ch>
        </Card>
        <div>
          {!result&&<div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px dashed ${C.line}`,borderRadius:14,minHeight:320}}><div style={{textAlign:"center",color:C.ink,opacity:0.4}}><Calculator size={32} style={{marginBottom:12,opacity:0.5}}/><p style={{fontSize:14,margin:0}}>{lang==="tr"?"Sonuçlar burada görünecek":"Results will appear here"}</p></div></div>}
          {result&&<div>
            <h2 style={{fontSize:13,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.ink,opacity:0.5,marginBottom:14}}>{t.calc.results}</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}><SBk icon={<Activity size={14}/>} label={t.calc.bmr} val={result.bmr} unit={t.calc.kcal} sub={t.calc.bmrD}/><SBk icon={<TrendingUp size={14}/>} label={t.calc.tdee} val={result.tdee} unit={t.calc.kcal} sub={t.calc.tdeeD}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}><SBk icon={<Apple size={14}/>} label={t.calc.target} val={result.target} unit={t.calc.kcal} sub={t.calc.targetD} acc/><SBk icon={<Droplets size={14}/>} label={t.calc.water} val={result.water} unit={t.calc.liters} sub={t.calc.waterD}/></div>
            <div style={{background:"#fff",border:`1px solid ${C.line}`,borderRadius:14,padding:"18px 20px",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,color:C.sage}}><Scale size={14}/><span style={{fontSize:11.5,letterSpacing:"0.07em",textTransform:"uppercase",fontWeight:700}}>{t.calc.bmi}</span></div>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:10}}><span style={{fontSize:34,fontWeight:800,color:C.ink,fontFamily:"'Source Serif 4',Georgia,serif"}}>{result.bmi}</span><div><span style={{display:"inline-block",background:bmi.col+"20",color:bmi.col,fontWeight:700,fontSize:13,padding:"4px 12px",borderRadius:20,border:`1.5px solid ${bmi.col}40`}}>{bmi.l}</span><div style={{fontSize:12,color:C.ink,opacity:0.45,marginTop:4}}>{t.calc.bmiD}</div></div></div>
              <div style={{display:"flex",height:6,borderRadius:4,overflow:"hidden",gap:2}}>{["#3B82F6",C.sage,C.gold,C.coral].map((col,i)=><div key={i} style={{flex:1,background:col,opacity:0.7}}/>)}</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.ink,opacity:0.4,marginTop:3}}><span>{t.calc.bmiUnder}</span><span>{t.calc.bmiNormal}</span><span>{t.calc.bmiOver}</span><span>{t.calc.bmiObese}</span></div>
            </div>
            <Card st={{marginBottom:14}}>
              <ch>
                <h3 style={{fontSize:13,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",color:C.ink,opacity:0.5,margin:"0 0 16px"}}>{t.calc.macros}</h3>
                <MBar protein={result.protein} carbs={result.carbs} fat={result.fat} t={t}/>
              </ch>
            </Card>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><Btn ch={<><Plus size={15}/> {t.calc.saveEntry}</>} vr="coral" onClick={save}/>{saved&&<span style={{color:C.sage,fontSize:13.5,fontWeight:600,display:"flex",alignItems:"center",gap:4}}><Check size={15}/> {t.calc.saved}</span>}</div>
            <p style={{fontSize:12,color:C.ink,opacity:0.45,marginTop:22,lineHeight:1.6,display:"flex",gap:8,alignItems:"flex-start"}}><AlertCircle size={14} style={{flexShrink:0,marginTop:1}}/>{t.calc.disclaimer}</p>
          </div>}
        </div>
      </div>
    </section>
  );
}

function MBar({protein,carbs,fat,t}){
  const total=protein*4+carbs*4+fat*9;
  const rows=[{l:t.calc.protein,v:protein,p:(protein*4/total)*100,col:C.ink},{l:t.calc.carbs,v:carbs,p:(carbs*4/total)*100,col:C.coral},{l:t.calc.fat,v:fat,p:(fat*9/total)*100,col:C.sage}];
  return<div><div style={{display:"flex",height:12,borderRadius:6,overflow:"hidden",marginBottom:18}}>{rows.map((r,i)=><div key={i} style={{width:`${r.p}%`,background:r.col}}/>)}</div>{rows.map((r,i)=><div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:i<2?`1px solid ${C.paperDim}`:"none"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{width:9,height:9,borderRadius:3,background:r.col,display:"inline-block"}}/><span style={{fontSize:14,fontWeight:600}}>{r.l}</span><span style={{fontSize:12,color:C.ink,opacity:0.4}}>{r.p.toFixed(0)}%</span></div><span style={{fontSize:14,fontWeight:700}}>{r.v}g</span></div>)}</div>;
}

function FoodPage({t,lang,isPro}){
  const[query,setQuery]=useState("");
  const[sel,setSel]=useState(null);
  const[amt,setAmt]=useState("100");
  const[showAll,setShowAll]=useState(false);
  const tf=t.food;
  const results=query.length<2?[]:FOODS.filter(f=>{const q=query.toLowerCase();return(lang==="tr"?f.tr:f.en).toLowerCase().includes(q)||f.tr.toLowerCase().includes(q)||f.en.toLowerCase().includes(q);}).slice(0,12);
  const dispN=isPro||showAll?NUTRIENTS:NUTRIENTS.filter(n=>n.imp);
  const cv=(base,g)=>{const v=base*(+g)/100;return v%1===0?v:parseFloat(v.toFixed(2));};
  const cats=[...new Set(FOODS.map(f=>f.cat))];
  const catD={tahıl:"ekmek",et:"tavuk",balık:"somon","yumurta-süt":"yumurta",baklagil:"mercimek",sebze:"domates",meyve:"elma",kuruyemiş:"ceviz",yağ:"zeytinyağı",diğer:"bal"};
  return(
    <section style={{maxWidth:1000,margin:"0 auto",padding:"48px 24px 80px"}}>
      <h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:32,fontWeight:700,margin:"0 0 8px"}}>{tf.title}</h1>
      <p style={{color:C.ink,opacity:0.6,fontSize:15,margin:"0 0 32px"}}>{tf.sub}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,alignItems:"start"}} className="g2">
        <div>
          <div style={{position:"relative",marginBottom:16}}><Search size={17} style={{position:"absolute",left:14,top:14,color:C.ink,opacity:0.4}}/><TIn value={query} onChange={e=>{setQuery(e.target.value);setSel(null);}} placeholder={tf.ph} style={{paddingLeft:42,fontSize:15}}/></div>
          {query.length>=2&&results.length===0&&<p style={{color:C.ink,opacity:0.5,fontSize:14}}>{tf.notFound}</p>}
          {results.length>0&&<div style={{background:"#fff",border:`1px solid ${C.line}`,borderRadius:12,overflow:"hidden",marginBottom:16}}>{results.map((f,i)=><div key={f.id} onClick={()=>{setSel(f);setAmt("100");}} style={{padding:"12px 16px",borderTop:i>0?`1px solid ${C.paperDim}`:"none",cursor:"pointer",background:sel?.id===f.id?C.paperDim:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:600}}>{lang==="tr"?f.tr:f.en}</div><div style={{fontSize:12,color:C.ink,opacity:0.45}}>{tf.cats[f.cat]||f.cat}</div></div><div style={{fontSize:13,fontWeight:700,color:C.coral}}>{f.v[0]} kcal</div></div>)}</div>}
          {!query&&<div><p style={{fontSize:12,fontWeight:700,color:C.ink,opacity:0.5,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:12}}>{lang==="tr"?"Kategoriler":"Categories"}</p><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{cats.map(cat=><button key={cat} onClick={()=>setQuery(catD[cat]||cat)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${C.line}`,background:"#fff",fontSize:13,cursor:"pointer",color:C.ink,fontFamily:"inherit"}}>{tf.cats[cat]||cat}</button>)}</div></div>}
        </div>
        <div>
          {!sel&&<div style={{border:`1.5px dashed ${C.line}`,borderRadius:14,padding:50,textAlign:"center",color:C.ink,opacity:0.4}}><Leaf size={28} style={{marginBottom:10}}/><p style={{margin:0,fontSize:14}}>{tf.selPrompt}</p></div>}
          {sel&&<Card st={{}}>
            <ch>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}><div><h3 style={{fontSize:18,fontWeight:700,margin:"0 0 4px"}}>{lang==="tr"?sel.tr:sel.en}</h3><span style={{fontSize:12,color:C.ink,opacity:0.5}}>{tf.cats[sel.cat]||sel.cat}</span></div><button onClick={()=>setSel(null)} style={{background:"none",border:"none",cursor:"pointer",opacity:0.4}}><X size={18}/></button></div>
              <Fld label={tf.amount}><TIn type="number" value={amt} onChange={e=>setAmt(e.target.value)}/></Fld>
              {!isPro&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><span style={{fontSize:12,fontWeight:700,color:C.ink,opacity:0.5,letterSpacing:"0.05em",textTransform:"uppercase"}}>{showAll?tf.allN:tf.impN}</span><button onClick={()=>setShowAll(!showAll)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.coral,fontWeight:700,fontFamily:"inherit"}}>{showAll?tf.showLess:tf.showAll}</button></div>}
              {isPro&&<p style={{fontSize:12,fontWeight:700,color:C.ink,opacity:0.5,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:12}}>{tf.allN}</p>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.line,borderRadius:8,overflow:"hidden"}}>
                {dispN.map(n=>{const base=sel.v[n.i];const fA=cv(base,+amt||100);return(<div key={n.i} style={{background:"#fff",padding:"10px 12px"}}><div style={{fontSize:10.5,fontWeight:600,color:C.ink,opacity:0.5,marginBottom:3}}>{lang==="tr"?n.tr:n.en}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}><span style={{fontSize:15,fontWeight:700}}>{+amt&&+amt!==100?fA:base}</span><span style={{fontSize:11,color:C.ink,opacity:0.4}}>{n.unit}</span></div>{+amt&&+amt!==100&&<div style={{fontSize:10,color:C.ink,opacity:0.35}}>100g: {base}</div>}</div>);})}
              </div>
              <p style={{fontSize:11,color:C.ink,opacity:0.4,marginTop:12,lineHeight:1.5}}>{tf.src}</p>
            </ch>
          </Card>}
        </div>
      </div>
    </section>
  );
}

function TrackPage({t}){
  const[entries,setEntries]=useState([]);const[loading,setLoading]=useState(true);
  const load=useCallback(async()=>{setLoading(true);const ks=await sl("entry:");const items=[];for(const k of ks){const v=await sg(k);if(v)items.push({...v,key:k});}items.sort((a,b)=>b.ts-a.ts);setEntries(items);setLoading(false);},[]);
  useEffect(()=>{load();},[load]);
  const del=async k=>{await sd(k);load();};
  return(
    <section style={{maxWidth:900,margin:"0 auto",padding:"48px 24px 80px"}}>
      <h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:32,fontWeight:700,margin:"0 0 8px"}}>{t.track.title}</h1>
      <p style={{color:C.ink,opacity:0.6,fontSize:15,margin:"0 0 32px"}}>{t.track.sub}</p>
      {loading&&<Spin/>}
      {!loading&&entries.length===0&&<div style={{border:`1.5px dashed ${C.line}`,borderRadius:14,padding:50,textAlign:"center",color:C.ink,opacity:0.45}}><ClipboardList size={28} style={{marginBottom:10}}/><p style={{margin:0,fontSize:14}}>{t.track.empty}</p></div>}
      {!loading&&entries.length>0&&<>
        {entries.length>1&&<WC entries={entries} t={t}/>}
        <Card st={{padding:0,overflow:"hidden"}}>
          <ch>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:C.paperDim}}>{[t.track.date,t.track.weight,t.track.target,t.track.water,""].map((h,i)=><th key={i} style={{textAlign:"left",padding:"12px 18px",fontSize:11.5,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",color:C.ink,opacity:0.55}}>{h}</th>)}</tr></thead>
              <tbody>{entries.map(e=><tr key={e.key} style={{borderTop:`1px solid ${C.paperDim}`}}><td style={{padding:"12px 18px",fontSize:14,fontWeight:600}}>{e.date}</td><td style={{padding:"12px 18px",fontSize:14}}>{e.weight} kg</td><td style={{padding:"12px 18px",fontSize:14}}>{e.target} kcal</td><td style={{padding:"12px 18px",fontSize:14}}>{e.water} L</td><td style={{padding:"12px 18px",textAlign:"right"}}><button onClick={()=>del(e.key)} style={{background:"none",border:"none",cursor:"pointer",color:C.ink,opacity:0.35}}><Trash2 size={15}/></button></td></tr>)}</tbody>
            </table>
          </ch>
        </Card>
      </>}
    </section>
  );
}

function WC({entries,t}){
  const sorted=[...entries].sort((a,b)=>a.ts-b.ts);
  const ws=sorted.map(e=>Number(e.weight));
  const mn=Math.min(...ws)-1,mx=Math.max(...ws)+1,rng=mx-mn||1;
  const W=800,H=160,P=20;
  const pts=sorted.map((e,i)=>{const x=P+(i/Math.max(sorted.length-1,1))*(W-P*2);const y=H-P-((Number(e.weight)-mn)/rng)*(H-P*2);return`${x},${y}`;});
  return<Card st={{marginBottom:20}}><ch><h3 style={{fontSize:13,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",color:C.ink,opacity:0.5,margin:"0 0 16px"}}>{t.track.trend}</h3><svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto"}} preserveAspectRatio="none"><polyline points={pts.join(" ")} fill="none" stroke={C.coral} strokeWidth="2.5"/>{sorted.map((e,i)=>{const x=P+(i/Math.max(sorted.length-1,1))*(W-P*2);const y=H-P-((Number(e.weight)-mn)/rng)*(H-P*2);return<circle key={i} cx={x} cy={y} r="4" fill={C.ink}/>;})}</svg></ch></Card>;
}

function Upsell({t,nav}){return<section style={{maxWidth:600,margin:"0 auto",padding:"100px 24px",textAlign:"center"}}><div style={{width:64,height:64,borderRadius:18,background:C.paperDim,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",color:C.gold}}><Lock size={26}/></div><h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:26,fontWeight:700,margin:"0 0 10px"}}>{t.upsell.title}</h2><p style={{color:C.ink,opacity:0.6,fontSize:15,marginBottom:28,lineHeight:1.6}}>{t.upsell.sub}</p><Btn ch={<><Crown size={16}/> {t.upsell.cta}</>} vr="coral" onClick={()=>nav("proLanding")} st={{padding:"14px 28px"}}/></section>;}

function ProLanding({t,nav,isPro}){return<section style={{maxWidth:1000,margin:"0 auto",padding:"60px 24px 90px"}}><div style={{textAlign:"center",marginBottom:50}}><PBadge/><h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:36,fontWeight:700,margin:"16px 0 12px"}}>{t.pro.title}</h1><p style={{color:C.ink,opacity:0.6,fontSize:16,maxWidth:480,margin:"0 auto"}}>{t.pro.sub}</p></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:44}} className="g2">{[t.pro.f1,t.pro.f2,t.pro.f3,t.pro.f4].map((f,i)=><div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",background:"#fff",border:`1px solid ${C.line}`,borderRadius:12,padding:18}}><div style={{width:26,height:26,borderRadius:7,background:C.ink,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Check size={14}/></div><span style={{fontSize:14.5,lineHeight:1.5}}>{f}</span></div>)}</div><div style={{textAlign:"center"}}>{!isPro?<Btn ch={<><Crown size={17}/> {t.pro.demo}</>} vr="coral" onClick={()=>nav("proCheckout")} st={{padding:"16px 32px",fontSize:16}}/>:<Btn ch={<>{t.pro.goApp} <ArrowRight size={16}/></>} vr="primary" onClick={()=>nav("clients")} st={{padding:"16px 32px",fontSize:16}}/>}</div></section>;}

function ProCheckout({t,nav,goPro}){
  const[plan,setPlan]=useState("yearly");const[proc,setProc]=useState(false);const[done,setDone]=useState(false);const[card,setCard]=useState({number:"",expiry:"",cvc:"",name:""});
  const sub=async e=>{e.preventDefault();setProc(true);setTimeout(async()=>{await goPro();setProc(false);setDone(true);},1400);};
  if(done)return<section style={{maxWidth:480,margin:"0 auto",padding:"100px 24px",textAlign:"center"}}><div style={{width:70,height:70,borderRadius:"50%",background:C.sage,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}><Check size={32} color="#fff"/></div><h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:26,fontWeight:700,margin:"0 0 8px"}}>{t.pro.success}</h2><p style={{color:C.ink,opacity:0.6,marginBottom:28}}>{t.pro.successSub}</p><Btn ch={<>{t.pro.goApp} <ArrowRight size={16}/></>} vr="primary" onClick={()=>nav("clients")} st={{padding:"14px 28px"}}/></section>;
  return<section style={{maxWidth:480,margin:"0 auto",padding:"60px 24px 90px"}}><div style={{textAlign:"center",marginBottom:28}}><PBadge/><h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:26,fontWeight:700,margin:"14px 0 6px"}}>{t.pro.demo}</h1><p style={{fontSize:12.5,color:C.gold,fontWeight:600}}>{t.pro.demoNote}</p></div><div style={{display:"flex",gap:10,marginBottom:22}}>{[{k:"monthly",l:t.pro.pM,p:"₺149"},{k:"yearly",l:t.pro.pY,p:"₺1.490"}].map(pl=><button key={pl.k} onClick={()=>setPlan(pl.k)} style={{flex:1,padding:"16px 14px",borderRadius:12,cursor:"pointer",textAlign:"left",border:`2px solid ${plan===pl.k?C.coral:C.line}`,background:plan===pl.k?C.coralSoft:"#fff"}}><div style={{fontSize:12.5,fontWeight:700,opacity:0.7,marginBottom:4}}>{pl.l}</div><div style={{fontSize:20,fontWeight:800,fontFamily:"'Source Serif 4',Georgia,serif"}}>{pl.p}</div></button>)}</div><Card st={{}}><ch><form onSubmit={sub}><Fld label={t.pro.cardName}><TIn required value={card.name} onChange={e=>setCard({...card,name:e.target.value})} placeholder="Ada Yılmaz"/></Fld><Fld label={t.pro.cardNum}><TIn required value={card.number} onChange={e=>setCard({...card,number:e.target.value})} placeholder="4242 4242 4242 4242" maxLength={19}/></Fld><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Fld label={t.pro.expiry}><TIn required value={card.expiry} onChange={e=>setCard({...card,expiry:e.target.value})} placeholder="12/28"/></Fld><Fld label={t.pro.cvc}><TIn required value={card.cvc} onChange={e=>setCard({...card,cvc:e.target.value})} placeholder="123" maxLength={4}/></Fld></div><Btn tp="submit" ch={proc?t.pro.proc:<>{t.pro.confirm} <ArrowRight size={15}/></>} vr="coral" dis={proc} st={{width:"100%",padding:"15px",marginTop:8}}/></form></ch></Card></section>;
}

function ClientsPage({t,lang,nav,setSel}){
  const[clients,setClients]=useState([]);const[loading,setLoading]=useState(true);const[showForm,setShowForm]=useState(false);const[search,setSearch]=useState("");const[form,setForm]=useState({name:"",age:"",gender:"female",height:"",weight:"",condition:"",notes:""});
  const load=useCallback(async()=>{setLoading(true);const ks=await sl("client:");const items=[];for(const k of ks){const v=await sg(k);if(v)items.push({...v,key:k});}items.sort((a,b)=>b.createdAt-a.createdAt);setClients(items);setLoading(false);},[]);
  useEffect(()=>{load();},[load]);
  const add=async e=>{e.preventDefault();if(!form.name)return;const id=`client:${Date.now()}`;await ss(id,{...form,createdAt:Date.now(),id});setForm({name:"",age:"",gender:"female",height:"",weight:"",condition:"",notes:""});setShowForm(false);load();};
  const del=async k=>{if(!window.confirm(t.clients.confirmDel))return;await sd(k);load();};
  const filtered=clients.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));
  return<section style={{maxWidth:1000,margin:"0 auto",padding:"48px 24px 80px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28,flexWrap:"wrap",gap:14}}><h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:30,fontWeight:700,margin:0,display:"flex",alignItems:"center",gap:10}}>{t.clients.title} <PBadge sm/></h1><Btn ch={<><UserPlus size={16}/> {t.clients.add}</>} vr="coral" onClick={()=>setShowForm(!showForm)}/></div>
    {showForm&&<Card st={{marginBottom:24}}><ch><form onSubmit={add}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}} className="g2"><Fld label={t.clients.nameL}><TIn required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder={lang==="tr"?"örn. Danışan-014":"e.g. Client-014"}/></Fld><Fld label={t.clients.age}><TIn type="number" value={form.age} onChange={e=>setForm({...form,age:e.target.value})}/></Fld></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}} className="g3"><Fld label={t.clients.gender}><SegBtn opts={[{v:"female",l:t.calc.female},{v:"male",l:t.calc.male}]} val={form.gender} onChg={v=>setForm({...form,gender:v})}/></Fld><Fld label={t.clients.height}><TIn type="number" value={form.height} onChange={e=>setForm({...form,height:e.target.value})}/></Fld><Fld label={t.clients.weight}><TIn type="number" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})}/></Fld></div><Fld label={t.clients.condition}><TIn value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})} placeholder={t.clients.condNone}/></Fld><Fld label={t.clients.notes}><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={3} style={{...iSt,resize:"vertical",fontFamily:"inherit"}}/></Fld><p style={{fontSize:12,color:C.gold,opacity:0.9,marginBottom:16,display:"flex",gap:6}}><AlertCircle size={13} style={{flexShrink:0,marginTop:1}}/> {t.clients.privacy}</p><div style={{display:"flex",gap:10}}><Btn tp="submit" ch={t.clients.save} vr="primary"/><Btn tp="button" ch={t.clients.cancel} vr="ghost" onClick={()=>setShowForm(false)}/></div></form></ch></Card>}
    <Fld label=""><div style={{position:"relative"}}><Search size={16} style={{position:"absolute",left:14,top:13,opacity:0.4}}/><TIn value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.clients.search} style={{paddingLeft:38}}/></div></Fld>
    {loading&&<Spin/>}
    {!loading&&filtered.length===0&&<div style={{border:`1.5px dashed ${C.line}`,borderRadius:14,padding:50,textAlign:"center",color:C.ink,opacity:0.45}}><Users size={28} style={{marginBottom:10}}/><p style={{margin:0,fontSize:14}}>{t.clients.empty}</p></div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}} className="g2">{filtered.map(c=><Card key={c.key} st={{}}><ch><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><h3 style={{fontSize:17,fontWeight:700,margin:"0 0 4px"}}>{c.name}</h3><p style={{fontSize:13,color:C.ink,opacity:0.55,margin:0}}>{c.age&&`${c.age} ${lang==="tr"?"yaş":"yrs"}`}{c.weight&&` · ${c.weight} kg`}{c.height&&` · ${c.height} cm`}</p>{c.condition&&<span style={{display:"inline-block",marginTop:8,fontSize:11.5,fontWeight:600,background:C.coralSoft,color:C.coral,padding:"3px 9px",borderRadius:20}}>{c.condition}</span>}</div><button onClick={()=>del(c.key)} style={{background:"none",border:"none",cursor:"pointer",opacity:0.3}}><Trash2 size={15}/></button></div><div style={{marginTop:16}}><Btn ch={<>{t.clients.view} <ChevronRight size={14}/></>} vr="ghost" onClick={()=>{setSel(c.key);nav("clientProfile");}} st={{fontSize:13,padding:"8px 14px"}}/></div></ch></Card>)}</div>
  </section>;
}

function ClientProfile({t,lang,clientId,nav}){
  const[client,setClient]=useState(null);const[hist,setHist]=useState([]);const[showAdd,setShowAdd]=useState(false);const[entry,setEntry]=useState({weight:"",note:""});
  const[showN,setShowN]=useState(false);const[nEntry,setNEntry]=useState(Array(26).fill(""));const[nHist,setNHist]=useState([]);const[exp,setExp]=useState(null);
  const load=useCallback(async()=>{if(!clientId)return;const c=await sg(clientId);setClient(c);const ks=await sl(`${clientId}:history:`);const items=[];for(const k of ks){const v=await sg(k);if(v)items.push({...v,key:k});}items.sort((a,b)=>b.ts-a.ts);setHist(items);const nks=await sl(`${clientId}:nutri:`);const ni=[];for(const k of nks){const v=await sg(k);if(v)ni.push({...v,key:k});}ni.sort((a,b)=>b.ts-a.ts);setNHist(ni);},[clientId]);
  useEffect(()=>{load();},[load]);
  const addM=async e=>{e.preventDefault();if(!entry.weight)return;const ts=Date.now();await ss(`${clientId}:history:${ts}`,{weight:entry.weight,note:entry.note,ts,date:new Date().toISOString().slice(0,10)});setEntry({weight:"",note:""});setShowAdd(false);load();};
  const addN=async e=>{e.preventDefault();const ts=Date.now();const vals=nEntry.map(v=>v===""?null:parseFloat(v));await ss(`${clientId}:nutri:${ts}`,{vals,ts,date:new Date().toISOString().slice(0,10)});setNEntry(Array(26).fill(""));setShowN(false);load();};
  if(!client)return<section style={{maxWidth:800,margin:"0 auto",padding:"60px 24px"}}><Spin/></section>;
  return<section style={{maxWidth:900,margin:"0 auto",padding:"40px 24px 80px"}}>
    <button onClick={()=>nav("clients")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:13,color:C.ink,opacity:0.55,marginBottom:20,padding:0,fontWeight:600}}>← {t.common.back}</button>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28}}><div><h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:28,fontWeight:700,margin:"0 0 6px"}}>{client.name}</h1><p style={{fontSize:14,color:C.ink,opacity:0.55,margin:0}}>{client.age&&`${client.age} ${lang==="tr"?"yaş":"yrs"}`} · {client.gender==="male"?t.calc.male:t.calc.female} · {client.height} cm</p></div>{client.condition&&<span style={{fontSize:12.5,fontWeight:600,background:C.coralSoft,color:C.coral,padding:"5px 12px",borderRadius:20}}>{client.condition}</span>}</div>
    {client.notes&&<Card st={{marginBottom:20,background:C.paperDim,border:"none"}}><ch><h4 style={{fontSize:11.5,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",opacity:0.5,margin:"0 0 8px"}}>{t.clients.notes}</h4><p style={{margin:0,fontSize:14,lineHeight:1.6}}>{client.notes}</p></ch></Card>}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h3 style={{fontSize:15,fontWeight:700,margin:0}}>{t.clients.hist}</h3><Btn ch={<><Plus size={14}/> {t.clients.newM}</>} vr="ghost" onClick={()=>setShowAdd(!showAdd)} st={{fontSize:13,padding:"8px 14px"}}/></div>
    {showAdd&&<Card st={{marginBottom:16}}><ch><form onSubmit={addM}><div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:14}} className="g2"><Fld label={t.clients.weight}><TIn type="number" required value={entry.weight} onChange={e=>setEntry({...entry,weight:e.target.value})}/></Fld><Fld label={t.clients.notes}><TIn value={entry.note} onChange={e=>setEntry({...entry,note:e.target.value})}/></Fld></div><Btn tp="submit" ch={t.clients.save} vr="primary"/></form></ch></Card>}
    {hist.length>1&&<WC entries={hist} t={t}/>}
    <Card st={{padding:0,overflow:"hidden",marginBottom:32}}><ch>{hist.length===0&&<p style={{padding:24,fontSize:14,opacity:0.5,margin:0}}>{t.track.empty}</p>}{hist.map((h,i)=><div key={h.key} style={{display:"flex",justifyContent:"space-between",padding:"14px 20px",borderTop:i>0?`1px solid ${C.paperDim}`:"none"}}><span style={{fontSize:13.5,fontWeight:600}}>{h.date}</span><span style={{fontSize:13.5}}>{h.weight} kg</span><span style={{fontSize:13,opacity:0.5}}>{h.note}</span></div>)}</ch></Card>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div><h3 style={{fontSize:15,fontWeight:700,margin:"0 0 4px"}}>{t.clients.nutriHist}</h3><span style={{fontSize:12,color:C.ink,opacity:0.5}}>{lang==="tr"?"26 parametreli günlük besin takibi":"Daily nutrition tracking with 26 parameters"}</span></div>
      <Btn ch={<><Plus size={14}/> {t.clients.newN}</>} vr="ghost" onClick={()=>setShowN(!showN)} st={{fontSize:13,padding:"8px 14px"}}/>
    </div>
    {showN&&<Card st={{marginBottom:16}}><ch><h4 style={{fontSize:13,fontWeight:700,margin:"0 0 16px"}}>{lang==="tr"?"Günlük Besin Değerleri":"Enter Daily Nutritional Values"}</h4><form onSubmit={addN}><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}} className="g3">{NUTRIENTS.map((n,i)=><div key={i}><label style={{display:"block",fontSize:11,fontWeight:600,color:C.ink,opacity:0.55,marginBottom:4,textTransform:"uppercase"}}>{lang==="tr"?n.tr:n.en} ({n.unit})</label><TIn type="number" value={nEntry[i]} onChange={e=>{const a=[...nEntry];a[i]=e.target.value;setNEntry(a);}} placeholder="—" style={{padding:"8px 10px",fontSize:13}}/></div>)}</div><div style={{marginTop:16,display:"flex",gap:10}}><Btn tp="submit" ch={t.clients.save} vr="primary"/><Btn tp="button" ch={t.clients.cancel} vr="ghost" onClick={()=>setShowN(false)}/></div></form></ch></Card>}
    {nHist.length===0&&<div style={{border:`1.5px dashed ${C.line}`,borderRadius:14,padding:30,textAlign:"center",color:C.ink,opacity:0.4,fontSize:14}}>{lang==="tr"?"Henüz besin kaydı yok.":"No nutrition records yet."}</div>}
    {nHist.length>0&&<Card st={{padding:0,overflow:"hidden"}}><ch>{nHist.map((rec,ri)=><div key={rec.key} style={{borderTop:ri>0?`1px solid ${C.paperDim}`:"none"}}><div onClick={()=>setExp(exp===ri?null:ri)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",cursor:"pointer"}}><span style={{fontSize:14,fontWeight:600}}>{rec.date}</span><div style={{display:"flex",alignItems:"center",gap:16}}>{rec.vals[0]!=null&&<span style={{fontSize:13,fontWeight:700,color:C.coral}}>{rec.vals[0]} kcal</span>}{rec.vals[1]!=null&&<span style={{fontSize:13,color:C.ink,opacity:0.6}}>P:{rec.vals[1]}g</span>}{rec.vals[3]!=null&&<span style={{fontSize:13,color:C.ink,opacity:0.6}}>K:{rec.vals[3]}g</span>}{exp===ri?<ChevronUp size={16} style={{opacity:0.4}}/>:<ChevronDown size={16} style={{opacity:0.4}}/>}</div></div>{exp===ri&&<div style={{padding:"0 20px 20px"}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}} className="g3">{NUTRIENTS.map((n,i)=>rec.vals[i]!=null?<div key={i} style={{background:C.paperDim,borderRadius:8,padding:"8px 12px"}}><div style={{fontSize:10.5,fontWeight:600,color:C.ink,opacity:0.5,marginBottom:2}}>{lang==="tr"?n.tr:n.en}</div><span style={{fontSize:14,fontWeight:700}}>{rec.vals[i]}</span><span style={{fontSize:11,color:C.ink,opacity:0.4,marginLeft:2}}>{n.unit}</span></div>:null)}</div></div>}</div>)}</ch></Card>}
  </section>;
}

function TemplatesPage({t,lang,nav,setSel}){
  return<section style={{maxWidth:1000,margin:"0 auto",padding:"48px 24px 80px"}}>
    <h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:30,fontWeight:700,margin:"0 0 6px",display:"flex",alignItems:"center",gap:10}}>{t.tpl.title} <PBadge sm/></h1>
    <p style={{color:C.ink,opacity:0.6,fontSize:14.5,margin:"0 0 28px"}}>{t.tpl.sub}</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}} className="g3">
      {COND.map(c=>(
        <div key={c.id} onClick={()=>{setSel(c.id);nav("templateDetail");}} style={{background:"#fff",border:`1px solid ${C.line}`,borderRadius:14,padding:24,cursor:"pointer",transition:"box-shadow 0.15s"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(14,42,61,0.1)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><span style={{fontSize:28}}>{c.icon}</span>{c.warn&&<AlertCircle size={15} color={C.coral}/>}</div>
          <h3 style={{fontSize:15,fontWeight:700,margin:"12px 0 6px"}}>{lang==="tr"?c.tr:c.en}</h3>
          <p style={{fontSize:12.5,color:C.ink,opacity:0.55,lineHeight:1.5,margin:"0 0 14px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{lang==="tr"?c.ovTr:c.ovEn}</p>
          <span style={{fontSize:12.5,fontWeight:700,color:C.coral,display:"flex",alignItems:"center",gap:4}}>{t.tpl.use} <ChevronRight size={13}/></span>
        </div>
      ))}
    </div>
  </section>;
}

function TemplateDetail({t,lang,id,nav}){
  const c=COND.find(x=>x.id===id);
  if(!c)return null;
  const res=lang==="tr"?c.resTr:c.resEn;
  const rec=lang==="tr"?c.recTr:c.recEn;
  const av=lang==="tr"?c.avTr:c.avEn;
  const menu=lang==="tr"?c.mTr:c.mEn;
  return<section style={{maxWidth:820,margin:"0 auto",padding:"40px 24px 90px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}} className="np">
      <button onClick={()=>nav("templates")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:13,color:C.ink,opacity:0.55,padding:0,fontWeight:600}}>← {t.tpl.back}</button>
      <Btn ch={<><Printer size={14}/> {t.tpl.print}</>} vr="ghost" onClick={()=>window.print()} st={{fontSize:13,padding:"8px 14px"}}/>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}><span style={{fontSize:44}}>{c.icon}</span><div><h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:28,fontWeight:700,margin:"0 0 6px"}}>{lang==="tr"?c.tr:c.en}</h1><PBadge sm/></div></div>
    <Card st={{marginBottom:20}}><ch><h3 style={{fontSize:12,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",opacity:0.5,margin:"0 0 10px"}}>{t.tpl.overview}</h3><p style={{margin:0,fontSize:15,lineHeight:1.65}}>{lang==="tr"?c.ovTr:c.ovEn}</p></ch></Card>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}} className="g2">
      <Card st={{}}><ch><h3 style={{fontSize:12,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",opacity:0.5,margin:"0 0 12px",color:C.sage}}>{t.tpl.rec}</h3>{rec.map((r,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:9,fontSize:13.5}}><Check size={14} color={C.sage} style={{flexShrink:0,marginTop:2}}/> {r}</div>)}</ch></Card>
      <Card st={{}}><ch><h3 style={{fontSize:12,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",opacity:0.5,margin:"0 0 12px",color:C.coral}}>{t.tpl.avoid}</h3>{av.map((r,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:9,fontSize:13.5}}><X size={14} color={C.coral} style={{flexShrink:0,marginTop:2}}/> {r}</div>)}</ch></Card>
    </div>
    <Card st={{marginBottom:20}}><ch><h3 style={{fontSize:12,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",opacity:0.5,margin:"0 0 14px"}}>{t.tpl.res}</h3><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{res.map((r,i)=><span key={i} style={{fontSize:12.5,fontWeight:600,background:C.paperDim,padding:"6px 12px",borderRadius:20}}>{r}</span>)}</div></ch></Card>
    <Card st={{marginBottom:20}}><ch><h3 style={{fontSize:12,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",opacity:0.5,margin:"0 0 16px"}}>{t.tpl.menu}</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="g2">
        {[{label:t.tpl.b,val:menu.b},{label:t.tpl.l,val:menu.l},{label:t.tpl.d,val:menu.d},{label:t.tpl.s,val:menu.s}].map((m,i)=><div key={i} style={{background:C.paperDim,borderRadius:10,padding:14}}><div style={{fontSize:11,fontWeight:700,color:C.coral,marginBottom:5,letterSpacing:"0.04em",textTransform:"uppercase"}}>{m.label}</div><div style={{fontSize:13.5,lineHeight:1.5}}>{m.val}</div></div>)}
      </div>
    </ch></Card>
    <div style={{display:"flex",gap:10,padding:16,background:"#FFF8F0",border:`1px solid ${C.gold}40`,borderRadius:10}}><AlertCircle size={16} color={C.gold} style={{flexShrink:0,marginTop:1}}/><p style={{margin:0,fontSize:13,lineHeight:1.6,color:C.ink,opacity:0.75}}>{t.tpl.note}</p></div>
  </section>;
}
