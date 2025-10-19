/**
 * Playlist Manager Module
 * Gère les playlists utilisateur, les sons likés et leur persistance
 */

/**
 * Récupère les playlists depuis le localStorage
 * @returns {Object} Objet contenant toutes les playlists
 */
export function getUserPlaylists() {
  return JSON.parse(localStorage.getItem('playlists') || '{}');
}

/**
 * Sauvegarde les playlists dans le localStorage
 * @param {Object} playlists - Objet contenant toutes les playlists
 */
export function savePlaylists(playlists) {
  localStorage.setItem('playlists', JSON.stringify(playlists));
}

/**
 * Affiche la liste des playlists de l'utilisateur
 * @param {Object} userPlaylists - Playlists de l'utilisateur
 * @param {Function} renderCallback - Fonction de callback pour le rendu
 */
export function renderPlaylists(userPlaylists, renderCallback) {
  userPlaylists['Sons Likés'] = userPlaylists['Sons Likés'] || [];

  const playlistListDiv = document.getElementById('playlistList');
  const playlistTracksDiv = document.getElementById('playlistTracks');

  playlistListDiv.innerHTML = '';

  Object.keys(userPlaylists).forEach(pl => {
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.innerHTML = `
      <div><strong>${pl}</strong> <small>(${userPlaylists[pl].length} titres)</small></div>
      <div><button class="open">Ouvrir</button> <button class="del">🗑</button></div>
    `;

    card.querySelector('.open').addEventListener('click', () => {
      renderPlaylistTracks(pl, userPlaylists);

      if (userPlaylists[pl].length > 0) {
        window.playlist = userPlaylists[pl];
        window.currentIndex = 0;
        window.loadAndPlay(0);
      }
    });

    card.querySelector('.del').addEventListener('click', () => {
      if (confirm(`Supprimer la playlist "${pl}" ?`)) {
        delete userPlaylists[pl];
        savePlaylists(userPlaylists);
        renderCallback();
        playlistTracksDiv.innerHTML = '';
      }
    });

    playlistListDiv.appendChild(card);
  });
}

/**
 * Affiche les titres d'une playlist spécifique
 * @param {string} plName - Nom de la playlist
 * @param {Object} userPlaylists - Playlists de l'utilisateur
 */
export function renderPlaylistTracks(plName, userPlaylists) {
  const playlistTracksDiv = document.getElementById('playlistTracks');
  playlistTracksDiv.innerHTML = `<h3>${plName}</h3>`;

  userPlaylists[plName].forEach((t, idx) => {
    const row = document.createElement('div');
    row.className = 'playlist-track';

    const thumbHTML = t.thumb && (t.thumb.startsWith('http') || t.thumb.includes('.jpg') || t.thumb.includes('.png'))
      ? `<img src="${t.thumb}" class="cover" alt="${t.title}">`
      : `<div class="cover" style="background:linear-gradient(135deg,#1DB954,#1ed760);display:flex;align-items:center;justify-content:center;color:white">♪</div>`;

    row.innerHTML = `
      <div class="info">${thumbHTML}<div style="margin-left:10px"><strong>${t.title}</strong><small>${t.artist}</small></div></div>
      <div><button class="play-btn">▶</button> <button class="del-btn">🗑</button></div>
    `;

    row.querySelector('.play-btn').addEventListener('click', () => {
      window.playlist = userPlaylists[plName];
      window.currentIndex = idx;
      window.loadAndPlay(idx);

      if (typeof window.openFullPlayer === 'function') {
        window.openFullPlayer();
      }
    });

    row.querySelector('.del-btn').addEventListener('click', () => {
      userPlaylists[plName].splice(idx, 1);
      savePlaylists(userPlaylists);
      window.renderAll();
      renderPlaylistTracks(plName, userPlaylists);
    });

    playlistTracksDiv.appendChild(row);
  });
}

/**
 * Affiche les sons likés par l'utilisateur
 * @param {Object} userPlaylists - Playlists de l'utilisateur
 */
export function renderLiked(userPlaylists) {
  const likedListDiv = document.getElementById('likedList');
  likedListDiv.innerHTML = '';

  const liked = userPlaylists['Sons Likés'] || [];

  if (liked.length === 0) {
    likedListDiv.innerHTML = '<p style="color:var(--muted)">Aucun son liké pour l\'instant.</p>';
    return;
  }

  liked.forEach((t, idx) => {
    const el = document.createElement('div');
    el.className = 'artist-card';

    const thumbElement = t.thumb && (t.thumb.startsWith('http') || t.thumb.includes('.jpg') || t.thumb.includes('.png'))
      ? `<img src="${t.thumb}" class="avatar" alt="${t.title}">`
      : `<div class="avatar">♡</div>`;

    el.innerHTML = `${thumbElement}<div class="artist-info"><h3>${t.title}</h3><p>${t.artist}</p></div>`;

    el.addEventListener('click', () => {
      window.playlist = userPlaylists['Sons Likés'];
      window.currentIndex = idx;
      window.loadAndPlay(idx);

      if (typeof window.openFullPlayer === 'function') {
        window.openFullPlayer();
      }
    });

    likedListDiv.appendChild(el);
  });
}
