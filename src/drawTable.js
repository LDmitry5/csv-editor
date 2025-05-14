import Chart from "chart.js/auto";
import csv from "csvtojson";

export function drawTable(file) {
  // Табличный вид данных
  const customTable = document.querySelector("#table");
  const saveCsv = document.querySelector("#saveCsv");
  const reader = new FileReader();

  reader.onload = (e) => {
    const csvData = e.target.result;
    const lines = csvData.split("\n");
    const table = document.createElement("tbody");

    lines.forEach((line, index) => {
      const cells = line.split(/,(?![\d])/);
      const row = document.createElement("tr");

      cells.forEach((cell) => {
        const data = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.value = cell;
        data.appendChild(input);
        row.appendChild(data);
      });

      table.appendChild(row);
    });

    customTable.innerHTML = "";
    customTable.appendChild(table);
  };

  reader.readAsText(file);

  // Графический вид данных
  const ctx = document.getElementById("myChart");
  const csvRows = csv({ noheader: true, output: "csv" }).fromString(file);
  console.log(csvRows);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // выгрузкa изменённого csv файла
  saveCsv.addEventListener("click", () => {
    const rows = customTable.querySelectorAll("tr");
    let csvContent = "";

    rows.forEach((row) => {
      const cells = row.querySelectorAll("input");
      const rowData = Array.from(cells).map((cell) => cell.value);
      csvContent += rowData.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edited.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}
