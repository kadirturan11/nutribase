import React, { useState, useEffect, useCallback } from "react";
import {
  Calculator, Droplets, TrendingUp, Users, FileText, Lock, Check,
  ChevronRight, Globe, Plus, X, Activity, Apple, AlertCircle,
  ArrowRight, Sparkles, ClipboardList, UserPlus, Search, Trash2,
  Crown, Scale, Printer, ChevronDown, ChevronUp, Leaf, Settings
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
,
  {id:57, tr:"Mısır (Haşlanmış)",   en:"Boiled Corn",          cat:"sebze",      v:[96,3.4,1.5,21,2.4,73,4.5,0.2,0.4,0.7,0,0,15,270,2,0.5,26,89,0.5,11,6.8,0,0.1,0,42,0.1]},
  {id:58, tr:"Mantar",              en:"Mushroom",              cat:"sebze",      v:[22,3.1,0.3,3.3,1,92,2,0,0,0.1,0,0,5,318,3,0.5,9,86,0.5,0,2.1,0.1,0,0,17,0.1]},
  {id:59, tr:"Bezelye (Haşlanmış)", en:"Boiled Peas",           cat:"sebze",      v:[84,5.4,0.4,15.6,5.5,79,5.7,0.1,0,0.2,0,0,3,271,27,1.5,39,117,1.8,38,14,0,0.1,0,63,0.2]},
  {id:60, tr:"Kereviz",             en:"Celery",                cat:"sebze",      v:[16,0.7,0.2,3,1.6,95,1.8,0,0,0.1,0,0,80,260,40,0.2,11,24,0.1,22,3.1,0,0.3,0,36,0.1]},
  {id:61, tr:"Pırasa",              en:"Leek",                  cat:"sebze",      v:[61,1.5,0.3,14.2,1.8,83,3.9,0,0,0.1,0,0,20,180,59,2.1,28,35,0.1,83,12,0,0.9,0,64,0.2]},
  {id:62, tr:"Bamya",               en:"Okra",                  cat:"sebze",      v:[33,1.9,0.2,7.5,3.2,90,1.5,0,0,0.1,0,0,7,299,82,0.6,57,61,0.6,36,23,0,0.4,0,88,0.2]},
  {id:63, tr:"Sarımsak",            en:"Garlic",                cat:"sebze",      v:[149,6.4,0.5,33.1,2.1,59,1,0.1,0,0.2,0,0,17,401,181,1.7,25,153,1.2,0,31.2,0,0.1,0,3,1.2]},
  {id:64, tr:"Çilek",               en:"Strawberry",            cat:"meyve",      v:[32,0.7,0.3,7.7,2,91,4.9,0,0,0.2,0,0,1,153,16,0.4,13,24,0.1,1,58.8,0,0.3,0,24,0.1]},
  {id:65, tr:"Kiraz",               en:"Cherry",                cat:"meyve",      v:[63,1.1,0.2,16,2.1,82,12.8,0,0.1,0.1,0,0,0,222,13,0.4,11,21,0.1,3,7,0,0.1,0,4,0.1]},
  {id:66, tr:"Karpuz",              en:"Watermelon",            cat:"meyve",      v:[30,0.6,0.2,7.6,0.4,91,6.2,0,0,0.1,0,0,1,112,7,0.2,10,11,0.1,28,8.1,0,0.1,0,3,0.1]},
  {id:67, tr:"Kavun",               en:"Cantaloupe",            cat:"meyve",      v:[34,0.8,0.2,8.2,0.9,90,7.9,0.1,0,0.1,0,0,16,267,9,0.2,12,15,0.2,169,36.7,0,0.1,0,21,0.1]},
  {id:68, tr:"Şeftali",             en:"Peach",                 cat:"meyve",      v:[39,0.9,0.3,9.5,1.5,89,8.4,0,0.1,0.1,0,0,0,190,6,0.3,9,20,0.2,16,6.6,0,0.7,0,4,0]},
  {id:69, tr:"Kivi",                en:"Kiwi",                  cat:"meyve",      v:[61,1.1,0.5,14.7,3,83,9,0,0.1,0.3,0,0,3,312,34,0.3,17,34,0.1,4,92.7,0,1.5,0,25,0.1]},
  {id:70, tr:"Nar",                 en:"Pomegranate",           cat:"meyve",      v:[83,1.7,1.2,18.7,4,78,13.7,0.1,0.1,0.1,0,0,3,236,10,0.3,12,36,0.4,0,10.2,0,0.6,0,38,0.1]},
  {id:71, tr:"Kuru İncir",          en:"Dried Fig",             cat:"meyve",      v:[249,3.3,0.9,63.9,9.8,30,47.9,0.2,0.2,0.4,0,0,10,680,162,2,68,67,0.5,0,1.2,0,0.4,0,9,0.1]},
  {id:72, tr:"Vişne",               en:"Sour Cherry",           cat:"meyve",      v:[50,1,0.3,12.2,1.6,86,8.5,0.1,0.1,0.1,0,0,3,173,16,0.3,9,15,0.1,64,10,0,0.1,0,8,0.1]},
  {id:73, tr:"Kefir",               en:"Kefir",                 cat:"yumurta-süt",v:[41,3.3,1,4.7,0,89,4.3,0.7,0.3,0.1,0,5,40,150,130,0.1,12,93,0.4,29,0.5,0,0.1,0.3,9,0.1]},
  {id:74, tr:"Labne Peyniri",       en:"Labneh",                cat:"yumurta-süt",v:[172,10.5,13.9,3.5,0,70,3,9.1,3.8,0.5,0.5,44,365,150,200,0.2,18,170,1.2,130,0,0.3,0.3,0.6,15,0.1]},
  {id:75, tr:"Antep Fıstığı",       en:"Pistachio",             cat:"kuruyemiş",  v:[560,20.2,45.3,27.2,10.6,4,7.7,5.6,23.3,13.5,0,0,1,1025,105,3.9,121,490,2.2,26,5.6,0,2.3,0,51,1.7]},
  {id:76, tr:"Susam",               en:"Sesame Seeds",          cat:"kuruyemiş",  v:[573,17.7,49.7,23.5,11.8,5,0.3,7,18.8,21.8,0,0,11,468,975,14.6,351,629,7.8,0,0,0,0.3,0,97,0.8]},
  {id:77, tr:"Ay Çekirdeği",        en:"Sunflower Seeds",       cat:"kuruyemiş",  v:[584,20.8,51.5,20,8.6,5,2.6,4.5,18.5,23.1,0,0,9,645,78,5.3,325,660,5,50,1.4,0,35.2,0,227,1.3]},
  {id:78, tr:"Chia Tohumu",         en:"Chia Seeds",            cat:"kuruyemiş",  v:[486,16.5,30.7,42.1,34.4,6,0,3.3,2.3,23.7,0,0,16,407,631,7.7,335,860,4.6,54,1.6,0,0.5,0,49,0.6]},
  {id:79, tr:"Sucuk",               en:"Sujuk (Dry Sausage)",   cat:"et",         v:[383,21.7,32.5,1.9,0,40,1.9,12.3,14.9,2.9,0,91,1316,258,15,2.5,20,192,4.3,0,0,0.4,0.4,1.5,4,0.3]},
  {id:80, tr:"Tavuk Ciğeri",        en:"Chicken Liver",         cat:"et",         v:[119,16.9,4.8,0.7,0,76,0,1.5,1.3,1.1,0,345,71,230,11,8.5,19,297,3.7,3296,17.9,1.3,0.7,16.6,578,0.9]},
  {id:81, tr:"İstavrit",            en:"Horse Mackerel",        cat:"balık",      v:[112,19.5,3.8,0,0,77,0,0.9,1.3,1.1,0,62,90,370,34,1.4,32,218,0.8,22,0,3.8,1.1,6.4,8,0.5]},
  {id:82, tr:"Yulaf Kepeği",        en:"Oat Bran",              cat:"tahıl",      v:[246,17.3,7,66.2,15.4,5,1.4,1.4,2.4,2.9,0,0,4,566,58,5.4,235,734,3.1,0,0,0,0.8,0,52,0.2]},
  {id:83, tr:"Mercimek Çorbası",    en:"Lentil Soup",           cat:"yemek",      v:[68,4.8,1.8,9.5,3,85,1.2,0.3,0.8,0.5,0,0,380,210,18,1.5,22,78,0.6,18,2.5,0,0.3,0,38,0.1]},
  {id:84, tr:"Cacık",               en:"Cacik",                 cat:"yemek",      v:[49,3.2,2.8,3.2,0.3,90,2.9,1.8,0.8,0.1,0,10,180,160,110,0.2,14,90,0.6,20,2.1,0,0.1,0.3,8,0.1]},
  {id:85, tr:"Kısır",               en:"Kisir (Bulgur Salad)",  cat:"yemek",      v:[142,4.8,4.2,23.5,5.2,68,2.1,0.6,2.8,0.6,0,0,310,240,42,1.8,45,85,0.9,55,18,0,1.8,0,28,0.2]},
  {id:86, tr:"Izgara Köfte",        en:"Grilled Meatball",      cat:"yemek",      v:[218,16.8,15.2,3.2,0.3,63,0.8,5.8,6.2,1.4,0.4,72,380,260,25,2.1,22,164,4.2,0,0,0.1,0.3,2.2,8,0.3]},
  {id:87, tr:"Vişne Suyu",          en:"Sour Cherry Juice",     cat:"içecek",     v:[47,0.4,0.1,11.5,0.3,88,9.8,0,0,0.1,0,0,2,118,12,0.2,8,14,0.1,18,4,0,0.2,0,3,0.1]},
  {id:88, tr:"Şalgam Suyu",         en:"Turnip Juice",          cat:"içecek",     v:[18,0.8,0.2,3.5,1.2,94,2.8,0,0,0.1,0,0,680,320,55,0.8,22,38,0.3,0,15,0,0.3,0,18,0.1]},
  {id:89, tr:"Domates Suyu",        en:"Tomato Juice",          cat:"içecek",     v:[17,0.8,0.1,3.8,0.4,94,3.1,0,0,0.1,0,0,268,218,10,0.4,11,19,0.1,45,18,0,0.7,0,20,0.1]},
  {id:90, tr:"Zeytinyağlı Fasulye", en:"Green Beans Olive Oil", cat:"yemek",      v:[82,2.1,4.8,9.2,3.5,82,4.8,0.7,3.4,0.6,0,0,220,180,48,1.2,24,44,0.4,30,12,0,1.2,0,32,0.1]},
  {id:91, tr:"Pizza (Peynirli)",     en:"Cheese Pizza",         cat:"fastfood",   v:[266,11,10,33,2.3,42,3.6,4.5,3.1,1.3,0.1,20,598,172,171,2.2,22,180,1.6,145,1.2,0.2,0.7,0.7,58,0.1]},
  {id:92, tr:"Hamburger",            en:"Hamburger",            cat:"fastfood",   v:[295,17,14,26,1.3,45,5.3,5.5,5.9,1.1,0.5,45,414,232,90,2.5,22,158,3.1,15,1,0.3,0.3,1.7,45,0.2]},
  {id:93, tr:"Döner (Tavuk)",        en:"Chicken Doner",        cat:"fastfood",   v:[215,20,10.5,10,1,60,1.5,2.5,4.2,1.8,0,60,480,240,20,1.3,25,190,1.4,20,2,0.1,0.4,0.3,10,0.4]},
  {id:94, tr:"Döner (Et)",           en:"Meat Doner",           cat:"fastfood",   v:[250,18,17,7,0.8,58,1,6.5,7.2,1.2,0.6,65,520,220,18,2.4,20,175,4,5,1,0.2,0.3,1.8,8,0.3]},
  {id:95, tr:"Lahmacun",             en:"Lahmacun",             cat:"yemek",      v:[233,10.8,6.5,33,2.5,44,2.8,1.8,2.6,1.2,0,18,480,220,32,2,24,110,1.5,25,8,0,0.5,0.2,20,0.2]},
  {id:96, tr:"Pide (Kıymalı)",       en:"Pide (Minced Meat)",   cat:"yemek",      v:[248,10.5,9.2,31,1.8,42,2.1,3.8,3.5,1,0.3,25,460,180,38,1.8,20,105,1.6,15,3,0,0.4,0.2,18,0.2]},
  {id:97, tr:"Simit",                en:"Simit",                cat:"tahıl",      v:[309,9.1,7.6,52,2.6,25,2.2,1.1,3.2,3,0,0,420,140,120,2.8,32,140,1,0,0,0,0.4,0,32,0.1]},
  {id:98, tr:"Poğaça",               en:"Poğaça",               cat:"tahıl",      v:[357,7.5,18.5,40.5,1.6,25,3.2,8.5,6.8,2.1,0.4,35,410,95,60,1.6,15,90,0.7,55,0.2,0.2,1.5,0.5,25,0.1]},
  {id:99, tr:"Baklava",              en:"Baklava",              cat:"tatlı",      v:[443,6.2,25.8,49,1.8,12,32,8.5,10.2,5.5,0,30,175,105,45,1.4,25,80,0.9,45,0.3,0,1.8,0.4,15,0.1]},
  {id:100,tr:"Künefe",               en:"Kunefe",               cat:"tatlı",      v:[349,6.8,16.5,45.2,0.8,32,35,9.2,4.8,1.5,0,32,220,90,180,0.6,18,150,1,95,0.2,0.1,0.6,0.4,10,0.1]},
  {id:101,tr:"Sütlü Tatlı (Muhallebi)",en:"Milk Pudding",       cat:"tatlı",      v:[112,3.1,2.8,18.5,0,78,15.2,1.6,0.8,0.1,0,10,55,120,95,0.1,10,75,0.4,25,0.3,0.1,0,0.4,3,0]},
  {id:102,tr:"Kola",                 en:"Cola",                 cat:"içecek",     v:[41,0,0,10.5,0,89,10.5,0,0,0,0,0,4,1,3,0,0,10,0,0,0,0,0,0,0,0]},
  {id:103,tr:"Meyve Suyu (Şekerli)", en:"Sweetened Fruit Juice",cat:"içecek",     v:[46,0.2,0.1,11.2,0.2,88,10.8,0,0,0.1,0,0,5,90,8,0.2,6,10,0.1,5,15,0,0.1,0,4,0.1]},
  {id:104,tr:"Çay (Şekersiz)",       en:"Tea (Unsweetened)",    cat:"içecek",     v:[1,0,0,0.3,0,99.7,0,0,0,0,0,0,3,18,0,0,1,1,0,0,0,0,0,0,3,0]},
  {id:105,tr:"Türk Kahvesi",         en:"Turkish Coffee",       cat:"içecek",     v:[2,0.1,0,0.3,0,99,0,0,0,0,0,0,2,49,2,0,3,3,0,0,0,0,0,0,1,0]},
  {id:106,tr:"Patates Kızartması",   en:"French Fries",         cat:"fastfood",   v:[312,3.4,15,41,3.8,52,0.3,2.3,6.4,5.2,0.1,0,210,580,12,0.8,28,68,0.4,0,9.7,0,2,0,15,0.3]},
  {id:107,tr:"Cips",                 en:"Potato Chips",         cat:"fastfood",   v:[536,7,35,53,4.4,2,0.3,11.2,15.5,7.5,0.2,0,525,1200,24,1.5,60,120,0.9,0,25,0,7.5,0,45,0.4]},
  {id:108,tr:"Çikolata (Sütlü)",     en:"Milk Chocolate",       cat:"tatlı",      v:[535,7.6,29.7,59.4,3.4,1,51.5,17.8,9.5,1.9,0.1,20,79,372,189,2.4,63,208,2,50,0.3,0,0.9,0.4,10,0.1]},
  {id:109,tr:"Dondurma",             en:"Ice Cream",            cat:"tatlı",      v:[207,3.5,11,24,0.7,60,21.2,6.8,3.1,0.4,0.2,44,80,199,128,0.1,15,105,0.5,132,0.6,0.1,0.2,0.5,5,0.1]},
  {id:110,tr:"Pilav (Tereyağlı)",    en:"Rice with Butter",     cat:"tahıl",      v:[175,3.1,4.8,29,0.5,62,0.1,2.4,1.5,0.3,0.1,10,220,45,12,0.3,14,48,0.5,25,0,0,0.4,0,4,0.1]},
  {id:111,tr:"Nohutlu Pilav",        en:"Rice with Chickpeas",  cat:"yemek",      v:[155,5.2,3.5,26,3.2,65,1.8,0.6,1.2,0.8,0,0,180,150,28,1.6,32,88,0.8,10,2,0,0.5,0,42,0.1]},
  {id:112,tr:"Karnıyarık",           en:"Karniyarik",           cat:"yemek",      v:[142,7.8,8.5,10.2,2.8,72,4.5,2.8,3.5,0.8,0.3,25,320,285,25,1.4,22,85,1.5,18,10,0,0.6,0,20,0.2]},
  {id:113,tr:"Mantı",                en:"Manti",                cat:"yemek",      v:[210,8.5,7.2,28,1.5,50,1.2,2.8,2.5,1,0.2,45,380,150,45,1.6,18,105,1.1,25,1,0.1,0.4,0.4,15,0.1]},
  {id:114,tr:"Menemen",              en:"Menemen",              cat:"yemek",      v:[125,7.2,8.5,4.8,1,80,2.8,2.8,3.5,1.1,0.2,220,280,220,38,1.4,15,110,0.9,180,15,1.1,1.2,0.6,32,0.1]},
  {id:115,tr:"Etli Nohut",           en:"Chickpea and Meat Stew",cat:"yemek",     v:[168,10.2,6.8,17.5,4.8,70,2.5,2.4,2.6,0.6,0.2,25,320,255,38,2.1,35,135,1.6,8,3,0,0.4,0,88,0.1]},
  {id:116,tr:"Tavuk Şiş",            en:"Chicken Skewer",       cat:"et",         v:[172,26,6.8,0.5,0.1,65,0,1.8,2.8,1.4,0,80,340,260,15,1.1,28,215,1.1,10,1,0.1,0.3,0.3,5,0.7]},
  {id:117,tr:"Kuru Üzüm",            en:"Raisins",              cat:"meyve",      v:[299,3.1,0.5,79.2,3.7,15,59.2,0.2,0,0.1,0,0,11,749,50,1.9,32,101,0.2,0,2.3,0,0.1,0,5,0.2]},
  {id:118,tr:"Hurma",                en:"Dates",                cat:"meyve",      v:[277,1.8,0.2,75,6.7,21,66.5,0,0,0,0,0,1,696,64,0.9,54,62,0.4,0,0,0,0,0,15,0.2]},
  {id:119,tr:"Erik",                 en:"Plum",                 cat:"meyve",      v:[46,0.7,0.3,11.4,1.4,87,9.9,0,0,0.1,0,0,0,157,6,0.2,7,16,0.1,17,9.5,0,0.3,0,5,0.1]},
  {id:120,tr:"Greyfurt",             en:"Grapefruit",           cat:"meyve",      v:[42,0.8,0.1,10.7,1.6,88,6.9,0,0,0,0,0,0,135,22,0.1,9,18,0.1,58,31,0,0.1,0,10,0]}
];

// Daily Reference Intakes (adult, 2000 kcal diet — WHO/FDA/EFSA)
const DRI = [2000,50,78,275,28,null,50,20,null,null,null,300,2300,4700,1000,18,420,700,11,900,90,20,15,2.4,400,1.7];

// Turkish Dietetics Exchange List System (Değişim Listesi Sistemi)
// Official exchange values per Türkiye Diyetisyenler Derneği / Koç Üniversitesi Hastanesi standard
// Clinical lab reference ranges (adult) with diet-relevant flagging rules
const LAB_TESTS = [
  {id:"hba1c", nameTr:"HbA1c", nameEn:"HbA1c", unit:"%",
   ranges:[{max:5.7,label:"normal",tr:"Normal",en:"Normal"},{max:6.5,label:"warn",tr:"Prediyabet",en:"Prediabetes"},{max:99,label:"high",tr:"Diyabet aralığı",en:"Diabetes range"}],
   adviceTr:"Kompleks karbonhidrat, düşük GI beslenme ve öğün sıklığı düzenlemesi önerilir.",
   adviceEn:"Complex carbohydrates, low-GI eating, and regular meal timing are recommended."},
  {id:"glucose", nameTr:"Açlık Kan Şekeri", nameEn:"Fasting Glucose", unit:"mg/dL",
   ranges:[{max:100,label:"normal",tr:"Normal",en:"Normal"},{max:126,label:"warn",tr:"Prediyabet",en:"Prediabetes"},{max:999,label:"high",tr:"Diyabet aralığı",en:"Diabetes range"}],
   adviceTr:"Basit şeker ve rafine karbonhidrat kısıtlaması, lifli gıdalar artırılmalı.",
   adviceEn:"Restrict simple sugars and refined carbs; increase fiber-rich foods."},
  {id:"ldl", nameTr:"LDL Kolesterol", nameEn:"LDL Cholesterol", unit:"mg/dL",
   ranges:[{max:100,label:"normal",tr:"Optimal",en:"Optimal"},{max:130,label:"warn",tr:"Sınırda Yüksek",en:"Borderline"},{max:999,label:"high",tr:"Yüksek",en:"High"}],
   adviceTr:"Doymuş yağ ve trans yağ kısıtlanmalı; çözünür lif (yulaf, baklagil) ve omega-3 artırılmalı.",
   adviceEn:"Restrict saturated and trans fats; increase soluble fiber (oats, legumes) and omega-3."},
  {id:"hdl", nameTr:"HDL Kolesterol", nameEn:"HDL Cholesterol", unit:"mg/dL",
   ranges:[{max:40,label:"high",tr:"Düşük (Risk)",en:"Low (Risk)"},{max:60,label:"warn",tr:"Kabul Edilebilir",en:"Acceptable"},{max:999,label:"normal",tr:"İyi",en:"Good"}],
   adviceTr:"Zeytinyağı, yağlı balık ve düzenli fiziksel aktivite HDL'yi yükseltmeye yardımcı olur.",
   adviceEn:"Olive oil, fatty fish, and regular physical activity help raise HDL."},
  {id:"triglyceride", nameTr:"Trigliserit", nameEn:"Triglycerides", unit:"mg/dL",
   ranges:[{max:150,label:"normal",tr:"Normal",en:"Normal"},{max:200,label:"warn",tr:"Sınırda Yüksek",en:"Borderline"},{max:9999,label:"high",tr:"Yüksek",en:"High"}],
   adviceTr:"Basit şeker, alkol ve rafine karbonhidrat kısıtlanmalı; Akdeniz tipi beslenme önerilir.",
   adviceEn:"Restrict simple sugars, alcohol, and refined carbs; Mediterranean-style eating recommended."},
  {id:"totalChol", nameTr:"Toplam Kolesterol", nameEn:"Total Cholesterol", unit:"mg/dL",
   ranges:[{max:200,label:"normal",tr:"İstenen",en:"Desirable"},{max:240,label:"warn",tr:"Sınırda Yüksek",en:"Borderline"},{max:9999,label:"high",tr:"Yüksek",en:"High"}],
   adviceTr:"Doymuş yağ kısıtlaması ve lifli gıda artışı önerilir.",
   adviceEn:"Reduce saturated fat and increase fiber intake."},
  {id:"vitD", nameTr:"Vitamin D", nameEn:"Vitamin D", unit:"ng/mL",
   ranges:[{max:20,label:"high",tr:"Eksiklik",en:"Deficient"},{max:30,label:"warn",tr:"Yetersiz",en:"Insufficient"},{max:999,label:"normal",tr:"Yeterli",en:"Sufficient"}],
   adviceTr:"Yağlı balık, yumurta sarısı; güneşlenme ve takviye için hekime danışılmalı.",
   adviceEn:"Fatty fish, egg yolk; consult physician for sun exposure and supplementation."},
  {id:"vitB12", nameTr:"Vitamin B12", nameEn:"Vitamin B12", unit:"pg/mL",
   ranges:[{max:200,label:"high",tr:"Düşük",en:"Low"},{max:300,label:"warn",tr:"Sınırda",en:"Borderline"},{max:9999,label:"normal",tr:"Normal",en:"Normal"}],
   adviceTr:"Kırmızı et, yumurta, süt ürünleri artırılmalı; vegan/vejetaryenlerde takviye değerlendirilmeli.",
   adviceEn:"Increase red meat, eggs, dairy; consider supplementation for vegans/vegetarians."},
  {id:"ferritin", nameTr:"Ferritin", nameEn:"Ferritin", unit:"ng/mL",
   ranges:[{max:15,label:"high",tr:"Demir Eksikliği",en:"Iron Deficiency"},{max:30,label:"warn",tr:"Düşük-Sınır",en:"Low-Borderline"},{max:999,label:"normal",tr:"Normal",en:"Normal"}],
   adviceTr:"Kırmızı et, yeşil yapraklılar, C vitamini ile birlikte tüketim emilimi artırır.",
   adviceEn:"Red meat, leafy greens; pairing with vitamin C enhances absorption."},
  {id:"tsh", nameTr:"TSH", nameEn:"TSH", unit:"mIU/L",
   ranges:[{max:0.4,label:"warn",tr:"Düşük",en:"Low"},{max:4.0,label:"normal",tr:"Normal",en:"Normal"},{max:99,label:"warn",tr:"Yüksek",en:"High"}],
   adviceTr:"Tiroid fonksiyonu için iyot, selenyum ve çinko açısından dengeli beslenme önemlidir.",
   adviceEn:"Balanced iodine, selenium, and zinc intake matters for thyroid function."},
  {id:"creatinine", nameTr:"Kreatinin", nameEn:"Creatinine", unit:"mg/dL",
   ranges:[{max:1.3,label:"normal",tr:"Normal",en:"Normal"},{max:1.8,label:"warn",tr:"Sınırda Yüksek",en:"Borderline"},{max:99,label:"high",tr:"Yüksek",en:"High"}],
   adviceTr:"Protein ve sodyum kısıtlaması gerekebilir; nefroloji diyetisyeni ile değerlendirilmeli.",
   adviceEn:"Protein and sodium restriction may be needed; consult a renal dietitian."},
];
function getLabStatus(testId,value){
  const test=LAB_TESTS.find(t=>t.id===testId);
  if(!test||value==null||isNaN(value))return null;
  for(const r of test.ranges){if(value<=r.max)return r;}
  return test.ranges[test.ranges.length-1];
}

// Official exchange values per Türkiye Diyetisyenler Derneği / Koç Üniversitesi Hastanesi standard
const EXCHANGE_GROUPS = [
  {id:"milkFull", nameTr:"Süt Grubu (Tam Yağlı)", nameEn:"Milk Group (Whole-fat)", icon:"🥛", carb:9, protein:6, fat:6,
   foodsTr:[{n:"Süt (tam yağlı)",a:"1 su bardağı (200ml)"},{n:"Yoğurt (tam yağlı)",a:"¾ su bardağı (150g)"},{n:"Ev yoğurdu",a:"1 su bardağı (200g)"},{n:"Ayran",a:"1.5 su bardağı (300ml)"},{n:"Kefir",a:"1 su bardağı (200ml)"}],
   foodsEn:[{n:"Whole milk",a:"1 cup (200ml)"},{n:"Whole-fat yogurt",a:"¾ cup (150g)"},{n:"Homemade yogurt",a:"1 cup (200g)"},{n:"Ayran",a:"1.5 cups (300ml)"},{n:"Kefir",a:"1 cup (200ml)"}]},
  {id:"milkHalf", nameTr:"Süt Grubu (Yarım Yağlı)", nameEn:"Milk Group (Half-fat)", icon:"🥛", carb:9, protein:6, fat:3,
   foodsTr:[{n:"Süt (yarım yağlı)",a:"1 su bardağı (200ml)"},{n:"Yoğurt (yarım yağlı)",a:"¾ su bardağı (150g)"}],
   foodsEn:[{n:"Half-fat milk",a:"1 cup (200ml)"},{n:"Half-fat yogurt",a:"¾ cup (150g)"}]},
  {id:"milkFree", nameTr:"Süt Grubu (Yağsız)", nameEn:"Milk Group (Fat-free)", icon:"🥛", carb:9, protein:6, fat:0,
   foodsTr:[{n:"Süt (yağsız)",a:"1 su bardağı (200ml)"},{n:"Yoğurt (yağsız)",a:"¾ su bardağı (150g)"},{n:"Laktozsuz süt",a:"1 su bardağı (200ml)"}],
   foodsEn:[{n:"Skim milk",a:"1 cup (200ml)"},{n:"Fat-free yogurt",a:"¾ cup (150g)"},{n:"Lactose-free milk",a:"1 cup (200ml)"}]},
  {id:"meat", nameTr:"Et, Peynir, Yumurta Grubu", nameEn:"Meat, Cheese, Egg Group", icon:"🍗", carb:0, protein:6, fat:5,
   foodsTr:[{n:"Kırmızı et (orta yağlı, kuşbaşı)",a:"3 orta boy (30g çiğ)"},{n:"Kıyma",a:"1 yemek kaşığı (30g çiğ)"},{n:"Köfte",a:"1 küçük yumurta boyutu (40g çiğ)"},{n:"Tavuk göğüs fileto",a:"¼ küçük boy (30g çiğ)"},{n:"Tavuk baget (kemiksiz)",a:"1 küçük boy (30g çiğ)"},{n:"Levrek",a:"1/5 küçük boy (55g çiğ)"},{n:"Somon",a:"2 parmak boyutu (40g çiğ)"},{n:"Yumurta (tavuk)",a:"1 küçük boy (55g)"},{n:"Beyaz peynir (tam yağlı)",a:"2 parmak boyutu (40g)"},{n:"Kaşar peyniri",a:"3 yarım parmak boyutu (30g)"},{n:"Lor peyniri",a:"3 yemek kaşığı (50g)"}],
   foodsEn:[{n:"Red meat (medium-fat, diced)",a:"3 medium pieces (30g raw)"},{n:"Ground meat",a:"1 tbsp (30g raw)"},{n:"Meatball",a:"1 small egg size (40g raw)"},{n:"Chicken breast fillet",a:"¼ small piece (30g raw)"},{n:"Chicken drumstick (boneless)",a:"1 small piece (30g raw)"},{n:"Sea bass",a:"1/5 small piece (55g raw)"},{n:"Salmon",a:"2 finger-widths (40g raw)"},{n:"Egg (chicken)",a:"1 small (55g)"},{n:"Feta cheese (full-fat)",a:"2 finger-widths (40g)"},{n:"Kashar cheese",a:"3 half finger-widths (30g)"},{n:"Cottage cheese (lor)",a:"3 tbsp (50g)"}]},
  {id:"bread", nameTr:"Ekmek, Tahıl, Kurubaklagil Grubu", nameEn:"Bread, Grain & Legume Group", icon:"🍞", carb:15, protein:2, fat:0,
   foodsTr:[{n:"Beyaz/buğday ekmek",a:"1 ince dilim (25g)"},{n:"Çavdar/yulaf/tam buğday/kepekli ekmek",a:"1 ince dilim (30g)"},{n:"Pirinç pilavı (pişmiş)",a:"2 yemek kaşığı (20g çiğ)"},{n:"Bulgur pilavı (pişmiş)",a:"3 yemek kaşığı (20g çiğ)"},{n:"Makarna (pişmiş)",a:"3 yemek kaşığı (20g çiğ)"},{n:"Patates",a:"1 küçük boy (100g pişmiş)"},{n:"Nohut/kuru fasulye (pişmiş)",a:"3 yemek kaşığı (25g çiğ)"},{n:"Mercimek (pişmiş)",a:"2 yemek kaşığı (25g çiğ)"},{n:"Yulaf ezmesi",a:"2 yemek kaşığı (25g)"},{n:"Mısır (koçan)",a:"1 küçük boy (90g)"}],
   foodsEn:[{n:"White/wheat bread",a:"1 thin slice (25g)"},{n:"Rye/oat/whole wheat bread",a:"1 thin slice (30g)"},{n:"Cooked rice",a:"2 tbsp (20g raw)"},{n:"Cooked bulgur",a:"3 tbsp (20g raw)"},{n:"Cooked pasta",a:"3 tbsp (20g raw)"},{n:"Potato",a:"1 small (100g cooked)"},{n:"Chickpeas/white beans (cooked)",a:"3 tbsp (25g raw)"},{n:"Lentils (cooked)",a:"2 tbsp (25g raw)"},{n:"Oatmeal",a:"2 tbsp (25g)"},{n:"Corn (on cob)",a:"1 small (90g)"}]},
  {id:"vegetable", nameTr:"Sebze Grubu", nameEn:"Vegetable Group", icon:"🥦", carb:6, protein:2, fat:0,
   foodsTr:[{n:"Domates",a:"1 büyük boy (200g)"},{n:"Salatalık",a:"2 orta boy (200g)"},{n:"Havuç (pişmiş)",a:"5-6 yemek kaşığı"},{n:"Brokoli (çiğ)",a:"7 karışık boy çiçek (125g)"},{n:"Ispanak (çiğ)",a:"1 orta bağ (200g)"},{n:"Patlıcan (çiğ)",a:"1 büyük boy (200g)"},{n:"Kabak (çiğ)",a:"1 büyük boy (250g)"},{n:"Karnabahar (çiğ)",a:"3 orta boy çiçek (150g)"},{n:"Taze fasulye (çiğ)",a:"6 orta boy (85g)"},{n:"Biber, dolmalık",a:"3 büyük boy (150g)"}],
   foodsEn:[{n:"Tomato",a:"1 large (200g)"},{n:"Cucumber",a:"2 medium (200g)"},{n:"Carrot (cooked)",a:"5-6 tbsp"},{n:"Broccoli (raw)",a:"7 mixed florets (125g)"},{n:"Spinach (raw)",a:"1 medium bunch (200g)"},{n:"Eggplant (raw)",a:"1 large (200g)"},{n:"Zucchini (raw)",a:"1 large (250g)"},{n:"Cauliflower (raw)",a:"3 medium florets (150g)"},{n:"Green beans (raw)",a:"6 medium (85g)"},{n:"Bell pepper",a:"3 large (150g)"}]},
  {id:"fruit", nameTr:"Meyve Grubu", nameEn:"Fruit Group", icon:"🍎", carb:15, protein:0, fat:0,
   foodsTr:[{n:"Elma",a:"1 orta boy (120g net)"},{n:"Armut",a:"1 küçük boy (125g net)"},{n:"Muz",a:"1 küçük boy (85g net)"},{n:"Portakal",a:"1 orta boy (140g net)"},{n:"Mandalina",a:"2 orta boy (140g net)"},{n:"Çilek",a:"18 orta boy (300g)"},{n:"Üzüm",a:"25 karışık boy (100g)"},{n:"Karpuz",a:"1/8 orta boyun yarısı (220g net)"},{n:"Kiraz",a:"11 büyük boy (110g net)"},{n:"Kayısı",a:"7 orta boy (175g net)"},{n:"Kuru kayısı",a:"4 küçük boy (25g)"},{n:"Kuru üzüm",a:"1 yemek kaşığı (20g)"}],
   foodsEn:[{n:"Apple",a:"1 medium (120g net)"},{n:"Pear",a:"1 small (125g net)"},{n:"Banana",a:"1 small (85g net)"},{n:"Orange",a:"1 medium (140g net)"},{n:"Tangerine",a:"2 medium (140g net)"},{n:"Strawberries",a:"18 medium (300g)"},{n:"Grapes",a:"25 mixed (100g)"},{n:"Watermelon",a:"1/8 half medium (220g net)"},{n:"Cherries",a:"11 large (110g net)"},{n:"Apricot",a:"7 medium (175g net)"},{n:"Dried apricot",a:"4 small (25g)"},{n:"Raisins",a:"1 tbsp (20g)"}]},
  {id:"fat", nameTr:"Yağ Grubu", nameEn:"Fat Group", icon:"🫒", carb:0, protein:0, fat:5,
   foodsTr:[{n:"Sıvı yağ (zeytinyağı, ayçiçek, mısır)",a:"1 tatlı kaşığı (5g)"},{n:"Siyah/yeşil zeytin",a:"10 orta boy (35g net)"},{n:"Avokado",a:"¼ küçük boy (40g net)"},{n:"Tereyağı",a:"1 tatlı kaşığı (5g)"}],
   foodsEn:[{n:"Liquid oil (olive, sunflower, corn)",a:"1 tsp (5g)"},{n:"Black/green olives",a:"10 medium (35g net)"},{n:"Avocado",a:"¼ small (40g net)"},{n:"Butter",a:"1 tsp (5g)"}]},
  {id:"nuts", nameTr:"Yağlı Tohumlar ve Sert Kabuklu Yemişler", nameEn:"Oil Seeds & Nuts Group", icon:"🥜", carb:1.5, protein:2, fat:5,
   foodsTr:[{n:"Ceviz",a:"2 bütün orta boy (10g net)"},{n:"Badem",a:"10 orta boy (10g net)"},{n:"Fındık",a:"8 orta boy (10g net)"},{n:"Antep fıstığı",a:"15 orta boy (10g net)"},{n:"Yer fıstığı",a:"13 orta boy (10g net)"},{n:"Ay çekirdeği",a:"3 yemek kaşığı (10g net)"},{n:"Kabak çekirdeği",a:"2 yemek kaşığı (10g net)"}],
   foodsEn:[{n:"Walnut",a:"2 whole medium (10g net)"},{n:"Almond",a:"10 medium (10g net)"},{n:"Hazelnut",a:"8 medium (10g net)"},{n:"Pistachio",a:"15 medium (10g net)"},{n:"Peanut",a:"13 medium (10g net)"},{n:"Sunflower seeds",a:"3 tbsp (10g net)"},{n:"Pumpkin seeds",a:"2 tbsp (10g net)"}]},
  {id:"sugar", nameTr:"Şeker ve Şekerli Besinler Grubu", nameEn:"Sugar & Sweets Group", icon:"🍯", carb:15, protein:0, fat:0,
   foodsTr:[{n:"Kesme şeker",a:"5-6 adet (15g)"},{n:"Toz şeker",a:"3 silme tatlı kaşığı (15g)"},{n:"Bal",a:"2.5 silme tatlı kaşığı (20g)"},{n:"Pekmez",a:"1 yemek kaşığı (20g)"},{n:"Reçel/marmelat",a:"3 silme tatlı kaşığı (15g)"},{n:"Çikolata",a:"3 küçük parça (20g)"}],
   foodsEn:[{n:"Sugar cubes",a:"5-6 pieces (15g)"},{n:"Granulated sugar",a:"3 level tsp (15g)"},{n:"Honey",a:"2.5 level tsp (20g)"},{n:"Grape molasses",a:"1 tbsp (20g)"},{n:"Jam/marmalade",a:"3 level tsp (15g)"},{n:"Chocolate",a:"3 small pieces (20g)"}]},
];
// Derived kcal per exchange (4-4-9 rule) computed at runtime via exchangeKcal()
function exchangeKcal(g){ return Math.round(g.carb*4 + g.protein*4 + g.fat*9); }

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

  {id:"diabetes1",tr:"Tip 1 Diyabet",en:"Type 1 Diabetes",icon:"💉",warn:true,
   ovTr:"İnsülin dozları ile karbonhidrat alımının dengelenmesi esastır. Karbonhidrat sayımı (karb sayma) ve tutarlı öğün saatleri kan şekeri kontrolünü destekler.",
   ovEn:"Balancing insulin doses with carbohydrate intake is essential. Carbohydrate counting and consistent meal timing support blood glucose control.",
   resTr:["Ani karbonhidrat sıçramaları yaratan şekerli gıdalar","Düzensiz öğün atlamaları","Aşırı basit şeker"],
   resEn:["Sugary foods causing rapid carb spikes","Irregular meal skipping","Excess simple sugar"],
   recTr:["Karbonhidrat sayımı yapılmış öğünler","Düşük GI kompleks karbonhidratlar","Düzenli öğün ve ara öğün saatleri","Lifli gıdalar"],
   recEn:["Meals with carb counting","Low-GI complex carbohydrates","Regular meal and snack timing","Fiber-rich foods"],
   avTr:["Şekerli tatlılar (insülin ayarlanmadan)","Meyve suları","Öğün atlama"],
   avEn:["Sugary desserts (without insulin adjustment)","Fruit juices","Skipping meals"],
   mTr:{b:"Yumurta + tam tahıllı ekmek (karb sayılmış)",l:"Tavuk + bulgur (ölçülü porsiyon)",d:"Balık + sebze + kontrollü karbonhidrat",s:"Karbonhidratı hesaplanmış meyve"},
   mEn:{b:"Eggs + whole grain bread (carbs counted)",l:"Chicken + bulgur (measured portion)",d:"Fish + vegetables + controlled carbs",s:"Fruit with carbs calculated"}},

  {id:"dyslipidemia",tr:"Hiperlipidemi (Yüksek Kolesterol)",en:"Dyslipidemia (High Cholesterol)",icon:"🫀",
   ovTr:"LDL kolesterolü düşürmeye ve HDL'yi desteklemeye yönelik, doymuş yağ ve trans yağdan kısıtlı, çözünür lif ve omega-3 açısından zengin bir beslenme planı.",
   ovEn:"A nutrition plan restricted in saturated and trans fats, rich in soluble fiber and omega-3s, aimed at lowering LDL and supporting HDL cholesterol.",
   resTr:["Doymuş yağlar (kırmızı et, tam yağlı süt ürünleri)","Trans yağlar (margarin, işlenmiş gıdalar)","Yüksek kolesterollü sakatat"],
   resEn:["Saturated fats (red meat, full-fat dairy)","Trans fats (margarine, processed foods)","High-cholesterol organ meats"],
   recTr:["Yulaf ve çözünür lif kaynakları","Balık (omega-3 için haftada 2-3 kez)","Zeytinyağı","Ceviz ve badem","Baklagiller"],
   recEn:["Oats and soluble fiber sources","Fish (omega-3, 2-3 times/week)","Olive oil","Walnuts and almonds","Legumes"],
   avTr:["Kızartmalar","Tam yağlı süt ürünleri","İşlenmiş et ürünleri","Hazır pastane ürünleri"],
   avEn:["Fried foods","Full-fat dairy","Processed meats","Store-bought pastries"],
   mTr:{b:"Yulaf ezmesi + ceviz + yaban mersini",l:"Izgara somon + kinoa + yeşil salata",d:"Baklagil yemeği + bol sebze + zeytinyağı",s:"Badem + elma"},
   mEn:{b:"Oatmeal + walnuts + blueberries",l:"Grilled salmon + quinoa + green salad",d:"Legume dish + vegetables + olive oil",s:"Almonds + apple"}},

  {id:"metabolicSyndrome",tr:"Metabolik Sendrom",en:"Metabolic Syndrome",icon:"⚡",
   ovTr:"Bel çevresi, kan basıncı, kan şekeri ve lipid profilini birlikte iyileştirmeye yönelik düşük glisemik yüklü, Akdeniz tarzı bir beslenme yaklaşımı.",
   ovEn:"A low glycemic load, Mediterranean-style approach aimed at improving waist circumference, blood pressure, blood sugar, and lipid profile together.",
   resTr:["Rafine karbonhidratlar","Şekerli içecekler","Aşırı tuz","Doymuş yağlar"],
   resEn:["Refined carbohydrates","Sugary drinks","Excess salt","Saturated fats"],
   recTr:["Akdeniz diyeti prensipleri (zeytinyağı, balık, sebze)","Tam tahıllar","Düzenli fiziksel aktivite ile birlikte","Lifli gıdalar"],
   recEn:["Mediterranean diet principles (olive oil, fish, vegetables)","Whole grains","Combined with regular physical activity","Fiber-rich foods"],
   avTr:["Fast food","Şekerli atıştırmalıklar","Alkol (aşırı)","İşlenmiş gıdalar"],
   avEn:["Fast food","Sugary snacks","Excess alcohol","Processed foods"],
   mTr:{b:"Yumurta + avokado + tam tahıllı ekmek",l:"Izgara balık + bulgur + salata",d:"Tavuk + sebze + zeytinyağı",s:"Karışık kuruyemiş"},
   mEn:{b:"Eggs + avocado + whole grain bread",l:"Grilled fish + bulgur + salad",d:"Chicken + vegetables + olive oil",s:"Mixed nuts"}},

  {id:"lactoseIntolerance",tr:"Laktoz İntoleransı",en:"Lactose Intolerance",icon:"🥛",
   ovTr:"Laktoz içeren süt ürünlerinin kısıtlanması veya laktozsuz alternatiflerle değiştirilmesi gerekir. Kalsiyum alımının başka kaynaklardan desteklenmesi önemlidir.",
   ovEn:"Lactose-containing dairy must be restricted or replaced with lactose-free alternatives. Calcium intake should be supported from other sources.",
   resTr:["Normal süt","Yumuşak/taze peynirler (yüksek laktoz)","Dondurma","Kremalı tatlılar"],
   resEn:["Regular milk","Soft/fresh cheeses (high lactose)","Ice cream","Cream-based desserts"],
   recTr:["Laktozsuz süt ve ürünleri","Sert peynirler (düşük laktoz)","Badem/soya sütü","Kalsiyum takviyeli bitkisel içecekler"],
   recEn:["Lactose-free milk and products","Hard cheeses (low lactose)","Almond/soy milk","Calcium-fortified plant beverages"],
   avTr:["Normal süt tozu içeren işlenmiş gıdalar","Krema","Tereyağlı hamur işleri"],
   avEn:["Processed foods with milk powder","Cream","Butter-based pastries"],
   mTr:{b:"Laktozsuz süt + yulaf + meyve",l:"Tavuk + sert peynir + salata",d:"Balık + sebze + badem sütü sos",s:"Badem + laktozsuz yoğurt"},
   mEn:{b:"Lactose-free milk + oats + fruit",l:"Chicken + hard cheese + salad",d:"Fish + vegetables + almond milk sauce",s:"Almonds + lactose-free yogurt"}},

  {id:"crohns",tr:"Crohn Hastalığı",en:"Crohn's Disease",icon:"🔥",warn:true,
   ovTr:"Alevlenme döneminde düşük lifli, sindirimi kolay; remisyon döneminde ise dengeli bir beslenme yaklaşımı gerekir. Bireysel tetikleyiciler mutlaka takip edilmelidir.",
   ovEn:"During flare-ups a low-fiber, easily digestible diet is needed; during remission a balanced approach is used. Individual triggers must always be tracked.",
   resTr:["Alevlenmede yüksek lifli çiğ sebzeler","Baharatlı yiyecekler","Aşırı yağlı gıdalar","Kafein ve alkol"],
   resEn:["High-fiber raw vegetables during flares","Spicy foods","Very fatty foods","Caffeine and alcohol"],
   recTr:["Pişmiş, kabuğu soyulmuş sebzeler","Yağsız protein","Beyaz pirinç, muz gibi kolay sindirilenler","Küçük sık öğünler"],
   recEn:["Cooked, peeled vegetables","Lean protein","Easily digested foods like white rice, banana","Small frequent meals"],
   avTr:["Kabuklu/çiğ meyve-sebze (alevlenmede)","Kızartmalar","Aşırı lifli tam tahıllar (alevlenmede)"],
   avEn:["Raw/skinned fruit-vegetables (during flares)","Fried foods","High-fiber whole grains (during flares)"],
   mTr:{b:"Haşlanmış yumurta + beyaz ekmek",l:"Haşlanmış tavuk + beyaz pirinç + pişmiş havuç",d:"Balık + patates püresi",s:"Muz"},
   mEn:{b:"Boiled egg + white bread",l:"Boiled chicken + white rice + cooked carrot",d:"Fish + mashed potato",s:"Banana"}},

  {id:"fattyLiver",tr:"Karaciğer Yağlanması (NAFLD)",en:"Fatty Liver (NAFLD)",icon:"🫁",
   ovTr:"Kilo yönetimi, basit şeker ve fruktoz kısıtlaması ile karaciğer yağlanmasını azaltmaya yönelik bir beslenme planı. Kilo kaybı en etkili tedavi yaklaşımıdır.",
   ovEn:"A nutrition plan focused on weight management and restricting simple sugar and fructose to reduce liver fat. Weight loss is the most effective approach.",
   resTr:["Şekerli içecekler (fruktoz şurubu)","Rafine karbonhidratlar","Alkol","Kızartmalar"],
   resEn:["Sugary drinks (fructose syrup)","Refined carbohydrates","Alcohol","Fried foods"],
   recTr:["Sebze ve lifli gıdalar","Yağsız protein","Zeytinyağı (ölçülü)","Kahve (karaciğer için koruyucu, ölçülü)"],
   recEn:["Vegetables and fiber-rich foods","Lean protein","Olive oil (in moderation)","Coffee (protective for liver, moderate amount)"],
   avTr:["Şekerli meşrubatlar","Fast food","Beyaz ekmek/pirinç (aşırı)","Alkol"],
   avEn:["Sugary soft drinks","Fast food","White bread/rice (excess)","Alcohol"],
   mTr:{b:"Yumurta + sebze + tam tahıllı ekmek",l:"Izgara tavuk + bulgur + salata",d:"Balık + bol sebze",s:"Elma + kahve"},
   mEn:{b:"Eggs + vegetables + whole grain bread",l:"Grilled chicken + bulgur + salad",d:"Fish + plenty of vegetables",s:"Apple + coffee"}},

  {id:"gallbladder",tr:"Safra Kesesi Hastalığı",en:"Gallbladder Disease",icon:"🟡",
   ovTr:"Safra kesesi kasılmasını tetikleyen yüksek yağlı gıdalardan kaçınarak, küçük ve düşük yağlı öğünlere dayalı bir beslenme planı.",
   ovEn:"A nutrition plan based on small, low-fat meals, avoiding high-fat foods that trigger gallbladder contraction.",
   resTr:["Kızartmalar","Yağlı kırmızı et","Tam yağlı süt ürünleri","Çok büyük porsiyonlu öğünler"],
   resEn:["Fried foods","Fatty red meat","Full-fat dairy","Very large meal portions"],
   recTr:["Yağsız protein (tavuk, balık)","Az yağlı süt ürünleri","Sebze ve meyveler","Küçük sık öğünler"],
   recEn:["Lean protein (chicken, fish)","Low-fat dairy","Vegetables and fruits","Small frequent meals"],
   avTr:["Kızartılmış yiyecekler","Yağlı soslar","Tam yağlı krema","Çikolata (aşırı)"],
   avEn:["Fried foods","Fatty sauces","Full-fat cream","Chocolate (excess)"],
   mTr:{b:"Yağsız yoğurt + meyve",l:"Haşlanmış tavuk + sebze + az pirinç",d:"Izgara balık + buharda sebze",s:"Elma"},
   mEn:{b:"Low-fat yogurt + fruit",l:"Boiled chicken + vegetables + small rice",d:"Grilled fish + steamed vegetables",s:"Apple"}},

  {id:"gestationalDiabetes",tr:"Gebelik Diyabeti",en:"Gestational Diabetes",icon:"🤰",warn:true,
   ovTr:"Anne ve bebek sağlığı için kan şekerini kontrol altında tutmaya yönelik, düşük glisemik indeksli, düzenli aralıklarla küçük öğünlere dayalı bir beslenme planı.",
   ovEn:"A low glycemic index nutrition plan with small, regular meals to keep blood sugar controlled for the health of mother and baby.",
   resTr:["Basit şekerler","Meyve suları","Beyaz ekmek/pirinç (aşırı)","Şekerli atıştırmalıklar"],
   resEn:["Simple sugars","Fruit juices","White bread/rice (excess)","Sugary snacks"],
   recTr:["Kompleks karbonhidratlar (tam tahıl)","Yağsız protein her öğünde","Sebzeler","Düzenli aralıklı küçük öğünler (3 ana + 2-3 ara)"],
   recEn:["Complex carbohydrates (whole grain)","Lean protein at every meal","Vegetables","Regular small meals (3 main + 2-3 snacks)"],
   avTr:["Şekerli tatlılar","Meyve suyu","Beyaz un ürünleri","Öğün atlamak"],
   avEn:["Sugary desserts","Fruit juice","White flour products","Skipping meals"],
   mTr:{b:"Yumurta + tam tahıllı ekmek + domates",l:"Tavuk + bulgur + bol salata",d:"Balık + sebze + az bulgur",s:"Badem + peynir"},
   mEn:{b:"Eggs + whole grain bread + tomato",l:"Chicken + bulgur + plenty of salad",d:"Fish + vegetables + small bulgur",s:"Almonds + cheese"}},

  {id:"pregnancy",tr:"Hamilelik Beslenmesi",en:"Pregnancy Nutrition",icon:"🤱",
   ovTr:"Folat, demir, kalsiyum ve D vitamini ihtiyacının arttığı, dengeli ve çeşitli bir beslenme planı. Bazı gıdalardan kaçınmak gebelik güvenliği için önemlidir.",
   ovEn:"A balanced, varied nutrition plan addressing increased folate, iron, calcium, and vitamin D needs. Avoiding certain foods is important for pregnancy safety.",
   resTr:["Çiğ/az pişmiş et ve yumurta","Pastörize edilmemiş süt ürünleri","Yüksek cıvalı balıklar","Alkol"],
   resEn:["Raw/undercooked meat and eggs","Unpasteurized dairy products","High-mercury fish","Alcohol"],
   recTr:["Folat kaynakları (yeşil yapraklılar, baklagil)","Demir kaynakları (kırmızı et, ıspanak)","Kalsiyum (süt ürünleri)","Omega-3 (düşük cıvalı balık)"],
   recEn:["Folate sources (leafy greens, legumes)","Iron sources (red meat, spinach)","Calcium (dairy)","Omega-3 (low-mercury fish)"],
   avTr:["Sushi/çiğ balık","Pastörize edilmemiş peynir","Aşırı kafein","Alkol"],
   avEn:["Sushi/raw fish","Unpasteurized cheese","Excess caffeine","Alcohol"],
   mTr:{b:"Yumurta + tam tahıllı ekmek + ıspanak",l:"Kırmızı et + mercimek + salata",d:"Somon (iyi pişmiş) + sebze",s:"Yoğurt + meyve"},
   mEn:{b:"Eggs + whole grain bread + spinach",l:"Red meat + lentils + salad",d:"Salmon (well-cooked) + vegetables",s:"Yogurt + fruit"}},

  {id:"sarcopenia",tr:"Sarkopeni / Yaşlılık Beslenmesi",en:"Sarcopenia / Elderly Nutrition",icon:"👴",
   ovTr:"Kas kütlesi kaybını önlemeye yönelik yüksek kaliteli protein, D vitamini ve yeterli kalori alımına odaklanan bir beslenme planı. Direnç egzersizi ile desteklenmelidir.",
   ovEn:"A nutrition plan focused on high-quality protein, vitamin D, and adequate calorie intake to prevent muscle mass loss. Should be supported with resistance exercise.",
   resTr:["Yetersiz protein alımı","Aşırı düşük kalorili diyetler","İşlenmiş gıdalarla dolu beslenme"],
   resEn:["Insufficient protein intake","Overly low-calorie diets","Diet full of processed foods"],
   recTr:["Her öğünde kaliteli protein (et, yumurta, süt ürünleri)","D vitamini kaynakları","Lifli sebze ve meyveler","Yeterli sıvı alımı"],
   recEn:["Quality protein at every meal (meat, eggs, dairy)","Vitamin D sources","Fibrous vegetables and fruits","Adequate fluid intake"],
   avTr:["Aşırı kısıtlayıcı diyetler","Öğün atlamak","Düşük proteinli beslenme"],
   avEn:["Overly restrictive diets","Skipping meals","Low-protein eating"],
   mTr:{b:"2 yumurta + peynir + tam tahıllı ekmek",l:"Kırmızı et veya tavuk + bulgur + sebze",d:"Balık + patates + yoğurt",s:"Süt + kuruyemiş"},
   mEn:{b:"2 eggs + cheese + whole grain bread",l:"Red meat or chicken + bulgur + vegetables",d:"Fish + potato + yogurt",s:"Milk + nuts"}},

  {id:"kidneyStones",tr:"Böbrek Taşı",en:"Kidney Stones",icon:"💎",
   ovTr:"Taş oluşumunu azaltmaya yönelik bol sıvı tüketimi, oksalat ve sodyum kısıtlamasına dayalı bir beslenme planı. Taş tipine göre kişiselleştirilmelidir.",
   ovEn:"A nutrition plan based on high fluid intake and oxalate/sodium restriction to reduce stone formation. Should be personalized by stone type.",
   resTr:["Yüksek oksalatlı gıdalar (ıspanak, pancar, kakao — aşırı)","Aşırı tuz","Aşırı hayvansal protein","Yetersiz sıvı"],
   resEn:["High-oxalate foods (spinach, beetroot, cocoa — excess)","Excess salt","Excess animal protein","Insufficient fluid"],
   recTr:["Bol su (günde 2.5-3 litre)","Kalsiyum içeren gıdalar (yemekle birlikte)","Limon suyu (sitrat kaynağı)","Sebze ve meyveler"],
   recEn:["Plenty of water (2.5-3 liters/day)","Calcium-containing foods (with meals)","Lemon juice (citrate source)","Vegetables and fruits"],
   avTr:["Aşırı tuzlu gıdalar","Kola ve kolalı içecekler","Aşırı kırmızı et","Yüksek oksalatlı gıdaların aşırısı"],
   avEn:["Overly salty foods","Cola and cola-based drinks","Excess red meat","Excess high-oxalate foods"],
   mTr:{b:"Yumurta + limon suyu + tam tahıllı ekmek",l:"Tavuk + pirinç + bol su",d:"Balık + sebze + limon",s:"Meyve + bol su"},
   mEn:{b:"Eggs + lemon juice + whole grain bread",l:"Chicken + rice + plenty of water",d:"Fish + vegetables + lemon",s:"Fruit + plenty of water"}},

  {id:"sportsNutrition",tr:"Sporcu Beslenmesi",en:"Sports Nutrition",icon:"🏋️",
   ovTr:"Performansı ve toparlanmayı desteklemeye yönelik, antrenman öncesi/sonrası zamanlamaya dikkat edilen, yüksek proteinli ve yeterli karbonhidratlı bir beslenme planı.",
   ovEn:"A high-protein, adequately carbohydrate-rich nutrition plan with attention to pre/post-workout timing to support performance and recovery.",
   resTr:["Antrenman öncesi ağır/yağlı öğünler","Yetersiz sıvı alımı","Antrenman sonrası uzun süre aç kalma"],
   resEn:["Heavy/fatty meals before training","Insufficient fluid intake","Prolonged fasting after training"],
   recTr:["Antrenman öncesi kompleks karbonhidrat","Antrenman sonrası 30 dk içinde protein+karbonhidrat","Yeterli su ve elektrolit","Kaliteli protein kaynakları her öğünde"],
   recEn:["Complex carbs before training","Protein+carbs within 30 min post-workout","Adequate water and electrolytes","Quality protein sources at every meal"],
   avTr:["Antrenman öncesi aşırı yağlı yemek","Şekerli enerji içecekleri (aşırı)","Yetersiz su tüketimi"],
   avEn:["Very fatty meals before training","Excess sugary energy drinks","Insufficient water intake"],
   mTr:{b:"Yulaf + muz + yumurta beyazı",l:"Tavuk + bulgur + sebze",d:"Balık + tatlı patates + salata",s:"Antrenman sonrası: süt + muz"},
   mEn:{b:"Oats + banana + egg whites",l:"Chicken + bulgur + vegetables",d:"Fish + sweet potato + salad",s:"Post-workout: milk + banana"}},

  {id:"migraine",tr:"Migren",en:"Migraine",icon:"🤕",
   ovTr:"Migren ataklarını tetikleyen gıdaların belirlenip elenmesine dayalı, düzenli öğün saatleri ve yeterli hidrasyonu önceliklendiren bir beslenme yaklaşımı.",
   ovEn:"A nutrition approach based on identifying and eliminating migraine-triggering foods, prioritizing regular meal timing and adequate hydration.",
   resTr:["Eskitilmiş peynirler (tiramin)","Çikolata (bazı kişilerde)","İşlenmiş etler (nitrat)","Aşırı kafein veya kafein yoksunluğu","Alkol (özellikle kırmızı şarap)"],
   resEn:["Aged cheeses (tyramine)","Chocolate (in some individuals)","Processed meats (nitrates)","Excess caffeine or caffeine withdrawal","Alcohol (especially red wine)"],
   recTr:["Düzenli öğün saatleri (öğün atlamamak)","Bol su tüketimi","Magnezyum açısından zengin gıdalar (yeşil yapraklılar, kuruyemiş)","Taze, işlenmemiş gıdalar"],
   recEn:["Regular meal timing (no skipping)","Plenty of water","Magnesium-rich foods (leafy greens, nuts)","Fresh, unprocessed foods"],
   avTr:["Eskitilmiş/olgunlaştırılmış peynirler","İşlenmiş et ürünleri","Yapay tatlandırıcılar (aspartam)","Düzensiz öğün saatleri"],
   avEn:["Aged/matured cheeses","Processed meat products","Artificial sweeteners (aspartame)","Irregular meal timing"],
   mTr:{b:"Yumurta + taze ekmek + salatalık",l:"Taze tavuk + pirinç + yeşil sebze",d:"Balık + patates + taze sebze",s:"Badem + su"},
   mEn:{b:"Eggs + fresh bread + cucumber",l:"Fresh chicken + rice + green vegetables",d:"Fish + potato + fresh vegetables",s:"Almonds + water"}},

  {id:"depression",tr:"Ruh Sağlığı Beslenmesi (Depresyon/Anksiyete)",en:"Mental Health Nutrition (Depression/Anxiety)",icon:"🧠",
   ovTr:"Omega-3, B vitaminleri ve triptofan açısından zengin, bağırsak-beyin eksenini destekleyen anti-inflamatuar bir beslenme yaklaşımı. Tıbbi tedavinin yerine geçmez.",
   ovEn:"An anti-inflammatory nutrition approach rich in omega-3s, B vitamins, and tryptophan, supporting the gut-brain axis. Not a substitute for medical treatment.",
   resTr:["Aşırı işlenmiş gıdalar","Aşırı şeker (ruh hali dalgalanmaları)","Aşırı alkol","Aşırı kafein"],
   resEn:["Highly processed foods","Excess sugar (mood fluctuations)","Excess alcohol","Excess caffeine"],
   recTr:["Omega-3 kaynakları (balık, ceviz)","Probiyotik gıdalar (yoğurt, kefir)","B vitamini kaynakları (tam tahıl, yeşillik)","Triptofan içeren gıdalar (hindi, yumurta, kuruyemiş)"],
   recEn:["Omega-3 sources (fish, walnuts)","Probiotic foods (yogurt, kefir)","B vitamin sources (whole grains, greens)","Tryptophan-containing foods (turkey, eggs, nuts)"],
   avTr:["Şekerli işlenmiş atıştırmalıklar","Fast food","Aşırı alkol tüketimi"],
   avEn:["Sugary processed snacks","Fast food","Excess alcohol consumption"],
   mTr:{b:"Yumurta + ceviz + tam tahıllı ekmek",l:"Somon + kinoa + yeşil salata",d:"Hindi + sebze + yoğurt",s:"Kefir + badem"},
   mEn:{b:"Eggs + walnuts + whole grain bread",l:"Salmon + quinoa + green salad",d:"Turkey + vegetables + yogurt",s:"Kefir + almonds"}},

  {id:"menopause",tr:"Menopoz",en:"Menopause",icon:"🌷",
   ovTr:"Hormonal değişimlerle birlikte kemik sağlığını, kilo yönetimini ve kalp sağlığını desteklemeye yönelik kalsiyum, fitoöstrojen ve lif açısından zengin bir beslenme planı.",
   ovEn:"A calcium, phytoestrogen, and fiber-rich nutrition plan to support bone health, weight management, and heart health during hormonal changes.",
   resTr:["Aşırı kafein (sıcak basmaları tetikleyebilir)","Aşırı baharatlı yiyecekler","Alkol (sıcak basması tetikleyicisi)","Rafine şeker"],
   resEn:["Excess caffeine (may trigger hot flashes)","Very spicy foods","Alcohol (hot flash trigger)","Refined sugar"],
   recTr:["Kalsiyum ve D vitamini kaynakları","Fitoöstrojen içeren gıdalar (soya, keten tohumu)","Lifli tam tahıllar","Omega-3 kaynakları"],
   recEn:["Calcium and vitamin D sources","Phytoestrogen-containing foods (soy, flaxseed)","Fiber-rich whole grains","Omega-3 sources"],
   avTr:["Aşırı kafein","Baharatlı/acılı yiyecekler","Alkol","Rafine şeker ürünleri"],
   avEn:["Excess caffeine","Spicy/hot foods","Alcohol","Refined sugar products"],
   mTr:{b:"Yoğurt + keten tohumu + meyve",l:"Soya/tofu + bulgur + yeşil sebze",d:"Balık + brokoli + kepekli ekmek",s:"Ceviz + süt"},
   mEn:{b:"Yogurt + flaxseed + fruit",l:"Soy/tofu + bulgur + green vegetables",d:"Fish + broccoli + whole grain bread",s:"Walnuts + milk"}},

  {id:"autoimmune",tr:"Otoimmün Hastalıklar (Anti-inflamatuar)",en:"Autoimmune Diseases (Anti-inflammatory)",icon:"🛡️",
   ovTr:"Sistemik inflamasyonu azaltmaya yönelik, işlenmiş gıdalardan uzak, omega-3 ve antioksidan açısından zengin bir beslenme yaklaşımı. Hastalığa özel kısıtlamalar değişebilir.",
   ovEn:"An anti-inflammatory nutrition approach rich in omega-3s and antioxidants, avoiding processed foods, aimed at reducing systemic inflammation. Disease-specific restrictions may vary.",
   resTr:["İşlenmiş ve rafine gıdalar","Trans yağlar","Aşırı şeker","Bazı kişilerde gluten/süt (bireysel değerlendirme gerekir)"],
   resEn:["Processed and refined foods","Trans fats","Excess sugar","Gluten/dairy in some individuals (needs individual assessment)"],
   recTr:["Omega-3 kaynakları (yağlı balık)","Renkli sebze ve meyveler (antioksidan)","Zerdeçal, zencefil gibi anti-inflamatuar baharatlar","Zeytinyağı"],
   recEn:["Omega-3 sources (fatty fish)","Colorful vegetables and fruits (antioxidants)","Anti-inflammatory spices like turmeric, ginger","Olive oil"],
   avTr:["İşlenmiş et ürünleri","Rafine şeker ve un","Trans yağ içeren gıdalar","Aşırı alkol"],
   avEn:["Processed meat products","Refined sugar and flour","Trans fat-containing foods","Excess alcohol"],
   mTr:{b:"Yumurta + avokado + yeşillik",l:"Somon + kinoa + renkli sebze",d:"Tavuk + zerdeçallı sebze + zeytinyağı",s:"Yaban mersini + ceviz"},
   mEn:{b:"Eggs + avocado + greens",l:"Salmon + quinoa + colorful vegetables",d:"Chicken + turmeric vegetables + olive oil",s:"Blueberries + walnuts"}},

  {id:"eatingDisorderRecovery",tr:"Yeme Bozukluğu Sonrası Beslenme Desteği",en:"Post-Eating Disorder Nutrition Support",icon:"🌱",warn:true,
   ovTr:"Yeme bozukluğundan iyileşme sürecinde düzenli, yargısız ve esnek beslenme alışkanlıkları kazanmaya odaklanan bir yaklaşım. Mutlaka bir ruh sağlığı uzmanı ile birlikte yürütülmelidir.",
   ovEn:"An approach focused on developing regular, non-judgmental, and flexible eating habits during eating disorder recovery. Must be conducted alongside a mental health professional.",
   resTr:["Katı kalori kısıtlaması veya sayımı","Yasaklı gıda listeleri oluşturma","Aşırı kısıtlayıcı diyet kuralları"],
   resEn:["Strict calorie restriction or counting","Creating forbidden food lists","Overly restrictive diet rules"],
   recTr:["Düzenli aralıklarla dengeli öğünler","Tüm gıda gruplarına yer verme","Açlık-tokluk sinyallerini dinlemeyi destekleme","Multidisipliner ekip desteği (doktor, terapist, diyetisyen)"],
   recEn:["Regular balanced meals at consistent intervals","Including all food groups","Supporting hunger-fullness cue awareness","Multidisciplinary team support (doctor, therapist, dietitian)"],
   avTr:["Kalori sayımı odaklı yaklaşımlar","'İyi/kötü' gıda etiketlemesi","Aşırı kısıtlayıcı planlar"],
   avEn:["Calorie-counting-focused approaches","'Good/bad' food labeling","Overly restrictive plans"],
   mTr:{b:"Dengeli ve çeşitli bir kahvaltı (kişiye özel planlanır)",l:"Multidisipliner ekiple planlanan öğün",d:"Multidisipliner ekiple planlanan öğün",s:"Kişiye özel, yargısız ara öğün"},
   mEn:{b:"Balanced varied breakfast (personalized)",l:"Meal planned with multidisciplinary team",d:"Meal planned with multidisciplinary team",s:"Personalized, non-judgmental snack"}},
];

const STR = {
  tr:{
    appName:"NutriBase",
    nav:{calc:"Hesap Makinesi",food:"Besin Ara",track:"Takip",clients:"Danışanlar",templates:"Hastalık Şablonları",upgrade:"Pro'ya Geç"},
    hero:{eyebrow:"Kalori · Su · Makro · Klinik Şablonlar",title:"Beslenme bilimini herkes için netleştir",sub:"Bireyler için doğru hesaplama, diyetisyenler için klinik düzeyde araçlar — tek uygulamada.",ctaFree:"Ücretsiz Başla",ctaPro:"Diyetisyen misiniz?"},
    stats:{t1:"Hastalık Şablonu",t2:"Dil Desteği",t3:"Besin Kaydı",t4:"Ücretsiz Erişim"},
    hiw:{title:"Nasıl Çalışır?",s1t:"Bilgilerini Gir",s1d:"Yaş, kilo, boy ve aktivite düzeyini gir.",s2t:"Anında Hesapla",s2d:"BMR, TDEE, BMİ, su ve makrolarını saniyeler içinde gör.",s3t:"Takip Et & İlerle",s3d:"Günlük kayıtlarınla ilerlemeni izle; diyetisyensen danışanlarını yönet."},
    calc:{title:"Günlük İhtiyaç Hesaplama",sub:"Bilgilerini gir, BMR, TDEE, BMİ, su ve makro ihtiyacını hemen gör.",gender:"Cinsiyet",male:"Erkek",female:"Kadın",age:"Yaş",height:"Boy (cm)",weight:"Kilo (kg)",activity:"Aktivite Düzeyi",act:["Hareketsiz (masa başı, spor yok)","Hafif aktif (haftada 1-3 gün)","Orta aktif (haftada 3-5 gün)","Çok aktif (haftada 6-7 gün)","Üst düzey aktif (ağır iş + günlük spor)"],goal:"Hedef",goalLose:"Kilo Vermek",goalMaintain:"Kiloyu Korumak",goalGain:"Kilo Almak",calculate:"Hesapla",results:"Sonuçların",bmr:"Bazal Metabolizma (BMR)",bmrD:"Vücudunun dinlenirken yaktığı enerji",tdee:"Toplam İhtiyaç (TDEE)",tdeeD:"Aktivite dahil günlük toplam kalori",target:"Hedef Kalori",targetD:"Hedefine göre önerilen günlük alım",water:"Su İhtiyacı",waterD:"Günlük önerilen su tüketimi",bmi:"Vücut Kitle İndeksi (BMİ)",bmiD:"Boy ve kilona göre ağırlık kategorisi",macros:"Makro Dağılımı",protein:"Protein",carbs:"Karbonhidrat",fat:"Yağ",kcal:"kcal",liters:"litre",bmiUnder:"Zayıf",bmiNormal:"Normal",bmiOver:"Fazla Kilolu",bmiObese:"Obez",disclaimer:"Bu hesaplamalar genel formüllere dayanır ve bireysel tıbbi tavsiye yerine geçmez.",saveEntry:"Bugüne Kaydet",saved:"Kaydedildi!"},
    food:{title:"Besin Arama",sub:"Besin adı yazın, miktarını girin — 26 besin değerini görün.",ph:"Besin adı yazın (örn: yumurta, tavuk, elma...)",amount:"Miktar (gram)",impN:"Önemli Değerler",allN:"Tüm 26 Değer (PRO)",showAll:"↓ Tümünü Gör",showLess:"↑ Az Göster",src:"Kaynak: TurKomp + USDA veritabanları",notFound:"Besin bulunamadı. Farklı bir kelime deneyin.",selPrompt:"Soldan bir besin seçin",cats:{tahıl:"Tahıllar",et:"Etler",balık:"Balıklar","yumurta-süt":"Yumurta & Süt Ürünleri",baklagil:"Baklagiller",sebze:"Sebzeler",meyve:"Meyveler",kuruyemiş:"Kuruyemiş & Tohumlar",yağ:"Yağlar",diğer:"Diğer",yemek:"Hazır Yemekler",fastfood:"Fast Food",tatlı:"Tatlılar",içecek:"İçecekler"}},
    track:{title:"Günlük Takip",sub:"Kayıtlı hesaplamalarını ve ilerlemeni gör.",empty:"Henüz kayıt yok. Hesap makinesinden hesaplama yapıp kaydet.",date:"Tarih",weight:"Kilo",target:"Hedef Kalori",water:"Su",trend:"Kilo Değişimi"},
    upsell:{title:"Bu özellik Pro'da",sub:"Danışan yönetimi ve hastalık şablonları yalnızca Pro pakette bulunur.",cta:"Pro'yu İncele"},
    pro:{badge:"DİYETİSYEN PRO",title:"Klinik pratiğin için tasarlandı",sub:"Danışan kayıtları, hastalık bazlı diyet şablonları ve klinik notlar — hepsi tek yerde.",f1:"Sınırsız danışan kaydı ve geçmiş takibi",f2:"29 hastalık için hazır diyet şablonu kütüphanesi",f3:"Şablonları danışana özel düzenleyip dışa aktarma",f4:"Danışan başına 26 besin değeri klinik takibi",pM:"Aylık",pY:"Yıllık (2 ay bedava)",demo:"Demo Aboneliği Başlat",demoNote:"Bu bir demo akışıdır — gerçek ödeme alınmaz.",cardNum:"Kart Numarası",expiry:"SK/YY",cvc:"CVC",cardName:"Kart Üzerindeki İsim",confirm:"Aboneliği Onayla",proc:"İşleniyor...",success:"Pro'ya hoş geldin!",successSub:"Artık tüm klinik araçlara erişimin var.",goApp:"Panele Git"},
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
    food:{title:"Food Search",sub:"Type a food name, enter the amount — see 26 nutritional values.",ph:"Type food name (e.g. egg, chicken, apple...)",amount:"Amount (grams)",impN:"Key Nutrients",allN:"All 26 Nutrients (PRO)",showAll:"↓ Show All",showLess:"↑ Show Less",src:"Source: TurKomp + USDA databases",notFound:"Food not found. Try a different word.",selPrompt:"Select a food on the left",cats:{tahıl:"Grains",et:"Meat",balık:"Fish","yumurta-süt":"Eggs & Dairy",baklagil:"Legumes",sebze:"Vegetables",meyve:"Fruits",kuruyemiş:"Nuts & Seeds",yağ:"Oils",diğer:"Other",yemek:"Prepared Dishes",fastfood:"Fast Food",tatlı:"Desserts",içecek:"Beverages"}},
    track:{title:"Daily Tracking",sub:"View your saved calculations and progress.",empty:"No entries yet. Run a calculation and save it.",date:"Date",weight:"Weight",target:"Target Cal",water:"Water",trend:"Weight Trend"},
    upsell:{title:"This feature is Pro",sub:"Client management and condition templates are available only in the Pro plan.",cta:"See Pro"},
    pro:{badge:"DIETITIAN PRO",title:"Built for your clinical practice",sub:"Client records, condition-based diet templates, and clinical notes — all in one place.",f1:"Unlimited client records and history tracking",f2:"Ready-made diet template library for 29 conditions",f3:"Customize templates per client and export them",f4:"26-value clinical nutrition tracking per client",pM:"Monthly",pY:"Yearly (2 months free)",demo:"Start Demo Subscription",demoNote:"This is a demo flow — no real payment is taken.",cardNum:"Card Number",expiry:"MM/YY",cvc:"CVC",cardName:"Name on Card",confirm:"Confirm Subscription",proc:"Processing...",success:"Welcome to Pro!",successSub:"You now have access to all clinical tools.",goApp:"Go to Dashboard"},
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
// WHO/Schofield weight-based equations (kcal/day) — standard reference in Turkish dietetics education
function calcBMR_WHO({gender,age,weight}){
  const W=weight;
  if(gender==="male"){
    if(age<18)return 17.5*W+651;
    if(age<30)return 15.3*W+679;
    if(age<60)return 11.6*W+879;
    return 13.5*W+487;
  }else{
    if(age<18)return 12.2*W+746;
    if(age<30)return 14.7*W+496;
    if(age<60)return 8.7*W+829;
    return 10.5*W+596;
  }
}
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

function Logo({sz=28,T=C}){return<svg width={sz} height={sz} viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke={T.ink} strokeWidth="1.5"/><path d="M13 26V14L27 26V14" stroke={T.coral} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function Spin(){return<div style={{display:"flex",justifyContent:"center",padding:40}}><div style={{width:28,height:28,borderRadius:"50%",border:`3px solid ${C.line}`,borderTopColor:C.coral,animation:"nbsp 0.7s linear infinite"}}/><style>{"@keyframes nbsp{to{transform:rotate(360deg)}}"}</style></div>;}
function PBadge({sm}){return<span style={{display:"inline-flex",alignItems:"center",gap:4,background:C.gold,color:"#3A2D0A",fontSize:sm?10:11,fontWeight:800,padding:sm?"2px 7px":"3px 9px",borderRadius:20}}><Crown size={sm?10:12}/> PRO</span>;}
const iSt={width:"100%",padding:"12px 14px",fontSize:16,borderRadius:8,border:`1.5px solid ${C.line}`,background:C.paper,color:C.ink,outline:"none",fontFamily:"inherit",boxSizing:"border-box"};
function TIn(p){const[f,sF]=useState(false);return<input {...p} onFocus={e=>{sF(true);p.onFocus?.(e);}} onBlur={e=>{sF(false);p.onBlur?.(e);}} style={{...iSt,borderColor:f?C.coral:C.line,...(p.style||{})}}/>;}
function Fld({label,children}){return<label style={{display:"block",marginBottom:18}}><span style={{display:"block",fontSize:12,letterSpacing:"0.06em",textTransform:"uppercase",color:C.ink,opacity:0.55,marginBottom:7,fontWeight:600}}>{label}</span>{children}</label>;}
function SegBtn({opts,val,onChg}){return<div style={{display:"flex",gap:8}}>{opts.map(o=><button key={o.v} type="button" onClick={()=>onChg(o.v)} style={{flex:1,padding:"11px 10px",borderRadius:8,fontSize:14,fontWeight:600,border:`1.5px solid ${val===o.v?C.ink:C.line}`,background:val===o.v?C.ink:C.paper,color:val===o.v?C.paper:C.ink,cursor:"pointer"}}>{o.l}</button>)}</div>;}
function Sel({val,onChg,opts}){return<select value={val} onChange={e=>onChg(Number(e.target.value))} style={{...iSt,cursor:"pointer",appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230E2A3D' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center"}}>{opts.map((o,i)=><option key={i} value={i}>{o}</option>)}</select>;}
function Btn({ch,onClick,vr="primary",st={},tp="button",dis}){const b={padding:"13px 24px",borderRadius:9,fontSize:15,fontWeight:600,cursor:dis?"not-allowed":"pointer",border:"none",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"inherit",transition:"all 0.15s",opacity:dis?0.5:1};const vs={primary:{background:C.ink,color:C.paper},coral:{background:C.coral,color:"#fff"},ghost:{background:"transparent",color:C.ink,border:`1.5px solid ${C.line}`}};return<button type={tp} onClick={onClick} disabled={dis} style={{...b,...vs[vr],...st}}>{ch}</button>;}
function Card({children,st={}}){return<div style={{background:"#fff",border:`1px solid ${C.line}`,borderRadius:14,padding:24,...st}}>{children}</div>;}
function SBk({icon,label,val,unit,sub,acc}){return<div style={{background:acc?C.ink:"#fff",border:`1px solid ${acc?C.ink:C.line}`,borderRadius:14,padding:"22px 20px"}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,color:acc?C.coralSoft:C.sage}}>{icon}<span style={{fontSize:11.5,letterSpacing:"0.07em",textTransform:"uppercase",fontWeight:700}}>{label}</span></div><div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontSize:34,fontWeight:800,color:acc?"#fff":C.ink,fontFamily:"'Source Serif 4',Georgia,serif"}}>{val}</span><span style={{fontSize:14,color:acc?C.paperDim:C.ink,opacity:0.6,fontWeight:600}}>{unit}</span></div>{sub&&<div style={{fontSize:12.5,color:acc?C.paperDim:C.ink,opacity:acc?0.75:0.45,marginTop:6}}>{sub}</div>}</div>;}

const DARK = {
  ink:"#E8DFD0",paper:"#0F1923",paperDim:"#162130",
  coral:"#F07050",coralSoft:"#2A1510",line:"#243040",sage:"#6E9A8A",gold:"#D4A85A",
};

export default function App(){
  const[lang,setLang]=useState("tr");
  const t=STR[lang];
  const[page,setPage]=useState("landing");
  const[isPro,setIsPro]=useState(()=>{
    try{const v=localStorage.getItem("nb:user:isPro");return v?JSON.parse(v):true;}catch{return true;}
  });
  const[isDark,setIsDark]=useState(()=>{
    try{const v=localStorage.getItem("nb:user:dark");return v?JSON.parse(v):false;}catch{return false;}
  });
  const[selClient,setSelClient]=useState(null);
  const[selTpl,setSelTpl]=useState(null);

  const toggleDark=async()=>{const nd=!isDark;setIsDark(nd);await ss("user:dark",nd);};
  const goPro=useCallback(async()=>{setIsPro(true);await ss("user:isPro",true);},[]);
  const nav=p=>{setPage(p);window.scrollTo(0,0);};

  // Dynamic colors based on theme
  const T=isDark?DARK:C;

  return(
    <div style={{minHeight:"100vh",background:T.paper,color:T.ink,fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif",transition:"background 0.2s,color 0.2s"}}>
      <style>{`*{box-sizing:border-box;}body{margin:0;background:${T.paper};}::selection{background:${T.coral};color:#fff;}@keyframes nbF{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.nbP{animation:nbF 0.2s ease both;}@media(max-width:720px){.g2{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr!important;}.hm{display:none!important;}}@media print{.np{display:none!important;}}`}</style>
      <NavBar t={t} lang={lang} setLang={setLang} page={page} nav={nav} isPro={isPro} isDark={isDark} toggleDark={toggleDark} T={T}/>
      <main className="nbP" key={page}>
        {page==="landing"&&<Landing t={t} nav={nav} lang={lang} T={T}/>}
        {page==="calc"&&<CalcPage t={t} lang={lang} T={T}/>}
        {page==="food"&&<FoodPage t={t} lang={lang} isPro={isPro} T={T}/>}
        {page==="track"&&<TrackPage t={t} lang={lang} T={T}/>}
        {page==="clients"&&(isPro?<ClientsPage t={t} lang={lang} nav={nav} setSel={setSelClient} T={T}/>:<Upsell t={t} nav={nav} T={T}/>)}
        {page==="clientProfile"&&(isPro?<ClientProfile t={t} lang={lang} clientId={selClient} nav={nav} T={T}/>:<Upsell t={t} nav={nav} T={T}/>)}
        {page==="templates"&&(isPro?<TemplatesPage t={t} lang={lang} nav={nav} setSel={setSelTpl} T={T}/>:<Upsell t={t} nav={nav} T={T}/>)}
        {page==="templateDetail"&&(isPro?<TemplateDetail t={t} lang={lang} id={selTpl} nav={nav} T={T}/>:<Upsell t={t} nav={nav} T={T}/>)}
        {page==="weeklyPlan"&&(isPro?<WeeklyPlanPage t={t} lang={lang} nav={nav} T={T}/>:<Upsell t={t} nav={nav} T={T}/>)}
        {page==="exchangeList"&&(isPro?<ExchangeListPage t={t} lang={lang} nav={nav} T={T}/>:<Upsell t={t} nav={nav} T={T}/>)}
        {page==="settings"&&(isPro?<SettingsPage t={t} lang={lang} nav={nav} T={T}/>:<Upsell t={t} nav={nav} T={T}/>)}
        {page==="proLanding"&&<ProLanding t={t} nav={nav} isPro={isPro} T={T}/>}
        {page==="proCheckout"&&<ProCheckout t={t} nav={nav} goPro={goPro} T={T}/>}
      </main>
      <FooterBar t={t} nav={nav} T={T}/>
    </div>
  );
}

function NavBar({t,lang,setLang,page,nav,isPro,isDark,toggleDark,T}){
  const items=[
    {k:"calc",l:t.nav.calc,icon:<Calculator size={15}/>},
    {k:"food",l:t.nav.food,icon:<Search size={15}/>},
    {k:"track",l:t.nav.track,icon:<TrendingUp size={15}/>},
    {k:"clients",l:t.nav.clients,icon:<Users size={15}/>,pro:true},
    {k:"templates",l:t.nav.templates,icon:<FileText size={15}/>,pro:true},
    {k:"weeklyPlan",l:lang==="tr"?"Haftalık Plan":"Weekly Plan",icon:<FileText size={15}/>,pro:true},
    {k:"exchangeList",l:lang==="tr"?"Değişim Listesi":"Exchange List",icon:<Scale size={15}/>,pro:true},
  ];
  return(
    <header style={{borderBottom:`1px solid ${T.line}`,background:T.paper,position:"sticky",top:0,zIndex:40,transition:"background 0.2s"}}>
      <div style={{maxWidth:1180,margin:"0 auto",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>nav("landing")}>
          <Logo T={T}/><span style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:800,fontSize:19,color:T.ink}}>{t.appName}</span>{isPro&&<PBadge sm/>}
        </div>
        <nav className="hm" style={{display:"flex",alignItems:"center",gap:4}}>
          {items.map(i=><button key={i.k} onClick={()=>nav(i.k)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:"none",background:page===i.k?T.paperDim:"transparent",color:T.ink,fontSize:13.5,fontWeight:600,cursor:"pointer"}}>{i.icon}{i.l}{i.pro&&!isPro&&<Lock size={10} style={{marginLeft:2,opacity:0.5}}/>}</button>)}
        </nav>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>nav("settings")} title={lang==="tr"?"Ayarlar":"Settings"} style={{display:"flex",alignItems:"center",justifyContent:"center",width:34,height:34,borderRadius:8,border:`1px solid ${T.line}`,background:page==="settings"?T.line:T.paperDim,cursor:"pointer",color:T.ink}}>
            <Settings size={15}/>
          </button>
          <button onClick={toggleDark} title={isDark?"Light mode":"Dark mode"} style={{display:"flex",alignItems:"center",justifyContent:"center",width:34,height:34,borderRadius:8,border:`1px solid ${T.line}`,background:T.paperDim,cursor:"pointer",fontSize:16,color:T.ink}}>
            {isDark?"☀️":"🌙"}
          </button>
          <button onClick={()=>setLang(lang==="tr"?"en":"tr")} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 11px",borderRadius:7,border:`1px solid ${T.line}`,background:T.paperDim,fontSize:12.5,fontWeight:700,cursor:"pointer",color:T.ink}}><Globe size={13}/> {lang==="tr"?"EN":"TR"}</button>
          {!isPro&&false&&<Btn ch={<><Crown size={13}/> {t.nav.upgrade}</>} vr="coral" onClick={()=>nav("proLanding")} st={{padding:"9px 16px",fontSize:13}} className="hm"/>}
        </div>
      </div>
      <div style={{display:"flex",overflowX:"auto",gap:6,padding:"10px 16px 12px",borderTop:`1px solid ${T.line}`}} className="mnav">
        {items.map(i=><button key={i.k} onClick={()=>nav(i.k)} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 12px",borderRadius:20,whiteSpace:"nowrap",border:`1px solid ${page===i.k?T.coral:T.line}`,background:page===i.k?T.coral:"transparent",color:page===i.k?"#fff":T.ink,fontSize:12.5,fontWeight:600,cursor:"pointer"}}>{i.icon}{i.l}{i.pro&&!isPro&&<Lock size={9}/>}</button>)}
      </div>
      <style>{"@media(min-width:721px){.mnav{display:none!important;}}"}</style>
    </header>
  );
}

function FooterBar({t,nav,T=C}){
  return(
    <footer style={{borderTop:`1px solid ${T.line}`,background:T.paper,padding:"48px 24px 32px",marginTop:60}}>
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
          {[{v:"29+",l:t.stats.t1},{v:"2",l:t.stats.t2},{v:"120+",l:t.stats.t3},{v:"100%",l:t.stats.t4}].map((s,i)=><div key={i}><div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:32,fontWeight:800,color:"#fff"}}>{s.v}</div><div style={{fontSize:12,fontWeight:600,color:C.paperDim,opacity:0.7,marginTop:4}}>{s.l}</div></div>)}
        </div>
      </section>
      <section style={{maxWidth:1180,margin:"0 auto",padding:"60px 24px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}} className="g3">
          {[{icon:<Calculator size={20}/>,t:lang==="tr"?"Doğru Hesaplama":"Accurate Calculation",d:lang==="tr"?"BMR, TDEE, BMİ, su ve makro ihtiyacı bilimsel formüllerle.":"BMR, TDEE, BMI, water and macro needs via scientific formulas."},
            {icon:<Search size={20}/>,t:lang==="tr"?"Besin Veritabanı":"Food Database",d:lang==="tr"?"120+ besin için TurKomp+USDA verileriyle 26 besin değeri.":"26 nutritional values for 120+ foods via TurKomp+USDA."},
            {icon:<FileText size={20}/>,t:lang==="tr"?"Klinik Şablonlar":"Clinical Templates",d:lang==="tr"?"29 hastalık için referans diyet planları.":"Reference diet plans for 29 conditions.",pro:true},
            {icon:<Scale size={20}/>,t:lang==="tr"?"Değişim Listesi Sistemi":"Exchange List System",d:lang==="tr"?"Türk diyetetik standardı besin değişim grupları.":"Turkish dietetic standard food exchange groups.",pro:true},
            {icon:<Users size={20}/>,t:lang==="tr"?"Danışan Yönetimi":"Client Management",d:lang==="tr"?"Ölçüm, fotoğraf, seans ve ödeme takibi tek yerde.":"Measurements, photos, sessions, and payments in one place.",pro:true},
            {icon:<Crown size={20}/>,t:lang==="tr"?"Diyet Planı Oluşturucu":"Diet Plan Builder",d:lang==="tr"?"Danışana özel yazılı, yazdırılabilir diyet planları.":"Custom, printable diet plans for each client.",pro:true},
          ].map((f,i)=><Card key={i} st={{}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}><div style={{width:38,height:38,borderRadius:10,background:C.paperDim,display:"flex",alignItems:"center",justifyContent:"center",color:C.coral}}>{f.icon}</div>{f.pro&&<PBadge sm/>}</div><h3 style={{fontSize:16,fontWeight:700,margin:"0 0 6px"}}>{f.t}</h3><p style={{fontSize:13.5,color:C.ink,opacity:0.6,lineHeight:1.5,margin:0}}>{f.d}</p>
          </Card>)}
        </div>
      </section>

      {/* Pro feature showcase */}
      <section style={{maxWidth:1180,margin:"0 auto",padding:"20px 24px 60px"}}>
        <div style={{background:C.ink,borderRadius:20,padding:"44px 40px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <PBadge/>
            <h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:24,fontWeight:700,margin:0,color:"#fff"}}>{lang==="tr"?"Diyetisyenler için tam donanımlı klinik araç seti":"A fully-equipped clinical toolkit for dietitians"}</h2>
          </div>
          <p style={{fontSize:14,color:C.paperDim,opacity:0.7,marginBottom:28,maxWidth:560}}>{lang==="tr"?"Danışan yönetiminden gelir takibine, fotoğraftan besin tanımaya kadar pratiğini dijitalleştir.":"From client management to revenue tracking to photo-based food recognition — digitize your practice."}</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}} className="g2">
            {[
              {icon:"📋",t:lang==="tr"?"Diyet Planı":"Diet Plans"},
              {icon:"⚖️",t:lang==="tr"?"Değişim Listesi":"Exchange List"},
              {icon:"📸",t:lang==="tr"?"İlerleme Fotoğrafı":"Progress Photos"},
              {icon:"💰",t:lang==="tr"?"Ödeme Takibi":"Payment Tracking"},
              {icon:"📷",t:lang==="tr"?"Fotoğraftan Tanı":"Photo Recognition"},
              {icon:"🎯",t:lang==="tr"?"Hedef Takibi":"Goal Tracking"},
              {icon:"💊",t:lang==="tr"?"Takviye Listesi":"Supplements"},
              {icon:"📊",t:lang==="tr"?"Gelir Paneli":"Revenue Dashboard"},
            ].map((x,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.06)",borderRadius:12,padding:"16px 14px",textAlign:"center"}}>
                <div style={{fontSize:24,marginBottom:8}}>{x.icon}</div>
                <div style={{fontSize:12.5,fontWeight:600,color:"#fff",opacity:0.85}}>{x.t}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:28}}>
            <Btn ch={<>{lang==="tr"?"Pro'yu Keşfet":"Explore Pro"} <ArrowRight size={16}/></>} vr="coral" onClick={()=>nav("proLanding")} st={{padding:"14px 28px"}}/>
          </div>
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
          
            <Fld label={t.calc.gender}><SegBtn opts={[{v:"female",l:t.calc.female},{v:"male",l:t.calc.male}]} val={form.gender} onChg={v=>upd("gender",v)}/></Fld>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Fld label={t.calc.age}><TIn type="number" value={form.age} onChange={e=>upd("age",e.target.value)} placeholder="30"/></Fld><Fld label={t.calc.height}><TIn type="number" value={form.height} onChange={e=>upd("height",e.target.value)} placeholder="165"/></Fld></div>
            <Fld label={t.calc.weight}><TIn type="number" value={form.weight} onChange={e=>upd("weight",e.target.value)} placeholder="65"/></Fld>
            <Fld label={t.calc.activity}><Sel val={form.actIdx} onChg={v=>upd("actIdx",v)} opts={t.calc.act}/></Fld>
            <Fld label={t.calc.goal}><SegBtn opts={[{v:"lose",l:t.calc.goalLose},{v:"maintain",l:t.calc.goalMaintain},{v:"gain",l:t.calc.goalGain}]} val={form.goal} onChg={v=>upd("goal",v)}/></Fld>
            <Btn ch={<><Calculator size={16}/> {t.calc.calculate}</>} vr="primary" onClick={go} st={{width:"100%",marginTop:6,padding:"14px"}}/>
          
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
              
                <h3 style={{fontSize:13,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",color:C.ink,opacity:0.5,margin:"0 0 16px"}}>{t.calc.macros}</h3>
                <MBar protein={result.protein} carbs={result.carbs} fat={result.fat} t={t}/>
              
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

function FoodPage({t,lang,isPro,T=C}){
  const[query,setQuery]=useState("");
  const[sel,setSel]=useState(null);
  const[recentFoodIds,setRecentFoodIds]=useState([]);
  const[amt,setAmt]=useState("100");
  const[showAll,setShowAll]=useState(false);
  const[comp,setComp]=useState(null);
  const[compAmt,setCompAmt]=useState("100");
  const[compQuery,setCompQuery]=useState("");
  const[tab,setTab]=useState("search"); // search | compare | tarif | tracker
  const[recipe,setRecipe]=useState([]);
  const[recipeName,setRecipeName]=useState("");
  const[savedRecipes,setSavedRecipes]=useState([]);
  const[rQuery,setRQuery]=useState("");
  const[rSel,setRSel]=useState(null);
  const[rAmt,setRAmt]=useState("100");
  const[viewRecipe,setViewRecipe]=useState(null);
  const[scaleTarget,setScaleTarget]=useState("");

  useEffect(()=>{(async()=>{const rks=await sl("recipe:");const rs=[];for(const k of rks){const v=await sg(k);if(v)rs.push({...v,key:k});}rs.sort((a,b)=>b.ts-a.ts);setSavedRecipes(rs);})();},[]);
  useEffect(()=>{(async()=>{const rf=await sg("recentFoods");if(rf)setRecentFoodIds(rf);})();},[]);
  const addToRecent=async(foodId)=>{
    const updated=[foodId,...recentFoodIds.filter(id=>id!==foodId)].slice(0,8);
    setRecentFoodIds(updated);
    await ss("recentFoods",updated);
  };
  const[meals,setMeals]=useState({b:[],l:[],d:[],s:[]});
  const[addingTo,setAddingTo]=useState(null);
  const[mQuery,setMQuery]=useState("");
  const[mSel,setMSel]=useState(null);
  const[mAmt,setMAmt]=useState("100");
  const today=new Date().toISOString().slice(0,10);
  const[mood,setMood]=useState(null);
  const[energy,setEnergy]=useState(null);
  const[journalNote,setJournalNote]=useState("");

  useEffect(()=>{(async()=>{const saved=await sg(`meals:${today}`);if(saved)setMeals(saved);const j=await sg(`journal:${today}`);if(j){setMood(j.mood||null);setEnergy(j.energy||null);setJournalNote(j.note||"");}})();},[today]);

  const saveJournal=async(newMood,newEnergy,newNote)=>{
    await ss(`journal:${today}`,{mood:newMood!==undefined?newMood:mood,energy:newEnergy!==undefined?newEnergy:energy,note:newNote!==undefined?newNote:journalNote,date:today});
  };

  const tf=t.food;
  const results=query.length<2?[]:FOODS.filter(f=>{const q=query.toLowerCase();return(lang==="tr"?f.tr:f.en).toLowerCase().includes(q)||f.tr.toLowerCase().includes(q)||f.en.toLowerCase().includes(q);}).slice(0,10);
  const compResults=compQuery.length<2?[]:FOODS.filter(f=>{const q=compQuery.toLowerCase();return(lang==="tr"?f.tr:f.en).toLowerCase().includes(q)||f.tr.toLowerCase().includes(q)||f.en.toLowerCase().includes(q);}).slice(0,10);
  const mResults=mQuery.length<2?[]:FOODS.filter(f=>{const q=mQuery.toLowerCase();return(lang==="tr"?f.tr:f.en).toLowerCase().includes(q)||f.tr.toLowerCase().includes(q)||f.en.toLowerCase().includes(q);}).slice(0,8);
  const dispN=isPro||showAll?NUTRIENTS:NUTRIENTS.filter(n=>n.imp);
  const cv=(base,g)=>{const v=base*(+g)/100;return v%1===0?v:parseFloat(v.toFixed(2));};
  const pct=(val,dri)=>dri?Math.min(Math.round(val/dri*100),999):null;
  const cats=[...new Set(FOODS.map(f=>f.cat))];
  const catD={tahıl:"ekmek",et:"tavuk",balık:"somon","yumurta-süt":"yumurta",baklagil:"mercimek",sebze:"domates",meyve:"elma",kuruyemiş:"ceviz",yağ:"zeytinyağı",diğer:"bal"};

  const addToMeal=async()=>{if(!mSel||!addingTo)return;const g=+mAmt||100;const nutrients=mSel.v.map(base=>parseFloat((base*g/100).toFixed(2)));const item={id:mSel.id,name:lang==="tr"?mSel.tr:mSel.en,amount:g,kcal:nutrients[0],protein:nutrients[1],carbs:nutrients[3],fat:nutrients[2],fiber:nutrients[4],nutrients};const newMeals={...meals,[addingTo]:[...meals[addingTo],item]};setMeals(newMeals);await ss(`meals:${today}`,newMeals);setMSel(null);setMQuery("");setMAmt("100");setAddingTo(null);};
  const removeFromMeal=async(slot,idx)=>{const newMeals={...meals,[slot]:meals[slot].filter((_,i)=>i!==idx)};setMeals(newMeals);await ss(`meals:${today}`,newMeals);};
  const clearMeals=async()=>{const empty={b:[],l:[],d:[],s:[]};setMeals(empty);await ss(`meals:${today}`,empty);};
  const allItems=Object.values(meals).flat();
  const totalKcal=allItems.reduce((s,i)=>s+i.kcal,0);
  const totalP=allItems.reduce((s,i)=>s+i.protein,0);
  const totalC=allItems.reduce((s,i)=>s+i.carbs,0);
  const totalF=allItems.reduce((s,i)=>s+i.fat,0);
  const totalFib=allItems.reduce((s,i)=>s+i.fiber,0);
  const slots=[{key:"b",label:lang==="tr"?"🌅 Kahvaltı":"🌅 Breakfast"},{key:"l",label:lang==="tr"?"☀️ Öğle":"☀️ Lunch"},{key:"d",label:lang==="tr"?"🌙 Akşam":"🌙 Dinner"},{key:"s",label:lang==="tr"?"🍎 Ara Öğün":"🍎 Snack"}];

  // Nutrient card with DRI bar
  const NCard=({n,val,showDri=true})=>{
    const p=showDri?pct(val,DRI[n.i]):null;
    return(
      <div style={{background:T.paper,padding:"10px 12px",border:`1px solid ${T.line}`,borderRadius:6}}>
        <div style={{fontSize:10.5,fontWeight:600,color:T.ink,opacity:0.5,marginBottom:3}}>{lang==="tr"?n.tr:n.en}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
          <span style={{fontSize:15,fontWeight:700,color:T.ink}}>{val}</span>
          <span style={{fontSize:11,color:T.ink,opacity:0.4}}>{n.unit}</span>
        </div>
        {p!==null&&DRI[n.i]&&<div style={{marginTop:5}}>
          <div style={{height:3,background:T.line,borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${Math.min(p,100)}%`,background:p>100?C.coral:p>50?C.sage:C.gold,borderRadius:2,transition:"width 0.3s"}}/>
          </div>
          <div style={{fontSize:9.5,color:T.ink,opacity:0.4,marginTop:2}}>{p}% {lang==="tr"?"günlük değer":"daily value"}</div>
        </div>}
      </div>
    );
  };

  return(
    <section style={{maxWidth:1100,margin:"0 auto",padding:"48px 24px 80px"}}>
      <h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:32,fontWeight:700,margin:"0 0 8px",color:T.ink}}>{tf.title}</h1>
      <p style={{color:T.ink,opacity:0.6,fontSize:15,margin:"0 0 24px"}}>{tf.sub}</p>

      {/* Tab switcher */}
      <div style={{display:"flex",gap:8,marginBottom:28}}>
        {[{k:"search",l:lang==="tr"?"🔍 Besin Ara":"🔍 Search"},{k:"compare",l:lang==="tr"?"⚖️ Karşılaştır":"⚖️ Compare"},{k:"tarif",l:lang==="tr"?"🍳 Tarif Oluştur":"🍳 Recipe Builder"},{k:"tracker",l:lang==="tr"?"🍽️ Günlük Takip":"🍽️ Daily Tracker"}].map(tb=>(
          <button key={tb.k} onClick={()=>setTab(tb.k)} style={{padding:"9px 18px",borderRadius:20,border:`1.5px solid ${tab===tb.k?T.coral:T.line}`,background:tab===tb.k?T.coral:"transparent",color:tab===tb.k?"#fff":T.ink,fontSize:13.5,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>{tb.l}</button>
        ))}
      </div>

      {/* SEARCH TAB */}
      {tab==="search"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,alignItems:"start"}} className="g2">
        <div>
          <div style={{position:"relative",marginBottom:16}}><Search size={17} style={{position:"absolute",left:14,top:14,color:T.ink,opacity:0.4}}/><TIn value={query} onChange={e=>{setQuery(e.target.value);setSel(null);}} placeholder={tf.ph} style={{paddingLeft:42,fontSize:15,background:T.paper,color:T.ink,borderColor:T.line}}/></div>
          {query.length>=2&&results.length===0&&<p style={{color:T.ink,opacity:0.5,fontSize:14}}>{tf.notFound}</p>}
          {results.length>0&&<div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,overflow:"hidden",marginBottom:16}}>
            {results.map((f,i)=><div key={f.id} style={{padding:"11px 14px",borderTop:i>0?`1px solid ${T.line}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",background:sel?.id===f.id?T.paperDim:T.paper}} onClick={()=>{setSel(f);setAmt("100");addToRecent(f.id);}}>
              <div><div style={{fontSize:14,fontWeight:600,color:T.ink}}>{lang==="tr"?f.tr:f.en}</div><div style={{fontSize:12,color:T.ink,opacity:0.45}}>{tf.cats[f.cat]||f.cat}</div></div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:13,fontWeight:700,color:C.coral}}>{f.v[0]} kcal</span>
                <button onClick={e=>{e.stopPropagation();setComp(f);setCompAmt("100");setTab("compare");}} style={{fontSize:10.5,fontWeight:700,background:T.paperDim,border:`1px solid ${T.line}`,borderRadius:12,padding:"2px 8px",cursor:"pointer",color:T.ink,fontFamily:"inherit"}}>⚖️ {lang==="tr"?"Karşılaştır":"Compare"}</button>
              </div>
            </div>)}
          </div>}
          {!query&&recentFoodIds.length>0&&(()=>{
            const recentFoods=recentFoodIds.map(id=>FOODS.find(f=>f.id===id)).filter(Boolean);
            if(recentFoods.length===0)return null;
            return(
              <div style={{marginBottom:20}}>
                <p style={{fontSize:12,fontWeight:700,color:T.ink,opacity:0.5,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:12}}>⭐ {lang==="tr"?"Sık Kullanılanlar":"Recently Used"}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {recentFoods.map(f=>(
                    <button key={f.id} onClick={()=>{setSel(f);setAmt("100");addToRecent(f.id);}} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderRadius:20,border:`1px solid ${T.line}`,background:T.paper,fontSize:12.5,cursor:"pointer",color:T.ink,fontFamily:"inherit"}}>
                      {lang==="tr"?f.tr:f.en} <span style={{color:C.coral,fontWeight:700,fontSize:11}}>{f.v[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
          {!query&&<div><p style={{fontSize:12,fontWeight:700,color:T.ink,opacity:0.5,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:12}}>{lang==="tr"?"Kategoriler":"Categories"}</p><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{cats.map(cat=><button key={cat} onClick={()=>setQuery(catD[cat]||cat)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${T.line}`,background:T.paper,fontSize:13,cursor:"pointer",color:T.ink,fontFamily:"inherit"}}>{tf.cats[cat]||cat}</button>)}</div></div>}
        </div>
        <div>
          {!sel&&<div style={{border:`1.5px dashed ${T.line}`,borderRadius:14,padding:50,textAlign:"center",color:T.ink,opacity:0.4}}><Leaf size={28} style={{marginBottom:10}}/><p style={{margin:0,fontSize:14}}>{tf.selPrompt}</p></div>}
          {sel&&<Card st={{background:T.paper,borderColor:T.line}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div><h3 style={{fontSize:18,fontWeight:700,margin:"0 0 4px",color:T.ink}}>{lang==="tr"?sel.tr:sel.en}</h3><span style={{fontSize:12,color:T.ink,opacity:0.5}}>{tf.cats[sel.cat]||sel.cat}</span></div>
              <button onClick={()=>setSel(null)} style={{background:"none",border:"none",cursor:"pointer",opacity:0.4}}><X size={18}/></button>
            </div>
            <Fld label={tf.amount}><TIn type="number" value={amt} onChange={e=>setAmt(e.target.value)} style={{background:T.paper,color:T.ink,borderColor:T.line}}/></Fld>
            {!isPro&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><span style={{fontSize:12,fontWeight:700,color:T.ink,opacity:0.5,letterSpacing:"0.05em",textTransform:"uppercase"}}>{showAll?tf.allN:tf.impN}</span><button onClick={()=>setShowAll(!showAll)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.coral,fontWeight:700,fontFamily:"inherit"}}>{showAll?tf.showLess:tf.showAll}</button></div>}
            {isPro&&<p style={{fontSize:12,fontWeight:700,color:T.ink,opacity:0.5,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:12}}>{tf.allN}</p>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {dispN.map(n=>{const base=sel.v[n.i];const fA=cv(base,+amt||100);const val=+amt&&+amt!==100?fA:base;return <NCard key={n.i} n={n} val={val}/>;})}
            </div>
            <p style={{fontSize:11,color:T.ink,opacity:0.4,marginTop:12,lineHeight:1.5}}>{tf.src}</p>
          </Card>}
        </div>
      </div>}

      {/* COMPARE TAB */}
      {tab==="compare"&&<div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}} className="g2">
          {/* Food 1 */}
          <div>
            <h3 style={{fontSize:14,fontWeight:700,color:T.ink,margin:"0 0 12px"}}>🟠 {lang==="tr"?"1. Besin":"Food 1"}</h3>
            <div style={{position:"relative",marginBottom:10}}><Search size={15} style={{position:"absolute",left:12,top:12,opacity:0.4}}/><TIn value={sel?lang==="tr"?sel.tr:sel.en:query} onChange={e=>{setQuery(e.target.value);setSel(null);}} placeholder={lang==="tr"?"Besin ara...":"Search food..."} style={{paddingLeft:36,fontSize:14,background:T.paper,color:T.ink,borderColor:T.line}}/></div>
            {!sel&&query.length>=2&&results.length>0&&<div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:10,overflow:"hidden",marginBottom:10}}>{results.map((f,i)=><div key={f.id} onClick={()=>{setSel(f);setAmt("100");setQuery("");}} style={{padding:"10px 14px",borderTop:i>0?`1px solid ${T.line}`:"none",cursor:"pointer",fontSize:13.5,display:"flex",justifyContent:"space-between",color:T.ink}}><span>{lang==="tr"?f.tr:f.en}</span><span style={{color:C.coral,fontWeight:700}}>{f.v[0]}</span></div>)}</div>}
            {sel&&<div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}><div style={{flex:1,background:T.paperDim,borderRadius:8,padding:"8px 12px",fontSize:13.5,fontWeight:600,color:T.ink}}>{lang==="tr"?sel.tr:sel.en}</div><TIn type="number" value={amt} onChange={e=>setAmt(e.target.value)} style={{width:70,padding:"8px 10px",fontSize:13,background:T.paper,color:T.ink,borderColor:T.line}} placeholder="g"/><button onClick={()=>{setSel(null);setQuery("");}} style={{background:"none",border:"none",cursor:"pointer",opacity:0.4}}><X size={15}/></button></div>}
          </div>
          {/* Food 2 */}
          <div>
            <h3 style={{fontSize:14,fontWeight:700,color:T.ink,margin:"0 0 12px"}}>🔵 {lang==="tr"?"2. Besin":"Food 2"}</h3>
            <div style={{position:"relative",marginBottom:10}}><Search size={15} style={{position:"absolute",left:12,top:12,opacity:0.4}}/><TIn value={comp?lang==="tr"?comp.tr:comp.en:compQuery} onChange={e=>{setCompQuery(e.target.value);setComp(null);}} placeholder={lang==="tr"?"Besin ara...":"Search food..."} style={{paddingLeft:36,fontSize:14,background:T.paper,color:T.ink,borderColor:T.line}}/></div>
            {!comp&&compQuery.length>=2&&compResults.length>0&&<div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:10,overflow:"hidden",marginBottom:10}}>{compResults.map((f,i)=><div key={f.id} onClick={()=>{setComp(f);setCompAmt("100");setCompQuery("");}} style={{padding:"10px 14px",borderTop:i>0?`1px solid ${T.line}`:"none",cursor:"pointer",fontSize:13.5,display:"flex",justifyContent:"space-between",color:T.ink}}><span>{lang==="tr"?f.tr:f.en}</span><span style={{color:C.coral,fontWeight:700}}>{f.v[0]}</span></div>)}</div>}
            {comp&&<div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}><div style={{flex:1,background:T.paperDim,borderRadius:8,padding:"8px 12px",fontSize:13.5,fontWeight:600,color:T.ink}}>{lang==="tr"?comp.tr:comp.en}</div><TIn type="number" value={compAmt} onChange={e=>setCompAmt(e.target.value)} style={{width:70,padding:"8px 10px",fontSize:13,background:T.paper,color:T.ink,borderColor:T.line}} placeholder="g"/><button onClick={()=>{setComp(null);setCompQuery("");}} style={{background:"none",border:"none",cursor:"pointer",opacity:0.4}}><X size={15}/></button></div>}
          </div>
        </div>
        {(!sel||!comp)&&<div style={{border:`1.5px dashed ${T.line}`,borderRadius:14,padding:40,textAlign:"center",color:T.ink,opacity:0.4}}><p style={{margin:0,fontSize:14}}>⚖️ {lang==="tr"?"İki besin seç, yan yana karşılaştır":"Select two foods to compare side by side"}</p></div>}
        {sel&&comp&&<div>
          <div style={{display:"grid",gridTemplateColumns:"200px 1fr 1fr",gap:1,background:T.line,borderRadius:12,overflow:"hidden"}}>
            <div style={{background:T.paperDim,padding:"12px 16px",fontWeight:700,fontSize:12,color:T.ink,opacity:0.6,textTransform:"uppercase",letterSpacing:"0.05em",display:"flex",alignItems:"center"}}>{lang==="tr"?"Besin Değeri":"Nutrient"}</div>
            <div style={{background:"#FF6B3520",padding:"12px 16px",fontWeight:700,fontSize:13,color:C.coral,textAlign:"center"}}>{lang==="tr"?sel.tr:sel.en} <span style={{fontWeight:400,fontSize:11,opacity:0.7}}>({amt}g)</span></div>
            <div style={{background:"#3B82F620",padding:"12px 16px",fontWeight:700,fontSize:13,color:"#3B82F6",textAlign:"center"}}>{lang==="tr"?comp.tr:comp.en} <span style={{fontWeight:400,fontSize:11,opacity:0.7}}>({compAmt}g)</span></div>
            {(isPro?NUTRIENTS:NUTRIENTS.filter(n=>n.imp)).map(n=>{
              const v1=cv(sel.v[n.i],+amt||100);
              const v2=cv(comp.v[n.i],+compAmt||100);
              const max=Math.max(v1,v2)||1;
              const winner=v1>v2?"left":v1<v2?"right":"tie";
              return[
                <div key={n.i+"l"} style={{background:T.paper,padding:"10px 16px",fontSize:12.5,fontWeight:600,color:T.ink,display:"flex",alignItems:"center"}}>{lang==="tr"?n.tr:n.en} <span style={{fontSize:10,color:T.ink,opacity:0.4,marginLeft:4}}>({n.unit})</span></div>,
                <div key={n.i+"v1"} style={{background:T.paper,padding:"10px 16px",textAlign:"center"}}>
                  <div style={{height:4,background:T.line,borderRadius:2,marginBottom:6,overflow:"hidden"}}><div style={{height:"100%",width:`${(v1/max)*100}%`,background:C.coral,borderRadius:2}}/></div>
                  <span style={{fontSize:14,fontWeight:winner==="left"?800:600,color:winner==="left"?C.coral:T.ink}}>{v1}</span>
                </div>,
                <div key={n.i+"v2"} style={{background:T.paper,padding:"10px 16px",textAlign:"center"}}>
                  <div style={{height:4,background:T.line,borderRadius:2,marginBottom:6,overflow:"hidden"}}><div style={{height:"100%",width:`${(v2/max)*100}%`,background:"#3B82F6",borderRadius:2}}/></div>
                  <span style={{fontSize:14,fontWeight:winner==="right"?800:600,color:winner==="right"?"#3B82F6":T.ink}}>{v2}</span>
                </div>
              ];
            })}
          </div>
        </div>}
      </div>}

      {/* RECIPE BUILDER TAB */}
      {tab==="tarif"&&<div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,alignItems:"start"}} className="g2">
          <div>
            <h3 style={{fontSize:16,fontWeight:700,margin:"0 0 16px",color:T.ink}}>{lang==="tr"?"🍳 Yeni Tarif":"🍳 New Recipe"}</h3>
            <Fld label={lang==="tr"?"Tarif Adı":"Recipe Name"}>
              <TIn value={recipeName} onChange={e=>setRecipeName(e.target.value)} placeholder={lang==="tr"?"örn. Protein Salatası":"e.g. Protein Salad"} style={{background:T.paper,color:T.ink,borderColor:T.line}}/>
            </Fld>
            {/* Ingredient search */}
            <div style={{position:"relative",marginBottom:10}}><Search size={15} style={{position:"absolute",left:12,top:12,opacity:0.4}}/><TIn value={rQuery} onChange={e=>{setRQuery(e.target.value);setRSel(null);}} placeholder={lang==="tr"?"Malzeme ara...":"Search ingredient..."} style={{paddingLeft:36,fontSize:14,background:T.paper,color:T.ink,borderColor:T.line}}/></div>
            {rQuery.length>=2&&!rSel&&<div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:10,overflow:"hidden",marginBottom:10}}>
              {FOODS.filter(f=>{const q=rQuery.toLowerCase();return(lang==="tr"?f.tr:f.en).toLowerCase().includes(q)||f.tr.toLowerCase().includes(q);}).slice(0,8).map((f,i)=>(
                <div key={f.id} onClick={()=>{setRSel(f);setRAmt("100");setRQuery("");}} style={{padding:"9px 14px",borderTop:i>0?`1px solid ${T.line}`:"none",cursor:"pointer",fontSize:13.5,display:"flex",justifyContent:"space-between",color:T.ink}}>
                  <span>{lang==="tr"?f.tr:f.en}</span><span style={{color:C.coral,fontWeight:700}}>{f.v[0]} kcal</span>
                </div>
              ))}
            </div>}
            {rSel&&<div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}>
              <div style={{flex:1,background:T.paperDim,borderRadius:8,padding:"9px 12px",fontSize:13.5,fontWeight:600,color:T.ink}}>{lang==="tr"?rSel.tr:rSel.en}</div>
              <TIn type="number" value={rAmt} onChange={e=>setRAmt(e.target.value)} style={{width:70,padding:"8px 10px",fontSize:13,background:T.paper,color:T.ink,borderColor:T.line}} placeholder="g"/>
              <button onClick={()=>{setRecipe(r=>[...r,{food:rSel,amount:+rAmt||100}]);setRSel(null);setRAmt("100");}} style={{padding:"9px 16px",background:C.coral,color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer"}}>{lang==="tr"?"Ekle":"Add"}</button>
            </div>}
            {/* Ingredients list */}
            {recipe.length>0&&<div style={{marginBottom:16}}>
              <h4 style={{fontSize:12,fontWeight:700,color:T.ink,opacity:0.5,textTransform:"uppercase",letterSpacing:"0.05em",margin:"0 0 10px"}}>{lang==="tr"?"Malzemeler":"Ingredients"}</h4>
              {recipe.map((item,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:T.paperDim,borderRadius:8,marginBottom:6}}>
                  <span style={{fontSize:13.5,fontWeight:600,color:T.ink}}>{lang==="tr"?item.food.tr:item.food.en}</span>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:12,color:T.ink,opacity:0.55}}>{item.amount}g</span>
                    <span style={{fontSize:12,fontWeight:700,color:C.coral}}>{Math.round(item.food.v[0]*item.amount/100)} kcal</span>
                    <button onClick={()=>setRecipe(r=>r.filter((_,ri)=>ri!==i))} style={{background:"none",border:"none",cursor:"pointer",opacity:0.35}}><X size={13}/></button>
                  </div>
                </div>
              ))}
            </div>}
            {recipe.length>0&&recipeName&&<Btn ch={lang==="tr"?"💾 Tarifi Kaydet":"💾 Save Recipe"} vr="primary" onClick={async()=>{const ts=Date.now();const nutrients=recipe.reduce((acc,item)=>{item.food.v.forEach((v,i)=>{acc[i]=(acc[i]||0)+v*item.amount/100;});return acc;},Array(26).fill(0));await ss(`recipe:${ts}`,{name:recipeName,ingredients:recipe.map(r=>({id:r.food.id,name:lang==="tr"?r.food.tr:r.food.en,amount:r.amount})),nutrients,ts});setRecipeName("");setRecipe([]);const rks=await sl("recipe:");const rs=[];for(const k of rks){const v=await sg(k);if(v)rs.push({...v,key:k});}rs.sort((a,b)=>b.ts-a.ts);setSavedRecipes(rs);}} st={{width:"100%",marginTop:8}}/>}
            {recipe.length===0&&<div style={{border:`1.5px dashed ${T.line}`,borderRadius:12,padding:32,textAlign:"center",color:T.ink,opacity:0.4,fontSize:14}}>🥗 {lang==="tr"?"Malzeme ekleyerek tarif oluşturun":"Add ingredients to build a recipe"}</div>}
          </div>
          <div>
            {/* Live nutrition total */}
            {recipe.length>0&&<div>
              <h4 style={{fontSize:13,fontWeight:700,color:T.ink,opacity:0.5,textTransform:"uppercase",letterSpacing:"0.05em",margin:"0 0 14px"}}>{lang==="tr"?"Tarifin Besin Değerleri":"Recipe Nutrition"} ({recipe.reduce((s,i)=>s+i.amount,0)}g)</h4>

              {/* One-click calorie rescale — inspired by BEBİS */}
              <div style={{background:T.paperDim,borderRadius:10,padding:14,marginBottom:14}}>
                <div style={{fontSize:11.5,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>⚡ {lang==="tr"?"Tek Tuşla Kalori Ölçekle":"One-Click Calorie Rescale"}</div>
                <div style={{display:"flex",gap:8}}>
                  <input type="number" value={scaleTarget} onChange={e=>setScaleTarget(e.target.value)} placeholder={lang==="tr"?"örn. 1600":"e.g. 1600"} style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/>
                  <button onClick={()=>{
                    const currentKcal=recipe.reduce((s,item)=>s+item.food.v[0]*item.amount/100,0);
                    const target=+scaleTarget;
                    if(!target||currentKcal===0)return;
                    const ratio=target/currentKcal;
                    setRecipe(r=>r.map(item=>({...item,amount:Math.round(item.amount*ratio)})));
                  }} disabled={!scaleTarget} style={{padding:"8px 16px",borderRadius:8,border:"none",background:scaleTarget?C.coral:T.line,color:scaleTarget?"#fff":T.ink,fontSize:12.5,fontWeight:700,cursor:scaleTarget?"pointer":"not-allowed",fontFamily:"inherit",opacity:scaleTarget?1:0.5}}>{lang==="tr"?"Ölçekle":"Rescale"}</button>
                </div>
                <p style={{fontSize:10.5,color:T.ink,opacity:0.45,margin:"8px 0 0",lineHeight:1.5}}>{lang==="tr"?"Tüm malzeme miktarları hedef kaloriye orantılı olarak otomatik güncellenir.":"All ingredient amounts are automatically updated proportionally to hit the target calorie."}</p>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {(isPro?NUTRIENTS:NUTRIENTS.filter(n=>n.imp)).map(n=>{
                  const val=parseFloat(recipe.reduce((s,item)=>s+item.food.v[n.i]*item.amount/100,0).toFixed(1));
                  const p=DRI[n.i]?Math.min(Math.round(val/DRI[n.i]*100),999):null;
                  return(<div key={n.i} style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:8,padding:"10px 12px"}}>
                    <div style={{fontSize:10.5,fontWeight:600,color:T.ink,opacity:0.5,marginBottom:3}}>{lang==="tr"?n.tr:n.en}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}><span style={{fontSize:15,fontWeight:700,color:T.ink}}>{val}</span><span style={{fontSize:11,color:T.ink,opacity:0.4}}>{n.unit}</span></div>
                    {p!==null&&DRI[n.i]&&<div style={{marginTop:4,height:3,background:T.line,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(p,100)}%`,background:p>100?C.coral:p>50?C.sage:C.gold}}/></div>}
                  </div>);
                })}
              </div>
            </div>}
            {/* Saved recipes */}
            {savedRecipes.length>0&&<div style={{marginTop:recipe.length>0?28:0}}>
              <h4 style={{fontSize:13,fontWeight:700,color:T.ink,opacity:0.5,textTransform:"uppercase",letterSpacing:"0.05em",margin:"0 0 12px"}}>{lang==="tr"?"Kayıtlı Tarifler":"Saved Recipes"}</h4>
              {savedRecipes.map((r,i)=>(
                <div key={r.key} style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:10,padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setViewRecipe(viewRecipe?.key===r.key?null:r)}>
                  <div><div style={{fontSize:14,fontWeight:700,color:T.ink}}>{r.name}</div><div style={{fontSize:12,color:T.ink,opacity:0.5}}>{r.ingredients?.length||"?"} {lang==="tr"?"malzeme":"ingredients"} · {Math.round(r.nutrients[0])} kcal</div></div>
                  <button onClick={e=>{e.stopPropagation();sd(r.key).then(()=>{setSavedRecipes(rs=>rs.filter(x=>x.key!==r.key));if(viewRecipe?.key===r.key)setViewRecipe(null);});}} style={{background:"none",border:"none",cursor:"pointer",opacity:0.3}}><Trash2 size={14}/></button>
                </div>
              ))}
              {viewRecipe&&<Card st={{marginTop:12,background:T.paperDim,borderColor:T.line}}>
                <h4 style={{fontSize:15,fontWeight:700,margin:"0 0 12px",color:T.ink}}>🍳 {viewRecipe.name}</h4>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
                  {viewRecipe.ingredients?.map((ing,i)=><span key={i} style={{fontSize:12,fontWeight:600,background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,padding:"3px 10px",color:T.ink}}>{ing.name} {ing.amount}g</span>)}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}} className="g3">
                  {[{l:"Kcal",v:Math.round(viewRecipe.nutrients[0])},{l:"Protein",v:Math.round(viewRecipe.nutrients[1])+"g"},{l:"Karb",v:Math.round(viewRecipe.nutrients[3])+"g"},{l:"Yağ",v:Math.round(viewRecipe.nutrients[2])+"g"},{l:"Lif",v:Math.round(viewRecipe.nutrients[4])+"g"}].map((x,i)=><div key={i} style={{background:T.paper,borderRadius:8,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:10,opacity:0.5,marginBottom:2,color:T.ink}}>{x.l}</div><div style={{fontSize:16,fontWeight:800,color:i===0?C.coral:T.ink}}>{x.v}</div></div>)}
                </div>
              </Card>}
            </div>}
          </div>
        </div>
      </div>}

      {/* DAILY TRACKER TAB */}
      {tab==="tracker"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div><h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:22,fontWeight:700,margin:"0 0 4px",color:T.ink}}>{lang==="tr"?"Günlük Öğün Takibi":"Daily Meal Tracker"}</h2><p style={{fontSize:13,color:T.ink,opacity:0.5,margin:0}}>{today}</p></div>
          {allItems.length>0&&<button onClick={clearMeals} style={{background:"none",border:`1px solid ${T.line}`,borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12.5,fontWeight:600,color:T.ink,opacity:0.5,fontFamily:"inherit"}}>{lang==="tr"?"Günü Temizle":"Clear Day"}</button>}
        </div>
        {allItems.length>0&&<div style={{background:C.ink,borderRadius:14,padding:"18px 24px",marginBottom:24,display:"flex",gap:32,flexWrap:"wrap"}}>
          {[{l:lang==="tr"?"Toplam Kalori":"Total Calories",v:Math.round(totalKcal),u:"kcal",hi:true},{l:"Protein",v:Math.round(totalP),u:"g"},{l:lang==="tr"?"Karbonhidrat":"Carbs",v:Math.round(totalC),u:"g"},{l:lang==="tr"?"Yağ":"Fat",v:Math.round(totalF),u:"g"},{l:lang==="tr"?"Lif":"Fiber",v:Math.round(totalFib),u:"g"}].map((item,i)=><div key={i}><div style={{fontSize:11,fontWeight:600,color:"#fff",opacity:0.55,marginBottom:4,letterSpacing:"0.05em",textTransform:"uppercase"}}>{item.l}</div><div style={{display:"flex",alignItems:"baseline",gap:4}}><span style={{fontSize:item.hi?28:22,fontWeight:800,color:"#fff",fontFamily:"'Source Serif 4',Georgia,serif"}}>{item.v}</span><span style={{fontSize:12,color:"#fff",opacity:0.6,fontWeight:600}}>{item.u}</span></div></div>)}
        </div>}

        {/* Mood & Energy Journal — inspired by Practice Better's food & mood journal */}
        <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:14,padding:20,marginBottom:24}}>
          <h3 style={{fontSize:14,fontWeight:700,color:T.ink,margin:"0 0 14px",display:"flex",alignItems:"center",gap:6}}>📝 {lang==="tr"?"Ruh Hali & Enerji Günlüğü":"Mood & Energy Journal"}</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:14}} className="g2">
            <div>
              <div style={{fontSize:11.5,fontWeight:600,color:T.ink,opacity:0.6,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.04em"}}>{lang==="tr"?"Bugün Nasıl Hissediyorsun?":"How do you feel today?"}</div>
              <div style={{display:"flex",gap:6}}>
                {[{v:1,e:"😞"},{v:2,e:"😕"},{v:3,e:"😐"},{v:4,e:"🙂"},{v:5,e:"😄"}].map(m=>(
                  <button key={m.v} onClick={()=>{setMood(m.v);saveJournal(m.v,undefined,undefined);}} style={{width:38,height:38,borderRadius:"50%",border:`2px solid ${mood===m.v?C.coral:T.line}`,background:mood===m.v?C.coralSoft:"transparent",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{m.e}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:11.5,fontWeight:600,color:T.ink,opacity:0.6,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.04em"}}>⚡ {lang==="tr"?"Enerji Seviyesi":"Energy Level"}</div>
              <div style={{display:"flex",gap:6}}>
                {[1,2,3,4,5].map(lvl=>(
                  <button key={lvl} onClick={()=>{setEnergy(lvl);saveJournal(undefined,lvl,undefined);}} style={{flex:1,height:38,borderRadius:8,border:`2px solid ${energy>=lvl?C.gold:T.line}`,background:energy>=lvl?C.gold:"transparent",cursor:"pointer"}}/>
                ))}
              </div>
            </div>
          </div>
          <textarea value={journalNote} onChange={e=>setJournalNote(e.target.value)} onBlur={()=>saveJournal(undefined,undefined,journalNote)} rows={2} placeholder={lang==="tr"?"Bugün beslenme ile ilgili bir gözlem, sindirim sorunu, kabızlık vb...":"Any note about today's nutrition, digestion, bloating, etc..."} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",outline:"none",resize:"vertical"}}/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}} className="g2">
          {slots.map(slot=>(
            <div key={slot.key} style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:14,padding:18,minHeight:180}}>
              <h3 style={{fontSize:14,fontWeight:700,margin:"0 0 14px",display:"flex",justifyContent:"space-between",alignItems:"center",color:T.ink}}>
                <span>{slot.label}</span>
                <span style={{fontSize:11,fontWeight:700,color:C.coral}}>{Math.round(meals[slot.key].reduce((s,i)=>s+i.kcal,0))} kcal</span>
              </h3>
              {meals[slot.key].map((item,idx)=>(
                <div key={idx} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderTop:`1px solid ${T.line}`}}>
                  <div><div style={{fontSize:12.5,fontWeight:600,color:T.ink}}>{item.name}</div><div style={{fontSize:11,color:T.ink,opacity:0.45}}>{item.amount}g · {item.kcal} kcal</div></div>
                  <button onClick={()=>removeFromMeal(slot.key,idx)} style={{background:"none",border:"none",cursor:"pointer",opacity:0.3,flexShrink:0}}><X size={13}/></button>
                </div>
              ))}
              {addingTo===slot.key?(
                <div style={{marginTop:12}}>
                  <div style={{position:"relative",marginBottom:8}}><Search size={13} style={{position:"absolute",left:10,top:10,opacity:0.4}}/><TIn value={mQuery} onChange={e=>{setMQuery(e.target.value);setMSel(null);}} placeholder={lang==="tr"?"Besin ara...":"Search..."} style={{paddingLeft:30,padding:"9px 9px 9px 30px",fontSize:13,background:T.paper,color:T.ink,borderColor:T.line}}/></div>
                  {mResults.length>0&&!mSel&&<div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:8,overflow:"hidden",marginBottom:8,maxHeight:160,overflowY:"auto"}}>{mResults.map((f,i)=><div key={f.id} onClick={()=>{setMSel(f);setMQuery(lang==="tr"?f.tr:f.en);}} style={{padding:"8px 12px",borderTop:i>0?`1px solid ${T.line}`:"none",cursor:"pointer",fontSize:13,display:"flex",justifyContent:"space-between",color:T.ink}}><span>{lang==="tr"?f.tr:f.en}</span><span style={{color:C.coral,fontWeight:700}}>{f.v[0]}</span></div>)}</div>}
                  {mSel&&<div style={{display:"flex",gap:6,marginBottom:8}}><TIn type="number" value={mAmt} onChange={e=>setMAmt(e.target.value)} placeholder="g" style={{padding:"8px 10px",fontSize:13,width:70,background:T.paper,color:T.ink,borderColor:T.line}}/><button onClick={addToMeal} style={{flex:1,background:C.coral,color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",padding:"8px"}}>{lang==="tr"?"Ekle":"Add"}</button></div>}
                  <button onClick={()=>{setAddingTo(null);setMQuery("");setMSel(null);}} style={{width:"100%",background:"none",border:`1px solid ${T.line}`,borderRadius:8,padding:"7px",fontSize:12,cursor:"pointer",color:T.ink,opacity:0.5,fontFamily:"inherit"}}>{lang==="tr"?"Vazgeç":"Cancel"}</button>
                </div>
              ):(
                <button onClick={()=>{setAddingTo(slot.key);setMQuery("");setMSel(null);}} style={{marginTop:12,width:"100%",background:T.paperDim,border:"none",borderRadius:8,padding:"8px",fontSize:12.5,fontWeight:600,cursor:"pointer",color:T.ink,fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Plus size={13}/> {lang==="tr"?"Besin Ekle":"Add Food"}</button>
              )}
            </div>
          ))}
        </div>
      </div>}
    </section>
  );
}

function TrackPage({t,lang,T=C}){
  const[entries,setEntries]=useState([]);
  const[loading,setLoading]=useState(true);
  const[waterMl,setWaterMl]=useState(0);
  const[waterGoal,setWaterGoal]=useState(2000);
  const[allLoggedDates,setAllLoggedDates]=useState([]);
  const today=new Date().toISOString().slice(0,10);

  const load=useCallback(async()=>{
    setLoading(true);
    const ks=await sl("entry:");const items=[];
    for(const k of ks){const v=await sg(k);if(v)items.push({...v,key:k});}
    items.sort((a,b)=>b.ts-a.ts);setEntries(items);
    const wSaved=await sg(`water:${today}`);
    if(wSaved){setWaterMl(wSaved.ml||0);setWaterGoal(wSaved.goal||2000);}
    const waterKeys=await sl("water:");
    const waterDates=waterKeys.map(k=>k.replace("water:",""));
    const entryDates=items.map(e=>e.date);
    const uniqueDates=[...new Set([...entryDates,...waterDates])].sort();
    setAllLoggedDates(uniqueDates);
    setLoading(false);
  },[today]);

  useEffect(()=>{load();},[load]);

  const del=async k=>{await sd(k);load();};
  const addWater=async(ml)=>{
    const nw=Math.max(0,waterMl+ml);
    setWaterMl(nw);
    await ss(`water:${today}`,{ml:nw,goal:waterGoal,date:today});
  };
  const changeGoal=async(g)=>{
    setWaterGoal(g);
    await ss(`water:${today}`,{ml:waterMl,goal:g,date:today});
  };

  const cups=Math.round(waterMl/250);
  const totalCups=Math.round(waterGoal/250);
  const pct=Math.min(Math.round(waterMl/waterGoal*100),100);

  return(
    <section style={{maxWidth:900,margin:"0 auto",padding:"48px 24px 80px"}}>
      <h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:32,fontWeight:700,margin:"0 0 8px",color:T.ink}}>{t.track.title}</h1>
      <p style={{color:T.ink,opacity:0.6,fontSize:15,margin:"0 0 24px"}}>{t.track.sub}</p>

      {/* Streak Tracker */}
      {!loading&&allLoggedDates.length>0&&(()=>{
        const sortedDates=[...allLoggedDates].sort();
        let streak=0;
        let checkDate=new Date();
        const todayStr=checkDate.toISOString().slice(0,10);
        const hasToday=sortedDates.includes(todayStr);
        if(!hasToday)checkDate.setDate(checkDate.getDate()-1);
        while(true){
          const dStr=checkDate.toISOString().slice(0,10);
          if(sortedDates.includes(dStr)){streak++;checkDate.setDate(checkDate.getDate()-1);}
          else break;
        }
        const longestStreak=(()=>{
          let longest=0,current=0,prevDate=null;
          for(const d of sortedDates){
            if(prevDate){
              const diff=(new Date(d)-new Date(prevDate))/(1000*60*60*24);
              current=diff===1?current+1:1;
            }else current=1;
            longest=Math.max(longest,current);
            prevDate=d;
          }
          return longest;
        })();
        if(streak===0)return null;
        return(
          <div style={{background:"linear-gradient(135deg,#F59E0B,#E8623F)",borderRadius:14,padding:"18px 22px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:32}}>🔥</span>
              <div>
                <div style={{fontSize:24,fontWeight:800,color:"#fff",fontFamily:"'Source Serif 4',Georgia,serif"}}>{streak} {lang==="tr"?(streak===1?"gün":"gündür"):(streak===1?"day":"days")}</div>
                <div style={{fontSize:12.5,color:"#fff",opacity:0.85,fontWeight:600}}>{lang==="tr"?"kesintisiz takip":"tracking streak"}</div>
              </div>
            </div>
            {longestStreak>streak&&<div style={{textAlign:"right"}}><div style={{fontSize:11,color:"#fff",opacity:0.75}}>{lang==="tr"?"En uzun seri":"Longest streak"}</div><div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{longestStreak} {lang==="tr"?"gün":"days"}</div></div>}
          </div>
        );
      })()}

      <Card st={{marginBottom:28,background:T.paper,borderColor:T.line}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
          <div>
            <h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:20,fontWeight:700,margin:"0 0 4px",color:T.ink}}>💧 {lang==="tr"?"Su Takibi":"Water Tracker"}{t.track&&" "}{typeof t.track==="object"&&t.track.waterTitle}</h2>
            <p style={{fontSize:13,color:T.ink,opacity:0.5,margin:0}}>{today}</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:13,color:T.ink,opacity:0.5}}>{lang==="tr"?"Hedef":"Goal"}:</span>
            <select value={waterGoal} onChange={e=>changeGoal(Number(e.target.value))} style={{padding:"6px 10px",borderRadius:8,border:`1px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
              {[1500,2000,2500,3000,3500].map(g=><option key={g} value={g}>{g}ml ({g/1000}L)</option>)}
            </select>
          </div>
        </div>

        {/* Visual cups */}
        <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:20}}>
          {Array(totalCups).fill(0).map((_,i)=>(
            <div key={i} onClick={()=>i<cups?addWater(-250):addWater(250)} style={{width:44,height:52,borderRadius:"0 0 8px 8px",border:`2px solid ${i<cups?"#3B82F6":T.line}`,background:i<cups?"#3B82F620":T.paperDim,cursor:"pointer",display:"flex",flexDirection:"column",justifyContent:"flex-end",overflow:"hidden",transition:"all 0.2s",position:"relative"}}>
              {i<cups&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"75%",background:"#3B82F640",borderRadius:"0 0 6px 6px"}}/>}
              <div style={{position:"absolute",bottom:4,left:0,right:0,textAlign:"center",fontSize:10,fontWeight:700,color:i<cups?"#3B82F6":T.ink,opacity:i<cups?1:0.3}}>☕</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13}}>
            <span style={{fontWeight:700,color:T.ink}}>{waterMl}ml <span style={{opacity:0.5,fontWeight:400}}>/ {waterGoal}ml</span></span>
            <span style={{fontWeight:700,color:"#3B82F6"}}>{pct}%</span>
          </div>
          <div style={{height:10,background:T.line,borderRadius:5,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#60A5FA,#3B82F6)",borderRadius:5,transition:"width 0.3s"}}/>
          </div>
          {pct>=100&&<div style={{marginTop:8,fontSize:13,color:"#3B82F6",fontWeight:700}}>🎉 {typeof t.track.goalReached==="string"?t.track.goalReached:"Günlük hedefine ulaştın!"}</div>}
        </div>

        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[250,500,750].map(ml=>(
            <button key={ml} onClick={()=>addWater(ml)} style={{padding:"9px 16px",borderRadius:8,border:`1.5px solid ${"#3B82F6"}`,background:"#3B82F610",color:"#3B82F6",fontSize:13.5,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+{ml}ml</button>
          ))}
          <button onClick={()=>addWater(-250)} style={{padding:"9px 14px",borderRadius:8,border:`1px solid ${T.line}`,background:"transparent",color:T.ink,opacity:0.5,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>-250ml</button>
          <button onClick={async()=>{setWaterMl(0);await ss(`water:${today}`,{ml:0,goal:waterGoal,date:today});}} style={{padding:"9px 14px",borderRadius:8,border:`1px solid ${T.line}`,background:"transparent",color:T.ink,opacity:0.5,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Sıfırla</button>
        </div>
      </Card>

      {loading&&<Spin/>}
      {!loading&&entries.length===0&&<div style={{border:`1.5px dashed ${T.line}`,borderRadius:14,padding:50,textAlign:"center",color:T.ink,opacity:0.45}}><ClipboardList size={28} style={{marginBottom:10}}/><p style={{margin:0,fontSize:14}}>{t.track.empty}</p></div>}
      {!loading&&entries.length>0&&<>
        {entries.length>1&&<WC entries={entries} t={t} T={T} lang={lang}/>}
        <Card st={{padding:0,overflow:"hidden",background:T.paper,borderColor:T.line}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:T.paperDim}}>{[t.track.date,t.track.weight,t.track.target,t.track.water,""].map((h,i)=><th key={i} style={{textAlign:"left",padding:"12px 18px",fontSize:11.5,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",color:T.ink,opacity:0.55}}>{h}</th>)}</tr></thead>
            <tbody>{entries.map(e=><tr key={e.key} style={{borderTop:`1px solid ${T.paperDim}`}}><td style={{padding:"12px 18px",fontSize:14,fontWeight:600,color:T.ink}}>{e.date}</td><td style={{padding:"12px 18px",fontSize:14,color:T.ink}}>{e.weight} kg</td><td style={{padding:"12px 18px",fontSize:14,color:T.ink}}>{e.target} kcal</td><td style={{padding:"12px 18px",fontSize:14,color:T.ink}}>{e.water} L</td><td style={{padding:"12px 18px",textAlign:"right"}}><button onClick={()=>del(e.key)} style={{background:"none",border:"none",cursor:"pointer",color:T.ink,opacity:0.35}}><Trash2 size={15}/></button></td></tr>)}</tbody>
          </table>
        </Card>
      </>}
    </section>
  );
}

function WC({entries,t,T=C,lang="tr",targetWeight=null}){
  const sorted=[...entries].sort((a,b)=>a.ts-b.ts);
  const datasets=[
    {key:"weight",label:lang==="tr"?"Kilo":"Weight",  color:C.coral},
    {key:"waist", label:lang==="tr"?"Bel":"Waist",    color:C.sage},
    {key:"hip",   label:lang==="tr"?"Kalça":"Hip",    color:C.gold},
  ];
  const active=datasets.filter(d=>sorted.some(e=>Number(e[d.key])>0));
  const allVals=active.flatMap(d=>sorted.map(e=>Number(e[d.key])||0).filter(v=>v>0));
  if(allVals.length===0)return null;
  const tw=targetWeight?Number(targetWeight):null;
  const rawMn=Math.min(...allVals,...(tw?[tw]:[]))-2;
  const rawMx=Math.max(...allVals,...(tw?[tw]:[]))+2;
  const mn=rawMn,mx=rawMx,rng=mx-mn||1;
  const W=800,H=180,P=30;
  const pts=key=>{
    const valid=sorted.filter(e=>Number(e[key])>0);
    return valid.map(e=>{const i=sorted.indexOf(e);const x=P+(i/Math.max(sorted.length-1,1))*(W-P*2);const y=H-P-((Number(e[key])-mn)/rng)*(H-P*2);return`${x},${y}`;}).join(" ");
  };
  const targetY=tw?H-P-((tw-mn)/rng)*(H-P*2):null;
  return(
    <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:14,padding:20,marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <h3 style={{fontSize:13,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",color:T.ink,opacity:0.5,margin:0}}>{lang==="tr"?"Ölçüm Grafiği":"Measurement Chart"}</h3>
        <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
          {active.map(d=><div key={d.key} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:14,height:3,borderRadius:2,background:d.color}}/><span style={{fontSize:11,color:T.ink,opacity:0.6}}>{d.label}</span></div>)}
          {tw&&<div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:14,height:0,borderTop:`2px dashed ${C.gold}`}}/><span style={{fontSize:11,color:T.ink,opacity:0.6}}>🎯 {lang==="tr"?"Hedef":"Target"}</span></div>}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto"}} preserveAspectRatio="none">
        {[0.25,0.5,0.75].map((f,i)=>{const y=P+f*(H-P*2);const v=Math.round(mx-f*rng);return<g key={i}><line x1={P} y1={y} x2={W-P} y2={y} stroke={T.line} strokeWidth="1" strokeDasharray="3 5" opacity="0.5"/><text x={P-4} y={y+3} textAnchor="end" fontSize="9" fill={T.ink} opacity="0.4">{v}</text></g>;})}
        {targetY!==null&&<g><line x1={P} y1={targetY} x2={W-P} y2={targetY} stroke={C.gold} strokeWidth="2" strokeDasharray="6 4"/><text x={W-P} y={targetY-6} textAnchor="end" fontSize="10" fontWeight="700" fill={C.gold}>🎯 {tw}kg</text></g>}
        {active.map(d=><polyline key={d.key} points={pts(d.key)} fill="none" stroke={d.color} strokeWidth="2.5" strokeLinejoin="round"/>)}
        {sorted.map((e,i)=>{if(!Number(e.weight))return null;const x=P+(i/Math.max(sorted.length-1,1))*(W-P*2);const y=H-P-((Number(e.weight)-mn)/rng)*(H-P*2);return<circle key={i} cx={x} cy={y} r="4" fill={C.coral}/>;  })}
      </svg>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:6,paddingLeft:P,paddingRight:P}}>
        {[sorted[0],sorted[Math.floor((sorted.length-1)/2)],sorted[sorted.length-1]].filter(Boolean).map((e,i)=><span key={i} style={{fontSize:10,color:T.ink,opacity:0.4}}>{e.date}</span>)}
      </div>
    </div>
  );
}

function Upsell({t,nav}){return<section style={{maxWidth:600,margin:"0 auto",padding:"100px 24px",textAlign:"center"}}><div style={{width:64,height:64,borderRadius:18,background:C.paperDim,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",color:C.gold}}><Lock size={26}/></div><h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:26,fontWeight:700,margin:"0 0 10px"}}>{t.upsell.title}</h2><p style={{color:C.ink,opacity:0.6,fontSize:15,marginBottom:28,lineHeight:1.6}}>{t.upsell.sub}</p><Btn ch={<><Crown size={16}/> {t.upsell.cta}</>} vr="coral" onClick={()=>nav("proLanding")} st={{padding:"14px 28px"}}/></section>;}

function ProLanding({t,nav,isPro}){return<section style={{maxWidth:1000,margin:"0 auto",padding:"60px 24px 90px"}}><div style={{textAlign:"center",marginBottom:50}}><PBadge/><h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:36,fontWeight:700,margin:"16px 0 12px"}}>{t.pro.title}</h1><p style={{color:C.ink,opacity:0.6,fontSize:16,maxWidth:480,margin:"0 auto"}}>{t.pro.sub}</p></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:44}} className="g2">{[t.pro.f1,t.pro.f2,t.pro.f3,t.pro.f4].map((f,i)=><div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",background:"#fff",border:`1px solid ${C.line}`,borderRadius:12,padding:18}}><div style={{width:26,height:26,borderRadius:7,background:C.ink,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Check size={14}/></div><span style={{fontSize:14.5,lineHeight:1.5}}>{f}</span></div>)}</div><div style={{textAlign:"center"}}>{!isPro?<Btn ch={<><Crown size={17}/> {t.pro.demo}</>} vr="coral" onClick={()=>nav("proCheckout")} st={{padding:"16px 32px",fontSize:16}}/>:<Btn ch={<>{t.pro.goApp} <ArrowRight size={16}/></>} vr="primary" onClick={()=>nav("clients")} st={{padding:"16px 32px",fontSize:16}}/>}</div></section>;}

function ProCheckout({t,nav,goPro}){
  const[plan,setPlan]=useState("yearly");const[proc,setProc]=useState(false);const[done,setDone]=useState(false);const[card,setCard]=useState({number:"",expiry:"",cvc:"",name:""});
  const sub=async e=>{e.preventDefault();setProc(true);setTimeout(async()=>{await goPro();setProc(false);setDone(true);},1400);};
  if(done)return<section style={{maxWidth:480,margin:"0 auto",padding:"100px 24px",textAlign:"center"}}><div style={{width:70,height:70,borderRadius:"50%",background:C.sage,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}><Check size={32} color="#fff"/></div><h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:26,fontWeight:700,margin:"0 0 8px"}}>{t.pro.success}</h2><p style={{color:C.ink,opacity:0.6,marginBottom:28}}>{t.pro.successSub}</p><Btn ch={<>{t.pro.goApp} <ArrowRight size={16}/></>} vr="primary" onClick={()=>nav("clients")} st={{padding:"14px 28px"}}/></section>;
  return<section style={{maxWidth:480,margin:"0 auto",padding:"60px 24px 90px"}}><div style={{textAlign:"center",marginBottom:28}}><PBadge/><h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:26,fontWeight:700,margin:"14px 0 6px"}}>{t.pro.demo}</h1><p style={{fontSize:12.5,color:C.gold,fontWeight:600}}>{t.pro.demoNote}</p></div><div style={{display:"flex",gap:10,marginBottom:22}}>{[{k:"monthly",l:t.pro.pM,p:"₺149"},{k:"yearly",l:t.pro.pY,p:"₺1.490"}].map(pl=><button key={pl.k} onClick={()=>setPlan(pl.k)} style={{flex:1,padding:"16px 14px",borderRadius:12,cursor:"pointer",textAlign:"left",border:`2px solid ${plan===pl.k?C.coral:C.line}`,background:plan===pl.k?C.coralSoft:"#fff"}}><div style={{fontSize:12.5,fontWeight:700,opacity:0.7,marginBottom:4}}>{pl.l}</div><div style={{fontSize:20,fontWeight:800,fontFamily:"'Source Serif 4',Georgia,serif"}}>{pl.p}</div></button>)}</div><Card st={{}}><form onSubmit={sub}><Fld label={t.pro.cardName}><TIn required value={card.name} onChange={e=>setCard({...card,name:e.target.value})} placeholder="Ada Yılmaz"/></Fld><Fld label={t.pro.cardNum}><TIn required value={card.number} onChange={e=>setCard({...card,number:e.target.value})} placeholder="4242 4242 4242 4242" maxLength={19}/></Fld><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Fld label={t.pro.expiry}><TIn required value={card.expiry} onChange={e=>setCard({...card,expiry:e.target.value})} placeholder="12/28"/></Fld><Fld label={t.pro.cvc}><TIn required value={card.cvc} onChange={e=>setCard({...card,cvc:e.target.value})} placeholder="123" maxLength={4}/></Fld></div><Btn tp="submit" ch={proc?t.pro.proc:<>{t.pro.confirm} <ArrowRight size={15}/></>} vr="coral" dis={proc} st={{width:"100%",padding:"15px",marginTop:8}}/></form></Card></section>;
}

function ClientsPage({t,lang,nav,setSel,T=C}){
  const[clients,setClients]=useState([]);
  const[loading,setLoading]=useState(true);
  const[showForm,setShowForm]=useState(false);
  const[search,setSearch]=useState("");
  const[form,setForm]=useState({name:"",age:"",gender:"female",height:"",weight:"",condition:"",notes:"",targetKcal:"",targetWater:"",nextAppt:"",targetWeight:"",status:"active",phone:"",email:""});
  const[revenueStats,setRevenueStats]=useState(null);
  const[lowAdherenceClients,setLowAdherenceClients]=useState([]);

  const loadAdherence=async(clientList)=>{
    const thirtyDaysAgo=Date.now()-30*24*60*60*1000;
    const lowList=[];
    for(const c of clientList){
      if(c.status!=="active"&&c.status)continue; // skip paused/completed
      const histKeys=await sl(`${c.key}:history:`);
      const nutriKeys=await sl(`${c.key}:nutri:`);
      let recentWeight=0,recentNutri=0;
      for(const k of histKeys){const v=await sg(k);if(v&&v.ts>=thirtyDaysAgo)recentWeight++;}
      for(const k of nutriKeys){const v=await sg(k);if(v&&v.ts>=thirtyDaysAgo)recentNutri++;}
      const weightScore=Math.min(recentWeight/4,1)*40;
      const nutriScore=Math.min(recentNutri/10,1)*40;
      const engagementScore=(recentWeight+recentNutri)>0?20:0;
      const total=Math.round(weightScore+nutriScore+engagementScore);
      if(total<35&&(histKeys.length>0||nutriKeys.length>0)) lowList.push({...c,score:total});
    }
    setLowAdherenceClients(lowList);
  };

  const loadRevenue=async(clientList)=>{
    const today=new Date();
    const thisMonth=today.getMonth();
    const thisYear=today.getFullYear();
    let monthTotal=0,pendingTotal=0,allTimeTotal=0;
    for(const c of clientList){
      const sessions=await sg(`${c.key}:sessions`);
      if(!sessions)continue;
      for(const s of sessions){
        if(s.paid){
          allTimeTotal+=s.fee;
          const d=new Date(s.date);
          if(d.getMonth()===thisMonth&&d.getFullYear()===thisYear)monthTotal+=s.fee;
        }else{
          pendingTotal+=s.fee;
        }
      }
    }
    setRevenueStats({monthTotal,pendingTotal,allTimeTotal});
  };

  useEffect(()=>{
    (async()=>{
      try{
        const ks=await sl("client:");
        const items=[];
        for(const k of ks){
          const v=await sg(k);
          if(v&&v.name)items.push({...v,key:k});
        }
        items.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
        setClients(items);
        loadRevenue(items);
        loadAdherence(items);
      }catch(e){console.error("load error",e);}
      setLoading(false);
    })();
  },[]);

  const reload=async()=>{
    setLoading(true);
    try{
      const ks=await sl("client:");
      const items=[];
      for(const k of ks){const v=await sg(k);if(v&&v.name)items.push({...v,key:k});}
      items.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
      setClients(items);
      loadRevenue(items);
      loadAdherence(items);
    }catch(e){console.error(e);}
    setLoading(false);
  };

  const add=async(e)=>{
    e.preventDefault();
    if(!form.name.trim())return;
    const id="client:"+Date.now();
    await ss(id,{...form,createdAt:Date.now(),id});
    setForm({name:"",age:"",gender:"female",height:"",weight:"",condition:"",notes:"",targetKcal:"",targetWater:"",nextAppt:"",targetWeight:"",status:"active",phone:"",email:""});
    setShowForm(false);
    reload();
  };

  const del=async(key)=>{
    if(!window.confirm(lang==="tr"?"Bu danışanı silmek istediğine emin misin?":"Are you sure you want to delete this client?"))return;
    await sd(key);
    reload();
  };

  const[exporting,setExporting]=useState(false);
  const[importing,setImporting]=useState(false);
  const[importMsg,setImportMsg]=useState(null);

  const exportAllData=async()=>{
    setExporting(true);
    try{
      const allKeys=await sl("");
      const backup={};
      for(const k of allKeys){
        const v=await sg(k);
        if(v!==null)backup[k]=v;
      }
      const payload={version:1,exportedAt:new Date().toISOString(),appName:"NutriBase",data:backup};
      const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      const dateStr=new Date().toISOString().slice(0,10);
      a.href=url;a.download=`nutribase-yedek-${dateStr}.json`;
      document.body.appendChild(a);a.click();document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }catch(e){console.error(e);}
    setExporting(false);
  };

  const[exportingCsv,setExportingCsv]=useState(false);
  const exportCsv=async(clientList)=>{
    setExportingCsv(true);
    try{
      const rows=[[lang==="tr"?"Tarih":"Date",lang==="tr"?"Danışan":"Client",lang==="tr"?"Ücret (₺)":"Fee (₺)",lang==="tr"?"Durum":"Status",lang==="tr"?"Not":"Note"]];
      for(const c of clientList){
        const sessions=await sg(`${c.key}:sessions`);
        if(!sessions)continue;
        for(const s of sessions){
          rows.push([s.date,c.name,s.fee,s.paid?(lang==="tr"?"Ödendi":"Paid"):(lang==="tr"?"Bekliyor":"Pending"),s.notes||""]);
        }
      }
      if(rows.length===1){
        alert(lang==="tr"?"Henüz hiçbir seans kaydı yok.":"No session records yet.");
        setExportingCsv(false);
        return;
      }
      const header=rows[0];
      const dataRows=rows.slice(1).sort((a,b)=>new Date(a[0])-new Date(b[0]));
      const allRows=[header,...dataRows];
      const csv=allRows.map(row=>row.map(cell=>`"${String(cell).replace(/"/g,'""')}"`).join(",")).join("\n");
      const bom="\uFEFF"; // UTF-8 BOM for Excel Turkish character support
      const blob=new Blob([bom+csv],{type:"text/csv;charset=utf-8;"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      const dateStr=new Date().toISOString().slice(0,10);
      a.href=url;a.download=`nutribase-muhasebe-${dateStr}.csv`;
      document.body.appendChild(a);a.click();document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }catch(e){console.error(e);}
    setExportingCsv(false);
  };


  const importData=async(e)=>{
    const file=e.target.files?.[0];
    if(!file)return;
    setImporting(true);setImportMsg(null);
    try{
      const text=await file.text();
      const payload=JSON.parse(text);
      const data=payload.data||payload; // support raw dumps too
      let count=0;
      for(const [k,v] of Object.entries(data)){
        await ss(k,v);
        count++;
      }
      setImportMsg({type:"success",text:lang==="tr"?`${count} kayıt başarıyla geri yüklendi!`:`${count} records restored successfully!`});
      reload();
    }catch(err){
      setImportMsg({type:"error",text:lang==="tr"?"Dosya okunamadı. Geçerli bir yedek dosyası seçtiğinden emin ol.":"Could not read file. Make sure you selected a valid backup file."});
    }
    setImporting(false);
    e.target.value="";
  };


  const[filterCondition,setFilterCondition]=useState("");
  const[filterStatus,setFilterStatus]=useState("");
  const[sortBy,setSortBy]=useState("recent");

  const uniqueConditions=[...new Set(clients.map(c=>c.condition).filter(Boolean))];

  let filtered=clients.filter(c=>
    c.name.toLowerCase().includes(search.toLowerCase())&&
    (filterCondition===""||c.condition===filterCondition)&&
    (filterStatus===""||((c.status||"active")===filterStatus))
  );
  filtered=[...filtered].sort((a,b)=>{
    if(sortBy==="name")return a.name.localeCompare(b.name);
    if(sortBy==="appt"){
      if(!a.nextAppt&&!b.nextAppt)return 0;
      if(!a.nextAppt)return 1;
      if(!b.nextAppt)return -1;
      return new Date(a.nextAppt)-new Date(b.nextAppt);
    }
    return (b.createdAt||0)-(a.createdAt||0); // recent (default)
  });

  return(
    <section style={{maxWidth:1000,margin:"0 auto",padding:"48px 24px 80px"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28,flexWrap:"wrap",gap:14}}>
        <h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:30,fontWeight:700,margin:0,color:T.ink,display:"flex",alignItems:"center",gap:10}}>
          {lang==="tr"?"Danışanlarım":"My Clients"} <PBadge sm/>
        </h1>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button onClick={exportAllData} disabled={exporting} title={lang==="tr"?"Tüm verileri yedekle":"Backup all data"} style={{display:"flex",alignItems:"center",gap:6,padding:"11px 16px",borderRadius:9,background:"transparent",color:T.ink,border:`1.5px solid ${T.line}`,cursor:exporting?"not-allowed":"pointer",fontSize:13.5,fontWeight:600,fontFamily:"inherit",opacity:exporting?0.5:1}}>
            💾 {exporting?(lang==="tr"?"Hazırlanıyor...":"Preparing..."):(lang==="tr"?"Yedekle":"Backup")}
          </button>
          <label style={{display:"flex",alignItems:"center",gap:6,padding:"11px 16px",borderRadius:9,background:"transparent",color:T.ink,border:`1.5px solid ${T.line}`,cursor:importing?"not-allowed":"pointer",fontSize:13.5,fontWeight:600,fontFamily:"inherit",opacity:importing?0.5:1}}>
            📥 {importing?(lang==="tr"?"Yükleniyor...":"Restoring..."):(lang==="tr"?"Geri Yükle":"Restore")}
            <input type="file" accept=".json" onChange={importData} disabled={importing} style={{display:"none"}}/>
          </label>
          <button onClick={()=>exportCsv(clients)} disabled={exportingCsv} title={lang==="tr"?"Muhasebe için CSV indir":"Download CSV for accounting"} style={{display:"flex",alignItems:"center",gap:6,padding:"11px 16px",borderRadius:9,background:"transparent",color:T.ink,border:`1.5px solid ${T.line}`,cursor:exportingCsv?"not-allowed":"pointer",fontSize:13.5,fontWeight:600,fontFamily:"inherit",opacity:exportingCsv?0.5:1}}>
            📈 {exportingCsv?(lang==="tr"?"Hazırlanıyor...":"Preparing..."):(lang==="tr"?"Muhasebe CSV":"Accounting CSV")}
          </button>
          <button onClick={()=>setShowForm(f=>!f)} style={{display:"flex",alignItems:"center",gap:8,padding:"11px 20px",borderRadius:9,background:C.coral,color:"#fff",border:"none",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>
            <Plus size={16}/> {lang==="tr"?"Yeni Danışan":"New Client"}
          </button>
        </div>
      </div>

      {importMsg&&(
        <div style={{background:importMsg.type==="success"?"#E8F5E9":C.coralSoft,border:`1px solid ${importMsg.type==="success"?C.sage:C.coral}`,borderRadius:10,padding:14,marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:13,color:importMsg.type==="success"?C.sage:C.coral,fontWeight:600}}>{importMsg.text}</span>
          <button onClick={()=>setImportMsg(null)} style={{background:"none",border:"none",cursor:"pointer",opacity:0.5}}><X size={14}/></button>
        </div>
      )}

      {/* Dashboard Stats */}
      {!loading&&clients.length>0&&(()=>{
        const today=new Date();today.setHours(0,0,0,0);
        const in7days=new Date(today);in7days.setDate(in7days.getDate()+7);
        const upcoming=clients.filter(c=>{
          if(!c.nextAppt)return false;
          const d=new Date(c.nextAppt);
          return d>=today&&d<=in7days;
        }).sort((a,b)=>new Date(a.nextAppt)-new Date(b.nextAppt));
        const overdue=clients.filter(c=>c.nextAppt&&new Date(c.nextAppt)<today);
        const conditionCounts={};
        clients.forEach(c=>{if(c.condition)conditionCounts[c.condition]=(conditionCounts[c.condition]||0)+1;});
        const topCondition=Object.entries(conditionCounts).sort((a,b)=>b[1]-a[1])[0];

        return(
          <div style={{marginBottom:28}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}} className="g3">
              <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,padding:"16px 18px"}}>
                <div style={{fontSize:11,fontWeight:700,color:T.ink,opacity:0.5,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>{lang==="tr"?"Toplam Danışan":"Total Clients"}</div>
                <div style={{fontSize:26,fontWeight:800,color:T.ink,fontFamily:"'Source Serif 4',Georgia,serif"}}>{clients.length}</div>
              </div>
              <div style={{background:T.paper,border:`1.5px solid ${upcoming.length>0?C.sage:T.line}`,borderRadius:12,padding:"16px 18px"}}>
                <div style={{fontSize:11,fontWeight:700,color:upcoming.length>0?C.sage:T.ink,opacity:upcoming.length>0?0.9:0.5,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>📅 {lang==="tr"?"Bu Hafta Randevu":"This Week"}</div>
                <div style={{fontSize:26,fontWeight:800,color:upcoming.length>0?C.sage:T.ink,fontFamily:"'Source Serif 4',Georgia,serif"}}>{upcoming.length}</div>
              </div>
              <div style={{background:T.paper,border:`1.5px solid ${overdue.length>0?C.coral:T.line}`,borderRadius:12,padding:"16px 18px"}}>
                <div style={{fontSize:11,fontWeight:700,color:overdue.length>0?C.coral:T.ink,opacity:overdue.length>0?0.9:0.5,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>⚠️ {lang==="tr"?"Geçmiş Randevu":"Overdue"}</div>
                <div style={{fontSize:26,fontWeight:800,color:overdue.length>0?C.coral:T.ink,fontFamily:"'Source Serif 4',Georgia,serif"}}>{overdue.length}</div>
              </div>
              <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,padding:"16px 18px"}}>
                <div style={{fontSize:11,fontWeight:700,color:T.ink,opacity:0.5,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>{lang==="tr"?"En Sık Durum":"Top Condition"}</div>
                <div style={{fontSize:14,fontWeight:700,color:T.ink,marginTop:4,lineHeight:1.3}}>{topCondition?topCondition[0]:"—"}</div>
              </div>
            </div>

            {revenueStats&&(revenueStats.monthTotal>0||revenueStats.pendingTotal>0)&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}} className="g3">
                <div style={{background:C.ink,borderRadius:12,padding:"16px 18px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#fff",opacity:0.6,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>💰 {lang==="tr"?"Bu Ay Gelir":"This Month"}</div>
                  <div style={{fontSize:24,fontWeight:800,color:"#fff",fontFamily:"'Source Serif 4',Georgia,serif"}}>₺{revenueStats.monthTotal.toLocaleString()}</div>
                </div>
                <div style={{background:T.paper,border:`1.5px solid ${revenueStats.pendingTotal>0?C.coral:T.line}`,borderRadius:12,padding:"16px 18px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:revenueStats.pendingTotal>0?C.coral:T.ink,opacity:revenueStats.pendingTotal>0?0.9:0.5,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>⏳ {lang==="tr"?"Bekleyen Ödeme":"Pending Payment"}</div>
                  <div style={{fontSize:24,fontWeight:800,color:revenueStats.pendingTotal>0?C.coral:T.ink,fontFamily:"'Source Serif 4',Georgia,serif"}}>₺{revenueStats.pendingTotal.toLocaleString()}</div>
                </div>
                <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,padding:"16px 18px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.ink,opacity:0.5,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>{lang==="tr"?"Toplam (Tüm Zamanlar)":"All-Time Total"}</div>
                  <div style={{fontSize:24,fontWeight:800,color:C.sage,fontFamily:"'Source Serif 4',Georgia,serif"}}>₺{revenueStats.allTimeTotal.toLocaleString()}</div>
                </div>
              </div>
            )}

            {upcoming.length>0&&(
              <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,padding:18,marginBottom:8}}>
                <h4 style={{fontSize:12.5,fontWeight:700,color:T.ink,opacity:0.6,textTransform:"uppercase",letterSpacing:"0.05em",margin:"0 0 12px"}}>📅 {lang==="tr"?"Yaklaşan Randevular":"Upcoming Appointments"}</h4>
                {upcoming.map(c=>{
                  const days=Math.ceil((new Date(c.nextAppt)-today)/(1000*60*60*24));
                  return(
                    <div key={c.key} onClick={()=>{setSel(c.key);nav("clientProfile");}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderTop:`1px solid ${T.paperDim}`,cursor:"pointer"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:14,fontWeight:600,color:T.ink}}>{c.name}</span>
                        {c.condition&&<span style={{fontSize:11,fontWeight:600,background:C.coralSoft,color:C.coral,padding:"2px 8px",borderRadius:10}}>{c.condition}</span>}
                      </div>
                      <span style={{fontSize:12.5,fontWeight:700,color:days===0?C.coral:C.sage}}>{days===0?(lang==="tr"?"Bugün":"Today"):days===1?(lang==="tr"?"Yarın":"Tomorrow"):(lang==="tr"?`${days} gün sonra`:`in ${days} days`)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {lowAdherenceClients.length>0&&(
              <div style={{background:T.paper,border:`1px solid ${C.coral}40`,borderRadius:12,padding:18,marginBottom:8}}>
                <h4 style={{fontSize:12.5,fontWeight:700,color:C.coral,opacity:0.9,textTransform:"uppercase",letterSpacing:"0.05em",margin:"0 0 12px"}}>🔴 {lang==="tr"?"Düşük Uyumlu Danışanlar":"Low Adherence Clients"} <span style={{fontWeight:500,opacity:0.7}}>({lang==="tr"?"son 30 gün":"last 30 days"})</span></h4>
                {lowAdherenceClients.map(c=>(
                  <div key={c.key} onClick={()=>{setSel(c.key);nav("clientProfile");}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderTop:`1px solid ${T.paperDim}`,cursor:"pointer"}}>
                    <span style={{fontSize:14,fontWeight:600,color:T.ink}}>{c.name}</span>
                    <span style={{fontSize:12.5,fontWeight:700,color:C.coral}}>{c.score}/100</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Add form */}
      {showForm&&(
        <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:14,padding:24,marginBottom:24}}>
          <h3 style={{fontSize:15,fontWeight:700,margin:"0 0 20px",color:T.ink}}>{lang==="tr"?"Yeni Danışan Ekle":"Add New Client"}</h3>
          <form onSubmit={add}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}} className="g2">
              <div><label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="tr"?"Ad / Kod *":"Name / Code *"}</label><input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder={lang==="tr"?"örn. Danışan-001":"e.g. Client-001"} style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
              <div><label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="tr"?"Yaş":"Age"}</label><input type="number" value={form.age} onChange={e=>setForm(f=>({...f,age:e.target.value}))} style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="tr"?"Durum":"Status"}</label>
              <div style={{display:"flex",gap:8}}>
                {[{k:"active",l:lang==="tr"?"🟢 Aktif":"🟢 Active"},{k:"paused",l:lang==="tr"?"🟡 Beklemede":"🟡 Paused"},{k:"completed",l:lang==="tr"?"✅ Tamamlandı":"✅ Completed"}].map(opt=>(
                  <button key={opt.k} type="button" onClick={()=>setForm(f=>({...f,status:opt.k}))} style={{flex:1,padding:"9px 10px",borderRadius:8,fontSize:12.5,fontWeight:600,border:`1.5px solid ${form.status===opt.k?C.ink:T.line}`,background:form.status===opt.k?C.ink:"transparent",color:form.status===opt.k?"#fff":T.ink,cursor:"pointer",fontFamily:"inherit"}}>{opt.l}</button>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}} className="g3">
              <div><label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="tr"?"Boy (cm)":"Height (cm)"}</label><input type="number" value={form.height} onChange={e=>setForm(f=>({...f,height:e.target.value}))} style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
              <div><label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="tr"?"Kilo (kg)":"Weight (kg)"}</label><input type="number" value={form.weight} onChange={e=>setForm(f=>({...f,weight:e.target.value}))} style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
              <div><label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="tr"?"Sağlık Durumu":"Condition"}</label><input value={form.condition} onChange={e=>setForm(f=>({...f,condition:e.target.value}))} placeholder={lang==="tr"?"örn. Tip 2 Diyabet":"e.g. Type 2 Diabetes"} style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}} className="g2">
              <div><label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>📞 {lang==="tr"?"Telefon":"Phone"}</label><input type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="0555 123 45 67" style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
              <div><label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>✉️ {lang==="tr"?"E-posta":"Email"}</label><input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="ornek@email.com" style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}} className="g3">
              <div><label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="tr"?"Hedef Kalori (kcal)":"Target Calories"}</label><input type="number" value={form.targetKcal} onChange={e=>setForm(f=>({...f,targetKcal:e.target.value}))} placeholder="1800" style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
              <div><label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="tr"?"Hedef Su (L)":"Target Water (L)"}</label><input type="number" value={form.targetWater} onChange={e=>setForm(f=>({...f,targetWater:e.target.value}))} placeholder="2.5" style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
              <div><label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>🎯 {lang==="tr"?"Hedef Kilo (kg)":"Target Weight (kg)"}</label><input type="number" value={form.targetWeight} onChange={e=>setForm(f=>({...f,targetWeight:e.target.value}))} placeholder="65" style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
            </div>
            <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>📅 {lang==="tr"?"Sonraki Randevu":"Next Appointment"}</label><input type="date" value={form.nextAppt||""} onChange={e=>setForm(f=>({...f,nextAppt:e.target.value}))} style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
            <div><label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="tr"?"Klinik Notlar":"Clinical Notes"}</label><textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2} style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none",resize:"vertical"}}/></div>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button type="submit" style={{padding:"11px 22px",borderRadius:8,background:C.ink,color:"#fff",border:"none",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>{lang==="tr"?"Kaydet":"Save"}</button>
              <button type="button" onClick={()=>setShowForm(false)} style={{padding:"11px 22px",borderRadius:8,background:"transparent",color:T.ink,border:`1.5px solid ${T.line}`,cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:"inherit"}}>{lang==="tr"?"Vazgeç":"Cancel"}</button>
            </div>
          </form>
        </div>
      )}

      {/* Search + Filter + Sort */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:10,marginBottom:24}} className="g2">
        <div style={{position:"relative"}}>
          <Search size={16} style={{position:"absolute",left:14,top:13,color:T.ink,opacity:0.4}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={lang==="tr"?"Danışan ara...":"Search clients..."} style={{width:"100%",padding:"11px 14px 11px 38px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/>
        </div>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{padding:"11px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:13.5,fontFamily:"inherit",cursor:"pointer",boxSizing:"border-box"}}>
          <option value="">{lang==="tr"?"Tüm Statüler":"All Statuses"}</option>
          <option value="active">{lang==="tr"?"🟢 Aktif":"🟢 Active"}</option>
          <option value="paused">{lang==="tr"?"🟡 Beklemede":"🟡 Paused"}</option>
          <option value="completed">{lang==="tr"?"✅ Tamamlandı":"✅ Completed"}</option>
        </select>
        <select value={filterCondition} onChange={e=>setFilterCondition(e.target.value)} style={{padding:"11px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:13.5,fontFamily:"inherit",cursor:"pointer",boxSizing:"border-box"}}>
          <option value="">{lang==="tr"?"Tüm Durumlar":"All Conditions"}</option>
          {uniqueConditions.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{padding:"11px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:13.5,fontFamily:"inherit",cursor:"pointer",boxSizing:"border-box"}}>
          <option value="recent">{lang==="tr"?"En Yeni":"Most Recent"}</option>
          <option value="name">{lang==="tr"?"İsme Göre (A-Z)":"Name (A-Z)"}</option>
          <option value="appt">{lang==="tr"?"Randevu Tarihine Göre":"By Appointment Date"}</option>
        </select>
      </div>
      {(search||filterCondition||filterStatus)&&<div style={{marginBottom:16,fontSize:12.5,color:T.ink,opacity:0.5}}>{lang==="tr"?`${filtered.length} sonuç bulundu`:`${filtered.length} results found`}{(filterCondition||filterStatus)&&<button onClick={()=>{setFilterCondition("");setFilterStatus("");}} style={{marginLeft:8,background:"none",border:"none",color:C.coral,cursor:"pointer",fontSize:12.5,fontWeight:600,fontFamily:"inherit"}}>{lang==="tr"?"filtreyi temizle":"clear filter"}</button>}</div>}

      {/* Loading */}
      {loading&&<div style={{display:"flex",justifyContent:"center",padding:40}}><div style={{width:28,height:28,borderRadius:"50%",border:`3px solid ${T.line}`,borderTopColor:C.coral,animation:"nbsp 0.7s linear infinite"}}/></div>}

      {/* Empty */}
      {!loading&&filtered.length===0&&(
        <div style={{border:`1.5px dashed ${T.line}`,borderRadius:14,padding:50,textAlign:"center",color:T.ink,opacity:0.55}}>
          <Users size={28} style={{marginBottom:12,display:"block",margin:"0 auto 12px"}}/>
          <p style={{margin:0,fontSize:14}}>{lang==="tr"?"Henüz danışan eklenmedi.":"No clients added yet."}</p>
        </div>
      )}

      {/* Client cards */}
      {!loading&&filtered.length>0&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}} className="g2">
          {filtered.map(c=>(
            <div key={c.key} style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:14,padding:24,opacity:(c.status==="completed")?0.7:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <h3 style={{fontSize:17,fontWeight:700,margin:0,color:T.ink}}>{c.name}</h3>
                    {(()=>{const st=c.status||"active";const cfg={active:{l:lang==="tr"?"Aktif":"Active",col:C.sage,dot:"🟢"},paused:{l:lang==="tr"?"Beklemede":"Paused",col:C.gold,dot:"🟡"},completed:{l:lang==="tr"?"Tamamlandı":"Completed",col:T.ink,dot:"✅"}}[st];return<span style={{fontSize:10.5,fontWeight:700,color:cfg.col,opacity:0.85}}>{cfg.dot}</span>;})()}
                  </div>
                  <p style={{fontSize:13,color:T.ink,opacity:0.5,margin:0}}>
                    {c.age?c.age+(lang==="tr"?" yaş":" yrs"):""}
                    {c.weight?" · "+c.weight+" kg":""}
                    {c.height?" · "+c.height+" cm":""}
                  </p>
                  {c.condition&&(
                    <span style={{display:"inline-block",marginTop:6,fontSize:11.5,fontWeight:600,background:C.coralSoft,color:C.coral,padding:"3px 10px",borderRadius:20}}>{c.condition}</span>
                  )}
                </div>
                <button onClick={()=>del(c.key)} style={{background:"none",border:"none",cursor:"pointer",color:T.ink,opacity:0.3,padding:4}}>
                  <Trash2 size={15}/>
                </button>
              </div>
              {(c.targetKcal||c.targetWater)&&(
                <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                  {c.targetKcal&&<span style={{fontSize:12,background:T.paperDim,color:T.ink,opacity:0.7,padding:"3px 10px",borderRadius:12,fontWeight:600}}>🎯 {c.targetKcal} kcal</span>}
                  {c.targetWater&&<span style={{fontSize:12,background:T.paperDim,color:T.ink,opacity:0.7,padding:"3px 10px",borderRadius:12,fontWeight:600}}>💧 {c.targetWater}L</span>}
                </div>
              )}
              <button onClick={()=>{setSel(c.key);nav("clientProfile");}} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,background:"transparent",color:T.ink,border:`1.5px solid ${T.line}`,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>
                {lang==="tr"?"Profili Gör":"View Profile"} <ChevronRight size={14}/>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
function ClientProfile({t,lang,clientId,nav,T=C}){
  const[client,setClient]=useState(null);
  const[hist,setHist]=useState([]);
  const[showAdd,setShowAdd]=useState(false);
  const[entry,setEntry]=useState({weight:"",waist:"",hip:"",chest:"",arm:"",note:""});
  const[showN,setShowN]=useState(false);
  const[nEntry,setNEntry]=useState(Array(26).fill(""));
  const[nHist,setNHist]=useState([]);
  const[exp,setExp]=useState(null);
  const[clinNotes,setClinNotes]=useState([]);
  const[showNoteForm,setShowNoteForm]=useState(false);
  const[noteText,setNoteText]=useState("");
  const[supps,setSupps]=useState([]);
  const[progressPhotos,setProgressPhotos]=useState([]);
  const[photoUploading,setPhotoUploading]=useState(false);
  const[viewingPhoto,setViewingPhoto]=useState(null);
  const[sessions,setSessions]=useState([]);
  const[labResults,setLabResults]=useState([]);
  const[showLabForm,setShowLabForm]=useState(false);
  const[newLab,setNewLab]=useState({date:new Date().toISOString().slice(0,10)});
  const[expandedLab,setExpandedLab]=useState(null);
  const[dietitianProfile,setDietitianProfile]=useState(null);
  const[showSessionForm,setShowSessionForm]=useState(false);
  const[newSession,setNewSession]=useState({date:new Date().toISOString().slice(0,10),fee:"",paid:true,notes:""});
  const[showSupForm,setShowSupForm]=useState(false);
  const[newSup,setNewSup]=useState({name:"",dose:"",freq:"",timing:""});
  const[dietPlan,setDietPlan]=useState(null);
  const[showShoppingList,setShowShoppingList]=useState(false);
  const[checkedItems,setCheckedItems]=useState({});
  const[dpDays,setDpDays]=useState(3);
  const[dpEdit,setDpEdit]=useState(null);
  const[dpEditTxt,setDpEditTxt]=useState("");
  const[dpNotes,setDpNotes]=useState("");
  const[dpTitle,setDpTitle]=useState("");
  const[showDpForm,setShowDpForm]=useState(false);
  const[exchPlan,setExchPlan]=useState(null);
  const load=useCallback(async()=>{
    if(!clientId)return;
    const c=await sg(clientId);setClient(c);
    const ks=await sl(`${clientId}:history:`);const items=[];
    for(const k of ks){const v=await sg(k);if(v)items.push({...v,key:k});}
    items.sort((a,b)=>b.ts-a.ts);setHist(items);
    const nks=await sl(`${clientId}:nutri:`);const ni=[];
    for(const k of nks){const v=await sg(k);if(v)ni.push({...v,key:k});}
    ni.sort((a,b)=>b.ts-a.ts);setNHist(ni);
    const cks=await sl(`${clientId}:clinNote:`);const cn=[];
    for(const k of cks){const v=await sg(k);if(v)cn.push({...v,key:k});}
    cn.sort((a,b)=>b.ts-a.ts);setClinNotes(cn);
    const supData=await sg(`${clientId}:supps`);if(supData)setSupps(supData);
    const photosData=await sg(`${clientId}:progressPhotos`);if(photosData)setProgressPhotos(photosData);
    const sessData=await sg(`${clientId}:sessions`);if(sessData)setSessions(sessData);
    const labData=await sg(`${clientId}:labResults`);if(labData)setLabResults(labData);
    const dp=await sg("dietitianProfile");if(dp)setDietitianProfile(dp);
    const dpData=await sg(`${clientId}:dietPlan`);
    if(dpData){setDietPlan(dpData);setDpNotes(dpData.notes||"");setDpTitle(dpData.title||"");setDpDays(dpData.days?.length||3);}
    const epData=await sg(`${clientId}:exchangePlan`);if(epData)setExchPlan(epData);
  },[clientId]);

  useEffect(()=>{load();},[load]);

  const addM=async e=>{
    e.preventDefault();if(!entry.weight)return;
    const ts=Date.now();
    await ss(`${clientId}:history:${ts}`,{...entry,ts,date:new Date().toISOString().slice(0,10)});
    setEntry({weight:"",waist:"",hip:"",chest:"",arm:"",note:""});
    setShowAdd(false);load();
  };
  const addN=async e=>{
    e.preventDefault();const ts=Date.now();
    const vals=nEntry.map(v=>v===""?null:parseFloat(v));
    await ss(`${clientId}:nutri:${ts}`,{vals,ts,date:new Date().toISOString().slice(0,10)});
    setNEntry(Array(26).fill(""));setShowN(false);load();
  };
  const addClinNote=async()=>{
    if(!noteText.trim())return;const ts=Date.now();const now=new Date();
    await ss(`${clientId}:clinNote:${ts}`,{text:noteText,ts,date:now.toISOString().slice(0,10),time:now.toLocaleTimeString(lang==="tr"?"tr-TR":"en-US",{hour:"2-digit",minute:"2-digit"})});
    setNoteText("");setShowNoteForm(false);load();
  };
  const delClinNote=async key=>{await sd(key);load();};
  const addSupp=async()=>{
    if(!newSup.name.trim())return;
    const updated=[...supps,{...newSup,id:Date.now()}];
    setSupps(updated);await ss(`${clientId}:supps`,updated);
    setNewSup({name:"",dose:"",freq:"",timing:""});setShowSupForm(false);
  };
  const delSupp=async id=>{
    const updated=supps.filter(s=>s.id!==id);
    setSupps(updated);await ss(`${clientId}:supps`,updated);
  };

  const handlePhotoUpload=(e)=>{
    const file=e.target.files?.[0];
    if(!file)return;
    setPhotoUploading(true);
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const img=new Image();
      img.onload=async()=>{
        const maxW=500;
        const scale=Math.min(1,maxW/img.width);
        const canvas=document.createElement("canvas");
        canvas.width=img.width*scale;
        canvas.height=img.height*scale;
        const ctx=canvas.getContext("2d");
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        const dataUrl=canvas.toDataURL("image/jpeg",0.75);
        const newPhoto={id:Date.now(),url:dataUrl,date:new Date().toISOString().slice(0,10)};
        const updated=[newPhoto,...progressPhotos];
        setProgressPhotos(updated);
        await ss(`${clientId}:progressPhotos`,updated);
        setPhotoUploading(false);
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value="";
  };
  const delPhoto=async(id)=>{
    const updated=progressPhotos.filter(p=>p.id!==id);
    setProgressPhotos(updated);
    await ss(`${clientId}:progressPhotos`,updated);
    if(viewingPhoto?.id===id)setViewingPhoto(null);
  };

  const addSession=async()=>{
    if(!newSession.fee)return;
    const session={...newSession,id:Date.now(),fee:parseFloat(newSession.fee)};
    const updated=[session,...sessions].sort((a,b)=>new Date(b.date)-new Date(a.date));
    setSessions(updated);
    await ss(`${clientId}:sessions`,updated);
    setNewSession({date:new Date().toISOString().slice(0,10),fee:"",paid:true,notes:""});
    setShowSessionForm(false);
  };
  const toggleSessionPaid=async(id)=>{
    const updated=sessions.map(s=>s.id===id?{...s,paid:!s.paid}:s);
    setSessions(updated);
    await ss(`${clientId}:sessions`,updated);
  };
  const delSession=async(id)=>{
    const updated=sessions.filter(s=>s.id!==id);
    setSessions(updated);
    await ss(`${clientId}:sessions`,updated);
  };

  const addLabResult=async()=>{
    const hasAnyValue=LAB_TESTS.some(test=>newLab[test.id]!==undefined&&newLab[test.id]!=="");
    if(!hasAnyValue)return;
    const record={...newLab,id:Date.now(),ts:Date.now()};
    const updated=[record,...labResults].sort((a,b)=>new Date(b.date)-new Date(a.date));
    setLabResults(updated);
    await ss(`${clientId}:labResults`,updated);
    setNewLab({date:new Date().toISOString().slice(0,10)});
    setShowLabForm(false);
  };
  const delLabResult=async(id)=>{
    const updated=labResults.filter(r=>r.id!==id);
    setLabResults(updated);
    await ss(`${clientId}:labResults`,updated);
  };

  const createDietPlan=async()=>{
    const days=Array(dpDays).fill(null).map((_,i)=>({day:i+1,meals:{b:"",l:"",d:"",s:""}}));
    const plan={title:dpTitle||(lang==="tr"?"Diyet Planı":"Diet Plan"),days,notes:"",createdAt:Date.now()};
    setDietPlan(plan);
    await ss(`${clientId}:dietPlan`,plan);
    setShowDpForm(false);
  };
  const saveDpCell=async()=>{
    if(!dpEdit||!dietPlan)return;
    const updated={...dietPlan,days:dietPlan.days.map((d,i)=>i===dpEdit.d?{...d,meals:{...d.meals,[dpEdit.s]:dpEditTxt}}:d)};
    setDietPlan(updated);await ss(`${clientId}:dietPlan`,updated);setDpEdit(null);
  };
  const saveDpNotes=async()=>{
    if(!dietPlan)return;
    const updated={...dietPlan,notes:dpNotes};
    setDietPlan(updated);await ss(`${clientId}:dietPlan`,updated);
  };
  const saveDpTitle=async()=>{
    if(!dietPlan)return;
    const updated={...dietPlan,title:dpTitle};
    setDietPlan(updated);await ss(`${clientId}:dietPlan`,updated);
  };
  const deleteDietPlan=async()=>{
    if(!window.confirm(lang==="tr"?"Bu diyet planını silmek istediğine emin misin?":"Delete this diet plan?"))return;
    await sd(`${clientId}:dietPlan`);setDietPlan(null);setDpTitle("");setDpNotes("");
  };
  const addDietDay=async()=>{
    if(!dietPlan)return;
    const updated={...dietPlan,days:[...dietPlan.days,{day:dietPlan.days.length+1,meals:{b:"",l:"",d:"",s:""}}]};
    setDietPlan(updated);await ss(`${clientId}:dietPlan`,updated);
  };
  const removeDietDay=async(idx)=>{
    if(!dietPlan||dietPlan.days.length<=1)return;
    const updated={...dietPlan,days:dietPlan.days.filter((_,i)=>i!==idx).map((d,i)=>({...d,day:i+1}))};
    setDietPlan(updated);await ss(`${clientId}:dietPlan`,updated);
  };

  const STORE_SECTIONS={
    sebze:{tr:"🥬 Sebze & Meyve",en:"🥬 Produce"},
    meyve:{tr:"🥬 Sebze & Meyve",en:"🥬 Produce"},
    et:{tr:"🥩 Et & Şarküteri",en:"🥩 Meat & Deli"},
    balık:{tr:"🐟 Balık",en:"🐟 Fish"},
    "yumurta-süt":{tr:"🥛 Süt Ürünleri",en:"🥛 Dairy"},
    tahıl:{tr:"🍞 Fırın & Tahıl",en:"🍞 Bakery & Grains"},
    baklagil:{tr:"🫘 Bakliyat",en:"🫘 Dry Goods"},
    kuruyemiş:{tr:"🥜 Kuruyemiş",en:"🥜 Nuts & Seeds"},
    yağ:{tr:"🫒 Yağ & Sos",en:"🫒 Oils & Condiments"},
    içecek:{tr:"🧃 İçecekler",en:"🧃 Beverages"},
    yemek:{tr:"🍽️ Diğer",en:"🍽️ Other"},
    fastfood:{tr:"🍽️ Diğer",en:"🍽️ Other"},
    tatlı:{tr:"🍽️ Diğer",en:"🍽️ Other"},
    diğer:{tr:"🍽️ Diğer",en:"🍽️ Other"},
  };
  const guessCategory=(label)=>{
    const lower=label.toLowerCase();
    const match=FOODS.find(f=>f.tr.toLowerCase().includes(lower)||lower.includes(f.tr.toLowerCase())||f.en.toLowerCase().includes(lower));
    return match?match.cat:"diğer";
  };
  const generateShoppingList=()=>{
    if(!dietPlan)return[];
    const items=new Map();
    dietPlan.days.forEach(day=>{
      Object.values(day.meals).forEach(mealText=>{
        if(!mealText)return;
        mealText.split("+").forEach(chunk=>{
          const clean=chunk.trim().replace(/^\d+\s*(adet|dilim|su bardağı|yemek kaşığı|tatlı kaşığı|gram|g|ml)?\s*/i,"").trim();
          if(clean.length<2)return;
          const key=clean.toLowerCase();
          items.set(key,(items.get(key)||{label:clean,count:0,cat:guessCategory(clean)}));
          items.get(key).count++;
        });
      });
    });
    const list=[...items.values()];
    // Group by category
    const grouped={};
    list.forEach(item=>{
      const sec=STORE_SECTIONS[item.cat]||STORE_SECTIONS.diğer;
      const secLabel=lang==="tr"?sec.tr:sec.en;
      if(!grouped[secLabel])grouped[secLabel]=[];
      grouped[secLabel].push(item);
    });
    Object.values(grouped).forEach(arr=>arr.sort((a,b)=>b.count-a.count));
    return grouped;
  };
  const toggleChecked=(key)=>setCheckedItems(prev=>({...prev,[key]:!prev[key]}));

  if(!client)return<section style={{maxWidth:800,margin:"0 auto",padding:"60px 24px"}}><Spin/></section>;

  return(
    <section style={{maxWidth:900,margin:"0 auto",padding:"40px 24px 80px"}}>
      <style>{`@media print{.np{display:none!important;}.nb-rh{display:flex!important;}@page{size:A4;margin:20mm;}}`}</style>
      {/* Print header */}
      <div className="nb-rh" style={{display:"none",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,paddingBottom:16,borderBottom:"2px solid #0E2A3D"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="#0E2A3D" strokeWidth="1.5"/><path d="M13 26V14L27 26V14" stroke="#E8623F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div>
            <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:800,fontSize:16,color:"#0E2A3D"}}>{dietitianProfile?.clinicName||"NutriBase PRO"}</div>
            {dietitianProfile?.dietitianName&&<div style={{fontSize:10.5,color:"#0E2A3D",opacity:0.6}}>{dietitianProfile.dietitianName}{dietitianProfile.tagline&&` · ${dietitianProfile.tagline}`}</div>}
          </div>
        </div>
        <div style={{textAlign:"right",fontSize:12,color:"#0E2A3D",opacity:0.6}}>
          <div>{new Date().toLocaleDateString(lang==="tr"?"tr-TR":"en-US",{day:"numeric",month:"long",year:"numeric"})}</div>
          <div style={{fontWeight:700,marginTop:2}}>{client.name}</div>
          {dietitianProfile?.phone&&<div style={{fontSize:10.5,marginTop:2}}>{dietitianProfile.phone}</div>}
        </div>
      </div>

      <button onClick={()=>nav("clients")} className="np" style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:13,color:T.ink,opacity:0.55,marginBottom:20,padding:0,fontWeight:600}}>← {t.common.back}</button>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:28,fontWeight:700,margin:"0 0 6px",color:T.ink}}>{client.name}</h1>
          <p style={{fontSize:14,color:T.ink,opacity:0.55,margin:"0 0 8px"}}>
            {client.age&&`${client.age} ${lang==="tr"?"yaş":"yrs"}`} · {client.gender==="male"?t.calc.male:t.calc.female}{client.height&&` · ${client.height} cm`}
          </p>
          {(client.phone||client.email)&&(
            <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
              {client.phone&&<a href={`tel:${client.phone.replace(/\s/g,"")}`} style={{display:"flex",alignItems:"center",gap:5,fontSize:13,color:C.sage,textDecoration:"none",fontWeight:600}}>📞 {client.phone}</a>}
              {client.email&&<a href={`mailto:${client.email}`} style={{display:"flex",alignItems:"center",gap:5,fontSize:13,color:C.sage,textDecoration:"none",fontWeight:600}}>✉️ {client.email}</a>}
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {client.condition&&<span style={{fontSize:12.5,fontWeight:600,background:C.coralSoft,color:C.coral,padding:"5px 12px",borderRadius:20}}>{client.condition}</span>}
          <button onClick={()=>window.print()} className="np" style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:8,border:`1px solid ${T.line}`,background:"transparent",color:T.ink,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}><Printer size={14}/> {lang==="tr"?"Rapor Yazdır":"Print Report"}</button>
        </div>
      </div>

      {/* Adherence Score — inspired by Practice Better's client accountability tracking */}
      {(hist.length>0||nHist.length>0)&&(()=>{
        const thirtyDaysAgo=Date.now()-30*24*60*60*1000;
        const recentWeightLogs=hist.filter(h=>h.ts>=thirtyDaysAgo).length;
        const recentNutriLogs=nHist.filter(h=>h.ts>=thirtyDaysAgo).length;
        const recentNotes=clinNotes.filter(n=>n.ts>=thirtyDaysAgo).length;
        // Score: weight logs (max 8 expected in 30d = weekly+), nutrition logs (max 20), capped and weighted
        const weightScore=Math.min(recentWeightLogs/4,1)*40; // up to 40 pts if 4+ weight logs
        const nutriScore=Math.min(recentNutriLogs/10,1)*40; // up to 40 pts if 10+ nutrition logs
        const engagementScore=Math.min((recentWeightLogs+recentNutriLogs)>0?1:0,1)*20; // 20 pts if any activity
        const total=Math.round(weightScore+nutriScore+engagementScore);
        const level=total>=70?{l:lang==="tr"?"Yüksek Uyum":"High Adherence",col:C.sage,emoji:"🟢"}:total>=35?{l:lang==="tr"?"Orta Uyum":"Moderate Adherence",col:C.gold,emoji:"🟡"}:{l:lang==="tr"?"Düşük Uyum":"Low Adherence",col:C.coral,emoji:"🔴"};
        return(
          <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:14,padding:"18px 22px",marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:10}}>
              <h4 style={{fontSize:13,fontWeight:700,color:T.ink,opacity:0.6,margin:0,display:"flex",alignItems:"center",gap:6}}>📈 {lang==="tr"?"Uyum Skoru":"Adherence Score"} <span style={{fontSize:10,fontWeight:500,opacity:0.6}}>({lang==="tr"?"son 30 gün":"last 30 days"})</span></h4>
              <span style={{fontSize:12,fontWeight:700,color:level.col,display:"flex",alignItems:"center",gap:5}}>{level.emoji} {level.l}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <div style={{fontSize:32,fontWeight:800,color:level.col,fontFamily:"'Source Serif 4',Georgia,serif",minWidth:64}}>{total}<span style={{fontSize:14,opacity:0.5}}>/100</span></div>
              <div style={{flex:1}}>
                <div style={{height:8,background:T.line,borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${total}%`,background:level.col,borderRadius:4,transition:"width 0.3s"}}/>
                </div>
                <div style={{display:"flex",gap:16,marginTop:8,flexWrap:"wrap"}}>
                  <span style={{fontSize:11,color:T.ink,opacity:0.55}}>⚖️ {recentWeightLogs} {lang==="tr"?"ölçüm":"measurements"}</span>
                  <span style={{fontSize:11,color:T.ink,opacity:0.55}}>🍽️ {recentNutriLogs} {lang==="tr"?"besin kaydı":"nutrition entries"}</span>
                  {recentNotes>0&&<span style={{fontSize:11,color:T.ink,opacity:0.55}}>📝 {recentNotes} {lang==="tr"?"klinik not":"clinical notes"}</span>}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Lab Results Tracking */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}} className="np">
        <div><h3 style={{fontSize:15,fontWeight:700,margin:"0 0 4px",color:T.ink}}>🧪 {lang==="tr"?"Tahlil Sonuçları":"Lab Results"}</h3><span style={{fontSize:12,color:T.ink,opacity:0.5}}>{lang==="tr"?"HbA1c, lipid paneli, vitamin ve mineral takibi":"HbA1c, lipid panel, vitamin & mineral tracking"}</span></div>
        <button onClick={()=>setShowLabForm(f=>!f)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:`1px solid ${T.line}`,background:"transparent",color:T.ink,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}><Plus size={14}/> {lang==="tr"?"Tahlil Ekle":"Add Lab Result"}</button>
      </div>

      {showLabForm&&(
        <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,padding:20,marginBottom:16}}>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:5,textTransform:"uppercase"}}>{lang==="tr"?"Tahlil Tarihi":"Test Date"}</label>
            <input type="date" value={newLab.date} onChange={e=>setNewLab(l=>({...l,date:e.target.value}))} style={{padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:14,fontFamily:"inherit",outline:"none"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}} className="g3">
            {LAB_TESTS.map(test=>(
              <div key={test.id}>
                <label style={{display:"block",fontSize:10.5,fontWeight:600,color:T.ink,opacity:0.55,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.03em"}}>{lang==="tr"?test.nameTr:test.nameEn} ({test.unit})</label>
                <input type="number" step="0.01" value={newLab[test.id]||""} onChange={e=>setNewLab(l=>({...l,[test.id]:e.target.value}))} placeholder="—" style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button onClick={addLabResult} style={{padding:"9px 18px",borderRadius:8,background:C.ink,color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>{lang==="tr"?"Kaydet":"Save"}</button>
            <button onClick={()=>setShowLabForm(false)} style={{padding:"9px 18px",borderRadius:8,background:"transparent",color:T.ink,border:`1px solid ${T.line}`,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>{lang==="tr"?"Vazgeç":"Cancel"}</button>
          </div>
        </div>
      )}

      {labResults.length===0&&!showLabForm&&<div className="np" style={{border:`1.5px dashed ${T.line}`,borderRadius:12,padding:24,textAlign:"center",color:T.ink,opacity:0.4,fontSize:14,marginBottom:28}}>{lang==="tr"?"Henüz tahlil sonucu eklenmedi.":"No lab results added yet."}</div>}

      {labResults.length>0&&(
        <div style={{marginBottom:28}}>
          {labResults.map((rec,ri)=>{
            const abnormal=LAB_TESTS.filter(test=>{
              const st=getLabStatus(test.id,parseFloat(rec[test.id]));
              return st&&st.label!=="normal";
            });
            return(
              <div key={rec.id} style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,marginBottom:10,overflow:"hidden"}}>
                <div onClick={()=>setExpandedLab(expandedLab===ri?null:ri)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",cursor:"pointer"}}>
                  <span style={{fontSize:14,fontWeight:700,color:T.ink}}>{rec.date}</span>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    {abnormal.length>0?<span style={{fontSize:11.5,fontWeight:700,color:C.coral,background:C.coralSoft,padding:"3px 10px",borderRadius:12}}>{abnormal.length} {lang==="tr"?"anormal değer":"abnormal value(s)"}</span>:<span style={{fontSize:11.5,fontWeight:700,color:C.sage,background:"#E8F5E9",padding:"3px 10px",borderRadius:12}}>✓ {lang==="tr"?"Normal":"Normal"}</span>}
                    {expandedLab===ri?<ChevronUp size={16} style={{opacity:0.4}}/>:<ChevronDown size={16} style={{opacity:0.4}}/>}
                  </div>
                </div>
                {expandedLab===ri&&(
                  <div style={{padding:"0 18px 18px"}}>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}} className="g3">
                      {LAB_TESTS.filter(test=>rec[test.id]!==undefined&&rec[test.id]!=="").map(test=>{
                        const val=parseFloat(rec[test.id]);
                        const status=getLabStatus(test.id,val);
                        const color=status?.label==="normal"?C.sage:status?.label==="warn"?C.gold:C.coral;
                        return(
                          <div key={test.id} style={{background:T.paperDim,borderRadius:8,padding:"10px 12px",borderLeft:`3px solid ${color}`}}>
                            <div style={{fontSize:10,fontWeight:600,color:T.ink,opacity:0.55,marginBottom:2}}>{lang==="tr"?test.nameTr:test.nameEn}</div>
                            <div style={{display:"flex",alignItems:"baseline",gap:4}}><span style={{fontSize:15,fontWeight:800,color:T.ink}}>{val}</span><span style={{fontSize:10,color:T.ink,opacity:0.4}}>{test.unit}</span></div>
                            {status&&<div style={{fontSize:10,fontWeight:700,color}}>{lang==="tr"?status.tr:status.en}</div>}
                          </div>
                        );
                      })}
                    </div>
                    {abnormal.length>0&&(
                      <div style={{background:"#FFF8F0",border:`1px solid ${C.gold}40`,borderRadius:10,padding:14}}>
                        <div style={{fontSize:11.5,fontWeight:700,color:T.ink,opacity:0.7,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.04em"}}>💡 {lang==="tr"?"Beslenme Önerileri":"Nutrition Recommendations"}</div>
                        {abnormal.map(test=>(
                          <div key={test.id} style={{display:"flex",gap:8,marginBottom:6,fontSize:12.5,color:T.ink,opacity:0.85,lineHeight:1.5}}>
                            <span style={{fontWeight:700,flexShrink:0}}>{lang==="tr"?test.nameTr:test.nameEn}:</span>
                            <span>{lang==="tr"?test.adviceTr:test.adviceEn}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={()=>delLabResult(rec.id)} className="np" style={{marginTop:10,display:"flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",color:T.ink,opacity:0.4,fontSize:12,fontFamily:"inherit"}}><Trash2 size={12}/> {lang==="tr"?"Bu Kaydı Sil":"Delete This Record"}</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Goals */}
      {(client.targetKcal||client.targetWater||client.nextAppt||client.targetWeight)&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}} className="g2">
          {client.targetWeight&&(()=>{
            const lastWeight=hist.length>0?Number(hist[0].weight):null;
            const diff=lastWeight?lastWeight-Number(client.targetWeight):null;
            const reached=diff!==null&&Math.abs(diff)<0.5;
            return(
              <div style={{background:T.paper,border:`1.5px solid ${reached?C.sage:T.line}`,borderRadius:12,padding:"16px 20px"}}>
                <div style={{fontSize:11,fontWeight:700,color:T.ink,opacity:0.5,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:6}}>🎯 {lang==="tr"?"Hedef Kilo":"Target Weight"}</div>
                <div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontSize:28,fontWeight:800,color:C.gold,fontFamily:"'Source Serif 4',Georgia,serif"}}>{client.targetWeight}</span><span style={{fontSize:12,color:T.ink,opacity:0.5}}>kg</span></div>
                {diff!==null&&<div style={{fontSize:12,color:reached?C.sage:T.ink,opacity:reached?1:0.6,fontWeight:600,marginTop:4}}>{reached?(lang==="tr"?"🎉 Hedefe ulaşıldı!":"🎉 Goal reached!"):diff>0?(lang==="tr"?`${diff.toFixed(1)} kg kaldı`:`${diff.toFixed(1)} kg to go`):(lang==="tr"?`${Math.abs(diff).toFixed(1)} kg hedefin altında`:`${Math.abs(diff).toFixed(1)} kg below target`)}</div>}
              </div>
            );
          })()}
          {client.targetKcal&&(
            <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,padding:"16px 20px"}}>
              <div style={{fontSize:11,fontWeight:700,color:T.ink,opacity:0.5,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:6}}>{lang==="tr"?"Hedef Kalori":"Target Calories"}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontSize:28,fontWeight:800,color:C.coral,fontFamily:"'Source Serif 4',Georgia,serif"}}>{client.targetKcal}</span><span style={{fontSize:12,color:T.ink,opacity:0.5}}>kcal/{lang==="tr"?"gün":"day"}</span></div>
            </div>
          )}
          {client.targetWater&&(
            <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,padding:"16px 20px"}}>
              <div style={{fontSize:11,fontWeight:700,color:T.ink,opacity:0.5,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:6}}>{lang==="tr"?"Hedef Su":"Target Water"}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontSize:28,fontWeight:800,color:"#3B82F6",fontFamily:"'Source Serif 4',Georgia,serif"}}>{client.targetWater}</span><span style={{fontSize:12,color:T.ink,opacity:0.5}}>L/{lang==="tr"?"gün":"day"}</span></div>
            </div>
          )}
          {client.nextAppt&&(()=>{
            const days=Math.ceil((new Date(client.nextAppt)-new Date())/(1000*60*60*24));
            const isPast=days<0;
            return(
              <div style={{background:T.paper,border:`1.5px solid ${isPast?C.coral:C.sage}`,borderRadius:12,padding:"16px 20px"}}>
                <div style={{fontSize:11,fontWeight:700,color:isPast?C.coral:C.sage,opacity:0.8,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:6}}>📅 {lang==="tr"?"Sonraki Randevu":"Next Appointment"}</div>
                <div style={{fontSize:15,fontWeight:700,color:T.ink}}>{new Date(client.nextAppt).toLocaleDateString(lang==="tr"?"tr-TR":"en-US",{day:"numeric",month:"long"})}</div>
                <div style={{fontSize:12,color:isPast?C.coral:C.sage,fontWeight:600,marginTop:4}}>{isPast?lang==="tr"?`${Math.abs(days)} gün geçti`:`${Math.abs(days)} days ago`:lang==="tr"?`${days} gün kaldı`:`${days} days left`}</div>
              </div>
            );
          })()}
        </div>
      )}

      {client.notes&&(
        <div style={{background:T.paperDim,borderRadius:12,padding:"14px 18px",marginBottom:20}}>
          <h4 style={{fontSize:11.5,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",opacity:0.5,margin:"0 0 8px",color:T.ink}}>{t.clients.notes}</h4>
          <p style={{margin:0,fontSize:14,lineHeight:1.6,color:T.ink}}>{client.notes}</p>
        </div>
      )}

      {/* Weight measurements */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h3 style={{fontSize:15,fontWeight:700,margin:0,color:T.ink}}>{t.clients.hist}</h3>
        <Btn ch={<><Plus size={14}/> {t.clients.newM}</>} vr="ghost" onClick={()=>setShowAdd(f=>!f)} st={{fontSize:13,padding:"8px 14px"}}/>
      </div>

      {showAdd&&(
        <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:14,padding:20,marginBottom:16}}>
          <form onSubmit={addM}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}} className="g3">
              <Fld label={lang==="tr"?"Kilo (kg)*":"Weight (kg)*"}><TIn type="number" required value={entry.weight} onChange={e=>setEntry(f=>({...f,weight:e.target.value}))} style={{background:T.paper,color:T.ink,borderColor:T.line}}/></Fld>
              <Fld label={lang==="tr"?"Bel (cm)":"Waist (cm)"}><TIn type="number" value={entry.waist} onChange={e=>setEntry(f=>({...f,waist:e.target.value}))} placeholder="—" style={{background:T.paper,color:T.ink,borderColor:T.line}}/></Fld>
              <Fld label={lang==="tr"?"Kalça (cm)":"Hip (cm)"}><TIn type="number" value={entry.hip} onChange={e=>setEntry(f=>({...f,hip:e.target.value}))} placeholder="—" style={{background:T.paper,color:T.ink,borderColor:T.line}}/></Fld>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}} className="g3">
              <Fld label={lang==="tr"?"Göğüs (cm)":"Chest (cm)"}><TIn type="number" value={entry.chest} onChange={e=>setEntry(f=>({...f,chest:e.target.value}))} placeholder="—" style={{background:T.paper,color:T.ink,borderColor:T.line}}/></Fld>
              <Fld label={lang==="tr"?"Kol (cm)":"Arm (cm)"}><TIn type="number" value={entry.arm} onChange={e=>setEntry(f=>({...f,arm:e.target.value}))} placeholder="—" style={{background:T.paper,color:T.ink,borderColor:T.line}}/></Fld>
              <Fld label={lang==="tr"?"Not":"Note"}><TIn value={entry.note} onChange={e=>setEntry(f=>({...f,note:e.target.value}))} style={{background:T.paper,color:T.ink,borderColor:T.line}}/></Fld>
            </div>
            <Btn tp="submit" ch={t.clients.save} vr="primary"/>
          </form>
        </div>
      )}

      {hist.length>1&&<WC entries={hist} t={t} T={T} lang={lang} targetWeight={client.targetWeight}/>}

      <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:14,overflow:"hidden",marginBottom:28}}>
        {hist.length===0&&<p style={{padding:24,fontSize:14,color:T.ink,opacity:0.5,margin:0}}>{t.track.empty}</p>}
        {hist.map((h,i)=>(
          <div key={h.key} style={{padding:"12px 20px",borderTop:i>0?`1px solid ${T.line}`:"none"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:h.waist||h.hip?6:0}}>
              <span style={{fontSize:13.5,fontWeight:600,color:T.ink}}>{h.date}</span>
              <div style={{display:"flex",gap:14,alignItems:"center"}}>
                <span style={{fontSize:14,fontWeight:800,color:C.coral}}>{h.weight} kg</span>
                {h.note&&<span style={{fontSize:12,color:T.ink,opacity:0.5}}>{h.note}</span>}
              </div>
            </div>
            {(h.waist||h.hip||h.chest||h.arm)&&(
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {h.waist&&<span style={{fontSize:11.5,color:T.ink,opacity:0.6,background:T.paperDim,padding:"2px 8px",borderRadius:10}}>Bel {h.waist}cm</span>}
                {h.hip&&<span style={{fontSize:11.5,color:T.ink,opacity:0.6,background:T.paperDim,padding:"2px 8px",borderRadius:10}}>Kalça {h.hip}cm</span>}
                {h.chest&&<span style={{fontSize:11.5,color:T.ink,opacity:0.6,background:T.paperDim,padding:"2px 8px",borderRadius:10}}>Göğüs {h.chest}cm</span>}
                {h.arm&&<span style={{fontSize:11.5,color:T.ink,opacity:0.6,background:T.paperDim,padding:"2px 8px",borderRadius:10}}>Kol {h.arm}cm</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Eating Habit Analysis — inspired by BEBİS's pattern detection */}
      {nHist.length>=2&&(()=>{
        const recentRecs=nHist.slice(0,7); // last up to 7 entries
        const avg=(idx)=>{
          const vals=recentRecs.map(r=>r.vals[idx]).filter(v=>v!=null&&!isNaN(v));
          if(vals.length===0)return null;
          return vals.reduce((s,v)=>s+v,0)/vals.length;
        };
        const flags=[];
        const fiberAvg=avg(4);
        if(fiberAvg!==null&&fiberAvg<20)flags.push({icon:"🌾",tr:`Ortalama lif alımı düşük (${fiberAvg.toFixed(1)}g/gün, önerilen 25-30g)`,en:`Average fiber intake is low (${fiberAvg.toFixed(1)}g/day, recommended 25-30g)`,severity:"warn"});
        const sodiumAvg=avg(12);
        if(sodiumAvg!==null&&sodiumAvg>2300)flags.push({icon:"🧂",tr:`Ortalama sodyum alımı yüksek (${Math.round(sodiumAvg)}mg/gün, önerilen <2300mg)`,en:`Average sodium intake is high (${Math.round(sodiumAvg)}mg/day, recommended <2300mg)`,severity:"warn"});
        const sugarAvg=avg(6);
        if(sugarAvg!==null&&sugarAvg>50)flags.push({icon:"🍬",tr:`Ortalama şeker alımı yüksek (${Math.round(sugarAvg)}g/gün)`,en:`Average sugar intake is high (${Math.round(sugarAvg)}g/day)`,severity:"warn"});
        const proteinAvg=avg(1);
        if(proteinAvg!==null&&proteinAvg<40)flags.push({icon:"🥩",tr:`Ortalama protein alımı düşük olabilir (${Math.round(proteinAvg)}g/gün)`,en:`Average protein intake may be low (${Math.round(proteinAvg)}g/day)`,severity:"info"});
        const vitCAvg=avg(20);
        if(vitCAvg!==null&&vitCAvg<75)flags.push({icon:"🍊",tr:`Vitamin C alımı yetersiz olabilir (${Math.round(vitCAvg)}mg/gün)`,en:`Vitamin C intake may be insufficient (${Math.round(vitCAvg)}mg/day)`,severity:"info"});
        const calciumAvg=avg(14);
        if(calciumAvg!==null&&calciumAvg<800)flags.push({icon:"🦴",tr:`Kalsiyum alımı düşük olabilir (${Math.round(calciumAvg)}mg/gün)`,en:`Calcium intake may be low (${Math.round(calciumAvg)}mg/day)`,severity:"info"});
        const ironAvg=avg(15);
        if(ironAvg!==null&&ironAvg<10)flags.push({icon:"🩸",tr:`Demir alımı düşük olabilir (${ironAvg.toFixed(1)}mg/gün)`,en:`Iron intake may be low (${ironAvg.toFixed(1)}mg/day)`,severity:"info"});

        if(flags.length===0)return(
          <div style={{background:"#E8F5E9",border:`1px solid ${C.sage}`,borderRadius:12,padding:16,marginBottom:20,display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:22}}>✅</span>
            <span style={{fontSize:13.5,color:C.sage,fontWeight:600}}>{lang==="tr"?"Son kayıtlarda belirgin bir beslenme dengesizliği tespit edilmedi.":"No significant nutritional imbalance detected in recent records."}</span>
          </div>
        );
        return(
          <div style={{marginBottom:20}}>
            <h4 style={{fontSize:13,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>🔍 {lang==="tr"?"Beslenme Alışkanlığı Analizi":"Eating Habit Analysis"} <span style={{fontSize:10.5,fontWeight:500,opacity:0.6}}>({lang==="tr"?"son kayıtlara göre":"based on recent records"})</span></h4>
            {flags.map((f,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 14px",background:f.severity==="warn"?C.coralSoft:T.paperDim,borderRadius:10,marginBottom:6}}>
                <span style={{fontSize:16,flexShrink:0}}>{f.icon}</span>
                <span style={{fontSize:13,color:f.severity==="warn"?C.coral:T.ink,fontWeight:f.severity==="warn"?600:500,lineHeight:1.5}}>{lang==="tr"?f.tr:f.en}</span>
              </div>
            ))}
            <p style={{fontSize:10.5,color:T.ink,opacity:0.4,marginTop:8,lineHeight:1.5}}>{lang==="tr"?"Bu analiz otomatik ve genel referans değerlerine dayanır; klinik değerlendirmenin yerini tutmaz.":"This analysis is automatic and based on general reference values; it does not replace clinical assessment."}</p>
          </div>
        );
      })()}

      {/* 26-value nutrition */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div>
          <h3 style={{fontSize:15,fontWeight:700,margin:"0 0 4px",color:T.ink}}>{t.clients.nutriHist}</h3>
          <span style={{fontSize:12,color:T.ink,opacity:0.5}}>{lang==="tr"?"26 parametreli günlük besin takibi":"Daily nutrition tracking — 26 parameters"}</span>
        </div>
        <Btn ch={<><Plus size={14}/> {t.clients.newN}</>} vr="ghost" onClick={()=>setShowN(f=>!f)} st={{fontSize:13,padding:"8px 14px"}}/>
      </div>

      {showN&&(
        <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:14,padding:20,marginBottom:16}}>
          <h4 style={{fontSize:13,fontWeight:700,margin:"0 0 16px",color:T.ink}}>{lang==="tr"?"Günlük Besin Değerleri":"Enter Daily Nutritional Values"}</h4>
          <form onSubmit={addN}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}} className="g3">
              {NUTRIENTS.map((n,i)=>(
                <div key={i}>
                  <label style={{display:"block",fontSize:11,fontWeight:600,color:T.ink,opacity:0.55,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.04em"}}>{lang==="tr"?n.tr:n.en} ({n.unit})</label>
                  <TIn type="number" value={nEntry[i]} onChange={e=>{const a=[...nEntry];a[i]=e.target.value;setNEntry(a);}} placeholder="—" style={{padding:"8px 10px",fontSize:13,background:T.paper,color:T.ink,borderColor:T.line}}/>
                </div>
              ))}
            </div>
            <div style={{marginTop:16,display:"flex",gap:10}}>
              <Btn tp="submit" ch={t.clients.save} vr="primary"/>
              <Btn tp="button" ch={t.clients.cancel} vr="ghost" onClick={()=>setShowN(false)}/>
            </div>
          </form>
        </div>
      )}

      {nHist.length===0&&!showN&&<div style={{border:`1.5px dashed ${T.line}`,borderRadius:14,padding:28,textAlign:"center",color:T.ink,opacity:0.4,fontSize:14,marginBottom:28}}>{lang==="tr"?"Henüz besin kaydı yok.":"No nutrition records yet."}</div>}
      {nHist.length>0&&(
        <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:14,overflow:"hidden",marginBottom:28}}>
          {nHist.map((rec,ri)=>(
            <div key={rec.key} style={{borderTop:ri>0?`1px solid ${T.line}`:"none"}}>
              <div onClick={()=>setExp(exp===ri?null:ri)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",cursor:"pointer"}}>
                <span style={{fontSize:14,fontWeight:600,color:T.ink}}>{rec.date}</span>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  {rec.vals[0]!=null&&<span style={{fontSize:13,fontWeight:700,color:C.coral}}>{rec.vals[0]} kcal</span>}
                  {rec.vals[1]!=null&&<span style={{fontSize:13,color:T.ink,opacity:0.6}}>P:{rec.vals[1]}g</span>}
                  {rec.vals[3]!=null&&<span style={{fontSize:13,color:T.ink,opacity:0.6}}>K:{rec.vals[3]}g</span>}
                  {exp===ri?<ChevronUp size={16} style={{opacity:0.4,color:T.ink}}/>:<ChevronDown size={16} style={{opacity:0.4,color:T.ink}}/>}
                </div>
              </div>
              {exp===ri&&(
                <div style={{padding:"0 20px 20px"}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}} className="g3">
                    {NUTRIENTS.map((n,i)=>rec.vals[i]!=null?(
                      <div key={i} style={{background:T.paperDim,borderRadius:8,padding:"8px 12px"}}>
                        <div style={{fontSize:10.5,fontWeight:600,color:T.ink,opacity:0.5,marginBottom:2}}>{lang==="tr"?n.tr:n.en}</div>
                        <span style={{fontSize:14,fontWeight:700,color:T.ink}}>{rec.vals[i]}</span>
                        <span style={{fontSize:11,color:T.ink,opacity:0.4,marginLeft:2}}>{n.unit}</span>
                      </div>
                    ):null)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Exchange Plan (if assigned) */}
      {exchPlan&&(
        <div style={{marginBottom:28}}>
          <h3 style={{fontSize:15,fontWeight:700,margin:"0 0 12px",color:T.ink}}>⚖️ {lang==="tr"?"Değişim Listesi Planı":"Exchange List Plan"}</h3>
          <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,padding:18}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:14}}>
              {EXCHANGE_GROUPS.filter(g=>exchPlan.counts[g.id]>0).map(g=>(
                <span key={g.id} style={{fontSize:12.5,fontWeight:600,background:T.paperDim,color:T.ink,padding:"5px 12px",borderRadius:20}}>{g.icon} {lang==="tr"?g.nameTr:g.nameEn}: {exchPlan.counts[g.id]}</span>
              ))}
            </div>
            <div style={{display:"flex",gap:24,paddingTop:14,borderTop:`1px solid ${T.line}`}}>
              <div><div style={{fontSize:10.5,color:T.ink,opacity:0.5,marginBottom:2}}>{lang==="tr"?"Toplam":"Total"}</div><div style={{fontSize:20,fontWeight:800,color:C.coral,fontFamily:"'Source Serif 4',Georgia,serif"}}>{exchPlan.totals.kcal} kcal</div></div>
              <div><div style={{fontSize:10.5,color:T.ink,opacity:0.5,marginBottom:2}}>Protein</div><div style={{fontSize:16,fontWeight:700,color:T.ink}}>{exchPlan.totals.protein}g</div></div>
              <div><div style={{fontSize:10.5,color:T.ink,opacity:0.5,marginBottom:2}}>{lang==="tr"?"Karb":"Carbs"}</div><div style={{fontSize:16,fontWeight:700,color:T.ink}}>{exchPlan.totals.carb}g</div></div>
              <div><div style={{fontSize:10.5,color:T.ink,opacity:0.5,marginBottom:2}}>{lang==="tr"?"Yağ":"Fat"}</div><div style={{fontSize:16,fontWeight:700,color:T.ink}}>{exchPlan.totals.fat}g</div></div>
            </div>
          </div>
        </div>
      )}

      {/* Diet Plan Builder */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"28px 0 14px"}} className="np">
        <div><h3 style={{fontSize:15,fontWeight:700,margin:"0 0 4px",color:T.ink}}>📋 {lang==="tr"?"Diyet Planı":"Diet Plan"}</h3><span style={{fontSize:12,color:T.ink,opacity:0.5}}>{lang==="tr"?"Danışana özel yazılı diyet planı oluştur":"Create a custom written diet plan for this client"}</span></div>
        <div style={{display:"flex",gap:8}}>
          {dietPlan&&<button onClick={()=>{setShowShoppingList(f=>!f);setCheckedItems({});}} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:`1px solid ${T.line}`,background:showShoppingList?T.paperDim:"transparent",color:T.ink,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🛒 {lang==="tr"?"Alışveriş Listesi":"Shopping List"}</button>}
          {dietPlan&&<button onClick={()=>window.print()} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:`1px solid ${T.line}`,background:"transparent",color:T.ink,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}><Printer size={14}/> {lang==="tr"?"Yazdır":"Print"}</button>}
          {!dietPlan&&<button onClick={()=>setShowDpForm(f=>!f)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:"none",background:C.coral,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}><Plus size={14}/> {lang==="tr"?"Plan Oluştur":"Create Plan"}</button>}
        </div>
      </div>

      {showShoppingList&&dietPlan&&(()=>{
        const grouped=generateShoppingList();
        const sections=Object.keys(grouped);
        const allItems=sections.flatMap(s=>grouped[s]);
        const checkedCount=allItems.filter(item=>checkedItems[item.label.toLowerCase()]).length;
        return(
          <div className="np" style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,padding:20,marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h4 style={{fontSize:14,fontWeight:700,color:T.ink,margin:0}}>🛒 {lang==="tr"?"Otomatik Alışveriş Listesi":"Auto-Generated Shopping List"}</h4>
              <span style={{fontSize:12,color:T.ink,opacity:0.5}}>{checkedCount}/{allItems.length}</span>
            </div>
            {allItems.length===0&&<p style={{fontSize:13,color:T.ink,opacity:0.5,margin:0}}>{lang==="tr"?"Plan öğünlerinden malzeme çıkarılamadı.":"Could not extract ingredients from plan meals."}</p>}
            {sections.map(section=>(
              <div key={section} style={{marginBottom:16}}>
                <div style={{fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:8,paddingBottom:6,borderBottom:`1px solid ${T.line}`}}>{section} <span style={{fontWeight:500,opacity:0.6}}>({grouped[section].length})</span></div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6}} className="g2">
                  {grouped[section].map((item,i)=>{
                    const key=item.label.toLowerCase();
                    const checked=!!checkedItems[key];
                    return(
                      <label key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:checked?T.paperDim:"transparent",borderRadius:6,cursor:"pointer"}}>
                        <input type="checkbox" checked={checked} onChange={()=>toggleChecked(key)} style={{width:15,height:15,cursor:"pointer"}}/>
                        <span style={{fontSize:13,color:T.ink,textDecoration:checked?"line-through":"none",opacity:checked?0.5:1}}>{item.label}</span>
                        {item.count>1&&<span style={{fontSize:10.5,color:T.ink,opacity:0.4,marginLeft:"auto"}}>×{item.count}</span>}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            <button onClick={()=>window.print()} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:`1px solid ${T.line}`,background:"transparent",color:T.ink,fontSize:12.5,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}><Printer size={13}/> {lang==="tr"?"Listeyi Yazdır":"Print List"}</button>
          </div>
        );
      })()}

      {showDpForm&&!dietPlan&&(
        <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,padding:18,marginBottom:16}} className="np">
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:14}} className="g2">
            <div><label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.55,marginBottom:5,textTransform:"uppercase"}}>{lang==="tr"?"Plan Başlığı":"Plan Title"}</label><input value={dpTitle} onChange={e=>setDpTitle(e.target.value)} placeholder={lang==="tr"?"örn. Kilo Verme Programı — 1. Ay":"e.g. Weight Loss Program — Month 1"} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
            <div><label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.55,marginBottom:5,textTransform:"uppercase"}}>{lang==="tr"?"Kaç Gün?":"How many days?"}</label><input type="number" min="1" max="30" value={dpDays} onChange={e=>setDpDays(Math.max(1,Math.min(30,+e.target.value||1)))} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={createDietPlan} style={{padding:"9px 18px",borderRadius:8,background:C.ink,color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>{lang==="tr"?"Oluştur":"Create"}</button>
            <button onClick={()=>setShowDpForm(false)} style={{padding:"9px 18px",borderRadius:8,background:"transparent",color:T.ink,border:`1px solid ${T.line}`,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>{lang==="tr"?"Vazgeç":"Cancel"}</button>
          </div>
        </div>
      )}

      {!dietPlan&&!showDpForm&&<div className="np" style={{border:`1.5px dashed ${T.line}`,borderRadius:12,padding:28,textAlign:"center",color:T.ink,opacity:0.4,fontSize:14,marginBottom:28}}>{lang==="tr"?"Henüz diyet planı oluşturulmadı.":"No diet plan created yet."}</div>}

      {dietPlan&&(
        <div style={{marginBottom:28}}>
          <style>{`@media print{.np{display:none!important;}.dp-print-title{display:block!important;}}`}</style>
          <h2 className="dp-print-title" style={{display:"none",fontFamily:"'Source Serif 4',Georgia,serif",fontSize:20,fontWeight:700,color:"#0E2A3D",margin:"0 0 16px"}}>{dietPlan.title}</h2>

          <div className="np" style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
            <input value={dpTitle} onChange={e=>setDpTitle(e.target.value)} onBlur={saveDpTitle} style={{flex:1,padding:"10px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontWeight:700,fontFamily:"'Source Serif 4',Georgia,serif",boxSizing:"border-box",outline:"none"}}/>
            <button onClick={deleteDietPlan} style={{padding:"9px 12px",borderRadius:8,border:`1px solid ${C.coral}`,background:"transparent",color:C.coral,cursor:"pointer"}}><Trash2 size={14}/></button>
          </div>

          <div style={{overflowX:"auto"}} className="dp-table-wrap">
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
              <thead>
                <tr>
                  <th style={{width:80,padding:"8px 10px",fontSize:11,fontWeight:700,textAlign:"left",color:T.ink,opacity:0.5,textTransform:"uppercase",background:T.paperDim,border:`1px solid ${T.line}`}}>{lang==="tr"?"Gün":"Day"}</th>
                  {["b","l","d","s"].map(sk=>{
                    const labels={b:lang==="tr"?"🌅 Kahvaltı":"🌅 Breakfast",l:lang==="tr"?"☀️ Öğle":"☀️ Lunch",d:lang==="tr"?"🌙 Akşam":"🌙 Dinner",s:lang==="tr"?"🍎 Ara Öğün":"🍎 Snack"};
                    return<th key={sk} style={{padding:"8px 10px",fontSize:11,fontWeight:700,color:T.ink,opacity:0.7,background:T.paperDim,border:`1px solid ${T.line}`,textAlign:"left"}}>{labels[sk]}</th>;
                  })}
                  <th className="np" style={{width:36,background:T.paperDim,border:`1px solid ${T.line}`}}></th>
                </tr>
              </thead>
              <tbody>
                {dietPlan.days.map((d,di)=>(
                  <tr key={di}>
                    <td style={{padding:"10px",fontSize:13,fontWeight:700,color:T.ink,background:T.paperDim,border:`1px solid ${T.line}`}}>{lang==="tr"?`Gün ${d.day}`:`Day ${d.day}`}</td>
                    {["b","l","d","s"].map(sk=>(
                      <td key={sk} onClick={()=>{setDpEdit({d:di,s:sk});setDpEditTxt(d.meals[sk]);}} style={{padding:0,border:`1px solid ${T.line}`,verticalAlign:"top",cursor:"pointer",minWidth:130,background:T.paper}}>
                        {dpEdit?.d===di&&dpEdit?.s===sk?(
                          <div onClick={e=>e.stopPropagation()} style={{padding:6}}>
                            <textarea value={dpEditTxt} onChange={e=>setDpEditTxt(e.target.value)} autoFocus rows={3} style={{width:"100%",fontSize:12.5,border:`1.5px solid ${C.coral}`,borderRadius:6,padding:6,resize:"none",fontFamily:"inherit",outline:"none",background:T.paper,color:T.ink,boxSizing:"border-box"}}/>
                            <div style={{display:"flex",gap:4,marginTop:4}}>
                              <button onClick={saveDpCell} style={{flex:1,background:C.coral,color:"#fff",border:"none",borderRadius:5,padding:"5px",fontSize:11,fontWeight:700,cursor:"pointer"}}><Check size={12}/></button>
                              <button onClick={()=>setDpEdit(null)} style={{flex:1,background:T.line,color:T.ink,border:"none",borderRadius:5,padding:"5px",fontSize:11,cursor:"pointer"}}><X size={12}/></button>
                            </div>
                          </div>
                        ):(
                          <div style={{padding:"10px 12px",fontSize:12.5,lineHeight:1.5,color:T.ink,opacity:d.meals[sk]?1:0.2,minHeight:60}}>{d.meals[sk]||"+"}</div>
                        )}
                      </td>
                    ))}
                    <td className="np" style={{border:`1px solid ${T.line}`,textAlign:"center",background:T.paper}}>
                      {dietPlan.days.length>1&&<button onClick={()=>removeDietDay(di)} style={{background:"none",border:"none",cursor:"pointer",color:T.ink,opacity:0.3}}><X size={13}/></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={addDietDay} className="np" style={{marginTop:10,display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:`1px dashed ${T.line}`,background:"transparent",color:T.ink,opacity:0.6,fontSize:12.5,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}><Plus size={13}/> {lang==="tr"?"Gün Ekle":"Add Day"}</button>

          <div style={{marginTop:16}}>
            <label className="np" style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase"}}>{lang==="tr"?"Genel Notlar / Öneriler":"General Notes / Recommendations"}</label>
            <textarea value={dpNotes} onChange={e=>setDpNotes(e.target.value)} onBlur={saveDpNotes} rows={3} placeholder={lang==="tr"?"örn. Günde en az 2.5L su için, tuzu azaltın...":"e.g. Drink at least 2.5L water daily, reduce salt..."} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:13.5,fontFamily:"inherit",boxSizing:"border-box",outline:"none",resize:"vertical",lineHeight:1.6}}/>
          </div>
        </div>
      )}

      {/* Progress Photos */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"28px 0 14px"}} className="np">
        <div><h3 style={{fontSize:15,fontWeight:700,margin:"0 0 4px",color:T.ink}}>📸 {lang==="tr"?"İlerleme Fotoğrafları":"Progress Photos"}</h3><span style={{fontSize:12,color:T.ink,opacity:0.5}}>{lang==="tr"?"Görsel değişim takibi":"Visual change tracking"}</span></div>
        <label style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:`1px solid ${T.line}`,background:"transparent",color:T.ink,fontSize:13,fontWeight:600,cursor:photoUploading?"not-allowed":"pointer",fontFamily:"inherit",opacity:photoUploading?0.5:1}}>
          {photoUploading?(lang==="tr"?"Yükleniyor...":"Uploading..."):<><Plus size={14}/> {lang==="tr"?"Fotoğraf Ekle":"Add Photo"}</>}
          <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={photoUploading} style={{display:"none"}}/>
        </label>
      </div>

      {progressPhotos.length===0&&<div className="np" style={{border:`1.5px dashed ${T.line}`,borderRadius:12,padding:28,textAlign:"center",color:T.ink,opacity:0.4,fontSize:14,marginBottom:28}}>{lang==="tr"?"Henüz fotoğraf eklenmedi.":"No photos added yet."}</div>}

      {progressPhotos.length>0&&(
        <div style={{marginBottom:28}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}} className="g3">
            {progressPhotos.map(p=>(
              <div key={p.id} style={{position:"relative",borderRadius:10,overflow:"hidden",cursor:"pointer",aspectRatio:"1"}} onClick={()=>setViewingPhoto(p)}>
                <img src={p.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.7))",padding:"16px 8px 6px",fontSize:10.5,color:"#fff",fontWeight:600}}>{p.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewingPhoto&&(
        <div className="np" onClick={()=>setViewingPhoto(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div onClick={e=>e.stopPropagation()} style={{maxWidth:500,width:"100%"}}>
            <img src={viewingPhoto.url} alt="" style={{width:"100%",borderRadius:12,display:"block"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:14}}>
              <span style={{color:"#fff",fontSize:14,fontWeight:600}}>{viewingPhoto.date}</span>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>delPhoto(viewingPhoto.id)} style={{padding:"8px 14px",borderRadius:8,background:C.coral,color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>{lang==="tr"?"Sil":"Delete"}</button>
                <button onClick={()=>setViewingPhoto(null)} style={{padding:"8px 14px",borderRadius:8,background:"rgba(255,255,255,0.15)",color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>{lang==="tr"?"Kapat":"Close"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session & Payment Tracking */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"28px 0 14px"}} className="np">
        <div><h3 style={{fontSize:15,fontWeight:700,margin:"0 0 4px",color:T.ink}}>💰 {lang==="tr"?"Seans & Ödeme Takibi":"Session & Payment Tracking"}</h3><span style={{fontSize:12,color:T.ink,opacity:0.5}}>{lang==="tr"?"Görüşme ve ödeme geçmişi":"Consultation and payment history"}</span></div>
        <button onClick={()=>setShowSessionForm(f=>!f)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:`1px solid ${T.line}`,background:"transparent",color:T.ink,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}><Plus size={14}/> {lang==="tr"?"Seans Ekle":"Add Session"}</button>
      </div>

      {sessions.length>0&&(()=>{
        const totalEarned=sessions.filter(s=>s.paid).reduce((sum,s)=>sum+s.fee,0);
        const totalPending=sessions.filter(s=>!s.paid).reduce((sum,s)=>sum+s.fee,0);
        return(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}} className="g2">
            <div style={{background:T.paper,border:`1px solid ${C.sage}`,borderRadius:12,padding:"14px 18px"}}>
              <div style={{fontSize:11,fontWeight:700,color:C.sage,opacity:0.8,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>{lang==="tr"?"Toplam Alınan":"Total Received"}</div>
              <div style={{fontSize:22,fontWeight:800,color:C.sage,fontFamily:"'Source Serif 4',Georgia,serif"}}>₺{totalEarned.toLocaleString()}</div>
            </div>
            {totalPending>0&&<div style={{background:T.paper,border:`1px solid ${C.coral}`,borderRadius:12,padding:"14px 18px"}}>
              <div style={{fontSize:11,fontWeight:700,color:C.coral,opacity:0.8,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>{lang==="tr"?"Bekleyen Ödeme":"Pending Payment"}</div>
              <div style={{fontSize:22,fontWeight:800,color:C.coral,fontFamily:"'Source Serif 4',Georgia,serif"}}>₺{totalPending.toLocaleString()}</div>
            </div>}
          </div>
        );
      })()}

      {showSessionForm&&(
        <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,padding:18,marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}} className="g2">
            <div><label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.55,marginBottom:5,textTransform:"uppercase"}}>{lang==="tr"?"Tarih":"Date"}</label><input type="date" value={newSession.date} onChange={e=>setNewSession(s=>({...s,date:e.target.value}))} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
            <div><label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.55,marginBottom:5,textTransform:"uppercase"}}>{lang==="tr"?"Ücret (₺)":"Fee (₺)"}</label><input type="number" value={newSession.fee} onChange={e=>setNewSession(s=>({...s,fee:e.target.value}))} placeholder="500" style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
              <input type="checkbox" checked={newSession.paid} onChange={e=>setNewSession(s=>({...s,paid:e.target.checked}))} style={{width:16,height:16,cursor:"pointer"}}/>
              <span style={{fontSize:13.5,color:T.ink,fontWeight:600}}>{lang==="tr"?"Ödeme alındı":"Payment received"}</span>
            </label>
          </div>
          <div style={{marginBottom:14}}><label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.55,marginBottom:5,textTransform:"uppercase"}}>{lang==="tr"?"Not (isteğe bağlı)":"Note (optional)"}</label><input value={newSession.notes} onChange={e=>setNewSession(s=>({...s,notes:e.target.value}))} placeholder={lang==="tr"?"örn. İlk görüşme":"e.g. First consultation"} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={addSession} style={{padding:"9px 18px",borderRadius:8,background:C.ink,color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>{lang==="tr"?"Kaydet":"Save"}</button>
            <button onClick={()=>setShowSessionForm(false)} style={{padding:"9px 18px",borderRadius:8,background:"transparent",color:T.ink,border:`1px solid ${T.line}`,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>{lang==="tr"?"Vazgeç":"Cancel"}</button>
          </div>
        </div>
      )}

      {sessions.length===0&&!showSessionForm&&<div className="np" style={{border:`1.5px dashed ${T.line}`,borderRadius:12,padding:24,textAlign:"center",color:T.ink,opacity:0.4,fontSize:14,marginBottom:28}}>{lang==="tr"?"Henüz seans kaydı yok.":"No sessions recorded yet."}</div>}

      {sessions.length>0&&(
        <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,overflow:"hidden",marginBottom:28}}>
          {sessions.map((s,i)=>(
            <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderTop:i>0?`1px solid ${T.paperDim}`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <button onClick={()=>toggleSessionPaid(s.id)} style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${s.paid?C.sage:C.coral}`,background:s.paid?C.sage:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {s.paid&&<Check size={12} color="#fff"/>}
                </button>
                <div>
                  <div style={{fontSize:13.5,fontWeight:600,color:T.ink}}>{s.date} {s.notes&&`· ${s.notes}`}</div>
                  <div style={{fontSize:11.5,color:s.paid?C.sage:C.coral,fontWeight:600}}>{s.paid?(lang==="tr"?"Ödendi":"Paid"):(lang==="tr"?"Bekliyor":"Pending")}</div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:15,fontWeight:800,color:T.ink}}>₺{s.fee.toLocaleString()}</span>
                <button onClick={()=>delSession(s.id)} style={{background:"none",border:"none",cursor:"pointer",color:T.ink,opacity:0.3}}><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Supplement Tracking */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"28px 0 14px"}}>
        <div><h3 style={{fontSize:15,fontWeight:700,margin:"0 0 4px",color:T.ink}}>💊 {lang==="tr"?"Takviye Takibi":"Supplement Tracking"}</h3><span style={{fontSize:12,color:T.ink,opacity:0.5}}>{lang==="tr"?"Vitamin, mineral ve ilaç listesi":"Vitamins, minerals and medications"}</span></div>
        <button onClick={()=>setShowSupForm(f=>!f)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:`1px solid ${T.line}`,background:"transparent",color:T.ink,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}><Plus size={14}/> {lang==="tr"?"Takviye Ekle":"Add Supplement"}</button>
      </div>
      {showSupForm&&(
        <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,padding:18,marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:12}} className="g2">
            <div><label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.55,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.04em"}}>{lang==="tr"?"Takviye Adı *":"Supplement Name *"}</label><input value={newSup.name} onChange={e=>setNewSup(s=>({...s,name:e.target.value}))} placeholder={lang==="tr"?"örn. D Vitamini":"e.g. Vitamin D"} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
            <div><label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.55,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.04em"}}>{lang==="tr"?"Doz":"Dose"}</label><input value={newSup.dose} onChange={e=>setNewSup(s=>({...s,dose:e.target.value}))} placeholder="1000mg" style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}} className="g2">
            <div><label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.55,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.04em"}}>{lang==="tr"?"Sıklık":"Frequency"}</label><input value={newSup.freq} onChange={e=>setNewSup(s=>({...s,freq:e.target.value}))} placeholder={lang==="tr"?"Günde 1x":"Once daily"} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
            <div><label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.55,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.04em"}}>{lang==="tr"?"Alım Zamanı":"Timing"}</label><input value={newSup.timing} onChange={e=>setNewSup(s=>({...s,timing:e.target.value}))} placeholder={lang==="tr"?"Sabah aç karın":"Morning, fasting"} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/></div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={addSupp} style={{padding:"9px 18px",borderRadius:8,background:C.ink,color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>{lang==="tr"?"Kaydet":"Save"}</button>
            <button onClick={()=>{setShowSupForm(false);setNewSup({name:"",dose:"",freq:"",timing:""},);}} style={{padding:"9px 18px",borderRadius:8,background:"transparent",color:T.ink,border:`1px solid ${T.line}`,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>{lang==="tr"?"Vazgeç":"Cancel"}</button>
          </div>
        </div>
      )}
      {supps.length===0&&!showSupForm&&<div style={{border:`1.5px dashed ${T.line}`,borderRadius:12,padding:24,textAlign:"center",color:T.ink,opacity:0.4,fontSize:14,marginBottom:28}}>{lang==="tr"?"Henüz takviye eklenmedi.":"No supplements added yet."}</div>}
      {supps.length>0&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:28}} className="g2">
          {supps.map(s=>(
            <div key={s.id} style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:10,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:T.ink,marginBottom:4}}>💊 {s.name}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {s.dose&&<span style={{fontSize:11.5,background:T.paperDim,color:T.ink,opacity:0.7,padding:"2px 8px",borderRadius:10,fontWeight:600}}>{s.dose}</span>}
                  {s.freq&&<span style={{fontSize:11.5,background:T.paperDim,color:T.ink,opacity:0.7,padding:"2px 8px",borderRadius:10,fontWeight:600}}>{s.freq}</span>}
                  {s.timing&&<span style={{fontSize:11.5,background:C.coralSoft,color:C.coral,padding:"2px 8px",borderRadius:10,fontWeight:600}}>{s.timing}</span>}
                </div>
              </div>
              <button onClick={()=>delSupp(s.id)} style={{background:"none",border:"none",cursor:"pointer",color:T.ink,opacity:0.3,flexShrink:0}}><Trash2 size={13}/></button>
            </div>
          ))}
        </div>
      )}

      {/* Clinical Notes */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div>
          <h3 style={{fontSize:15,fontWeight:700,margin:"0 0 4px",color:T.ink}}>📝 {lang==="tr"?"Klinik Notlar":"Clinical Notes"}</h3>
          <span style={{fontSize:12,color:T.ink,opacity:0.5}}>{lang==="tr"?"Zaman damgalı klinik gözlemler":"Timestamped clinical observations"}</span>
        </div>
        <Btn ch={<><Plus size={14}/> {lang==="tr"?"Not Ekle":"Add Note"}</>} vr="ghost" onClick={()=>setShowNoteForm(f=>!f)} st={{fontSize:13,padding:"8px 14px"}}/>
      </div>

      {showNoteForm&&(
        <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:14,padding:20,marginBottom:16}}>
          <Fld label={lang==="tr"?"Klinik Not":"Clinical Note"}>
            <textarea value={noteText} onChange={e=>setNoteText(e.target.value)} rows={4} placeholder={lang==="tr"?"Klinik gözlem, öneri, ilaç notu...":"Clinical observation, recommendation, medication note..."} style={{width:"100%",padding:"12px 14px",fontSize:14,borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,outline:"none",fontFamily:"inherit",boxSizing:"border-box",resize:"vertical"}}/>
          </Fld>
          <div style={{display:"flex",gap:10}}>
            <Btn ch={<><Check size={14}/> {lang==="tr"?"Kaydet":"Save"}</>} vr="primary" onClick={addClinNote}/>
            <Btn ch={lang==="tr"?"Vazgeç":"Cancel"} vr="ghost" onClick={()=>{setShowNoteForm(false);setNoteText("");}}/>
          </div>
        </div>
      )}

      {clinNotes.length===0&&!showNoteForm&&(
        <div style={{border:`1.5px dashed ${T.line}`,borderRadius:14,padding:28,textAlign:"center",color:T.ink,opacity:0.4,fontSize:14}}>{lang==="tr"?"Henüz klinik not yok.":"No clinical notes yet."}</div>
      )}

      {clinNotes.length>0&&(
        <div style={{position:"relative"}}>
          <div style={{position:"absolute",left:19,top:8,bottom:8,width:2,background:T.line}}/>
          {clinNotes.map((note,i)=>(
            <div key={note.key} style={{display:"flex",gap:14,marginBottom:14,position:"relative"}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:C.sage,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,zIndex:1,fontSize:14}}>📝</div>
              <div style={{flex:1,background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:12,fontWeight:700,color:T.ink,opacity:0.55}}>{note.date} · {note.time}</span>
                  <button onClick={()=>delClinNote(note.key)} style={{background:"none",border:"none",cursor:"pointer",color:T.ink,opacity:0.3}}><Trash2 size={13}/></button>
                </div>
                <p style={{margin:0,fontSize:14,lineHeight:1.6,color:T.ink,whiteSpace:"pre-wrap"}}>{note.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
function TemplatesPage({t,lang,nav,setSel,T=C}){
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

function TemplateDetail({t,lang,id,nav,T=C}){
  const c=COND.find(x=>x.id===id);
  const[dietitianProfile,setDietitianProfile]=useState(null);
  const[clients,setClients]=useState([]);
  const[selClientKey,setSelClientKey]=useState("");
  const[showGenForm,setShowGenForm]=useState(false);
  const[genDays,setGenDays]=useState(30);
  const[genMsg,setGenMsg]=useState(null);
  const[generating,setGenerating]=useState(false);

  useEffect(()=>{(async()=>{
    const dp=await sg("dietitianProfile");if(dp)setDietitianProfile(dp);
    const ks=await sl("client:");const items=[];
    for(const k of ks){const v=await sg(k);if(v&&v.name)items.push({...v,key:k});}
    items.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    setClients(items);
  })();},[]);

  const generate30DayPlan=async()=>{
    if(!c||!selClientKey)return;
    setGenerating(true);
    const avoidTr=(c.avTr||[]).join(" ").toLowerCase();
    const avoidEn=(c.avEn||[]).join(" ").toLowerCase();
    const avoidKeywords=[...avoidTr.split(/[\s,()]+/),...avoidEn.split(/[\s,()]+/)].filter(w=>w.length>3);
    const isExcluded=food=>{
      const name=(food.tr+" "+food.en).toLowerCase();
      if(["fastfood","tatlı","içecek"].includes(food.cat))return true;
      return avoidKeywords.some(kw=>name.includes(kw));
    };
    const pool={
      protein:FOODS.filter(f=>["yumurta-süt"].includes(f.cat)&&!isExcluded(f)),
      meat:FOODS.filter(f=>["et","balık","baklagil"].includes(f.cat)&&!isExcluded(f)),
      grain:FOODS.filter(f=>f.cat==="tahıl"&&!isExcluded(f)),
      veg:FOODS.filter(f=>f.cat==="sebze"&&!isExcluded(f)),
      fruit:FOODS.filter(f=>f.cat==="meyve"&&!isExcluded(f)),
      nuts:FOODS.filter(f=>f.cat==="kuruyemiş"&&!isExcluded(f)),
    };
    const pick=(arr,idx)=>arr.length>0?arr[idx%arr.length]:null;
    const name=f=>f?(lang==="tr"?f.tr:f.en):"";

    const days=Array(genDays).fill(null).map((_,i)=>{
      const b=[pick(pool.protein,i),pick(pool.grain,i)].filter(Boolean).map(name).join(" + ");
      const l=[pick(pool.meat,i),pick(pool.grain,i+1),pick(pool.veg,i)].filter(Boolean).map(name).join(" + ");
      const d=[pick(pool.meat,i+1),pick(pool.veg,i+1),pick(pool.grain,i+2)].filter(Boolean).map(name).join(" + ");
      const s=[pick(pool.fruit,i),pick(pool.nuts,i)].filter(Boolean).map(name).join(" + ");
      return{day:i+1,meals:{b,l,d,s}};
    });

    const plan={title:`${lang==="tr"?c.nameTr||c.tr:c.nameEn||c.en} — ${genDays} ${lang==="tr"?"Günlük Plan":"Day Plan"}`,days,notes:lang==="tr"?"Bu plan otomatik oluşturulmuştur; danışana özel olarak gözden geçirilip onaylanmalıdır.":"This plan was auto-generated; must be reviewed and approved for the specific client.",createdAt:Date.now()};
    await ss(`${selClientKey}:dietPlan`,plan);
    setGenerating(false);
    setGenMsg({type:"success",text:lang==="tr"?`${genDays} günlük plan oluşturuldu ve danışana kaydedildi!`:`${genDays}-day plan generated and saved to client!`});
    setTimeout(()=>setGenMsg(null),4000);
    setShowGenForm(false);
  };

  if(!c)return null;
  const res=lang==="tr"?c.resTr:c.resEn;
  const rec=lang==="tr"?c.recTr:c.recEn;
  const av=lang==="tr"?c.avTr:c.avEn;
  const menu=lang==="tr"?c.mTr:c.mEn;
  return<section style={{maxWidth:820,margin:"0 auto",padding:"40px 24px 90px"}}>
    <style>{`
      @media print {
        body { background: white !important; font-family: 'Inter', sans-serif; }
        .np { display: none !important; }
        .nb-print-header { display: flex !important; }
        section { padding: 0 !important; max-width: 100% !important; }
        .nb-print-card { break-inside: avoid; border: 1px solid #ccc !important; margin-bottom: 12px !important; }
        @page { margin: 20mm; size: A4; }
      }
      .nb-print-header { display: none; border-bottom: 2px solid #0E2A3D; padding-bottom: 16px; margin-bottom: 24px; justify-content: space-between; align-items: center; }
    `}</style>
    {/* Print header — only visible when printing */}
    <div className="nb-print-header">
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="#0E2A3D" strokeWidth="1.5"/><path d="M13 26V14L27 26V14" stroke="#E8623F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <div>
          <span style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:800,fontSize:18,color:"#0E2A3D"}}>{dietitianProfile?.clinicName||"NutriBase"}</span>
          {!dietitianProfile?.clinicName&&<span style={{fontSize:11,fontWeight:700,background:"#C9A14A",color:"#3A2D0A",padding:"2px 8px",borderRadius:20,marginLeft:6}}>PRO</span>}
          {dietitianProfile?.dietitianName&&<div style={{fontSize:10.5,color:"#0E2A3D",opacity:0.6}}>{dietitianProfile.dietitianName}{dietitianProfile.tagline&&` · ${dietitianProfile.tagline}`}</div>}
        </div>
      </div>
      <div style={{textAlign:"right",fontSize:12,color:"#0E2A3D",opacity:0.6}}>
        <div style={{fontWeight:700}}>{lang==="tr"?"Klinik Diyet Şablonu":"Clinical Diet Template"}</div>
        <div>{new Date().toLocaleDateString(lang==="tr"?"tr-TR":"en-US",{day:"numeric",month:"long",year:"numeric"})}</div>
      </div>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}} className="np">
      <button onClick={()=>nav("templates")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:13,color:C.ink,opacity:0.55,padding:0,fontWeight:600}}>← {t.tpl.back}</button>
      <Btn ch={<><Printer size={14}/> {t.tpl.print}</>} vr="ghost" onClick={()=>window.print()} st={{fontSize:13,padding:"8px 14px"}}/>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}><span style={{fontSize:44}}>{c.icon}</span><div><h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:28,fontWeight:700,margin:"0 0 6px"}}>{lang==="tr"?c.tr:c.en}</h1><PBadge sm/></div></div>

    {/* 30-Day Auto Plan Generator */}
    <div className="np" style={{background:C.ink,borderRadius:14,padding:20,marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div>
          <h4 style={{fontSize:14,fontWeight:700,color:"#fff",margin:"0 0 4px",display:"flex",alignItems:"center",gap:6}}>🗓️ {lang==="tr"?"Otomatik Çok Günlü Plan Oluştur":"Auto-Generate Multi-Day Plan"}</h4>
          <p style={{fontSize:12,color:"#fff",opacity:0.65,margin:0}}>{lang==="tr"?"Bu duruma uygun besinlerden otomatik olarak çeşitlendirilmiş bir diyet planı oluşturup danışana kaydet.":"Automatically build a varied diet plan from condition-appropriate foods and save it to a client."}</p>
        </div>
        <button onClick={()=>setShowGenForm(f=>!f)} style={{padding:"10px 18px",borderRadius:9,border:"none",background:C.coral,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>{lang==="tr"?"Plan Oluştur":"Generate Plan"}</button>
      </div>

      {showGenForm&&(
        <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.15)"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:14}} className="g2">
            <div>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:"#fff",opacity:0.7,marginBottom:6,textTransform:"uppercase"}}>{lang==="tr"?"Danışan Seç":"Select Client"}</label>
              <select value={selClientKey} onChange={e=>setSelClientKey(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"none",background:"#fff",color:C.ink,fontSize:14,fontFamily:"inherit",cursor:"pointer"}}>
                <option value="">{lang==="tr"?"Danışan seç...":"Select client..."}</option>
                {clients.map(cl=><option key={cl.key} value={cl.key}>{cl.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:"#fff",opacity:0.7,marginBottom:6,textTransform:"uppercase"}}>{lang==="tr"?"Kaç Gün?":"How many days?"}</label>
              <input type="number" min="1" max="30" value={genDays} onChange={e=>setGenDays(Math.max(1,Math.min(30,+e.target.value||1)))} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"none",background:"#fff",color:C.ink,fontSize:14,fontFamily:"inherit",boxSizing:"border-box"}}/>
            </div>
          </div>
          {selClientKey&&(
            <p style={{fontSize:11.5,color:"#FFD9B8",marginBottom:12}}>⚠️ {lang==="tr"?"Bu danışanın mevcut bir diyet planı varsa üzerine yazılacaktır.":"If this client already has an existing diet plan, it will be overwritten."}</p>
          )}
          <button onClick={generate30DayPlan} disabled={!selClientKey||generating} style={{width:"100%",padding:"11px",borderRadius:8,border:"none",background:selClientKey?"#fff":"rgba(255,255,255,0.2)",color:selClientKey?C.ink:"#fff",fontSize:13.5,fontWeight:700,cursor:selClientKey&&!generating?"pointer":"not-allowed",fontFamily:"inherit",opacity:selClientKey?1:0.6}}>{generating?(lang==="tr"?"Oluşturuluyor...":"Generating..."):(lang==="tr"?`${genDays} Günlük Planı Oluştur ve Kaydet`:`Generate & Save ${genDays}-Day Plan`)}</button>
        </div>
      )}
      {genMsg&&(
        <div style={{marginTop:14,display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.1)",borderRadius:8,padding:"10px 14px"}}>
          <Check size={15} color="#fff"/>
          <span style={{fontSize:12.5,color:"#fff"}}>{genMsg.text}</span>
        </div>
      )}
    </div>

    <Card st={{marginBottom:20}}><h3 style={{fontSize:12,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",opacity:0.5,margin:"0 0 10px"}}>{t.tpl.overview}</h3><p style={{margin:0,fontSize:15,lineHeight:1.65}}>{lang==="tr"?c.ovTr:c.ovEn}</p></Card>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}} className="g2">
      <Card st={{}}><h3 style={{fontSize:12,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",opacity:0.5,margin:"0 0 12px",color:C.sage}}>{t.tpl.rec}</h3>{rec.map((r,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:9,fontSize:13.5}}><Check size={14} color={C.sage} style={{flexShrink:0,marginTop:2}}/> {r}</div>)}</Card>
      <Card st={{}}><h3 style={{fontSize:12,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",opacity:0.5,margin:"0 0 12px",color:C.coral}}>{t.tpl.avoid}</h3>{av.map((r,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:9,fontSize:13.5}}><X size={14} color={C.coral} style={{flexShrink:0,marginTop:2}}/> {r}</div>)}</Card>
    </div>
    <Card st={{marginBottom:20}}><h3 style={{fontSize:12,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",opacity:0.5,margin:"0 0 14px"}}>{t.tpl.res}</h3><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{res.map((r,i)=><span key={i} style={{fontSize:12.5,fontWeight:600,background:C.paperDim,padding:"6px 12px",borderRadius:20}}>{r}</span>)}</div></Card>
    <Card st={{marginBottom:20}}><h3 style={{fontSize:12,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",opacity:0.5,margin:"0 0 16px"}}>{t.tpl.menu}</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="g2">
        {[{label:t.tpl.b,val:menu.b},{label:t.tpl.l,val:menu.l},{label:t.tpl.d,val:menu.d},{label:t.tpl.s,val:menu.s}].map((m,i)=><div key={i} style={{background:C.paperDim,borderRadius:10,padding:14}}><div style={{fontSize:11,fontWeight:700,color:C.coral,marginBottom:5,letterSpacing:"0.04em",textTransform:"uppercase"}}>{m.label}</div><div style={{fontSize:13.5,lineHeight:1.5}}>{m.val}</div></div>)}
      </div>
    </Card>
    <div style={{display:"flex",gap:10,padding:16,background:"#FFF8F0",border:`1px solid ${C.gold}40`,borderRadius:10}}><AlertCircle size={16} color={C.gold} style={{flexShrink:0,marginTop:1}}/><p style={{margin:0,fontSize:13,lineHeight:1.6,color:C.ink,opacity:0.75}}>{t.tpl.note}</p></div>
  </section>;
}

function getWeekNum(d){const date=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));date.setUTCDate(date.getUTCDate()+4-(date.getUTCDay()||7));const ys=new Date(Date.UTC(date.getUTCFullYear(),0,1));return Math.ceil((((date-ys)/86400000)+1)/7);}

function WeeklyPlanPage({t,lang,nav,T=C}){
  const days=lang==="tr"?["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"]:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const slots=lang==="tr"?["🌅 Kahvaltı","☀️ Öğle","🌙 Akşam","🍎 Ara Öğün"]:["🌅 Breakfast","☀️ Lunch","🌙 Dinner","🍎 Snack"];
  const today=new Date();
  const weekNum=getWeekNum(today);
  const todayIdx=(today.getDay()+6)%7; // 0=Mon
  const [plan,setPlan]=useState(()=>Array(7).fill(null).map(()=>Array(4).fill("")));
  const [edit,setEdit]=useState(null);
  const [editTxt,setEditTxt]=useState("");
  const[dietitianProfile,setDietitianProfile]=useState(null);

  useEffect(()=>{(async()=>{const saved=await sg(`weekplan:${weekNum}`);if(saved)setPlan(saved);const dp=await sg("dietitianProfile");if(dp)setDietitianProfile(dp);})();},[weekNum]);

  const saveCell=async()=>{
    if(!edit)return;
    const np=plan.map((day,di)=>di===edit.d?day.map((s,si)=>si===edit.s?editTxt:s):day);
    setPlan(np);await ss(`weekplan:${weekNum}`,np);setEdit(null);
  };
  const clearPlan=async()=>{const e=Array(7).fill(null).map(()=>Array(4).fill(""));setPlan(e);await ss(`weekplan:${weekNum}`,e);};

  return(
    <section style={{maxWidth:1200,margin:"0 auto",padding:"48px 24px 80px"}}>
      <style>{`@media print{.np{display:none!important;}.nb-ph{display:flex!important;}@page{size:A4 landscape;margin:15mm;}}`}</style>
      <div className="nb-ph" style={{display:"none",justifyContent:"space-between",alignItems:"center",marginBottom:20,paddingBottom:16,borderBottom:`2px solid ${T.ink}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Logo sz={24} T={T}/>
          <div>
            <span style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:800,fontSize:18,color:T.ink}}>{dietitianProfile?.clinicName||"NutriBase"}</span>
            {dietitianProfile?.dietitianName&&<div style={{fontSize:10.5,color:T.ink,opacity:0.6}}>{dietitianProfile.dietitianName}</div>}
          </div>
        </div>
        <div style={{fontSize:12,color:T.ink,textAlign:"right"}}><div style={{fontWeight:700}}>{lang==="tr"?"Haftalık Öğün Planı":"Weekly Meal Plan"}</div><div>{lang==="tr"?`Hafta ${weekNum}`:`Week ${weekNum}`} · {today.getFullYear()}</div></div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28,flexWrap:"wrap",gap:12}} className="np">
        <div><h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:30,fontWeight:700,margin:"0 0 4px",color:T.ink,display:"flex",alignItems:"center",gap:10}}>{lang==="tr"?"Haftalık Öğün Planı":"Weekly Meal Plan"} <PBadge sm/></h1><p style={{fontSize:13,color:T.ink,opacity:0.5,margin:0}}>{lang==="tr"?`Hafta ${weekNum}`:`Week ${weekNum}`} · {today.getFullYear()}</p></div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={clearPlan} style={{padding:"9px 16px",borderRadius:8,border:`1px solid ${T.line}`,background:"transparent",fontSize:13,cursor:"pointer",color:T.ink,opacity:0.6,fontFamily:"inherit",fontWeight:600}}>{lang==="tr"?"Temizle":"Clear"}</button>
          <button onClick={()=>window.print()} style={{padding:"9px 16px",borderRadius:8,border:`1px solid ${T.line}`,background:"transparent",fontSize:13,cursor:"pointer",color:T.ink,fontFamily:"inherit",fontWeight:600,display:"flex",alignItems:"center",gap:6}}><Printer size={14}/> {lang==="tr"?"Yazdır":"Print"}</button>
        </div>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:800}}>
          <thead>
            <tr>
              <th style={{width:110,padding:"10px 14px",fontSize:12,fontWeight:700,textAlign:"left",color:T.ink,opacity:0.5,textTransform:"uppercase",letterSpacing:"0.05em",background:T.paperDim,borderRadius:"8px 0 0 0",border:`1px solid ${T.line}`}}>{lang==="tr"?"Öğün":"Meal"}</th>
              {days.map((day,i)=><th key={i} style={{padding:"12px 10px",fontSize:13,fontWeight:700,color:i===todayIdx?C.coral:T.ink,background:i===todayIdx?C.coralSoft:T.paperDim,border:`1px solid ${T.line}`,textAlign:"center",borderRadius:i===6?"0 8px 0 0":"0"}}>{day}{i===todayIdx&&<div style={{fontSize:10,fontWeight:700,color:C.coral,opacity:0.8}}>{lang==="tr"?"Bugün":"Today"}</div>}</th>)}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot,si)=>(<tr key={si}>
              <td style={{padding:"10px 14px",fontSize:12.5,fontWeight:700,color:T.ink,opacity:0.7,border:`1px solid ${T.line}`,background:T.paperDim,whiteSpace:"nowrap"}}>{slot}</td>
              {days.map((_,di)=>(
                <td key={di} onClick={()=>{if(edit?.d===di&&edit?.s===si)return;setEdit({d:di,s:si});setEditTxt(plan[di][si]);}} style={{padding:0,border:`1px solid ${T.line}`,verticalAlign:"top",cursor:"pointer",background:plan[di][si]?T.paperDim:T.paper,minWidth:110,minHeight:72,position:"relative"}}>
                  {edit?.d===di&&edit?.s===si ? (
                    <div onClick={e=>e.stopPropagation()} style={{padding:6}}>
                      <textarea value={editTxt} onChange={e=>setEditTxt(e.target.value)} autoFocus rows={3} placeholder={lang==="tr"?"Öğün yaz...":"Enter meal..."} style={{width:"100%",fontSize:12,border:`1.5px solid ${C.coral}`,borderRadius:6,padding:6,resize:"none",fontFamily:"inherit",outline:"none",background:T.paper,color:T.ink,boxSizing:"border-box"}}/>
                      <div style={{display:"flex",gap:4,marginTop:4}}>
                        <button onClick={saveCell} style={{flex:1,background:C.coral,color:"#fff",border:"none",borderRadius:5,padding:"5px",fontSize:11,fontWeight:700,cursor:"pointer"}}><Check size={12}/></button>
                        <button onClick={()=>{setEdit(null);}} style={{flex:1,background:T.line,color:T.ink,border:"none",borderRadius:5,padding:"5px",fontSize:11,cursor:"pointer"}}><X size={12}/></button>
                      </div>
                    </div>
                  ):(
                    <div style={{padding:"10px 12px",fontSize:12.5,lineHeight:1.5,color:plan[di][si]?T.ink:T.ink,opacity:plan[di][si]?1:0.2,minHeight:72}}>
                      {plan[di][si]||"+"}
                    </div>
                  )}
                </td>
              ))}
            </tr>))}
          </tbody>
        </table>
      </div>
      <p style={{fontSize:12,color:T.ink,opacity:0.4,marginTop:16}}>{lang==="tr"?"Her hücreye tıklayarak öğün içeriğini yazabilirsin. Haftalık plan otomatik kaydedilir.":"Click any cell to enter meal content. The weekly plan is saved automatically."}</p>
    </section>
  );
}

function ExchangeListPage({t,lang,nav,T=C}){
  const[counts,setCounts]=useState(()=>Object.fromEntries(EXCHANGE_GROUPS.map(g=>[g.id,0])));
  const[clients,setClients]=useState([]);
  const[selClientKey,setSelClientKey]=useState("");
  const[savedMsg,setSavedMsg]=useState(false);
  const[expandedGroup,setExpandedGroup]=useState(null);
  const[showCalc,setShowCalc]=useState(false);
  const[calcForm,setCalcForm]=useState({gender:"female",age:"30",height:"165",weight:"65",actIdx:1,formula:"mifflin",condition:""});
  const[calcResult,setCalcResult]=useState(null);

  useEffect(()=>{(async()=>{
    const ks=await sl("client:");const items=[];
    for(const k of ks){const v=await sg(k);if(v&&v.name)items.push({...v,key:k});}
    items.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    setClients(items);
  })();},[]);

  const upd=(id,delta)=>setCounts(c=>({...c,[id]:Math.max(0,c[id]+delta)}));

  // Fill calc form from selected client
  const loadClientIntoCalc=(clientKey)=>{
    const c=clients.find(cl=>cl.key===clientKey);
    if(!c)return;
    setCalcForm(f=>({...f,gender:c.gender||"female",age:c.age||f.age,height:c.height||f.height,weight:c.weight||f.weight,condition:c.condition||""}));
  };

  const runCalculation=()=>{
    const {gender,age,height,weight,actIdx,formula}=calcForm;
    const bmr=formula==="who"
      ? calcBMR_WHO({gender,age:+age,weight:+weight})
      : calcBMR({gender,age:+age,height:+height,weight:+weight});
    const tdee=bmr*ACT[actIdx];
    const target=Math.round(tdee);

    // Standard macro split: 50% carb, 20% protein, 30% fat (adjustable via condition-aware notes)
    const targetCarb=target*0.50/4;
    const targetProtein=target*0.20/4;
    const targetFat=target*0.30/9;

    // Greedy allocation across exchange groups to approximate targets
    const sc={};
    EXCHANGE_GROUPS.forEach(g=>sc[g.id]=0);
    // Milk: 2 exchanges default (prefer low-fat/free variant), Meat: based on protein need, Fat/nuts: based on fat need
    sc.milkFree=2;
    let remProtein=targetProtein-(sc.milkFree*6);
    let meatCount=Math.max(2,Math.round(remProtein/6));
    sc.meat=meatCount;
    remProtein-=meatCount*6;
    let remCarb=targetCarb-(sc.milkFree*9);
    // distribute carbs across bread/fruit/vegetable roughly 55/25/20
    const breadCount=Math.max(2,Math.round((remCarb*0.55)/15));
    const fruitCount=Math.max(2,Math.round((remCarb*0.25)/15));
    const vegCount=Math.max(3,Math.round((remCarb*0.20)/6));
    sc.bread=breadCount;sc.fruit=fruitCount;sc.vegetable=vegCount;
    let usedFat=(sc.milkFree*0)+(sc.meat*5);
    let remFat=targetFat-usedFat;
    const fatCount=Math.max(1,Math.round(remFat/5*0.6));
    const nutsCount=Math.max(1,Math.round(remFat/5*0.4));
    sc.fat=fatCount;sc.nuts=nutsCount;
    sc.sugar=0;

    setCounts(sc);
    setCalcResult({bmr:Math.round(bmr),tdee:target,formula});
    setShowCalc(false);
  };

  const totals=EXCHANGE_GROUPS.reduce((acc,g)=>{
    const n=counts[g.id]||0;
    acc.kcal+=n*exchangeKcal(g);acc.protein+=n*g.protein;acc.carb+=n*g.carb;acc.fat+=n*g.fat;
    return acc;
  },{kcal:0,protein:0,carb:0,fat:0});

  const totalExchanges=Object.values(counts).reduce((s,v)=>s+v,0);

  const saveToClient=async()=>{
    if(!selClientKey)return;
    await ss(`${selClientKey}:exchangePlan`,{counts,totals,date:new Date().toISOString().slice(0,10),ts:Date.now()});
    setSavedMsg(true);
    setTimeout(()=>setSavedMsg(false),2500);
  };

  return(
    <section style={{maxWidth:1100,margin:"0 auto",padding:"48px 24px 80px"}}>
      <h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:30,fontWeight:700,margin:"0 0 6px",color:T.ink,display:"flex",alignItems:"center",gap:10}}>
        ⚖️ {lang==="tr"?"Değişim Listesi Sistemi":"Exchange List System"} <PBadge sm/>
      </h1>
      <p style={{color:T.ink,opacity:0.6,fontSize:14.5,margin:"0 0 20px"}}>{lang==="tr"?"Türk diyetetik pratiğinde kullanılan standart besin değişim grupları. Her grup sabit kalori/makro değerine sahiptir; danışana kaç 'değişim' verileceğini belirleyip otomatik toplam hesaplayın.":"Standard food exchange groups used in Turkish dietetic practice. Each group has fixed calorie/macro values; set how many exchanges to assign and get automatic totals."}</p>

      {/* WHO/Mifflin auto-calculation trigger */}
      <div style={{marginBottom:28}}>
        <button onClick={()=>setShowCalc(f=>!f)} style={{display:"flex",alignItems:"center",gap:8,padding:"12px 20px",borderRadius:10,border:"none",background:C.coral,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🧮 {lang==="tr"?"Otomatik Kalori Hesapla & Öner":"Auto-Calculate Calories & Suggest"}</button>

        {showCalc&&(
          <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:14,padding:22,marginTop:14}}>
            <h4 style={{fontSize:14,fontWeight:700,color:T.ink,margin:"0 0 16px"}}>{lang==="tr"?"Danışan Bilgileri ile Değişim Önerisi Oluştur":"Generate Exchange Suggestion from Client Info"}</h4>

            {clients.length>0&&(
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase"}}>{lang==="tr"?"Danışandan Bilgi Çek (isteğe bağlı)":"Pull Info from Client (optional)"}</label>
                <select onChange={e=>loadClientIntoCalc(e.target.value)} defaultValue="" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:14,fontFamily:"inherit",cursor:"pointer"}}>
                  <option value="">{lang==="tr"?"Manuel gir...":"Enter manually..."}</option>
                  {clients.map(c=><option key={c.key} value={c.key}>{c.name}</option>)}
                </select>
              </div>
            )}

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}} className="g2">
              <div>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:5,textTransform:"uppercase"}}>{lang==="tr"?"Cinsiyet":"Gender"}</label>
                <div style={{display:"flex",gap:6}}>
                  {[{v:"female",l:lang==="tr"?"Kadın":"Female"},{v:"male",l:lang==="tr"?"Erkek":"Male"}].map(o=>(
                    <button key={o.v} onClick={()=>setCalcForm(f=>({...f,gender:o.v}))} style={{flex:1,padding:"8px",borderRadius:8,fontSize:12.5,fontWeight:600,border:`1.5px solid ${calcForm.gender===o.v?C.ink:T.line}`,background:calcForm.gender===o.v?C.ink:"transparent",color:calcForm.gender===o.v?"#fff":T.ink,cursor:"pointer",fontFamily:"inherit"}}>{o.l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:5,textTransform:"uppercase"}}>{lang==="tr"?"Yaş":"Age"}</label>
                <input type="number" value={calcForm.age} onChange={e=>setCalcForm(f=>({...f,age:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}} className="g2">
              <div>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:5,textTransform:"uppercase"}}>{lang==="tr"?"Boy (cm)":"Height (cm)"}</label>
                <input type="number" value={calcForm.height} onChange={e=>setCalcForm(f=>({...f,height:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:5,textTransform:"uppercase"}}>{lang==="tr"?"Kilo (kg)":"Weight (kg)"}</label>
                <input type="number" value={calcForm.weight} onChange={e=>setCalcForm(f=>({...f,weight:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:5,textTransform:"uppercase"}}>{lang==="tr"?"Aktivite Düzeyi":"Activity Level"}</label>
              <select value={calcForm.actIdx} onChange={e=>setCalcForm(f=>({...f,actIdx:Number(e.target.value)}))} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:13,fontFamily:"inherit",cursor:"pointer"}}>
                {t.calc.act.map((a,i)=><option key={i} value={i}>{a}</option>)}
              </select>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase"}}>{lang==="tr"?"Hesaplama Formülü":"Calculation Formula"}</label>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setCalcForm(f=>({...f,formula:"mifflin"}))} style={{flex:1,padding:"10px",borderRadius:8,fontSize:12.5,fontWeight:600,border:`1.5px solid ${calcForm.formula==="mifflin"?C.coral:T.line}`,background:calcForm.formula==="mifflin"?C.coralSoft:"transparent",color:calcForm.formula==="mifflin"?C.coral:T.ink,cursor:"pointer",fontFamily:"inherit"}}>Mifflin-St Jeor</button>
                <button onClick={()=>setCalcForm(f=>({...f,formula:"who"}))} style={{flex:1,padding:"10px",borderRadius:8,fontSize:12.5,fontWeight:600,border:`1.5px solid ${calcForm.formula==="who"?C.coral:T.line}`,background:calcForm.formula==="who"?C.coralSoft:"transparent",color:calcForm.formula==="who"?C.coral:T.ink,cursor:"pointer",fontFamily:"inherit"}}>WHO / Schofield</button>
              </div>
              <p style={{fontSize:10.5,color:T.ink,opacity:0.45,marginTop:6,lineHeight:1.5}}>{lang==="tr"?"Mifflin-St Jeor boy+kiloya dayalıdır (güncel klinik standart). WHO/Schofield ise yaş grubu + kiloya dayalı klasik denklemdir.":"Mifflin-St Jeor is based on height+weight (modern clinical standard). WHO/Schofield is the classic age-group + weight-based equation."}</p>
            </div>
            {calcForm.condition&&(calcForm.condition.toLowerCase().includes("hiper")||calcForm.condition.toLowerCase().includes("böbrek")||calcForm.condition.toLowerCase().includes("kidney")||calcForm.condition.toLowerCase().includes("hyper"))&&(
              <div style={{display:"flex",gap:8,padding:12,background:"#FFF8F0",border:`1px solid ${C.gold}40`,borderRadius:8,marginBottom:16}}>
                <AlertCircle size={15} color={C.gold} style={{flexShrink:0,marginTop:1}}/>
                <span style={{fontSize:12,color:T.ink,opacity:0.8}}>{lang==="tr"?`Danışanın durumu "${calcForm.condition}" — süt/et grubu seçiminde az tuzlu/düşük sodyumlu ürünleri tercih edin.`:`Client condition is "${calcForm.condition}" — prefer low-salt/low-sodium options when selecting milk/meat items.`}</span>
              </div>
            )}
            <button onClick={runCalculation} style={{width:"100%",padding:"12px",borderRadius:9,border:"none",background:C.ink,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{lang==="tr"?"Hesapla ve Değişimleri Öner":"Calculate & Suggest Exchanges"}</button>
          </div>
        )}

        {calcResult&&(
          <div style={{display:"flex",gap:16,alignItems:"center",background:T.paperDim,borderRadius:10,padding:"12px 16px",marginTop:12}}>
            <Check size={16} color={C.sage}/>
            <span style={{fontSize:13,color:T.ink}}>{lang==="tr"?"Hesaplandı":"Calculated"}: <strong>{calcResult.tdee} kcal</strong> ({calcResult.formula==="who"?"WHO/Schofield":"Mifflin-St Jeor"}, BMR: {calcResult.bmr} kcal) — {lang==="tr"?"aşağıdaki değişim sayıları otomatik önerildi, dilediğin gibi ayarlayabilirsin.":"exchange counts suggested below, adjust as needed."}</span>
          </div>
        )}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:28,alignItems:"start"}} className="g2">
        {/* Reference + Calculator */}
        <div>
          <h3 style={{fontSize:13,fontWeight:700,color:T.ink,opacity:0.5,textTransform:"uppercase",letterSpacing:"0.05em",margin:"0 0 14px"}}>{lang==="tr"?"Değişim Grupları":"Exchange Groups"}</h3>
          {EXCHANGE_GROUPS.map(g=>{
            const foods=lang==="tr"?g.foodsTr:g.foodsEn;
            const name=lang==="tr"?g.nameTr:g.nameEn;
            const isExp=expandedGroup===g.id;
            return(
              <div key={g.id} style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,padding:16,marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,flex:1,cursor:"pointer"}} onClick={()=>setExpandedGroup(isExp?null:g.id)}>
                    <span style={{fontSize:24}}>{g.icon}</span>
                    <div>
                      <div style={{fontSize:14.5,fontWeight:700,color:T.ink}}>{name}</div>
                      <div style={{fontSize:11.5,color:T.ink,opacity:0.5}}>1 {lang==="tr"?"değişim":"exchange"} = {exchangeKcal(g)} kcal · P:{g.protein}g K:{g.carb}g Y:{g.fat}g</div>
                    </div>
                    {isExp?<ChevronUp size={16} style={{opacity:0.4,marginLeft:"auto"}}/>:<ChevronDown size={16} style={{opacity:0.4,marginLeft:"auto"}}/>}
                  </div>
                </div>
                {isExp&&(
                  <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${T.line}`}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}} className="g2">
                      {foods.map((f,i)=>(
                        <div key={i} style={{background:T.paperDim,borderRadius:8,padding:"8px 12px"}}>
                          <div style={{fontSize:12.5,fontWeight:600,color:T.ink}}>{f.n}</div>
                          <div style={{fontSize:11,color:T.ink,opacity:0.55}}>{f.a}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,paddingTop:12,borderTop:`1px solid ${T.line}`}}>
                  <span style={{fontSize:12.5,fontWeight:600,color:T.ink,opacity:0.7}}>{lang==="tr"?"Değişim Sayısı":"Exchange Count"}</span>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <button onClick={()=>upd(g.id,-1)} style={{width:28,height:28,borderRadius:8,border:`1px solid ${T.line}`,background:"transparent",color:T.ink,cursor:"pointer",fontSize:16,fontWeight:700}}>−</button>
                    <span style={{fontSize:16,fontWeight:800,color:C.coral,minWidth:24,textAlign:"center"}}>{counts[g.id]}</span>
                    <button onClick={()=>upd(g.id,1)} style={{width:28,height:28,borderRadius:8,border:"none",background:C.coral,color:"#fff",cursor:"pointer",fontSize:16,fontWeight:700}}>+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals + Assign */}
        <div style={{position:"sticky",top:100}}>
          <div style={{background:C.ink,borderRadius:14,padding:24,marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#fff",opacity:0.6,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:14}}>{lang==="tr"?"Toplam":"Total"} ({totalExchanges} {lang==="tr"?"değişim":"exchanges"})</div>
            <div style={{fontSize:40,fontWeight:800,color:"#fff",fontFamily:"'Source Serif 4',Georgia,serif",marginBottom:4}}>{totals.kcal}<span style={{fontSize:16,opacity:0.6,fontWeight:600}}> kcal</span></div>
            <div style={{display:"flex",gap:16,marginTop:16,paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.15)"}}>
              {[{l:lang==="tr"?"Protein":"Protein",v:totals.protein},{l:lang==="tr"?"Karb":"Carbs",v:totals.carb},{l:lang==="tr"?"Yağ":"Fat",v:totals.fat}].map((x,i)=>(
                <div key={i}><div style={{fontSize:10.5,color:"#fff",opacity:0.55,marginBottom:2}}>{x.l}</div><div style={{fontSize:18,fontWeight:700,color:"#fff"}}>{x.v}g</div></div>
              ))}
            </div>
          </div>

          <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:14,padding:20}}>
            <h4 style={{fontSize:13,fontWeight:700,color:T.ink,margin:"0 0 12px"}}>👤 {lang==="tr"?"Danışana Ata":"Assign to Client"}</h4>
            <select value={selClientKey} onChange={e=>setSelClientKey(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:14,fontFamily:"inherit",marginBottom:12,cursor:"pointer"}}>
              <option value="">{lang==="tr"?"Danışan seç...":"Select client..."}</option>
              {clients.map(c=><option key={c.key} value={c.key}>{c.name}</option>)}
            </select>
            <button onClick={saveToClient} disabled={!selClientKey||totalExchanges===0} style={{width:"100%",padding:"11px",borderRadius:8,border:"none",background:selClientKey&&totalExchanges>0?C.coral:T.line,color:selClientKey&&totalExchanges>0?"#fff":T.ink,fontSize:14,fontWeight:700,cursor:selClientKey&&totalExchanges>0?"pointer":"not-allowed",opacity:selClientKey&&totalExchanges>0?1:0.5,fontFamily:"inherit"}}>{lang==="tr"?"Plana Kaydet":"Save to Plan"}</button>
            {savedMsg&&<div style={{marginTop:10,fontSize:13,color:C.sage,fontWeight:600,display:"flex",alignItems:"center",gap:5}}><Check size={14}/> {lang==="tr"?"Danışana kaydedildi!":"Saved to client!"}</div>}
            {totalExchanges===0&&<p style={{fontSize:11.5,color:T.ink,opacity:0.4,marginTop:10,lineHeight:1.5}}>{lang==="tr"?"Önce yukarıdan en az bir değişim grubu seç.":"Select at least one exchange group above first."}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function SettingsPage({t,lang,nav,T=C}){
  const[profile,setProfile]=useState({dietitianName:"",clinicName:"",phone:"",email:"",tagline:""});
  const[saved,setSaved]=useState(false);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{(async()=>{
    const p=await sg("dietitianProfile");
    if(p)setProfile(p);
    setLoading(false);
  })();},[]);

  const save=async()=>{
    await ss("dietitianProfile",profile);
    setSaved(true);
    setTimeout(()=>setSaved(false),2500);
  };

  if(loading)return<section style={{maxWidth:600,margin:"0 auto",padding:"60px 24px"}}><Spin/></section>;

  return(
    <section style={{maxWidth:600,margin:"0 auto",padding:"48px 24px 80px"}}>
      <h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:30,fontWeight:700,margin:"0 0 6px",color:T.ink,display:"flex",alignItems:"center",gap:10}}>
        ⚙️ {lang==="tr"?"Diyetisyen / Klinik Ayarları":"Dietitian / Clinic Settings"}
      </h1>
      <p style={{color:T.ink,opacity:0.6,fontSize:14.5,margin:"0 0 32px"}}>{lang==="tr"?"Bu bilgiler yazdırılan raporların üst kısmında görünecek — kendi adın veya kliniğinle profesyonel çıktı alabilirsin.":"This information appears at the top of printed reports — get professional output with your own name or clinic."}</p>

      <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:14,padding:24}}>
        <div style={{marginBottom:16}}>
          <label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="tr"?"Diyetisyen Adı":"Dietitian Name"}</label>
          <input value={profile.dietitianName} onChange={e=>setProfile(p=>({...p,dietitianName:e.target.value}))} placeholder={lang==="tr"?"örn. Dyt. Ayşe Yılmaz":"e.g. Dt. Jane Smith"} style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="tr"?"Klinik / İşletme Adı":"Clinic / Business Name"}</label>
          <input value={profile.clinicName} onChange={e=>setProfile(p=>({...p,clinicName:e.target.value}))} placeholder={lang==="tr"?"örn. Sağlıklı Yaşam Diyet Kliniği":"e.g. Healthy Living Nutrition Clinic"} style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}} className="g2">
          <div>
            <label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>📞 {lang==="tr"?"Telefon":"Phone"}</label>
            <input type="tel" value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} placeholder="0555 123 45 67" style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/>
          </div>
          <div>
            <label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>✉️ {lang==="tr"?"E-posta":"Email"}</label>
            <input type="email" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))} placeholder="ornek@klinik.com" style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/>
          </div>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontSize:12,fontWeight:700,color:T.ink,opacity:0.6,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="tr"?"Slogan / Unvan (isteğe bağlı)":"Tagline / Title (optional)"}</label>
          <input value={profile.tagline} onChange={e=>setProfile(p=>({...p,tagline:e.target.value}))} placeholder={lang==="tr"?"örn. Klinik Beslenme Uzmanı":"e.g. Clinical Nutrition Specialist"} style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${T.line}`,background:T.paper,color:T.ink,fontSize:15,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/>
        </div>

        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={save} style={{padding:"11px 24px",borderRadius:9,background:C.coral,color:"#fff",border:"none",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>{lang==="tr"?"Kaydet":"Save"}</button>
          {saved&&<span style={{color:C.sage,fontSize:13.5,fontWeight:600,display:"flex",alignItems:"center",gap:5}}><Check size={15}/> {lang==="tr"?"Kaydedildi!":"Saved!"}</span>}
        </div>
      </div>

      {(profile.dietitianName||profile.clinicName)&&(
        <div style={{marginTop:24}}>
          <h4 style={{fontSize:12,fontWeight:700,color:T.ink,opacity:0.5,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:12}}>{lang==="tr"?"Rapor Başlığı Önizlemesi":"Report Header Preview"}</h4>
          <div style={{background:"#fff",border:`1px solid ${T.line}`,borderRadius:12,padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",paddingBottom:14,borderBottom:"2px solid #0E2A3D"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <svg width="22" height="22" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="#0E2A3D" strokeWidth="1.5"/><path d="M13 26V14L27 26V14" stroke="#E8623F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div>
                  <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:800,fontSize:15,color:"#0E2A3D"}}>{profile.clinicName||"NutriBase PRO"}</div>
                  {profile.dietitianName&&<div style={{fontSize:11,color:"#0E2A3D",opacity:0.6}}>{profile.dietitianName}{profile.tagline&&` · ${profile.tagline}`}</div>}
                </div>
              </div>
              <div style={{textAlign:"right",fontSize:10.5,color:"#0E2A3D",opacity:0.6}}>
                {profile.phone&&<div>{profile.phone}</div>}
                {profile.email&&<div>{profile.email}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
