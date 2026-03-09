# TavsVelo — Sociālo Tīklu Publikācijas

---

## LINKEDIN — Portfolio posts

### Post 1 — Projekta prezentācija (garš)

> **Uzbūvēju pilnīgu veloservisa biznesa mājaslapu no nulles.**
>
> TavsVelo ir mobilais velosipēdu serviss Jelgavas novadā — klients pierakstās, viņa velosipēdu savāc, salabo un atgriež mājās. Vienkārša ideja, ko vajadzēja īstenot kā pienākas: ātra, uzticama lapa, kas darbojas arī mobilajā telefonā.
>
> **Ko uzbūvēju:**
>
> Sākumlapa — hero ar Ken Burns fonu, statistikas bloki, soļu apraksts, FAQ sekcija ar schema.org struktūrētajiem datiem.
>
> Servisa cenu lapa — 11 kategorijas, 64+ pakalpojumi (V-bremzes, disku bremzes, ritenis, pārnesumi, e-bike, amortizatori). Mobilajā versijā kategorijas salokās ar smooth animāciju.
>
> Veikals — lietoti velosipēdi + kopšanas līdzekļi. Grozs ar localStorage (neizzūd pēc lapas pārlādes), checkout ar Stripe (kartes) un Montonio (Swedbank, SEB, Citadele, Luminor).
>
> Kontaktu lapa — AJAX kontaktforma (bez lapas pārlādes), juridiskā informācija, rekvizīti.
>
> **Tehniski:**
> → Vanilla JS + PHP (bez framework)
> → Stripe Checkout API + Montonio JWT bank payments
> → JSON-LD uz katras lapas (LocalBusiness, FAQPage, BreadcrumbList, Service)
> → Open Graph + Twitter Card
> → GDPR cookie consent — Google Fonts ielādējas tikai pēc piekrišanas
> → Visas maksājumu ikonas — lokālas SVG (nulles third-party pieprasījumi lādējoties)
> → site-config.js — viens fails, kur nomaina uzņēmuma nosaukumu, kontaktus un cenas visā lapā uzreiz
>
> Demo: devbergs.github.io/bike-service-web
>
> ---
> #webdevelopment #vanillajs #php #stripe #seo #latvija #веб

---

### Post 2 — Tehniski fokusēts (īsāks)

> **site-config.js — patterns, ko izmantoju katrā klienta projektā.**
>
> Viena no lielākajām sāpēm custom mājaslapās: katrs uzņēmuma nosaukums, cena, tālrunis ir izkaisīts pa simtiem HTML rindiņu.
>
> Risinājums, ko ieviesu TavsVelo projektā:
>
> ```js
> const SITE = {
>   business: { name: 'TavsVelo', phone: '+37126533400' },
>   prices:   { diagnostics: { full: 12 }, wheels: { true: 15 } },
>   colors:   { primary: '#0F1E3C', accent: '#1B4FD8' }
> };
> ```
>
> HTML izmanto `data-cfg`, `data-cfg-price`, `data-cfg-href` atribūtus. Auto-injektors pie `DOMContentLoaded` aizpilda visu — tekstus, cenas (ar € prefiksu), tel:/mailto: href saites, pat CSS krāsu tokenus `(:root)`.
>
> Jauns klients = nomaina vienu failu. Pārējais darbojas pats.
>
> Demo → devbergs.github.io/bike-service-web
>
> ---
> #javascript #webdev #cleancode #frontend #latvia

---

### Post 3 — Maksājumu integrācija

> **Divpusēja maksājumu sistēma vienā veikalā.**
>
> TavsVelo veikalā klienti var maksāt divos veidos:
>
> 1. **Stripe** — vīza, Mastercard, Apple Pay, Google Pay
> 2. **Montonio** — Latvijas bankas tieši: Swedbank, SEB, Citadele, Luminor
>
> Abas sistēmas strādā caur PHP bez framework:
> Stripe — cURL pieprasījums → Stripe Checkout Session → redirect
> Montonio — JWT tokena ģenerēšana → banka → webhook apstiprinājums
>
> Checkout flow: Grozs → izvēli maksājuma metodi → aiziet uz banku/Stripe → atgriežas `?success=1` → modālis "Paldies!" + grozs iztīrās.
>
> Lokālais grozs = localStorage. Nekas neizzūd, ja klients aizver cilni.
>
> ---
> #stripe #montonio #ecommerce #php #payments #latvia #webdevelopment

---

## INSTAGRAM — Caption varianti

### Caption 1 — Vizuāls / projekta showcase

> Mobilais veloserviss → pilnīga mājaslapa.
>
> Sākumlapa · Servisa cenas · Veikals · Kontakti
> Stripe + Montonio maksājumi · JSON-LD SEO · GDPR
>
> Viss uzcelts ar Vanilla JS + PHP — bez framework ballasta.
>
> 🔗 devbergs.github.io/bike-service-web
>
> —
> #tavsvelo #webdesign #frontend #javascript #php #ecommerce #seo #latvija #веб #design #portfolio #devberg

---

### Caption 2 — Kods / tehniski

> Viena lieta, ko katram klienta projektam daru citādi: site-config.js
>
> Nosaukums, cenas, krāsas, kontakti — viss vienā failā.
> HTML lasa datus automātiski. Jauns klients = mainās viens fails.
>
> 🔗 Projekts → devbergs.github.io/bike-service-web
>
> —
> #javascript #cleancode #webdev #frontend #vanillajs #devberg #portfolio

---

### Caption 3 — Īsāks / lifestyle

> No idejas līdz tiešsaistei.
>
> TavsVelo — mobilais veloserviss, kas savāc tavu velosipēdu mājās,
> salabo un atgriež. Mēs uzbūvējām visu pārējo.
>
> 🔗 devbergs.github.io/bike-service-web
>
> —
> #tavsvelo #webdesign #latvija #velosipēds #devberg #portfolio

---

## FACEBOOK — Post variants

> **Jauns projekts pabeigts — TavsVelo.**
>
> TavsVelo ir mobilais veloserviss Jelgavas novadā. Klients pierakstās → velosipēdu savāc no mājām → salabo → atgriež. Vienkārša un gudra ideja.
>
> Mājaslapu veidojām no nulles:
>
> ✅ Sākumlapa ar FAQ un apkalpošanas soļiem
> ✅ Servisa cenu lapa — 11 kategorijas, 64+ pakalpojumi
> ✅ Mobilajā telefonā cenas sakārtotas ar accordion animāciju
> ✅ Veikals — lietoti velosipēdi un kopšanas produkti
> ✅ Stripe (kartes) + Montonio (Swedbank, SEB, Citadele, Luminor)
> ✅ GDPR sīkdatņu piekrišana
> ✅ JSON-LD struktūrētie dati Google meklētājam
>
> Demo: devbergs.github.io/bike-service-web
> Klients: tavsvelo.lv
>
> Veidots ar: HTML · CSS · Vanilla JavaScript · PHP
>
> #TavsVelo #webdesign #ecommerce #latvia #veloserviss

---

## ĪSS APRAKSTS (Bio / About / projekta karte)

> TavsVelo — pielāgota mājaslapa mobilajam veloservisam.
> Sākumlapa · Cenu lapa · Veikals ar Stripe + Montonio maksājumiem.
> Vanilla JS + PHP · JSON-LD SEO · GDPR.
> devbergs.github.io/bike-service-web
