const itemList = document.getElementById("itemList");

function calculateDaysLeft(expiryDateStr) {
  const today = new Date();
  const expiryDate = new Date(expiryDateStr);
  const diff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function getStatusClass(daysLeft) {
  if (daysLeft < 0) return "expired";
  if (daysLeft === 0) return "due-today";
  return "";
}

function renderItems() {
  items.sort((a, b) => new Date(a.date) - new Date(b.date));
  itemList.innerHTML = "";
  items.forEach(item => {
    const daysLeft = calculateDaysLeft(item.date);
    const div = document.createElement("div");
    div.className = `item ${getStatusClass(daysLeft)}`;
    div.innerHTML = `
      <strong>${item.name}</strong>（${item.date}）<br>
      <small>${daysLeft < 0 ? '期限切れ' : `あと ${daysLeft} 日`}</small>
    `;
    itemList.appendChild(div);
  });
}

const items = [];

document.getElementById("addButton").addEventListener("click", () => {
  const name = document.getElementById("nameInput").value.trim();
  const date = document.getElementById("dateInput").value;
  if (!name || !date) return;

  items.push({ name, date });
  renderItems();

  document.getElementById("nameInput").value = "";
  document.getElementById("dateInput").value = "";
});
