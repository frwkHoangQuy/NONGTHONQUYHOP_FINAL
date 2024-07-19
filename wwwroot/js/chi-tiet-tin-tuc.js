$(document).ready(function () {
    function getParameterByName(name) {
        const url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    const newsId = getParameterByName('ID');
    var BaseUrl = localStorage.getItem('BaseUrl');

    $.ajax({
        url: `${BaseUrl}/TinTuc/GetById/${newsId}`,
        method: 'GET',
        xhrFields: { withCredentials: true },
        success: function (response) {
            if (response.Success) {
                const news = response.Data;
                if (news) {
                    const detailContent = `
                        <div class="news-detail">
                            <h2>${news.TIEU_DE}</h2>
                            <div class="meta">
                                <span>${new Date(news.NGAY_TAO).toLocaleDateString()}</span>
                                <span>${news.LUOT_XEM}</span>
                            </div>
                            <div class="content">
                                ${news.NOI_DUNG}
                            </div>
                        </div>
                    `;
                    $('.news-detail').html(detailContent);
                } else {
                    $('.news-detail').html('<p>Không tìm thấy bài viết.</p>');
                }
            } else {
                console.error('Error fetching news data', response.Message);
                $('.news-detail').html('<p>Không tìm thấy bài viết.</p>');
            }
        },
        error: function (err) {
            console.error('Error fetching news data', err);
            $('.news-detail').html('<p>Không tìm thấy bài viết.</p>');
        }
    });

    $(document).on('click', '.breadcrumb a', function (event) {
        event.preventDefault();
        const breadcrumbText = $(this).text();
        if (breadcrumbText === 'Tin tức - Sự kiện') {
            window.location.href = '';
        }
    });
});
