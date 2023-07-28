<?php

if (isset($_POST['submit']) && $_POST['email'] != '') {

    
    $fname = $_POST['firstname'];
    $lname = $_POST['lastname'];
    $email = $_POST['email'];
    $tel = $_POST['tel'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    if(empty($fname) || empty($lname) || empty($email) || empty($tel) || empty($subject) || empty($message)) {
        echo "Please fill all required fields.";
        exit;
    }

    // Validate email format
    if (filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)){
        echo "Invalid email format.";
        exit;
    }

    //connect to database
    $servername = "sql104.epizy.com";
    $username = "epiz_33984159";
    $password = "ZIjrE6T697DPSR";
    $dbname = "epiz_33984159_contactdata";

    $conn = mysqli_connect($servername, $username, $password, $dbname);
    if (!$conn) {
        die("connection failed: ". mysqli_connect_error());
    }

    $sql = "INSERT INTO contact (firstname, lastname, email, telephone, subject, message) VALUES ('$fname', '$lname', '$email', '$tel', '$subject', '$message')";
    if(mysqli_query($conn, $sql)) {
    $mailTo = "g.adekunle@alustudent.com";
    $headers = "From: ".$email;
    $txt = "You have received an email from ".$firstname.".\n\n".$message;

    if(mail($mailTo, $subject, $txt, $headers)) {
        echo "Thank you for contacting us.";
    } else {
        echo "Error: Unable to send email.";
    }
} else {
    echo "Error: Unable to save data to database.";
}

mysqli_close($conn);
}
?>

// if ($_SERVER["REQUEST_METHOD"] === "POST") {
//   // Get the form data
//   $fname = $_POST["fname"];
//   $lname = $_POST["lname"];
//   $email = $_POST["email"];
//   $tel = $_POST["tel"];
//   $subject = $_POST["subject"];
//   $message = $_POST["message"];

//   // You can use the form data to send an email or process it as needed

//   // For example, sending an email using PHP's mail function
//   $to = "g.adekunle@alustudent.com";
//   $headers = "From: $email\r\n";
//   $messageBody = "Name: $fname $lname\nEmail: $email\nTelephone: $tel\nSubject: $subject\nMessage: $message";
//   mail($to, $subject, $messageBody, $headers);

//   // Redirect back to the form after submission
//   header("Location: index.html?status=success");
//   exit;
// }
?>