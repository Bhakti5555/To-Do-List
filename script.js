// Wait for the DOM to load before initializing
document.addEventListener("DOMContentLoaded", function () {
  /* -----------------------
     PERSONAL TASKS (List 1)
  -------------------------*/
  const todoInput1 = document.getElementById("todoInput1");
  const todoList1 = document.getElementById("todoList1");
  const todoCount1 = document.getElementById("todoCount1");
  const addButton1 = document.getElementById("addButton1");
  const deleteButton1 = document.getElementById("deleteButton1");
  let todo1 = JSON.parse(localStorage.getItem("todo1")) || [];

  addButton1.addEventListener("click", function () {
    addTask(1);
  });
  todoInput1.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask(1);
    }
  });
  deleteButton1.addEventListener("click", function () {
    deleteAllTasks(1);
  });

  /* -----------------------
     STUDY GOALS (List 2)
  -------------------------*/
  const todoInput2 = document.getElementById("todoInput2");
  const todoList2 = document.getElementById("todoList2");
  const todoCount2 = document.getElementById("todoCount2");
  const addButton2 = document.getElementById("addButton2");
  const deleteButton2 = document.getElementById("deleteButton2");
  let todo2 = JSON.parse(localStorage.getItem("todo2")) || [];

  addButton2.addEventListener("click", function () {
    addTask(2);
  });
  todoInput2.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask(2);
    }
  });
  deleteButton2.addEventListener("click", function () {
    deleteAllTasks(2);
  });

  /* -----------------------------
     ASSIGNMENT TRACKER (List 3)
  -------------------------------*/
  const todoInput3 = document.getElementById("todoInput3");
  const todoList3 = document.getElementById("todoList3");
  const todoCount3 = document.getElementById("todoCount3");
  const addButton3 = document.getElementById("addButton3");
  const deleteButton3 = document.getElementById("deleteButton3");
  let todo3 = JSON.parse(localStorage.getItem("todo3")) || [];

  addButton3.addEventListener("click", function () {
    addTask(3);
  });
  todoInput3.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask(3);
    }
  });
  deleteButton3.addEventListener("click", function () {
    deleteAllTasks(3);
  });

  /* ---------------------------------
     Functions to Handle Task Actions
  -----------------------------------*/
  function addTask(listNum) {
    let todoInput, todo, todoList, todoCount;
    if (listNum === 1) {
      todoInput = todoInput1;
      todo = todo1;
      todoList = todoList1;
      todoCount = todoCount1;
    } else if (listNum === 2) {
      todoInput = todoInput2;
      todo = todo2;
      todoList = todoList2;
      todoCount = todoCount2;
    } else if (listNum === 3) {
      todoInput = todoInput3;
      todo = todo3;
      todoList = todoList3;
      todoCount = todoCount3;
    }
    const newTask = todoInput.value.trim();
    if (newTask !== "") {
      todo.push({ text: newTask, disabled: false });
      saveToLocalStorage(listNum);
      todoInput.value = "";
      displayTasks(listNum);
      updateReminder();  // Update reminder immediately after adding a task
    }
  }

  function displayTasks(listNum) {
    let todo, todoList, todoCount;
    if (listNum === 1) {
      todo = todo1;
      todoList = todoList1;
      todoCount = todoCount1;
    } else if (listNum === 2) {
      todo = todo2;
      todoList = todoList2;
      todoCount = todoCount2;
    } else if (listNum === 3) {
      todo = todo3;
      todoList = todoList3;
      todoCount = todoCount3;
    }
    todoList.innerHTML = "";
    todo.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="todo-container">
          <input type="checkbox" class="todo-checkbox" id="input-${listNum}-${index}" ${
        item.disabled ? "checked" : ""
      }>
          <p id="todo-${listNum}-${index}" class="${
        item.disabled ? "disabled" : ""
      }" onclick="editTask(${listNum}, ${index})">${item.text}</p>
        </div>
      `;
      li.querySelector(".todo-checkbox").addEventListener("change", function () {
        toggleTask(listNum, index);
      });
      todoList.appendChild(li);
    });
    todoCount.textContent = todo.length;
  }

  // Make editTask a global function so it can be called from inline onclick
  window.editTask = function (listNum, index) {
    let todo;
    if (listNum === 1) {
      todo = todo1;
    } else if (listNum === 2) {
      todo = todo2;
    } else if (listNum === 3) {
      todo = todo3;
    }
    const todoItem = document.getElementById(`todo-${listNum}-${index}`);
    const existingText = todo[index].text;
    const inputElement = document.createElement("input");
    inputElement.value = existingText;
    todoItem.replaceWith(inputElement);
    inputElement.focus();
    inputElement.addEventListener("blur", function () {
      const updatedText = inputElement.value.trim();
      if (updatedText) {
        todo[index].text = updatedText;
        saveToLocalStorage(listNum);
      }
      displayTasks(listNum);
    });
  };

  function toggleTask(listNum, index) {
    let todo;
    if (listNum === 1) {
      todo = todo1;
    } else if (listNum === 2) {
      todo = todo2;
    } else if (listNum === 3) {
      todo = todo3;
    }
    todo[index].disabled = !todo[index].disabled;
    saveToLocalStorage(listNum);
    displayTasks(listNum);
    updateReminder();  // Update reminder after checking/unchecking a task
  }

  function deleteAllTasks(listNum) {
    if (listNum === 1) {
      todo1 = [];
    } else if (listNum === 2) {
      todo2 = [];
    } else if (listNum === 3) {
      todo3 = [];
    }
    saveToLocalStorage(listNum);
    displayTasks(listNum);
    updateReminder();  // Update reminder after deleting all tasks
  }

  function saveToLocalStorage(listNum) {
    if (listNum === 1) {
      localStorage.setItem("todo1", JSON.stringify(todo1));
    } else if (listNum === 2) {
      localStorage.setItem("todo2", JSON.stringify(todo2));
    } else if (listNum === 3) {
      localStorage.setItem("todo3", JSON.stringify(todo3));
    }
  }

  // Initialize all three lists
  displayTasks(1);
  displayTasks(2);
  displayTasks(3);

  /* -------------------------------------------------
     Toggle Expanded View on Header Click for Each List
     Now with partial fullscreen, centered modal and background blur.
  ---------------------------------------------------*/
  document.querySelectorAll(".todo-header").forEach(header => {
    header.addEventListener("click", function () {
      const parent = header.parentElement;
      parent.classList.toggle("expanded");
      // Toggle the modal overlay on body: if any .todo is expanded, add "modal-open" to body.
      if (document.querySelector(".todo.expanded")) {
        document.body.classList.add("modal-open");
      } else {
        document.body.classList.remove("modal-open");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const taskHeaders = document.querySelectorAll(".todo-header");

  taskHeaders.forEach(header => {
      header.addEventListener("click", function () {
          // Remove active class from all headers
          taskHeaders.forEach(h => h.classList.remove("active"));

          // Add active class to the clicked header
          this.classList.add("active");
      });
  });
});

// Display current date and day
function updateDate() {
  const dateElement = document.getElementById("current-date");
  const now = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  dateElement.textContent = now.toLocaleDateString("en-US", options);
}

function addTask(listNum) {
  let todoInput, todo, todoList, todoCount;
  if (listNum === 1) {
      todoInput = todoInput1;
      todo = todo1;
      todoList = todoList1;
      todoCount = todoCount1;
  } else if (listNum === 2) {
      todoInput = todoInput2;
      todo = todo2;
      todoList = todoList2;
      todoCount = todoCount2;
  } else if (listNum === 3) {
      todoInput = todoInput3;
      todo = todo3;
      todoList = todoList3;
      todoCount = todoCount3;
  }

  const newTask = todoInput.value.trim();
  if (newTask !== "") {
      todo.push({ text: newTask, disabled: false });
      saveToLocalStorage(listNum);
      todoInput.value = "";
      displayTasks(listNum);
      updateReminder();  // Update reminder after adding a task
  }
}

function deleteAllTasks(listNum) {
  if (listNum === 1) {
      todo1 = [];
  } else if (listNum === 2) {
      todo2 = [];
  } else if (listNum === 3) {
      todo3 = [];
  }
  saveToLocalStorage(listNum);
  displayTasks(listNum);
  updateReminder();  // Update reminder after deleting all tasks
}

function toggleTask(listNum, index) {
  let todo;
  if (listNum === 1) {
      todo = todo1;
  } else if (listNum === 2) {
      todo = todo2;
  } else if (listNum === 3) {
      todo = todo3;
  }
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage(listNum);
  displayTasks(listNum);
  updateReminder();  // Update reminder after checking/unchecking a task
}

// New logic: Instead of pending tasks, display the total number of tasks.
// Retrieve the latest lists from localStorage to avoid Reference Errors.
function updateReminder() {
  let todo1Local = JSON.parse(localStorage.getItem("todo1")) || [];
  let todo2Local = JSON.parse(localStorage.getItem("todo2")) || [];
  let todo3Local = JSON.parse(localStorage.getItem("todo3")) || [];
  let totalTasks = todo1Local.length + todo2Local.length + todo3Local.length;
  let reminderBox = document.getElementById("reminder-text");
  reminderBox.innerText = `Total tasks: ${totalTasks}`;
}

function updateDate() {
  const dateElement = document.getElementById("current-date");
  if (!dateElement) return; // Avoid error if element is missing

  const now = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  dateElement.textContent = now.toLocaleDateString("en-US", options);
}

// Run functions on page load
document.addEventListener("DOMContentLoaded", function () {
  updateDate();
  updateReminder(); 
});
