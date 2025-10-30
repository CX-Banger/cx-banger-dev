/**
 * ========================================================================
 * MUZIKLY - Application de Streaming Musical
 * ========================================================================
 *
 * Fichier principal qui orchestre tous les modules de l'application
 *
 * Architecture modulaire:
 * - config.js: Configuration et URLs
 * - data.js: Données des artistes et albums
 * - utils.js: Fonctions utilitaires
 * - navigation.js: Gestion de la navigation
 * - playlistManager.js: Gestion des playlists
 * - search.js: Fonctionnalité de recherche
 * - artistModal.js: Page détaillée d'artiste
 * - audioPlayer.js: Lecteur audio et paroles
 */

import { GITHUB_BASE_URL } from './modules/config.js';
import { SUPABASE_STORAGE_URL } from './modules/config.js';
import { artists, albums } from './modules/data.js';
import { showPage, initNavigation } from './modules/navigation.js';
import {
  getUserPlaylists,
  savePlaylists,
  renderPlaylists,
  renderPlaylistTracks,
  renderLiked
} from './modules/playlistManager.js';
import { renderSearchResults, initSearch } from './modules/search.js';
import { openArtist, initArtistPlayButton } from './modules/artistModal.js';
import {
  loadTrack,
  loadAndPlay,
  restoreLastPlayed
} from './modules/audioPlayer.js';

/**
 * ========================================================================
 * ÉTAT GLOBAL DE L'APPLICATION
 * ========================================================================
 */

let userPlaylists = getUserPlaylists();
let likedSongs = userPlaylists['Sons Likés'] || [];
let playlist = [];
let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;

window.playlist = playlist;
window.currentIndex = currentIndex;
window.isShuffle = isShuffle;
window.isRepeat = isRepeat;
window.loadAndPlay = loadAndPlay;
window.currentArtistData = null;

/**
 * ========================================================================
 * FONCTIONS DE RENDU
 * ========================================================================
 */

/**
 * Affiche la grille des artistes sur la page d'accueil
 */
function renderArtists() {
  const artistsGrid = document.getElementById('artistsGrid');
  artistsGrid.innerHTML = '';

  artists.forEach(a => {
    const card = document.createElement('div');
    card.className = 'artist-card';
    card.innerHTML = `
      <img src="${a.photo}" class="avatar" alt="${a.name}">
      <div class="artist-info"><h3>${a.name}</h3><p>${a.bio}</p></div>
    `;

    card.addEventListener('click', () => openArtist(a, userPlaylists, pl => savePlaylists(pl), renderAll));
    artistsGrid.appendChild(card);
  });
}

/**
 * Affiche les albums en vedette
 */
function renderFeatured() {
  const featuredDiv = document.getElementById('featured');
  featuredDiv.innerHTML = '';

  const featuredAlbums = [
    { title: "Sans Effet", artist: "NAN", year: "NAN", cover: `${GITHUB_BASE_URL}/media/artiste1/cover21.jpg`, artistIndex: 0 },
    { title: "The King ft Elihem", artist: "Synaï", year: "Synaï ft Elihem", cover: `${GITHUB_BASE_URL}/media/artiste2/cover12.jpg`, artistIndex: 1 },
    { title: "Evidemment", artist: "Elihem", year: "Elihem", cover: `${GITHUB_BASE_URL}/media/artiste3/cover5.jpg`, artistIndex: 2 },
    { title: "Je t aime ft Synaï", artist: "Sara", year: "Sara ft Synaï", cover: `${GITHUB_BASE_URL}/media/artiste4/cover5.jpg`, artistIndex: 3 },
    { title: "Flame of Life", artist: "Eilynn", year: "Eilynn", cover: `${GITHUB_BASE_URL}/media/artiste5/cover7.jpg`, artistIndex: 4 },
    { title: "Ma Carrière", artist: "Melohim", year: "Melohim", cover: `${GITHUB_BASE_URL}/media/artiste6/cover1.jpg`, artistIndex: 5 },
    { title: "Tiim 1", artist: "Tiim", year: "Tiim", cover: `${GITHUB_BASE_URL}/media/artiste7/cover1.jpg`, artistIndex: 6 },
    { title: "Math 1", artist: "Math", year: "Math", cover: `${GITHUB_BASE_URL}/media/artiste8/cover1.jpg`, artistIndex: 7 }
  ];

  featuredAlbums.forEach((album, idx) => {
    const card = document.createElement("div");
    card.className = "featured-album";
    card.innerHTML = `
      <img src="${album.cover}" class="featured-album-cover" alt="${album.title}">
      <div class="featured-album-title">${album.title}</div>
      <div class="featured-album-year">${album.year}</div>
    `;

    card.addEventListener("click", () => {
      const artist = artists[album.artistIndex];
      if (artist && artist.tracks) {
        window.playlist = artist.tracks.map(x => ({
          src: x.src,
          title: x.title,
          artist: artist.name,
          thumb: x.cover || artist.photo
        }));
        window.currentIndex = 0;
        loadAndPlay(0);

        if (typeof window.openFullPlayer === 'function') {
          window.openFullPlayer();
        }
      }
    });

    featuredDiv.appendChild(card);
  });
}

/**
 * Affiche les sorties à venir
 */
function renderUpcoming() {
  const upcomingDiv = document.getElementById('upcoming');
  upcomingDiv.innerHTML = `
    <div class="featured-album">
      <img src="https://github.com/CX-Banger/cx-muzik/blob/main/media/sorties/avenir2.jpg?raw=true" class="featured-album-cover" alt="Je t'aime">
      <div class="featured-album-title">"Je t'aime"</div>
      <div class="featured-album-year">Synaï ft Sara - 28/10/2025</div>
    </div>
  `;
}

/**
 * Rafraîchit l'affichage de toutes les sections
 */
function renderAll() {
  renderPlaylists(userPlaylists, renderAll);
  renderLiked(userPlaylists);
}

/**
 * ========================================================================
 * ÉVÉNEMENTS SPÉCIAUX
 * ========================================================================
 */

/**
 * Gère le clic sur le hero banner (lance "Obsédé")
 */
function initHeroBanner() {
  const heroArt = document.getElementById('heroArt');

  if (heroArt) {
    heroArt.addEventListener('click', () => {
      const obsedeSong = {
        title: 'The King ft Elihem',
        artist: 'Synaï',
        src: 'https://hrzmagjjobctkfxayokt.supabase.co/storage/v1/object/public/sons/artiste2/son12.mp3',
        thumb: `${GITHUB_BASE_URL}/media/artiste2/cover12.jpg`
      };

      window.playlist = [obsedeSong];
      window.currentIndex = 0;
      loadAndPlay(0);

      if (typeof window.openFullPlayer === 'function') {
        window.openFullPlayer();
      }
    });
  }
}

/**
 * Initialise le bouton "Voir plus" (fonctionnalité désactivée)
 */
function initVoirPlusButton() {
  const voirPlusBtn = document.getElementById('voirPlusBtn');

  if (voirPlusBtn) {
    voirPlusBtn.addEventListener('click', e => {
      e.preventDefault();
      const featuredGrid = document.getElementById('featured');

      if (featuredGrid.classList.contains('expanded')) {
        featuredGrid.classList.remove('expanded');
        voirPlusBtn.textContent = 'Voir plus';
      } else {
        featuredGrid.classList.add('expanded');
        voirPlusBtn.textContent = 'Voir moins';
      }
    });
  }
}

/**
 * Initialise le bouton de création de playlist
 */
function initCreatePlaylistButton() {
  const createPlaylistBtn = document.getElementById('createPlaylistBtn');
  const newPlaylistNameInput = document.getElementById('newPlaylistName');

  if (createPlaylistBtn) {
    createPlaylistBtn.addEventListener('click', () => {
      const name = newPlaylistNameInput.value.trim();

      if (!name) return alert('Donne un nom à la playlist');
      if (!userPlaylists[name]) userPlaylists[name] = [];

      savePlaylists(userPlaylists);
      renderAll();
      newPlaylistNameInput.value = '';
    });
  }
}

/**
 * ========================================================================
 * INITIALISATION DE L'APPLICATION
 * ========================================================================
 */

/**
 * Point d'entrée principal de l'application
 * Initialise tous les modules et affiche le contenu initial
 */
function init() {
  renderArtists();
  renderFeatured();
  renderUpcoming();
  renderAll();
  restoreLastPlayed();

  initNavigation();
  initSearch();
  initArtistPlayButton();
  initHeroBanner();
  initVoirPlusButton();
  initCreatePlaylistButton();

  if (albums.length > 0 && window.playlist.length === 0) {
    window.playlist = albums.map(a => ({
      src: a.audio,
      title: a.title,
      artist: a.artist,
      thumb: a.image
    }));
  }
}

window.doSearch = renderSearchResults;
window.renderAll = renderAll;

init();
