//  Warenkorb-Logik 
document.addEventListener("DOMContentLoaded", function () {

  // Fixe Lieferkosten 
  let shippingCost = 5.0;

  // Karten aus menuData rendern 
  menuData.forEach(function (menuItem) {
    let cardHTML = `
      <article class="card">
        <h3>${menuItem.name}</h3>
        <p>${menuItem.desc}</p>
        <div class="card__bottom">
          <span class="price">CHF ${menuItem.price.toFixed(2)}</span>
          <button class="plus-btn" data-add="${menuItem.id}">+</button>
        </div>
      </article>
    `;

    let gridContainer = document.querySelector(`[data-menu-grid="${menuItem.category}"]`);
    if (gridContainer) {
      gridContainer.innerHTML += cardHTML;
    }
  });

  // Warenkorb-Daten 
  let cart = [];

  // Artikel hinzufügen 
  function addToCart(itemId) {
    let existingCartItem = cart.find(function (cartItem) {
      return cartItem.id === itemId;
    });

    if (existingCartItem) {
      existingCartItem.qty += 1;
    } else {
      let menuItem = menuData.find(function (menuItem) {
        return menuItem.id === itemId;
      });
      if (!menuItem) return;

      cart.push({ 
        id: menuItem.id, 
        name: menuItem.name, 
        price: menuItem.price, 
        qty: 1 
      });
    }
    renderCart();
  }

  // Menge ändern (+1 oder -1)
  function changeQuantity(itemId, change) {
    let cartItem = cart.find(function (cartItem) {
      return cartItem.id === itemId;
    });

    if (!cartItem) return;

    cartItem.qty += change;
    if (cartItem.qty <= 0) {
      cart = cart.filter(function (cartItem) {
        return cartItem.id !== itemId;
      });
    }
    renderCart();
  }

  // Artikel komplett entfernen 
  function removeFromCart(itemId) {
    cart = cart.filter(function (cartItem) {
      return cartItem.id !== itemId;
    });
    renderCart();
  }

  // Warenkorb anzeigen
  function renderCart() {
    let cartItemsBox = document.querySelector("[data-cart-items]");
    let subtotalElement = document.querySelector("[data-subtotal]");
    let totalElement = document.querySelector("[data-total]");
    let miniTotalElement = document.querySelector("[data-total-mini]");

    if (cart.length === 0) {
      cartItemsBox.innerHTML = `<p class="cart__empty">Dein Warenkorb ist leer.</p>`;
      subtotalElement.textContent = "CHF 0.00";
      totalElement.textContent = "CHF 0.00";
      if (miniTotalElement) miniTotalElement.textContent = "CHF 0.00";
      return;
    }

    let html = "";
    let subtotal = 0;

    cart.forEach(function (cartItem) {
      let linePrice = cartItem.price * cartItem.qty;
      subtotal += linePrice;

      html += `
        <div class="cart__item">
          <div>${cartItem.name}</div>
          <div style="text-align:right;">CHF ${linePrice.toFixed(2)}</div>
          <div class="qty">
            <button class="qty-btn" data-dec="${cartItem.id}">−</button>
            <span>${cartItem.qty}</span>
            <button class="qty-btn" data-inc="${cartItem.id}">+</button>
          </div>
          <div style="text-align:right;">
            <button class="qty-del" data-del="${cartItem.id}">entfernen</button>
          </div>
        </div>
      `;
    });

    cartItemsBox.innerHTML = html;
    subtotalElement.textContent = "CHF " + subtotal.toFixed(2);
    totalElement.textContent = "CHF " + (subtotal + shippingCost).toFixed(2);
    if (miniTotalElement) {
      miniTotalElement.textContent = "CHF " + (subtotal + shippingCost).toFixed(2);
    }
  }

  // Klick-Events
  document.addEventListener("click", function (event) {
    if (event.target.matches("[data-add]")) {
      let itemId = event.target.getAttribute("data-add");
      addToCart(itemId);
    }

    if (event.target.matches("[data-inc]")) {
      let itemId = event.target.getAttribute("data-inc");
      changeQuantity(itemId, +1);
    }

    if (event.target.matches("[data-dec]")) {
      let itemId = event.target.getAttribute("data-dec");
      changeQuantity(itemId, -1);
    }

    if (event.target.matches("[data-del]")) {
      let itemId = event.target.getAttribute("data-del");
      removeFromCart(itemId);
    }
  });

  renderCart();

  //Mobile Overlay Warenkorb
  let openCartButton = document.querySelector("[data-open-cart]");
  let cartDialog = document.querySelector("[data-cart-dialog]");

  if (openCartButton && cartDialog) {
    openCartButton.addEventListener("click", function () {
      cartDialog.showModal();
      renderMobileCart();
    });

    cartDialog.addEventListener("click", function (event) {
      if (event.target.tagName === "BUTTON" && event.target.textContent === "✕") {
        cartDialog.close();
      }
    });
  }

  function renderMobileCart() {
    let cartItemsBoxMobile = document.querySelector("[data-cart-items-mobile]");
    let subtotalElementMobile = document.querySelector("[data-subtotal-mobile]");
    let totalElementMobile = document.querySelector("[data-total-mobile]");

    if (cart.length === 0) {
      cartItemsBoxMobile.innerHTML = `<p class="cart__empty">Dein Warenkorb ist leer.</p>`;
      subtotalElementMobile.textContent = "CHF 0.00";
      totalElementMobile.textContent = "CHF 0.00";
      return;
    }

    let html = "";
    let subtotal = 0;

    cart.forEach(function (cartItem) {
      let linePrice = cartItem.price * cartItem.qty;
      subtotal += linePrice;
      html += `
        <div class="cart__item">
          <div>${cartItem.name}</div>
          <div style="text-align:right;">CHF ${linePrice.toFixed(2)}</div>
          <div class="qty">
            <button class="qty-btn" data-dec="${cartItem.id}">−</button>
            <span>${cartItem.qty}</span>
            <button class="qty-btn" data-inc="${cartItem.id}">+</button>
          </div>
          <div style="text-align:right;">
            <button class="qty-del" data-del="${cartItem.id}">entfernen</button>
          </div>
        </div>
      `;
    });

    cartItemsBoxMobile.innerHTML = html;
    subtotalElementMobile.textContent = "CHF " + subtotal.toFixed(2);
    totalElementMobile.textContent = "CHF " + (subtotal + shippingCost).toFixed(2);
  }

  // Bestellen Buttons 
  function clearCartAfterOrder(messageElement) {
    cart = [];
    renderCart();
    if (messageElement) {
      messageElement.textContent = "Danke für deine Testbestellung!";
      setTimeout(() => (messageElement.textContent = ""), 3000);
    }
  }

  const checkoutButton = document.querySelector("[data-checkout]");
  const messageElement = document.querySelector("[data-order-message]");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", function () {
      clearCartAfterOrder(messageElement);
    });
  }

  const checkoutButtonMobile = document.querySelector("[data-checkout-mobile]");
  const messageElementMobile = document.querySelector("[data-order-message-mobile]");
  if (checkoutButtonMobile) {
    checkoutButtonMobile.addEventListener("click", function () {
      clearCartAfterOrder(messageElementMobile);
      cartDialog.close();
    });
  }
});
