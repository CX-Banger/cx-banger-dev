/**
 * Audio Player Module
 * Gère la lecture audio et les fonctionnalités du lecteur
 */

import { LYRICS_BASE_URL } from './config.js';
import { resolveSrc } from './utils.js';
import { artists } from './data.js';

/**
 * Charge les paroles d'un titre
 * @param {Object} track - Informations du titre
 */
export async function loadLyrics(track) {
  const lyricsContentDiv = document.getElementById('lyricsContent');

  if (!lyricsContentDiv) return;

  lyricsContentDiv.innerHTML = '<p class="lyrics-placeholder">Chargement des paroles...</p>';

  try {
    const artistIndex = artists.findIndex(a =>
      a.tracks.some(t => t.title === track.title)
    );

    if (artistIndex === -1) {
      lyricsContentDiv.innerHTML = '<p class="lyrics-placeholder">Les paroles ne sont pas encore disponibles pour ce titre.</p>';
      return;
    }

    const artist = artists[artistIndex];
    const trackIndex = artist.tracks.findIndex(t => t.title === track.title);

    if (trackIndex === -1) {
      lyricsContentDiv.innerHTML = '<p class="lyrics-placeholder">Les paroles ne sont pas encore disponibles pour ce titre.</p>';
      return;
    }

    const lyricsUrl = `${LYRICS_BASE_URL}/artiste${artistIndex + 1}/son${trackIndex + 1}.json`;
    const response = await fetch(lyricsUrl);

    if (!response.ok) {
      lyricsContentDiv.innerHTML = '<p class="lyrics-placeholder">Les paroles ne sont pas encore disponibles pour ce titre.</p>';
      return;
    }

    const lyricsData = await response.json();
    let lyricsHTML = '';

    if (lyricsData.lyrics && Array.isArray(lyricsData.lyrics)) {
      lyricsHTML = lyricsData.lyrics
        .map(line => line === '' ? '<br>' : `<p>${line}</p>`)
        .join('');
    } else if (lyricsData.sections && Array.isArray(lyricsData.sections)) {
      lyricsHTML = lyricsData.sections
        .map(section => {
          const sectionClass = section.type ? `lyrics-${section.type}` : '';
          const lines = section.lines
            .map(line => `<p class="${sectionClass}">${line}</p>`)
            .join('');
          return lines;
        })
        .join('<br>');
    } else {
      lyricsContentDiv.innerHTML = '<p class="lyrics-placeholder">Format de paroles non reconnu.</p>';
      return;
    }

    lyricsContentDiv.innerHTML = lyricsHTML || '<p class="lyrics-placeholder">Les paroles ne sont pas encore disponibles pour ce titre.</p>';
  } catch (error) {
    console.error('Erreur lors du chargement des paroles:', error);
    lyricsContentDiv.innerHTML = '<p class="lyrics-placeholder">Les paroles ne sont pas encore disponibles pour ce titre.</p>';
  }
}

/**
 * Charge un titre dans le lecteur audio
 * @param {number} index - Index du titre dans la playlist
 */
export function loadTrack(index) {
  const audio = document.getElementById('audio');
  const t = window.playlist[index];

  if (!t) return;

  const src = resolveSrc(t.src);
  if (audio.src !== src) audio.src = src;

  if (typeof window.updateMiniPlayer === 'function') {
    window.updateMiniPlayer(t.title, t.artist, t.thumb);
  }

  if (typeof window.updateFullPlayerUI === 'function') {
    window.updateFullPlayerUI();
  }

  loadLyrics(t);
  saveLastPlayed();
}

/**
 * Charge et lance la lecture d'un titre
 * @param {number} index - Index du titre dans la playlist
 */
export function loadAndPlay(index) {
  if (!window.playlist[index]) return;

  window.currentIndex = index;
  loadTrack(index);

  const audio = document.getElementById('audio');
  try {
    audio.play().catch(() => {});
  } catch (e) {}
}

/**
 * Sauvegarde le dernier titre joué dans le localStorage
 */
export function saveLastPlayed() {
  const t = window.playlist[window.currentIndex];
  if (!t) return;

  localStorage.setItem('lastPlayed', JSON.stringify({
    title: t.title,
    artist: t.artist,
    thumb: t.thumb
  }));
}

/**
 * Restaure le dernier titre joué depuis le localStorage
 */
export function restoreLastPlayed() {
  const st = JSON.parse(localStorage.getItem('lastPlayed') || 'null');
  if (!st) return;
}
