document.addEventListener("DOMContentLoaded", () => {
  const foodNameInput = document.getElementById("food-name");
  const expirationInput = document.getElementById("expiration-date");
  const addButton = document.getElementById("add-button");
  const foodList = document.getElementById("food-list");

  let foods = JSON.parse(localStorage.getItem("foods")) || [];

  function saveFoods() {
    localStorage.setItem("foods", JSON.stringify(foods));
  }

  function renderFoods() {
    foodList.innerHTML = "";

    // 日付順にソート
    const sortedFoods = [...foods].sort((a, b) => new Date(a.expiration) - new Date(b.expiration));

    sortedFoods.forEach(food => {
      const li = document.createElement("li");

      const daysLeft = Math.ceil((new Date(food.expiration) - new Date()) / (1000 * 60 * 60 * 24));
      let badge = "";

      if (daysLeft < 0) {
        badge = `<span class="expired">期限切れ</span>`;
      } else if (daysLeft === 0) {
        badge = `<span class="today">今日まで</span>`;
      } else {
        badge = `<span class="days">あと${daysLeft}日</span>`;
      }

      li.innerHTML = `<strong>${food.name}</strong>（${food.expiration}） ${badge}`;
      foodList.appendChild(li);
    });
  }

  addButton.addEventListener("click", () => {
    const name = foodNameInput.value.trim();
    const expiration = expirationInput.value;

    if (name && expiration) {
      foods.push({ name, expiration });
      saveFoods();
      renderFoods();
      foodNameInput.value = "";
      expirationInput.value = "";
    }
  });

  renderFoods(); // 初回表示
});
