document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("item-form");
  const nameInput = document.getElementById("name");
  const dateInput = document.getElementById("date");
  const categoryInput = document.getElementById("category");
  const itemList = document.getElementById("item-list");

  function saveItems(items) {
    localStorage.setItem("items", JSON.stringify(items));
  }

  function loadItems() {
    return JSON.parse(localStorage.getItem("items") || "[]");
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${y}/${m}/${d}`;
  }

  function getRemainingText(dateStr) {
    const today = new Date();
    const exp = new Date(dateStr);
    const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return "期限切れ";
    if (diff === 0) return "本日まで";
    return `あと${diff}日`;
  }

  function renderItems(items) {
    itemList.innerHTML = "";
    items.sort((a, b) => new Date(a.date) - new Date(b.date));

    items.forEach((item, index) => {
      const li = document.createElement("li");

      const info = document.createElement("div");
      info.className = "item-info";
      info.innerHTML = `
        <strong>${item.name}</strong>（${item.category}）<br>
        <span class="status">${formatDate(item.date)} - ${getRemainingText(item.date)}</span>
      `;

      const del = document.createElement("button");
      del.className = "delete";
      del.innerHTML = "🗑️";
      del.onclick = () => {
        items.splice(index, 1);
        saveItems(items);
        renderItems(items);
      };

      li.appendChild(info);
      li.appendChild(del);
      itemList.appendChild(li);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newItem = {
      name: nameInput.value,
      date: dateInput.value,
      category: categoryInput.value
    };

    const items = loadItems();
    items.push(newItem);
    saveItems(items);
    renderItems(items);

    nameInput.value = "";
    dateInput.value = "";
    categoryInput.value = "野菜";
  });

  renderItems(loadItems());
});
