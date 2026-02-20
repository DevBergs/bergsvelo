# BergsVelo — Tehniskais SEO Plāns
**Versija:** 1.0 | **Datums:** 2026-02-20 | **Mērķis:** Jelgavas novads + Latvija

> Šis dokuments ir paredzēts programmētājam un satura komandai.
> Katram uzdevumam norādīts izpildītājs: **[DEV]**, **[CONTENT]**, **[DEV+CONTENT]**.

---

## SATURA RĀDĪTĀJS

1. [Executive Summary](#1-executive-summary)
2. [Pašreizējais stāvoklis — Audits](#2-pašreizējais-stāvoklis--audits)
3. [Entity Architecture](#3-entity-architecture)
4. [Keyword Universe + Intent Mapping](#4-keyword-universe--intent-mapping)
5. [Semantic SEO Struktūra](#5-semantic-seo-struktūra)
6. [Internal Linking Map (Hub & Spoke)](#6-internal-linking-map-hub--spoke)
7. [Crawl Budget Optimizācija](#7-crawl-budget-optimizācija)
8. [Keyword Cannibalization — Novēršanas Sistēma](#8-keyword-cannibalization--novēršanas-sistēma)
9. [Conversion-First Lapas Arhitektūra](#9-conversion-first-lapas-arhitektūra)
10. [E-E-A-T Pastiprināšana](#10-e-e-a-t-pastiprināšana)
11. [Topical Authority Plāns — 12 Mēneši](#11-topical-authority-plāns--12-mēneši)
12. [Implementācijas Ceļvedis](#12-implementācijas-ceļvedis)

---

## 1. Executive Summary

**BergsVelo Unikālā Pozicionēšana:**
> "Vienīgais mobilais veloserviss Jelgavas novadā ar bezmaksas savākšanu un piegādi."

Šī ir galvenā SEO virzītājspēka ass. Neviena cita veloservisa lapa Jelgavas novadā nespēj apgalvot to pašu. Visi SEO centieni jāvirza caur šo prizmu.

**Mērķa tirgus (primārais):**
- Ozolnieki (iedzīvotāji ~5 500)
- Jelgava (iedzīvotāji ~55 000) — 15 km
- Jelgavas novads kopumā (~45 000)

**6 mēnešu mērķi:**
- Top 3 Google.lv par "veloserviss Ozolnieki" ✓ (viegli sasniedzams, zema konkurence)
- Top 5 par "veloserviss Jelgava"
- Organiskās klikšķi +200% no sākuma bāzes
- Schema rich snippets visās lapās (FAQ, rating, breadcrumb)

**12 mēnešu mērķi:**
- Topical authority par "velo apkope Latvija"
- Top 10 par 15+ garajiem atslēgvārdiem
- Google Business Profile ar 20+ atsauksmēm
- Blog ar 8+ satura vienībām ar iekšējo trafiku

---

## 2. Pašreizējais stāvoklis — Audits

### Stiprās puses
| Aspekts | Novērtējums | Piezīme |
|---|---|---|
| Lapas ātrums | ✅ Labi | Statisks HTML, nav JS framework |
| Unikālais piedāvājums | ✅ Spēcīgs | Mobilā savākšana — reti konkurē |
| Cenu lapas detalizācija | ✅ Labi | Konkrētas cenas = uzticamības signals |
| Latviešu valoda | ✅ Atbilstoša | Google.lv — lv domēns prioritārs |
| SSL/HTTPS | ⚠️ Jāpārbauda | Jānodrošina bergsvelo.lv |
| Strukturētie dati | ❌ Nav | Schema markup pilnībā trūkst |
| Open Graph | ❌ Nav | Nepieciešams sociālajiem medijiem |
| Canonical URL | ❌ Nav | Jāpievieno |
| robots.txt | ❌ Nav | Jāizveido |
| sitemap.xml | ❌ Nav | Jāizveido |
| H1 struktūra | ⚠️ Daļēji | Jāpārbauda vienā lapā = viens H1 |
| Alt teksti attēliem | ❌ Nav | Visiem attēliem jāpievieno alt="" |
| Google Business Profile | ⚠️ Nezināms | Kritisks lokālajam SEO — jāiestata |

### Lapas Struktūra
| URL | Mērķa Atslēgvārds | Status |
|---|---|---|
| `/` (index.html) | veloserviss Ozolnieki | Pamats labs, jāstiprina |
| `/workshop.html` | velo apkope cenas Ozolnieki | Labi, jāpievieno schema |
| `/shop.html` | lietoti velosipēdi Jelgava | Jauna, jāoptimizē |
| `/contacts.html` | piesakīties velo servisam | Jāpievieno LocalBusiness signals |

---

## 3. Entity Architecture

Google saprot entitijas (entities), nevis tikai atslēgvārdus. BergsVelo Knowledge Graph struktūra:

```
                    ┌─────────────────────────┐
                    │   BERGSVELO (Brand)      │
                    │   @type: LocalBusiness   │
                    │   @type: BicycleStore    │
                    └───────────┬─────────────┘
                                │ isA / hasA
          ┌─────────────────────┼───────────────────────┐
          ▼                     ▼                       ▼
  ┌───────────────┐   ┌──────────────────┐   ┌─────────────────┐
  │   PERSONA     │   │    ATRAŠANĀS     │   │   PAKALPOJUMI   │
  │ Aivis Karlsb. │   │   VIETA          │   │                 │
  │ @type: Person │   │ Ozolnieki        │   │ BikeRepair      │
  │ Mechanic      │   │ Jelgavas novads  │   │ BikePickup      │
  │ Owner         │   │ Latvija          │   │ BikeDelivery    │
  └───────────────┘   └──────────────────┘   └─────────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
  ┌──────────────┐    ┌──────────────────┐   ┌──────────────────┐
  │  PRODUKTI    │    │  KLIENTI         │   │  KONKURENTI      │
  │ Lietoti velo │    │ B2C: Privātpersn.│   │ (Jelgavas velo   │
  │ Kopšanas lī. │    │ B2B: Skolas/Uzņ. │   │  veikali)        │
  └──────────────┘    └──────────────────┘   └──────────────────┘
```

### Entity Schema — Implementācijas Specifikācija

**Galvenā entitija (ielikt VISĀS lapās `<head>`):**
```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "BicycleStore"],
  "@id": "https://bergsvelo.lv/#business",
  "name": "BergsVelo",
  "url": "https://bergsvelo.lv",
  "telephone": "+37126533400",
  "email": "info@bergsvelo.lv",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ozolnieki",
    "addressRegion": "Jelgavas novads",
    "addressCountry": "LV"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 56.683,
    "longitude": 23.767
  },
  "areaServed": ["Ozolnieki", "Jelgava", "Jelgavas novads"]
}
```

**Persona entitija (pievienot lapā "Par mums" vai homepage `about` sadaļā):**
```json
{
  "@type": "Person",
  "@id": "https://bergsvelo.lv/#founder",
  "name": "Aivis Karlsbergs",
  "jobTitle": "Velosipēdu mehāniķis",
  "worksFor": {"@id": "https://bergsvelo.lv/#business"}
}
```

**NAP konsekvence (visos lapās, footerā, schema):**
- **N**ame: BergsVelo (tieši tā — bez atstarpes)
- **A**ddress: Ozolnieki, Jelgavas novads, Latvija
- **P**hone: +371 265 33 400 (schema: +37126533400)

> ⚠️ NAP jābūt IDENTISKAM Google Business Profile, schema.org un visās citās citātu platformās.

---

## 4. Keyword Universe + Intent Mapping

### Primārie atslēgvārdi (Transactional / Local)
| Atslēgvārds | Mēn. vol. (est.) | KD | Lapa | Intent |
|---|---|---|---|---|
| veloserviss Ozolnieki | 50–100 | Ļoti zems | index.html | Local Transactional |
| velosipēda remonts Ozolnieki | 30–70 | Ļoti zems | workshop.html | Local Transactional |
| veloserviss Jelgava | 100–300 | Zems | index.html | Local Transactional |
| velo apkope Jelgava | 80–200 | Zems | workshop.html | Local Commercial |
| mobilais veloserviss Latvija | 20–50 | Zems | index.html | Commercial |
| velo savākšana piegāde | 10–30 | Ļoti zems | index.html | Commercial |
| bergsvelo | 10–30 | Zems | index.html | Branded Navigational |

### Sekundārie atslēgvārdi (Commercial Intent)
| Atslēgvārds | Lapa | Prioritāte |
|---|---|---|
| velo apkope cenas Ozolnieki | workshop.html | Augsta |
| bremžu regulēšana velosipēdam cena | workshop.html | Vidēja |
| velo ķēdes maiņa | workshop.html | Vidēja |
| riteņu centrēšana cena | workshop.html | Vidēja |
| lietoti velosipēdi Jelgava | shop.html | Augsta |
| lietoti velosipēdi Ozolnieki | shop.html | Augsta |
| Trek velo pārdošana Latvija | shop.html | Vidēja |
| velo kopšanas līdzekļi | shop.html | Zema |
| piesakīties velo servisam | contacts.html | Augsta |

### Long-tail atslēgvārdi (Informational → Conversion)
| Atslēgvārds | Saturs | Intent Funnel |
|---|---|---|
| velosipēda apkope pirms sezonas | Blog raksts | ToFu |
| kā tīrīt velosipēda ķēdi | Blog raksts | ToFu |
| ko pārbaudīt pērkot lietotu velo | Blog raksts | MoFu |
| velosipēds nebrauc labi — kāpēc | Blog/FAQ | MoFu |
| velo apkope pirms ziemas | Blog raksts | ToFu |
| kāds kalnu velo der iesācējam | Blog raksts | MoFu |
| velo remonta cena Latvijā | workshop.html | BoFu |

### Search Intent Matrix
```
INFORMATIONAL          COMMERCIAL           TRANSACTIONAL
(Blog saturs)          (Produktu lapas)     (Kontaktforma / Shop)
─────────────────────────────────────────────────────────────────
"kā tīrīt velo ķēdi"  "lietoti velo"       "piesakīties servisam"
"velo apkope padomi"  "velo apkope cenas"  "nopirkt lietotu velo"
"velosipēda problēma" "bergsvelo serviss"  "veloserviss Ozolnieki"
```

---

## 5. Semantic SEO Struktūra

### Heading Hierarchy — Katrai Lapai

**index.html:**
```
H1: Veloserviss Ozolniekos (1×)
H2: Kā tas darbojas (process section)
H2: Par mums (about)
H2: Biežāk Uzdotie Jautājumi (FAQ)
H3: [katrs FAQ jautājums]
```

**workshop.html:**
```
H1: Serviss & Cenas (1×)
H2: [Katras servisa kategorijas nosaukums, piem. "Bremzes"]
```

**shop.html:**
```
H1: Veikals (1×)
H2: Lietoti Velosipēdi (kad bike sekcija)
H2: Kopšanas Līdzekļi (kad product sekcija)
H3: [katra produkta nosaukums — bike-title / product-card-title]
```

**contacts.html:**
```
H1: Piesakies Servisam (1×)
H2: Nosūtiet Ziņu (forma)
H2: Kontaktinformācija (info card)
```

### Schema Markup — Pa Lapām

| Lapa | Schema tipi |
|---|---|
| index.html | LocalBusiness, BicycleStore, WebSite, FAQPage, Organization |
| workshop.html | LocalBusiness (ref), Service, BreadcrumbList, PriceSpecification |
| shop.html | LocalBusiness (ref), Store, ItemList, BreadcrumbList |
| contacts.html | LocalBusiness (ref), ContactPage, BreadcrumbList |

> **[DEV]:** Schema jāimplementē kā JSON-LD `<script>` bloki `<head>` sekcijā.
> Fails `schema/` mapē nav nepieciešams — inline JSON-LD ir Google ieteikums.

### Open Graph + Twitter Card — Katrai Lapai

```html
<!-- Open Graph (Facebook, LinkedIn, WhatsApp) -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://bergsvelo.lv/[lapa].html" />
<meta property="og:title" content="[Lapas nosaukums] — BERGSVELO" />
<meta property="og:description" content="[Meta description]" />
<meta property="og:image" content="https://bergsvelo.lv/images/[hero-attēls].jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="lv_LV" />
<meta property="og:site_name" content="BergsVelo" />

<!-- Twitter/X Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[Lapas nosaukums] — BERGSVELO" />
<meta name="twitter:description" content="[Meta description]" />
<meta name="twitter:image" content="https://bergsvelo.lv/images/[hero-attēls].jpg" />
```

### Image Alt Text — Stratēģija

Katram attēlam jābūt aprakstošam alt tekstam ar kontekstu:

| Attēls | Pašreizējais alt | Ieteiktais alt |
|---|---|---|
| bike2.jpg | (trūkst) | `Velosipēds BergsVelo servisa darbnīcā Ozolniekos` |
| close-up-working-bike.jpg | (trūkst) | `Mehāniķis regulē velosipēdu — BergsVelo serviss` |
| van1.jpg | (trūkst) | `BergsVelo furgons velosipēdu savākšanai un piegādei Jelgavas novadā` |
| van.jpg | (trūkst) | `Mobilais veloserviss — savākšana no mājām Ozolniekos` |
| serviss.jpg | (trūkst) | `Velosipēda apkope un remonts — BergsVelo darbnīca` |
| prof.jpg | (trūkst) | `Aivis Karlsbergs, BergsVelo velosipēdu mehāniķis` |
| header_bike.jpg | (trūkst) | `Velosipēds uz ceļa Ozolniekos — BergsVelo` |

> **[DEV]:** Pievienot `alt=""` atributus visiem `<img>` tagiem.

---

## 6. Internal Linking Map (Hub & Spoke)

### Lapas Hierarhija

```
                         ┌─────────────────┐
                         │   index.html     │  ← PILLAR (Hub)
                         │   "Sākumlapa"    │
                         └────────┬────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼
  ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
  │ workshop.html │       │   shop.html   │       │ contacts.html │
  │  "Serviss"    │       │  "Veikals"    │       │  "Piesakies"  │
  │   (Spoke)     │       │   (Spoke)     │       │   (Spoke)     │
  └───────┬───────┘       └───────┬───────┘       └───────────────┘
          │                       │
          ▼                       ▼
  ┌───────────────┐       ┌───────────────┐       ← NĀKOTNE
  │ blog/apkope   │       │ blog/lietoti  │
  │ "Apkopes      │       │ "Kā izvēlēties│
  │  padomi"      │       │  lietotu velo"│
  │   (Spoke)     │       │   (Spoke)     │
  └───────────────┘       └───────────────┘
```

### Obligātās Iekšējās Saites — Tagad

| No lapas | Uz lapu | Anchor teksts | Prioritāte |
|---|---|---|---|
| index.html | workshop.html | "Apskatīt servisus un cenas" | ✅ Augsta |
| index.html | shop.html | "Apskatīt veikalu" | ✅ Augsta |
| index.html | contacts.html | "Piesakies tagad" | ✅ Augsta |
| workshop.html | contacts.html | "Piesakies servisam" | ✅ Augsta |
| workshop.html | index.html | "Uzzināt vairāk par mums" | Vidēja |
| shop.html | contacts.html | "Jautājumi? Sazinies" | Vidēja |
| shop.html | workshop.html | "Nepieciešams arī serviss?" | Vidēja |
| contacts.html | workshop.html | "Servisa cenas" | Vidēja |

### Anchor Text Noteikumi

- **Exact match:** Lietot reti — maks. 10% no saitēm (risks: over-optimization)
- **Partial match:** Ieteicamais — "apskatīt velosipēda servisa cenas"
- **Branded:** "BergsVelo serviss", "BergsVelo veikals"
- **Generic:** "uzzināt vairāk", "skatīt šeit" — izvairīties!

```
❌  "noklikšķiniet šeit"
❌  "lasīt vairāk"
✅  "apskatīt bremžu regulēšanas cenu"
✅  "piesakīties velosipēda apkopei"
✅  "nopirkt lietotos velosipēdus"
```

### Blog → Main Pages Saišu Struktūra (Nākotne)

Katrs blog raksts jāsaista ar:
1. Attiecīgo galveno lapu (worksheet.html vai shop.html)
2. Vismaz 1 citu blog rakstu (informācijas arhitektūra)
3. contacts.html CTA ("Piesakies servisam" raksta beigās)

---

## 7. Crawl Budget Optimizācija

### robots.txt (Jāizveido: `/robots.txt`)

```
User-agent: *
Allow: /

# Bloķē servera failus
Disallow: /php/
Disallow: /scss/
Disallow: /src/
Disallow: /js/addons/
Disallow: /css/addons/

# Bloķē vecās/neatbilstošas lapas
Disallow: /lietoti.html
Disallow: /exclusive-templates/

Sitemap: https://bergsvelo.lv/sitemap.xml
```

### sitemap.xml (Jāizveido: `/sitemap.xml`)

Jāietver tikai indeksējamās lapas ar pareizām prioritātēm:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bergsvelo.lv/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://bergsvelo.lv/workshop.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://bergsvelo.lv/shop.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://bergsvelo.lv/contacts.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

> ⚠️ `lietoti.html` NAV jāiekļauj sitemap (bloķēts robots.txt, nav aktīva navā).

### Canonical URL Stratēģija

Katrai lapai `<head>` jāpievieno:
```html
<link rel="canonical" href="https://bergsvelo.lv/[lapa].html" />
```

Īpatnības:
- `index.html` → canonical: `https://bergsvelo.lv/` (bez `.html`)
- Pārējās lapas → ar `.html` paplašinājumu

### Core Web Vitals Mērķi

| Metrika | Mērķis | Pašreizējais stāvoklis |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | ✅ Labi (statisks) |
| INP (Interaction to Next Paint) | < 200ms | ✅ Labi (mazs JS) |
| CLS (Cumulative Layout Shift) | < 0.1 | ⚠️ Jāpārbauda (JS attēli) |

> **[DEV]:** Hero attēliem pievienot `loading="eager"` + `fetchpriority="high"`. Citiem attēliem — `loading="lazy"`.

### Hreflang (Nav nepieciešams tagad)
Ja nākotnē tiek pievienots krievu/angļu saturs, jāpievieno hreflang tags. Pagaidām — tikai latviešu.

---

## 8. Keyword Cannibalization — Novēršanas Sistēma

### Kanoniskā Atslēgvārdu Karte

**NOTEIKUMS:** Viens atslēgvārds = viena lapa. Nekad divas lapas nedrīkst konkurēt par vienu un to pašu atslēgvārdu.

| Atslēgvārds (un varianti) | KANONISKĀ LAPA | Bloķētā lapa |
|---|---|---|
| veloserviss Ozolnieki | **index.html** | ← Citas lapas NESATURĒT šo! |
| veloserviss Jelgava | **index.html** | — |
| mobilais veloserviss | **index.html** | — |
| velo apkope cenas | **workshop.html** | index.html (pieminēt, nesacenties) |
| bremžu regulēšana | **workshop.html** | — |
| ķēdes maiņa | **workshop.html** | — |
| velo remonts cena | **workshop.html** | — |
| lietoti velosipēdi | **shop.html** | — |
| velo kopšanas līdzekļi | **shop.html** | — |
| piesakīties servisam | **contacts.html** | workshop.html (CTA, nevis mērķis) |
| velo apkope iesācējiem | **blog/apkope** (nākotnē) | index.html |
| ko pārbaudīt lietotos velo | **blog/lietoti** (nākotnē) | shop.html |

### Praktiskie Noteikumi Satura Veidotājiem

```
✅  Katrs raksts/lapa = viens primārais atslēgvārds
✅  Sekundārie atslēgvārdi — semantiski saistīti (sinonīmi, LSI)
✅  Pieminēt galvenā lapas atslēgvārdu citā lapā DRĪKST — bet nekonkurē
❌  Nekad nerakstīt par "velosipēda apkope cenas" blogā (tas ir workshop.html uzdevums)
❌  Nekopēt H1 vai meta description no citas lapas
```

### Cannibalization Monitorings

Reizi mēnesī pārbaudīt Google Search Console:
- Queries → filtrēt pēc galvenajiem atslēgvārdiem
- Pārbaudīt: vai vairākas lapas parādās par vienu atslēgvārdu?
- Ja jā → pievienot canonical, pārskatīt saturu, noindex sekundārajai lapai

---

## 9. Conversion-First Lapas Arhitektūra

### User Journey Mapping

```
AWARENESS          CONSIDERATION        DECISION           ACTION
─────────────────────────────────────────────────────────────────────
Google meklē →     Lasa index.html  →   Atveras workshop   → contacts.html
"veloserviss       Redz: serviss,        Redz: cenas,       Aizpilda formu
 Jelgava"          savākšana, FAQ        atsauksmes, CTA    vai zvana

Google meklē →     Lasa blog rakstu  →  Saite uz shop.html → Pievieno grozam
"lietots velo      "Kā izvēlēties        Skatās kartītes    → Apmaksā
 iegāde"           lietotu velo"
```

### CTA Hierarhija (Svarīguma secībā)

1. **Primārais CTA:** "Piesakies servisam" → contacts.html
2. **Sekundārais CTA:** "Apskatīt servisus un cenas" → workshop.html
3. **Terciārais CTA:** "Apskatīt veikalu" → shop.html
4. **Tālrunis:** `+371 265 33 400` (klikšķināms mobilajā)

### Konversijas Signāli Katrai Lapai

**index.html:**
- [ ] Tālrunis redzams "above the fold" (pirmajā ekrānā)
- [ ] "Tas ir bezmaksas" frāze vizuāli izcelts (savākšana)
- [ ] Atsauksmes bloks (nākotnē)
- [ ] Stats (jau ir — "#1 veloserviss Ozolniekos" u.tml.)

**workshop.html:**
- [ ] Katras cenas rindai pievienot "Piesakīties" pogu vai saiti
- [ ] Cenas formātā "No €X" (drošāk juridiskai pusei)
- [ ] "Šodien brīvi" vai "Nākamā brīvā vieta: [datums]" (ja iespējams)

**shop.html:**
- [ ] "Pievienot grozam" darbojas
- [ ] Velo kartīte rāda "Labi saglabājies" u.c. uzticamības signālus
- [ ] "Brīva piegāde" badge pie velo

**contacts.html:**
- [ ] Forma ĪSA (vārds, e-pasts, servisa veids, ziņa)
- [ ] "Atbildēsim 24h laikā" solījums
- [ ] Automātisks apstiprinājums pēc nosūtīšanas

### Mikrokonversijas (Pirms Galvenās Konversijas)

Iestatīt Google Analytics / Google Tag Manager:
```
Mikrokonversija          Signāls
──────────────────────────────────────────
Tālruņa klikšķis       → telefona numura klikšķis mobilajā
Lapas ritināšana 75%   → lietotājs ir ieinteresēts
FAQ sekcija atvers     → meklē atbildes (siltais klients)
"Pievienot grozam"     → iepirkšanās nodoma signāls
Formas atver           → augsta nolūka signals
```

---

## 10. E-E-A-T Pastiprināšana

E-E-A-T = Experience, Expertise, Authoritativeness, Trustworthiness

Google īpaši vērtē šos signālus pakalpojumu sniedzējiem.

### Experience (Pieredze)
- [ ] **Pirms/pēc foto** gadījuma izpētes (case studies) — "Trek Marlin 5 bremžu remonts"
- [ ] **Video** (pat īss ~30 sek.) ar mehāniķi — augsts E-E-A-T signāls
- [ ] **Darba foto** reālā darbnīcā / pie velosipēda

### Expertise (Ekspertīze)
- [ ] **Mehāniķa bio** lapā "Par mums" — `Person` schema, vārds, pieredze (gadi)
- [ ] **Blog saturs** ar specifiskām tehniskām zināšanām
- [ ] **Certificēšanās** (ja ir) — Shimano, SRAM sertifikāti

### Authoritativeness (Autoritāte)
- [ ] **Google Business Profile** — kritiski svarīgs lokālajam SEO
- [ ] **Ārējās saites** — pieminēšana vietējos portālos (jelgava.lv, ozolnieki.lv)
- [ ] **Atsauksmes** — Google Business, Facebook, Booking.com

### Trustworthiness (Uzticamība)
- [ ] **SSL sertifikāts** — https:// (jāpārbauda)
- [ ] **Privātuma politika** — īpaši svarīga ar Shop/Stripe
- [ ] **Noteikumi un nosacījumi** — obligāti e-komercijā (PVN??)
- [ ] **Reģistrācijas numurs** (ja ir SIA/IU) — footer
- [ ] **Fiziskā adrese** — redzama visās lapās (jau ir)

> ⚠️ **Svarīgi:** E-komercija (shop.html ar Stripe) prasa Privātuma politiku un Lietošanas noteikumus.
> Jāizveido `privacy.html` un `terms.html` lapas pirms veikala aktivizēšanas.

---

## 11. Topical Authority Plāns — 12 Mēneši

**Mērķis:** Kļūt par Google uzticamo avotu tēmā "velosipēda apkope un iegāde Latvijā"

### Topical Klasteru Karte

```
PILLAR PAGE                    CLUSTER CONTENT (Blog raksti)
────────────────────────────────────────────────────────────────────
workshop.html                  ┌─ "Velosipēda apkope pirms sezonas"
"Serviss & Cenas"    ──────────┤─ "Kā pašam regulēt bremzes"
                               ├─ "Velo uzglabāšana ziemā"
                               └─ "Kad mainīt ķēdi — pilnīgs ceļvedis"

shop.html                      ┌─ "Ko pārbaudīt, pērkot lietotu velo"
"Veikals"            ──────────┤─ "Trek vs Giant: kuru izvēlēties"
                               ├─ "Kalnu velo vs pilsētas velo"
                               └─ "Velosipēda izmēru tabula pieaugušajiem"

index.html                     ┌─ "Velo maršruti Jelgavas novadā"
"BergsVelo serviss"  ──────────┤─ "Veloserviss vs DIY: kad iet pie mehāniķa?"
                               └─ "Bērnu pirmais velosipēds — ko pirkt"
```

### 12 Mēnešu Saturs — Publicēšanas Grafiks

> **[CONTENT]:** Katrs raksts jāoptimizē pēc norādītā atslēgvārda. Minimums 800 vārdi.

| Mēnesis | Raksts | Atslēgvārds | Funnel | Saites uz |
|---|---|---|---|---|
| **M1** | Tehniskais SEO ieviešana | — | — | DEV uzdevums |
| **M2** | Google Business Profile iestata | — | — | DEV + īpašnieks |
| **M3** | "Velosipēda apkope pirms pavasara" | velo apkope pavasaris | ToFu | workshop.html |
| **M4** | "Ko pārbaudīt, pērkot lietotu velosipēdu" | lietots velosipēds iegāde | MoFu | shop.html |
| **M5** | "Kalnu velo vs pilsētas velo — kas jums der?" | kalnu velo pilsētas velo | MoFu | shop.html |
| **M6** | "Velosipēda bremžu regulēšana — ceļvedis" | bremžu regulēšana velo | ToFu/MoFu | workshop.html |
| **M7** | "Sezonāla velo apkope — vasaras kontrolsaraksts" | velo apkope vasara | ToFu | workshop.html |
| **M8** | "Trek Marlin: viss, kas jāzina" | Trek Marlin velo | MoFu | shop.html |
| **M9** | "Velo ķēdes maiņa: kā un kad" | velo ķēdes maiņa cena | MoFu | workshop.html |
| **M10** | "Velo uzglabāšana ziemai — 10 padomi" | velo uzglabāšana ziemā | ToFu | workshop.html |
| **M11** | "Pirmais kalnu velo iesācējam — ceļvedis 2026" | kalnu velo iesācājiem | MoFu | shop.html |
| **M12** | Case study: "50 velo apkopoti šogad" | BergsVelo atsauksmes | BoFu | contacts.html |

### Blog Lapas Tehniskā Struktūra **[DEV]**

Nākotnē jāizveido `blog/` mape:
```
blog/
├── index.html              ← Blog saraksts (kategorijas, saites)
├── velo-apkope-pavasaris.html
├── lietots-velosipeds.html
└── ...
```

SEO URL struktūra:
- `bergsvelo.lv/blog/velo-apkope-pavasaris` ← Ideāls (prasa server rewrite)
- `bergsvelo.lv/blog/velo-apkope-pavasaris.html` ← Pieņemami (statiskajam hostingam)

### Satura Kvalitātes Prasības (Helpful Content)

Katrs blog raksts OBLIGĀTI:
1. **Pieredzes moments** — reāls piemērs no BergsVelo darba ("Šonedēļ mums atnesa Trek...")
2. **Konkrēti skaitļi** — "Bremžu regulēšana aizņem 20-30 min un maksā €8"
3. **Foto/video** — vismaz 2 oriģinālfoto (ne stock!)
4. **Autors ar vārdu** — "Rakstīja Aivis Karlsbergs" → Author schema
5. **Publicēšanas datums** — redzams un schema DatePublished
6. **CTA** — "Vajag palīdzību? Piesakies servisam" → contacts.html

---

## 12. Implementācijas Ceļvedis

### SPRINTS — Prioritātes Secība

#### 🔴 SPRINT 1 — Tehniskie pamati (1–2 nedēļas) [DEV]

Bez šī neviens cits darbs nav efektīvs.

- [ ] `robots.txt` → izveidot
- [ ] `sitemap.xml` → izveidot
- [ ] Canonical URL → visās 4 lapās
- [ ] JSON-LD schema → visās 4 lapās (LocalBusiness, FAQPage, BreadcrumbList)
- [ ] Open Graph + Twitter Card → visās 4 lapās
- [ ] Uzlabotās meta descriptions → visās 4 lapās
- [ ] Alt teksti attēliem → visās 4 lapās
- [ ] `<html lang="lv">` → pārbaudīt (jau ir ✅)
- [ ] SSL sertifikāts → pārbaudīt/nodrošināt
- [ ] Privacy policy lapa → obligāta e-komercijā
- [ ] Google Search Console → pievienot domēnu, iesniegt sitemap

#### 🟠 SPRINT 2 — Lokālais SEO (2–4 nedēļas) [DEV + Īpašnieks]

- [ ] **Google Business Profile** → izveidot / optimizēt
  - Nosaukums: "BergsVelo"
  - Kategorija: "Bicycle Repair Shop" + "Bicycle Store"
  - Apraksts: izmantot meta description tekstu
  - Foto: min. 5 foti (darbnīca, van, velo, mehāniķis)
  - Pakalpojumi: bremžu regulēšana, ķēdes maiņa, pilnā apkope
  - NAP: IDENTISKS lapā esošajam
- [ ] Pievienot atsauksmes (nosūtīt saiti klientiem)
- [ ] Reģistrācija latvija.lv / 1188.lv biznesa katalogā
- [ ] Pievienot Facebook lapu (link sameAs schema)

#### 🟡 SPRINT 3 — Saturs (M3 no sākuma) [CONTENT]

- [ ] Pirmais blog raksts → "Velo apkope pirms pavasara"
- [ ] Blog saraksta lapa → `blog/index.html`
- [ ] "Par mums" sadaļas pilnveidošana (mehāniķa bio, foto)
- [ ] Case study sadaļas ielikšana (pēc 5–10 pabeigtu darbiem)

#### 🟢 SPRINT 4 — Monitorings un Optimizācija (Regulāri) [DEV + Īpašnieks]

- [ ] Google Search Console → reizi mēnesī pārbaudīt
- [ ] Core Web Vitals → PageSpeed Insights (mērķis: ≥90)
- [ ] Keyword ranking tracker → SerpRobot.com vai Mangools (LV)
- [ ] Backlink monitorings → Ahrefs Free / Google Search Console

---

## Pielikumi

### A. Meta Description Šabloni

| Lapa | Meta Description (optimizēta) | Garums |
|---|---|---|
| index.html | `BergsVelo — veloserviss Ozolniekos un Jelgavas novadā. Savākšana, remonts un piegāde no jūsu durvīm. Bremzes, pārnesumi, pilnā apkope. Piesakies tagad!` | 153 zīmes |
| workshop.html | `Pilns veloservisa cenu saraksts — BergsVelo Ozolnieki. Bremžu regulēšana, ķēdes maiņa, riteņu centrēšana, pilnā apkope. Savākšana un piegāde bez papildu maksas.` | 158 zīmes |
| shop.html | `Pērc pārbaudītus lietotos velosipēdus un kopšanas līdzekļus — BergsVelo veikals Ozolniekos. Godīgas cenas, rūpīgi pārbaudīta kvalitāte. Bezmaksas piegāde.` | 152 zīmes |
| contacts.html | `Piesakies BergsVelo veloservisam — Ozolnieki, Jelgavas novads. Savākšana un piegāde bez papildu maksas. Atbildam tajā pašā dienā.` | 128 zīmes |

### B. Title Tag Šabloni

```
index.html:    BERGSVELO — Veloserviss Ozolniekos | Savākšana un Piegāde
workshop.html: Serviss & Cenas — Velo Apkope Ozolnieki | BERGSVELO
shop.html:     Lietoti Velosipēdi & Kopšanas Līdzekļi — BERGSVELO Veikals
contacts.html: Piesakies Servisam — BergsVelo Ozolnieki
```

### C. Google Business Profile — Optimizācijas Čecklists

```
✅ Nosaukums: "BergsVelo" (tikai tā — bez pilsētas nosaukuma nosaukumā!)
✅ Kategorija: Bicycle Repair Shop (primārā) + Bicycle Store (sekundārā)
✅ Adrese: Ozolnieki, Jelgavas novads, Latvia
✅ Tālrunis: +371 26533400
✅ Mājaslapa: https://bergsvelo.lv
✅ Darba laiks: Pēc pieraksta (vai norādīt konkrētus laikus)
✅ Apraksts: 750 zīmes — galvenie atslēgvārdi pirmajās 2 teikumos
✅ Foto: min. 10 (logo, cover, interjers, darbs, komanda)
✅ Pakalpojumi: katrs atsevišķi
✅ Jautājumi & atbildes: ierakstīt pašiem!
```

### D. Uzraudzības Instrumenti

| Rīks | Lietošana | Cena |
|---|---|---|
| Google Search Console | Ranking, indeksācija, kļūdas | Bezmaksas |
| Google Analytics 4 | Trafiks, konversijas | Bezmaksas |
| PageSpeed Insights | Core Web Vitals | Bezmaksas |
| Ahrefs Webmaster Tools | Backlinks, keywords | Bezmaksas (ierobežots) |
| schema.org validator | Schema pārbaude | Bezmaksas |
| Rich Results Test | Rich snippet pārbaude | Bezmaksas |
| Mangools (SERPWatcher) | LV keyword tracking | ~€29/mēn |

---

*Plāns sagatavots: 2026-02-20. Jaunākā versija: SEO-STRATEGY.md*
