// Array untuk menyimpan semua tasks
let tasks = [];
let currentFilter = "all";

// Load tasks dari localStorage saat halaman dimuat
window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  renderTasks();

  // Set tanggal hari ini sebagai default
  //const today = new Date().toISOString().split("T")[0];
  //document.getElementById("dateInput").value = today;
});

// Fungsi untuk menambah task baru
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");

  const taskName = taskInput.value.trim();
  const dueDate = dateInput.value;

  // Validasi input
  if (taskName === "") {
    alert("Please input a task!");
    return;
  }

  if (dueDate === "") {
    alert("Please select a due date!");
    return;
  }

  const task = {
    id: Date.now(),
    name: taskName,
    dueDate: dueDate,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  // Clear inputs
  taskInput.value = "";
  dateInput.value = new Date().toISOString().split("T")[0];
  taskInput.focus();
}

// Fungsi untuk menghapus task
function deleteTask(id) {
  if (confirm("Are you sure to delete this task?")) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
  }
}

// Fungsi untuk menghapus semua tasks
function deleteAll() {
  if (tasks.length === 0) {
    alert("No task to be deleted!");
    return;
  }

  if (confirm("Are you sure to delete all tasked?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// Fungsi untuk toggle status completed
function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

// Fungsi untuk edit task
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  const newName = prompt("Edit task name:", task.name);
  if (newName && newName.trim() !== "") {
    task.name = newName.trim();
    saveTasks();
    renderTasks();
  }
}

// Fungsi untuk mendapatkan status task
function getTaskStatus(task) {
  if (task.completed) {
    return "completed";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) {
    return "overdue";
  } else if (dueDate.getTime() === today.getTime()) {
    return "today";
  } else {
    return "upcoming";
  }
}

// Fungsi untuk filter tasks (dipanggil dari dropdown)
function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();
}

// Fungsi untuk mendapatkan tasks yang sudah difilter
function getFilteredTasks() {
  if (currentFilter === "all") {
    return tasks;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    switch (currentFilter) {
      case "overdue":
        return !task.completed && dueDate < today;
      case "today":
        return dueDate.getTime() === today.getTime();
      case "upcoming":
        return dueDate > today;
      case "completed":
        return task.completed;
      default:
        return true;
    }
  });
}

// Fungsi untuk render tasks ke tabel
function renderTasks() {
  const tbody = document.getElementById("taskTableBody");
  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="4">No task found</td>
            </tr>
        `;
    return;
  }

  tbody.innerHTML = filteredTasks
    .map((task) => {
      const status = getTaskStatus(task);
      const statusText = {
        completed: "COMPLETED",
        overdue: "OVERDUE",
        today: "TODAY",
        upcoming: "UPCOMING",
      }[status];

      const statusClass = status === "today" ? "pending" : status;

      // Format tanggal
      const dateObj = new Date(task.dueDate);
      const formattedDate = dateObj.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      return `
            <tr class="task-row">
                <td>
                    <span class="task-name ${task.completed ? "completed" : ""}">${task.name}</span>
                </td>
                <td>${formattedDate}</td>
                <td>
                    <span class="status-badge status-${statusClass}">${statusText}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn complete" onclick="toggleComplete(${task.id})">
                            ${task.completed ? "↺ UNDO" : "✓ COMPLETED"}
                        </button>
                        <button class="action-btn edit" onclick="editTask(${task.id})">✎ EDIT</button>
                        <button class="action-btn delete" onclick="deleteTask(${task.id})">✕ DELETE</button>
                    </div>
                </td>
            </tr>
        `;
    })
    .join("");
}

// Fungsi untuk save tasks ke localStorage
function saveTasks() {
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// Fungsi untuk load tasks dari localStorage
function loadTasks() {
  const saved = localStorage.getItem("todoTasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

// Event listener untuk Enter key pada input
document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  dateInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });
});
