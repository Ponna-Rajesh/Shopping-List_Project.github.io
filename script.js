let Input = document.querySelector('.inputBox');
let addItem = document.querySelector('.addItems');
let ul = document.querySelector('ul');
let clearAll = document.getElementById('clear');
const filter = document.querySelector('.filter');
const textInput = document.getElementById('textInput');
let isEditMode = false;

// Function to display items from localStorage
function displayItems() {
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));
    updateVisibility();
}

// Event listener for DOMContentLoaded event to display items when the page loads
document.addEventListener('DOMContentLoaded', displayItems);

// Event listener for adding a new item
addItem.addEventListener('click', function(e) {
    e.preventDefault();
    const val = Input.value.trim();
    if (val === '') {
        alert("Please add an item");
        return;
    }
    addItemToDOM(val);
    addItemToStorage(val);
});

// Function to add an item to the DOM
function addItemToDOM(item) {
    let textNode = document.createTextNode(item);
    let li = document.createElement('li');
    li.appendChild(textNode);

    let editbtn = document.createElement('i');
    editbtn.innerHTML = '&#10000;';
    editbtn.title = 'Edit';
    editbtn.classList.add('edit');

    let wrong = document.createElement('button');
    wrong.innerHTML = '&#10006;';

    li.appendChild(editbtn);
    li.appendChild(wrong);
    ul.appendChild(li);
    Input.value = ''; // Clear input after adding item

    addRemoveListener(wrong); // Add event listener to the newly created delete button
    updateVisibility();
    editItem(editbtn);  

}

//function to edit the item
// Function to edit the item
function editItem(editbtn) {
    editbtn.addEventListener('click', function() {
        let listItem = editbtn.parentElement;
        let editText = listItem.firstChild.textContent.trim();
        let newEditText = prompt(`Do you want to edit the item "${editText}"?`, editText);
        if (newEditText !== null) {
            listItem.firstChild.textContent = newEditText;
            updateLocalStorage(editText, newEditText);
        }
    });
}

function updateLocalStorage(oldText, newText) {
    const itemsFromStorage = getItemFromStorage();
    const updatedItems = itemsFromStorage.map(item => {
        if (item === oldText) {
            return newText;
        }
        return item;
    });
    localStorage.setItem('items', JSON.stringify(updatedItems));
}

// Function to add event listener to delete button
function addRemoveListener(wrong) {
    wrong.addEventListener('click', function(e) {
        const listItem = this.parentElement;
        const text = listItem.firstChild.textContent.trim(); // Get the text content of the li
        if (confirm('Are You Sure ?')) {
            listItem.remove();
            removeFromStorage(text); // Remove the item from local storage
            updateVisibility();
        }
    });
}

// Function to remove an item from localStorage
function removeFromStorage(itemText) {
    const itemsFromStorage = getItemFromStorage();
    const updatedItems = itemsFromStorage.filter(item => item !== itemText);
    localStorage.setItem('items', JSON.stringify(updatedItems));
}

// Function to add an item to localStorage
function addItemToStorage(item) {
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Function to retrieve items from localStorage
function getItemFromStorage() {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

// Function to filter items
function fill(e) {
    const items = ul.querySelectorAll("li");
    const text = e.target.value.toLowerCase();
    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(text) !== -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Event listener for input changes
textInput.addEventListener('input', fill);

// Function to update visibility
function updateVisibility() {
    const ite = ul.querySelectorAll("li");
    if (ite.length === 0) {
        filter.style.display = 'none';
        clearAll.style.display = 'none';
    } else {
        filter.style.display = 'block';
        clearAll.style.display = 'block';
    }
}

// Call updateVisibility initially
updateVisibility();


clearAll.addEventListener('click', function(e) {
    if (confirm('Are You Sure ?')) {
        ul.innerHTML = ''; // Clear the list by removing all inner HTML
        localStorage.clear('items'); // Clear the entire localStorage
        updateVisibility();
    }
});

// Add event listener to existing delete buttons
const wrongButtons = document.querySelectorAll('ul li button');
wrongButtons.forEach(wrong => {
    addRemoveListener(wrong);
});
