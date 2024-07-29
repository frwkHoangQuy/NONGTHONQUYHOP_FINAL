$(document).ready(function () {
    const BaseUrl = localStorage.getItem('BaseUrl');

    const navbarItems = [
        { name: "Trang chủ", breadcrumb: "Trang chủ" },
        { name: "Sản phẩm", breadcrumb: "Sản phẩm" },
        { name: "Tin tức", breadcrumb: "Tin tức" },
        { name: "Hình ảnh - Sự kiện", breadcrumb: "Hình ảnh - Sự kiện" },
        { name: "Cơ sở sản xuất", breadcrumb: "Cơ sở sản xuất" },
        { name: "Đăng xuất", breadcrumb: "" }
    ];

    const $navbar = $('.nav ul');
    navbarItems.forEach(item => {
        const newItem = $(`<li><a href="#">${item.name}</a></li>`);
        newItem.on('click', function () {
            $('.nav ul li a').removeClass('active');
            $(this).find('a').addClass('active');
            $('.breadcrumb').html(
                `<a href="#">Trang chủ</a> &gt; <a href="#">${item.breadcrumb}</a>`
            );
            if (item.name === "Đăng xuất") {
                logout();
            } else if (item.name === "Cơ sở sản xuất") {
                window.location.href = '/DoanhNghiep';
            } else if (item.name === "Tin tức"){
                window.location.href = "/";
            }
        });
        $navbar.append(newItem);
    });

    function logout() {
        $.ajax({
            url: '/Login/Logout',
            method: 'POST',
            xhrFields: { withCredentials: true },
            success: function () {
                sessionStorage.removeItem('token');
                window.location.href = 'Login/Index';
            },
            error: function (err) {
                console.error('Lỗi khi đăng xuất', err);
            }
        });
    }

    $('#menu-toggle').click(function () {
        $('#slide-menu').toggleClass('active');
    });

    $(document).click(function (event) {
        if (!$(event.target).closest('#menu-toggle, #slide-menu').length) {
            $('#slide-menu').removeClass('active');
        }
    });

    $('#back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });

    $(window).scroll(function () {
        $('.nav').toggleClass('scrolled', $(this).scrollTop() > 50);
    });
});
