document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("itemForm");
  const nameInput = document.getElementById("name");
  const dateInput = document.getElementById("date");
  const categoryInput = document.getElementById("category");
  const itemList = document.getElementById("itemList");
  const sortSelect = document.getElementById("sort");

  let items = JSON.parse(localStorage.getItem("items")) || [];

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const date = dateInput.value;
    const category = categoryInput.value;

    if (!name || !date) return;

    items.push({ name, date, category });
    saveAndRender();
    form.reset();
  });

  sortSelect.addEventListener("change", saveAndRender);

  function saveAndRender() {
    localStorage.setItem("items", JSON.stringify(items));
    renderItems();
  }

  function renderItems() {
    itemList.innerHTML = "";

    const sorted = [...items];
    if (sortSelect.value === "date") {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      sorted.sort((a, b) => a.category.localeCompare(b.category));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    sorted.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "item";

      const info = document.createElement("div");
      info.className = "item-info";

      const date = new Date(item.date);
      date.setHours(0, 0, 0, 0);
      const diff = Math.floor((date - today) / (1000 * 60 * 60 * 24));

      let expireText = "";
      if (diff < 0) {
        expireText = "期限切れ";
      } else if (diff === 0) {
        expireText = "本日まで";
      } else {
        expireText = `あと${diff}日`;
      }

      info.innerHTML = `
        <div><strong>${item.name}</strong> <span class="item-category">[${item.category}]</span></div>
        <div class="item-expire">${item.date}（${expireText}）</div>
      `;

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑";
      delBtn.className = "delete";
      delBtn.addEventListener("click", () => {
        items.splice(index, 1);
        saveAndRender();
      });

      li.appendChild(info);
      li.appendChild(delBtn);
      itemList.appendChild(li);
    });
  }

  renderItems();
});
