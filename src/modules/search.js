/**
 * Search Module
 * Gère la recherche de titres et d'artistes
 */

import { artists, albums } from './data.js';

/**
 * Effectue une recherche dans les artistes et albums
 * @param {string} query - Terme de recherche
 * @returns {Array} Liste des résultats
 */
export function searchTracks(query) {
  const q = query.toLowerCase();
  const results = [];

  artists.forEach(a => {
    a.tracks.forEach(t => {
      if (t.title.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)) {
        results.push({
          title: t.title,
          artist: a.name,
          src: Array.isArray(t.src) ? t.src[0] : t.src,
          thumb: t.cover || a.photo
        });
      }
    });
  });

  albums.forEach(al => {
    if (al.title.toLowerCase().includes(q) || al.artist.toLowerCase().includes(q)) {
      results.push({
        title: al.title,
        artist: al.artist,
        src: al.audio,
        thumb: al.image
      });
    }
  });

  return results;
}

/**
 * Affiche les résultats de recherche dans l'interface
 * @param {string} query - Terme de recherche
 */
export function renderSearchResults(query) {
  const searchResultsDiv = document.getElementById('searchResults');
  const results = searchTracks(query);

  searchResultsDiv.innerHTML = '';

  if (results.length === 0) {
    searchResultsDiv.innerHTML = '<p style="color:var(--muted)">Aucun résultat</p>';
    return;
  }

  results.forEach(r => {
    const card = document.createElement('div');
    card.className = 'track-card';

    const thumbElement = r.thumb && (r.thumb.startsWith('http') || r.thumb.includes('.jpg') || r.thumb.includes('.png'))
      ? `<img src="${r.thumb}" style="width:56px;height:56px;border-radius:8px;object-fit:cover;" alt="${r.title}">`
      : `<div style="width:56px;height:56px;border-radius:8px;background:linear-gradient(135deg,#1DB954,#1ed760);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold">♪</div>`;

    card.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center">
        ${thumbElement}
        <div><div class="title">${r.title}</div><div class="sub">${r.artist}</div></div>
      </div>
      <div><button class="play-btn"><i class="fas fa-play"></i></button></div>
    `;

    card.querySelector('.play-btn').addEventListener('click', () => {
      window.playlist = [{ src: r.src, title: r.title, artist: r.artist, thumb: r.thumb }];
      window.currentIndex = 0;
      window.loadAndPlay(0);

      if (typeof window.openFullPlayer === 'function') {
        window.openFullPlayer();
      }
    });

    searchResultsDiv.appendChild(card);
  });
}

/**
 * Initialise les événements de recherche
 */
export function initSearch() {
  const searchInput = document.getElementById('searchInput');

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const q = e.target.value.trim();
      if (q.length < 2) {
        document.getElementById('searchResults').innerHTML = '';
        return;
      }
      renderSearchResults(q);
    });
  }
}
