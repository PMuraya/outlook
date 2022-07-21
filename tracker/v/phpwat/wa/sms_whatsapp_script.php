<?php


$curl = curl_init();
curl_setopt_array($curl, array(
CURLOPT_URL => '<Enter Request URL>',
CURLOPT_RETURNTRANSFER => true,
CURLOPT_ENCODING => '',
CURLOPT_MAXREDIRS => 10,
CURLOPT_TIMEOUT => 0,
CURLOPT_FOLLOWLOCATION => true,
CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
CURLOPT_CUSTOMREQUEST => 'GET',
CURLOPT_POSTFIELDS => '<Enter Credentials and Data Fields',
CURLOPT_HTTPHEADER => array( 'Content-Type: application/x-www-form-urlencoded'
),
));
$response = curl_exec($curl);
curl_close($curl);
echo $response;

// For Help Setting this up, Contact 08132722283

?>
