document.addEventListener("DOMContentLoaded", () => {
  const itemForm = document.getElementById("itemForm");
  const itemList = document.getElementById("itemList");
  const categorySelect = document.getElementById("category");
  const newCategoryInput = document.getElementById("newCategory");
  const addCategoryBtn = document.getElementById("addCategory");
  const removeCategoryBtn = document.getElementById("removeCategory");

  itemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const date = document.getElementById("date").value;
    const category = categorySelect.value;

    if (name && date) {
      const item = { name, date, category };
      saveItem(item);
      renderItems();
      itemForm.reset();
    }
  });

  addCategoryBtn.addEventListener("click", () => {
    const newCat = newCategoryInput.value.trim();
    if (newCat && !Array.from(categorySelect.options).some(opt => opt.value === newCat)) {
      const option = document.createElement("option");
      option.value = newCat;
      option.textContent = newCat;
      categorySelect.appendChild(option);
      newCategoryInput.value = "";
    }
  });

  removeCategoryBtn.addEventListener("click", () => {
    const selected = categorySelect.value;
    if (["野菜", "肉"].includes(selected)) return;
    categorySelect.querySelector(`option[value="${selected}"]`)?.remove();
  });

  function saveItem(item) {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
  }

  function getDaysLeft(dateStr) {
    const today = new Date();
    const target = new Date(dateStr);
    const diff = Math.floor((target - today) / (1000 * 60 * 60 * 24));
    return diff;
  }

  function renderItems() {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    items.sort((a, b) => new Date(a.date) - new Date(b.date));
    itemList.innerHTML = "";

    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "item";

      const days = getDaysLeft(item.date);
      let msg = "";
      if (days < 0) msg = "期限切れ";
      else if (days === 0) msg = "本日まで";
      else msg = `あと ${days} 日`;

      li.innerHTML = `
        <span>${item.name} (${item.category})</span>
        <span class="days-left">${msg}</span>
      `;

      itemList.appendChild(li);
    });
  }

  renderItems();
});
