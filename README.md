# NutriBase — Web Sitesi Kurulum Rehberi

Bu klasör, NutriBase uygulamasının gerçek bir web sitesi olarak yayınlanmaya hazır halidir.

## Bilgisayarında Çalıştırmak İçin Gerekenler

1. **Node.js** kur: https://nodejs.org adresinden "LTS" sürümünü indir ve kur (Next/İleri diyerek kurulum tamamlanır).
2. Bu klasörü bir yere kaydet (örn. Masaüstü > nutribase-site).

## Yerel Olarak Test Etmek (Yayınlamadan Önce)

Terminal / Komut İstemi açıp bu klasöre gel, sonra:

```
npm install
npm run dev
```

Tarayıcıda açılan adrese (genelde http://localhost:5173) girince uygulamayı bilgisayarında görürsün.

## İnternete Yayınlamak (Vercel ile, Ücretsiz)

Detaylı adım adım rehberi ayrı olarak ilettim — özetle:

1. GitHub.com'da ücretsiz hesap aç
2. Bu klasördeki kodu GitHub'a yükle
3. Vercel.com'da GitHub hesabınla giriş yap
4. "Import Project" diyip bu repoyu seç
5. Vercel otomatik olarak siteyi yayınlar ve sana bir adres verir (örn. nutribase.vercel.app)

## Önemli Not

Bu sürümde veriler kullanıcının **kendi tarayıcısında** (localStorage) saklanır. Yani:
- Her kullanıcının verisi kendi cihazında kalır, başkasıyla paylaşılmaz
- Kullanıcı tarayıcı geçmişini/verilerini temizlerse kayıtlar silinir
- Farklı cihazdan (telefon/bilgisayar) girince veriler senkronize olmaz

İleride gerçek kullanıcı hesapları ve cihazlar arası senkronizasyon istersen, bir veritabanı (Supabase, Firebase gibi) eklenmesi gerekir — bu ayrı bir aşama olarak planlanabilir.
