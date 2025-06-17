// main.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const nameInput = document.getElementById("food-name");
  const dateInput = document.getElementById("expiry-date");
  const foodList = document.getElementById("food-list");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const expiry = dateInput.value;
    if (name && expiry) {
      addItem({ name, expiry });
      nameInput.value = "";
      dateInput.value = "";
    }
  });

  function addItem(item) {
    const items = getItems();
    items.push(item);
    saveItems(items);
    renderItems(items);
  }

  function deleteItem(index) {
    const items = getItems();
    items.splice(index, 1);
    saveItems(items);
    renderItems(items);
  }

  function getItems() {
    return JSON.parse(localStorage.getItem("foods")) || [];
  }

  function saveItems(items) {
    localStorage.setItem("foods", JSON.stringify(items));
  }

  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${year}年${month}月${day}日`;
  }

  function renderItems(items) {
    foodList.innerHTML = "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 日付順でソート
    items.sort((a, b) => new Date(a.expiry) - new Date(b.expiry));

    items.forEach((item, index) => {
      const li = document.createElement("li");
      const expiry = new Date(item.expiry);
      expiry.setHours(0, 0, 0, 0);
      const remaining = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

      let status = "";
      if (remaining < 0) status = "期限切れ";
      else if (remaining === 0) status = "本日まで";
      else status = `あと${remaining}日`;

      const info = document.createElement("span");
      info.textContent = `${item.name}（${formatDate(item.expiry)}） - ${status}`;
      if (status === "期限切れ") info.classList.add("expired");
      else if (status === "本日まで") info.classList.add("due-today");

      const delBtn = document.createElement("button");
      delBtn.className = "delete-btn";
      delBtn.innerHTML = '<i class="fas fa-trash"></i>';
      delBtn.addEventListener("click", () => deleteItem(index));

      li.appendChild(info);
      li.appendChild(delBtn);
      foodList.appendChild(li);
    });
  }

  function loadItemsFromStorage() {
    const items = getItems();
    renderItems(items);
  }

  loadItemsFromStorage();
});
