function showError(fieldId, message) {
  const errorEl = document.getElementById("error-" + fieldId);
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearError(fieldId) {
  const errorEl = document.getElementById("error-" + fieldId);
  if (errorEl) {
    errorEl.textContent = "";
  }
}

function validateFullname() {
  const field = document.getElementById("fullname");
  const value = field.value.trim();
  if (value === "") {
    showError("fullname", "Họ tên không được để trống");
    return false;
  }
  if (value.length < 3) {
    showError("fullname", "Phải có ít nhất 3 ký tự");
    return false;
  }
  if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
    showError("fullname", "Chỉ được phép chữ và khoảng trắng");
    return false;
  }
  clearError("fullname");
  return true;
}

function validateEmail() {
  const field = document.getElementById("email");
  const value = field.value.trim();
  if (value === "") {
    showError("email", "Email không được để trống");
    return false;
  }

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) {
    showError("email", "Định dạng email không hợp lệ");
    return false;
  }
  clearError("email");
  return true;
}

function validatePhone() {
  const field = document.getElementById("phone");
  const value = field.value.trim();
  if (value === "") {
    showError("phone", "Số điện thoại không được để trống");
    return false;
  }
  if (!/^0[0-9]{9}$/.test(value)) {
    showError("phone", "Phải là 10 chữ số và bắt đầu bằng 0");
    return false;
  }
  clearError("phone");
  return true;
}

function validatePassword() {
  const field = document.getElementById("password");
  const value = field.value;
  if (value === "") {
    showError("password", "Mật khẩu không được để trống");
    return false;
  }

  const passRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passRe.test(value)) {
    showError(
      "password",
      "Mật khẩu phải ≥8 ký tự, có chữ hoa, chữ thường và số",
    );
    return false;
  }
  clearError("password");
  return true;
}

function validateConfirmPassword() {
  const pass = document.getElementById("password").value;
  const confirm = document.getElementById("confirm-password").value;
  if (confirm === "") {
    showError("confirm-password", "Phải nhập lại mật khẩu");
    return false;
  }
  if (pass !== confirm) {
    showError("confirm-password", "Mật khẩu không khớp");
    return false;
  }
  clearError("confirm-password");
  return true;
}

function validateGender() {
  const radios = document.getElementsByName("gender");
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      clearError("gender");
      return true;
    }
  }
  showError("gender", "Phải chọn giới tính");
  return false;
}

function validateTerms() {
  const check = document.getElementById("terms");
  if (!check.checked) {
    showError("terms", "Phải đồng ý điều khoản");
    return false;
  }
  clearError("terms");
  return true;
}

const form = document.getElementById("reg-form");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const ok =
    validateFullname() &&
    validateEmail() &&
    validatePhone() &&
    validatePassword() &&
    validateConfirmPassword() &&
    validateGender() &&
    validateTerms();

  if (ok) {
    form.style.display = "none";

    const username = document.getElementById("fullname").value;

    const successMsg = document.createElement("div");

    successMsg.innerHTML = `
    <h2>Đăng ký thành công! 🎉</h2>
    <p>Chào mừng <b>${username}</b></p>
  `;
    successMsg.style.textAlign = "center";
    successMsg.style.marginTop = "40px";
    successMsg.style.fontSize = "20px";

    document.body.appendChild(successMsg);
  }
});

["fullname", "email", "phone", "password", "confirm-password"].forEach(
  function (id) {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener("blur", function () {
        const fn =
          id === "fullname"
            ? validateFullname
            : id === "email"
              ? validateEmail
              : id === "phone"
                ? validatePhone
                : id === "password"
                  ? validatePassword
                  : validateConfirmPassword;
        fn();
      });
      field.addEventListener("input", function () {
        clearError(id);
      });
    }
  },
);

const genders = document.getElementsByName("gender");
genders.forEach(function (r) {
  r.addEventListener("change", validateGender);
});
const terms = document.getElementById("terms");
terms.addEventListener("change", function () {
  if (terms.checked) clearError("terms");
});
