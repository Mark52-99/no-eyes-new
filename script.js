document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const preloader = document.getElementById("preloader");
  const title = document.getElementById("typing-title");

  // Page reveal
  window.setTimeout(() => {
    preloader?.classList.add("hidden");
    body.classList.add("loaded");
  }, 700);

  // One-time typing animation
  if (title && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const text = title.textContent.trim();
    title.textContent = "";
    let index = 0;

    const type = () => {
      if (index < text.length) {
        title.textContent += text[index++];
        window.setTimeout(type, 90);
      }
    };

    window.setTimeout(type, 500);
  }

  // Scroll animations
  if (window.AOS) {
    AOS.init({
      duration: 800,
      once: true,
      offset: 80
    });
  }

  initCart();
});

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const active = sidebar.classList.toggle("active");
  sidebar.setAttribute("aria-hidden", String(!active));
}

let cart = JSON.parse(localStorage.getItem("no-eyes-cart") || "[]");

function initCart() {
  document.querySelectorAll(".buy-now").forEach((button) => {
    button.addEventListener("click", () => {
      const item = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: Number(button.dataset.price)
      };

      cart.push(item);
      saveCart();
      renderCart();
      openCart();
    });
  });

  document.getElementById("view-cart")?.addEventListener("click", openCart);
  renderCart();
}

function saveCart() {
  localStorage.setItem("no-eyes-cart", JSON.stringify(cart));
}

function renderCart() {
  const count = document.getElementById("cart-count");
  const items = document.getElementById("cart-items");
  const total = document.getElementById("cart-total");

  if (!count || !items || !total) return;

  count.textContent = cart.length;
  items.innerHTML = "";

  if (!cart.length) {
    items.innerHTML = "<p class='cart-empty'>Your bag is empty.</p>";
    total.textContent = "$0";
    return;
  }

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <span>${escapeHtml(item.name)}</span>
      <span>$${item.price} <button type="button" onclick="removeFromCart(${index})">Remove</button></span>
    `;
    items.appendChild(row);
  });

  total.textContent = `$${cart.reduce((sum, item) => sum + Number(item.price), 0)}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function openCart() {
  const overlay = document.getElementById("cart-overlay");
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");
}

function closeCart() {
  const overlay = document.getElementById("cart-overlay");
  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");
}

function checkout() {
  if (!cart.length) {
    alert("Your bag is empty.");
    return;
  }

  alert("Checkout is ready to be connected to your order form or payment system.");
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.getElementById("sidebar")?.classList.remove("active");
    closeCart();
  }
});
