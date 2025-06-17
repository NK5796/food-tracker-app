document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('item-form');
  const itemList = document.getElementById('item-list');
  const categorySelect = document.getElementById('category');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const category = categorySelect.value;

    if (!name || !date) return;

    const item = { name, date, category };
    saveItem(item);
    addItemToDOM(item);
    form.reset();
  });

  // カテゴリ追加機能
  categorySelect.addEventListener('change', () => {
    if (categorySelect.value === '+') {
      const newCategory = prompt('新しいカテゴリ名を入力してください:');
      if (newCategory && ![...categorySelect.options].some(opt => opt.value === newCategory)) {
        const option = document.createElement('option');
        option.value = newCategory;
        option.textContent = newCategory;
        categorySelect.insertBefore(option, categorySelect.lastElementChild); // 「+」の前に挿入
        categorySelect.value = newCategory;
      } else {
        categorySelect.value = categorySelect.options[0].value;
      }
    }
  });

  function saveItem(item) {
    const items = getItems();
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
  }

  function getItems() {
    return JSON.parse(localStorage.getItem('items')) || [];
  }

  function formatDate(dateStr) {
    const today = new Date();
    const target = new Date(dateStr);
    const diffTime = target.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return '期限切れ';
    if (diffDays === 0) return '本日まで';
    return `あと${diffDays}日`;
  }

  function addItemToDOM(item) {
    const li = document.createElement('li');
    li.className = 'item';

    const span = document.createElement('span');
    span.innerHTML = `<strong>${item.name}</strong>（${item.category}） - ${formatDate(item.date)}`;
    li.appendChild(span);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.onclick = () => {
      li.remove();
      removeItem(item);
    };

    li.appendChild(deleteBtn);
    itemList.appendChild(li);
  }

  function removeItem(itemToRemove) {
    const items = getItems().filter(item =>
      !(item.name === itemToRemove.name && item.date === itemToRemove.date && item.category === itemToRemove.category)
    );
    localStorage.setItem('items', JSON.stringify(items));
  }

  function renderItems() {
    itemList.innerHTML = '';
    const items = getItems().sort((a, b) => new Date(a.date) - new Date(b.date));
    items.forEach(addItemToDOM);
  }

  renderItems();
});
