/* ============================================================
   BergsVelo — Service Order
   Checkboxes → CTA bar → Full modal form → PDF print
   ============================================================ */
(function () {
  'use strict';

  var DELIVERY_FEE   = 10;   // EUR if subtotal < FREE_THRESHOLD
  var FREE_THRESHOLD = 20;   // EUR, free pickup+delivery above this

  var selected = []; // [{ id, name, min, max }]

  /* ─── Boot ─────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    injectCheckboxes();
    setDateMin();
    bindEvents();
    updateCtaBar();
  });

  /* ─── Inject checkbox icons into every selectable row ──── */
  function injectCheckboxes() {
    document.querySelectorAll('.pricing-row').forEach(function (row) {
      var priceEl = row.querySelector('.pricing-item-price');
      if (!priceEl) return;
      if (priceEl.textContent.trim().indexOf('/') !== -1) return; // skip hourly

      row.classList.add('selectable');
      var cb = document.createElement('span');
      cb.className = 'svc-cb';
      cb.setAttribute('aria-hidden', 'true');
      cb.innerHTML = '<i class="icon ion-md-square-outline"></i>';
      row.insertBefore(cb, row.firstChild);
      row.addEventListener('click', function () { toggleRow(row); });
    });
  }

  /* ─── Parse "€ 15–40" or "€ 15" → { min, max } ────────── */
  function parsePrice(text) {
    var m = text.replace(/\s/g, '').match(/(\d+)[^\d]?(\d+)?/);
    if (!m) return null;
    return { min: +m[1], max: +(m[2] || m[1]) };
  }

  /* ─── Toggle a pricing row ──────────────────────────────── */
  function toggleRow(row) {
    var nameEl  = row.querySelector('.pricing-item-name');
    var priceEl = row.querySelector('.pricing-item-price');
    var price   = parsePrice(priceEl.textContent);
    if (!price) return;

    var id  = nameEl.textContent.trim();
    var idx = selected.findIndex(function (s) { return s.id === id; });

    if (idx >= 0) {
      selected.splice(idx, 1);
      row.classList.remove('selected');
      row.querySelector('.svc-cb').innerHTML = '<i class="icon ion-md-square-outline"></i>';
    } else {
      selected.push({ id: id, name: id, min: price.min, max: price.max });
      row.classList.add('selected');
      row.querySelector('.svc-cb').innerHTML = '<i class="icon ion-md-checkbox"></i>';
    }

    updateCtaBar();
    updateStickyBar();
  }

  /* ─── Calculations ──────────────────────────────────────── */
  function getSubtotal() {
    return selected.reduce(function (s, i) { return s + i.min; }, 0);
  }
  function getDelivery(sub) {
    return sub >= FREE_THRESHOLD ? 0 : DELIVERY_FEE;
  }

  /* ─── CTA bar below pricing table ───────────────────────── */
  function updateCtaBar() {
    var n    = selected.length;
    var btn  = document.getElementById('svc-cta-btn');
    var text = document.getElementById('svc-cta-text');
    var icon = document.querySelector('.svc-cta-icon');
    var bar  = document.getElementById('svc-cta-bar');

    if (n === 0) {
      text.textContent = 'Atzīmējiet pakalpojumus augstāk un noformējiet pieteikumu';
      btn.disabled = true;
      if (icon) icon.className = 'icon ion-md-checkbox-outline svc-cta-icon';
      if (bar)  bar.classList.remove('svc-cta-bar--active');
    } else {
      var label = n === 1 ? 'pakalpojums' : 'pakalpojumi';
      text.textContent = n + ' ' + label + ' pievienoti \u2014 no \u20ac\u00a0' + getSubtotal();
      btn.disabled = false;
      if (icon) icon.className = 'icon ion-md-checkbox svc-cta-icon svc-cta-icon--active';
      if (bar)  bar.classList.add('svc-cta-bar--active');
    }
  }

  /* ─── Sticky bottom bar ─────────────────────────────────── */
  function updateStickyBar() {
    var bar = document.getElementById('svc-order-bar');
    var n   = selected.length;
    if (n === 0) {
      bar.classList.remove('svc-bar-visible');
      return;
    }
    var label = n === 1 ? 'pakalpojums' : 'pakalpojumi';
    document.getElementById('sob-summary').textContent =
      n + ' ' + label + ' \u2014 no \u20ac\u00a0' + getSubtotal();
    if (!bar.classList.contains('svc-bar-visible')) {
      bar.classList.add('svc-bar-visible');
      bar.classList.add('svc-bar-attention');
      setTimeout(function () { bar.classList.remove('svc-bar-attention'); }, 700);
    }
  }

  /* ─── Events ────────────────────────────────────────────── */
  function bindEvents() {
    document.getElementById('svc-cta-btn').addEventListener('click', openModal);
    document.getElementById('sob-open-btn').addEventListener('click', openModal);
    document.getElementById('svc-modal-close').addEventListener('click', closeModal);
    document.getElementById('svc-overlay').addEventListener('click', closeModal);
    document.getElementById('svc-same-addr').addEventListener('change', toggleDeliveryField);
    document.getElementById('svc-pdf-btn').addEventListener('click', handlePdf);
    document.getElementById('svc-submit-btn').addEventListener('click', handleSubmit);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* ─── Modal open / close ────────────────────────────────── */
  function openModal() {
    renderModalServices();
    renderDeliveryNote();
    document.getElementById('svc-modal').classList.add('open');
    document.getElementById('svc-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    document.getElementById('svc-modal').classList.remove('open');
    document.getElementById('svc-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ─── Render services list inside modal ─────────────────── */
  function renderModalServices() {
    var el = document.getElementById('svc-form-services');
    el.innerHTML = selected.map(function (s) {
      var p = s.min === s.max
        ? '\u20ac\u00a0' + s.min
        : '\u20ac\u00a0' + s.min + '\u2013' + s.max;
      return '<div class="svc-modal-service-row">'
        + '<span class="svc-modal-svc-name">' + escHtml(s.name) + '</span>'
        + '<span class="svc-modal-svc-price">' + p + '</span>'
        + '</div>';
    }).join('');

    var sub = getSubtotal();
    var del = getDelivery(sub);
    var tot = sub + del;

    var delText = del === 0
      ? '<span class="svc-free">BEZMAKSAS</span>'
      : '\u20ac\u00a0' + del;

    document.getElementById('svc-form-totals').innerHTML =
      '<div class="svc-totals-row"><span>Darba izmaksas (no)</span><span>\u20ac\u00a0' + sub + '</span></div>'
      + '<div class="svc-totals-row"><span>Savāk\u0161ana + piegāde</span><span>' + delText + '</span></div>'
      + '<div class="svc-totals-row svc-totals-total"><span>Kop\u0101 (no)</span><span>\u20ac\u00a0' + tot + '</span></div>';

    document.getElementById('svc-modal-total-val').textContent = '\u20ac\u00a0' + tot;
  }

  /* ─── Delivery address toggle ───────────────────────────── */
  function toggleDeliveryField() {
    var same  = document.getElementById('svc-same-addr').checked;
    var field = document.getElementById('svc-delivery-field');
    field.hidden = same;
    if (same) document.getElementById('svc-delivery').value = '';
  }

  /* ─── Delivery fee note ─────────────────────────────────── */
  function renderDeliveryNote() {
    var sub  = getSubtotal();
    var del  = getDelivery(sub);
    var note = document.getElementById('svc-delivery-note-text');
    if (del === 0) {
      note.innerHTML = 'Savāk\u0161ana + piegāde: <strong class="svc-free">BEZMAKSAS</strong> (kopā virs \u20ac\u00a020)';
    } else {
      note.innerHTML = 'Savāk\u0161ana + piegāde: <strong>\u20ac\u00a0' + del + '</strong>. Bezmaksas, ja kopā \u2265 \u20ac\u00a020.';
    }
  }

  /* ─── Date: min = tomorrow ──────────────────────────────── */
  function setDateMin() {
    var d = new Date();
    d.setDate(d.getDate() + 1);
    document.getElementById('svc-date').min = d.toISOString().split('T')[0];
  }

  /* ─── Validation ────────────────────────────────────────── */
  function validate() {
    var name   = document.getElementById('svc-name').value.trim();
    var phone  = document.getElementById('svc-phone').value.trim();
    var email  = document.getElementById('svc-email').value.trim();
    var pickup = document.getElementById('svc-pickup').value.trim();
    var date   = document.getElementById('svc-date').value;

    if (!name)   { flashError('svc-name',   'Lūdzu ievadiet vārdu un uzvārdu!');   return false; }
    if (!phone)  { flashError('svc-phone',  'Lūdzu ievadiet tālruņa numuru!');     return false; }
    if (!email)  { flashError('svc-email',  'Lūdzu ievadiet e-pasta adresi!');     return false; }
    if (email.indexOf('@') < 1) { flashError('svc-email', 'Nepareizs e-pasta formāts!'); return false; }
    if (!pickup) { flashError('svc-pickup', 'Lūdzu ievadiet savākšanas adresi!');  return false; }
    if (!date)   { flashError('svc-date',   'Lūdzu izvēlieties datumu!');           return false; }
    return true;
  }

  function flashError(fieldId, msg) {
    var el = document.getElementById(fieldId);
    el.classList.add('svc-input-error');
    el.focus();
    el.addEventListener('input', function () { el.classList.remove('svc-input-error'); }, { once: true });
    alert(msg);
  }

  /* ─── PDF only ──────────────────────────────────────────── */
  function handlePdf() {
    if (selected.length === 0) { alert('Nav izvēlētu pakalpojumu!'); return; }
    if (!validate()) return;
    generatePrint();
  }

  /* ─── Submit → send order via AJAX, then generate PDF ───── */
  function handleSubmit() {
    if (selected.length === 0) { alert('Nav izvēlētu pakalpojumu!'); return; }
    if (!validate()) return;

    var btn = document.getElementById('svc-submit-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="icon ion-md-hourglass"></i> Sūta\u2026';

    var name     = document.getElementById('svc-name').value.trim();
    var phone    = document.getElementById('svc-phone').value.trim();
    var email    = document.getElementById('svc-email').value.trim();
    var pickup   = document.getElementById('svc-pickup').value.trim();
    var sameAddr = document.getElementById('svc-same-addr').checked;
    var delivery = sameAddr ? pickup : document.getElementById('svc-delivery').value.trim();
    var dateVal  = document.getElementById('svc-date').value;
    var timeVal  = document.getElementById('svc-time').value;
    var notes    = document.getElementById('svc-notes').value.trim();
    var sub      = getSubtotal();
    var del      = getDelivery(sub);

    var payload = {
      name: name, phone: phone, email: email,
      pickup: pickup, delivery: delivery,
      date: dateVal, time: timeVal, notes: notes,
      subtotal: sub, delivery_fee: del, total: sub + del,
      services: selected
    };

    fetch('./php/order.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function () {
      generatePrint();
      closeModal();
      showOrderSuccess();
    })
    .catch(function () {
      // Fallback: open PDF even if email fails
      generatePrint();
      closeModal();
      showOrderSuccess(true);
    })
    .finally(function () {
      btn.disabled = false;
      btn.innerHTML = '<i class="icon ion-md-send"></i> Nos\u016bt\u012bt pieteikumu';
    });
  }

  /* ─── Success message after submit ──────────────────────── */
  function showOrderSuccess(emailFailed) {
    var el = document.createElement('div');
    el.className = 'svc-success-toast';
    el.innerHTML = emailFailed
      ? '<i class="icon ion-md-checkmark-circle"></i> PDF ģenerēts! E-pasts netika nosūtīts — lūdzu sazinies tieši.'
      : '<i class="icon ion-md-checkmark-circle"></i> Pieteikums nosūtīts! Pārbaudiet e-pastu, tāpat arī PDF.';
    document.body.appendChild(el);
    setTimeout(function () { el.classList.add('visible'); }, 50);
    setTimeout(function () {
      el.classList.remove('visible');
      setTimeout(function () { el.remove(); }, 400);
    }, 5000);
  }

  function generatePrint() {
    var name     = document.getElementById('svc-name').value.trim();
    var phone    = document.getElementById('svc-phone').value.trim();
    var email    = document.getElementById('svc-email').value.trim();
    var pickup   = document.getElementById('svc-pickup').value.trim();
    var sameAddr = document.getElementById('svc-same-addr').checked;
    var delivery = sameAddr ? pickup : document.getElementById('svc-delivery').value.trim();
    var dateVal  = document.getElementById('svc-date').value;
    var timeVal  = document.getElementById('svc-time').value;
    var notes    = document.getElementById('svc-notes').value.trim();

    var sub = getSubtotal();
    var del = getDelivery(sub);
    var tot = sub + del;

    var today = new Date().toLocaleDateString('lv-LV');
    var d = new Date(dateVal + 'T12:00:00');
    var prefDate = d.toLocaleDateString('lv-LV', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    prefDate = prefDate.charAt(0).toUpperCase() + prefDate.slice(1);

    var rows = selected.map(function (s) {
      var p = s.min === s.max
        ? '&euro;&nbsp;' + s.min
        : '&euro;&nbsp;' + s.min + '&ndash;' + s.max;
      return '<tr><td>' + escHtml(s.name) + '</td><td class="price">' + p + '</td></tr>';
    }).join('');

    var delHTML = del === 0
      ? '<span class="free">BEZMAKSAS</span>'
      : '&euro;&nbsp;' + del;

    var css = [
      '*{box-sizing:border-box;margin:0;padding:0}',
      'body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;padding:18mm}',
      '.hdr{background:#1B4FD8;color:#fff;padding:12mm 18mm;margin:-18mm -18mm 14mm;',
        'display:flex;justify-content:space-between;align-items:flex-start;',
        '-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.logo{font-size:22pt;font-weight:700;letter-spacing:.06em}',
      '.logo em{opacity:.6;font-style:normal;font-weight:400}',
      '.sub{font-size:8.5pt;opacity:.75;margin-top:1.5mm}',
      '.cinfo{text-align:right;font-size:8.5pt;opacity:.9;line-height:1.8}',
      'h1{font-size:17pt;color:#1B4FD8;margin-bottom:1mm;font-weight:700}',
      '.meta{font-size:8pt;color:#999;margin-bottom:8mm}',
      'h2{font-size:10pt;color:#1B4FD8;text-transform:uppercase;',
        'letter-spacing:.06em;margin:8mm 0 3mm;border-bottom:1px solid #e5e5e5;padding-bottom:2mm}',
      'table{width:100%;border-collapse:collapse;margin-bottom:5mm}',
      'thead tr{background:#eef2ff;-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      'thead th{padding:3mm 4mm;text-align:left;font-size:9pt;font-weight:700;',
        'color:#1B4FD8;border-bottom:2px solid #1B4FD8}',
      'thead th.price{text-align:right}',
      'tbody tr:nth-child(even){background:#f8f8f8;-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      'tbody td{padding:2.5mm 4mm;font-size:10pt;border-bottom:1px solid #eee}',
      'td.price{text-align:right;font-weight:700;color:#1B4FD8;white-space:nowrap}',
      '.smry{margin-left:auto;width:70mm;margin-bottom:6mm}',
      '.sr{display:flex;justify-content:space-between;padding:2.5mm 0;',
        'font-size:9.5pt;color:#666;border-bottom:1px solid #eee}',
      '.sr.tot{font-size:12pt;font-weight:700;color:#111;',
        'background:#eef2ff;padding:3.5mm 4mm;border-radius:4px;margin-top:2mm;',
        '-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.free{color:#16a34a;font-weight:700}',
      '.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-bottom:6mm}',
      '.box{background:#f9f9f9;border:1px solid #e5e5e5;border-radius:6px;padding:4mm 5mm;',
        '-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.box h3{font-size:7.5pt;text-transform:uppercase;letter-spacing:.06em;',
        'color:#999;margin-bottom:1.5mm}',
      '.box p{font-size:9.5pt;font-weight:600;color:#111;line-height:1.6}',
      '.box p.light{font-weight:400;color:#555}',
      '.note{background:#fffbeb;border:1px solid #fcd34d;border-radius:6px;',
        'padding:4mm 5mm;font-size:8pt;color:#777;line-height:1.7;margin-bottom:7mm;',
        '-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.ftr{border-top:1px solid #e5e5e5;padding-top:3.5mm;',
        'font-size:7.5pt;color:#aaa;text-align:center;line-height:1.8}',
      '@media print{@page{margin:12mm}body{padding:0}}'
    ].join('');

    var notesBlock = notes
      ? '<h2>Papildu piezīmes</h2>'
        + '<div class="box"><p class="light">' + escHtml(notes) + '</p></div>'
      : '';

    var deliveryAddr = delivery !== pickup
      ? escHtml(delivery)
      : escHtml(pickup) + ' <span style="color:#999;font-weight:400">(tā pati)</span>';

    var html = '<!DOCTYPE html><html lang="lv"><head>'
      + '<meta charset="UTF-8">'
      + '<title>BergsVelo &mdash; Servisa pieteikums</title>'
      + '<style>' + css + '</style></head><body>'
      + '<div class="hdr">'
      + '<div><div class="logo">BERGS<em>VELO</em></div>'
      + '<div class="sub">Veloserviss Ozolnieki</div></div>'
      + '<div class="cinfo">bergsvelo.lv<br>+371 265 33 400<br>info@bergsvelo.lv</div>'
      + '</div>'
      + '<h1>Servisa pieteikums</h1>'
      + '<div class="meta">Sagatavots: ' + today + '</div>'

      // Contact + address grid
      + '<div class="info-grid">'
      + '<div class="box"><h3>Klients</h3><p>' + escHtml(name) + '</p>'
      + '<p class="light">' + escHtml(phone) + (email ? '<br>' + escHtml(email) : '') + '</p></div>'
      + '<div class="box"><h3>Savāk&scaron;anas adrese</h3><p class="light">' + escHtml(pickup) + '</p></div>'
      + '<div class="box"><h3>V&emacr;lamais datums un laiks</h3>'
      + '<p>' + prefDate + (timeVal ? '<br>' + timeVal : '') + '</p></div>'
      + '<div class="box"><h3>Piegādes adrese</h3><p class="light">' + deliveryAddr + '</p></div>'
      + '</div>'

      // Services table
      + '<h2>Izvēlētie pakalpojumi</h2>'
      + '<table><thead><tr><th>Pakalpojums</th><th class="price">Cena (no)</th></tr></thead>'
      + '<tbody>' + rows + '</tbody></table>'

      + '<div class="smry">'
      + '<div class="sr"><span>Darba izmaksas (no)</span><span>&euro;&nbsp;' + sub + '</span></div>'
      + '<div class="sr"><span>Savāk&scaron;ana + piegāde</span><span>' + delHTML + '</span></div>'
      + '<div class="sr tot"><span>Kop&amacr; (no)</span><span>&euro;&nbsp;' + tot + '</span></div>'
      + '</div>'

      + notesBlock

      + '<div class="note"><strong>Piezīme:</strong> Cenas norādītas par darbu un ir indikatīvas &mdash; '
      + 'detaļas tiek pieskaitītas papildus. Savāk&scaron;ana + piegāde ir <strong>BEZMAKSAS</strong> '
      + 'pie pasūtījuma summas &ge;&nbsp;&euro;&nbsp;20. '
      + 'Prec&imacr;zu savāk&scaron;anas laiku apstiprin&amacr;sim 1 darba dienas laikā.</div>'

      + '<div class="ftr">BergsVelo Veloserviss &bull; bergsvelo.lv &bull; +371 265 33 400 &bull; info@bergsvelo.lv<br>'
      + 'Ozolnieki, Jelgavas novads, Latvija</div>'
      + '<script>window.onload=function(){window.print();}<\/script>'
      + '</body></html>';

    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    var url  = URL.createObjectURL(blob);
    var w    = window.open(url, '_blank', 'width=840,height=960');
    if (!w) {
      URL.revokeObjectURL(url);
      alert('L\u016bdzu at\u013caujiet uznirsto\u0161o logu \u0161ai vietnei, lai \u0123ener\u0113tu PDF!');
      return;
    }
    setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
  }

  /* ─── Helpers ───────────────────────────────────────────── */
  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
