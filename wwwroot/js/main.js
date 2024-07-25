if (sessionStorage.getItem('token')) {
} else {
    $(document).ready(function () {
        const BaseUrl = localStorage.getItem('BaseUrl');
        let allNews = [];
        let filteredNews = [];
        const itemsPerPage = 12;
        let pageNumber = 1;
        const $newsGrid = $('.news-grid');
        const $paginationContainer = $('#pagination-container');
        let currentFilter = 'all';

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

        function paginate(total) {
            $paginationContainer.pagination({
                items: total,
                itemsOnPage: itemsPerPage,
                currentPage: pageNumber,
                onPageClick: function (pageNum, event) {
                    event.preventDefault();
                    pageNumber = pageNum;
                    fetchNews(currentFilter);
                }
            });
        }

        function toggleLoadingSpinner(show) {
            $('#loading-spinner').toggle(show);
        }

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
                    toggleLoadingSpinner(true);
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
                    toggleLoadingSpinner(false);
                }
            });
        }

        $('.filter-button').on('click', function () {
            $('.filter-button').removeClass('active');
            $(this).addClass('active');
            currentFilter = $(this).data('filter');
            pageNumber = 1;
            fetchNews(currentFilter);
        });

        $(document).on('click', '.breadcrumb a', function (event) {
            event.preventDefault();
            const breadcrumbText = $(this).text();
            if (breadcrumbText === 'Tin tức - Sự kiện') {
                currentFilter = 'all';
                pageNumber = 1;
                fetchNews(currentFilter);
                $('.breadcrumb').html(
                    `<a href="#">Trang chủ</a> &gt; <a href="#">Tin tức - Sự kiện</a>`
                );
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
            nav.toggleClass('scrolled', scrollPosition > changePosition);
        });

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
                }
            });
            $navbar.append(newItem);
        });

        function logout() {
            $.ajax({
                url: `/Login/Logout`,
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

        fetchNews('all');
    });
}
