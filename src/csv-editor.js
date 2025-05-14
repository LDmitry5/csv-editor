import { drawTable } from "./drawTable.js";

class CsvEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.init();
  }

  init() {
    this.shadowRoot.innerHTML = `
    <style>
        :host {
            display: block;
            padding: 20px;
            position: absolute;
            backdrop-filter: blur(7.199999809265137px);
            background-color: var(--overlay);
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
        .wrap-container {
            display: flex;
            border-radius: 30px;
            padding: 20px 16px;
            width: 342px;
            background-color: var(--border-color);
            margin: 0 auto;
        }
        .container {
            border-radius: 22px;
            padding: 12px 13px;
            width: 100%;
            background: linear-gradient(180deg, rgba(95, 92, 240, 0.6) 0%, rgba(221, 220, 252, 0.6) 100%);
        }
        .form {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            flex: 1;
            gap: 15px;
        }
        .form-title {
            font-family: var(--font-family);
            font-weight: 600;
            font-size: 20px;
            text-align: center;
            color: var(--white);
            margin: 0;
        }
        .form-text {
            font-family: var(--font-family);
            font-weight: 300;
            font-size: 14px;
            text-align: center;
            color: var(--white);
            margin: 7px 0 0;
        }
        .btn-custom {
            border-radius: 30px;
            padding: 16px 86px;
            width: 100%;
            height: 56px;
            background-color: var(--accent);
            cursor: pointer;
            font-family: var(--font-family);
            font-weight: 500;
            font-size: 20px;
            color: var(--white);
        }
        .btn-custom_disabled {
            background-color: var(--disabled);
            pointer-events: none;
        }
        .btn-custom:hover {
            opacity: 0.8;
        }
        .file-name {
            border: 1px solid var(--accent);
            border-radius: 10px;
            padding: 6px 9px;
            box-sizing: border-box;
            width: 100%;
            height: 35px;
        }
        .drop-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 1px solid var(--grey);
            border-radius: 30px;
            padding: 39px 27px 17px 27px;
            box-sizing: border-box;
            background-color: var(--frame-background);
            width: 100%;
            min-height: 230px;
        }
        .img-drop-area {
            width: 100%;
            pointer-events: none;
        }
        .drop-area-text {
            font-family: var(--font-family);
            font-weight: 600;
            font-size: 14px;
            text-align: center;
            color: var(--accent);
        }
        .drop-area-success {
            color: var(--accent);
            pointer-events: none;
        }
        .wrap-cross-button {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        .cross-button {
            background-color: transparent;
            border: transparent;
            cursor: pointer;
        }
        .cross-button-svg {
            fill: white;
        }
        .cross-button:hover > svg {
            fill: #5f5cf0;
        }
        .uploaded-success {
            font-family: var(--font-family);
            font-weight: 300;
            font-size: 14px;
            color: var(--white);
            text-align: center;
        }
        .mask-loader {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px 0;
            box-sizing: border-box;
        }
        .loader {
            width: 50px;
            height: 50px;
            border: 10px solid transparent;
            border-radius: 100%;
            border-left-color: var(--accent);
            border-top-color: var(--accent);
            animation: loader 1s linear infinite;
            box-shadow: 0 4px 4px 0 var(--for-docs-pic-text-color), inset 0 -5px 4px 0 var(--for-docs-pic-white);
        }
        @keyframes loader {
            100% {
                transform: rotate(360deg);
            }
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
    <div class="wrap-container">
        <div class="container">
            <div class="wrap-cross-button">
                <button class="cross-button" id="cross-button">
                    <svg class="cross-button-svg" width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="34" height="34" rx="17" fill="#CCCCCE" fill-opacity="0.28" />
                <path d="M10.071 24.0711C9.40831 23.4084 9.40831 22.3339 10.071 21.6712L21.8133 9.92898C22.476 9.26627 23.5504 9.26627 24.2132 9.92898V9.92898C24.8759 10.5917 24.8759 11.6661 24.2132 12.3289L12.4709 24.0711C11.8082 24.7338 10.7337 24.7338 10.071 24.0711V24.0711ZM10.071 12.3289C9.40831 11.6661 9.40831 10.5917 10.071 9.92898V9.92898C10.7337 9.26627 11.8082 9.26627 12.4709 9.92898L24.2132 21.6712C24.8759 22.3339 24.8759 23.4084 24.2132 24.0711V24.0711C23.5504 24.7338 22.476 24.7338 21.8133 24.0711L10.071 12.3289Z" />
                    </svg>
                </button>
            </div>
            <form class="form" id="form" action="">
                <div>
                    <p class="form-title">Загрузочное окно</p>
                    <p class="form-text" id="form-text">Перед загрузкой дайте имя файлу</p>
                </div>
                <input type="text" id="file-name" class="file-name" placeholder="Название_файла" required />
                <div id="drop-area" class="drop-area" accept=".csv">
                    <img class="img-drop-area" src="drop.webp" alt="drop" />
                    <p class="drop-area-text">Перенесите ваш в файл сюда</p>
                </div>
                <button id="loadButton" class="btn-custom btn-custom_disabled" type="submit">Загрузить</button>
            </form>
        </div>
    </div>
    `;

    this.dropArea = this.shadowRoot.getElementById("drop-area");
    this.crossButton = this.shadowRoot.getElementById("cross-button");
    this.loadButton = this.shadowRoot.getElementById("loadButton");
    this.form = this.shadowRoot.getElementById("form");
    this.formText = this.shadowRoot.getElementById("form-text");
    this.fileName = this.shadowRoot.getElementById("file-name");

    // Закрытие загрузочного окна
    this.crossButton.addEventListener("click", () => {
      this.init();
      this.style.display = "none";
    });

    // Событие dragover обновляет пользовательский интерфейс при перетаскивании файла над элементом
    this.dropArea.addEventListener("dragover", (event) => {
      event.stopPropagation();
      event.preventDefault();
      event.target.style.border = "1px dashed";
      event.target.style.opacity = "0.8";
    });

    // Событие dragleave обновляет пользовательский интерфейс при покидании зоны перетаскивания над элементом
    this.dropArea.addEventListener("dragleave", (event) => {
      event.stopPropagation();
      event.preventDefault();
      event.target.style.border = "1px solid var(--grey)";
      event.target.style.opacity = "1";
    });

    // Событие drop возникает после того, как пользователь бросает файл в зону перетаскивания
    this.dropArea.addEventListener("drop", (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.fileList = event.dataTransfer.files[0];

      event.target.style.border = "1px solid var(--grey)";
      event.target.style.opacity = "1";

      this.type = this.fileList.type;
      this.size = this.fileList.size;
      this.name = this.fileList.name;

      const options = {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      };

      this.date = new Date().toLocaleString("en-US", options);

      // Обновляет пользовательский интерфейс, если успешно загружен файл
      if (this.type == "text/csv" && this.size < 1073741824) {
        this.form.parentElement.style.background = "linear-gradient(180deg, rgba(95, 92, 240, 0.6) 0%, rgba(221, 220, 252, 0.6) 100%)";
        event.target.style.padding = "20px";
        this.formText.innerText = "Перед загрузкой дайте имя файлу";
        this.dropArea.innerHTML = `
        <div class="drop-area-success">
            <h2>Успешно добавлен</h2>
            <div>
                <p>${this.name}</p>
                <p>Размер файла: ${Math.round(this.size / 1024)}КБ</p>
                <p>Дата изменения: ${this.date}</p>
            </div>
        </div>
        `;
        this.loadButton.classList.remove("btn-custom_disabled");

        // Нажатие кнопки Загрузка
        this.loadButton.addEventListener("click", (e) => {
          e.preventDefault();
          if (this.fileName.value) {
            this.form.parentElement.style.background = "linear-gradient(180deg, rgba(95, 92, 240, 0.6) 0%, rgba(221, 220, 252, 0.6) 100%)";
            this.loadCsv(e);
          }
          if (!this.fileName.value) {
            this.form.parentElement.style.background = "linear-gradient(180deg, #f05c5c 0%, #8f8df4 82.21%)";
            this.formText.innerHTML = `Ошибка при добавлении:</br>Отсутствует название файла`;
          }
        });
      }

      // Обновляет пользовательский интерфейс, если файл другого формата
      if (this.type !== "text/csv") {
        this.form.parentElement.style.background = "linear-gradient(180deg, #f05c5c 0%, #8f8df4 82.21%)";
        this.formText.innerHTML = `Ошибка при добавлении:</br>Неправильный формат файла`;
        this.dropArea.innerHTML = `
          <img class="img-drop-area" src="drop.webp" alt="drop" />
          <p class="drop-area-text">Перенесите ваш в файл сюда</p>
          `;
      }

      // Обновляет пользовательский интерфейс, если превышен размер файла (больше 1 Гб)
      if (this.type == "text/csv" && this.size > 1073741824) {
        this.form.parentElement.style.background = "linear-gradient(180deg, #f05c5c 0%, #8f8df4 82.21%)";
        this.formText.innerHTML = `Ошибка при добавлении:</br>Размер файла превышен (> 1Гб)`;
        this.dropArea.innerHTML = `
        <img class="img-drop-area" src="drop.webp" alt="drop" />
        <p class="drop-area-text">Перенесите ваш в файл сюда</p>
        `;
      }
    });
  }

  // Загрузить на сервер
  loadCsv(e) {
    e.preventDefault();
    const file = this.fileList;
    const name = this.fileName.value;

    // Данные загруженного csv-файла помещает в таблицу
    drawTable(file);

    // Создание FormData объекта
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    // Показ лоадера во время загрузки
    this.form.innerHTML = `
      <div class="uploaded-success">
          <h2>Загрузка файла</h2>
          <div class="mask-loader">
              <div class="loader"></div>
          </div>
      </div>
    `;

    // не нужно устанавливать Content-Type заголовок: правильный заголовок устанавливается автоматически, когда мы передаем FormData объект в fetch()
    fetch("https://file-upload-server-mc26.onrender.com/api/v1/upload/", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          response.json().then((data) => {
            this.form.innerHTML = `
              <div class="uploaded-success">
                  <h2>Ошибка в загрузке файла </h2>
                  <div>
                      <p>Error: ${data.error}</p>
                  </div>
              </div>
              `;
          });

          throw new Error("Сетевая ошибка");
        }

        return response.json();
      })
      .then((data) => {
        this.form.innerHTML = `
        <div class="uploaded-success">
            <h2>Файл успешно загружен</h2>
            <div>
                <p>filename: ${data.filename}</p>
                <p>name: ${data.name}</p>
                <p>timestamp: ${data.timestamp}</p>
                <p>message: ${data.message}</p>
            </div>
        </div>
        `;
      })
      .catch((error) => {
        console.error("Ошибка:", error);
      });
  }
}

customElements.define("csv-editor", CsvEditor);
