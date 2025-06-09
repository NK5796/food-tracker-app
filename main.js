document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("name");
  const dateInput = document.getElementById("date");
  const addBtn = document.getElementById("add");
  const list = document.getElementById("list");

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  }

  function calculateDaysLeft(expirationDate) {
    const today = new Date();
    const exp = new Date(expirationDate);
    const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    return diff;
  }

  function updateList() {
    list.innerHTML = "";
    const items = JSON.parse(localStorage.getItem("ingredients") || "[]");

    items.sort((a, b) => new Date(a.expiration) - new Date(b.expiration));

    items.forEach(item => {
      const li = document.createElement("li");
      const daysLeft = calculateDaysLeft(item.expiration);
      const formattedDate = formatDate(item.expiration);

      let label = "";
      let status = "";

      if (daysLeft < 0) {
        label = "期限切れ";
        status = "expired";
      } else if (daysLeft === 0) {
        label = "本日まで";
        status = "today";
      } else {
        label = `${daysLeft}日後`;
        status = "days";
      }

      li.innerHTML = `${item.name}（期限：${formattedDate}） <span class="${status}">${label}</span>`;
      list.appendChild(li);
    });
  }

  addBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const date = dateInput.value;

    if (!name || !date) return;

    const items = JSON.parse(localStorage.getItem("ingredients") || "[]");
    items.push({ name, expiration: date });
    localStorage.setItem("ingredients", JSON.stringify(items));

    nameInput.value = "";
    dateInput.value = "";
    updateList();
  });

  updateList();
});
