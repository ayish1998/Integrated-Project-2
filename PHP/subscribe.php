<?php

  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\Exception;

  require '../PHPMailer-master/src/PHPMailer.php';
  require '../PHPMailer-master/src/SMTP.php';
  require '../PHPMailer-master/src/Exception.php';

  if (isset($_POST['subscribe'])) {
    $email = $_POST['email'];

    $mail = new PHPMailer(true);

    try {
      $mail->isSMTP();
      $mail->Host = 'smtp.gmail.com';
      $mail->SMTPAuth = true;
      $mail->Username = 'g.adekunle@alustudent.com';
      $mail->Password = 'uvkaaxakwxhjmgak';
      $mail->SMTPSecure = 'ssl';
      $mail->Port = 465;

      // Set the "From" address and the name of the sender
      $mail->setFrom($_POST['email']);

      // Add the recipient's email address
      $mail->addAddress('g.adekunle@alustudent.com');

      $mail->isHTML(true);

      // Set the email subject
      $mail->Subject = 'New Subscriber';

      // Compose the message body
      $mail->Body .= "Email: " . $email . "\n";

      if ($mail->send()) {
        // Display success message and hide the form
        echo "<script>
        alert('Thank you for subscribing!');
        window.location.href = document.referrer;
          </script>";
        } else {
            echo 'Failed to send the message. Please try again later.';
        }
     
    } catch (Exception $e) {
      echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
  }
  ?>