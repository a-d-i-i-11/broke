let income = 0;
let expense = 0;
let transactions = [];

let chart, monthlyChart, dailyChart, incomeExpenseChart;

let targetAmount = 0;
let targetName = "";

/* ADD TRANSACTION */
function add(){
  let desc = document.getElementById('desc').value;
  let amt = parseFloat(document.getElementById('amt').value);
  let cat = document.getElementById('cat').value;
  let date = document.getElementById('date').value;

  if(!desc || !amt || !date){
    alert("Fill all fields");
    return;
  }

  let type = (cat.includes("Income") || cat==="Salary" || cat==="Business Income") 
  ? "income" : "expense";

  let dateObj = new Date(date);
  let month = dateObj.getMonth();
  let day = dateObj.getDate();

  transactions.push({desc,cat,amt,type,date,month,day});

  if(type==="income") income+=amt;
  else expense+=amt;

  update();

  // clear inputs
  document.getElementById('desc').value="";
  document.getElementById('amt').value="";
  document.getElementById('date').value="";
}

/* UPDATE UI */
function update(){

  document.getElementById('inc').innerText="₹"+income;
  document.getElementById('exp').innerText="₹"+expense;
  document.getElementById('bal').innerText="₹"+(income-expense);

  let history=document.getElementById('history');
  history.innerHTML="";

  transactions.slice().reverse().forEach(t=>{
    history.innerHTML+=`
    <tr>
      <td>${t.desc}</td>
      <td>${t.cat}</td>
      <td>₹${t.amt}</td>
      <td>${t.date}</td>
      <td style="color:${t.type==='income'?'#22c55e':'#ef4444'};font-weight:600">
        ${t.type}
      </td>
    </tr>`;
  });

  drawChart();
  drawReports();
}

/* MAIN DONUT CHART */
function drawChart(){
  let ctx=document.getElementById('chart');

  if(chart) chart.destroy();

  chart=new Chart(ctx,{
    type:'doughnut',
    data:{
      labels:['Income','Expense'],
      datasets:[{
        data:[income,expense],
        backgroundColor:['#22c55e','#ef4444'],
        borderWidth:0
      }]
    },
    options:{
      plugins:{
        legend:{ labels:{ color:'#fff' } }
      }
    }
  });
}

/* TARGET SYSTEM */
function setTarget(){
  targetName=document.getElementById('targetName').value;
  targetAmount=parseFloat(document.getElementById('target').value);

  if(!targetName || !targetAmount){
    alert("Enter target name & amount");
    return;
  }

  document.getElementById('targetDisplay').innerText =
  `🎯 Saving for: ${targetName} (₹${targetAmount})`;
}

/* SCROLL TO REPORT */
function showReport(){
  document.querySelector('.report-section').scrollIntoView({
    behavior:'smooth'
  });
}

/* REPORT GRAPHS */
function drawReports(){

  let monthly=new Array(12).fill(0);
  let daily=new Array(31).fill(0);

  transactions.forEach(t=>{
    if(t.type==="expense"){
      monthly[t.month]+=t.amt;
      daily[t.day-1]+=t.amt;
    }
  });

  /* MONTHLY */
  let m=document.getElementById('monthlyChart');
  if(m){
    if(monthlyChart) monthlyChart.destroy();

    monthlyChart=new Chart(m,{
      type:'bar',
      data:{
        labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets:[{
          label:'Monthly Expenses',
          data:monthly,
          backgroundColor:'#6366f1'
        }]
      }
    });
  }

  /* DAILY */
  let d=document.getElementById('dailyChart');
  if(d){
    if(dailyChart) dailyChart.destroy();

    dailyChart=new Chart(d,{
      type:'line',
      data:{
        labels:[...Array(31).keys()].map(i=>i+1),
        datasets:[{
          label:'Daily Spend',
          data:daily,
          borderColor:'#ef4444',
          fill:false
        }]
      }
    });
  }

  /* INCOME VS EXPENSE */
  let ie=document.getElementById('incomeExpenseChart');
  if(ie){
    if(incomeExpenseChart) incomeExpenseChart.destroy();

    incomeExpenseChart=new Chart(ie,{
      type:'bar',
      data:{
        labels:['Income','Expense'],
        datasets:[{
          label:'Overview',
          data:[income,expense],
          backgroundColor:['#22c55e','#ef4444']
        }]
      }
    });
  }
}
