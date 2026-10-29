const fmt = (n) => "Rp " + n.toLocaleString("id-ID");
const CART_KEY = "shopping_cart";

function loadCart() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY));
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
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (err) {}
}

let cart = loadCart();
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

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
  cartCountEl.textContent = cart.length;
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

  cartTotalEl.textContent = fmt(cart.reduce((s, i) => s + i.price, 0));
  checkoutBtn.disabled = cart.length === 0;
}

// ---------- Toast ----------
const toast = document.getElementById("toast");
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ---------- Cart drawer ----------
function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.setAttribute("aria-hidden", "false");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
  cartDrawer.setAttribute("aria-hidden", "true");
  overlay.setAttribute("aria-hidden", "true");
}
document.getElementById("cartOpenBtn").addEventListener("click", openCart);
document.getElementById("cartCloseBtn").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  cart.length = 0;
  renderCart();
  closeCart();
  showToast("Checkout demo berhasil!");
});

window.addEventListener("storage", (e) => {
  if (e.key === CART_KEY) {
    cart = loadCart();
    renderCart();
  }
});
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    cart = loadCart();
    renderCart();
  }
});

renderCart();
