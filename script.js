"use strict";

// Variables
const STORAGE_KEY = "tasks";

// DOM variables
const form = document.querySelector(".create-task-form");
const taskInput = document.querySelector(".task-input");
const filterInput = document.querySelector(".filter-input");
const taskList = document.querySelector(".collection");
const clearButton = document.querySelector(".clear-tasks");

// "storage" functions
const getTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return tasks;
};

const storeTaskInLocalStorage = (task) => {
  const tasks = getTasksFromLocalStorage();
  tasks.push(task);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

//edit task in Local Storage
let editTaskInLocalStorage = (editedTask, index) => {
  const tasks = getTasksFromLocalStorage();
  tasks[index] = editedTask;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

//removeTaskFromLocalStorage приймає два аргументи - видалений елемент і індекс -  Tania's comment
const removeTaskFromLocalStorage = (deletedTask, index) => {
  const tasks = getTasksFromLocalStorage();
  tasks.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const clearTasksFromLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// "tasks" functions
const getTasks = () => {
  const tasks = getTasksFromLocalStorage();

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "collection-item";
    li.textContent = task;

    const taskText = document.createElement("span");
    taskText.className = "delete-item";
    taskText.innerHTML = '<i class="fa fa-remove"></i>';
    li.append(taskText);

    const editedIcon = document.createElement("span");
    editedIcon.className = "edit-item";
    editedIcon.innerHTML = '<i class="fa fa-edit"></i>';
    li.append(editedIcon);

    // Append li to ul
    taskList.append(li);
  });
};

const addTask = (event) => {
  event.preventDefault();

  // Пусте значення або пробіли
  if (taskInput.value.trim() === "") {
    return;
  }

  // Create and add LI element
  const li = document.createElement("li");
  li.className = "collection-item";
  li.textContent = taskInput.value; // значення яке ввів користувач

  const taskText = document.createElement("span");
  taskText.className = "delete-item";
  taskText.innerHTML = '<i class="fa fa-remove"></i>';
  li.append(taskText);

  taskList.append(li);

  const editedIcon = document.createElement("span");
  editedIcon.className = "edit-item";
  editedIcon.innerHTML = '<i class="fa fa-edit"></i>';
  li.append(editedIcon);

  // Save to storage
  storeTaskInLocalStorage(taskInput.value);

  // Clear input value
  taskInput.value = "";
};

const removeTask = (event) => {
  const isDeleteIcon = event.target.classList.contains("fa-remove");

  if (isDeleteIcon) {
    const isApproved = confirm("Ви впевнені що хочете видалити це завдання?");

    if (isApproved) {
      // remove from DOM
      // console.log(event.target.parentElement.parentElement);
      const deletedLi = event.target.closest("li");
      // console.log(deletedLi);
      let listLi = Array.from(document.querySelectorAll(".collection-item"));
      //console.log(listLi);
      let indexOfDeletedLI = listLi.findIndex((li) => li === deletedLi);
      //console.log(indexOfDeletedLI);
      deletedLi.remove();

      //Знаходимо index of deleted li і передаємо у function removeTaskFromLocalStorage -  Tania's comment
      removeTaskFromLocalStorage(deletedLi.textContent, indexOfDeletedLI);
    }
  }
};

const editTask = (event) => {
  const isEditedIcon = event.target.classList.contains("fa-edit");

  if (isEditedIcon) {
    let editedLi = event.target.closest("li");
    let newText = prompt("Edit your task here", editedLi.textContent);
    editedLi.firstChild.textContent = newText.trim();
    let listLi = Array.from(document.querySelectorAll(".collection-item"));
    let indexOfEditedLi = listLi.findIndex((li) => li === editedLi);
    editTaskInLocalStorage(editedLi.textContent, indexOfEditedLi);
  }
};

const clearTasks = () => {
  taskList.innerHTML = "";
  clearTasksFromLocalStorage();
};

const filterTasks = (event) => {
  const text = event.target.value.toLowerCase();
  const list = document.querySelectorAll(".collection-item");

  list.forEach((task) => {
    const item = task.firstChild.textContent.toLowerCase();

    if (item.includes(text)) {
      // task.style.display = "block"; // task.hidden = true
      task.style.display = "list-item";
    } else {
      task.style.display = "none";
    }
  });
};

// init
getTasks();

// Event listeners

// document.addEventListener("DOMContentLoaded", () => {
//   getTasks();
// });

form.addEventListener("submit", addTask);

taskList.addEventListener("click", removeTask);

taskList.addEventListener("click", editTask);

clearButton.addEventListener("click", clearTasks);

filterInput.addEventListener("input", filterTasks);
