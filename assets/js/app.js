// Select DOM Element ==>
const form = document.querySelector(".form");
const inputTask = document.getElementById("inputTask");
const addBtn = document.querySelector(".addBtn");
const editBtn = document.querySelector(".editBtn");
const taskList = document.querySelector("#taskList");
const doneList = document.querySelector("#doneList");
const API = "http://localhost:3000";

inputTask.focus();

const createToDoTask = async (userTask) => {
  const res = await fetch(API + "/todoTasks", {
    method: "POST",
    body: JSON.stringify({
      todoTask: userTask,
    }),
    headers: {
      "Content-type": "application/json",
    },
  });
};

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const userTask = inputTask.value.trim();
  userTask ? createToDoTask(userTask) : null;
});

const deleteTask = async (id) => {
  const res = await fetch(API + `/todoTasks/${id}`, {
    method: "DELETE",
  });
  console.log(res);
};

const getTasks = async () => {
  const res = await fetch(API + "/todoTasks");
  const todoTasks = await res.json();
  for (const task of todoTasks) {
    taskList.innerHTML += `
    <ul id="taskList">
    <li class="taskItem" id="${task.id}">
        <i class="material-symbols-outlined doneMark">done</i>
        <span class="taskContent">${task.todoTask}</span>
        <i class="material-symbols-outlined editTask">edit_square</i>
        <i class="material-symbols-outlined deleteTask">delete</i>
    </li>
    `;
  }
};

const editTasks = async (id) => {
  const updatedTask = {
    todoTask: `${inputTask.value}`,
  };
  const res = await fetch(API + `/todoTasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updatedTask),
    headers: {
      "Content-type": "application/json",
    },
  });
};

const getSingleTask = async (id) => {
  const res = await fetch(API + `/todoTasks/${id}`);
  const todoTasks = await res.json();
  const taskContent = todoTasks.todoTask;
  taskContent ? (inputTask.value = taskContent) : null;
  // editTasks();
};

//  Delete and Edite Task event
taskList.addEventListener("click", function (e) {
  const id = e.target.parentElement.id;

  // Delete task
  if (e.target.classList.contains("deleteTask")) {
    const deleteConfirmation = confirm("Are You Sure ?");
    if (deleteConfirmation) {
      deleteTask(id);
    }
  }

  // Edit and put Task in Input
  if (e.target.classList.contains("editTask")) {
    const editConfirmation = confirm("Are You Sure ?");
    if (editConfirmation) {
      getSingleTask(id);
      editBtn.id = id;
    }
  }
});

getSingleTask();
getTasks();
