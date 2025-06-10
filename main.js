document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('item-form');
  const nameInput = document.getElementById('name');
  const dateInput = document.getElementById('date');
  const list = document.getElementById('item-list');

  loadItemsFromStorage();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const date = dateInput.value;

    if (!name || !date) return;

    const item = { name, date };
    addItemToDOM(item);
    saveItem(item);

    form.reset();
  });

  function addItemToDOM(item) {
    const li = document.createElement('li');

    const today = new Date();
    const itemDate = new Date(item.date);
    const diff = Math.floor((itemDate - today) / (1000 * 60 * 60 * 24));
    let status = '';

    if (diff < 0) {
      status = '❌ 期限切れ';
    } else if (diff === 0) {
      status = '⚠️ 本日まで';
    } else {
      status = `📅 あと${diff}日`;
    }

    li.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <span class="status">${formatDate(item.date)} - ${status}</span>
      </div>
      <button class="delete" title="削除">🗑</button>
    `;

    li.querySelector('.delete').addEventListener('click', () => {
      li.remove();
      deleteItem(item);
    });

    list.appendChild(li);
  }

  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${year}年${month}月${day}日`;
  }

  function saveItem(item) {
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
  }

  function deleteItem(item) {
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    const updated = items.filter(i => !(i.name === item.name && i.date === item.date));
    localStorage.setItem('items', JSON.stringify(updated));
  }

  function loadItemsFromStorage() {
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    // 期限順でソート
    items.sort((a, b) => new Date(a.date) - new Date(b.date));
    items.forEach(addItemToDOM);
  }
});
