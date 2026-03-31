let income = 0;
let expense = 0;

const incEl = document.getElementById("inc");
const expEl = document.getElementById("exp");
const balEl = document.getElementById("bal");

let chart;

/* UPDATE VALUES */
function update(){
  incEl.innerText = "₹" + income;
  expEl.innerText = "₹" + expense;
  balEl.innerText = "₹" + (income - expense);

  updateChart();
}

/* ADD TRANSACTION */
function add(){
  let desc = document.getElementById("desc").value;
  let amt = +document.getElementById("amt").value;
  let cat = document.getElementById("cat").value;

  if(!desc || !amt){
    alert("Enter details");
    return;
  }

  let type = cat === "Salary" ? "income" : "expense";

  if(type === "income"){
    income += amt;
  } else {
    expense += amt;
  }

  update();

  // ADD TO TABLE
  let row = document.createElement("tr");

  row.innerHTML = `
    <td>${desc}</td>
    <td>${cat}</td>
    <td>₹${amt}</td>
    <td class="${type}">${type.toUpperCase()}</td>
  `;

  document.getElementById("history").appendChild(row);

  // CLEAR INPUTS
  document.getElementById("desc").value = "";
  document.getElementById("amt").value = "";
}

/* CHART */
function updateChart(){
  if(!chart){
    chart = new Chart(document.getElementById("chart"),{
      type:"doughnut",
      data:{
        labels:["Income","Expense"],
        datasets:[{
          data:[income, expense],
          backgroundColor:["#22c55e","#ef4444"]
        }]
      }
    });
  } else {
    chart.data.datasets[0].data = [income, expense];
    chart.update();
  }
}