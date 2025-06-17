document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const nameInput = document.getElementById("name");
  const dateInput = document.getElementById("date");
  const categorySelect = document.getElementById("category");
  const list = document.getElementById("itemList");
  const sortBy = document.getElementById("sort");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const date = dateInput.value;
    const category = categorySelect.value;

    if (name && date) {
      const item = { name, date, category };
      saveItem(item);
      addItemToDOM(item);
      form.reset();
    }
  });

  function saveItem(item) {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
  }

  function loadItemsFromStorage() {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    renderItems(items);
  }

  function renderItems(items) {
    list.innerHTML = "";
    const sorted = [...items].sort((a, b) => {
      if (sortBy.value === "date") {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy.value === "category") {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

    sorted.forEach(addItemToDOM);
  }

  function addItemToDOM(item) {
    const div = document.createElement("div");
    div.className = "item";

    const now = new Date();
    const due = new Date(item.date);
    const timeDiff = Math.floor((due - now) / (1000 * 60 * 60 * 24));
    let status = "";
    if (timeDiff < 0) status = "<span class='expired'>期限切れ</span>";
    else if (timeDiff === 0) status = "<span class='warning'>本日まで</span>";
    else status = `あと${timeDiff}日`;

    div.innerHTML = `
      <div class="item-info">
        <strong>${item.name}</strong>（${status}）<br>
        <span class="category">カテゴリ: ${item.category} / ${item.date.replace(/-/g, "/")}</span>
      </div>
      <button class="delete-btn" title="削除">&#128465;</button>
    `;

    div.querySelector(".delete-btn").addEventListener("click", () => {
      deleteItem(item);
      div.remove();
    });

    list.appendChild(div);
  }

  function deleteItem(targetItem) {
    let items = JSON.parse(localStorage.getItem("items") || "[]");
    items = items.filter(item =>
      item.name !== targetItem.name ||
      item.date !== targetItem.date ||
      item.category !== targetItem.category
    );
    localStorage.setItem("items", JSON.stringify(items));
  }

  sortBy.addEventListener("change", loadItemsFromStorage);

  loadItemsFromStorage();
});
