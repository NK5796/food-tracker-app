document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("food-form");
  const nameInput = document.getElementById("food-name");
  const dateInput = document.getElementById("food-date");
  const categoryInput = document.getElementById("food-category");
  const sortOption = document.getElementById("sort-option");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const food = {
      name: nameInput.value,
      date: dateInput.value,
      category: categoryInput.value
    };
    saveItem(food);
    form.reset();
  });

  sortOption.addEventListener("change", renderItems);
  loadItemsFromStorage();
  requestNotificationPermission();
});

function saveItem(item) {
  const items = getItems();
  items.push(item);
  localStorage.setItem("foods", JSON.stringify(items));
  renderItems();
}

function getItems() {
  return JSON.parse(localStorage.getItem("foods")) || [];
}

function renderItems() {
  const list = document.getElementById("food-list");
  const items = getItems();
  const sortValue = document.getElementById("sort-option").value;

  if (sortValue === "期限順") {
    items.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortValue === "カテゴリ順") {
    items.sort((a, b) => a.category.localeCompare(b.category));
  }

  list.innerHTML = "";
  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "food-item";

    const info = document.createElement("div");
    info.className = "food-info";

    const title = document.createElement("span");
    title.textContent = `${item.name} (${item.category})`;

    const status = document.createElement("span");
    status.className = "food-status";
    status.textContent = getStatus(item.date);

    info.appendChild(title);
    info.appendChild(status);

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.innerHTML = "🗑️";
    delBtn.addEventListener("click", () => deleteItem(index));

    li.appendChild(info);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  checkAndNotify();
}

function deleteItem(index) {
  const items = getItems();
  items.splice(index, 1);
  localStorage.setItem("foods", JSON.stringify(items));
  renderItems();
}

function getStatus(dateStr) {
  const today = new Date();
  const expiry = new Date(dateStr);
  expiry.setHours(0,0,0,0);
  today.setHours(0,0,0,0);

  const diff = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "期限切れ";
  if (diff === 0) return "本日まで";
  return `あと${diff}日`;
}

function loadItemsFromStorage() {
  renderItems();
}

// 通知の許可をリクエスト
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        checkAndNotify();
      }
    });
  }
}

// 通知を送る
function checkAndNotify() {
  if (Notification.permission !== "granted") return;

  const items = getItems();
  const today = new Date();
  today.setHours(0,0,0,0);

  items.forEach(item => {
    const expiry = new Date(item.date);
    expiry.setHours(0,0,0,0);
    const diff = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

    if (diff < 0 || diff === 0) {
      new Notification("📢 食材アラート", {
        body: `「${item.name}」は${diff === 0 ? "本日まで" : "期限切れ"}です`
      });
    }
  });
}
