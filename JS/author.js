// Show navigation menu when the menu button is clicked
$('#menu-btn').click(function () {
    $('nav .navigation ul').addClass('active');
});

// Hide navigation menu when the close button is clicked
$('#menu-close').click(function () {
    $('nav .navigation ul').removeClass('active');
});

// Prevent default behavior of read-more links and navigate to the specified link on click
document.querySelector('.read-more').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = this.getAttribute('href');
});

// Trigger animations on page load for the "Meet Our Authors" heading and profile cards
$(document).ready(function() {
    $('.meet').addClass('animated');
    $('.expert-box .profile').addClass('animated');
});