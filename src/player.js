/**
 * ========================================================================
 * PLAYER MODULE - Gestion du lecteur audio
 * ========================================================================
 *
 * Ce fichier gère toute l'interface et la logique du lecteur audio:
 * - Mini player (barre en bas)
 * - Full player (player plein écran)
 * - Contrôles de lecture (play, pause, next, prev, shuffle, repeat)
 * - Affichage des paroles
 * - Gestion des gestures tactiles
 * - Intégration avec l'API Media Session
 */

/**
 * ========================================================================
 * RÉFÉRENCES DOM - Mini Player
 * ========================================================================
 */
const miniPlayer = document.getElementById('miniPlayer');
const miniPlayerContent = document.getElementById('miniPlayerContent');
const miniPlayerThumb = document.getElementById('miniPlayerThumb');
const miniPlayerTitle = document.getElementById('miniPlayerTitle');
const miniPlayerArtist = document.getElementById('miniPlayerArtist');
const miniPlayPauseBtn = document.getElementById('miniPlayPause');

/**
 * ========================================================================
 * RÉFÉRENCES DOM - Full Player
 * ========================================================================
 */
const fullPlayer = document.getElementById('fullPlayer');
const closeFullPlayerBtn = document.getElementById('closeFullPlayer');
const fullPlayerCover = document.getElementById('fullPlayerCover');
const fullPlayerTitle = document.getElementById('fullPlayerTitle');
const fullPlayerArtist = document.getElementById('fullPlayerArtist');
const fullPlayPauseBtn = document.getElementById('fullPlayPauseBtn');
const fullPrevBtn = document.getElementById('fullPrevBtn');
const fullNextBtn = document.getElementById('fullNextBtn');
const fullShuffleBtn = document.getElementById('fullShuffleBtn');
const fullRepeatBtn = document.getElementById('fullRepeatBtn');
const fullProgress = document.getElementById('fullProgress');
const fullCurrentTime = document.getElementById('fullCurrentTime');
const fullDurationTime = document.getElementById('fullDurationTime');

/**
 * ========================================================================
 * RÉFÉRENCES DOM - Menu Player & Paroles
 * ========================================================================
 */
const playerMenuBtn = document.getElementById('playerMenuBtn');
const playerMenuPanel = document.getElementById('playerMenuPanel');
const menuPanelClose = document.getElementById('menuPanelClose');
const menuLikeBtn = document.getElementById('menuLikeBtn');
const menuAddToPlaylistBtn = document.getElementById('menuAddToPlaylistBtn');

const bottomNav = document.getElementById('bottomNav');
const lyricsContent = document.getElementById('lyricsContent');
const fullPlayerScrollable = document.getElementById('fullPlayerScrollable');
const fullPlayerCoverWrapper = document.getElementById('fullPlayerCoverWrapper');
const fullPlayerHeader = document.querySelector('.full-player-header');
const lyricsPreview = document.getElementById('lyricsPreview');

/**
 * ========================================================================
 * ÉTAT DU LECTEUR
 * ========================================================================
 */
let isPlaying = false;
let isFullPlayerOpen = false;
let lastScrollY = 0;

/**
 * ========================================================================
 * FONCTIONS D'AFFICHAGE DU MINI PLAYER
 * ========================================================================
 */

/**
 * Affiche le mini player en bas de l'écran
 */
function showMiniPlayer() {
  miniPlayer.classList.add('visible');
}

/**
 * Masque le mini player
 */
function hideMiniPlayer() {
  miniPlayer.classList.remove('visible');
}

/**
 * Met à jour les informations affichées dans le mini player
 * @param {string} title - Titre de la chanson
 * @param {string} artist - Nom de l'artiste
 * @param {string} thumb - URL de la pochette
 */
function updateMiniPlayer(title, artist, thumb) {
  miniPlayerTitle.textContent = title;
  miniPlayerArtist.textContent = artist;
  miniPlayerThumb.src = thumb || 'https://github.com/CX-Banger/cx-devdocs/blob/main/assets/disque.jpg?raw=true';
  showMiniPlayer();

  // Intégration avec l'API Media Session pour les contrôles système (notifications, lock screen)
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist,
      album: 'Muzikly',
      artwork: [
        { src: thumb || 'https://github.com/CX-Banger/cx-devdocs/blob/main/assets/disque.jpg?raw=true', sizes: '512x512', type: 'image/jpeg' }
      ]
    });

    // Gestionnaires pour les contrôles médias système
    navigator.mediaSession.setActionHandler('play', () => {
      audio.play();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      audio.pause();
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      handlePrev();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      handleNext();
    });
  }
}

/**
 * ========================================================================
 * FONCTIONS D'AFFICHAGE DU FULL PLAYER
 * ========================================================================
 */

/**
 * Ouvre le lecteur plein écran
 */
function openFullPlayer() {
  isFullPlayerOpen = true;
  fullPlayer.classList.add('active');

  // Cache la navigation en bas sur mobile
  if (bottomNav) {
    bottomNav.classList.add('hidden');
  }

  updateFullPlayerUI();
}

/**
 * Ferme le lecteur plein écran et réinitialise les états
 */
function closeFullPlayer() {
  isFullPlayerOpen = false;
  fullPlayer.classList.remove('active');

  // Réaffiche la navigation en bas sur mobile
  if (bottomNav) {
    bottomNav.classList.remove('hidden');
  }

  // Réinitialise le scroll et les états visuels
  if (fullPlayerScrollable) {
    fullPlayerScrollable.scrollTop = 0;
  }
  if (fullPlayerCoverWrapper) {
    fullPlayerCoverWrapper.classList.remove('shrunk');
  }
  if (fullPlayerHeader) {
    fullPlayerHeader.classList.remove('scrolled');
  }
  if (lyricsPreview) {
    lyricsPreview.classList.remove('expanded');
  }
}

/**
 * Met à jour l'interface du lecteur plein écran avec les infos du titre actuel
 */
function updateFullPlayerUI() {
  if (!playlist[currentIndex]) return;

  const track = playlist[currentIndex];
  fullPlayerTitle.textContent = track.title;
  fullPlayerArtist.textContent = track.artist;
  fullPlayerCover.src = track.thumb || 'https://github.com/CX-Banger/cx-devdocs/blob/main/assets/disque.jpg?raw=true';

  updatePlayPauseButtons();
  updateShuffleRepeatButtons();
}

/**
 * Met à jour l'état visuel des boutons play/pause
 */
function updatePlayPauseButtons() {
  const icon = isPlaying ? 'fa-pause' : 'fa-play';

  // Mise à jour du mini player
  miniPlayPauseBtn.innerHTML = `<i class="fas ${icon}"></i>`;

  // Mise à jour du full player
  const fullIcon = fullPlayPauseBtn.querySelector('i');
  if (fullIcon) {
    fullIcon.className = `fas ${icon}`;
  }
}

/**
 * Met à jour l'état visuel des boutons shuffle et repeat
 */
function updateShuffleRepeatButtons() {
  if (isShuffle) {
    fullShuffleBtn.classList.add('active');
  } else {
    fullShuffleBtn.classList.remove('active');
  }

  if (isRepeat) {
    fullRepeatBtn.classList.add('active');
  } else {
    fullRepeatBtn.classList.remove('active');
  }
}

/**
 * ========================================================================
 * CONTRÔLES DE LECTURE
 * ========================================================================
 */

/**
 * Bascule entre lecture et pause
 */
function handlePlayPause() {
  if (audio.paused) {
    audio.play();
    isPlaying = true;
  } else {
    audio.pause();
    isPlaying = false;
  }
  updatePlayPauseButtons();
}

/**
 * Passe au titre suivant
 * Gère le mode shuffle et repeat
 */
function handleNext() {
  // Mode shuffle : titre aléatoire
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * playlist.length);
    loadAndPlay(currentIndex);
    return;
  }

  // Mode normal : titre suivant
  if (currentIndex < playlist.length - 1) {
    currentIndex++;
    loadAndPlay(currentIndex);
  } else if (isRepeat) {
    // Mode repeat : retour au début
    currentIndex = 0;
    loadAndPlay(currentIndex);
  }
}

/**
 * Revient au titre précédent ou recommence le titre actuel
 */
function handlePrev() {
  // Si on est à plus de 3 secondes, on recommence le titre
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  // Sinon on passe au titre précédent
  if (currentIndex > 0) {
    currentIndex--;
    loadAndPlay(currentIndex);
  }
}

/**
 * ========================================================================
 * ÉVÉNEMENTS - Mini Player
 * ========================================================================
 */

// Clic sur le mini player pour ouvrir le full player
miniPlayerContent.addEventListener('click', (e) => {
  if (e.target !== miniPlayPauseBtn && !miniPlayPauseBtn.contains(e.target)) {
    openFullPlayer();
  }
});

// Bouton play/pause du mini player
miniPlayPauseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  handlePlayPause();
});

/**
 * ========================================================================
 * ÉVÉNEMENTS - Full Player (Gestures tactiles)
 * ========================================================================
 */

// Variables pour gérer le swipe vers le bas
let touchStartY = 0;
let touchCurrentY = 0;
let isDragging = false;

// Début du touch
fullPlayer.addEventListener('touchstart', (e) => {
  // On ne permet le swipe que si on est en haut du scroll
  if (fullPlayerScrollable && fullPlayerScrollable.scrollTop > 0) {
    return;
  }

  touchStartY = e.touches[0].clientY;
  touchCurrentY = touchStartY;
  isDragging = false;
}, { passive: true });

// Mouvement du touch
fullPlayer.addEventListener('touchmove', (e) => {
  if (fullPlayerScrollable && fullPlayerScrollable.scrollTop > 0) {
    return;
  }

  touchCurrentY = e.touches[0].clientY;
  const deltaY = touchCurrentY - touchStartY;

  // Swipe vers le bas
  if (deltaY > 10) {
    isDragging = true;
    const translateY = Math.min(deltaY, window.innerHeight * 0.5);
    fullPlayer.style.transform = `translateY(${translateY}px)`;
    fullPlayer.style.transition = 'none';
  }
}, { passive: true });

// Fin du touch
fullPlayer.addEventListener('touchend', () => {
  if (!isDragging) {
    return;
  }

  const deltaY = touchCurrentY - touchStartY;
  const threshold = 100;

  fullPlayer.style.transition = 'transform 0.3s ease-out';

  // Si on a swipé assez loin, on ferme le player
  if (deltaY > threshold) {
    fullPlayer.style.transform = `translateY(100%)`;
    setTimeout(() => {
      closeFullPlayer();
      fullPlayer.style.transform = '';
      fullPlayer.style.transition = '';
    }, 300);
  } else {
    // Sinon on revient à la position initiale
    fullPlayer.style.transform = '';
  }

  isDragging = false;
  touchStartY = 0;
  touchCurrentY = 0;
});

// Bouton de fermeture
closeFullPlayerBtn.addEventListener('click', closeFullPlayer);

/**
 * ========================================================================
 * ÉVÉNEMENTS - Contrôles de lecture
 * ========================================================================
 */

fullPlayPauseBtn.addEventListener('click', handlePlayPause);
fullNextBtn.addEventListener('click', handleNext);
fullPrevBtn.addEventListener('click', handlePrev);

// Bouton shuffle
fullShuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  updateShuffleRepeatButtons();
});

// Bouton repeat
fullRepeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  updateShuffleRepeatButtons();
});

/**
 * ========================================================================
 * MENU DU PLAYER (Like, Ajouter à playlist)
 * ========================================================================
 */

// Ouvre le menu
playerMenuBtn.addEventListener('click', () => {
  playerMenuPanel.classList.add('active');
});

// Ferme le menu
menuPanelClose.addEventListener('click', () => {
  playerMenuPanel.classList.remove('active');
});

// Bouton "Liker"
menuLikeBtn.addEventListener('click', () => {
  const t = playlist[currentIndex];
  if (!t) return;

  if (!userPlaylists['Sons Likés']) userPlaylists['Sons Likés'] = [];

  // Vérifie si déjà liké
  const alreadyLiked = userPlaylists['Sons Likés'].some(
    song => song.title === t.title && song.artist === t.artist
  );

  if (alreadyLiked) {
    alert('Déjà dans les Sons Likés !');
    playerMenuPanel.classList.remove('active');
    return;
  }

  // Ajoute aux favoris
  userPlaylists['Sons Likés'].push({
    title: t.title,
    artist: t.artist,
    src: t.src,
    thumb: t.thumb || ''
  });

  savePlaylists();
  renderPlaylists();

  // Animation de confirmation
  menuLikeBtn.querySelector('i').className = 'fas fa-heart';

  setTimeout(() => {
    menuLikeBtn.querySelector('i').className = 'far fa-heart';
    playerMenuPanel.classList.remove('active');
  }, 1500);
});

// Bouton "Ajouter à une playlist"
menuAddToPlaylistBtn.addEventListener('click', () => {
  const t = playlist[currentIndex];
  if (!t) return;

  const plName = prompt('Nom de la playlist :');

  if (plName) {
    if (!userPlaylists[plName]) userPlaylists[plName] = [];

    userPlaylists[plName].push({
      title: t.title,
      artist: t.artist,
      src: t.src,
      thumb: t.thumb || ''
    });

    savePlaylists();
    renderPlaylists();
    alert(`Ajouté à "${plName}"`);
  }

  playerMenuPanel.classList.remove('active');
});

/**
 * ========================================================================
 * BARRE DE PROGRESSION
 * ========================================================================
 */

// Mise à jour de la barre de progression pendant la lecture
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;

  const pct = (audio.currentTime / audio.duration) * 100;
  fullProgress.value = pct;

  // Style de la barre de progression
  const progressFill = `linear-gradient(to right, #1DB954 0%, #1DB954 ${pct}%, #404040 ${pct}%, #404040 100%)`;
  fullProgress.style.background = progressFill;

  // Mise à jour des temps affichés
  fullCurrentTime.textContent = formatTime(audio.currentTime);
  fullDurationTime.textContent = formatTime(audio.duration);
});

// Scrub de la barre de progression
fullProgress.addEventListener('input', () => {
  if (!audio.duration) return;
  const pct = fullProgress.value;
  audio.currentTime = (pct / 100) * audio.duration;
});

/**
 * ========================================================================
 * ÉVÉNEMENTS AUDIO
 * ========================================================================
 */

// Quand la lecture démarre
audio.addEventListener('play', () => {
  isPlaying = true;
  updatePlayPauseButtons();
});

// Quand la lecture est mise en pause
audio.addEventListener('pause', () => {
  isPlaying = false;
  updatePlayPauseButtons();
});

// Quand un titre se termine
audio.addEventListener('ended', () => {
  // Mode repeat : on recommence le titre
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
    return;
  }

  // Mode shuffle : titre aléatoire
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * playlist.length);
    loadAndPlay(currentIndex);
    return;
  }

  // Mode normal : titre suivant
  if (currentIndex < playlist.length - 1) {
    currentIndex++;
    loadAndPlay(currentIndex);
  } else {
    isPlaying = false;
    updatePlayPauseButtons();
  }
});

/**
 * ========================================================================
 * GESTION DU SCROLL & PAROLES
 * ========================================================================
 */

/**
 * Formate un temps en secondes au format MM:SS
 */
function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

// Gestion du scroll dans le full player (effet parallax sur la cover)
if (fullPlayerScrollable) {
  fullPlayerScrollable.addEventListener('scroll', () => {
    const scrollY = fullPlayerScrollable.scrollTop;
    const coverHeight = fullPlayerCoverWrapper ? fullPlayerCoverWrapper.offsetHeight : 0;
    const threshold = 100;

    // Après un certain scroll, on réduit la cover et on affiche un header fixe
    if (scrollY > threshold) {
      if (fullPlayerCoverWrapper) {
        fullPlayerCoverWrapper.classList.add('shrunk');
      }
      if (fullPlayerHeader) {
        fullPlayerHeader.classList.add('scrolled');
      }
      if (lyricsPreview) {
        lyricsPreview.classList.add('expanded');
      }
    } else {
      if (fullPlayerCoverWrapper) {
        fullPlayerCoverWrapper.classList.remove('shrunk');
      }
      if (fullPlayerHeader) {
        fullPlayerHeader.classList.remove('scrolled');
      }
      if (lyricsPreview) {
        lyricsPreview.classList.remove('expanded');
      }
    }

    // Effet d'opacité sur la cover pendant le scroll
    const coverOpacity = Math.max(0, 1 - (scrollY / coverHeight));
    if (fullPlayerCoverWrapper) {
      fullPlayerCoverWrapper.style.opacity = coverOpacity;
    }

    lastScrollY = scrollY;
  });
}

// Clic sur le preview des paroles pour scroller
if (lyricsPreview) {
  lyricsPreview.addEventListener('click', () => {
    if (lyricsPreview.classList.contains('expanded')) {
      // Scroll vers le haut
      fullPlayerScrollable.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Scroll vers les paroles
      if (fullPlayerScrollable) {
        const coverHeight = fullPlayerCoverWrapper ? fullPlayerCoverWrapper.offsetHeight : 0;
        fullPlayerScrollable.scrollTo({
          top: coverHeight,
          behavior: 'smooth'
        });
      }
    }
  });
}

/**
 * ========================================================================
 * EXPORTS GLOBAUX
 * ========================================================================
 * Ces fonctions sont exposées globalement pour être utilisées par script.js
 */
window.updateMiniPlayer = updateMiniPlayer;
window.updateFullPlayerUI = updateFullPlayerUI;
window.showMiniPlayer = showMiniPlayer;
window.hideMiniPlayer = hideMiniPlayer;
window.openFullPlayer = openFullPlayer;
