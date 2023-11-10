const toggleBtn = document.querySelector("#taskList");

taskList.addEventListener("mouseover", function (e) {
  // e.target
  if (e.target.classList.contains("doneMark")) {
    console.log(e.target);
    e.target.style.backgroundColor = "yellow";
  }
});
