$(document).ready(function () {
    const BaseUrl = localStorage.getItem("BaseUrl");
    console.log(BaseUrl);

    $('#login-button').on('click', function (event) {
        event.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();

        $.ajax({
            url: '/Login/Login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ Username: username, Password: password, "QuanHuyenID": 9 }),
            success: function () {   
                window.location.href = '/Home/Index'; // Chuyển hướng sau khi đăng nhập thành công
            },
            error: function () {
                alert('Invalid login attempt.');
            }
        });
    });
});
