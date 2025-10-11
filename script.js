//  Warenkorb-Logik //
document.addEventListener("DOMContentLoaded", function () {

  // Fixe Lieferkosten //
  let shippingCost = 5.0;

  //  Karten aus menuData rendern  //
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

  //  Warenkorb-Daten speichern  //
  // Array für Warenkorb: [{id, name, price, qty}] //
  let cart = [];

  // Artikel hinzufügen //
  function addToCart(itemId) {
    // prüfen, ob Artikel schon im Warenkorb existiert //
    let existingCartItem = cart.find(function (cartItem) {
      return cartItem.id === itemId;
    });

    if (existingCartItem) {
      existingCartItem.qty += 1; // Menge erhöhen //
    } else {
      let menuItem = menuData.find(function (menuItem) {
        return menuItem.id === itemId;
      });
      if (!menuItem) return;

      // Neues Objekt ins cart-Array legen //
      cart.push({ 
        id: menuItem.id, 
        name: menuItem.name, 
        price: menuItem.price, 
        qty: 1 
      });
    }
    renderCart();
  }

  // Menge ändern +1 oder -1 //
  function changeQuantity(itemId, change) {
    let cartItem = cart.find(function (cartItem) {
      return cartItem.id === itemId;
    });

    if (!cartItem) return;

    cartItem.qty += change;

    // Wenn Menge kleiner oder gleich 0 → entfernen //
    if (cartItem.qty <= 0) {
      cart = cart.filter(function (cartItem) {
        return cartItem.id !== itemId;
      });
    }
    renderCart();
  }

  // Artikel komplett entfernen // 
  function removeFromCart(itemId) {
    cart = cart.filter(function (cartItem) {
      return cartItem.id !== itemId;
    });
    renderCart();
  }

  //  Warenkorb anzeigen  // 
  function renderCart() {
    let cartItemsBox = document.querySelector("[data-cart-items]");
    let subtotalElement = document.querySelector("[data-subtotal]");
    let totalElement = document.querySelector("[data-total]");
    let miniTotalElement = document.querySelector("[data-total-mini]"); // für mobile Button //

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

  //  Klick-Events //
  document.addEventListener("click", function (event) {
   
    if (event.target.matches("[data-add]")) {
      let itemId = event.target.getAttribute("data-add");
      addToCart(itemId);
    }

    // Menge erhöhen //
    if (event.target.matches("[data-inc]")) {
      let itemId = event.target.getAttribute("data-inc");
      changeQuantity(itemId, +1);
    }

    // Menge verringern //
    if (event.target.matches("[data-dec]")) {
      let itemId = event.target.getAttribute("data-dec");
      changeQuantity(itemId, -1);
    }

    // Artikel entfernen //
    if (event.target.matches("[data-del]")) {
      let itemId = event.target.getAttribute("data-del");
      removeFromCart(itemId);
    }
  });

  // Warenkorb anzeigen //
  renderCart();
});
