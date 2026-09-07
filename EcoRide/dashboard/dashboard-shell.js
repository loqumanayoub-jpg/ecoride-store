(() => {
  const D = window.EcoRideDashboard;
  const settings = D.getSettings();
  document.documentElement.dataset.theme = settings.theme;
  document.documentElement.dir = settings.direction;
  document.body.classList.toggle('compact', Boolean(settings.compact));

  const page = document.body.dataset.dashboardPage || 'dashboard';
  const labels = {
    dashboard: 'Dashboard', products:'Products', orders:'Orders', messages:'Messages', reviews:'Reviews', settings:'Settings'
  };

  document.querySelectorAll('[data-page-link]').forEach(link => {
    const target = link.dataset.pageLink;
    link.classList.toggle('active', target === page);
  });

  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const setMenu = open => {
    sidebar?.classList.toggle('open', open);
    overlay?.classList.toggle('show', open);
    document.body.classList.toggle('nav-open', open);
  };
  menuBtn?.addEventListener('click', () => setMenu(!sidebar?.classList.contains('open')));
  overlay?.addEventListener('click', () => setMenu(false));

  const notificationBtn = document.getElementById('notificationBtn');
  const notificationPanel = document.getElementById('notificationPanel');
  const notificationBadge = document.getElementById('notificationBadge');
  const messages = D.getMessages();
  const unread = messages.filter(m => m.status !== 'read').length;
  if (notificationBadge) notificationBadge.textContent = unread;
  notificationBtn?.addEventListener('click', () => {
    notificationPanel?.classList.toggle('show');
  });
  document.addEventListener('click', event => {
    if (notificationPanel && !notificationPanel.contains(event.target) && !notificationBtn?.contains(event.target)) notificationPanel.classList.remove('show');
  });
  document.getElementById('markAllRead')?.addEventListener('click', () => {
    const updated = D.getMessages().map(m => ({...m, status:'read'}));
    D.saveMessages(updated);
    location.reload();
  });

  const profileBtn = document.getElementById('profileBtn');
  const profilePanel = document.getElementById('profilePanel');
  profileBtn?.addEventListener('click', event => {
    event.stopPropagation();
    profilePanel?.classList.toggle('show');
  });
  document.addEventListener('click', event => {
    if (profilePanel && !profilePanel.contains(event.target) && !profileBtn?.contains(event.target)) profilePanel.classList.remove('show');
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('ecorideDashboardSession');
    location.href = 'login.html';
  });

  document.getElementById('quickSearch')?.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      const value = event.currentTarget.value.trim();
      if (!value) return;
      location.href = `products.html?q=${encodeURIComponent(value)}`;
    }
  });

  const searchInput = document.getElementById('quickSearch');
  if (searchInput) {
    searchInput.placeholder = `Search ${labels.products.toLowerCase()}...`;
  }
})();
