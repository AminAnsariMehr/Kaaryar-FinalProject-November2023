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
  inputTask.focus();
  const updatedTask = {
    todoTask: inputTask.value,
  };

  if (inputTask.value.trim()) {
    const res = await fetch(API + `/todoTasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedTask),
      headers: {
        "Content-type": "application/json",
      },
    });
    alert("The task was edited");
  } else {
    alert("you must  write some word!!!");
  }
};

editBtn.addEventListener("click", function () {
  editTasks(this.id);
});

const getSingleTask = async (id) => {
  const res = await fetch(API + `/todoTasks/${id}`);
  const todoTasks = await res.json();
  const taskContent = todoTasks.todoTask;
  taskContent ? (inputTask.value = taskContent) : null;
};

//  Delete and Edite Task event
taskList.addEventListener("click", function (e) {
  const id = e.target.parentElement.id;

  // Send task to Done
  if (e.target.classList.contains("doneMark")) {
    deleteTask(id);
  }

  // Delete task
  if (e.target.classList.contains("deleteTask")) {
    const deleteConfirmation = confirm("Are You Sure ?");
    if (deleteConfirmation) {
      deleteTask(id);
    }
  }

  // Edit and put Task in Input
  if (e.target.classList.contains("editTask")) {
    getSingleTask(id);
    editBtn.id = id;
  }
});

// Delete Done Task
const deleteDone = async (id) => {
  const res = await fetch(API + `/doneTasks/${id}`, {
    method: "DELETE",
  });
};

const undoDone = async (id, temperaryStorage) => {
  const temperaryTask = temperaryStorage;
  const swapDoneToToDo = async (temperaryTask) => {
    const res = await fetch(API + "/todoTasks", {
      method: "POST",
      body: JSON.stringify({
        todoTask: temperaryTask,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (res.status === 201) {
      const res = await fetch(API + `/doneTasks/${id}`, {
        method: "DELETE",
      });
    }
  };
  swapDoneToToDo(temperaryTask);
};

doneList.addEventListener("click", function (e) {
  const id = e.target.parentElement.id;
  // Delete Done Task
  if (e.target.classList.contains("deleteTask")) {
    const deleteConfirmation = confirm("Are You Sure This?");
    if (deleteConfirmation) {
      deleteDone(id);
    }
  }

  // return Done Task to Todo Task
  if (e.target.classList.contains("restoreTask")) {
    const returnConfirmation = confirm("Are You Sure This?");

    if (returnConfirmation) {
      const url = API + `/doneTasks/${id}`;
      const getSingleDoneData = async (url) => {
        const res = await fetch(url);
        const singleDone = await res.json();
        let temperaryStorage = singleDone.doneTask;
        // console.log(temperaryStorage);

        undoDone(id, temperaryStorage);
      };
      getSingleDoneData(url);

      // console.log(temperaryStorage);
    }
  }
});

addBtn.addEventListener("click", () => {
  const userTask = inputTask.value.trim();
  userTask ? createToDoTask(userTask) : null;
});

// Get Dones Task
const getDones = async () => {
  const res = await fetch(API + "/doneTasks");
  const doneTasks = await res.json();
  for (done of doneTasks) {
    doneList.innerHTML += `
    <li class="doneItem" id="${done.id}">
    <i class="material-symbols-outlined statusChecked">close</i>
    <span class="doneContent">${done.doneTask}</span>
    <i class="material-symbols-outlined restoreTask">restart_alt</i>
    <i class="material-symbols-outlined deleteTask">delete</i>
  </li>
    `;
  }
};

getTasks();
getDones();
