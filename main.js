document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('foodForm');
  const tableBody = document.getElementById('foodTableBody');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('foodName').value.trim();
    const date = document.getElementById('expiryDate').value;

    if (!name || !date) return;

    addFoodItem(name, date);
    form.reset();
  });

  function addFoodItem(name, date) {
    const tr = document.createElement('tr');

    const nameTd = document.createElement('td');
    nameTd.textContent = name;

    const dateTd = document.createElement('td');
    dateTd.textContent = formatDateDisplay(date);

    const daysLeft = calculateDaysLeft(date);
    const daysTd = document.createElement('td');
    if (daysLeft < 0) {
      daysTd.textContent = '期限切れ';
      tr.classList.add('expired');
    } else if (daysLeft === 0) {
      daysTd.textContent = '本日まで';
      tr.classList.add('today');
    } else {
      daysTd.textContent = `あと${daysLeft}日`;
    }

    tr.appendChild(nameTd);
    tr.appendChild(dateTd);
    tr.appendChild(daysTd);

    tableBody.appendChild(tr);
  }

  function calculateDaysLeft(exp) {
    const [y, m, d] = exp.split('-').map(Number);
    const target = new Date(y, m - 1, d); // 月は0始まり

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diff = target - today;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  function formatDateDisplay(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${y}年${m}月${d}日`;
  }
});
