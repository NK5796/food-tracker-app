document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("foodForm");
  const foodList = document.getElementById("foodList");

  let foods = [];

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("foodName").value.trim();
    const date = document.getElementById("foodDate").value;

    if (!name || !date) return;

    foods.push({ name, date });
    foods.sort((a, b) => new Date(a.date) - new Date(b.date)); // 期限順にソート
    renderList();

    form.reset();
  });

  function renderList() {
    foodList.innerHTML = "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    foods.forEach((item) => {
      const itemDate = new Date(item.date);
      const daysLeft = Math.ceil((itemDate - today) / (1000 * 60 * 60 * 24));

      let badgeClass = "safe";
      if (daysLeft <= 1) badgeClass = "danger";
      else if (daysLeft <= 3) badgeClass = "warn";

      const div = document.createElement("div");
      div.className = "food-item";
      div.innerHTML = `
        <span>${item.name}（${item.date.replace(/-/g, "/")}）</span>
        <span class="badge ${badgeClass}">あと${daysLeft}日</span>
      `;
      foodList.appendChild(div);
    });
  }
});
