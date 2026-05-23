'use strict'

let products = [
  { id: 1, name: "Помідори", amount: 2, bought: true, edit: false },
  { id: 2, name: "Печиво", amount: 2, bought: false, edit: false },
  { id: 3, name: "Сир", amount: 1, bought: false, edit: false },
]
const inputItem = document.querySelector(".find-item__input");
const addBtn = document.querySelector(".find-item__add-button");

const productsList = document.querySelector(".main-container");

const sideContainers = document.querySelectorAll(".side-container__items");
const leftItems = sideContainers[0];
const boughtItems = sideContainers[1];

function addProducts() {
  const name = inputItem.value.trim();

  if (name === '') {
    return;
  }

  let maxId = 0;
  products.forEach(product => {
    if (product.id > maxId) {
      maxId = product.id;
    }
  });

  const newId = maxId + 1;

  const newProduct = {
    id: newId,
    name: name,
    amount: 1,
    bought: false,
    edit: false,
  }

  products.push(newProduct);

  inputItem.value = "";
  inputItem.focus();

  render();
}

addBtn.addEventListener("click", addProducts);

inputItem.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    addProducts();
  }
});

function render() {
  const findItem = document.querySelector(".find-item");

  productsList.innerHTML = "";

  if (findItem) {
    productsList.appendChild(findItem);
  }

  products.forEach((product, index) => {
    const productRow = document.createElement("div");

    const isLast = index === products.length - 1;

    productRow.className = `product ${isLast ? 'last-product' : ''}`;

    if (product.bought) {
      const nameSpan = document.createElement("span");
      nameSpan.className = "product__name product__crossed";
      nameSpan.textContent = product.name;

      const amountSpan = document.createElement("span");
      amountSpan.className = "product__amount";
      amountSpan.textContent = product.amount;

      const unbuyBtn = document.createElement("button");
      unbuyBtn.className = "product__buy-button";
      unbuyBtn.setAttribute("data-tooltip", "Відмінити покупку");
      unbuyBtn.textContent = "Не куплено";
      unbuyBtn.addEventListener("click", () => toggleBought(product.id));

      productRow.appendChild(nameSpan);
      productRow.appendChild(amountSpan);
      productRow.appendChild(unbuyBtn);
      } else {
      let nameElement;

      if (product.edit) {
        nameElement = document.createElement("input");
        nameElement.type = "text";
        nameElement.className = "product__input-field";
        nameElement.value = product.name;
        nameElement.id = `edit-input-${product.id}`;
        
        nameElement.addEventListener("blur", () => finishEdit(product.id));

        nameElement.addEventListener("keydown", (e) => {
          if (e.key === "Enter") nameElement.blur();
        });
        
      } else {
        nameElement = document.createElement("span");
        nameElement.className = "product__name";
        nameElement.textContent = product.name;
        nameElement.addEventListener("click", () => startEdit(product.id));
      }

      const counterDiv = document.createElement("div");
      counterDiv.className = "product__counter";

      const minusBtn = document.createElement("button");
      minusBtn.className = `product__round-button remove ${product.amount <= 1 ? 'pale' : ''}`;
      minusBtn.setAttribute("data-tooltip", "Зменшити");
      minusBtn.textContent = "−";
      minusBtn.addEventListener("click", () => decreaseAmount(product.id));

      const amountSpan = document.createElement("span");
      amountSpan.className = "product__amount";
      amountSpan.textContent = product.amount;

      const plusBtn = document.createElement("button");
      plusBtn.className = "product__round-button add";
      plusBtn.setAttribute("data-tooltip", "Збільшити");
      plusBtn.textContent = "+";
      plusBtn.addEventListener("click", () => increaseAmount(product.id));

      counterDiv.appendChild(minusBtn);
      counterDiv.appendChild(amountSpan);
      counterDiv.appendChild(plusBtn);

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "product__actions";

      const buyBtn = document.createElement("button");
      buyBtn.className = "product__buy-button";
      buyBtn.setAttribute("data-tooltip", "Позначити як куплене");
      buyBtn.textContent = "Куплено";
      buyBtn.addEventListener("click", () => toggleBought(product.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "product__cancel-button";
      deleteBtn.setAttribute("data-tooltip", "Видалити товар");
      deleteBtn.textContent = "х";
      deleteBtn.addEventListener("click", () => deleteProduct(product.id));

      actionsDiv.appendChild(buyBtn);
      actionsDiv.appendChild(deleteBtn);

      productRow.appendChild(nameElement);
      productRow.appendChild(counterDiv);
      productRow.appendChild(actionsDiv);
    }

    productsList.appendChild(productRow);

    if (product.edit) {
      const editInput = document.getElementById(`edit-input-${product.id}`);
      if (editInput) {
        editInput.focus();
        editInput.selectionStart = editInput.selectionEnd = editInput.value.length;
      }
    }
  });

  leftItems.innerHTML = "";
  boughtItems.innerHTML = "";

  products.forEach(product => {
    const itemSpan = document.createElement("span");

    const badgeSpan = document.createElement("span");
    badgeSpan.className = "product-item__amount";
    badgeSpan.textContent = product.amount;

    itemSpan.textContent = product.name + " ";
    itemSpan.appendChild(badgeSpan);

    if (!product.bought) {
      itemSpan.className = "product-item";
      leftItems.appendChild(itemSpan);
    } else {
      itemSpan.className = "product-item product-item__bought";
      boughtItems.appendChild(itemSpan);
    }
  });
}

function toggleBought(id) {
  products = products.map(product => {
    if (product.id === id) {
      return { ...product, bought: !product.bought };
    }
    return product;
  });
  render();
}

function increaseAmount(id) {
  products = products.map(product => {
    if (product.id === id) {
      return { ...product, amount: product.amount + 1 };
    }
    return product;
  });
  render();
}

function decreaseAmount(id) {
  products = products.map(product => {
    if (product.id === id && product.amount > 1) {
      return { ...product, amount: product.amount - 1 };
    }
    return product;
  });
  render();
}

function deleteProduct(id) {
  products = products.filter(product => product.id !== id);
  render();
}

function startEdit(id) {
  products = products.map(product => {
    if (product.id === id) {
      return { ...product, edit: true };
    }
    return product;
  });
  render();
}

function finishEdit(id) {
  const editInput = document.getElementById(`edit-input-${id}`);
  
  products = products.map(product => {
    if (product.id === id) {
      const newName = editInput && editInput.value.trim() !== "" ? editInput.value.trim() : product.name;
      return { ...product, name: newName, edit: false };
    }
    return product;
  });
  render();
}

render();