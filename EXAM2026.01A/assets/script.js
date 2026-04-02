let employees = [...initialData];

const tableBody = document.getElementById("tableBody");
const modal = document.getElementById("modalOverlay");
const employeeForm = document.getElementById("employeeForm");

let editingId = null;

// ============================================================================
// PHẦN 2: HÀM HIỂN THỊ DỮ LIỆU (RENDER)
// ============================================================================

/**
 * renderTable() - Vẽ lại bảng dữ liệu từ mảng employees
 *
 * @param {Array} dataArray - Mảng dữ liệu (mặc định là employees)
 *
 * Quy trình:
 * 1. Xóa dữ liệu cũ (innerHTML = "")
 * 2. Duyệt qua từng phần tử dùng forEach
 * 3. Tạo HTML từng hàng (dùng template literal - dấu ` `)
 * 4. Gắn tất cả vào tableBody
 *
 */
function renderTable(dataArray = employees) {
  // Xóa toàn bộ hàng cũ trong bảng
  tableBody.innerHTML = "";

  // Biến HTML tạm thời (string)
  let content = "";

  // Duyệt qua từng nhân viên
  dataArray.forEach((item, index) => {
    // Template literal (dấu backtick) cho phép nhúng biến dễ dàng
    content += `
      <tr>      
        <td>${item.conference}</td>  
        <td>${item.speakers}</td>                       
        <td>${item.email}</td>                      
        <td>${item.date}</td>                
        <td>${item.location}</td>                     

      </tr>
    `;
  });

  // Gắn HTML vào tableBody
  tableBody.innerHTML = content;
}

// ============================================================================
// PHẦN 4: XỬ LÝ MODAL - MỞ/ĐÓNG POPUP
// ============================================================================

/**
 * KHI CLICK NÚT "+ "
 *
 * Arrow function: () => { ... }
 * Cách viết ngắn gọn thay cho: function() { ... }
 */
document.getElementById("btnOpenModal").onclick = () => {
  // ⭐ RESET EDITING ID - đây là thêm mới, không phải sửa
  editingId = null;

  // Reset form (xóa dữ liệu cũ)
  employeeForm.reset();

  // Xóa tất cả thông báo lỗi
  clearErrors();

  // Mở modal
  modal.style.display = "flex";
};

// Xử lý khi click nút X (đóng modal)
document.getElementById("btnCloseModal").onclick = () => closeModal();

// Xử lý khi click nút "Hủy"
document.getElementById("btnCancel").onclick = () => closeModal();

function closeModal() {
  // Ẩn modal
  modal.style.display = "none";

  // Reset form về trạng thái ban đầu
  // reset() là method của <form>
  employeeForm.reset();

  // Xóa tất cả lỗi validation
  clearErrors();

  // ⭐ RESET EDITING ID - không còn sửa nhân viên nào nữa
  editingId = null;
}

// ============================================================================
// PHẦN 5: VALIDATION (KIỂM TRA DỮ LIỆU NHẬP VÀO)
// ============================================================================
function validateForm() {
  // Flag để theo dõi kết quả validation
  let isValid = true;

  // Xóa tất cả lỗi cũ
  clearErrors();

  // Lấy giá trị từ form (trim = xóa khoảng trắng 2 đầu)
  const conference = document.getElementById("conference").value.trim();
  const email = document.getElementById("email").value.trim();
  const date = document.getElementById("date").value.trim();
  const location = document.getElementById("location").value;

  // ===== KIỂM TRA HỌ TÊN =====
  if (!conference) {
    // !conference = true nếu conference trống ("" hoặc undefined)
    showError("errorconference", "conference name not empty");
    isValid = false;
  } else if (conference.length > 60) {
    // .length = số ký tự
    showError("errorconference", "Conference name <60 char");
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showError("errorEmail", "Email không được để trống");
    isValid = false;
  } else if (!emailRegex.test(email)) {
    // .test() kiểm tra xem email có khớp với regex không
    showError("errorEmail", "Email không đúng định dạng");
    isValid = false;
  }

  if (!isValid) {
    document.getElementById("generalErrorMsg").innerText = "Try again";
  }
  return isValid;
}

/**
 * showError() - Hiển thị thông báo lỗi
 *
 * @param {String} conference - ID của thẻ <span> để hiển thị lỗi
 * @param {String} message -
 */
function showError(conference, message) {
  // innerText = nội dung text (không xử lý HTML)
  // (Dùng innerHTML sẽ xử lý HTML - nguy hiểm nếu có ký tự <,> )
  document.getElementById(conference).innerText = message;
}

/**
 * clearErrors() - Xóa tất cả thông báo lỗi
 *
 * querySelectorAll() - lấy tất cả phần tử khớp selector
 * .error-msg - class của tất cả span chứa lỗi
 * forEach() - duyệt qua từng phần tử
 */
function clearErrors() {
  // Duyệt qua tất cả .error-msg
  document.querySelectorAll(".error-msg").forEach((el) => {
    // Xóa text trong mỗi phần tử
    el.innerText = "";
  });
  // Xóa thông báo lỗi chung
  document.getElementById("generalErrorMsg").innerText = "";
}

// ============================================================================
// PHẦN 6: XỬ LÝ SUBMIT FORM - THÊM/CẬP NHẬT NHÂN VIÊN
// ============================================================================

/**
 * KHI USER SUBMIT FORM (BẤM NÚT "LƯU")
 *
 * onsubmit = event khi form được submit
 * e = event object (chứa thông tin về sự kiện)
 */
employeeForm.onsubmit = (e) => {
  // preventDefault() - chặn hành động mặc định của form (reload trang)
  // Vì chúng ta muốn xử lý bằng JavaScript, không reload
  e.preventDefault();

  // Kiểm tra dữ liệu
  if (validateForm()) {
    // FormData - API JavaScript để lấy giá trị form dễ dàng
    // Thay vì document.getElementById("conference").value, lặp lại n lần
    // -> Dùng new FormData(form) lấy tất cả cùng lúc
    const formData = new FormData(employeeForm);

    const newMember = {
      // Date.now(): Tạo ID duy nhất từ timestamp hiện tại (milliseconds)
      // Ưu điểm: Luôn khác nhau, không trùng lặp
      // Nhược điểm: Không có ý nghĩa, thực tế dùng database tự tạo
      conference: Date.now(),

      // formData.get("conference") = lấy value của input có name="conference"
      conference: formData.get("conference"),
      speakers: formData.get("speakers"),
      email: formData.get("email"),
      date: formData.get("date"),
      location: formData.get("location"),
    };

    employees.push(newMember);
    alert("Success!");

    // Cập nhật bảng (render lại với dữ liệu mới)
    renderTable();

    // Đóng modal
    closeModal();
  }
};

// ============================================================================
// PHẦN 7: KHỞI TẠO - GỌI LÀN ĐẦU TIÊN
// ============================================================================

/**
 * DOMContentLoaded - Event: Khi HTML tải xong, DOM sẵn sàng
 *
 * Tại sao cần event này?
 * - Nếu gọi renderTable() trước khi HTML load xong
 * - document.getElementById() sẽ không tìm thấy phần tử
 * - Code sẽ báo lỗi!
 *
 * Vì vậy: Đợi HTML load hoàn toàn trước khi gọi
 */
document.addEventListener("DOMContentLoaded", function () {
  // Hiển thị dữ liệu lần đầu tiên
  renderTable();
});
