// main.js

const form = document.querySelector("form");
const itemNameInput = document.getElementById("item-name");
const itemDateInput = document.getElementById("item-date");
const itemList = document.getElementById("item-list");

// 保存データの読み込み
window.addEventListener("DOMContentLoaded", loadItemsFromStorage);

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = itemNameInput.value.trim();
  const date = itemDateInput.value;

  if (!name || !date) return;

  const item = { name, date };
  addItemToDOM(item);
  saveItemToStorage(item);

  itemNameInput.value = "";
  itemDateInput.value = "";
});

function addItemToDOM(item) {
  const li = document.createElement("li");
  li.classList.add("item");

  const today = new Date();
  const dueDate = new Date(item.date);
  const diffTime = dueDate.getTime() - today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let statusText = "";
  if (diffDays < 0) {
    statusText = "期限切れ";
    li.classList.add("expired");
  } else if (diffDays === 0) {
    statusText = "本日まで";
  } else {
    statusText = `あと${diffDays}日`;
  }

  li.innerHTML = `
    <span class="item-name">${item.name}</span>
    <span class="item-date">（${formatDate(item.date)}：${statusText}）</span>
    <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
  `;

  li.querySelector(".delete-btn").addEventListener("click", function () {
    li.remove();
    deleteItemFromStorage(item);
  });

  itemList.appendChild(li);
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${year}年${month}月${day}日`;
}

function saveItemToStorage(item) {
  const items = getItemsFromStorage();
  items.push(item);
  localStorage.setItem("foodItems", JSON.stringify(items));
}

function getItemsFromStorage() {
  return JSON.parse(localStorage.getItem("foodItems")) || [];
}

function loadItemsFromStorage() {
  const items = getItemsFromStorage();
  items.sort((a, b) => new Date(a.date) - new Date(b.date));
  items.forEach(addItemToDOM);
}

function deleteItemFromStorage(itemToDelete) {
  let items = getItemsFromStorage();
  items = items.filter(item => !(item.name === itemToDelete.name && item.date === itemToDelete.date));
  localStorage.setItem("foodItems", JSON.stringify(items));
}
