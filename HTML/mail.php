
<?php
    require '../PHPMailer-master/src/PHPMailer.php';

// Check for empty fields
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Escape user input to prevent SQL injection or other attacks
    $fname = htmlspecialchars($_POST['fname']);
    $lname = htmlspecialchars($_POST['lname']);
    $email = htmlspecialchars($_POST['email']);
    $tel = htmlspecialchars($_POST['tel']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);

    // Perform your validation checks
    if (empty($fname)) {
        echo json_encode(array('message' => 'First Name can not be empty.', 'code' => 0));
        exit();
    }
    if (empty($lname)) {
        echo json_encode(array('message' => 'Last Name can not be empty.', 'code' => 0));
        exit();
    }
    if (empty($email)) {
        echo json_encode(array('message' => 'Email can not be empty.', 'code' => 0));
        exit();
    }
    if (empty($tel)) {
        echo json_encode(array('message' => 'Telephone can not be empty.', 'code' => 0));
        exit();
    }
    if (empty($subject)) {
        echo json_encode(array('message' => 'Subject can not be empty.', 'code' => 0));
        exit();
    }
    if (empty($message)) {
        echo json_encode(array('message' => 'Message can not be empty.', 'code' => 0));
        exit();
    }

// Now send the email
$content = "From: $fname $lname\nEmail: $email\nMessage: $message";
$recipient = "g.adekunle@alustudent.com";
$mailheader = "From: $email\r\n"; // Fixed the mail header

if (mail($recipient, $subject, $content, $mailheader)) {
    echo json_encode(array('message' => 'Email sent successfully!', 'code' => 1));
    exit();
} else {
    echo json_encode(array('message' => 'Error sending email.', 'code' => 0));
    exit();
}
}
?>