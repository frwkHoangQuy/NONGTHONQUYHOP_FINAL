$(document).ready(function () {
    const allNews = [];
    let filteredNews = [];
    const itemsPerPage = 12;
    const $newsGrid = $('.news-grid');
    const $paginationContainer = $('#pagination-container');

    function renderNews(items) {
        $newsGrid.empty();
        items.forEach(news => {
            const newsItem = $(`
                <div class="news-item">
                    <img src="${news.HINHANH}" alt="News Image" height="150" width="300">
                    <div class="info">
                        <div class="meta">
                            <span>${new Date(news.NGAY_TAO).toLocaleDateString()}</span>
                            <span>${news.LOAI === 1 ? 'Tin tức' : 'Sự kiện'}</span>
                            <span>${news.LUOT_XEM}</span>
                        </div>
                        <h3>${news.TIEU_DE}</h3>
                        <p>${news.MO_TA}</p>
                    </div>
                </div>
            `);

            newsItem.on('click', function () {
                window.location.href = `Home/ChiTietTinTuc?ID=${news.ID}`;
            });

            $newsGrid.append(newsItem);
        });
    }

    function paginate(items) {
        $paginationContainer.pagination({
            items: items.length,
            itemsOnPage: itemsPerPage,
            onPageClick: function (pageNumber) {
                const start = (pageNumber - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                renderNews(items.slice(start, end));
            }
        });
    }

    $.ajax({
        url: 'https://bandoso.vnptnghean.com.vn:9448/api/v1/TinTuc/GetByPaging?maQuanHuyen=9&pageNumber=1&pageSize=12&tukhoa=&loai=0&sort=1',
        method: 'GET',
        xhrFields: { withCredentials: true },
        success: function (response) {
            if (response.Success) {
                const data = response.Data.DuLieu;
                allNews.push(...data);
                filteredNews = allNews;
                paginate(filteredNews);
                renderNews(filteredNews.slice(0, itemsPerPage));
            } else {
                console.error('Error fetching news data', response.Message);
            }
        },
        error: function (err) {
            console.error('Error fetching news data', err);
        }
    });

    $('.filter-button').on('click', function () {
        $('.filter-button').removeClass('active');
        $(this).addClass('active');

        const filter = $(this).data('filter');
        if (filter === 'all') {
            filteredNews = allNews;
        } else if (filter === 'news') {
            filteredNews = allNews.filter(item => item.LOAI === 1);
        } else if (filter === 'events') {
            filteredNews = allNews.filter(item => item.LOAI !== 1);
        }

        paginate(filteredNews);
        renderNews(filteredNews.slice(0, itemsPerPage));
    });

    $(document).on('click', '.breadcrumb a', function (event) {
        event.preventDefault();
        const breadcrumbText = $(this).text();
        if (breadcrumbText === 'Tin tức - Sự kiện') {
            paginate(filteredNews);
            renderNews(filteredNews.slice(0, itemsPerPage));
            $('.breadcrumb').html(`
                <a href="#">Trang chủ</a> &gt;
                <a href="#">Tin tức - Sự kiện</a>
            `);
        }
    });

    function scrollToTop() {
        $('html, body').animate({ scrollTop: 0 }, 'smooth');
    }

    $(window).on('scroll', function () {
        const nav = $('.nav');
        const content = $('.content');
        const scrollPosition = $(window).scrollTop();
        const changePosition = content.offset().top / 3;

        if (scrollPosition > changePosition) {
            nav.addClass('scrolled');
        } else {
            nav.removeClass('scrolled');
        }
    });

    const navbarItem = [
        { name: "Trang chủ", breadcrumb: "Trang chủ" },
        { name: "Sản phẩm", breadcrumb: "Sản phẩm" },
        { name: "Tin tức", breadcrumb: "Tin tức" },
        { name: "Hình ảnh - Sự kiện", breadcrumb: "Hình ảnh - Sự kiện" },
        { name: "Cơ sở sản xuất", breadcrumb: "Cơ sở sản xuất" },
        { name: "Đăng nhập", breadcrumb: "Đăng nhập" }
    ];

    const navbar = $('.nav ul');
    navbarItem.forEach((item) => {
        const newItem = $('<li><a href="#">' + item.name + '</a></li>');
        newItem.on('click', function () {
            $('.nav ul li a').removeClass('active');
            $(this).find('a').addClass('active');
            $('.breadcrumb').html(
                '<a href="#">Trang chủ</a> &gt; <a href="#">' + item.breadcrumb + '</a>'
            );
        });
        navbar.append(newItem);
    });

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
        if ($(this).scrollTop() > 50) {
            $('.nav').addClass('scrolled');
        } else {
            $('.nav').removeClass('scrolled');
        }
    });
});
