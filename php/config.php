<?php
/**
 * ═══════════════════════════════════════════════════════════════
 *  PHP CONFIG — Servera puses personalizācija
 *
 *  Visas PHP failu konstantes definētas šeit.
 *  Nomainot klientu, rediģē tikai ŠO failu.
 *
 *  Iekļaut citos PHP failos:
 *    require_once __DIR__ . '/config.php';
 * ═══════════════════════════════════════════════════════════════
 */

/* ─── UZŅĒMUMS ───────────────────────────────────────────────── */
define('SITE_NAME',   'Uzņēmuma Nosaukums');  // ← Aizpildi
define('SITE_LOCALE', 'lv');
define('SITE_COUNTRY','LV');

/* ─── DOMĒNS ─────────────────────────────────────────────────── */
define('SITE_URL',         'https://jusu-lapa.lv');         // ← Aizpildi, bez slīpsvītras beigās
define('SITE_SUCCESS_URL', SITE_URL . '/shop.html?success=1');
define('SITE_CANCEL_URL',  SITE_URL . '/shop.html');
define('SITE_WEBHOOK_URL', SITE_URL . '/php/bank-webhook.php');

/* ─── KONTAKTU E-PASTS (kontaktforma → mail.php) ────────────── */
define('MAIL_RECIPIENT', 'info@jusu-lapa.lv');  // ← Aizpildi
define('MAIL_REDIRECT',  SITE_URL . '/contacts.html');

/* ─── STRIPE (kartes maksājumi) ──────────────────────────────── */
define('STRIPE_SECRET_KEY', 'sk_test_REPLACE_WITH_YOUR_STRIPE_SECRET_KEY'); // ← Nomainīt
// Test key:  sk_test_...
// Live key:  sk_live_...
// Dashboard: https://dashboard.stripe.com/apikeys

/* ─── MONTONIO (Latvijas bankas: Swedbank, SEB, Citadele, Luminor) */
define('MONTONIO_ACCESS_KEY', 'REPLACE_WITH_MONTONIO_ACCESS_KEY'); // ← Nomainīt
define('MONTONIO_SECRET_KEY', 'REPLACE_WITH_MONTONIO_SECRET_KEY'); // ← Nomainīt
define('MONTONIO_SANDBOX',    true);   // false = ražošanas vide
define('MONTONIO_MERCHANT',   SITE_NAME);
// Konta reģistrācija: https://merchant.montonio.com
// Latvijas ASPSP kodi: HABALV22 / UNLALV2X / PARXLV22 / RIKOLV2X
