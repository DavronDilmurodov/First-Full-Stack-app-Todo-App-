const BASE_URL = "http://localhost:4000";

let todoList = document.querySelector(".todo-list");
let template = document.querySelector(".template").content;
let form = document.querySelector(".form");
let input = document.querySelector(".form-input");

fetch(BASE_URL, {
  method: "GET",
})
  .then((res) => res.json())
  .then((data) => onRender(data))
  .catch((err) => console.log(err));

const onRender = (arr) => {
  todoList.innerHTML = null;
  arr.forEach((el) => {
    let todo = template.cloneNode(true);
    let elLabel = todo.querySelector(".todo-text");
    let elLi = todo.querySelector(".list-item");

    elLabel.textContent = el.task;
    elLi.dataset.id = el.id;
    todoList.appendChild(todo);
  });
};

const onSubmit = (e) => {
  e.preventDefault();
  const id = Date.now();

  let inputValue = input.value.trim();
  let newTodo = {
    id,
    task: inputValue,
  };
  input.value = "";

  newTodo.task
    ? fetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(newTodo),
      })
        .then((res) => res.json())
        .then((data) => onRender(data))
        .catch((err) => console.log(err))
    : alert("Please add a task");
};

const onDelete = (id) => {
  fetch(`${BASE_URL}`, {
    method: "DELETE",
    body: JSON.stringify({ id }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => onRender(data))
    .catch((err) => console.log(err));
};

const onEdit = (id) => {
  let todo = template.cloneNode(true);
  let elLabel = todo.querySelector(".todo-text");
  let textFromPrompt = prompt("Edit your todo");
  elLabel.textContent = textFromPrompt;
  let editedText = elLabel.textContent;

  const editedObject = {
    id,
    task: editedText,
  };

  fetch(`${BASE_URL}`, {
    method: "PUT",
    body: JSON.stringify(editedObject),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => onRender(data))
    .catch((err) => console.log(err));
};

const eventDelegation = (e) => {
  let parentElement = e.target.parentNode.closest(".list-item");
  let elId = Number(parentElement.dataset.id);
  if (e.target.matches(".btn-delete")) {
    onDelete(elId);
  } else if (e.target.matches(".btn-edit")) {
    onEdit(elId);
  }
};

form.addEventListener("submit", onSubmit);
todoList.addEventListener("click", eventDelegation);
