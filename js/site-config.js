/**
 * ═══════════════════════════════════════════════════════════════
 *  SITE CONFIG — Vienots personalizācijas fails
 *
 *  Lai pielāgotu lapu jaunam klientam, maini tikai ŠO failu.
 *  Visi [data-cfg] elementi tiks aizpildīti automātiski.
 *
 *  SADAĻAS:
 *   1. business    → Uzņēmuma nosaukums, logo, tagline
 *   2. contact     → Tālrunis, e-pasts
 *   3. legal       → Reģ. nr., PVN, banka, IBAN, uzņēmuma tips
 *   4. location    → Pilsēta, rajons, valsts, ģeolokācija
 *   5. hours       → Darba laiks, savākšanas slots
 *   6. prices      → Visu pakalpojumu cenas (€)
 *   7. delivery    → Min. pasūtījums, bezmaksas piegāde
 *   8. domain      → URL, success/cancel lapas, webhook
 *   9. seo         → Meta title + description katrai lapai
 *  10. colors      → CSS krāsu tokeni
 * ═══════════════════════════════════════════════════════════════
 */

const SITE = {

  /* ─── 1. UZŅĒMUMS ────────────────────────────────────────── */
  business: {
    name:          'TavsVelo',           // Pamata nosaukums (parasts)
    name_spaced:   'Tavs Velo',          // Ar atstarpi (piem. hero titulā)
    name_upper:    'TAVSVELO',           // Visi lielie (meta title)
    logo_part1:    'TAVS',               // Logo 1. daļa (tumšā krāsa)
    logo_part2:    'VELO',               // Logo 2. daļa (akcents)
    tagline:       'Velosipēdu apkope un remonts',
    description:   'Velosipēdu apkopes un remonta serviss',
    type:          'Veloserviss',
    founded:       2024,
    founder:       'Vārds Uzvārds',
    founder_title: 'Velosipēdu mehāniķis',
    price_range:   '€€',                // JSON-LD priceRange
  },

  /* ─── 2. KONTAKTI ────────────────────────────────────────── */
  contact: {
    phone:          '+371XXXXXXXX',      // tel: href formāts (bez atstarpēm)
    phone_display:  '+371 XXX XX XX',    // Rādāmais formāts
    email:          'info@jusu-lapa.lv',
  },

  /* ─── 3. JURIDISKIE REKVIZĪTI ────────────────────────────── */
  legal: {
    company_name:    'TavsVelo',
    company_type:    'Individuālais uzņēmums', // SIA / IU / pašnodarbinātais
    reg_nr:          'XXXXXXXXX',        // ← Aizpildi
    vat_nr:          '',                 // PVN nr. (tukšs = nav PVN maksātājs)
    bank:            'Banka',            // ← Aizpildi
    iban:            'LVXX XXXX XXXX XXXX XXXX X', // ← Aizpildi
    address_legal:   'Pilsēta, Novads, Latvija',
    privacy_contact: 'info@jusu-lapa.lv',
    gdpr_date:       '2025-01-01',       // Privātuma politikas spēkā stāšanās
    mail_recipient:  'info@jusu-lapa.lv', // Kontaktformas saņēmējs (mail.php)
  },

  /* ─── 4. ATRAŠANĀS VIETA ─────────────────────────────────── */
  location: {
    city:         'Pilsēta',
    region:       'Pilsētas novads',
    country:      'Latvija',
    country_code: 'LV',
    locale:       'lv_LV',              // OG locale
    service_area: 'Pilsēta, Novads',
    geo: {
      latitude:  0.000,                 // ← Aizpildi
      longitude: 0.000,                 // ← Aizpildi
    },
  },

  /* ─── 5. DARBA LAIKS ─────────────────────────────────────── */
  hours: {
    display:      '8:00 – 18:00',
    note:         'Pēc iepriekšēja pieraksta',
    pickup_from:  '09:00',           // Savākšanas grafika sākums
    pickup_to:    '17:00',           // Savākšanas grafika beigas
    pickup_step:  30,                // Minūtes starp slotiem
  },

  /* ─── 6. PAKALPOJUMU CENAS (EUR) ─────────────────────────── */
  prices: {
    diagnostics: {
      full:    12,   // Pilnā diagnostika
      express: 25,   // Express apkope
      wash:    15,   // Mazgāšana
      hourly:  35,   // Stundu likme (€ X / h)
    },
    v_brakes: {
      adjust:  8,    // Regulēšana
      pads:    7,    // Kluču maiņa
      cable:   8,    // Troses maiņa
      replace: 12,   // Bremžu maiņa
      grips:   8,    // Rokturu maiņa
    },
    disc_brakes: {
      adjust:     10,  // Regulēšana
      bleed:      30,  // Hidraulisko atgaisošana
      pads:        8,  // Kluču maiņa
      clean:      12,  // Kluču tīrīšana
      rotor_true:  5,  // Rotora taisnošana
      rotor_swap: 12,  // Rotora maiņa
      full_kit:   35,  // Komplekta maiņa
    },
    wheels: {
      tube:   8,   // Kameras maiņa
      true:   15,  // Centrēšana
      spoke:   8,  // Spieķa maiņa
      rim:    25,  // Aploces maiņa
      build:  40,  // Riteņa salikšana
      hub:    30,  // Rumbas maiņa
    },
    gears: {
      adjust:     8,   // Regulēšana
      cable:      8,   // Troses maiņa
      derailleur: 20,  // Maiņrīka maiņa
      shifter:    18,  // Roktura maiņa
      hanger:     10,  // Austiņas taisnošana
    },
    drivetrain: {
      chain_clean:  8,   // Ķēdes mazgāšana
      chain_swap:   10,  // Ķēdes maiņa
      cassette:     12,  // Kasetes maiņa
      pedals:        8,  // Pedāļu maiņa
      bb:           20,  // Centra maiņa
      bb_rethread:  20,  // Vītnes atjaunošana
      crank_pull:   10,  // Klaņa noņemšana
      pedal_thread: 25,  // Pedāļa vītnes atjaunošana
    },
    steering: {
      headset:  20,  // Gultņu maiņa
      stem:     15,  // Stūres maiņa
      stem_swap: 10, // Iznesuma maiņa
      grips:     7,  // Rokturu uzstādīšana
      bar_ends:  7,  // Ragu uzstādīšana
      bar_tape: 25,  // Lentas uztīšana
      fork:     25,  // Dakšas maiņa
    },
    suspension: {
      adjust:     15,  // Regulēšana
      lube:       25,  // Eļļošana
      lowers:     30,  // Žokļu nomaiņa
      rear_shock: 40,  // Aizmugures amortizatora apkope
      fork_swap:  25,  // Dakšas maiņa
    },
    ebike: {
      diag:     25,  // Diagnostika
      battery:  20,  // Akumulatora diagnostika
      software: 30,  // Programmatūra
      motor:    30,  // Motora apkope
      full:     65,  // Pilnā apkope
    },
    accessories: {
      saddle:      8,   // Sēdekļa maiņa
      computer:   10,   // Velodators
      rack:       15,   // Bagāžnieks
      fender:     15,   // Dubļu sargs
      light:      25,   // Lukturis
      child_seat: 12,   // Bērnu krēsliņš
      stabilizers: 8,   // Palīgritenīši
    },
    full_service: {
      single_speed: 30,  // Ar vienu ātrumu
      v_brake:      40,  // Ar V-bremzēm
      disc:         50,  // Ar disku bremzēm
      carbon:       65,  // Oglekļa rāmis
      ebike:        65,  // E-velo
    },
  },

  /* ─── 7. PIEGĀDE ─────────────────────────────────────────── */
  delivery: {
    min_order: 20,   // Minimālais pasūtījums (EUR)
    free_from: 20,   // Bezmaksas piegāde no (EUR)
  },

  /* ─── 8. DOMĒNS + URL (izmanto PHP failos un SEO) ────────── */
  domain: {
    url:         'https://jusu-lapa.lv',              // ← Aizpildi
    success_url: 'https://jusu-lapa.lv/shop.html?success=1',
    cancel_url:  'https://jusu-lapa.lv/shop.html',
    webhook_url: 'https://jusu-lapa.lv/php/bank-webhook.php',
  },

  /* ─── 9. SEO ──────────────────────────────────────────────── */
  seo: {
    index: {
      title:       'TAVSVELO — Veloserviss Pilsētā | Savākšana un Piegāde',
      description: 'TavsVelo — veloserviss Pilsētā. Savākšana, remonts un piegāde no jūsu durvīm. Bremzes, pārnesumi, pilnā apkope.',
      keywords:    'veloserviss Pilsēta, velosipēda apkope, remonts, mobilais veloserviss',
    },
    workshop: {
      title:       'Serviss & Cenas — Velo Apkope Pilsētā | TAVSVELO',
      description: 'Pilns veloservisa cenu saraksts. Bremžu regulēšana, ķēdes maiņa, riteņu centrēšana, pilnā apkope.',
      keywords:    'velo apkope cenas, bremžu regulēšana, ķēdes maiņa, riteņu centrēšana',
    },
    contacts: {
      title:       'Kontakti — Veloserviss Pilsētā',
      description: 'Kontakti — telefons, e-pasts, adrese un rekvizīti. Veloserviss Pilsētā.',
      keywords:    'veloserviss kontakti, adrese, rekvizīti',
    },
    shop: {
      title:       'Lietoti Velosipēdi & Kopšanas Līdzekļi — Veikals',
      description: 'Pērc pārbaudītus lietotos velosipēdus un kopšanas līdzekļus. Godīgas cenas, pārbaudīta kvalitāte.',
      keywords:    'lietoti velosipēdi, velo kopšanas līdzekļi, veikals',
    },
    privacy: {
      title:       'Privātuma politika — TAVSVELO',
      description: 'Privātuma politika — kā mēs apstrādājam jūsu personas datus saskaņā ar VDAR.',
    },
    terms: {
      title:       'Lietošanas Noteikumi — TAVSVELO',
      description: 'Lietošanas noteikumi — veikala pirkumu nosacījumi, pakalpojumu kārtība.',
    },
  },

  /* ─── 10. KRĀSAS (CSS custom properties) ─────────────────── */
  colors: {
    primary: '#0F1E3C',  // Galvenā krāsa
    accent:  '#1B4FD8',  // Akcents
    bg:      '#FFFFFF',  // Fons
    surface: '#F4F6FA',  // Sekundārais fons
  },

};

/* ═══════════════════════════════════════════════════════════════
   AUTO-INJEKTORS
   Aizpilda visus [data-cfg], [data-cfg-price], [data-cfg-href]
   elementus ar iepriekš definētajām vērtībām.

   Piemēri HTML:
     <span data-cfg="business.name">BergsVelo</span>
     <span data-cfg-price="prices.diagnostics.full">€ 12</span>
     <span data-cfg-price="prices.diagnostics.hourly" data-cfg-suffix="/ h">€ 35 / h</span>
     <a data-cfg-href="contact.phone" href="tel:+37126533400">...</a>
   ═══════════════════════════════════════════════════════════════ */
(function () {
  function resolve(path) {
    return path.split('.').reduce(function (o, k) {
      return o != null ? o[k] : undefined;
    }, SITE);
  }

  document.addEventListener('DOMContentLoaded', function () {

    /* Teksta elementi */
    document.querySelectorAll('[data-cfg]').forEach(function (el) {
      var val = resolve(el.dataset.cfg);
      if (val !== undefined && val !== null && val !== '') {
        el.textContent = val;
      }
    });

    /* Cenu elementi → "€ X" vai "€ X / h" */
    document.querySelectorAll('[data-cfg-price]').forEach(function (el) {
      var val = resolve(el.dataset.cfgPrice);
      var suffix = el.dataset.cfgSuffix ? ' ' + el.dataset.cfgSuffix : '';
      if (val !== undefined && val !== null) {
        el.textContent = '€ ' + val + suffix;
      }
    });

    /* href atribūti (tel:, mailto:) */
    document.querySelectorAll('[data-cfg-href]').forEach(function (el) {
      var val = resolve(el.dataset.cfgHref);
      if (val) {
        if (el.dataset.cfgHref.indexOf('contact.phone') !== -1) {
          el.href = 'tel:' + val;
        } else if (el.dataset.cfgHref.indexOf('contact.email') !== -1) {
          el.href = 'mailto:' + val;
        } else {
          el.href = val;
        }
      }
    });

    /* CSS krāsas → :root custom properties */
    if (SITE.colors) {
      var root = document.documentElement;
      if (SITE.colors.primary) root.style.setProperty('--clr-primary', SITE.colors.primary);
      if (SITE.colors.accent)  root.style.setProperty('--clr-accent',  SITE.colors.accent);
      if (SITE.colors.bg)      root.style.setProperty('--clr-white',   SITE.colors.bg);
      if (SITE.colors.surface) root.style.setProperty('--clr-surface', SITE.colors.surface);
    }

  });
})();
