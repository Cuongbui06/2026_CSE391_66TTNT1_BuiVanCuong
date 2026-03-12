let students = JSON.parse(localStorage.getItem("students")) || [];
let filteredStudents = [];
let sortOrder = "asc";

function getRank(score) {
  if (score >= 8.5) {
    return "Giỏi";
  } else if (score >= 7.0) {
    return "Khá";
  } else if (score >= 5.0) {
    return "Trung bình";
  } else {
    return "Yếu";
  }
}

function applyFilters() {
 
  const searchKeyword = document
    .getElementById("search-name")
    .value.toLowerCase();
  const filterRank = document.getElementById("filter-rank").value;

  filteredStudents = students.filter(function (sv) {
 
    const nameMatch = sv.name.toLowerCase().includes(searchKeyword);
 
    const rankMatch =
      filterRank === "Tất cả" || getRank(sv.score) === filterRank;
 
    return nameMatch && rankMatch;
  });


  filteredStudents.sort(function (a, b) {
    if (sortOrder === "asc") {
      return a.score - b.score;
    } else {
      return b.score - a.score;
    }
  });


  renderTable();
}

function renderTable() {
  const tbody = document.getElementById("students-body");
  tbody.innerHTML = "";


  if (filteredStudents.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center;">Không có kết quả</td></tr>';
    return;
  }

  
  for (let index = 0; index < filteredStudents.length; index++) {
    let sv = filteredStudents[index];
    let rank = getRank(sv.score);
    let cell = sv.score < 5 ? 'class="row-warning"' : "";

    tbody.innerHTML += `
        <tr ${cell}>
          <td>${index + 1}</td>
          <td>${sv.name}</td>
          <td>${sv.score}</td>
          <td>${rank}</td>
          <td><button onclick="remove(${students.indexOf(sv)})">Xóa</button></td>
        </tr>
    `;
  }


  const sortHeader = document.getElementById("sort-score");
  sortHeader.textContent = `Điểm ${sortOrder === "asc" ? "▲" : "▼"}`;
}

function add() {

  const nameVal = document.getElementById("input-name").value.trim();
  const scoreVal = parseFloat(document.getElementById("input-score").value);

 
  if (nameVal === "" || isNaN(scoreVal) || scoreVal > 10 || scoreVal < 0) {
    alert("Họ tên không được trống, điểm phải là số từ 0–10");
    return;
  }


  students.push({ name: nameVal, score: scoreVal });
localStorage.setItem("students", JSON.stringify(students));
  document.getElementById("input-name").value = "";
  document.getElementById("input-score").value = "";
  document.getElementById("input-name").focus();

  applyFilters();
}

function remove(index) {
  students.splice(index, 1);
  localStorage.setItem("students", JSON.stringify(students));
  applyFilters();
}

document.getElementById("bt-add").onclick = add;
document
  .getElementById("input-score")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      add();
    }
  });

document.getElementById("search-name").addEventListener("input", applyFilters);
document.getElementById("filter-rank").addEventListener("change", applyFilters);
document.getElementById("sort-score").addEventListener("click", function () {
  sortOrder = sortOrder === "asc" ? "desc" : "asc";
  applyFilters();
});


applyFilters();
filteredStudents = students;
