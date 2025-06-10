document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("food-form");
  const foodList = document.getElementById("food-list");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("food-name").value.trim();
    const date = document.getElementById("expiration-date").value;

    if (!name || !date) return;

    addFoodItem(name, date);
    form.reset();
  });

  function addFoodItem(name, date) {
    const li = document.createElement("li");
    const statusSpan = document.createElement("span");
    const deleteButton = document.createElement("button");

    const daysRemaining = getDaysRemaining(date);

    if (daysRemaining < 0) {
      statusSpan.textContent = `期限切れ（${formatDate(date)}）`;
      statusSpan.classList.add("expired");
    } else if (daysRemaining === 0) {
      statusSpan.textContent = `本日まで（${formatDate(date)}）`;
      statusSpan.classList.add("today");
    } else {
      statusSpan.textContent = `あと${daysRemaining}日（${formatDate(date)}）`;
    }

    deleteButton.className = "delete-btn";
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.onclick = () => li.remove();

    li.innerHTML = `<strong>${name}</strong><br>`;
    li.appendChild(statusSpan);
    li.appendChild(deleteButton);

    foodList.appendChild(li);
    sortFoodList();
  }

  function getDaysRemaining(dateStr) {
    const today = new Date();
    const expiration = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    expiration.setHours(0, 0, 0, 0);

    const diffTime = expiration - today;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd}`;
  }

  function sortFoodList() {
    const items = Array.from(foodList.children);
    items.sort((a, b) => {
      const textA = a.querySelector("span").textContent;
      const textB = b.querySelector("span").textContent;
      const matchA = textA.match(/(\d{4}\/\d{2}\/\d{2})/);
      const matchB = textB.match(/(\d{4}\/\d{2}\/\d{2})/);
      const dateA = new Date(matchA ? matchA[1] : "");
      const dateB = new Date(matchB ? matchB[1] : "");
      return dateA - dateB;
    });

    items.forEach(item => foodList.appendChild(item));
  }
});
