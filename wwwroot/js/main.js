$(document).ready(function () {
    // Lấy URL cơ sở từ localStorage
    var BaseUrl = localStorage.getItem('BaseUrl');
    let allNews = [];
    let filteredNews = [];
    const itemsPerPage = 6;
    let pageNumber = 1;
    const $newsGrid = $('.news-grid');
    const $paginationContainer = $('#pagination-container');
    let currentFilter = 'all';

    // Hàm hiển thị danh sách tin tức
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

    // Hàm tạo phân trang
    function paginate(total) {
        $paginationContainer.pagination({
            items: total,
            itemsOnPage: itemsPerPage,
            currentPage: pageNumber,
            onPageClick: function (pageNum, event) {
                event.preventDefault();
                pageNumber = pageNum; // Cập nhật số trang khi người dùng chọn trang cụ thể
                fetchNews(currentFilter); // Gọi API để lấy dữ liệu mới
            }
        });
    }

    // Hiển thị spinner tải
    function showLoadingSpinner() {
        $('#loading-spinner').show();
    }

    // Ẩn spinner tải
    function hideLoadingSpinner() {
        $('#loading-spinner').hide();
    }

    // Hàm lấy tin tức từ API
    function fetchNews(filter) {
        let url = `${BaseUrl}/TinTuc/GetByPaging?maQuanHuyen=9&pageNumber=${pageNumber}&pageSize=${itemsPerPage}&tukhoa=&loai=0&sort=1`;
        if (filter === 'news') {
            url = `${BaseUrl}/TinTuc/GetByPaging?maQuanHuyen=9&pageNumber=${pageNumber}&pageSize=${itemsPerPage}&tukhoa=&loai=1&sort=1`;
        } else if (filter === 'events') {
            url = `${BaseUrl}/TinTuc/GetByPaging?maQuanHuyen=9&pageNumber=${pageNumber}&pageSize=${itemsPerPage}&tukhoa=&loai=2&sort=1`;
        }

        $.ajax({
            url: url,
            method: 'GET',
            xhrFields: { withCredentials: true },
            beforeSend: function () {
                showLoadingSpinner();
            },
            success: function (response) {
                if (response.Success) {
                    const data = response.Data.DuLieu;
                    const tongso = response.Data.TongSo;
                    if (filter === 'all') {
                        allNews = data;
                        filteredNews = allNews;
                    } else {
                        filteredNews = data;
                    }
                    paginate(tongso);
                    renderNews(filteredNews);
                } else {
                    console.error('Lỗi khi lấy dữ liệu tin tức', response.Message);
                }
            },
            error: function (err) {
                console.error('Lỗi khi lấy dữ liệu tin tức', err);
            },
            complete: function () {
                hideLoadingSpinner();
            }
        });
    }

    // Bắt sự kiện khi người dùng chọn bộ lọc
    $('.filter-button').on('click', function () {
        $('.filter-button').removeClass('active');
        $(this).addClass('active');

        currentFilter = $(this).data('filter');
        pageNumber = 1; // Đặt lại trang đầu tiên khi áp dụng bộ lọc
        fetchNews(currentFilter);
    });

    // Bắt sự kiện khi người dùng click vào breadcrumb
    $(document).on('click', '.breadcrumb a', function (event) {
        event.preventDefault();
        const breadcrumbText = $(this).text();
        if (breadcrumbText === 'Tin tức - Sự kiện') {
            currentFilter = 'all';
            pageNumber = 1; // Đặt lại trang đầu tiên
            fetchNews(currentFilter);
            $('.breadcrumb').html(
                `<a href="#">Trang chủ</a> &gt; <a href="#">Tin tức - Sự kiện</a>`
            );
        }
    });

    // Hàm cuộn lên đầu trang
    function scrollToTop() {
        $('html, body').animate({ scrollTop: 0 }, 'smooth');
    }

    // Bắt sự kiện cuộn trang
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

    // Tạo các mục navbar
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
        const newItem = $(`<li><a href="#">${item.name}</a></li>`);
        newItem.on('click', function () {
            $('.nav ul li a').removeClass('active');
            $(this).find('a').addClass('active');
            $('.breadcrumb').html(
                `<a href="#">Trang chủ</a> &gt; <a href="#">${item.breadcrumb}</a>`
            );
        });
        navbar.append(newItem);
    });

    // Bắt sự kiện khi người dùng click vào nút menu
    $('#menu-toggle').click(function () {
        $('#slide-menu').toggleClass('active');
    });

    // Đóng menu khi click ra ngoài
    $(document).click(function (event) {
        if (!$(event.target).closest('#menu-toggle, #slide-menu').length) {
            $('#slide-menu').removeClass('active');
        }
    });

    // Bắt sự kiện khi người dùng click vào nút cuộn lên đầu trang
    $('#back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });

    // Bắt sự kiện cuộn trang để thay đổi trạng thái thanh điều hướng
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('.nav').addClass('scrolled');
        } else {
            $('.nav').removeClass('scrolled');
        }
    });

    // Gọi hàm lấy tin tức khi tải trang
    fetchNews('all');
});
