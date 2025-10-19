/**
 * Utils Module
 * Fonctions utilitaires réutilisables dans toute l'application
 */

/**
 * Formate une durée en secondes au format MM:SS
 * @param {number} seconds - Durée en secondes
 * @returns {string} Durée formatée (ex: "3:45")
 */
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Formate un temps pour l'affichage dans le lecteur
 * @param {number} s - Temps en secondes
 * @returns {string} Temps formaté (ex: "3:05")
 */
export function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

/**
 * Charge la durée d'un fichier audio de manière asynchrone
 * @param {string} audioSrc - URL du fichier audio
 * @param {function} callback - Fonction appelée avec la durée en paramètre
 */
export function loadTrackDuration(audioSrc, callback) {
  const tempAudio = new Audio();
  tempAudio.addEventListener('loadedmetadata', () => {
    callback(tempAudio.duration);
  });
  tempAudio.addEventListener('error', () => {
    callback(0);
  });
  tempAudio.src = audioSrc;
}

/**
 * Résout une source audio (peut être une URL ou un tableau d'URLs)
 * @param {string|string[]} src - Source audio
 * @returns {string} URL de la source audio
 */
export function resolveSrc(src) {
  if (Array.isArray(src)) {
    return src[0] || src[1];
  }
  return src;
}
