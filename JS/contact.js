// function validateForm() {
//     var fname = document.getElementById("fname").value;
//     var lname = document.getElementById("lname").value;
//     var email = document.getElementById("email").value;
//     var tel = document.getElementById("tel").value;
//     var subject = document.getElementById("subject").value;
//     var message = document.getElementById("message").value;

//     // Basic form validation, you can add more checks as per your requirements
//     if (fname.trim() === "" || lname.trim() === "" || email.trim() === "" || tel.trim() === "" || subject.trim() === "" || message.trim() === "") {
//       alert("All fields are required!");
//       return false;
//     }

//     // You can add more complex validation for email and telephone number if needed


//      // If form validation passes, submit the form data
//      fetch('mail.php', {
//         method: 'POST',
//         body: new FormData(document.getElementById('contactform')),
//       })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.text(); // Assuming the PHP script returns some response
//       })
//       .then(data => {
//         console.log(data); // Process the response data if needed
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
  
//       return false; // Prevent the default form submission
//     }