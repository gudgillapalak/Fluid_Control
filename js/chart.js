// STATUS CHART
async function loadStatusChart() {
  const res = await fetch("http://localhost:5000/api/status-distribution");
  const data = await res.json();

  const labels = data.map(d => d._id);
  const values = data.map(d => d.count);

  new Chart(document.getElementById("statusChart"), {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{ data: values }]
    }
  });
}

// OWNER CHART
async function loadOwnerChart() {
  const res = await fetch("http://localhost:5000/api/projects-per-owner");
  const data = await res.json();

  const labels = data.map(d => d._id);
  const values = data.map(d => d.count);

  new Chart(document.getElementById("ownerChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{ data: values }]
    }
  });
}

// CATEGORY CHART
async function loadCategoryChart() {
  const res = await fetch("http://localhost:5000/api/projects-by-category");
  const data = await res.json();

  const labels = data.map(d => d._id);
  const values = data.map(d => d.count);

  new Chart(document.getElementById("categoryChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{ data: values }]
    }
  });
}

// LOAD ALL
loadStatusChart();
loadOwnerChart();
loadCategoryChart();