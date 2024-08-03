$(document).ready(function () {
  const BaseUrl = localStorage.getItem('BaseUrl');
  console.log(BaseUrl)
  let allData = [];
  let filteredData = [];
  const itemsPerPage = 8;
  let pageNumber = 1;
  const $dataGrid = $('.data-grid');
  const $paginationContainer = $('#pagination-container');
  let searchKeyword = '';

  function renderData(items) {
    $dataGrid.empty();
    items.forEach(item => {
      const dataItem = $(`
              <div class="data-item">
                  <div class="img">
                    <img src="${item.DUONG_DAN}" alt="Image" height="150" width="300">
                  </div>
                  <div class="info">
                      <h3>${item.TENDN}</h3>
                      <p>Đại diện: ${item.NGUOIDAIDIEN || 'Không có thông tin'}</p>
                      <div class="info-wrap">
                        <p>Địa chỉ: ${item.DIACHI}</p>
                        <p>Điện thoại: ${item.DIENTHOAI || 'Không có thông tin'}</p>
                        <p>Email: ${item.EMAIL || 'Không có thông tin'}</p>
                      </div>
                  </div>
              </div>
          `);
      $dataGrid.append(dataItem);
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
        fetchData(searchKeyword);
      }
    });
  }

  function toggleLoadingSpinner(show) {
    $('#loading-spinner').toggle(show);
  }

  function fetchData(keyword) {
    let url = `${BaseUrl}/DoanhNghiep/GetByPaging?idQuanHuyen=9&pageNumber=${pageNumber}&pageSize=${itemsPerPage}&tukhoa=${keyword}&loai=0`;
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
          const totalItems = response.Data.TongSo;
          allData = data;
          filteredData = allData;
          paginate(totalItems);
          renderData(filteredData);
        } else {
          console.error('Lỗi khi lấy dữ liệu', response.Message);
        }
      },
      error: function (err) {
        console.error('Lỗi khi lấy dữ liệu', err);
      },
      complete: function () {
        toggleLoadingSpinner(false);
      }
    });
  }

  $('#search-button').on('click', function () {
    searchKeyword = $('#search-input').val();
    pageNumber = 1;
    fetchData(searchKeyword);
  });

  fetchData('');
});
