const shippingCost = 5.0;
let cart = [];

/* Storage */
function saveCart() { try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) {} };
function loadCart() {
  try {
    const raw = localStorage.getItem("cart");
    cart = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
  } catch { cart = []; }
};

/* Utils */
function qs(s, r) { return (r || document).querySelector(s); };
function qsa(s, r) { return Array.from((r || document).querySelectorAll(s)); };
function byId(list, id) { return list.find((x) => x.id === id) || null; };
function money(a) { return "CHF " + a.toFixed(2); };
function subtotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); };

/* Menü */
function menuCardHTML(m) {
  return `<article class="card"><h3>${m.name}</h3><p>${m.desc}</p><div class="card__bottom"><span class="price">${money(m.price)}</span><button class="plus-btn" data-add="${m.id}">+</button></div></article>`;
};
function renderMenu() {
  for (let i = 0; i < menuData.length; i++) {
    const m = menuData[i]; const grid = qs('[data-menu-grid="' + m.category + '"]');
    if (grid) grid.insertAdjacentHTML("beforeend", menuCardHTML(m));
  }
};

/* Cart Mutations */
function addToCart(id) {
  let f = byId(cart, id);
  if (f) f.qty += 1;
  else {
    const m = byId(menuData, id); if (!m) return;
    cart.push({ id: m.id, name: m.name, price: m.price, qty: 1 });
  }
  saveCart(); renderAll();
};
function changeQuantity(id, step) {
  let f = byId(cart, id); if (!f) return;
  f.qty += step; if (f.qty <= 0) cart = cart.filter((x) => x.id !== id);
  saveCart(); renderAll();
};
function removeFromCart(id) { cart = cart.filter((x) => x.id !== id); saveCart(); renderAll(); };

/* Cart Rendering */
function renderEmpty(cfg) {
  qs(cfg.items).innerHTML = '<p class="cart__empty">Dein Warenkorb ist leer.</p>';
  qs(cfg.sub).textContent = money(0);
  qs(cfg.tot).textContent = money(0 + shippingCost);
  if (cfg.mini) qs(cfg.mini).textContent = money(0 + shippingCost);
  if (cfg.msg) qs(cfg.msg).textContent = "";
  setCheckoutDisabled(true);
};
function setCheckoutDisabled(disabled) {
  const d = qs("[data-checkout]"), m = qs("[data-checkout-mobile]");
  if (d) d.disabled = disabled; if (m) m.disabled = disabled;
};
function cartItemsHTML() {
  return cart.map((i) => {
    const line = money(i.price * i.qty);
    return `<div class="cart__item"><div>${i.name}</div><div style="text-align:right;">${line}</div><div class="qty"><button class="qty-btn" data-dec="${i.id}">−</button><span>${i.qty}</span><button class="qty-btn" data-inc="${i.id}">+</button></div><div style="text-align:right;"><button class="qty-del" data-del="${i.id}">entfernen</button></div></div>`;
  }).join("");
};
function updateTotals(cfg, sub) {
  qs(cfg.sub).textContent = money(sub);
  qs(cfg.tot).textContent = money(sub + shippingCost);
  if (cfg.mini) qs(cfg.mini).textContent = money(sub + shippingCost);
  setCheckoutDisabled(false);
};
function renderCart(cfg) {
  const box = qs(cfg.items); if (!box) return;
  if (cart.length === 0) return renderEmpty(cfg);
  box.innerHTML = cartItemsHTML(); updateTotals(cfg, subtotal());
};
function renderAll() {
  renderCart({ items: "[data-cart-items]", sub: "[data-subtotal]", tot: "[data-total]", mini: "[data-total-mini]", msg: "[data-order-message]" });
  renderCart({ items: "[data-cart-items-mobile]", sub: "[data-subtotal-mobile]", tot: "[data-total-mobile]", mini: null, msg: "[data-order-message-mobile]" });
};

/* Actions */
function checkout(messageSelector) {
  if (!cart.length) return;
  cart = []; saveCart(); renderAll();
  const el = qs(messageSelector);
  if (el) { el.textContent = "Danke für deine Testbestellung!"; setTimeout(() => (el.textContent = ""), 3000); }
};
function toggleDialog(open) {
  const dialog = qs("[data-cart-dialog]"); if (!dialog) return;
  if (open && typeof dialog.showModal === "function") dialog.showModal(); else dialog.close();
};
function handleClick(e) {
  const t = e.target;
  if (t.matches("[data-add]")) addToCart(t.getAttribute("data-add"));
  if (t.matches("[data-inc]")) changeQuantity(t.getAttribute("data-inc"), +1);
  if (t.matches("[data-dec]")) changeQuantity(t.getAttribute("data-dec"), -1);
  if (t.matches("[data-del]")) removeFromCart(t.getAttribute("data-del"));
  if (t.matches("[data-checkout]")) checkout("[data-order-message]");
  if (t.matches("[data-checkout-mobile]")) { checkout("[data-order-message-mobile]"); toggleDialog(false); }
  if (t.matches("[data-open-cart]")) { toggleDialog(true); renderAll(); }
  if (t.tagName === "BUTTON" && (t.textContent === "✕" || t.getAttribute("aria-label") === "Schließen")) toggleDialog(false);
};
function attachEvents() {
  document.addEventListener("click", handleClick);
  const dialog = qs("[data-cart-dialog]");
  if (dialog) dialog.addEventListener("click", function (e) {
    const r = dialog.getBoundingClientRect();
    const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (outside) dialog.close();
  });
  const y = qs("#year"); if (y) y.textContent = new Date().getFullYear();
};
function init() { loadCart(); renderMenu(); renderAll(); attachEvents(); };
