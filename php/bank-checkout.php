<?php
/**
 * BERGSVELO — Montonio Bankas Maksājums
 *
 * Pieņem JSON pieprasījumu ar grozu un bankas kodu (ASPSP),
 * izveido Montonio JWT token un atgriež redirect URL uz bankas
 * maksājumu lapu.
 *
 * KONFIGURĀCIJA:
 *   1. Aizvieto $montonioAccessKey un $montonioSecretKey
 *      ar saviem Montonio API akreditācijas datiem.
 *      (Montonio konts: https://merchant.montonio.com)
 *
 *   2. Aizvieto $baseUrl ar savu domēnu.
 *
 *   3. Mainiet $sandbox = true uz false ražošanas vidē.
 *
 * MONTONIO REĢISTRĀCIJA:
 *   - https://merchant.montonio.com/register
 *   - Pēc reģistrācijas: Settings → API → iegūst Access Key un Secret Key
 *   - Atbalstītās LV bankas: Swedbank, SEB, Citadele, Luminor
 *
 * BANKAS ASPSP KODI (Latvija):
 *   HABALV22  — Swedbank
 *   UNLALV2X  — SEB
 *   PARXLV22  — Citadele
 *   RIKOLV2X  — Luminor
 *
 * MAKSĀJUMU PLŪSMA:
 *   1. JS sūta POST ar { aspsp, items[] }
 *   2. PHP ģenerē JWT ar pasūtījuma datiem
 *   3. PHP atgriež { url: "https://montonio.com/pay?payment_token=..." }
 *   4. JS pārvirzīs klientu uz Montonio → banka
 *   5. Pēc maksājuma banka atgriež uz $baseUrl/shop.html?success=1
 *
 * DROŠĪBA:
 *   - Montonio Secret Key TIKAI serverī — nekad JS failos vai HTML
 *   - HTTPS obligāts ražošanas vidē
 *   - Cenas validē PHP (klients nevar mainīt summu)
 *   - XSS novēršana: strip_tags() visiem string laukiem
 *
 * TESTĒŠANA:
 *   Sandbox vidē (sandbox = true) izmantojiet Montonio testa banku.
 *   Testbankas credentials: https://docs.montonio.com/
 */

// ── DROŠĪBAS GALVENES ─────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Cache-Control: no-store, no-cache, must-revalidate');

// ── KONFIGURĀCIJA (rediģē php/config.php) ─────────────────────
require_once __DIR__ . '/config.php';
$montonioAccessKey = MONTONIO_ACCESS_KEY;
$montonioSecretKey = MONTONIO_SECRET_KEY;
$baseUrl           = SITE_URL;
$sandbox           = MONTONIO_SANDBOX;

// Atļautie ASPSP kodi Latvijai
$allowedAspsp = ['HABALV22', 'UNLALV2X', 'PARXLV22', 'RIKOLV2X'];
// ─────────────────────────────────────────────────────────────

// Pārbaude vai Montonio ir konfigurēts
if (
    strpos($montonioAccessKey, 'REPLACE_') === 0 ||
    strpos($montonioSecretKey, 'REPLACE_') === 0
) {
    http_response_code(503);
    echo json_encode(['error' => 'Banku maksājums nav konfigurēts. Sazinieties ar veikala administrātoru.']);
    exit;
}

// Pieļauts tikai POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// HTTPS pārbaude ražošanas vidē
if (
    !$sandbox &&
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

if (!$input || empty($input['aspsp']) || empty($input['items']) || !is_array($input['items'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Nav derīga bankas vai preču informācija']);
    exit;
}

// Validē ASPSP kodu
$aspsp = strtoupper(trim((string) $input['aspsp']));
if (!in_array($aspsp, $allowedAspsp, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Nezināma banka']);
    exit;
}

// Preču skaita ierobežojums
if (count($input['items']) > 50) {
    http_response_code(400);
    echo json_encode(['error' => 'Pārāk daudz preču grozā']);
    exit;
}

// Validē preces un aprēķina kopsummu
$total = 0.0;
$lineItems = [];
foreach ($input['items'] as $item) {
    $title = isset($item['title']) ? mb_substr(trim(strip_tags((string) $item['title'])), 0, 250) : 'Prece';
    $price = isset($item['price']) ? floatval($item['price']) : 0;
    $qty   = isset($item['qty'])   ? intval($item['qty'])     : 1;

    if ($price < 0.50 || $price > 9999 || $qty < 1 || $qty > 99) continue;
    if (empty($title)) $title = 'Prece';

    $lineItems[] = [
        'name'       => $title,
        'unitPrice'  => round($price, 2),
        'quantity'   => $qty,
        'finalPrice' => round($price * $qty, 2),
    ];
    $total += $price * $qty;
}

if (empty($lineItems) || $total < 0.50) {
    http_response_code(400);
    echo json_encode(['error' => 'Grozs ir tukšs vai summa nav derīga']);
    exit;
}

$total = round($total, 2);

// Unikāla pasūtījuma atsauce
$merchantReference = 'BV-' . date('Ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));

// Montonio JWT payload
$payload = [
    'access_key'               => $montonioAccessKey,
    'amount'                   => $total,
    'currency'                 => 'EUR',
    'merchant_reference'       => $merchantReference,
    'merchant_name'            => 'BergsVelo',
    'checkout_email'           => '',
    'merchant_return_url'      => $baseUrl . '/shop.html?success=1',
    'merchant_notification_url'=> $baseUrl . '/php/bank-webhook.php',
    'preselected_aspsp'        => $aspsp,
    'preselected_locale'       => 'lv',
    'preselected_country'      => 'LV',
    'exp'                      => time() + 600,  // 10 minūšu derīgums
    'checkout_products'        => $lineItems,
];

// JWT ģenerēšana (HS256, bez Composer)
$jwt = generateMontonioJWT($payload, $montonioSecretKey);

// Montonio maksājuma URL
$payUrl = $sandbox
    ? 'https://sandbox.montonio.com/pay?payment_token=' . urlencode($jwt)
    : 'https://montonio.com/pay?payment_token=' . urlencode($jwt);

echo json_encode(['url' => $payUrl]);

// ── JWT FUNKCIJA ─────────────────────────────────────────────

function generateMontonioJWT(array $payload, string $secret): string
{
    $header  = rtrim(strtr(base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT'])), '+/', '-_'), '=');
    $body    = rtrim(strtr(base64_encode(json_encode($payload)), '+/', '-_'), '=');
    $sig     = rtrim(strtr(base64_encode(hash_hmac('sha256', "$header.$body", $secret, true)), '+/', '-_'), '=');
    return "$header.$body.$sig";
}
