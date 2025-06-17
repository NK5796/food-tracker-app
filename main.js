document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("item-form");
  const nameInput = document.getElementById("name");
  const dateInput = document.getElementById("date");
  const categorySelect = document.getElementById("category");
  const itemList = document.getElementById("item-list");
  const newCategoryInput = document.getElementById("new-category-name");
  const addCategoryBtn = document.getElementById("add-category");
  const removeCategoryBtn = document.getElementById("remove-category");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value;
    const date = dateInput.value;
    const category = categorySelect.value;
    if (!name || !date || !category) return;

    const item = { name, date, category };
    saveItem(item);
    nameInput.value = "";
    dateInput.value = "";
    categorySelect.value = "";
  });

  addCategoryBtn.addEventListener("click", () => {
    const newCat = newCategoryInput.value.trim();
    if (newCat && ![...categorySelect.options].some(opt => opt.value === newCat)) {
      const opt = document.createElement("option");
      opt.value = newCat;
      opt.textContent = newCat;
      categorySelect.appendChild(opt);
      newCategoryInput.value = "";
    }
  });

  removeCategoryBtn.addEventListener("click", () => {
    const target = newCategoryInput.value.trim();
    if (!target) return;
    const options = [...categorySelect.options];
    const toRemove = options.find(opt => opt.value === target);
    if (toRemove) {
      categorySelect.removeChild(toRemove);
      newCategoryInput.value = "";
    }
  });

  function saveItem(item) {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
    renderItems();
  }

  function renderItems() {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    items.sort((a, b) => new Date(a.date) - new Date(b.date));
    itemList.innerHTML = "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.classList.add("item");

      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      const diff = Math.floor((itemDate - today) / (1000 * 60 * 60 * 24));

      let status = "";
      if (diff < 0) status = "（期限切れ）";
      else if (diff === 0) status = "（本日まで）";
      else status = `（あと${diff}日）`;

      const span = document.createElement("span");
      span.innerHTML = `
        <strong>${item.name}</strong> - ${item.category}<br>
        ${formatDate(item.date)} ${status}
      `;

      const del = document.createElement("button");
      del.classList.add("delete-btn");
      del.innerHTML = "🗑️";
      del.onclick = () => {
        deleteItem(index);
      };

      li.appendChild(span);
      li.appendChild(del);
      itemList.appendChild(li);
    });
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }

  function deleteItem(index) {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    renderItems();
  }

  renderItems();
});
