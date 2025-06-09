const list = document.getElementById('list');
let items = JSON.parse(localStorage.getItem('foodItems') || '[]');

function saveAndRender() {
  localStorage.setItem('foodItems', JSON.stringify(items));
  renderList();
}

function addItem() {
  const name = document.getElementById('name').value;
  const expiry = document.getElementById('expiry').value;
  if (!name || !expiry) return alert('両方入力してください');
  items.push({ name, expiry });
  document.getElementById('name').value = '';
  document.getElementById('expiry').value = '';
  saveAndRender();
}

function deleteItem(index) {
  items.splice(index, 1);
  saveAndRender();
}

function renderList() {
  list.innerHTML = '';
  items.sort((a, b) => new Date(a.expiry) - new Date(b.expiry));
  const today = new Date().toISOString().split('T')[0];
  items.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'item';

    if (item.expiry < today) {
      div.classList.add('expired');
    } else if (item.expiry === today) {
      div.classList.add('due-today');
    }

    div.innerHTML = `
      <strong>${item.name}</strong><br>
      消費期限: ${item.expiry}<br>
      <button onclick="deleteItem(${i})">削除</button>
    `;
    list.appendChild(div);
  });
}

renderList();
