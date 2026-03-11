let students = [];

function render() {
  const tbody = document.getElementById("students-body");
  tbody.innerHTML = "";

  students.forEach((sv, index) => {
    let rank =
      sv.score >= 8.5
        ? "Giỏi"
        : sv.score >= 7.0
          ? "Khá"
          : sv.score >= 5.0
            ? "Trung bình"
            : "Yếu";

    let cell = sv.score < 5 ? 'class="row-warning"' : "";

    tbody.innerHTML += `
        <tr ${cell}>
          <td>${index + 1}</td>
          <td>${sv.name}</td>
          <td>${sv.score}</td>
          <td>${rank}</td>
          <td><button onclick="remove(${index})">Xóa</button></td>
        </tr>
    `;
  });
}

function add() {
  const nameVal = document.getElementById("input-name").value.trim();
  const scoreVal = parseFloat(document.getElementById("input-score").value);

  if (nameVal === "" || isNaN(scoreVal) || scoreVal > 10 || scoreVal < 0) {
    alert("Họ tên không được trống, điểm phải là số từ 0–10");
    return;
  }

  students.push({ name: nameVal, score: scoreVal });

  document.getElementById("input-name").value = "";
  document.getElementById("input-score").value = "";
  document.getElementById("input-name").focus();

  render();
}

function remove(index) {
  students.splice(index, 1);
  render();
}

document.getElementById("bt-add").onclick = add;
document
  .getElementById("input-score")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      add();
    }
  });
