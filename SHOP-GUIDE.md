# BergsVelo — Veikala aktivizācijas instrukcija

> Šis dokuments apraksta, kā aktivizēt produktus veikalā un ieviest drošu apmaksas sistēmu (Stripe + Montonio).
> Atjauniniet šo failu ikreiz, kad veikala loģika tiek mainīta.
>
> **Versija 3** — pievienoti: Montonio banku izvēles UI, bank-checkout.php, teksta banku pogas grozā, ikonu noņemšana no footera.

---

## Satura rādītājs

1. [Failu struktūra](#1-failu-struktūra)
2. [Kā aktivizēt velosipēdus](#2-kā-aktivizēt-velosipēdus)
3. [Kā aktivizēt kopšanas līdzekļus](#3-kā-aktivizēt-kopšanas-līdzekļus)
4. [Velosipēdu foto](#4-velosipēdu-foto)
5. [Stripe — apmaksas iestatīšana](#5-stripe--apmaksas-iestatīšana)
6. [Maksājumu metodes — Apple Pay, Google Pay, SEPA, Latvijas bankas](#6-maksājumu-metodes--apple-pay-google-pay-sepa-latvijas-bankas)
7. [Maksājumu ikonas](#7-maksājumu-ikonas)
8. [Kā notiek naudas pārskaitīšana — plūsmas shēma](#8-kā-notiek-naudas-pārskaitīšana--plūsmas-shēma)
9. [Drošība un CSP](#9-drošība-un-csp)
10. [Testēšana pirms ieslēgšanas](#10-testēšana-pirms-ieslēgšanas)
11. [Bieži uzdotie jautājumi](#11-bieži-uzdotie-jautājumi)

---

## 1. Failu struktūra

```
bergsvelo/
├── shop.html               ← Visi produktu dati (BIKES + PRODUCTS masīvi)
├── js/cart.js              ← Groza loģika, localStorage, nav badge
├── php/checkout.php        ← Stripe kartes apmaksa (Serveris → Stripe)
├── php/bank-checkout.php   ← Montonio banku pārskaitījums (Serveris → Montonio)
└── photos/
    ├── 01/                 ← Velo #01 foto: 01_1.jpg, 01_2.jpg ...
    ├── 02/
    └── ... (01–10)
```

---

## 2. Kā aktivizēt velosipēdus

Visi velo ir definēti `shop.html` iekšā JavaScript masīvā `const BIKES`.

### Rādīt velo veikalā

Sameklē vajadzīgo ierakstu un nomainī `active: false` uz `active: true`:

```javascript
// shop.html, ~259. rindiņa
{
  id: '01', type: 'bike', active: true,  // ← šeit nomaina
  sold: false,
  title: 'Trek Marlin 5', year: 2021,
  category: 'Kalnu velo', condition: 'Lieliska', price: 380,
  description: '...',
  specs: ['21 ātrumi', 'Disku bremzes', '27.5" rati']
},
```

### Atzīmēt kā pārdotu

```javascript
{ id: '01', active: true, sold: true, ... }
```

Uz kartiņas automātiski parādīsies **"PĀRDOTS"** uzraksts, un poga "Pievienot grozam" tiks paslēpta.

### Noslēpt no veikala

```javascript
{ id: '01', active: false, ... }
```

### Lauki — pilns apraksts

| Lauks | Tips | Apraksts |
|---|---|---|
| `id` | `string` | Unikāls ID: `'01'`–`'10'`. Arī foto mapes nosaukums |
| `type` | `'bike'` | Fiksēts — nemainīt |
| `active` | `boolean` | `true` = redzams veikalā |
| `sold` | `boolean` | `true` = "Pārdots" overlay |
| `title` | `string` | Produkta nosaukums |
| `year` | `number` | Ražošanas gads |
| `category` | `string` | Piem. `'Kalnu velo'`, `'Pilsētas velo'`, `'Trekinga velo'` |
| `condition` | `string` | Stāvoklis: `'Teicama'`, `'Lieliska'`, `'Laba'`, `'Vidēja'`, `'Apmierinjoša'` |
| `price` | `number` | Cena EUR (piem. `380`) |
| `description` | `string` | Teksta apraksts |
| `specs` | `string[]` | Specifikācijas masīvs (rādās kā tagi) |

---

## 3. Kā aktivizēt kopšanas līdzekļus

Kopšanas līdzekļi ir masīvā `const PRODUCTS` (tieši aiz `BIKES`). Pēc noklusējuma visi 6 ir `active: true`.

```javascript
{
  id: 'p01', type: 'product', active: true, sold: false,
  category: 'Kopšanas līdzekļi',
  title: 'Ķēdes eļļa (125ml)',
  price: 8.99,
  description: '...',
  specs: ['125ml', 'Universāla', 'PTFE formula'],
  image: null  // ← null = placeholder, vai 'images/produkts.jpg'
},
```

### Pievienot foto kopšanas līdzeklim

```javascript
image: 'images/chain-oil.jpg'  // Ceļš no saknes
```

### Pievienot jaunu produktu

Kopē esošo ierakstu, palielini ID (`p07`, `p08` utt.) un pievieno masīva beigās.

---

## 4. Velosipēdu foto

JS automātiski meklē attēlus — manuāli ceļi nav jānorāda.

### Mapes struktūra

```
photos/
├── 01/
│   ├── 01_1.jpg    ← galvenais foto
│   ├── 01_2.jpg    ← papildus
│   └── 01_3.jpg    ← utt.
├── 02/
│   └── 02_1.jpg
...
```

**Konvencija:** `photos/NN/NN_N.jpg`
- `NN` = velo ID ar nulli (`01`, `02` ... `10`)
- Pēdējais cipars = foto numurs, sākot no `1`

**Atbalstītie formāti:** `.jpg` `.jpeg` `.png` `.webp`

JS izmēģina `01_1.jpg` → `01_2.jpg` → utt. līdz pirmajam neatrastajam. Nav limits, cik daudz foto vienā mapē.

### Ja foto nav

Kartītē automātiski parādīsies pelēks placeholder ar tekstu `Nav foto`.

---

## 6. Maksājumu metodes — Apple Pay, Google Pay, SEPA, Latvijas bankas

### Apple Pay un Google Pay

**Nav jāmaina kods.** Stripe Checkout automātiski rāda Apple Pay un Google Pay, kad:
- Lietotājs izmanto **Safari** + ierīcē konfigurēts **Apple Wallet** → Apple Pay
- Lietotājs izmanto **Chrome/Android** + konfigurēts **Google Pay** → Google Pay

Šīs metodes ir daļa no `card` metodes — tās ir karšu apmaksas saskarnes, nevis atsevišķi maksājumu veidi.

### SEPA Direct Debit (ES banku konti)

Aktivizē SEPA atbalstu divos soļos:

**1. Stripe Dashboard:**
```
Settings → Payment Methods → SEPA Direct Debit → Enable
```

**2. `php/checkout.php`** — noņem komentāru:
```php
$paymentMethods = [
    'card',
    'sepa_debit',  // ← šī rindiņa (noņem // priekšā)
];
```

> Piezīme: SEPA Direct Debit prasa klientam ievadīt IBAN. Pirmais maksājums var kavēties par 1-3 dienām banku apstrādes laiku dēļ.

### Latvijas banku integrācija — Montonio (gatava implementācija)

Groza drawer automātiski rāda **4 banku izvēles pogas** (Swedbank, SEB, Citadele, Luminor).
Tās ir funkcionālas tiklīdz ir iestatīti Montonio akreditācijas dati.

#### Kā aktivizēt Montonio

**1. Reģistrācija:**
```
https://merchant.montonio.com/register
```

**2. API atslēgas:**
```
Montonio Dashboard → Settings → API Keys
→ Nokopē Access Key un Secret Key
```

**3. Ieviest `php/bank-checkout.php`** — nomainī divas rindiņas (~52.–53. rindiņa):

```php
$montonioAccessKey = 'tavs_access_key';   // ← aizvieto
$montonioSecretKey = 'tavs_secret_key';   // ← aizvieto
$sandbox           = false;               // ← false = reāla nauda
```

**4. Domēns:**
```php
$baseUrl = 'https://bergsvelo.lv';  // ← tavs domēns (jau iestatīts)
```

**Sandbox testēšana:**
Atstāj `$sandbox = true` un izmanto Montonio testbanku.
Dokumentācija: https://docs.montonio.com

#### ASPSP kodi (Latvija)

| Banka | Kods |
|---|---|
| Swedbank | `HABALV22` |
| SEB | `UNLALV2X` |
| Citadele | `PARXLV22` |
| Luminor | `RIKOLV2X` |

> Šie SWIFT/ASPSP kodi jau ir iestrādāti groza HTML pogās (`data-bank="..."`) un PHP validācijā.

---

## 7. Maksājumu ikonas

Ikonas glabājas **`images/pay/`** mapē (SVG formātā, lokāli hostētas).

#### Kartes ikonas (footer + grozs)

| Fails | Maksājumu metode | Fons |
|---|---|---|
| `visa.svg` | Visa | Tumšzils `#1A1F71` |
| `mastercard.svg` | Mastercard | Melns + sarkanās/oranžās apļi |
| `apple-pay.svg` | Apple Pay | Melns `#000` |
| `google-pay.svg` | Google Pay | Balts |

**Rādās:** footerā visās lapās + groza "Ar karti" sadaļā.

#### Banku pogas (tikai grozā)

Banku izvēles pogas grozā ir **teksta pogas** ar zīmolu krāsām — ne SVG ikonas:

| Banka | CSS klase | Fona krāsa |
|---|---|---|
| Swedbank | `.bank-btn--swedbank` | `#FF5F00` |
| SEB | `.bank-btn--seb` | `#007B40` |
| Citadele | `.bank-btn--citadele` | `#1B2D6E` |
| Luminor | `.bank-btn--luminor` | `#1A1A1A` |

Banku SVG faili (`images/pay/`) paliek kā avota materāils bet **netiek izmantoti UI** — vajadzīgi gadījumā, ja nākotnē mainīsies dizains.

**GDPR:** Kartes ikonas ir lokālas SVG — **nekādi ārēji pieprasījumi** nenotiek to ielādes laikā.

**Nomainīt vai pievienot ikonu:**
1. Izveido/aizvieto failu `images/pay/` mapē
2. Atjauno `alt` un `title` atribūtu attiecīgajā HTML vietā

---

## 5. Stripe — apmaksas iestatīšana

### 5.1 Reģistrācija un atslēgas iegūšana

1. Reģistrējies vai ienāc: **https://dashboard.stripe.com**
2. Sānjoslā: **Developers → API keys**
3. Nokopē **Secret key**:
   - Testēšanai: `sk_test_...`
   - Ražošanai (reāla nauda): `sk_live_...`

### 5.2 Ieviest atslēgu failā

Atver `php/checkout.php` un nomainī **divas rindiņas**:

```php
// php/checkout.php, ~21.–22. rindiņa
$stripeSecretKey = 'sk_live_...';  // ← aizvieto ar savu Stripe atslēgu
$baseUrl         = 'https://bergsvelo.lv';              // ← tavs domēns
```

> **SVARĪGI:** `$baseUrl` — bez slīpsvītras beigās.
> Pareizi: `'https://bergsvelo.lv'`
> Nepareizi: `'https://bergsvelo.lv/'`

### 5.3 Pārbaude

Pēc `sk_live_` ievietošanas serverī — veic testu ar reālu kartiti ar nelielām summu, lai pārliecinātos ka viss darbojas.

---

## 8. Kā notiek naudas pārskaitīšana — plūsmas shēma

```
┌─────────────────────────────────────────────────────────────────┐
│                       PIRCĒJA PĀRLŪKS                           │
│                                                                 │
│  Grozs → izvēlas maksājuma veidu:                               │
│                                                                 │
│  [Apmaksāt ar karti]          [Swedbank] [SEB] [Cit.] [Lum.]   │
│        │                              │                         │
│        ▼                              ▼                         │
│  JS: doCheckout()           JS: doBankCheckout(aspsp)           │
│  POST /php/checkout.php     POST /php/bank-checkout.php         │
└────────┬──────────────────────────────┬─────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────────┐    ┌────────────────────────────────────┐
│  checkout.php        │    │  bank-checkout.php                 │
│                     │    │                                    │
│  Validē preces      │    │  Validē preces + ASPSP kods        │
│  Stripe API (cURL)  │    │  Ģenerē JWT ar pasūtījumu          │
│  → { url: Stripe }  │    │  → { url: Montonio }               │
└────────┬────────────┘    └──────────────┬─────────────────────┘
         │                               │
         ▼                               ▼
┌─────────────────────┐    ┌─────────────────────────────────┐
│  STRIPE             │    │  MONTONIO                       │
│  Hosted Checkout    │    │  → pārvirza uz banku            │
│  Visa/MC/ApplePay   │    │  SWEDBANK / SEB / CITADELE /    │
│  Google Pay         │    │  LUMINOR drošā apmaksa          │
└────────┬────────────┘    └──────────────┬──────────────────┘
         │                               │
         └───────────────┬───────────────┘
                         ▼
              shop.html?success=1
              JS: showSuccessModal()
              JS: CartStore.clear()
              Rādās "Paldies!" modal
```

### Ko dara katra komponente

| Komponente | Atbildība |
|---|---|
| `shop.html` (JS) | Veido grozu, sūta POST uz PHP, pāradresē uz Stripe URL |
| `php/checkout.php` | **Vienīgā vieta ar Stripe atslēgu**. Validē cenas, izveido sesiju |
| Stripe serveri | Apstrādā karti, nodrošina PCI atbilstību, sūta naudu |
| `shop.html?success=1` | Rāda pateicību, notīra grozu |

### Kāpēc Stripe atslēga ir PHP un ne JS?

Ja `sk_live_...` būtu `shop.html` JS kodā — ikviens apmeklētājs to varētu nolasīt no pārlūka. PHP fails tiek izpildīts serverī — klients redz tikai atbildi `{ url: "..." }`, nevis atslēgu.

---

## 9. Drošība un CSP

### Esošie aizsardzības mehānismi

| Mehānisms | Kur | Apraksts |
|---|---|---|
| Secret key serverī | `php/checkout.php` | Klients atslēgu nekad neredz |
| Ievades validācija | `php/checkout.php:44–56` | `strip_tags()`, `floatval()`, `intval()`, cena > 0 |
| HTTPS obligāts | Stripe prasība | Stripe atsakās strādāt bez SSL |
| `SSL_VERIFYPEER => true` | `php/checkout.php:80` | cURL pārbauda Stripe SSL sertifikātu |
| Cenas tikai serverī | `php/checkout.php:52` | Cenas pārveido PHP — JS nevar manipulēt ar galīgo summu |
| POST only | `php/checkout.php:26` | GET pieprasījumi atteikti |

### Ieteikumi pirms ražošanas

- [ ] Ievietot `php/checkout.php` `.htaccess` aizsardzību pret tiešu pārlūkošanu (ja serveris ir Apache)
- [ ] Ieslēgt Stripe Webhook apstiprinājumu pasūtījumu apstiprināšanai (sk. [Stripe Webhook docs](https://stripe.com/docs/webhooks))
- [ ] `$baseUrl` nomainīt uz reālo domēnu pirms `sk_live_...` atslēgas ievietošanas
- [ ] Pārliecināties ka serverim ir aktīvs SSL sertifikāts (Let's Encrypt vai cits)
- [ ] Pievienot `.htaccess` vai vhost Content-Security-Policy galveni (sk. zemāk)

### Content-Security-Policy (CSP)

Pievienojiet `.htaccess` (Apache) vai `nginx.conf`:

```apache
# .htaccess
<IfModule mod_headers.c>
  Header set Content-Security-Policy "\
    default-src 'self'; \
    script-src 'self' https://js.stripe.com; \
    frame-src https://js.stripe.com https://hooks.stripe.com; \
    connect-src 'self' https://api.stripe.com; \
    img-src 'self' data: https://*.stripe.com; \
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; \
    font-src 'self' https://fonts.gstatic.com; \
    object-src 'none'; \
    base-uri 'self';"
</IfModule>
```

> **Piezīme:** `fonts.googleapis.com` un `fonts.gstatic.com` jāpievieno tikai tad, kad Google Fonts ir funkcionāli iespējotas (pēc lietotāja piekrišanas). Ja fonts tiek ielādēts pirms piekrišanas — CSP var bloķēt ielādi, kas ir vēlams uzvedums.

---

## 10. Testēšana pirms ieslēgšanas

### Stripe test mode

1. Izmanto `sk_test_...` atslēgu `php/checkout.php`
2. Stripe testēšanas kartes:
   - **Veiksmīga apmaksa:** `4242 4242 4242 4242`, derīgums: jebkurš nākotnes datums, CVC: jebkurš
   - **Noraidīta karte:** `4000 0000 0000 0002`
   - **3D Secure:** `4000 0025 0000 3155`
3. Pilns testu karšu saraksts: **https://stripe.com/docs/testing**

### Pārbaudīt darbību

- [ ] Produkts redzams veikalā (`active: true`)
- [ ] Foto ielādējas (vai parādās placeholder)
- [ ] "Pievienot grozam" darbojas, badge pieaug
- [ ] Grozs saglabājas pēc lapas pārlādēšanas
- [ ] "Apmaksāt" → pāradresē uz Stripe hosted lapu
- [ ] Testa karte → atgriežas uz `shop.html?success=1`
- [ ] "Paldies!" modal parādās, grozs tukšs

---

## 11. Bieži uzdotie jautājumi

**Velo ir aktīvs, bet neredzams veikalā?**
Pārbaudi, vai fails ir saglabāts. Nospied `Ctrl+F5` pārlūkā (izdzēst cache).

**"Apmaksāt" poga ir pelēka (disabled)?**
Grozs ir tukšs. Pievienojiet vismaz vienu produktu.

**Stripe atgriež kļūdu "No such API key"?**
Atslēga `php/checkout.php` nav derīga vai satur papildu atstarpes. Kopē tieši no Stripe dashboard.

**Nauda netiek saņemta Stripe kontā?**
Test mode (`sk_test_...`) nauda ir virtuāla — tā nepārskaita reālu naudu. Jāizmanto `sk_live_...`.

**Kā pievienot jaunu velo (ID 11)?**
Pievieno `photos/11/` mapi ar foto, un `BIKES` masīvā jaunu ierakstu ar `id: '11'`. Pārliecinies arī ka mapes nosaukums ir `11` (bez nulles priekšā, ja ID ir `'11'`).

> Foto meklēšanas loģika: ID `'11'` → mapes ceļš `photos/11/11_1.jpg`.
> ID `'01'` → `photos/01/01_1.jpg`. Nulles formates pēc ID vērtības.
