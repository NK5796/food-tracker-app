document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("foodForm");
  const list = document.getElementById("foodList");
  const searchBar = document.getElementById("searchBar");
  const filterCategory = document.getElementById("filterCategory");
  const sortOrder = document.getElementById("sortOrder");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("foodName").value;
    const date = document.getElementById("expiryDate").value;
    const category = document.getElementById("category").value;

    const item = { name, date, category };
    const items = getItems();
    items.push(item);
    saveItems(items);
    renderItems(items);
    form.reset();
  });

  searchBar.addEventListener("input", () => renderItems(getItems()));
  filterCategory.addEventListener("change", () => renderItems(getItems()));
  sortOrder.addEventListener("change", () => renderItems(getItems()));

  list.addEventListener("click", e => {
    if (e.target.classList.contains("delete-button")) {
      const index = e.target.dataset.index;
      const items = getItems();
      items.splice(index, 1);
      saveItems(items);
      renderItems(items);
    }
  });

  renderItems(getItems());

  function getItems() {
    return JSON.parse(localStorage.getItem("foods") || "[]");
  }

  function saveItems(items) {
    localStorage.setItem("foods", JSON.stringify(items));
  }

  function renderItems(items) {
    const filtered = items
      .filter(item =>
        item.name.includes(searchBar.value) &&
        (filterCategory.value === "すべて" || item.category === filterCategory.value)
      )
      .sort((a, b) => {
        return sortOrder.value === "期限昇順"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      });

    list.innerHTML = "";
    filtered.forEach((item, i) => {
      const li = document.createElement("li");
      li.className = "food-item";

      const today = new Date();
      const expiry = new Date(item.date);
      const diff = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
      let status = "";

      if (diff < 0) status = "<span class='expired'>(期限切れ)</span>";
      else if (diff === 0) status = "<span class='urgent'>(本日まで)</span>";
      else status = `（あと${diff}日）`;

      li.innerHTML = `
        <span>${item.name} - ${formatDate(item.date)} ${status}</span>
        <button class="delete-button" data-index="${i}">🗑️</button>
      `;
      list.appendChild(li);
    });
  }

  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${year}年${month}月${day}日`;
  }
});
