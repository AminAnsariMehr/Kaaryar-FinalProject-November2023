// Select DOM Element ==>
const form = document.querySelector(".form");
const inputTask = document.getElementById("inputTask");
const addBtn = document.querySelector(".addBtn");
const editBtn = document.querySelector(".editBtn");
const taskList = document.querySelector("#taskList");
const doneList = document.querySelector("#doneList");
// const doneItem = document.querySelector("#doneList > li");
const API = "http://localhost:3000";

editBtn.disabled = true;
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

form.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    const userTask = inputTask.value.trim();
    userTask ? createToDoTask(userTask) : null;
  }
});

const deleteTask = async (id) => {
  const res = await fetch(API + `/todoTasks/${id}`, {
    method: "DELETE",
  });
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
    res.status === 200 ? alert("The task was edited") : null;
  } else {
    alert("you must  write some word!!!");
  }
  editBtn.style.background = "gray";
};

const getSingleTask = async (id) => {
  const res = await fetch(API + `/todoTasks/${id}`);
  const todoTasks = await res.json();
  const taskContent = todoTasks.todoTask;
  taskContent ? (inputTask.value = taskContent) : null;
};

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

const CreateDoneTasks = async (id, temperaryStorage) => {
  const temperaryTask = temperaryStorage;
  const SendTodoToDone = async (temperaryTask) => {
    const res = await fetch(API + "/doneTasks", {
      method: "POST",
      body: JSON.stringify({
        doneTask: temperaryTask,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    // const SendTodoToDone = async (temperaryTask) => {
    //   const res = await fetch(API + "/doneTasks", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       doneTask: temperaryTask,
    //     }),
    //     headers: {
    //       "Content-type": "application/json",
    //     },
    //   });

    if (res.status === 201) {
      const res = await fetch(API + `/todoTasks/${id}`, {
        method: "DELETE",
      });
      console.log(id);
    }
  };
  SendTodoToDone(temperaryTask);
};

// =======  Event Linstenrs  =====>>>>>
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
      e.target.parentElement.style.transform = "translateX(-100%)";
      const statusBtn = e.target.parentElement.querySelector(".statusChecked");
      statusBtn.innerHTML = "close";
      statusBtn.style.background = "red";
      const url = API + `/doneTasks/${id}`;
      const getSingleDoneData = async (url) => {
        const res = await fetch(url);
        const singleDone = await res.json();
        let temperaryStorage = singleDone.doneTask;
        setTimeout(() => undoDone(id, temperaryStorage), 1000);
      };
      getSingleDoneData(url);
    }
  }
});

//  Delete and Edite Task event and Move to Dones List
taskList.addEventListener("click", function (e) {
  const id = e.target.parentElement.id;

  // Send task to Done
  if (e.target.classList.contains("doneMark")) {
    e.target.innerHTML = "done";
    e.target.parentElement.style.transform = "translateX(100%)";
    const url = API + `/todoTasks/${id}`;
    const getSingleTodoData = async (url) => {
      const res = await fetch(url);
      const singleDone = await res.json();
      let temperaryStorage = singleDone.todoTask;
      setTimeout(() => CreateDoneTasks(id, temperaryStorage), 1000);
    };
    getSingleTodoData(url);
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
    // editBtn.style.background = "green";
    editBtn.setAttribute("class", "active");
    editBtn.disabled = false;
    getSingleTask(id);
    editBtn.id = id;
  }
});

addBtn.addEventListener("click", () => {
  const userTask = inputTask.value.trim();
  userTask ? createToDoTask(userTask) : null;
});

editBtn.addEventListener("click", function () {
  editTasks(this.id);
});

// Get Dones Task
const getDones = async () => {
  const res = await fetch(API + "/doneTasks");
  const doneTasks = await res.json();
  for (done of doneTasks) {
    doneList.innerHTML += `
    <li class="doneItem" id="${done.id}">
    <i class="material-symbols-outlined statusChecked">done</i>
    <span class="doneContent">${done.doneTask}</span>
    <i class="material-symbols-outlined restoreTask">restart_alt</i>
    <i class="material-symbols-outlined deleteTask">delete</i>
    </li>
    `;
    setTimeout(
      () => (document.getElementById(`${done.id}`).style.opacity = "1"),
      20
    );
  }
};

const getTasks = async () => {
  const res = await fetch(API + "/todoTasks");
  const todoTasks = await res.json();
  for (const task of todoTasks) {
    taskList.innerHTML += `
    <li class="taskItem" id="${task.id}">
        <i class="material-symbols-outlined doneMark">close</i>
        <span class="taskContent">${task.todoTask}</span>
        <i class="material-symbols-outlined editTask">edit_square</i>
        <i class="material-symbols-outlined deleteTask">delete</i>
    </li>
    `;
  }
};

getTasks();
getDones();

// ================== style Codes ==>

taskList.addEventListener("mouseover", function (e) {
  if (e.target.classList.contains("doneMark")) {
    e.target.innerHTML = "done";
    e.target.style.backgroundColor = "green";
  }
});

taskList.addEventListener("mouseout", function (e) {
  if (e.target.classList.contains("doneMark")) {
    e.target.innerHTML = "close";
    e.target.style.backgroundColor = "red";
  }
});

doneList.addEventListener("mouseover", function (e) {
  if (e.target.classList.contains("restoreTask")) {
    const statusBtn = e.target.parentElement.querySelector(".statusChecked");
    statusBtn.innerHTML = "close";
    statusBtn.style.backgroundColor = "red";
  }
});

doneList.addEventListener("mouseout", function (e) {
  if (e.target.classList.contains("restoreTask")) {
    const statusBtn = e.target.parentElement.querySelector(".statusChecked");
    statusBtn.innerHTML = "done";
    statusBtn.style.backgroundColor = "green";
  }
});
