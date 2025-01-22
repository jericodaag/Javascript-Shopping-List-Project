// DOM Elements
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
const notification = document.getElementById('notification');
let isEditMode = false;

// Functions
function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

function showNotification(message, duration = 3000) {
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, duration);
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value.trim();

  if (!newItem) {
    showNotification('Please add an item');
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
    showNotification('Item updated successfully');
  } else {
    if (checkIfItemExists(newItem)) {
      showNotification('That item already exists');
      return;
    }
    showNotification('Item added successfully');
  }

  addItemToDOM(newItem);
  addItemToStorage(newItem);
  checkUI();
  itemInput.value = '';
}

function addItemToDOM(item) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // Add li to the DOM with fade-in animation
  li.style.opacity = '0';
  itemList.appendChild(li);

  // Trigger reflow
  li.offsetHeight;

  // Add fade-in
  li.style.transition = 'opacity 0.3s ease-in-out';
  li.style.opacity = '1';
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  button.appendChild(createIcon('fa-solid fa-xmark'));
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  return JSON.parse(localStorage.getItem('items')) || [];
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage
    .map((i) => i.toLowerCase())
    .includes(item.toLowerCase());
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#10b981';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm('Are you sure you want to remove this item?')) {
    // Fade out animation
    item.style.transition = 'opacity 0.3s ease-in-out';
    item.style.opacity = '0';

    setTimeout(() => {
      item.remove();
      removeItemFromStorage(item.textContent);
      checkUI();
      showNotification('Item removed');
    }, 300);
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  if (confirm('Are you sure you want to clear all items?')) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }
    localStorage.removeItem('items');
    checkUI();
    showNotification('All items cleared');
  }
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    item.style.display = itemName.includes(text) ? 'flex' : 'none';
  });
}

function checkUI() {
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.parentElement.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.parentElement.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '';
  isEditMode = false;
}

// Initialize app
function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
}

init();
