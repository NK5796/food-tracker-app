document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("food-form");
  const list = document.getElementById("food-list");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("food-name").value.trim();
    const date = document.getElementById("food-date").value;

    if (!name || !date) return;

    addFood(name, date);

    form.reset();
  });

  function addFood(name, dateStr) {
    const li = document.createElement("li");
    li.className = "food-item";

    const today = new Date();
    const target = new Date(dateStr);
    const timeDiff = target.setHours(0,0,0,0) - today.setHours(0,0,0,0);
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    let statusText = "";
    if (days < 0) {
      statusText = "期限切れ";
    } else if (days === 0) {
      statusText = "本日まで";
    } else {
      statusText = `あと${days}日`;
    }

    const formattedDate = new Date(dateStr).toLocaleDateString("ja-JP");

    li.innerHTML = `
      <div>
        <strong>${name}</strong><br>
        <span class="status">${formattedDate}（${statusText}）</span>
      </div>
      <button class="delete-btn" title="削除"><i class="fas fa-trash-alt"></i></button>
    `;

    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
    });

    list.appendChild(li);
    sortList();
  }

  function sortList() {
    const items = Array.from(list.children);
    items.sort((a, b) => {
      const dateA = getDateFromItem(a);
      const dateB = getDateFromItem(b);
      return dateA - dateB;
    });
    items.forEach(item => list.appendChild(item));
  }

  function getDateFromItem(item) {
    const text = item.querySelector(".status").textContent;
    const match = text.match(/^(\d{4}\/\d{1,2}\/\d{1,2})/);
    return match ? new Date(match[1]) : new Date(0);
  }
});
