import "./style/main.css";
import { openForm } from "./openForm.js";

document.querySelector("#app").innerHTML = `
  <div class="container">
    <div>
      <button class="btn-custom" id="loadCsv">Загрузить</button>
      <button class="btn-custom" id="saveCsv">Сохранить</button>
    </div>
    <div class="custom-table" id="table"></div>
    <div>
      <canvas id="myChart"></canvas>
    </div>
    <csv-editor class="display-none"></csv-editor>
  </div>
`;

const load_csv = document.querySelector("#loadCsv");
load_csv.addEventListener("click", (e) => openForm(e));
