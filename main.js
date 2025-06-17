document.addEventListener("DOMContentLoaded", () => {
  const foodForm = document.getElementById("foodForm");
  const foodList = document.getElementById("foodList");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");

  foodForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("foodName").value;
    const date = document.getElementById("expiryDate").value;
    const category = document.getElementById("category").value;

    if (!name || !date) return;

    const item = { name, date, category };
    saveItem(item);
    foodForm.reset();
    renderItems();
  });

  searchInput.addEventListener("input", renderItems);
  sortSelect.addEventListener("change", renderItems);

  function saveItem(item) {
    const items = getItems();
    items.push(item);
    localStorage.setItem("foodItems", JSON.stringify(items));
  }

  function getItems() {
    return JSON.parse(localStorage.getItem("foodItems")) || [];
  }

  function renderItems() {
    const items = getItems();

    const filtered = items
      .filter((item) =>
        item.name.toLowerCase().includes(searchInput.value.toLowerCase())
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // 期限順固定

    foodList.innerHTML = "";
    filtered.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "food-item";

      const info = document.createElement("div");
      info.className = "food-info";
      info.innerHTML = `
        <strong>${item.name}</strong>（${item.category}）<br/>
        <span class="food-expiry ${getExpiryClass(item.date)}">${formatDate(
        item.date
      )}</span>
      `;

      const del = document.createElement("button");
      del.innerHTML = "🗑️";
      del.className = "delete-btn";
      del.addEventListener("click", () => {
        deleteItem(index);
      });

      li.appendChild(info);
      li.appendChild(del);
      foodList.appendChild(li);
    });
  }

  function deleteItem(index) {
    const items = getItems();
    items.splice(index, 1);
    localStorage.setItem("foodItems", JSON.stringify(items));
    renderItems();
  }

  function getExpiryClass(dateStr) {
    const today = new Date();
    const expiry = new Date(dateStr);
    const diff = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return "expired";
    if (diff === 0) return "due-today";
    return "";
  }

  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${year}年${month}月${day}日`;
  }

  renderItems();
});
