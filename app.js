let records = JSON.parse(localStorage.getItem("financeRecords")) || [];

const recordTable = document.getElementById("recordTable");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");
const chartCtx = document.getElementById("financeChart");

document.getElementById("addBtn").addEventListener("click", addRecord);

function addRecord() {
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const note = document.getElementById("note").value.trim();
  const date = new Date().toLocaleDateString();

  if (!category || isNaN(amount)) return alert("အချက်အလက်အပြည့်ဖြည့်ပါ။");

  const record = { date, type, category, amount, note };
  records.push(record);
  saveRecords();
  renderTable();
  updateSummary();
  renderChart();

  document.getElementById("category").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("note").value = "";
}

function saveRecords() {
  localStorage.setItem("financeRecords", JSON.stringify(records));
}

function deleteRecord(index) {
  records.splice(index, 1);
  saveRecords();
  renderTable();
  updateSummary();
  renderChart();
}

function renderTable() {
  recordTable.innerHTML = "";
  records.forEach((r, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.date}</td>
      <td>${r.type === "income" ? "ဝင်ငွေ 💵" : "ထွက်ငွေ 💸"}<br><small>${r.category}</small></td>
      <td>${r.amount.toLocaleString()} Ks</td>
      <td>${r.note || "-"}</td>
      <td><button onclick="deleteRecord(${i})">ဖျက်</button></td>
    `;
    recordTable.appendChild(row);
  });
}

function updateSummary() {
  const totalIncome = records
    .filter(r => r.type === "income")
    .reduce((a, b) => a + b.amount, 0);
  const totalExpense = records
    .filter(r => r.type === "expense")
    .reduce((a, b) => a + b.amount, 0);
  const balance = totalIncome - totalExpense;

  totalIncomeEl.textContent = totalIncome.toLocaleString();
  totalExpenseEl.textContent = totalExpense.toLocaleString();
  balanceEl.textContent = balance.toLocaleString();
}

let chart;
function renderChart() {
  const income = records.filter(r => r.type === "income").reduce((a, b) => a + b.amount, 0);
  const expense = records.filter(r => r.type === "expense").reduce((a, b) => a + b.amount, 0);

  if (chart) chart.destroy();

  chart = new Chart(chartCtx, {
    type: "bar",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        label: "Monthly Overview",
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

renderTable();
updateSummary();
renderChart();
