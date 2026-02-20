/**
 * BERGSVELO — Cookie Consent & Privacy Manager
 *
 * VDAR/GDPR atbilstoša piekrišanas pārvaldība.
 *
 * Loģika:
 *  1. Pārbauda localStorage("bergsvelo_consent") pie katras lapas ielādes
 *  2. Ja piekrišana nav dota vai ir beidzies termiņš → rāda banneri
 *  3. Pēc piekrišanas → ielādē atļautos ārējos resursus
 *  4. Piekrišana glabājas 12 mēnešus (pēc tam atkal jāapstiprina)
 *
 * Kategorijas:
 *  necessary   — obligātas (LocalStorage, CSRF) — neatslēdzamas
 *  functional  — funkcionālas (Google Fonts, Ionicons CDN)
 *  analytics   — analītikas (Google Analytics — pagaidām nav aktivizēts)
 *  marketing   — mārketings (Meta Pixel u.c. — pagaidām nav aktivizēts)
 *
 * IEVIEŠANA ĀRĒJOS SKRIPTOS:
 *  Google Analytics: atslēgot komentāru zemāk sadaļā "loadAnalytics()"
 *  Citi skripti: pievienot analogu loadXxx() funkciju
 */

(function () {
  'use strict';

  const STORAGE_KEY   = 'bergsvelo_consent';
  const CONSENT_TTL   = 365 * 24 * 60 * 60 * 1000; // 12 mēneši ms
  const CONSENT_VER   = '1';

  // ── Noklusētais stāvoklis ─────────────────────────────────
  const DEFAULT_CONSENT = {
    v:          CONSENT_VER,
    ts:         null,
    necessary:  true,   // neatslēdzams
    functional: false,
    analytics:  false,
    marketing:  false,
  };

  // ── Ielasīt / saglabāt piekrišanu ────────────────────────
  function loadConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const c = JSON.parse(raw);
      // Pārbauda versiju un termiņu
      if (c.v !== CONSENT_VER) return null;
      if (!c.ts || (Date.now() - c.ts) > CONSENT_TTL) return null;
      return c;
    } catch {
      return null;
    }
  }

  function saveConsent(consent) {
    const record = { ...consent, v: CONSENT_VER, ts: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch { /* storage pilns vai bloķēts */ }
    return record;
  }

  // ── Resursu ielāde pēc piekrišanas ───────────────────────

  function loadFunctional() {
    // Google Fonts — tikai pēc funkcionālās piekrišanas
    if (!document.getElementById('bergsvelo-gfonts')) {
      const link = document.createElement('link');
      link.id   = 'bergsvelo-gfonts';
      link.rel  = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&family=Space+Mono:wght@400;700&display=swap';
      document.head.appendChild(link);
    }
    // Ionicons CDN — ielādēts jau statiskā HTML (ielādē/ignorē pēc piekrišanas)
    // Ja vēlas striktu atbilstību: pārvietot ionicons ielādi arī uz šejieni
  }

  function loadAnalytics() {
    // Google Analytics — AKTIVIZĒT: noņem komentārus zemāk un aizvieto G-XXXXXXXX
    /*
    if (document.getElementById('bergsvelo-ga')) return;
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXX');
    const s = document.createElement('script');
    s.id  = 'bergsvelo-ga';
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX';
    s.async = true;
    document.head.appendChild(s);
    */
  }

  function loadMarketing() {
    // Meta Pixel, Google Ads u.c. — pievienot šeit, ja nepieciešams
  }

  function applyConsent(consent) {
    if (consent.functional) loadFunctional();
    if (consent.analytics)  loadAnalytics();
    if (consent.marketing)  loadMarketing();
  }

  // ── Bannera un modāla HTML ────────────────────────────────

  const BANNER_HTML = `
<div id="cv-banner" class="cv-banner" role="dialog" aria-modal="true" aria-labelledby="cv-banner-title">
  <div class="cv-banner-inner">
    <div class="cv-banner-body">
      <p class="cv-banner-title" id="cv-banner-title">
        <i class="icon ion-md-lock"></i> Sīkdatnes un privātums
      </p>
      <p class="cv-banner-text">
        Mēs izmantojam <strong>obligātās sīkdatnes</strong> lapas darbībai un, ar jūsu piekrišanu,
        <strong>funkcionālās</strong> (Google Fonts, ikonas CDN). Mēs neizmantojam izsekošanas
        vai reklāmas sīkdatnes. Sīkāk: <a href="privacy.html">privātuma politika</a>.
      </p>
    </div>
    <div class="cv-banner-actions">
      <button id="cv-reject" class="cv-btn cv-btn-ghost">Noraidīt visus</button>
      <button id="cv-settings-open" class="cv-btn cv-btn-ghost cv-btn-sm">Pielāgot</button>
      <button id="cv-accept-all" class="cv-btn cv-btn-primary">Pieņemt visus</button>
    </div>
  </div>
</div>`;

  const MODAL_HTML = `
<div id="cv-overlay" class="cv-overlay" aria-hidden="true"></div>
<div id="cv-modal" class="cv-modal" role="dialog" aria-modal="true" aria-labelledby="cv-modal-title">
  <div class="cv-modal-header">
    <h2 class="cv-modal-title" id="cv-modal-title">Sīkdatņu iestatījumi</h2>
    <button id="cv-modal-close" class="cv-modal-close" aria-label="Aizvērt">
      <i class="icon ion-md-close"></i>
    </button>
  </div>
  <div class="cv-modal-body">

    <div class="cv-cat">
      <div class="cv-cat-header">
        <div class="cv-cat-info">
          <span class="cv-cat-name">Obligātās sīkdatnes</span>
          <span class="cv-cat-desc">Nepieciešamas lapas pamatdarbībai: iepirkumu grozs (localStorage), piekrišanas atmiņa. Nevar atslēgt.</span>
        </div>
        <div class="cv-cat-toggle">
          <span class="cv-always-on">Vienmēr aktīvas</span>
        </div>
      </div>
      <details class="cv-cat-details">
        <summary>Detaļas</summary>
        <table class="cv-table">
          <tr><th>Atslēga</th><th>Mērķis</th><th>Termiņš</th></tr>
          <tr><td>bergsvelo_cart</td><td>Iepirkumu grozs (localStorage)</td><td>Sesija / manuāla dzēšana</td></tr>
          <tr><td>bergsvelo_consent</td><td>Piekrišanas iestatījumi</td><td>12 mēneši</td></tr>
        </table>
      </details>
    </div>

    <div class="cv-cat">
      <div class="cv-cat-header">
        <div class="cv-cat-info">
          <span class="cv-cat-name">Funkcionālās</span>
          <span class="cv-cat-desc">Uzlabo lapas izskatu un darbību: Google Fonts (šrifti), Ionicons (ikonas). Ielādē jūsu IP adresi uz Google/Cloudflare serveriem ASV.</span>
        </div>
        <div class="cv-cat-toggle">
          <label class="cv-toggle" aria-label="Iespējot funkcionālās sīkdatnes">
            <input type="checkbox" id="cv-chk-functional" />
            <span class="cv-toggle-slider"></span>
          </label>
        </div>
      </div>
      <details class="cv-cat-details">
        <summary>Detaļas</summary>
        <table class="cv-table">
          <tr><th>Pakalpojums</th><th>Mērķis</th><th>Pārzinis</th></tr>
          <tr><td>Google Fonts</td><td>Šriftu ielāde</td><td>Google LLC (ASV)</td></tr>
          <tr><td>unpkg.com CDN</td><td>Ikonu ielāde</td><td>Cloudflare (ASV)</td></tr>
        </table>
      </details>
    </div>

    <div class="cv-cat">
      <div class="cv-cat-header">
        <div class="cv-cat-info">
          <span class="cv-cat-name">Analītikas</span>
          <span class="cv-cat-desc">Palīdz saprast, kā apmeklētāji izmanto lapu (piem., Google Analytics). Pašlaik nav aktīvs.</span>
        </div>
        <div class="cv-cat-toggle">
          <label class="cv-toggle" aria-label="Iespējot analītikas sīkdatnes">
            <input type="checkbox" id="cv-chk-analytics" />
            <span class="cv-toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>

    <div class="cv-cat">
      <div class="cv-cat-header">
        <div class="cv-cat-info">
          <span class="cv-cat-name">Mārketinga</span>
          <span class="cv-cat-desc">Personalizētu reklāmu rādīšanai (piem., Meta Pixel, Google Ads). Pašlaik nav aktīvs.</span>
        </div>
        <div class="cv-cat-toggle">
          <label class="cv-toggle" aria-label="Iespējot mārketinga sīkdatnes">
            <input type="checkbox" id="cv-chk-marketing" />
            <span class="cv-toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>

  </div>
  <div class="cv-modal-footer">
    <button id="cv-reject-modal" class="cv-btn cv-btn-ghost">Noraidīt visus</button>
    <button id="cv-save" class="cv-btn cv-btn-primary">Saglabāt iestatījumus</button>
  </div>
</div>`;

  // ── DOM inicializācija ────────────────────────────────────

  function init() {
    // Bannera un modāla ievietošana
    const wrap = document.createElement('div');
    wrap.id = 'cv-root';
    wrap.innerHTML = BANNER_HTML + MODAL_HTML;
    document.body.appendChild(wrap);

    const banner   = document.getElementById('cv-banner');
    const modal    = document.getElementById('cv-modal');
    const overlay  = document.getElementById('cv-overlay');

    // ── Palīgfunkcijas ──
    function showBanner()  { banner.classList.add('cv-visible'); }
    function hideBanner()  { banner.classList.remove('cv-visible'); }
    function showModal()   { modal.classList.add('cv-visible'); overlay.classList.add('cv-visible'); document.body.style.overflow = 'hidden'; }
    function hideModal()   { modal.classList.remove('cv-visible'); overlay.classList.remove('cv-visible'); document.body.style.overflow = ''; }

    function syncCheckboxes(consent) {
      document.getElementById('cv-chk-functional').checked = !!consent.functional;
      document.getElementById('cv-chk-analytics').checked  = !!consent.analytics;
      document.getElementById('cv-chk-marketing').checked  = !!consent.marketing;
    }

    function readCheckboxes() {
      return {
        functional: document.getElementById('cv-chk-functional').checked,
        analytics:  document.getElementById('cv-chk-analytics').checked,
        marketing:  document.getElementById('cv-chk-marketing').checked,
      };
    }

    function commit(choices) {
      const consent = saveConsent({ ...DEFAULT_CONSENT, ...choices });
      applyConsent(consent);
      hideBanner();
      hideModal();
    }

    // ── Bannera pogas ──
    document.getElementById('cv-accept-all').addEventListener('click', () => {
      commit({ necessary: true, functional: true, analytics: false, marketing: false });
    });

    document.getElementById('cv-reject').addEventListener('click', () => {
      commit({ necessary: true, functional: false, analytics: false, marketing: false });
    });

    document.getElementById('cv-settings-open').addEventListener('click', () => {
      const c = loadConsent() || DEFAULT_CONSENT;
      syncCheckboxes(c);
      showModal();
    });

    // ── Modāļa pogas ──
    document.getElementById('cv-modal-close').addEventListener('click', hideModal);
    overlay.addEventListener('click', hideModal);

    document.getElementById('cv-reject-modal').addEventListener('click', () => {
      commit({ necessary: true, functional: false, analytics: false, marketing: false });
    });

    document.getElementById('cv-save').addEventListener('click', () => {
      commit({ necessary: true, ...readCheckboxes() });
    });

    // ESC aizver modāli
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('cv-visible')) hideModal();
    });

    // ── "Mainīt iestatījumus" pogas privātuma lapā / footerā ──
    document.querySelectorAll('#open-consent-settings, #open-consent-settings-footer').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = loadConsent() || DEFAULT_CONSENT;
        syncCheckboxes(c);
        showModal();
      });
    });

    // ── Startēšana ──
    const existing = loadConsent();
    if (existing) {
      // Iepriekšēja piekrišana pastāv un nav beigusies
      applyConsent(existing);
      // Banneri nerāda
    } else {
      // Nav piekrišanas vai beidzies termiņš — rāda banneri
      showBanner();
    }
  }

  // Palaist pēc DOM ielādes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Globāla API (ja citas daļas vajadzīgas pieejai)
  window.BergsVeloConsent = {
    open:   () => {
      const modal = document.getElementById('cv-modal');
      if (!modal) return;
      const c = loadConsent() || DEFAULT_CONSENT;
      document.getElementById('cv-chk-functional').checked = !!c.functional;
      document.getElementById('cv-chk-analytics').checked  = !!c.analytics;
      document.getElementById('cv-chk-marketing').checked  = !!c.marketing;
      modal.classList.add('cv-visible');
      document.getElementById('cv-overlay').classList.add('cv-visible');
    },
    get: loadConsent,
  };

})();
