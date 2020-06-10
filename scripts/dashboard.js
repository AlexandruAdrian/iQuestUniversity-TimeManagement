class TaskList {
  tasks;
  timeLimit;
  totalHrs;

  constructor(tasks = []) {
    this.tasks = [...tasks];
    this.timeLimit = {
      hrs: 999999,
      min: 0
    }
    this.totalHrs = {
      hrs: 0,
      min: 0
    }
  }

  addTask(task) {
    this.tasks = [task, ...this.tasks];
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter(task => task.getId() !== taskId);
  }

  editTask(newTask) {
    this.tasks.forEach(task => {
      if (task.getId() === newTask.getId()) {
        task.setTitle(newTask.getTitle());
        task.setDescription(newTask.getDescription());
        task.setHours(newTask.getHours());
        task.setMinutes(newTask.getMinutes());
        task.setDate(newTask.getDate());
        return;
      }
    })
  }

  resetTotal() {
    this.totalHrs.hrs = 0;
    this.totalHrs.min = 0;
  }
  getTask(id) {
    return this.tasks.find(task => task.getId() === id);
  }
  getTasks() { return this.tasks; }
  getTasksLength() { return this.tasks.length };
  getTimeLimit() { return this.timeLimit; }
  getTotalHrs() { return this.totalHrs; }

  setTimeLimit(hours = 0, minutes = 0) {
    this.timeLimit.hrs = hours;
    this.timeLimit.min = minutes;
  }

  setTotalHrs(hours, minutes) {
    this.totalHrs.hrs += hours;
    this.totalHrs.min += minutes;
    if (this.totalHrs.min > 59) {
      this.totalHrs.hrs += 1;
      this.totalHrs.min %= 60;
    }
  }
}

class Task {
  id;
  title;
  description;
  hours;
  minutes;
  date;

  constructor(id = -1, title = '', description = '', hours = 0, minutes = 0) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.hours = hours;
    this.minutes = minutes;

    const currentDate = new Date();
    this.date = {
      day: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear()
    }
  }

  getId() { return this.id; }
  getTitle() { return this.title; }
  getDescription() { return this.description; }
  getHours() { return this.hours; }
  getMinutes() { return this.minutes; }
  getDate() { return this.date; }

  setId(id) { this.id = id; }
  setTitle(title) { this.title = title; }
  setDescription(description) { this.description = description; }
  setHours(hours) { this.hours = hours; }
  setMinutes(minutes) { this.minutes = minutes; }
  setDate(date) { this.date = date; }
}

const taskList = new TaskList([]);
const menuTrigger = document.querySelector(".menu-trigger");
const menu = document.querySelector(".menu");
const logOutBtn = menu.lastElementChild;
const closeMenuBtn = document.querySelector(".close-menu");
const addTaskBtn = document.querySelector(".mobile-add-task-btn");
const desktopAddTaskBtn = document.getElementById("dekstop-add-task-btn")
const closeForm = document.querySelector(".close-task-form");
const limitHrs = document.getElementById("hours");
const limitMins = document.getElementById("minutes");
const setLimitContainer = document.querySelector(".set");
const unsetLimitContainer = document.querySelector(".unset");
const setLimitBtn = document.getElementById("set-time-limit");
const unsetLimitBtn = document.getElementById("unset-time-limit");
const timeLimit = document.getElementById("time-limit");
const formModal = document.getElementById("form-modal");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const hoursInput = document.getElementById("task-hrs");
const minutesInput = document.getElementById("task-mins");
const createAnotherInput = document.getElementById("create-another");
const createAnotherContainer = createAnotherInput.parentElement;
const submitBtn = document.querySelector(".task-form").lastElementChild;
const errors = document.querySelectorAll(".error");
const htmlList = document.querySelector(".task-list");
const totalHours = document.getElementById("total-hours");
const deletePopup = document.getElementById("delete-pop-up");
const popUpTitle = document.getElementById("pop-up-title");
const popupDeleteBtn = document.getElementById("delete");
const popupCancelBtn = document.getElementById("cancel");
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let taskCtr = 1; // Generate ID for each task
let taskToEdit = -1; // Holds ID for the edit 
let taskToRemove = -1; // Holds ID for removal

(() => {
  initList();
  initEventHandlers();
})();

function initEventHandlers() {
  initMenuHandlers();
  initTimeLimitHandlers();
  // Task list
  htmlList.addEventListener("click", handleTaskList);
  initModalHandlers();
  initPopUpHandlers();
}

function initTimeLimitHandlers() {
  limitHrs.addEventListener("focus", handleFocus);
  limitMins.addEventListener("focus", handleFocus);

  limitHrs.addEventListener("blur", handleNumberInputBlur);
  limitMins.addEventListener("blur", handleNumberInputBlur);

  limitHrs.addEventListener("input", handleNumberInputLength);
  limitMins.addEventListener("input", handleNumberInputLength);

  setLimitBtn.addEventListener("click", handleSetBtn);
  unsetLimitBtn.addEventListener("click", handleUnsetBtn);
}

function initMenuHandlers() {
  menuTrigger.addEventListener("click", openMenu);
  closeMenuBtn.addEventListener("click", closeMenu);
  logOutBtn.addEventListener("click", handleLogOut);
}

function initModalHandlers() {
  addTaskBtn.addEventListener("click", handleOpenAddForm);
  desktopAddTaskBtn.addEventListener("click", handleOpenAddForm);

  titleInput.addEventListener("focus", handleFocus);
  descriptionInput.addEventListener("focus", handleFocus);
  hoursInput.addEventListener("focus", handleFocus);
  minutesInput.addEventListener("focus", handleFocus);

  titleInput.addEventListener("blur", handleBlur);
  descriptionInput.addEventListener("blur", handleBlur);
  hoursInput.addEventListener("blur", handleNumberInputBlur);
  minutesInput.addEventListener("blur", handleNumberInputBlur);

  hoursInput.addEventListener("input", handleNumberInputLength);
  minutesInput.addEventListener("input", handleNumberInputLength);
}

function initPopUpHandlers() {
  popupDeleteBtn.addEventListener("click", handleTaskDelete);
  popupCancelBtn.addEventListener("click", handleCancel);
}

function openMenu() {
  toggleClass(menu, "hide-menu", "show-menu");
}

function handleLogOut() {
  localStorage.clear();
  window.location.href = "./login.html";
}

function closeMenu() {
  toggleClass(menu, "show-menu", "hide-menu");
}

/**
 * App uses the same form for adding or editing a task with the difference that
 * if the form is opened for adding a new task, then the submit button will have 
 * a handler just for that, same goes for edit. 
 * */
function handleOpenAddForm() {
  formModal.classList.add("modal-bg-active");
  titleInput.focus();
  closeForm.addEventListener("click", handleCloseAddForm);
  submitBtn.addEventListener("click", handleTaskAdd);
  toggleClass(createAnotherContainer, "hide", "show");
}

function handleOpenEditForm() {
  formModal.classList.add("modal-bg-active");
  titleInput.focus();
  closeForm.addEventListener("click", handleCloseEditForm);
  submitBtn.addEventListener("click", handleTaskEdit);
  toggleClass(createAnotherContainer, "show", "hide");
}

function handleCloseAddForm() {
  resetTaskForm();
  createAnotherInput.checked = false;
  formModal.classList.remove("modal-bg-active");
  closeForm.removeEventListener("click", handleCloseAddForm);
  submitBtn.removeEventListener("click", handleTaskAdd);
}

function handleCloseEditForm() {
  resetTaskForm();
  formModal.classList.remove("modal-bg-active");
  closeForm.removeEventListener("click", handleCloseEditForm);
  submitBtn.removeEventListener("click", handleTaskEdit);
}

function handleTaskAdd(e) {
  e.preventDefault();
  const titleValue = titleInput.value;
  const descriptionValue = descriptionInput.value;
  const hoursValue = parseInt(hoursInput.value);
  const minutesValue = parseInt(minutesInput.value);
  const createAnother = createAnotherInput.checked;

  if (validateTaskForm()) {
    // Create a new task
    const task = new Task(taskCtr++, titleValue.trim(), descriptionValue.trim(), hoursValue, minutesValue);
    taskList.addTask(task)
    titleInput.focus();
    // Refresh task list
    if (!createAnother) {
      handleCloseAddForm();
    } else {
      // Reset inputs
      resetTaskForm();
    }
    initList();
  }
}

function handleTaskEdit(e) {
  e.preventDefault();
  const titleValue = titleInput.value;
  const descriptionValue = descriptionInput.value;
  const hoursValue = parseInt(hoursInput.value);
  const minutesValue = parseInt(minutesInput.value);
  if (validateTaskForm()) {
    const newTask = new Task(taskToEdit, titleValue.trim(), descriptionValue.trim(), hoursValue, minutesValue);
    taskList.editTask(newTask);
    // Remove listeners and reset form
    handleCloseEditForm();
    initList();
  }
}

function handleTaskDelete() {
  taskList.removeTask(taskToRemove);
  popUpTitle.innerHTML = '';
  initList();
  deletePopup.classList.remove("modal-bg-active");
}

function handleCancel() {
  popUpTitle.innerHTML = '';
  deletePopup.classList.remove("modal-bg-active");
}

function handleSetBtn(e) {
  e.preventDefault();
  const setHours = document.getElementById("hours");
  const setMinutes = document.getElementById("minutes");
  if (validateInput(setHours) && validateInput(setMinutes)) {
    const hours = parseInt(setHours.value);
    const minutes = parseInt(setMinutes.value);
    taskList.setTimeLimit(hours, minutes);
    timeLimit.innerHTML = `${hours} hrs ${minutes} min`;
    toggleClass(setLimitContainer, "set-active", "set-inactive")
    toggleClass(unsetLimitContainer, "unset-inactive", "unset-active");
    initList(); // refresh the list
  }
}

function handleUnsetBtn() {
  taskList.setTimeLimit(99999, 0);
  toggleClass(unsetLimitContainer, "unset-active", "unset-inactive");
  toggleClass(setLimitContainer, "set-inactive", "set-active")
  timeLimit.innerHTML = `none`;
  initList(); // refresh the list
}
// Adding / editing a task form handlers
function handleFocus() {
  switch (this.id) {
    case "title":
      this.classList.remove("input-error");
      errors[0].innerHTML = '';
      break;
    case "description":
      this.classList.remove("input-error");
      errors[1].innerHTML = '';
      break;
    case "task-hrs":
    case "task-mins":
      hoursInput.classList.remove("input-error");
      minutesInput.classList.remove("input-error");
      errors[2].innerHTML = '';
      break;
    case "hours":
    case "minutes":
      limitHrs.classList.remove("input-error");
      limitMins.classList.remove("input-error");
      break;
    default:
      break;
  }
}

function handleBlur() {
  validateInput(this);
}

function handleNumberInputBlur() {
  if (this.value.length === 0) {
    this.value = 0;
  }

  validateInput(this);
}

function handleTaskList(e) {
  // Opens task details
  if (e.target.parentElement.className.includes("task-preview")) {
    const taskDetails = e.target.parentElement.nextElementSibling;
    const dropdown = e.target.parentElement.children[0];
    if (!taskDetails.className.includes("task-details-active")) {
      dropdown.classList.add("dropdown-active");
      taskDetails.classList.add("task-details-active");
    } else {
      taskDetails.classList.remove("task-details-active");
      dropdown.classList.remove("dropdown-active");
    }
  } else if (e.target.className.includes("trash")) {
    // Deletes selected task
    deletePopup.classList.add("modal-bg-active");
    const li = e.target.parentElement.parentElement.parentElement;
    const task = taskList.getTask(parseInt(li.id));
    popUpTitle.innerHTML = task.getTitle();
    taskToRemove = task.getId();

  } else if (e.target.className.includes("edit")) {
    // Edit selected task
    const li = e.target.parentElement.parentElement.parentElement;
    taskToEdit = parseInt(li.id);
    const task = taskList.getTask(taskToEdit);
    titleInput.value = task.getTitle();
    descriptionInput.value = task.getDescription();
    hoursInput.value = task.getHours();
    minutesInput.value = task.getMinutes();
    handleOpenEditForm();
  }
}

/**** Validation and utilities ****/
// Fires on submit
function validateNumberType(hrs, mins) {
  if (
    (hrs.value.length < 1 || mins.value.length < 1) || // Make sure inputs are not empty
    (hrs.value < 1 && mins.value < 1) || // Make sure duration is at least 0 hrs 1 min
    (hrs.value < 0 || mins.value < 0) || // Make sure there are no negative values
    (mins.value > 59) // Minutes value should be between 0 and 59
  ) {
    hrs.classList.add("input-error");
    mins.classList.add("input-error");
    return false;
  }

  return true;
}
// Fires on 'oninput' event
function handleNumberInputLength(e) {
  const regex = /[0-9]/g;
  if (!regex.test(this.value)) {
    this.value = this.value.slice(0, 2);
  }

  if (this.value.length > 2) {
    this.value = this.value.slice(0, 2);
  }
}

function validateInput(input) {
  let isValid = true;
  if (input.type === "number" && (input.id === "task-hrs" || input.id === "task-mins")) {
    // Validate adding / editing task form dration inputs
    isValid = validateNumberType(hoursInput, minutesInput);
    if (!isValid) { errors[2].innerHTML = "Invalid duration"; }
  } else if (input.type === "number" && (input.id === "hours" || input.id === "minutes")) {
    // Validate limit inputs
    isValid = validateNumberType(limitHrs, limitMins);
  } else {
    // Validate adding / editing task form title / description inputs
    if (input.value.trim().length < 1) {
      input.classList.add("input-error");
      if (input.id === "title") {
        errors[0].innerHTML = "Title field is required";
      } else {
        errors[1].innerHTML = "Description field is required";
      }

      isValid = false;
    }
  }

  return isValid;
}

function validateTaskForm() {
  return validateInput(titleInput) && validateInput(descriptionInput) && validateInput(hoursInput) && validateInput(minutesInput);
}

function resetTaskForm() {
  titleInput.classList.remove("input-error");
  descriptionInput.classList.remove("input-error");
  hoursInput.classList.remove("input-error");
  minutesInput.classList.remove("input-error");
  titleInput.value = '';
  descriptionInput.value = '';
  hoursInput.value = '';
  minutesInput.value = '';
  errors[0].innerHTML = '';
  errors[1].innerHTML = '';
  errors[2].innerHTML = ''
}

function toggleClass(element, removeClass, addClass) {
  element.classList.remove(removeClass);
  element.classList.add(addClass);
}
/**** End validation and utilities ****/

/**** Task list ****/
function initList() {
  taskList.resetTotal();
  htmlList.innerHTML = '';
  if (taskList.getTasksLength() < 1) {
    const li = document.createElement("li");
    li.className = "no-tasks";
    li.innerHTML = "No tasks added yet";
    htmlList.appendChild(li);
  } else {
    taskList.getTasks().forEach(task => {
      taskList.setTotalHrs(task.getHours(), task.getMinutes());
      createTask(htmlList, task);
    });
  }

  totalHours.innerHTML = `${taskList.getTotalHrs().hrs} hrs ${taskList.getTotalHrs().min} min`;
}

function createTask(list, task) {
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
  const taskDescription = document.createElement("pre");
  const taskTimes = document.createElement("div");
  const strongTitle = document.createElement("strong");
  const duration = document.createElement("p");
  const durationIcon = document.createElement("span");
  const date = document.createElement("p");
  const dateIcon = document.createElement("span");
  const dateTime = document.createElement("time");
  // Check if task duration exceeds time limit
  if (
    (task.getHours() > taskList.getTimeLimit().hrs) ||
    (task.getHours() === taskList.getTimeLimit().hrs && task.getMinutes() > taskList.getTimeLimit().min)
  ) {
    taskPreviewContainer.className = "task-preview warning";
  } else {
    taskPreviewContainer.className = "task-preview";
  }

  // Add classes
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
  taskLI.setAttribute("id", task.getId());

  list.appendChild(taskLI);
}
/**** End task list ****/