//  Warenkorb-Logik
document.addEventListener("DOMContentLoaded", function () {
  // Fixe Lieferkosten
  const shippingCost = 5.0;

  // Menü-Karten rendern menu.js
  menuData.forEach(function (menuItem) {
    const cardHTML =
      '<article class="card">' +
      "<h3>" +
      menuItem.name +
      "</h3>" +
      "<p>" +
      menuItem.desc +
      "</p>" +
      '<div class="card__bottom">' +
      '<span class="price">CHF ' +
      menuItem.price.toFixed(2) +
      "</span>" +
      '<button class="plus-btn" data-add="' +
      menuItem.id +
      '">+</button>' +
      "</div>" +
      "</article>";

    const gridContainer = document.querySelector(
      '[data-menu-grid="' + menuItem.category + '"]'
    );
    if (gridContainer) gridContainer.innerHTML += cardHTML;
  });

  // Warenkorb-Daten
  let cart = [];

  // Hilfsfunktionen
  function findMenuItemById(itemId) {
    for (let i = 0; i < menuData.length; i++) {
      if (menuData[i].id === itemId) return menuData[i];
    }
    return null;
  }

  function findCartItem(itemId) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === itemId) return cart[i];
    }
    return null;
  }

  // Artikel hinzufügen
  function addToCart(itemId) {
    const existing = findCartItem(itemId);
    if (existing) {
      existing.qty += 1;
    } else {
      const m = findMenuItemById(itemId);
      if (!m) return;
      cart.push({ id: m.id, name: m.name, price: m.price, qty: 1 });
    }
    renderCart();
    renderMobileCart();
  }

  // Menge ändern (+/-)
  function changeQuantity(itemId, change) {
    const it = findCartItem(itemId);
    if (!it) return;
    it.qty += change;
    if (it.qty <= 0) {
      const next = [];
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id !== itemId) next.push(cart[i]);
      }
      cart = next;
    }
    renderCart();
    renderMobileCart();
  }

  // Artikel komplett entfernen
  function removeFromCart(itemId) {
    const next = [];
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id !== itemId) next.push(cart[i]);
    }
    cart = next;
    renderCart();
    renderMobileCart();
  }

  // Summe berechnen
  function calcSubtotal() {
    let s = 0;
    for (let i = 0; i < cart.length; i++) {
      s += cart[i].price * cart[i].qty;
    }
    return s;
  }

  // Warenkorb Desktop rendern
  function renderCart() {
    const cartItemsBox = document.querySelector("[data-cart-items]");
    const subtotalElement = document.querySelector("[data-subtotal]");
    const totalElement = document.querySelector("[data-total]");
    const miniTotalElement = document.querySelector("[data-total-mini]");

    if (!cartItemsBox || !subtotalElement || !totalElement) return;

    if (cart.length === 0) {
      cartItemsBox.innerHTML =
        '<p class="cart__empty">Dein Warenkorb ist leer.</p>';
      subtotalElement.textContent = "CHF 0.00";
      totalElement.textContent = "CHF 0.00";
      if (miniTotalElement) miniTotalElement.textContent = "CHF 0.00";
      return;
    }

    let html = "";
    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {
      const it = cart[i];
      const line = it.price * it.qty;
      subtotal += line;

      html +=
        "" +
        '<div class="cart__item">' +
        "<div>" +
        it.name +
        "</div>" +
        '<div style="text-align:right;">CHF ' +
        line.toFixed(2) +
        "</div>" +
        '<div class="qty">' +
        '<button class="qty-btn" data-dec="' +
        it.id +
        '">−</button>' +
        "<span>" +
        it.qty +
        "</span>" +
        '<button class="qty-btn" data-inc="' +
        it.id +
        '">+</button>' +
        "</div>" +
        '<div style="text-align:right;">' +
        '<button class="qty-del" data-del="' +
        it.id +
        '">entfernen</button>' +
        "</div>" +
        "</div>";
    }

    cartItemsBox.innerHTML = html;
    subtotalElement.textContent = "CHF " + subtotal.toFixed(2);
    totalElement.textContent = "CHF " + (subtotal + shippingCost).toFixed(2);
    if (miniTotalElement) {
      miniTotalElement.textContent =
        "CHF " + (subtotal + shippingCost).toFixed(2);
    }
  }

  // Warenkorb Handy Dialog rendern
  function renderMobileCart() {
    const box = document.querySelector("[data-cart-items-mobile]");
    const sub = document.querySelector("[data-subtotal-mobile]");
    const tot = document.querySelector("[data-total-mobile]");
    if (!box || !sub || !tot) return;

    if (cart.length === 0) {
      box.innerHTML = '<p class="cart__empty">Dein Warenkorb ist leer.</p>';
      sub.textContent = "CHF 0.00";
      tot.textContent = "CHF 0.00";
      return;
    }

    let html = "";
    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {
      const it = cart[i];
      const line = it.price * it.qty;
      subtotal += line;

      html +=
        "" +
        '<div class="cart__item">' +
        "<div>" +
        it.name +
        "</div>" +
        '<div style="text-align:right;">CHF ' +
        line.toFixed(2) +
        "</div>" +
        '<div class="qty">' +
        '<button class="qty-btn" data-dec="' +
        it.id +
        '">−</button>' +
        "<span>" +
        it.qty +
        "</span>" +
        '<button class="qty-btn" data-inc="' +
        it.id +
        '">+</button>' +
        "</div>" +
        '<div style="text-align:right;">' +
        '<button class="qty-del" data-del="' +
        it.id +
        '">entfernen</button>' +
        "</div>" +
        "</div>";
    }

    box.innerHTML = html;
    sub.textContent = "CHF " + subtotal.toFixed(2);
    tot.textContent = "CHF " + (subtotal + shippingCost).toFixed(2);
  }

  // Klick-Events
  document.addEventListener("click", function (event) {
    if (event.target.matches("[data-add]")) {
      const idA = event.target.getAttribute("data-add");
      addToCart(idA);
    }
    if (event.target.matches("[data-inc]")) {
      const idI = event.target.getAttribute("data-inc");
      changeQuantity(idI, +1);
    }
    if (event.target.matches("[data-dec]")) {
      const idD = event.target.getAttribute("data-dec");
      changeQuantity(idD, -1);
    }
    if (event.target.matches("[data-del]")) {
      const idR = event.target.getAttribute("data-del");
      removeFromCart(idR);
    }
  });

  // Initial render
  renderCart();
  renderMobileCart();

  // Mobile Overlay Warenkorb
  const openCartButton = document.querySelector("[data-open-cart]");
  const cartDialog = document.querySelector("[data-cart-dialog]");

  if (openCartButton && cartDialog) {
    openCartButton.addEventListener("click", function () {
      cartDialog.showModal();
      renderMobileCart();
    });

    cartDialog.addEventListener("click", function (event) {
      if (
        event.target.tagName === "BUTTON" &&
        event.target.textContent === "✕"
      ) {
        cartDialog.close();
      }
    });
  }

  // Bestellen Button
  function clearCartAfterOrder(messageElement) {
    cart = [];
    renderCart();
    renderMobileCart();
    if (messageElement) {
      messageElement.textContent = "Danke für deine Testbestellung!";
      setTimeout(function () {
        messageElement.textContent = "";
      }, 3000);
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
  const messageElementMobile = document.querySelector(
    "[data-order-message-mobile]"
  );
  if (checkoutButtonMobile) {
    checkoutButtonMobile.addEventListener("click", function () {
      clearCartAfterOrder(messageElementMobile);
      if (cartDialog) cartDialog.close();
    });
  }
});
