document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("foodForm");
  const list = document.getElementById("foodList");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("foodName").value.trim();
    const date = document.getElementById("foodDate").value;
    if (!name || !date) return;

    addFood(name, date);
    saveData();
    form.reset();
  });

  function addFood(name, date) {
    const li = document.createElement("li");
    const remaining = getRemainingDays(date);
    const formattedDate = formatDate(date);

    const status = document.createElement("span");
    status.className = "status";
    status.textContent =
      remaining < 0
        ? "期限切れ"
        : remaining === 0
        ? "本日まで"
        : `あと${remaining}日`;

    li.innerHTML = `<strong>${name}</strong> - ${formattedDate}`;
    li.appendChild(status);
    list.appendChild(li);
  }

  function getRemainingDays(dateStr) {
    const today = new Date();
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }

  function saveData() {
    const items = [];
    document.querySelectorAll("#foodList li").forEach((li) => {
      const name = li.querySelector("strong").textContent;
      const rawDate = li.textContent.match(/\d{4}年\d{1,2}月\d{1,2}日/)[0];
      const date = rawDate.replace(/年|月/g, "-").replace("日", "");
      items.push({ name, date });
    });
    localStorage.setItem("foods", JSON.stringify(items));
  }

  function loadData() {
    const data = JSON.parse(localStorage.getItem("foods") || "[]");
    data
      .sort((a, b) => new Date(a.date) - new Date(b.date)) // 期限順ソート
      .forEach((item) => addFood(item.name, item.date));
  }

  loadData();
});
