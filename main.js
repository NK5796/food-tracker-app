document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('item-form');
  const foodInput = document.getElementById('food');
  const dateInput = document.getElementById('date');
  const list = document.getElementById('item-list');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const food = foodInput.value.trim();
    const date = dateInput.value;
    if (!food || !date) return;

    const item = { food, date };
    addItemToDOM(item);
    saveItemToStorage(item);
    form.reset();
  });

  function addItemToDOM(item) {
    const li = document.createElement('li');
    li.className = 'item';

    const foodSpan = document.createElement('span');
    foodSpan.textContent = item.food;

    const status = getStatus(item.date);
    const dateSpan = document.createElement('span');
    dateSpan.className = 'date';
    dateSpan.textContent = `${formatDate(item.date)}（${status}）`;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => {
      li.remove();
      deleteItemFromStorage(item);
    };

    li.appendChild(foodSpan);
    li.appendChild(dateSpan);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  }

  function formatDate(date) {
    if (!date || !date.includes("-")) return "不明な日付";
    const [year, month, day] = date.split("-");
    return `${year}年${month}月${day}日`;
  }

  function getStatus(dateStr) {
    const today = new Date();
    const target = new Date(dateStr);
    const diff = Math.floor((target - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return "期限切れ";
    if (diff === 0) return "本日まで";
    return `あと${diff}日`;
  }

  function saveItemToStorage(item) {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
  }

  function deleteItemFromStorage(item) {
    let items = JSON.parse(localStorage.getItem('items')) || [];
    items = items.filter(i => !(i.food === item.food && i.date === item.date));
    localStorage.setItem('items', JSON.stringify(items));
  }

  function loadItemsFromStorage() {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    // 期限が近い順に並べる
    items.sort((a, b) => new Date(a.date) - new Date(b.date));
    items.forEach(addItemToDOM);
  }

  loadItemsFromStorage();
});
