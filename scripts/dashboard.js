class TaskList {
  #tasks;
  #timeLimit;

  constructor(tasks = []) {
    this.#tasks = [...tasks];
    this.#timeLimit = {
      hrs: 999999,
      min: 0
    }
  }

  addTask(task) {
    this.#tasks = [...this.#tasks, task];
  }

  removeTask(taskId) {
    this.#tasks = this.#tasks.filter(task => task.getId() !== taskId);
  }

  editTask(newTask) {
    this.#tasks.forEach(task => {
      if (task.getId() === newTask.getId()) {
        task.setTitle(newTask.getTitle());
        task.setDescription(newTask.getDescription());
        task.setHours(newTask.getHours());
        task.setMinutes(newTask.getMinutes());
        return;
      }
    })
  }

  getTasks() { return this.#tasks; }
  getTasksLength() { return this.#tasks.length };

  getTimeLimit() { return this.#timeLimit; }
  setTimeLimit(newTimeLimit) {
    this.#timeLimit = newTimeLimit;
  }
}

class Task {
  #id;
  #title;
  #description;
  #hours;
  #minutes;
  #date;

  constructor(id = -1, title = '', description = '', hours = 0, minutes = 0) {
    this.#id = id;
    this.#title = title;
    this.#description = description;
    this.#hours = hours;
    this.#minutes = minutes;

    const currentDate = new Date();
    this.#date = {
      day: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear()
    }
  }

  getId() { return this.#id; }
  getTitle() { return this.#title; }
  getDescription() { return this.#description; }
  getHours() { return this.#hours; }
  getMinutes() { return this.#minutes; }
  getDate() { return this.#date; }

  setId(id) { this.#id = id; }
  setTitle(title) { this.#title = title };
  setDescription(description) { this.#description = description };
  setHours(hours) { this.#hours = hours };
  setMinutes(minutes) { this.#minutes = minutes };
}

const taskList = new TaskList([]);
const mobileMenuTrigger = document.querySelector(".mobile-menu-trigger");
const mobileMenu = document.querySelector(".mobile-menu");
const logOutBtn = mobileMenu.lastElementChild;
const closeMobileMenuBtn = document.querySelector(".close-mobile-menu");
const addTaskBtn = document.querySelector(".add-task-btn");
const closeForm = document.querySelector(".close-task-form");
const timeLimitBtn = document.getElementById("set-time-limit");
const formModal = document.querySelector(".modal-bg");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const hoursInput = document.getElementById("task-hrs");
const minutesInput = document.getElementById("task-mins");
const submitBtn = document.querySelector(".task-form").lastElementChild;
const error = document.querySelector(".error");
const htmlList = document.querySelector(".task-list");

(() => {
  initList();
  initEventHandlers();
})();

/**** Event handlers ****/
function initEventHandlers() {
  // Mobile menu
  mobileMenuTrigger.addEventListener("click", openMobileMenu);
  closeMobileMenuBtn.addEventListener("click", closeMobileMenu);
  // Task form modal
  addTaskBtn.addEventListener("click", openFormModal);
  closeForm.addEventListener("click", closeFormModal);
  // Set time limit
  timeLimitBtn.addEventListener("click", handleTimeLimit);
  // Task list
  htmlList.addEventListener("click", openTaskDetails);
}

function openMobileMenu() {
  toggleClass(mobileMenu, "hide-mobile-menu", "show-mobile-menu");
  logOutBtn.addEventListener("click", handleLogOut);
}

function handleLogOut() {
  localStorage.clear();
  window.location.href = "./login.html";
}

function closeMobileMenu() {
  toggleClass(mobileMenu, "show-mobile-menu", "hide-mobile-menu");
}

function openFormModal() {
  formModal.classList.add("modal-bg-active");
  titleInput.focus();
  titleInput.addEventListener("focus", handleFocus);
  descriptionInput.addEventListener("focus", handleFocus);
  hoursInput.addEventListener("focus", handleFocus);
  minutesInput.addEventListener("focus", handleFocus);
  submitBtn.addEventListener("click", handleTaskCreation);
}

function closeFormModal() {
  error.innerHTML = '';
  titleInput.classList.remove("input-error");
  descriptionInput.classList.remove("input-error");
  hoursInput.classList.remove("input-error");
  minutesInput.classList.remove("input-error");
  formModal.classList.remove("modal-bg-active");
  titleInput.value = '';
  descriptionInput.value = '';
  hoursInput.value = '';
  minutesInput.value = '';
  submitBtn.removeEventListener('click', handleTaskCreation);
}

function handleTaskCreation(e) {
  e.preventDefault();
  const titleValue = titleInput.value;
  const descriptionValue = descriptionInput.value;
  const hoursValue = hoursInput.value;
  const minutesValue = minutesInput.value;
  if (validateTaskForm()) {
    // Create a new task
    const task = new Task(taskList.getTasksLength() + 1, titleValue, descriptionValue, hoursValue, minutesValue);
    taskList.addTask(task)
    // Reset inputs
    titleInput.value = '';
    descriptionInput.value = '';
    hoursInput.value = 0;
    minutesInput.value = 0;
    // Focus back on title and refresh task list
    titleInput.focus();
    initList();
  }
}

function handleTimeLimit(e) {
  e.preventDefault();
  const hours = parseInt(document.getElementById("hours").value);
  const minutes = parseInt(document.getElementById("minutes").value);

  taskList.setTimeLimit({ hours, minutes });
}

function handleFocus() {
  if (error.children.length > 0) {
    this.classList.remove("input-error");
    let err;
    switch (this.id) {
      case "title":
        err = "Title";
        break;
      case "description":
        err = "Description";
        break;
      case "task-hrs":
      case "task-mins":
        minutesInput.classList.remove("input-error");
        hoursInput.classList.remove("input-error");
        err = "duration";
        break;
      default:
        break;
    }

    if (err) { removeError(err); }
  }
}

let isOpen = false;
function openTaskDetails(e) {
  if (e.target.parentElement.className === "task-preview") {
    const taskDetails = e.target.parentElement.nextElementSibling;
    const dropdown = e.target.parentElement.children[0];
    if (!isOpen) {
      dropdown.classList.add("dropdown-active");
      taskDetails.classList.add("task-details-active");
    } else {
      taskDetails.classList.remove("task-details-active");
      dropdown.classList.remove("dropdown-active");
    }

    isOpen = !isOpen;
  }
}

/**** End event handlers ****/

/**** Validation and utilities ****/
function validateTaskForm() {
  const titleValue = titleInput.value;
  const descriptionValue = descriptionInput.value;
  const hoursValue = hoursInput.value;
  const minutesValue = minutesInput.value;

  let isValid = true;

  if (titleValue.length < 1) {
    titleInput.classList.add("input-error");
    const p = document.createElement("p");
    p.innerHTML = "Title cannot be empty.";
    if (!findError(p.innerHTML)) {
      error.appendChild(p);
    }
    isValid = false;
  }
  if (descriptionValue.length < 1) {
    descriptionInput.classList.add("input-error");
    const p = document.createElement("p");
    p.innerHTML = "Description cannot be empty.";
    if (!findError(p.innerHTML)) {
      error.appendChild(p);
    }
    isValid = false;
  }

  if (hoursValue < 0 || (hoursValue < 1 && minutesValue < 1) || minutesValue > 59 || minutesValue < 0) {
    hoursInput.classList.add("input-error");
    minutesInput.classList.add("input-error");
    const p = document.createElement("p")
    p.innerHTML = "Invalid duration";
    if (!findError(p.innerHTML)) {
      error.appendChild(p);
    }
    isValid = false;
  }

  return isValid;
}

// Looks for the error in the error list container and removes the child including "err" which is a substring of the actual error
function removeError(err) {
  const childToRemove = findError(err);
  if (childToRemove) {
    error.removeChild(childToRemove);
  }
}

function findError(errorText) {
  return Array.from(error.children).find(child => child.innerHTML.includes(errorText));
}

function toggleClass(element, removeClass, addClass) {
  element.classList.remove(removeClass);
  element.classList.add(addClass);
}
/**** End validation and utilitie ****/

/**** Task list ****/
function initList() {
  htmlList.innerHTML = '';
  if (taskList.getTasksLength() < 1) {
    const li = document.createElement("li");
    li.className = "no-tasks";
    li.innerHTML = "No tasks added yet";
    htmlList.appendChild(li);
  } else {
    taskList.getTasks().forEach(task => {
      createTask(htmlList, task);
    });
  }
}

function createTask(list, task) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // Create elements
  const taskLI = document.createElement("li");
  const taskPreviewContainer = document.createElement("div");
  const dropDownContainer = document.createElement("div");
  const dropDownBtn = document.createElement("span");
  const taskPreview = document.createElement("p");
  const optionsContainer = document.createElement("div");
  const editOption = document.createElement("span");
  const deleteOption = document.createElement("span");
  const taskDetails = document.createElement("div");
  const taskTitle = document.createElement("p");
  const taskDescription = document.createElement("div");
  const taskTimes = document.createElement("div");
  const strongTitle = document.createElement("strong");
  const duration = document.createElement("p");
  const durationIcon = document.createElement("span");
  const date = document.createElement("p");
  const dateIcon = document.createElement("span");
  const dateTime = document.createElement("time");
  // Add classes
  taskPreviewContainer.className = "task-preview";
  dropDownContainer.className = "dropdown";
  dropDownBtn.className = "fas fa-angle-down";
  optionsContainer.className = "options";
  editOption.className = "fas fa-edit";
  deleteOption.className = "fas fa-trash-alt";
  taskDetails.className = "task-details";
  taskTitle.className = "task-title";
  taskDescription.className = "task-description";
  durationIcon.className = "far fa-clock";
  dateIcon.className = "far fa-calendar-alt";
  // Set attributes
  const taskDate = task.getDate();
  dateTime.setAttribute("datetime", `${taskDate.year}-${taskDate.month + 1}-${taskDate.day}`);
  // Build hierarchy
  taskLI.appendChild(taskPreviewContainer);
  taskLI.appendChild(taskDetails);
  taskPreviewContainer.appendChild(dropDownContainer);
  taskPreviewContainer.appendChild(taskPreview);
  taskPreviewContainer.appendChild(optionsContainer);
  taskDetails.appendChild(taskTitle);
  taskDetails.appendChild(taskDescription);
  taskDetails.appendChild(taskTimes);
  dropDownContainer.appendChild(dropDownBtn);
  optionsContainer.appendChild(editOption);
  optionsContainer.appendChild(deleteOption);
  taskTitle.appendChild(strongTitle);
  taskTimes.appendChild(duration);
  taskTimes.appendChild(date);
  duration.appendChild(durationIcon);
  date.appendChild(dateIcon);
  date.appendChild(dateTime);
  // Append contents
  taskPreview.innerHTML = task.getTitle();
  strongTitle.innerHTML = task.getTitle();
  taskDescription.innerHTML = task.getDescription();
  duration.innerHTML += `${task.getHours()}h ${task.getMinutes()}m`;
  dateTime.innerHTML = `${taskDate.day} ${months[taskDate.month]} ${taskDate.year}`;

  list.appendChild(taskLI);
}
/**** End task list ****/