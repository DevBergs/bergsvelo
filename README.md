# BergsVelo — Bicycle Service & Shop Website

> **Live Demo:** [devbergs.github.io/bergsvelo](https://devbergs.github.io/bergsvelo)
> **Client website:** [bergsvelo.lv](https://bergsvelo.lv)

A fully custom-built website for **BergsVelo** — a bicycle service and second-hand shop based in Ozolnieki, Latvia. Designed and developed from scratch with a dark, modern aesthetic.

---

## Features

### E-Commerce
- Second-hand bicycle listings with photo galleries and specs
- Maintenance products catalog with category filters
- Shopping cart with localStorage persistence (survives page reload)
- Cart badge across all pages
- **Stripe Checkout** — card payments (Visa, Mastercard, Apple Pay, Google Pay)
- **Montonio** — Latvian bank payments (Swedbank, SEB, Citadele, Luminor)

### SEO
- JSON-LD structured data on all pages (LocalBusiness, FAQPage, BreadcrumbList, Service, Store)
- Open Graph + Twitter Card meta tags
- Canonical URLs
- `sitemap.xml` + `robots.txt`
- Semantic HTML5 with proper heading hierarchy
- Performance-optimised images

### GDPR / Privacy
- Cookie consent banner with categories (Necessary / Analytics / Marketing)
- Conditional Google Fonts loading (only after consent)
- Privacy Policy (`privacy.html`) — GDPR Art. 13 compliant
- Terms of Service (`terms.html`)
- All payment icons hosted locally — zero third-party requests on load

### Design
- Dark-first design system (`#0a0a0a` base)
- CSS custom properties for the full design token system
- Scroll reveal animations (IntersectionObserver)
- Grain texture overlay, radial glow effects
- Fully responsive — mobile, tablet, desktop
- Typography: Bebas Neue (display) · Barlow Condensed (body) · Space Mono (mono)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | PHP (no framework, no Composer) |
| Payments | Stripe API (cURL) · Montonio JWT |
| SEO | JSON-LD · Open Graph · sitemap.xml |
| Hosting | Apache / any PHP host |

---

## Pages

| Page | Description |
|---|---|
| `index.html` | Homepage — hero, stats, how it works, about, FAQ, CTA |
| `workshop.html` | Service & pricing — 11 categories incl. E-bike, suspension, diagnostics |
| `contacts.html` | Contact form + info card |
| `shop.html` | Shop — second-hand bikes + maintenance products, cart, checkout |
| `privacy.html` | Privacy Policy (GDPR Art. 13) |
| `terms.html` | Terms of Service |

---

## Project Structure

```
bergsvelo/
├── index.html
├── workshop.html
├── contacts.html
├── shop.html
├── privacy.html
├── terms.html
├── css/
│   └── style.css          # Full design system (~3000 lines)
├── js/
│   ├── app.js             # Nav, scroll reveal, sticky header, form AJAX
│   ├── cart.js            # CartStore — localStorage, badge, drawer
│   └── cookie-consent.js  # GDPR cookie consent manager
├── php/
│   ├── checkout.php       # Stripe Checkout Session (cURL)
│   ├── bank-checkout.php  # Montonio bank payment (JWT)
│   └── mail.php           # Contact form handler
├── images/
│   └── pay/               # Locally-hosted SVG payment icons
├── photos/                # Product photos (01/01_1.jpg, ...)
├── sitemap.xml
├── robots.txt
├── SHOP-GUIDE.md          # Shop activation & payment setup guide
└── SEO-STRATEGY.md        # SEO implementation notes
```

---

## Payment Flow

```
Cart → "Pay by card"              Cart → "Internetbanka"
     ↓                                  ↓
POST /php/checkout.php            POST /php/bank-checkout.php
     ↓                                  ↓
Stripe API (cURL)                 Montonio JWT → redirect URL
     ↓                                  ↓
Stripe Hosted Checkout            Bank login page
     ↓                                  ↓
             shop.html?success=1
             "Thank you" modal + cart cleared
```

---

## Setup

### Stripe (card payments)
```php
// php/checkout.php
$stripeSecretKey = 'sk_live_...';   // Stripe Dashboard → API Keys
$baseUrl         = 'https://your-domain.com';
```

### Montonio (Baltic bank payments)
```php
// php/bank-checkout.php
$montonioAccessKey = 'your_access_key';  // merchant.montonio.com
$montonioSecretKey = 'your_secret_key';
$sandbox           = false;
```

> ⚠️ **Demo note:** The live demo (GitHub Pages) is static-only. PHP endpoints (payments, contact form) do not execute in the demo environment.

---

## Design System

| Token | Value | Usage |
|---|---|---|
| `--clr-accent` | `#1B4FD8` | Primary blue — buttons, links, accents |
| `--clr-dark` | `#0a0a0a` | Main background |
| `--clr-white` | `#f4f2ee` | Chalk white — body text |
| `--clr-concrete` | `#c8c0b0` | Secondary text |
| `--font-display` | Bebas Neue | Headings, hero titles |
| `--font-body` | Barlow Condensed | Body text |
| `--font-mono` | Space Mono | Labels, nav, buttons |

---

## License

MIT © 2026 [DevBergs (Aivis Karlsbergs)](https://github.com/DevBergs)
