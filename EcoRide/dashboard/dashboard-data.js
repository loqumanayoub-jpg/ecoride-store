window.EcoRideDashboard = (() => {
  const defaultProducts = [
    { id:'scooter-s1', category:'Scooters', categoryKey:'scooters', name:'Nova Glide Scooter', description:'Ultralight city commuter with 40 km range and adaptive suspension.', price:749, image:'../images/scooter-1.svg' },
    { id:'scooter-s2', category:'Scooters', categoryKey:'scooters', name:'Volt Urban Pro', description:'Premium black finish, fast charging, 32 mph top speed.', price:899, image:'../images/scooter-2.svg' },
    { id:'scooter-s3', category:'Scooters', categoryKey:'scooters', name:'Eclipse Street', description:'Compact foldable design with smart dashboard and premium ride feel.', price:829, image:'../images/scooter-3.svg' },
    { id:'ebike-e1', category:'Electric Bikes', categoryKey:'ebikes', name:'Flux Aero E-Bike', description:'High-performance ride with torque sensor and long-range battery.', price:2499, image:'../images/ebike-1.svg' },
    { id:'ebike-e2', category:'Electric Bikes', categoryKey:'ebikes', name:'Pulse Hybrid', description:'All-city commuter with smart assist and refined geometry.', price:2199, image:'../images/ebike-2.svg' },
    { id:'ebike-e3', category:'Electric Bikes', categoryKey:'ebikes', name:'Ridge Trail X', description:'Adventure-ready e-bike with durable frame and premium drivetrain.', price:2799, image:'../images/ebike-3.svg' },
    { id:'bike-b1', category:'Bicycles', categoryKey:'bicycles', name:'AeroMotion Road', description:'Minimal, lightweight road bike built for speed and comfort.', price:1399, image:'../images/bicycle-1.svg' },
    { id:'bike-b2', category:'Bicycles', categoryKey:'bicycles', name:'Urban Drift', description:'Everyday city bicycle with elegant geometry and responsive handling.', price:1199, image:'../images/bicycle-2.svg' },
    { id:'bike-b3', category:'Bicycles', categoryKey:'bicycles', name:'Terrene Cruiser', description:'Versatile gravel bike with premium components and smooth ride.', price:1499, image:'../images/bicycle-3.svg' },
    { id:'part-p1', category:'Batteries', categoryKey:'parts', name:'PowerCore Battery', description:'High-density 48V battery with rapid recharge and extended lifespan.', price:399, image:'../images/battery.svg' },
    { id:'part-p2', category:'Motors', categoryKey:'parts', name:'TorqueDrive Motor', description:'Efficient motor for sustained performance and responsive acceleration.', price:349, image:'../images/motor.svg' },
    { id:'part-p3', category:'Brakes', categoryKey:'parts', name:'AeroStop Disc', description:'Precision disc brake set for reliable control in every environment.', price:129, image:'../images/brake.svg' },
    { id:'part-p4', category:'Controllers', categoryKey:'parts', name:'Quantum Controller', description:'Intelligent controller with smooth power delivery and diagnostics.', price:199, image:'../images/controller.svg' },
    { id:'part-p5', category:'Helmets', categoryKey:'parts', name:'Eclipse Helmet', description:'Lightweight helmet with aerodynamic shape and safety certification.', price:99, image:'../images/helmet.svg' }
  ];

  const storageKeys = {
    products: 'ecorideAdminProducts',
    messages: 'ecorideMessages',
    settings: 'ecorideDashboardSettings'
  };

  const categoryPage = {
    Scooters:'../scooters.html',
    'Electric Bikes':'../ebikes.html',
    Bicycles:'../bicycles.html',
    Batteries:'../parts.html',
    Motors:'../parts.html',
    Brakes:'../parts.html',
    Controllers:'../parts.html',
    Helmets:'../parts.html'
  };

  const safeJson = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  };

  const saveJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  function getProducts() {
    const stored = safeJson(storageKeys.products, null);
    if (!Array.isArray(stored)) return defaultProducts.map(item => ({ ...item }));
    return stored.map(item => ({ ...item }));
  }

  function saveProducts(products) {
    saveJson(storageKeys.products, products);
  }

  function resetProducts() {
    localStorage.removeItem(storageKeys.products);
  }

  function getCart() {
    const cart = safeJson('ecorideCart', []);
    return Array.isArray(cart) ? cart : [];
  }

  function getMessages() {
    const messages = safeJson(storageKeys.messages, []);
    return Array.isArray(messages) ? messages : [];
  }

  function saveMessages(messages) {
    saveJson(storageKeys.messages, messages);
  }

  function getSettings() {
    return {
      theme: 'dark',
      compact: false,
      direction: 'ltr',
      ...safeJson(storageKeys.settings, {})
    };
  }

  function saveSettings(settings) {
    saveJson(storageKeys.settings, settings);
  }

  function money(value) {
    return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 }).format(Number(value) || 0);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }

  function slug(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }

  return { defaultProducts, storageKeys, categoryPage, getProducts, saveProducts, resetProducts, getCart, getMessages, saveMessages, getSettings, saveSettings, money, escapeHtml, slug };
})();
