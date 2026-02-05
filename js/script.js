// Array untuk menyimpan todo items
let todos = [];

// Fungsi untuk menambah todo item
function addTodo() {
  const todoInput = document.getElementById("todo-input");
  const todoDate = document.getElementById("todo-date");

  // Validasi input
  if (todoInput.value.trim() === "" || todoDate.value === "") {
    alert("Please enter both a todo item and a due date.");
  } else {
    // Membuat todo object
    const newTodo = {
      todo: todoInput.value.trim(),
      date: todoDate.value,
    };
    // menambah array todo
    todos.push(newTodo);

    // Clear input setelah menambah todo
    todoInput.value = "";
    todoDate.value = "";

    // Render todo list
    renderTodos();
  }
}

/// Fungsi untuk render todo items to the DOM
function renderTodos() {
  const todoList = document.getElementById("todo-list");

  // Clear list todo saat ini
  todoList.innerHTML = "";

  // Render todo item
  todos.forEach((item, _) => {
    todoList.innerHTML += `
        <li>
            <p class="text-2xl">${item.todo} <span class="text-sm text-gray-500">(${item.date})</span></p>
            <hr />
        </li>`;
  });
}

// Fungsi untuk menghapus semua todo items
function deleteAllTodos() {
  todos = [];
  renderTodos();
}

// Fungsi untuk filter todo items
function filterTodos() {
  /// To be implemented
}
