document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("item-form");
  const nameInput = document.getElementById("item-name");
  const dateInput = document.getElementById("item-date");
  const categoryInput = document.getElementById("item-category");
  const itemsContainer = document.getElementById("items");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const item = {
      name: nameInput.value.trim(),
      date: dateInput.value,
      category: categoryInput.value
    };
    saveItem(item);
    renderItems();
    form.reset();
  });

  function saveItem(item) {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    items.push(item);
    items.sort((a, b) => new Date(a.date) - new Date(b.date));
    localStorage.setItem("items", JSON.stringify(items));
  }

  function getRemainingDays(dateStr) {
    const today = new Date();
    const target = new Date(dateStr);
    const diff = Math.floor((target - today) / (1000 * 60 * 60 * 24));
    return diff;
  }

  function renderItems() {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    itemsContainer.innerHTML = "";

    items.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "item";

      const remaining = getRemainingDays(item.date);
      let status = "";
      if (remaining < 0) {
        status = "【期限切れ】";
      } else if (remaining === 0) {
        status = "【本日まで】";
      } else {
        status = `【あと${remaining}日】`;
      }

      div.innerHTML = `
        <strong>${item.name}</strong>（${item.category}）<br>
        消費期限：${item.date} ${status}
        <button class="delete-btn" data-index="${index}">🗑</button>
      `;

      div.querySelector(".delete-btn").addEventListener("click", () => {
        deleteItem(index);
      });

      itemsContainer.appendChild(div);
    });
  }

  function deleteItem(index) {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    renderItems();
  }

  renderItems();
});
