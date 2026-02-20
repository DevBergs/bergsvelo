<?php
/**
 * BERGSVELO — Stripe Checkout Session
 *
 * Pieņem JSON pieprasījumu ar iepirkumu grozu,
 * izveido Stripe Checkout sesiju un atgriež redirect URL.
 *
 * KONFIGURĀCIJA:
 *   1. Aizvieto $stripeSecretKey ar savu Stripe Secret Key
 *      (atrodams: https://dashboard.stripe.com/apikeys)
 *   2. Aizvieto $baseUrl ar savu domēnu
 *
 * Stripe darba sākšana:
 *   - Test mode key: sk_test_...
 *   - Live mode key: sk_live_...
 *
 * MAKSĀJUMU METODES:
 *   Stripe Checkout automātiski rāda:
 *   - Visa / Mastercard / Amex (kartes)
 *   - Apple Pay  → automātiski, ja Safari + Apple Wallet konfigurēts
 *   - Google Pay → automātiski, ja Chrome/Android + Google Pay konfigurēts
 *   - SEPA Direct Debit → atspoguļots ja $paymentMethods satur 'sepa_debit'
 *                         (jāiespējo arī: Stripe Dashboard → Settings → Payment Methods)
 *
 * LATVIJAS BANKU INTEGRĀCIJA (Swedbank, SEB, Citadele, Luminor):
 *   Stripe tieši neatbalsta Latvijas banklink protokolus.
 *   Ieteicamās alternatīvas:
 *   a) SEPA Direct Debit — darbojas ar Latvijas banku kontiem
 *   b) Montonio (montonio.com) — Baltic-first gateway, atbalsta LV bankas
 *   c) Kevin.eu — supports Latvian bank redirects
 *   d) Paysera — darbojas Baltijā
 *
 * DROŠĪBA:
 *   - Stripe Secret Key TIKAI serverī — nekad JS failos vai HTML
 *   - HTTPS obligāts (Stripe atteic bez SSL)
 *   - Cenas validē PHP (klients nevar mainīt galīgo summu)
 *   - XSS novēršana: strip_tags() visiem string laukiem
 *   - Ievades ierobežojums: max 50 preces, cena max €9999
 *
 * CSP IETEIKUMS (.htaccess Apache vai Nginx vhost):
 *   Content-Security-Policy:
 *     default-src 'self';
 *     script-src 'self' 'nonce-{RANDOM}' https://js.stripe.com;
 *     frame-src  https://js.stripe.com https://hooks.stripe.com;
 *     connect-src 'self' https://api.stripe.com;
 *     img-src 'self' data: https://*.stripe.com;
 *     style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
 *     font-src 'self' https://fonts.gstatic.com;
 */

// ── DROŠĪBAS GALVENES ─────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Cache-Control: no-store, no-cache, must-revalidate');

// ── KONFIGURĀCIJA ────────────────────────────────────────────
$stripeSecretKey = 'sk_test_REPLACE_WITH_YOUR_STRIPE_SECRET_KEY';
$baseUrl         = 'https://bergsvelo.lv'; // Bez slīpsvītras beigās

/**
 * Aktīvās maksājumu metodes.
 *
 * 'card'       — Visa, Mastercard, Amex.
 *                Apple Pay un Google Pay parādās AUTOMĀTISKI ar 'card'
 *                kad lietotāja ierīce un pārlūks tos atbalsta.
 *                Nav papildu koda nepieciešams.
 *
 * 'sepa_debit' — SEPA Direct Debit (ES banku konti, t.sk. LV).
 *                Jāiespējo Stripe Dashboard → Settings → Payment Methods.
 *                Noņem komentāru zemāk, lai aktivizētu.
 *
 * Piezīme: Latvijas banklink pārskaitījumi (Swedbank, SEB, Citadele, Luminor)
 *          caur Stripe tieši nav atbalstīti. Izmantojiet atsevišķu vārteju
 *          (Montonio, Kevin.eu) vai SEPA opciju.
 */
$paymentMethods = [
    'card',
    // 'sepa_debit',  // ← noņem komentāru, lai aktivizētu SEPA
];
// ─────────────────────────────────────────────────────────────

// Pieļauts tikai POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// HTTPS pārbaude ražošanas vidē
if (
    strpos($stripeSecretKey, 'sk_live_') === 0 &&
    (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off') &&
    (empty($_SERVER['HTTP_X_FORWARDED_PROTO']) || $_SERVER['HTTP_X_FORWARDED_PROTO'] !== 'https')
) {
    http_response_code(403);
    echo json_encode(['error' => 'HTTPS ir obligāts ražošanas vidē']);
    exit;
}

// Nolasa JSON
$raw   = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!$input || empty($input['items']) || !is_array($input['items'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Nav derīgu preču grozā']);
    exit;
}

// Preču skaita ierobežojums (DoS novēršana)
if (count($input['items']) > 50) {
    http_response_code(400);
    echo json_encode(['error' => 'Pārāk daudz preču grozā']);
    exit;
}

// Validē un veido Stripe line_items parametrus
$lineItems = [];
foreach ($input['items'] as $i => $item) {
    // XSS un ievades tīrīšana
    $title = isset($item['title']) ? mb_substr(trim(strip_tags((string) $item['title'])), 0, 250) : 'Prece';
    $price = isset($item['price']) ? floatval($item['price']) : 0;
    $qty   = isset($item['qty'])   ? intval($item['qty'])     : 1;

    // Drošības ierobežojumi: cena 0.50–9999 EUR, daudzums 1–99
    if ($price < 0.50 || $price > 9999 || $qty < 1 || $qty > 99) continue;
    if (empty($title)) $title = 'Prece';

    // Stripe prasa cenu centos (int)
    $lineItems["line_items[{$i}][price_data][currency]"]                 = 'eur';
    $lineItems["line_items[{$i}][price_data][unit_amount]"]              = (int) round($price * 100);
    $lineItems["line_items[{$i}][price_data][product_data][name]"]       = $title;
    $lineItems["line_items[{$i}][quantity]"]                             = $qty;
}

if (empty($lineItems)) {
    http_response_code(400);
    echo json_encode(['error' => 'Grozs ir tukšs vai cenas nav derīgas']);
    exit;
}

// Veido payment_method_types parametru
$pmParams = [];
foreach ($paymentMethods as $idx => $method) {
    $pmParams["payment_method_types[{$idx}]"] = $method;
}

// Checkout Session parametri
$params = array_merge($lineItems, $pmParams, [
    'mode'        => 'payment',
    'success_url' => $baseUrl . '/shop.html?success=1',
    'cancel_url'  => $baseUrl . '/shop.html',
    // Stripe automātiski nosaka valodu no pārlūka Accept-Language
    // 'locale' => 'lv',  // ← atkomentēt, kad Stripe atbalstīs 'lv'
]);

// Stripe API izsaukums ar cURL (bez Composer)
$ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => http_build_query($params),
    CURLOPT_USERPWD        => $stripeSecretKey . ':',
    CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
    CURLOPT_TIMEOUT        => 15,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($curlErr) {
    http_response_code(500);
    echo json_encode(['error' => 'Savienojuma kļūda ar Stripe']);
    error_log('BergsVelo checkout cURL error: ' . $curlErr);
    exit;
}

$data = json_decode($response, true);

if ($httpCode !== 200 || empty($data['url'])) {
    http_response_code(500);
    $stripeMsg = $data['error']['message'] ?? 'Nezināma kļūda';
    echo json_encode(['error' => 'Stripe kļūda: ' . $stripeMsg]);
    error_log('BergsVelo checkout Stripe error [' . $httpCode . ']: ' . $response);
    exit;
}

// Panākums — atgriežam Checkout URL
echo json_encode(['url' => $data['url']]);
