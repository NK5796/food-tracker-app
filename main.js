document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const nameInput = document.getElementById('name');
  const dateInput = document.getElementById('date');
  const categorySelect = document.getElementById('category');
  const newCategoryBtn = document.getElementById('addCategory');
  const sortSelect = document.getElementById('sortOption');
  const list = document.getElementById('itemList');

  function saveItems(items) {
    localStorage.setItem('foodItems', JSON.stringify(items));
  }

  function loadItems() {
    return JSON.parse(localStorage.getItem('foodItems') || '[]');
  }

  function formatDate(dateStr) {
    const today = new Date();
    const target = new Date(dateStr);
    const diff = Math.floor((target - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return '期限切れ';
    if (diff === 0) return '本日まで';
    return `あと${diff}日`;
  }

  function renderItems() {
    const items = loadItems();
    const sorted = sortItems(items);
    list.innerHTML = '';

    sorted.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${item.name}（${formatDate(item.date)}）<br>カテゴリ: ${item.category}</span>
        <button class="remove-button" data-index="${index}">🗑</button>
      `;
      list.appendChild(li);
    });
  }

  function sortItems(items) {
    const mode = sortSelect.value;
    if (mode === '期限順') {
      return items.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (mode === 'カテゴリ順') {
      return items.sort((a, b) => a.category.localeCompare(b.category));
    }
    return items;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const date = dateInput.value;
    const category = categorySelect.value;

    if (!name || !date) return;

    const items = loadItems();
    items.push({ name, date, category });
    saveItems(items);

    nameInput.value = '';
    dateInput.value = '';
    renderItems();
  });

  newCategoryBtn.addEventListener('click', () => {
    const newCategory = prompt('新しいカテゴリ名を入力してください:');
    if (newCategory && ![...categorySelect.options].some(opt => opt.value === newCategory)) {
      const opt = document.createElement('option');
      opt.value = newCategory;
      opt.textContent = newCategory;
      categorySelect.appendChild(opt);
    }
  });

  list.addEventListener('click', e => {
    if (e.target.classList.contains('remove-button')) {
      const index = e.target.dataset.index;
      const items = loadItems();
      items.splice(index, 1);
      saveItems(items);
      renderItems();
    }
  });

  sortSelect.addEventListener('change', renderItems);

  renderItems();
});
