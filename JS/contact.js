function validateForm() {
    var fname = document.getElementById('fname').value;
    if (fname == "") {
        document.querySelector('.status').innerHTML = "Field can not be empty";
        return false;
    }
    var lname = document.getElementById('lname').value;
    if (lname == "") {
        document.querySelector('.status').innerHTML = "Field can not be empty";
        return false;
    }
    var email = document.getElementById('email').value;
    if (email == "") {
        document.querySelector('.status').innerHTML = "Email can not be empty";
        return false;
    } else {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            document.querySelector('.status').innerHTML = "Email format invalid";
            return false;
        }
    }
    var tel = document.getElementById('tel').value;
    if (tel == "") {
        document.querySelector('.status').innerHTML = "Telephone can not be empty";
        return false;
    }
    var subject = document.getElementById('subject').value;
    if (subject == "") {
        document.querySelector('.status').innerHTML = "Subject can not be empty";
        return false;
    }
    var message = document.getElementById('message').value;
    if (message == "") {
        document.querySelector('.status').innerHTML = "Message can not be empty";
        return false;
    }
    document.getElementById('status').innerHTML = "Sending...";
    
    formData = {
        'fname': $('input[name=fname]').val(),
        'lname': $('input[name=lname]').val(),
        'email': $('input[name=email]').val(),
        'tel': $('input[name=tel]').val(),
        'subject': $('input[name=subject]').val(),
        'message': $('input[name=message]').val(),
    };

    $.ajax({
        url: "mail.php",
        type: "POST",
        data: formData,
        success: function (data, textStatus, jqXHR) {

            $('#status').text(data.message);
            if (data.code) //If mail was sent successfully, reset the form.
                $('#contactform').closest('form').find("input[type=text], textarea").val("");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#status').text(jqXHR);
        }
    });
}