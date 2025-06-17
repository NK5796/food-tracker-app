document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("food-form");
  const nameInput = document.getElementById("food-name");
  const dateInput = document.getElementById("expiry-date");
  const itemList = document.getElementById("item-list");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = nameInput.value;
    const date = dateInput.value;
    if (!name || !date) return;

    const item = { name, date };
    saveItem(item);
    renderItems();
    form.reset();
  });

  function saveItem(item) {
    const items = loadItems();
    items.push(item);
    localStorage.setItem("food-items", JSON.stringify(items));
  }

  function loadItems() {
    return JSON.parse(localStorage.getItem("food-items")) || [];
  }

  function renderItems() {
    itemList.innerHTML = "";
    const items = loadItems();

    // 期限順にソート
    items.sort((a, b) => new Date(a.date) - new Date(b.date));

    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "item";

      const span = document.createElement("span");
      span.textContent = `${item.name} - ${formatDate(item.date)} (${getRemainingDays(item.date)})`;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerHTML = "🗑️";
      deleteBtn.onclick = () => {
        deleteItem(index);
      };

      li.appendChild(span);
      li.appendChild(deleteBtn);
      itemList.appendChild(li);
    });
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

  function getRemainingDays(dateStr) {
    const today = new Date();
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "期限切れ";
    if (diffDays === 0) return "本日まで";
    return `あと${diffDays}日`;
  }

  function deleteItem(index) {
    const items = loadItems();
    items.splice(index, 1);
    localStorage.setItem("food-items", JSON.stringify(items));
    renderItems();
  }

  renderItems();
});
