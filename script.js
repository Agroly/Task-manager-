const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const filterSelect = document.getElementById("filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveData(updatedTasks) {
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

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

function removeTask(index) {
  tasks = tasks.filter((_, i) => i !== index);
  saveData(tasks);
  renderTasks();
}

function toggleTask(index) {
  tasks = tasks.map((task, i) =>
    i === index ? { ...task, completed: !task.completed } : task
  );
  saveData(tasks);
  renderTasks();
}

function filterTasks(tasks, filter) {
  return tasks.filter(
    (task) =>
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "incomplete" && !task.completed)
  );
}

function renderTasks() {
  listContainer.innerHTML = "";
  const filteredTasks = filterTasks(tasks, filterSelect.value);

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("checked");

    li.addEventListener("click", () => toggleTask(index));

    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    span.addEventListener("click", (e) => {
      e.stopPropagation();
      removeTask(index);
    });

    li.appendChild(span);
    listContainer.appendChild(li);
  });
}

filterSelect.addEventListener("change", renderTasks);
document.getElementById("add-btn").addEventListener("click", addTask);

renderTasks();
