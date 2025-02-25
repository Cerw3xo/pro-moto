<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$mail = new PHPMailer(true);

try {
    // Nastavenie SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.mail.me.com'; // Ak používaš Active24
    $mail->SMTPAuth = true;
    $mail->Username = 'matejcervenka@icloud.com'; // Sem daj svoj reálny email
    $mail->Password = 'daau-jgws-epev-nvbv'; // Sem daj heslo k emailu
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; 
    $mail->Port = 587;

    $mail->CharSet = 'UTF-8'; 
    $mail->Encoding = 'base64';

    $mail->setFrom('matejcervenka@icloud.com', 'MT-Crew Web'); 
    $mail->addAddress('matejcervenka@icloud.com'); 

    $mail->isHTML(true);
    $mail->Subject = 'Nová správa z kontaktného formulára';
    $mail->Body = "
        <h2>Nová správa z formulára</h2>
        <p><strong>Meno:</strong> {$_POST['name']}</p>
        <p><strong>E-mail:</strong> {$_POST['email']}</p>
        <p><strong>Telefón:</strong> {$_POST['phone']}</p>
        <p><strong>Model motorky:</strong> {$_POST['bike_model']}</p>
        <p><strong>Správa:</strong> {$_POST['message']}</p>
    ";

    $mail->send();
    $response['status'] = 'success';
    $response['message'] = 'Správa bola úspešne odoslaná!';
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = 'Chyba pri odosielaní: ' . $mail->ErrorInfo;
}


header('Content-Type: application/json');
echo json_encode($response);
?>