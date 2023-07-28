<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  // Get the form data
  $fname = $_POST["fname"];
  $lname = $_POST["lname"];
  $email = $_POST["email"];
  $tel = $_POST["tel"];
  $subject = $_POST["subject"];
  $message = $_POST["message"];

  // You can use the form data to send an email or process it as needed

  // For example, sending an email using PHP's mail function
  $to = "g.adekunle@alustudent.com";
  $headers = "From: $email\r\n";
  $messageBody = "Name: $fname $lname\nEmail: $email\nTelephone: $tel\nSubject: $subject\nMessage: $message";
  mail($to, $subject, $messageBody, $headers);

  // Redirect back to the form after submission
  header("Location: index.html?status=success");
  exit;
}
?>