const fmt = (n) => "Rp " + n.toLocaleString("id-ID");
const CART_KEY = "shopping_cart";

function loadCart() {
  try {
    const data = JSON.parse(sessionStorage.getItem(CART_KEY));
    if (!Array.isArray(data)) return [];
    return data
      .filter((i) => i && typeof i.price === "number")
      .map((i) => ({
        base: i.base || "Item",
        ice: typeof i.ice === "number" ? i.ice : null,
        toppings: Array.isArray(i.toppings) ? i.toppings : [],
        price: i.price,
      }));
  } catch (err) {
    return [];
  }
}

function saveCart() {
  try {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (err) {}
}

let cart = loadCart();
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

// Langsung set jumlah keranjang dari awal biar gak ada flash "0"
if (cartCountEl) {
  cartCountEl.textContent = cart.length;
}

function addToCart(item) {
  cart.push({
    base: item.base,
    ice: typeof item.ice === "number" ? item.ice : null,
    toppings: Array.isArray(item.toppings) ? item.toppings : [],
    price: item.price,
  });
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  saveCart();
  if (cartCountEl) cartCountEl.textContent = cart.length;
  if (!cartItemsEl) return;
  cartItemsEl.replaceChildren();

  if (cart.length === 0) {
    const empty = document.createElement("div");
    empty.className = "cart-empty";
    empty.textContent = "Keranjangmu kosong, tambahkan milk tea!";
    cartItemsEl.appendChild(empty);
  } else {
    cart.forEach((item, i) => {
      const row = document.createElement("div");
      row.className = "cart-item";

      const detail = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = item.base;
      detail.appendChild(name);
      const noteParts = [];
      if (item.ice !== null) noteParts.push(`${item.ice}% es`);
      if (item.toppings.length) noteParts.push(item.toppings.join(", "));
      if (noteParts.length) {
        const note = document.createElement("span");
        note.style.cssText = "color:var(--ink-soft); font-size:0.82rem;";
        note.textContent = noteParts.join(" · ");
        detail.append(document.createElement("br"), note);
      }

      const side = document.createElement("div");
      side.style.textAlign = "right";
      const price = document.createElement("div");
      price.textContent = fmt(item.price);
      const del = document.createElement("button");
      del.type = "button";
      del.textContent = "Hapus";
      del.addEventListener("click", () => removeFromCart(i));
      side.append(price, del);

      row.append(detail, side);
      cartItemsEl.appendChild(row);
    });
  }

  if (cartTotalEl) {
    cartTotalEl.textContent = fmt(cart.reduce((s, i) => s + i.price, 0));
  }
  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }
}

// ---------- Toast ----------
const toast = document.getElementById("toast");
let toastTimer;
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ---------- Cart drawer ----------
const cartOpenBtn = document.getElementById("cartOpenBtn");
const cartCloseBtn = document.getElementById("cartCloseBtn");

if (cartOpenBtn) cartOpenBtn.addEventListener("click", openCart);
if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCart);
if (overlay) overlay.addEventListener("click", closeCart);

function openCart() {
  if (cartDrawer) cartDrawer.classList.add("open");
  if (overlay) overlay.classList.add("show");
  cartDrawer?.setAttribute("aria-hidden", "false");
  overlay?.setAttribute("aria-hidden", "false");
}
function closeCart() {
  if (cartDrawer) cartDrawer.classList.remove("open");
  if (overlay) overlay.classList.remove("show");
  cartDrawer?.setAttribute("aria-hidden", "true");
  overlay?.setAttribute("aria-hidden", "true");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) return;
    cart.length = 0;
    renderCart();
    closeCart();
    showToast("Checkout demo berhasil!");
  });
}

window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    cart = loadCart();
    renderCart();
  }
});

renderCart();
