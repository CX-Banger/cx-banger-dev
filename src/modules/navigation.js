/**
 * Navigation Module
 * Gère la navigation entre les différentes pages de l'application
 */

/**
 * Affiche une page spécifique et masque les autres
 * @param {string} id - ID de la page à afficher
 */
export function showPage(id) {
  const pages = document.querySelectorAll('.page');
  const navBtns = document.querySelectorAll('.nav-btn');
  const bottomBtns = document.querySelectorAll('.bottom-nav .bt');

  pages.forEach(p => p.classList.remove('active'));

  const targetPage = document.getElementById('page-' + id);
  if (targetPage) targetPage.classList.add('active');

  navBtns.forEach(b => b.classList.toggle('active', b.dataset.page === `page-${id}` || b.dataset.page === id));
  bottomBtns.forEach(b => b.classList.toggle('active', b.dataset.page === id));
}

/**
 * Initialise les écouteurs d'événements pour la navigation
 */
export function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const bottomBtns = document.querySelectorAll('.bottom-nav .bt');
  const headerSearch = document.getElementById('headerSearch');

  navBtns.forEach(b => {
    b.addEventListener('click', () => {
      const page = b.dataset.page.replace('page-', '');
      if (page === 'page-home') showPage('home');
      else showPage(b.dataset.page.replace('page-', ''));
    });
  });

  bottomBtns.forEach(b => {
    b.addEventListener('click', () => showPage(b.dataset.page));
  });

  if (headerSearch) {
    headerSearch.addEventListener('input', e => {
      const q = e.target.value.trim();
      if (q.length >= 2) {
        showPage('search');
        document.getElementById('searchInput').value = q;
        window.doSearch(q);
      }
    });

    headerSearch.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = e.target.value.trim();
        if (q.length >= 2) {
          showPage('search');
          document.getElementById('searchInput').value = q;
          window.doSearch(q);
        }
      }
    });
  }
}
