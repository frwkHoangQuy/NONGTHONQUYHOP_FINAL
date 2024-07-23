$(document).ready(function () {
    const BaseUrl = localStorage.getItem("BaseUrl");
    console.log(BaseUrl);

    $('#login-button').on('click', function (event) {
        event.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
        var QuanHuyenID = 9;

        $.ajax({
            url: `${BaseUrl}/User/login`,
            method: 'POST',
            xhrFields: { withCredentials: true },
            contentType: 'application/json',
            data: JSON.stringify({
                username: username,
                password: password,
                QuanHuyenID: QuanHuyenID
            }),
            success: function (response) {
                if (response.Data && response.Data.JWToken) {
                    var token = response.Data.JWToken;
                    sessionStorage.setItem('token', token);
                    alert("Đăng nhập thành công");
                    window.location.href = "/";
                } else {
                    alert("Sai tên đăng nhập hoặc mật khẩu. Vui lòng thử lại.");
                }
            },
            error: function (error) {
                alert("Error during login: " + JSON.stringify(error));
            }
        });
    });
});