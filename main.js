document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const nameInput = document.getElementById("foodName");
  const dateInput = document.getElementById("expiryDate");
  const categoryInput = document.getElementById("category");
  const list = document.getElementById("foodList");
  const sortSelect = document.getElementById("sortSelect");
  const searchInput = document.getElementById("searchInput");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const date = dateInput.value;
    const category = categoryInput.value;

    if (name && date) {
      const item = { name, date, category };
      saveItem(item);
      addItemToDOM(item);
      form.reset();
    }
  });

  function saveItem(item) {
    const items = JSON.parse(localStorage.getItem("foodItems") || "[]");
    items.push(item);
    localStorage.setItem("foodItems", JSON.stringify(items));
  }

  function loadItemsFromStorage() {
    const items = JSON.parse(localStorage.getItem("foodItems") || "[]");
    return items.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd}`;
  }

  function getRemainingDays(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(dateStr);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function getStatusText(days) {
    if (days < 0) return "期限切れ";
    if (days === 0) return "本日まで";
    return `あと${days}日`;
  }

  function addItemToDOM(item) {
    const li = document.createElement("li");
    const daysLeft = getRemainingDays(item.date);
    li.innerHTML = `
      <span class="food-name">${item.name}</span>
      <span class="food-meta">${formatDate(item.date)}（${getStatusText(daysLeft)}）</span>
      <span class="category-tag">${item.category}</span>
      <button class="delete-btn" title="削除">&#128465;</button>
    `;
    if (daysLeft < 0) li.classList.add("expired");

    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      li.remove();
      removeItem(item);
    });

    list.appendChild(li);
  }

  function removeItem(itemToRemove) {
    let items = JSON.parse(localStorage.getItem("foodItems") || "[]");
    items = items.filter(item => !(item.name === itemToRemove.name && item.date === itemToRemove.date));
    localStorage.setItem("foodItems", JSON.stringify(items));
  }

  function renderItems() {
    list.innerHTML = "";
    const query = searchInput.value.toLowerCase();
    const sortOption = sortSelect.value;
    let items = loadItemsFromStorage();

    if (query) {
      items = items.filter(item => item.name.toLowerCase().includes(query));
    }

    if (sortOption === "expiry") {
      items.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    items.forEach(addItemToDOM);
  }

  // 🔔 通知機能
  function showExpiryNotifications() {
    const items = loadItemsFromStorage();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiringToday = items.filter(item => {
      const expiry = new Date(item.date);
      expiry.setHours(0, 0, 0, 0);
      return expiry.getTime() === today.getTime();
    });

    const expired = items.filter(item => {
      const expiry = new Date(item.date);
      expiry.setHours(0, 0, 0, 0);
      return expiry.getTime() < today.getTime();
    });

    if (expiringToday.length || expired.length) {
      let message = "";
      if (expiringToday.length) {
        message += `⚠️ 本日までの食品:\n${expiringToday.map(i => `・${i.name}`).join("\n")}\n`;
      }
      if (expired.length) {
        message += `⛔ 期限切れ:\n${expired.map(i => `・${i.name}`).join("\n")}`;
      }
      alert(message);
    }
  }

  searchInput.addEventListener("input", renderItems);
  sortSelect.addEventListener("change", renderItems);

  renderItems();
  showExpiryNotifications();
});
