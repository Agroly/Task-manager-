const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const filterSelect = document.getElementById("filter");

// Использование неизменяемого состояния: tasks не мутируется напрямую.
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/**
 * Сохраняет данные в локальное хранилище.
 * Чистая функция: не изменяет внешние переменные, а просто сохраняет переданные данные.
 */
function saveData(updatedTasks) {
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

/**
 * Добавляет новую задачу.
 * - Иммутабельность: создает новый массив задач (`tasks = [...tasks, { text, completed: false }]`).
 * - Чистая функция: не мутирует `tasks`, а создает новый.
 */
function addTask() {
  const text = inputBox.value.trim();
  if (!text) {
    alert("Введите задачу");
    return;
  }

  tasks = [...tasks, { text, completed: false }];
  saveData(tasks);
  renderTasks();
  inputBox.value = "";
}

/**
 * Удаляет задачу по индексу.
 * - Иммутабельность: создает новый массив через `filter()`, не изменяя исходный.
 * - Чистая функция: возвращает новый массив без мутации `tasks`.
 */
function removeTask(index) {
  tasks = tasks.filter((_, i) => i !== index);
  saveData(tasks);
  renderTasks();
}

/**
 * Переключает состояние выполнения задачи.
 * - Иммутабельность: создает новый массив с измененной задачей через `map()`.
 * - Чистая функция: возвращает новый массив без изменения `tasks`.
 */
function toggleTask(index) {
  tasks = tasks.map((task, i) =>
    i === index ? { ...task, completed: !task.completed } : task
  );
  saveData(tasks);
  renderTasks();
}

/**
 * Фильтрует задачи по выбранному критерию.
 * - Функция высшего порядка: использует `filter()`.
 * - Чистая функция: не изменяет исходный массив, а создает новый.
 */
function filterTasks(tasks, filter) {
  return tasks.filter(
    (task) =>
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "incomplete" && !task.completed)
  );
}

/**
 * Отображает список задач.
 * - Чистая функция: не изменяет `tasks`, а только рендерит элементы.
 * - Использует filterTasks() — пример композиции функций.
 */
function renderTasks() {
  listContainer.innerHTML = "";
  const filteredTasks = filterTasks(tasks, filterSelect.value);

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("checked");

    // Функция высшего порядка: передает `toggleTask` как обработчик события.
    li.addEventListener("click", () => toggleTask(index));

    const span = document.createElement("span");
    span.innerHTML = "\u00d7";

    // Функция высшего порядка: передает `removeTask` как обработчик события.
    span.addEventListener("click", (e) => {
      e.stopPropagation();
      removeTask(index);
    });

    li.appendChild(span);
    listContainer.appendChild(li);
  });
}

// Функция высшего порядка: `renderTasks` вызывается при изменении фильтра.
filterSelect.addEventListener("change", renderTasks);
document.getElementById("add-btn").addEventListener("click", addTask);

// Первичное отображение задач.
renderTasks();
