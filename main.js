document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("foodForm");
  const foodList = document.getElementById("foodList");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("foodName").value.trim();
    const date = document.getElementById("expiryDate").value;

    if (name && date) {
      addFoodItem(name, date);
      form.reset();
    }
  });

  function addFoodItem(name, expiry) {
    const li = document.createElement("li");

    const today = new Date();
    const expDate = new Date(expiry);
    expDate.setHours(0, 0, 0, 0); // ← 時間差によるズレを防止
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    let label = "";

    if (diff < 0) {
      label = `<span class="expired">（期限切れ）</span>`;
    } else if (diff === 0) {
      label = `<span class="due-today">（本日まで）</span>`;
    } else {
      label = `（あと${diff}日）`;
    }

    li.innerHTML = `
      ${name} - ${expiry.replace(/-/g, "/")} ${label}
      <button class="delete-btn" title="削除"><i class="fas fa-trash-alt"></i></button>
    `;

    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      li.remove();
    });

    foodList.appendChild(li);
  }
});
