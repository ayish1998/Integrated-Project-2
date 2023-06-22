<?php
if(isset( $_POST['fname']))
$fname = $_POST['fname'];
if(isset( $_POST['lname']))
$lname = $_POST['lname'];
if(isset( $_POST['email']))
$email = $_POST['email'];
if(isset( $_POST['tel']))
$tel = $_POST['tel'];
if(isset( $_POST['subject']))
$subject = $_POST['subject'];
if(isset( $_POST['message']))
$message = $_POST['message'];

if ($fname === '') {
    print json_encode(array('message' => 'First Name can not be empty.', 'code' => 0));
    exit();
}
if ($lname === '') {
    print json_encode(array('message' => 'Last Name can not be empty.', 'code' => 0));
    exit();
}
if ($email === '') {
    print json_encode(array('message' => 'Email can not be empty.', 'code' => 0));
    exit();
} else {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        print json_encode(array('message' => 'Email format invalid.', 'code' => 0));
        exit();
    }
}
if ($tel === '') {
    print json_encode(array('message' => 'Telephone can not be empty.', 'code' => 0));
    exit();
}
if ($subject === '') {
    print json_encode(array('message' => 'Subject can not be empty.', 'code' => 0));
    exit();
}
if ($message === '') {
    print json_encode(array('message' => 'message can not be empty.', 'code' => 0));
    exit();
}

$content = "From: $fname $lname \n Email: $email \n Message: $message";
$recipient = "g.adekunle@alustudent.com";
$mailheader = "From $email \r\n";
mail($recipient, $subject, $content, $mailheader) or die("Error!");
print json_encode(array('message' => 'Email sent successfully!', 'code' => 1));
exit();
?>