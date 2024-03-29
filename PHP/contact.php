<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Us</title>
  <!--Bootstrap CSS-->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
  <!-- FontAwesome -->
  <link rel="stylesheet" href="https://kit.fontawesome.com/9e861a04ca.css" crossorigin="anonymous">
  <script src="https://kit.fontawesome.com/9e861a04ca.js" crossorigin="anonymous"></script>
  <!--External Stylesheet-->
  <link rel="stylesheet" href="../CSS/contact.css">
  <link rel="stylesheet" href="../CSS/utils.css">
  <!--Jquery-->
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>
  <!--navbar starts here-->
  <nav class="navbar navbar-expand-lg navbar-dark bg-success pt-3 px-3 fixed-top">
    <div class="container-fluid">
      <!--Logo and name-->
      <a class="navbar-brand" href="../index.html">
        <img src="../IMAGES/logo.png" alt="logo" width="60" height="60" class="d-inline-block align-text-center" />
        Job<span>Insights</span></a>
      <!--Toggler-->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <!--Nav items-->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" href="../index.html">Home</a>
          </li>
          <!--Data dropdown-->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Data
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="../HTML/job.html">Job</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="../HTML/weather.html">Weather</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="../HTML/financial.html">Financial</a></li>
            </ul>
          </li>
          <!--Tutorials dropdown-->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Tutorials
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="../HTML/jobtutorial.html">Job Tutorial</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="../HTML/weathertutorial.html">Weather Tutorial</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="../HTML/financialtutorial.html">Financial Tutorial</a></li>
            </ul>
          </li>
          <!--Tutotrials dropdown ends here-->
          <li class="nav-item">
            <a class="nav-link" href="../HTML/newsletter.html">Newsletter</a>
          </li>
          <!--About dropdown-->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              About
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="../HTML/website.html">Website</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="../HTML/author.html">Developers</a></li>
            </ul>
          </li>
          <!--About dropdown ends here-->
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="contact.php">Contact Us</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!--navbar ends here-->


  <div class="content">
    <div class="title contact-label text-center">Contact form</div>
    <p class="text-center">We would love to hear from you. Send us an email.</p>
    <div class="form-container">
      <div class="grey rounded-5 my-auto w-50">
        <!--Background color-->
        <div class="green rounded-5 bg-success pt-5 px-4 shadow-4-strong"></div>
        <!--Contact form container-->
        <div id="contact-form" class="container">
          <!--Contact form-->
          <form id="contactform" name="contactform" action="" method="post">
            <div class="row">
              <div class="form-group col-md-6">
                <div class="input-group mb-2">
                  <div class="input-group-prepend">
                    <div class="input-group-text rounded-0 h-100"><i class="fa-solid fa-user"></i></div>
                  </div>
                  <input class="form-control" type="text" name="fname" id="fname" placeholder="First Name" required>
                </div>
              </div>
              <div class="form-group col-md-6">
                <div class="input-group mb-2">
                  <div class="input-group-prepend">
                    <div class="input-group-text rounded-0 h-100"><i class="fa-solid fa-user"></i></div>
                  </div>
                  <input class="form-control" type="text" name="lname" id="lname" placeholder="Last Name" required>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <div class="input-group mb-2">
                  <div class="input-group-prepend">
                    <div class="input-group-text rounded-0 h-100"><i class="fa-solid fa-at"></i></div>
                  </div>
                  <input class="form-control" type="email" name="email" id="email" placeholder="Email" required>
                </div>
              </div>
              <div class="form-group col-md-6">
                <div class="input-group mb-2">
                  <div class="input-group-prepend">
                    <div class="input-group-text rounded-0 h-100"><i class="fa-solid fa-phone"></i></div>
                  </div>
                  <input class="form-control" type="tel" name="tel" id="tel" placeholder="Telephone" required>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="input-group mb-2">
                <div class="input-group-prepend">
                  <div class="input-group-text rounded-0 h-100"><i class="fa-solid fa-hashtag"></i></div>
                </div>
                <input class="form-control" type="text" name="subject" id="subject" placeholder="Subject" required>
              </div>
            </div>
            <div class="form-group">
              <div class="input-group mb-2">
                <div class="input-group-prepend">
                  <div class="input-group-text rounded-0 h-100"><i class="fa-solid fa-comment"></i></div>
                </div>
                <textarea class="form-control" id="message" name="message" placeholder="Message" required></textarea>
              </div>
            </div>
            <div class="pt-4 d-flex justify-content-center">
              <button class="btn btn-secondary btn-outline-light" name="submit" type="submit">Submit</button>
            </div>
          </form>
          <!--Success message-->
          <div id="success-message" class="alert alert-success text-center" style="display: none;">Your message has been sent successfully!</div>
        </div>
        <!--Social media links-->
        <div class="text-center text-white" id="social-text">Connect with us on social media</div>
        <div class="socials text-center" id="social-links">
          <a class="btn btn-secondary btn-outline-light m-1" href="#"><i class="fab fa-facebook-f" style="color: #3b5998;"></i></a>
          <a class="btn btn-secondary btn-outline-light m-1" href="#"><i class="fab fa-google" style="color: #dd4b39;"></i></a>
          <a class="btn btn-secondary btn-outline-light m-1" href="#"><i class="fab fa-instagram" style="color: #ac2bac;"></i></a>
          <a class="btn btn-secondary btn-outline-light m-1" href="#"><i class="fab fa-linkedin-in" style="color: #0082ca;"></i></a>
        </div>
      </div>
    </div>
  </div>

  <div class="spacer"></div>


  <!--Footer-->
  <footer>
    <div class="container-fluid bg-success text-white p-4">
      <div class="row">
        <div class="col-sm-5 col-md-5 col-lg-5 col-xl-5 pe-5">
          <a class="navbar-brand" href="../index.html">
            <img src="../IMAGES/logo.png" alt="logo" width="60" height="60" class="d-inline-block align-text-center" />
            Job<span>Insights</span></a>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum inventore aliquid, accusantium quis iusto
            quam, ad facere odio sunt mollitia asperiores
            eum optio unde, debitis voluptatibus quos cum pariatur fugit?</p>
        </div>
        <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3 pt-3">
          <h5 class="fw-bold">USEFUL LINKS</h5>
          <ul style="list-style-type: square;">
            <li><a href="../index.html">Home</a></li>
            <li><a href="../HTML/job.html">Job Data</a></li>
            <li><a href="../HTML/weather.html">Weather Data</a></li>
            <li><a href="../HTML/financial.html">Financial Data</a></li>
            <li><a href="../HTML/newsletter.html">Newsletter</a></li>
            <li><a href="../HTML/website.html">About Website</a></li>
            <li><a href="../HTML/author.html">About Developers</a></li>
          </ul>
        </div>
        <div class="col-sm-4 col-md-4 col-lg-4 col-xl-4 pt-3">
          <h5 class="fw-bold">CONTACT</h5>
          <p><i class="fa-solid fa-location-dot"></i> African Leadership College, Beau Plan, Pamplemousses,
            Mauritius</p>
          <p><i class="fa-solid fa-envelope"></i> admin@jobinsights.com</p>
          <p><i class="fa-solid fa-phone"></i> +23056789042</p>
        </div>
      </div>
      <div class="row mx-auto d-flex justify-content-center pt-3">
        <div class="col-sm-4 col-md-4 col-lg-4 col-xl-4">
          <p>We are here to make your career decision easier!
            <br>Sign up for our Newsletter.
          </p>
        </div>
        <div class="col-sm-4 col-md-4 col-lg-4 col-xl-4 text-end">
          <form class="d-block" action="subscribe.php" method="post">
            <input class="form-control me-2 mb-2" name="email" type="email" placeholder="Email Address" aria-label="Email">
            <button class="btn btn-secondary btn-outline-light" name="subscribe" type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <hr>
      <!--Social media links-->
      <div class="socials text-center">
        <a class="btn btn-secondary btn-outline-light m-1" href="#"><i class="fab fa-facebook-f" style="color: #3b5998;"></i></a>
        <a class="btn btn-secondary btn-outline-light m-1" href="#"><i class="fab fa-google" style="color: #dd4b39;"></i></a>
        <a class="btn btn-secondary btn-outline-light m-1" href="#"><i class="fab fa-instagram" style="color: #ac2bac;"></i></a>
        <a class="btn btn-secondary btn-outline-light m-1" href="#"><i class="fab fa-linkedin-in" style="color: #0082ca;"></i></a>
      </div>
    </div>
    <div class="text-white text-center p-4" style="background-color: #6c757d;">
      © 2023 Copyright:
      <a class="fw-bold" href="../index.html">Job Insights</a>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>

  <!--Form validation script-->
  <!-- <script src="../JS/contact.js"></script> -->
  <?php

  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\Exception;

  require '../PHPMailer-master/src/PHPMailer.php';
  require '../PHPMailer-master/src/SMTP.php';
  require '../PHPMailer-master/src/Exception.php';

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

  if (isset($_POST['submit'])) {
    $fname = $_POST['fname'];
    $lname = $_POST['lname'];
    $email = $_POST['email'];
    $tel = $_POST['tel'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    $mail = new PHPMailer(true);

    try {
      $mail->isSMTP();
      $mail->Host = 'smtp.gmail.com';
      $mail->SMTPAuth = true;
      $mail->Username = 'g.adekunle@alustudent.com';
      $mail->Password = 'skrzxxwtiliowfkd';
      $mail->SMTPSecure = 'ssl';
      $mail->Port = 465;

      // Set the "From" address and the name of the sender
      $mail->setFrom($_POST['email']);

      // Add the recipient's email address
      $mail->addAddress('g.adekunle@alustudent.com');

      $mail->isHTML(true);

      // Set the email subject
      $mail->Subject = 'Contact Form Submission: ' . $_POST["subject"];

      // Compose the message body
      $mail->Body = "First Name: " . $_POST["fname"] . "\n";
      $mail->Body .= "Last Name: " . $_POST["lname"] . "\n";
      $mail->Body .= "Email: " . $email . "\n";
      $mail->Body .= "Telephone: " . $_POST["tel"] . "\n\n";
      $mail->Body .= "Message:\n" . $_POST["message"];

      // Send the email
      if ($mail->send()) {
        // Display success message and hide the form
        echo '<script>
            document.getElementById("contactform").style.display = "none";
            document.getElementById("success-message").style.display = "block";
          </script>';
      } else {
        echo 'Failed to send the message. Please try again later.';
      }
    } catch (Exception $e) {
      echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
  }
}
  ?>



</body>

</html>