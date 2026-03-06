<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$d   = json_decode($raw, true);
if (!$d) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Sanitize
function s($v) { return htmlspecialchars(strip_tags(trim((string)$v)), ENT_QUOTES, 'UTF-8'); }

$name     = s($d['name'] ?? '');
$phone    = s($d['phone'] ?? '');
$email    = filter_var(trim($d['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$pickup   = s($d['pickup'] ?? '');
$delivery = s($d['delivery'] ?? $pickup);
$date     = s($d['date'] ?? '');
$time     = s($d['time'] ?? '');
$notes    = s($d['notes'] ?? '');
$subtotal = (float)($d['subtotal'] ?? 0);
$del_fee  = (float)($d['delivery_fee'] ?? 0);
$total    = (float)($d['total'] ?? 0);
$services = is_array($d['services']) ? $d['services'] : [];

if (!$name || !$phone || !$email || !$pickup || !$date || empty($services)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$recipient = 'info@bergsvelo.lv';
$subject   = 'Jauns servisa pieteikums — ' . $name;

// Build HTML email body
$rows = '';
foreach ($services as $svc) {
    $sname = htmlspecialchars(strip_tags($svc['name'] ?? ''), ENT_QUOTES, 'UTF-8');
    $min   = (int)($svc['min'] ?? 0);
    $max   = (int)($svc['max'] ?? $min);
    $price = $min === $max ? "€ $min" : "€ $min–$max";
    $rows .= "<tr><td style='padding:6px 10px;border-bottom:1px solid #eee'>$sname</td>"
           . "<td style='padding:6px 10px;border-bottom:1px solid #eee;text-align:right;font-weight:700;color:#1B4FD8'>$price</td></tr>";
}

$del_text = $del_fee == 0 ? '<span style="color:#16a34a;font-weight:700">BEZMAKSAS</span>' : "€ $del_fee";
$time_str = $time ?: '—';
$notes_block = $notes ? "<p><strong>Piezīmes:</strong><br>$notes</p>" : '';

$html_body = "
<!DOCTYPE html>
<html lang='lv'>
<head><meta charset='UTF-8'></head>
<body style='font-family:Arial,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:20px'>
  <div style='background:#1B4FD8;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0'>
    <h1 style='margin:0;font-size:20px;letter-spacing:.04em'>BERGSVELO — Jauns pieteikums</h1>
    <p style='margin:4px 0 0;opacity:.8;font-size:13px'>bergsvelo.lv</p>
  </div>
  <div style='border:1px solid #e5e5e5;border-top:none;padding:20px 24px;border-radius:0 0 8px 8px'>
    <h2 style='font-size:15px;color:#1B4FD8;margin:0 0 12px'>Klienta informācija</h2>
    <table style='width:100%;border-collapse:collapse;margin-bottom:18px'>
      <tr><td style='padding:5px 0;color:#666;width:140px'>Vārds:</td><td><strong>$name</strong></td></tr>
      <tr><td style='padding:5px 0;color:#666'>Tālrunis:</td><td><strong>$phone</strong></td></tr>
      <tr><td style='padding:5px 0;color:#666'>E-pasts:</td><td><strong>$email</strong></td></tr>
      <tr><td style='padding:5px 0;color:#666'>Savākšanas adrese:</td><td>$pickup</td></tr>
      <tr><td style='padding:5px 0;color:#666'>Piegādes adrese:</td><td>$delivery</td></tr>
      <tr><td style='padding:5px 0;color:#666'>Vēlamais datums:</td><td><strong>$date</strong></td></tr>
      <tr><td style='padding:5px 0;color:#666'>Laiks:</td><td>$time_str</td></tr>
    </table>
    <h2 style='font-size:15px;color:#1B4FD8;margin:0 0 8px'>Izvēlētie pakalpojumi</h2>
    <table style='width:100%;border-collapse:collapse;margin-bottom:12px'>
      <thead>
        <tr style='background:#eef2ff'>
          <th style='padding:8px 10px;text-align:left;font-size:12px;color:#1B4FD8'>Pakalpojums</th>
          <th style='padding:8px 10px;text-align:right;font-size:12px;color:#1B4FD8'>Cena (no)</th>
        </tr>
      </thead>
      <tbody>$rows</tbody>
    </table>
    <table style='width:240px;margin-left:auto;border-collapse:collapse;margin-bottom:18px'>
      <tr><td style='padding:4px 0;color:#666'>Darba izmaksas (no):</td><td style='text-align:right'>€ $subtotal</td></tr>
      <tr><td style='padding:4px 0;color:#666'>Savākšana + piegāde:</td><td style='text-align:right'>$del_text</td></tr>
      <tr style='background:#eef2ff'>
        <td style='padding:8px;font-weight:700'>Kopā (no):</td>
        <td style='padding:8px;text-align:right;font-weight:700;font-size:16px'>€ $total</td>
      </tr>
    </table>
    $notes_block
    <p style='font-size:12px;color:#999;border-top:1px solid #eee;padding-top:12px;margin-top:18px'>
      BergsVelo Veloserviss &bull; bergsvelo.lv &bull; +371 265 33 400<br>
      Ozolnieki, Jelgavas novads, Latvija
    </p>
  </div>
</body>
</html>";

// Email to business owner
$headers_owner  = "MIME-Version: 1.0\r\n";
$headers_owner .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers_owner .= "From: BergsVelo Pieteikumi <noreply@bergsvelo.lv>\r\n";
$headers_owner .= "Reply-To: $email\r\n";

$sent_owner = mail($recipient, $subject, $html_body, $headers_owner);

// Confirmation email to client
$client_subject = 'Jūsu pieteikums saņemts — BergsVelo';
$client_body = "
<!DOCTYPE html>
<html lang='lv'>
<head><meta charset='UTF-8'></head>
<body style='font-family:Arial,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:20px'>
  <div style='background:#1B4FD8;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0'>
    <h1 style='margin:0;font-size:20px'>Paldies, $name!</h1>
    <p style='margin:4px 0 0;opacity:.8;font-size:13px'>Jūsu pieteikums saņemts</p>
  </div>
  <div style='border:1px solid #e5e5e5;border-top:none;padding:20px 24px;border-radius:0 0 8px 8px'>
    <p>Mēs esam saņēmuši Jūsu servisa pieteikumu un sazināsimies ar Jums <strong>1 darba dienas laikā</strong>, lai apstiprinātu savākšanas laiku.</p>
    <p><strong>Jūsu izvēlētie pakalpojumi:</strong> " . count($services) . " pakalpojumi, kopā no € $total</p>
    <p><strong>Vēlamais datums:</strong> $date" . ($time ? ", $time" : '') . "</p>
    <p><strong>Savākšanas adrese:</strong> $pickup</p>
    <p style='color:#666;font-size:13px'>Ja rodas jautājumi, sazinieties: info@bergsvelo.lv vai +371 265 33 400</p>
    <p style='font-size:12px;color:#999;border-top:1px solid #eee;padding-top:12px;margin-top:18px'>
      BergsVelo Veloserviss &bull; bergsvelo.lv &bull; Ozolnieki, Jelgavas novads
    </p>
  </div>
</body>
</html>";

$headers_client  = "MIME-Version: 1.0\r\n";
$headers_client .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers_client .= "From: BergsVelo <info@bergsvelo.lv>\r\n";

mail($email, $client_subject, $client_body, $headers_client);

echo json_encode(['ok' => true, 'sent' => $sent_owner]);
