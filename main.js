document.addEventListener("DOMContentLoaded", () => {
  const foodForm = document.getElementById("foodForm");
  const foodNameInput = document.getElementById("foodName");
  const expirationDateInput = document.getElementById("expirationDate");
  const foodList = document.getElementById("foodList");

  foodForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = foodNameInput.value.trim();
    const date = expirationDateInput.value;

    if (name && date) {
      const item = { name, date };
      saveItem(item);
      foodNameInput.value = "";
      expirationDateInput.value = "";
      loadItems();
    }
  });

  function saveItem(item) {
    const items = JSON.parse(localStorage.getItem("foods") || "[]");
    items.push(item);
    localStorage.setItem("foods", JSON.stringify(items));
  }

  function loadItems() {
    foodList.innerHTML = "";
    const items = JSON.parse(localStorage.getItem("foods") || "[]");
    items.sort((a, b) => new Date(a.date) - new Date(b.date));
    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "food-item";

      const info = document.createElement("div");
      info.className = "info";
      const today = new Date();
      const exp = new Date(item.date);
      const diff = Math.floor((exp - today) / (1000 * 60 * 60 * 24));

      let status = "";
      if (diff < 0) status = "❌ 期限切れ";
      else if (diff === 0) status = "⚠️ 本日まで";
      else status = `⏳ あと${diff}日`;

      info.innerHTML = `<strong>${item.name}</strong><div class="status">${item.date.replace(/-/g, "/")}（${status}）</div>`;

      const delBtn = document.createElement("button");
      delBtn.innerHTML = "🗑️";
      delBtn.onclick = () => {
        items.splice(index, 1);
        localStorage.setItem("foods", JSON.stringify(items));
        loadItems();
      };

      li.appendChild(info);
      li.appendChild(delBtn);
      foodList.appendChild(li);
    });
  }

  loadItems();
});
