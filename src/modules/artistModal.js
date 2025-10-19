/**
 * Artist Modal Module
 * Gère l'affichage de la page détaillée d'un artiste
 */

import { formatDuration, loadTrackDuration } from './utils.js';
import { showPage } from './navigation.js';

/**
 * Ouvre la page détaillée d'un artiste
 * @param {Object} artist - Données de l'artiste
 * @param {Object} userPlaylists - Playlists de l'utilisateur
 * @param {Function} savePlaylistsCallback - Fonction pour sauvegarder les playlists
 * @param {Function} renderPlaylistsCallback - Fonction pour rafraîchir l'affichage des playlists
 */
export function openArtist(artist, userPlaylists, savePlaylistsCallback, renderPlaylistsCallback) {
  window.currentArtistData = artist;
  showPage('artist');

  const artistPageImage = document.getElementById('artistPageImage');
  const artistPageName = document.getElementById('artistPageName');
  const artistPageBio = document.getElementById('artistPageBio');
  const artistTracksList = document.getElementById('artistTracksList');

  artistPageImage.src = artist.photo;
  artistPageName.textContent = artist.name;
  artistPageBio.textContent = artist.bio;

  artistTracksList.innerHTML = '';

  artist.tracks.forEach((t, idx) => {
    const tr = document.createElement('div');
    tr.className = 'track-row';

    const durationSpan = document.createElement('span');
    durationSpan.textContent = '0:00';
    durationSpan.className = 'track-duration-text';

    tr.innerHTML = `
      <div class="track-col-number">
        <span class="track-number-text">${idx + 1}</span>
        <i class="fas fa-play track-play-icon"></i>
      </div>
      <div class="track-col-title">
        <img src="${t.cover}" class="track-cover-small" alt="${t.title}">
        <div class="track-title-info">
          <div class="track-title-text">${t.title}</div>
          <div class="track-artist-text">${artist.name}</div>
        </div>
      </div>
      <div class="track-col-album">${artist.name}</div>
      <div class="track-col-duration">
        <div class="track-actions">
          <button class="track-action-btn like-btn" title="Ajouter aux favoris">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    `;

    const durationCol = tr.querySelector('.track-col-duration');
    durationCol.appendChild(durationSpan);

    const audioSrc = Array.isArray(t.src) ? t.src[0] : t.src;
    loadTrackDuration(audioSrc, duration => {
      durationSpan.textContent = formatDuration(duration);
    });

    tr.addEventListener('click', e => {
      if (e.target.closest('.track-action-btn')) return;

      const src = Array.isArray(t.src) ? t.src[0] : t.src;
      window.playlist = artist.tracks.map(x => ({
        src: Array.isArray(x.src) ? x.src[0] : x.src,
        title: x.title,
        artist: artist.name,
        thumb: x.cover || artist.photo
      }));
      window.currentIndex = idx;
      window.loadAndPlay(idx);

      document.querySelectorAll('.track-row').forEach(r => r.classList.remove('playing'));
      tr.classList.add('playing');

      if (typeof window.openFullPlayer === 'function') {
        window.openFullPlayer();
      }
    });

    tr.querySelector('.like-btn').addEventListener('click', e => {
      e.stopPropagation();

      if (!userPlaylists['Sons Likés']) userPlaylists['Sons Likés'] = [];

      userPlaylists['Sons Likés'].push({
        title: t.title,
        artist: artist.name,
        src: Array.isArray(t.src) ? t.src[0] : t.src,
        thumb: t.cover || artist.photo
      });

      savePlaylistsCallback(userPlaylists);
      renderPlaylistsCallback();

      const heartIcon = tr.querySelector('.like-btn i');
      heartIcon.classList.remove('far');
      heartIcon.classList.add('fas');
      tr.querySelector('.like-btn').classList.add('liked');
    });

    artistTracksList.appendChild(tr);
  });
}

/**
 * Initialise le bouton de lecture global de l'artiste
 */
export function initArtistPlayButton() {
  const artistPlayBtn = document.getElementById('artistPlayBtn');

  if (artistPlayBtn) {
    artistPlayBtn.addEventListener('click', () => {
      const currentArtistData = window.currentArtistData;

      if (currentArtistData && currentArtistData.tracks.length > 0) {
        window.playlist = currentArtistData.tracks.map(x => ({
          src: Array.isArray(x.src) ? x.src[0] : x.src,
          title: x.title,
          artist: currentArtistData.name,
          thumb: x.cover || currentArtistData.photo
        }));
        window.currentIndex = 0;
        window.loadAndPlay(0);
      }
    });
  }
}
