$(document).ready(function () {
    const BaseUrl = localStorage.getItem("BaseUrl");
    console.log(BaseUrl);

    $('#login-button').on('click', function (event) {
        event.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();

        $.ajax({
            url: '/api/LoginApi/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ Username: username, Password: password, "QuanHuyenID": 9 }),
            success: function (response) {   
                console.log('Login response:', response);
                window.location.href = '/';
            },
            error: function (xhr) {
                console.log('Error response:', xhr);
                alert('Invalid login attempt.');
            }
        });
    });
});
