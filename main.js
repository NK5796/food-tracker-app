document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("food-form");
  const foodList = document.getElementById("food-list");
  const sortOption = document.getElementById("sort-option");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("food-name").value;
    const date = document.getElementById("food-date").value;
    const category = document.getElementById("food-category").value;
    if (!name || !date) return;

    const item = { name, date, category };
    saveItem(item);
    form.reset();
  });

  sortOption.addEventListener("change", renderItems);

  function saveItem(item) {
    const items = JSON.parse(localStorage.getItem("foods") || "[]");
    items.push(item);
    localStorage.setItem("foods", JSON.stringify(items));
    renderItems();
    notifyIfNearExpiry(item);
  }

  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${year}年${month}月${day}日`;
  }

  function getStatus(dateStr) {
    const today = new Date();
    const target = new Date(dateStr);
    const diff = (target - today) / (1000 * 60 * 60 * 24);
    if (diff < 0) return "expired";
    if (diff < 1) return "today";
    if (diff < 3) return "soon";
    return "";
  }

  function notifyIfNearExpiry(item) {
    const status = getStatus(item.date);
    if (status === "today" || status === "soon") {
      if (Notification.permission === "granted") {
        new Notification("期限が近い食材", {
          body: `${item.name}（${formatDate(item.date)}）`,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  }

  function renderItems() {
    const items = JSON.parse(localStorage.getItem("foods") || "[]");
    const sorted = [...items];

    if (sortOption.value === "期限順") {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption.value === "カテゴリ順") {
      sorted.sort((a, b) => a.category.localeCompare(b.category));
    }

    foodList.innerHTML = "";
    sorted.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "food-item";

      const info = document.createElement("div");
      info.className = "food-info";

      const name = document.createElement("strong");
      name.textContent = `${item.name}（${item.category}）`;

      const date = document.createElement("span");
      date.textContent = `期限: ${formatDate(item.date)}`;
      const status = getStatus(item.date);
      if (status) date.classList.add(status);

      info.appendChild(name);
      info.appendChild(date);

      const delBtn = document.createElement("button");
      delBtn.innerHTML = "🗑️";
      delBtn.className = "delete-btn";
      delBtn.onclick = () => {
        items.splice(index, 1);
        localStorage.setItem("foods", JSON.stringify(items));
        renderItems();
      };

      li.appendChild(info);
      li.appendChild(delBtn);
      foodList.appendChild(li);
    });
  }

  renderItems();
});
