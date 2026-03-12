function showError(id, message) {
  const el = document.getElementById("error-" + id);
  if (el) {
    el.textContent = message;
  }
}

function clearError(id) {
  const el = document.getElementById("error-" + id);
  if (el) {
    el.textContent = "";
  }
}

const prices = {
  ao: 150000,
  quan: 200000,
  giay: 500000,
};

function validateProduct() {
  const product = document.getElementById("product").value;

  if (product === "") {
    showError("product", "Phải chọn sản phẩm");
    return false;
  }

  clearError("product");
  return true;
}

function validateQuantity() {
  const q = document.getElementById("quantity").value;

  if (q === "") {
    showError("quantity", "Phải nhập số lượng");
    return false;
  }

  if (q < 1 || q > 99) {
    showError("quantity", "Số lượng từ 1 đến 99");
    return false;
  }

  clearError("quantity");
  return true;
}

function validateDate() {
  const input = document.getElementById("delivery-date").value;

  if (input === "") {
    showError("date", "Phải chọn ngày giao");
    return false;
  }

  const today = new Date();
  const chosen = new Date(input);

  const max = new Date();
  max.setDate(today.getDate() + 30);

  if (chosen < today) {
    showError("date", "Không được chọn ngày quá khứ");
    return false;
  }

  if (chosen > max) {
    showError("date", "Không quá 30 ngày");
    return false;
  }

  clearError("date");
  return true;
}

function validateAddress() {
  const value = document.getElementById("address").value.trim();

  if (value === "") {
    showError("address", "Không được để trống");
    return false;
  }

  if (value.length < 10) {
    showError("address", "Ít nhất 10 ký tự");
    return false;
  }

  clearError("address");
  return true;
}

function validateNote() {
  const value = document.getElementById("note").value;

  if (value.length > 200) {
    showError("note", "Không quá 200 ký tự");
    return false;
  }

  clearError("note");
  return true;
}

function validatePayment() {
  const radios = document.getElementsByName("payment");

  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      clearError("payment");
      return true;
    }
  }

  showError("payment", "Phải chọn phương thức");
  return false;
}

const note = document.getElementById("note");

note.addEventListener("input", function () {
  const len = note.value.length;

  const counter = document.getElementById("note-count");

  counter.textContent = len + " / 200";

  if (len > 200) {
    counter.style.color = "red";
  } else {
    counter.style.color = "gray";
  }

  validateNote();
});

function updateTotal() {
  const product = document.getElementById("product").value;

  const quantity = document.getElementById("quantity").value;

  if (product === "" || quantity === "") {
    document.getElementById("total").textContent = "0";
    return;
  }

  const price = prices[product];

  const total = price * quantity;

  document.getElementById("total").textContent =
    Number(total).toLocaleString("vi-VN");
}

document.getElementById("product").addEventListener("change", updateTotal);

document.getElementById("quantity").addEventListener("input", updateTotal);

const form = document.getElementById("order-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const ok =
    validateProduct() &&
    validateQuantity() &&
    validateDate() &&
    validateAddress() &&
    validateNote() &&
    validatePayment();

  if (!ok) return;

  showConfirm();
});

function showConfirm() {
  const product = document.getElementById("product").value;
  const quantity = document.getElementById("quantity").value;
  const date = document.getElementById("delivery-date").value;
  const total = document.getElementById("total").textContent;

  let productName = "";

  if (product === "ao") productName = "Áo";
  if (product === "quan") productName = "Quần";
  if (product === "giay") productName = "Giày";

  const box = document.getElementById("confirm-box");

  box.innerHTML = `

<h2>Xác nhận đơn hàng</h2>

<p>Sản phẩm: <b>${productName}</b></p>
<p>Số lượng: <b>${quantity}</b></p>
<p>Tổng tiền: <b>${total} đ</b></p>
<p>Ngày giao: <b>${date}</b></p>

<button id="ok-btn">Xác nhận</button>
<button id="cancel-btn">Hủy</button>

`;

  box.style.display = "block";
  box.scrollIntoView({ behavior: "smooth" });

  document.getElementById("ok-btn").onclick = function () {
    form.style.display = "none";

    box.innerHTML = "<h2>Đặt hàng thành công 🎉</h2>";
  };

  document.getElementById("cancel-btn").onclick = function () {
    box.style.display = "none";
  };
}
