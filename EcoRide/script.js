const cartKey = 'ecorideCart';

const products = {
  scooters: [
    { id: 'scooter-s1', category: 'Scooters', name: 'Nova Glide Scooter', description: 'Ultralight city commuter with 40 km range and adaptive suspension.', price: 749, image: 'images/scooter-1.svg' },
    { id: 'scooter-s2', category: 'Scooters', name: 'Volt Urban Pro', description: 'Premium black finish, fast charging, 32 mph top speed.', price: 899, image: 'images/scooter-2.svg' },
    { id: 'scooter-s3', category: 'Scooters', name: 'Eclipse Street', description: 'Compact foldable design with smart dashboard and premium ride feel.', price: 829, image: 'images/scooter-3.svg' }
  ],
  ebikes: [
    { id: 'ebike-e1', category: 'Electric Bikes', name: 'Flux Aero E-Bike', description: 'High-performance ride with torque sensor and long-range battery.', price: 2499, image: 'images/ebike-1.svg' },
    { id: 'ebike-e2', category: 'Electric Bikes', name: 'Pulse Hybrid', description: 'All-city commuter with smart assist and refined geometry.', price: 2199, image: 'images/ebike-2.svg' },
    { id: 'ebike-e3', category: 'Electric Bikes', name: 'Ridge Trail X', description: 'Adventure-ready e-bike with durable frame and premium drivetrain.', price: 2799, image: 'images/ebike-3.svg' }
  ],
  bicycles: [
    { id: 'bike-b1', category: 'Bicycles', name: 'AeroMotion Road', description: 'Minimal, lightweight road bike built for speed and comfort.', price: 1399, image: 'images/bicycle-1.svg' },
    { id: 'bike-b2', category: 'Bicycles', name: 'Urban Drift', description: 'Everyday city bicycle with elegant geometry and responsive handling.', price: 1199, image: 'images/bicycle-2.svg' },
    { id: 'bike-b3', category: 'Bicycles', name: 'Terrene Cruiser', description: 'Versatile gravel bike with premium components and smooth ride.', price: 1499, image: 'images/bicycle-3.svg' }
  ],
  parts: [
    { id: 'part-p1', category: 'Batteries', name: 'PowerCore Battery', description: 'High-density 48V battery with rapid recharge and extended lifespan.', price: 399, image: 'images/battery.svg' },
    { id: 'part-p2', category: 'Motors', name: 'TorqueDrive Motor', description: 'Efficient motor for sustained performance and responsive acceleration.', price: 349, image: 'images/motor.svg' },
    { id: 'part-p3', category: 'Brakes', name: 'AeroStop Disc', description: 'Precision disc brake set for reliable control in every environment.', price: 129, image: 'images/brake.svg' },
    { id: 'part-p4', category: 'Controllers', name: 'Quantum Controller', description: 'Intelligent controller with smooth power delivery and diagnostics.', price: 199, image: 'images/controller.svg' },
    { id: 'part-p5', category: 'Helmets', name: 'Eclipse Helmet', description: 'Lightweight helmet with aerodynamic shape and safety certification.', price: 99, image: 'images/helmet.svg' }
  ]
};

const allProducts = Object.values(products).flat();
const productIndex = new Map(allProducts.map((product) => [product.id, product]));
const pageByCategory = {
  Scooters: 'scooters.html',
  'Electric Bikes': 'ebikes.html',
  Bicycles: 'bicycles.html',
  Batteries: 'parts.html',
  Motors: 'parts.html',
  Brakes: 'parts.html',
  Controllers: 'parts.html',
  Helmets: 'parts.html'
};
const whatsappPhone = '212645823515';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach((element) => {
    element.textContent = totalItems;
    element.style.display = totalItems ? 'grid' : 'none';
  });
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function getProductById(id) {
  return productIndex.get(id);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function addToCart(id) {
  const product = getProductById(id);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
  showToast(`${product.name} added to cart.`);
}

function renderProducts(pageKey) {
  const container = document.getElementById('productGrid');
  if (!container) return;

  const pageProducts = products[pageKey] || [];
  container.innerHTML = pageProducts
    .map((item) => `
      <article class="product-card">
        <div class="product-image">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
        </div>
        <div>
          <span class="badge">${item.category}</span>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>
        <div>
          <p class="price">${formatPrice(item.price)}</p>
          <button class="btn btn-primary" type="button" data-add="${item.id}">Add to Cart</button>
        </div>
      </article>
    `)
    .join('');

  container.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => addToCart(button.dataset.add));
  });
}

function renderCart() {
  const cart = getCart();
  const body = document.getElementById('cartBody');
  const totalElement = document.getElementById('cartTotal');
  const checkoutButton = document.getElementById('checkoutButton');

  if (!body || !totalElement || !checkoutButton) return;

  if (!cart.length) {
    body.innerHTML = `
      <tr>
        <td colspan="5" class="empty-cart">
          Your cart is empty. Browse our <a href="scooters.html">store</a> and add a premium ride.
        </td>
      </tr>
    `;
    totalElement.textContent = formatPrice(0);
    checkoutButton.disabled = true;
    return;
  }

  body.innerHTML = '';
  let totalPrice = 0;

  cart.forEach((item) => {
    const lineTotal = item.price * item.quantity;
    totalPrice += lineTotal;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div class="cart-product">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <strong>${item.name}</strong>
            <p class="muted">${item.category}</p>
          </div>
        </div>
      </td>
      <td>${formatPrice(item.price)}</td>
      <td>
        <div class="quantity-control">
          <button type="button" data-action="decrease" data-id="${item.id}">–</button>
          <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" aria-label="Quantity for ${item.name}" />
          <button type="button" data-action="increase" data-id="${item.id}">+</button>
        </div>
      </td>
      <td>${formatPrice(lineTotal)}</td>
      <td>
        <button class="btn btn-secondary" type="button" data-remove="${item.id}">Remove</button>
      </td>
    `;
    body.appendChild(row);
  });

  totalElement.textContent = formatPrice(totalPrice);
  checkoutButton.disabled = false;

  body.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const action = button.dataset.action;
      changeQuantity(id, action === 'increase' ? 1 : -1);
    });
  });

  body.querySelectorAll('input[type="number"]').forEach((input) => {
    input.addEventListener('change', () => {
      const id = input.dataset.id;
      const value = Math.max(1, parseInt(input.value, 10) || 1);
      setQuantity(id, value);
    });
  });

  body.querySelectorAll('[data-remove]').forEach((button) => {
    button.addEventListener('click', () => removeItem(button.dataset.remove));
  });
}

function changeQuantity(id, amount) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + amount);
  saveCart(cart);
  renderCart();
  updateCartCount();
}

function setQuantity(id, value) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity = value;
  saveCart(cart);
  renderCart();
  updateCartCount();
}

function removeItem(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  renderCart();
  updateCartCount();
}

function openSearch() {
  const panel = document.getElementById('searchPanel');
  if (!panel) return;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  const input = panel.querySelector('#searchInput');
  if (input) {
    input.value = '';
    input.focus();
  }
  renderSearchResults('');
}

function closeSearch() {
  const panel = document.getElementById('searchPanel');
  if (!panel) return;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
}

function renderSearchResults(query) {
  const results = document.getElementById('searchResults');
  if (!results) return;
  const searchValue = query.trim().toLowerCase();

  if (!searchValue) {
    results.innerHTML = '<p class="search-empty">Type a product name or category to begin.</p>';
    return;
  }

  const matches = allProducts.filter((item) => {
    const text = `${item.name} ${item.description} ${item.category}`.toLowerCase();
    return text.includes(searchValue);
  });

  if (!matches.length) {
    results.innerHTML = '<p class="search-empty">No matching products found. Try another keyword.</p>';
    return;
  }

  results.innerHTML = matches
    .slice(0, 6)
    .map((item) => `
      <article class="search-result-item">
        <div>
          <span class="badge">${item.category}</span>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>
        <a class="btn btn-secondary" href="${pageByCategory[item.category] || 'index.html'}">Browse</a>
      </article>
    `)
    .join('');
}

function initSearchPanel() {
  if (document.getElementById('searchPanel')) return;

  document.body.insertAdjacentHTML(
    'beforeend',
    `
      <div id="searchPanel" class="search-panel" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="searchPanelTitle">
        <div class="search-panel-backdrop" data-close="true"></div>
        <div class="search-panel-card">
          <div class="search-panel-header">
            <div>
              <p class="overline">Search</p>
              <h2 id="searchPanelTitle">Find your next ride</h2>
            </div>
            <button type="button" class="icon-button close-button" data-close="true" aria-label="Close search">×</button>
          </div>
          <label class="search-input-group">
            <span class="sr-only">Search products</span>
            <input id="searchInput" type="search" placeholder="Search scooters, bikes, and parts..." autocomplete="off" />
          </label>
          <div id="searchResults" class="search-results" role="list"></div>
        </div>
      </div>
    `
  );

  const openButtons = document.querySelectorAll('a[href="#search"]');
  const closeButtons = document.querySelectorAll('[data-close]');
  const searchInput = document.getElementById('searchInput');

  openButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      openSearch();
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeSearch);
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSearch();
    }
  });
}

function initWhatsAppButton() {
  if (document.querySelector('.whatsapp-button')) return;

  const button = document.createElement('a');
  button.className = 'whatsapp-button';
  button.href = `https://wa.me/${whatsappPhone}`;
  button.target = '_blank';
  button.rel = 'noopener noreferrer';
  button.setAttribute('aria-label', 'Chat with EcoRide on WhatsApp');
  button.innerHTML = '<span class="sr-only">Chat with EcoRide on WhatsApp</span><img src="icons/whatsapp.svg" alt="WhatsApp icon" width="28" height="28" />';

  document.body.appendChild(button);
}

function updateNavigationState() {
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    const isCurrent = (page === 'home' && href === 'index.html') || href.endsWith(`${page}.html`);
    if (isCurrent) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

function initPage() {
  updateCartCount();
  initWhatsAppButton();
  initSearchPanel();
  updateNavigationState();

  const page = document.body.dataset.page;
  if (page && products[page]) {
    renderProducts(page);
  }
  if (page === 'cart') {
    renderCart();
    const checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
      checkoutButton.addEventListener('click', () => {
        if (getCart().length) {
          showToast('Checkout is not enabled in this preview yet.');
        } else {
          showToast('Your cart is empty. Add an item to continue.');
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', initPage);
