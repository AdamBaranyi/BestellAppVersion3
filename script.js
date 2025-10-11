

document.addEventListener("DOMContentLoaded", () => { // erst wenn DOM bereit
  const shippingCost = 5.0;
  let cart = [];

  // Menü-Karten aus den Daten anzeigen
  function renderMenu() {
    for (let i = 0; i < menuData.length; i++) {
      const m = menuData[i];
      const grid = document.querySelector('[data-menu-grid="' + m.category + '"]');
      if (!grid) continue;
      grid.innerHTML +=
        '<article class="card">' +
          '<h3>' + m.name + '</h3>' +
          '<p>' + m.desc + '</p>' +
          '<div class="card__bottom">' +
            '<span class="price">CHF ' + m.price.toFixed(2) + '</span>' +
            '<button class="plus-btn" data-add="' + m.id + '">+</button>' +
          '</div>' +
        '</article>';
    }
  }

  // Datensatz im Menü / Warenkorb finden
  function findMenuItemById(id) {
    for (let i = 0; i < menuData.length; i++) if (menuData[i].id === id) return menuData[i];
    return null;
  }
  function findCartItem(id) {
    for (let i = 0; i < cart.length; i++) if (cart[i].id === id) return cart[i];
    return null;
  }

  // In den Warenkorb
  function addToCart(id) {
    const it = findCartItem(id);
    if (it) it.qty += 1;
    else {
      const m = findMenuItemById(id);
      if (!m) return;
      cart.push({ id: m.id, name: m.name, price: m.price, qty: 1 });
    }
    renderCart(); renderMobileCart();
  }

  // Menge ändern / entfernen
  function changeQuantity(id, delta) {
    const it = findCartItem(id);
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) {
      const next = [];
      for (let i = 0; i < cart.length; i++) if (cart[i].id !== id) next.push(cart[i]);
      cart = next;
    }
    renderCart(); renderMobileCart();
  }
  function removeFromCart(id) {
    const next = [];
    for (let i = 0; i < cart.length; i++) if (cart[i].id !== id) next.push(cart[i]);
    cart = next;
    renderCart(); renderMobileCart();
  }

  // Summen
  function calcSubtotal() {
    let s = 0;
    for (let i = 0; i < cart.length; i++) s += cart[i].price * cart[i].qty;
    return s;
  }

  // Warenkorb (Desktop) anzeigen
  function renderCart() {
    const box = document.querySelector("[data-cart-items]");
    const sub = document.querySelector("[data-subtotal]");
    const tot = document.querySelector("[data-total]");
    const mini = document.querySelector("[data-total-mini]");
    if (!box || !sub || !tot) return;

    if (cart.length === 0) {
      box.innerHTML = '<p class="cart__empty">Dein Warenkorb ist leer.</p>';
      sub.textContent = "CHF 0.00"; tot.textContent = "CHF 0.00";
      if (mini) mini.textContent = "CHF 0.00";
      return;
    }
    let html = "", s = 0;
    for (let i = 0; i < cart.length; i++) {
      const it = cart[i], line = it.price * it.qty; s += line;
      html +=
        '<div class="cart__item">' +
          '<div>' + it.name + '</div>' +
          '<div style="text-align:right;">CHF ' + line.toFixed(2) + '</div>' +
          '<div class="qty">' +
            '<button class="qty-btn" data-dec="' + it.id + '">−</button>' +
            '<span>' + it.qty + '</span>' +
            '<button class="qty-btn" data-inc="' + it.id + '">+</button>' +
          '</div>' +
          '<div style="text-align:right;"><button class="qty-del" data-del="' + it.id + '">entfernen</button></div>' +
        '</div>';
    }
    box.innerHTML = html;
    sub.textContent = 'CHF ' + s.toFixed(2);
    tot.textContent = 'CHF ' + (s + shippingCost).toFixed(2);
    if (mini) mini.textContent = 'CHF ' + (s + shippingCost).toFixed(2);
  }

  // Warenkorb (Mobile Dialog) anzeigen
  function renderMobileCart() {
    const box = document.querySelector("[data-cart-items-mobile]");
    const sub = document.querySelector("[data-subtotal-mobile]");
    const tot = document.querySelector("[data-total-mobile]");
    if (!box || !sub || !tot) return;

    if (cart.length === 0) {
      box.innerHTML = '<p class="cart__empty">Dein Warenkorb ist leer.</p>';
      sub.textContent = "CHF 0.00"; tot.textContent = "CHF 0.00";
      return;
    }
    let html = "", s = 0;
    for (let i = 0; i < cart.length; i++) {
      const it = cart[i], line = it.price * it.qty; s += line;
      html +=
        '<div class="cart__item">' +
          '<div>' + it.name + '</div>' +
          '<div style="text-align:right;">CHF ' + line.toFixed(2) + '</div>' +
          '<div class="qty">' +
            '<button class="qty-btn" data-dec="' + it.id + '">−</button>' +
            '<span>' + it.qty + '</span>' +
            '<button class="qty-btn" data-inc="' + it.id + '">+</button>' +
          '</div>' +
          '<div style="text-align:right;"><button class="qty-del" data-del="' + it.id + '">entfernen</button></div>' +
        '</div>';
    }
    box.innerHTML = html;
    sub.textContent = 'CHF ' + s.toFixed(2);
    tot.textContent = 'CHF ' + (s + shippingCost).toFixed(2);
  }

  // Bestellen + leeren Warenkorb + Meldung
  function clearCartAfterOrder(msgSel) {
    cart = [];
    renderCart(); renderMobileCart();
    const el = document.querySelector(msgSel);
    if (el) { el.textContent = 'Danke für deine Testbestellung!'; setTimeout(() => el.textContent = '', 3000); }
  }

  // Click-Events 
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t.matches("[data-add]")) addToCart(t.getAttribute("data-add"));
    if (t.matches("[data-inc]")) changeQuantity(t.getAttribute("data-inc"), +1);
    if (t.matches("[data-dec]")) changeQuantity(t.getAttribute("data-dec"), -1);
    if (t.matches("[data-del]")) removeFromCart(t.getAttribute("data-del"));
    if (t.matches("[data-checkout]")) clearCartAfterOrder("[data-order-message]");
    if (t.matches("[data-checkout-mobile]")) { clearCartAfterOrder("[data-order-message-mobile]"); dlg?.close(); }
  });

  // Mobile Dialog öffnen/schließen
  const btn = document.querySelector("[data-open-cart]");
  const dlg = document.querySelector("[data-cart-dialog]");
  if (btn && dlg) {
    btn.addEventListener("click", () => { dlg.showModal(); renderMobileCart(); });
    dlg.addEventListener("click", (e) => { if (e.target.tagName === "BUTTON" && e.target.textContent === "✕") dlg.close(); });
  }


  renderMenu();
  renderCart();
  renderMobileCart();
});
