const miniPlayer = document.getElementById('miniPlayer');
const fullPlayer = document.getElementById('fullPlayer');
const miniPlayerContent = document.getElementById('miniPlayerContent');
const closeFullPlayerBtn = document.getElementById('closeFullPlayer');

const miniPlayerThumb = document.getElementById('miniPlayerThumb');
const miniPlayerTitle = document.getElementById('miniPlayerTitle');
const miniPlayerArtist = document.getElementById('miniPlayerArtist');
const miniPlayPauseBtn = document.getElementById('miniPlayPause');

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

let isPlaying = false;
let isFullPlayerOpen = false;
let lastScrollY = 0;

function showMiniPlayer() {
  miniPlayer.classList.add('visible');
}

function hideMiniPlayer() {
  miniPlayer.classList.remove('visible');
}

function openFullPlayer() {
  isFullPlayerOpen = true;
  fullPlayer.classList.add('active');
  if (bottomNav) {
    bottomNav.classList.add('hidden');
  }
  updateFullPlayerUI();
}

function closeFullPlayer() {
  isFullPlayerOpen = false;
  fullPlayer.classList.remove('active');
  if (bottomNav) {
    bottomNav.classList.remove('hidden');
  }
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

function updateMiniPlayer(title, artist, thumb) {
  miniPlayerTitle.textContent = title;
  miniPlayerArtist.textContent = artist;
  miniPlayerThumb.src = thumb || 'https://github.com/CX-Banger/cx-devdocs/blob/main/assets/disque.jpg?raw=true';
  showMiniPlayer();

  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist,
      album: 'Muzikly',
      artwork: [
        { src: thumb || 'https://github.com/CX-Banger/cx-devdocs/blob/main/assets/disque.jpg?raw=true', sizes: '512x512', type: 'image/jpeg' }
      ]
    });

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

function updateFullPlayerUI() {
  if (!playlist[currentIndex]) return;

  const track = playlist[currentIndex];
  fullPlayerTitle.textContent = track.title;
  fullPlayerArtist.textContent = track.artist;
  fullPlayerCover.src = track.thumb || 'https://github.com/CX-Banger/cx-devdocs/blob/main/assets/disque.jpg?raw=true';

  updatePlayPauseButtons();
  updateShuffleRepeatButtons();
}

function updatePlayPauseButtons() {
  const icon = isPlaying ? 'fa-pause' : 'fa-play';

  miniPlayPauseBtn.innerHTML = `<i class="fas ${icon}"></i>`;

  const fullIcon = fullPlayPauseBtn.querySelector('i');
  if (fullIcon) {
    fullIcon.className = `fas ${icon}`;
  }
}

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

function handleNext() {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * playlist.length);
    loadAndPlay(currentIndex);
    return;
  }
  if (currentIndex < playlist.length - 1) {
    currentIndex++;
    loadAndPlay(currentIndex);
  } else if (isRepeat) {
    currentIndex = 0;
    loadAndPlay(currentIndex);
  }
}

function handlePrev() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  if (currentIndex > 0) {
    currentIndex--;
    loadAndPlay(currentIndex);
  }
}

miniPlayerContent.addEventListener('click', (e) => {
  if (e.target !== miniPlayPauseBtn && !miniPlayPauseBtn.contains(e.target)) {
    openFullPlayer();
  }
});

miniPlayPauseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  handlePlayPause();
});

closeFullPlayerBtn.addEventListener('click', closeFullPlayer);

let touchStartY = 0;
let touchCurrentY = 0;
let isDragging = false;

fullPlayer.addEventListener('touchstart', (e) => {
  if (fullPlayerScrollable && fullPlayerScrollable.scrollTop > 0) {
    return;
  }

  touchStartY = e.touches[0].clientY;
  touchCurrentY = touchStartY;
  isDragging = false;
}, { passive: true });

fullPlayer.addEventListener('touchmove', (e) => {
  if (fullPlayerScrollable && fullPlayerScrollable.scrollTop > 0) {
    return;
  }

  touchCurrentY = e.touches[0].clientY;
  const deltaY = touchCurrentY - touchStartY;

  if (deltaY > 10) {
    isDragging = true;
    const translateY = Math.min(deltaY, window.innerHeight * 0.5);
    fullPlayer.style.transform = `translateY(${translateY}px)`;
    fullPlayer.style.transition = 'none';
  }
}, { passive: true });

fullPlayer.addEventListener('touchend', () => {
  if (!isDragging) {
    return;
  }

  const deltaY = touchCurrentY - touchStartY;
  const threshold = 100;

  fullPlayer.style.transition = 'transform 0.3s ease-out';

  if (deltaY > threshold) {
    fullPlayer.style.transform = `translateY(100%)`;
    setTimeout(() => {
      closeFullPlayer();
      fullPlayer.style.transform = '';
      fullPlayer.style.transition = '';
    }, 300);
  } else {
    fullPlayer.style.transform = '';
  }

  isDragging = false;
  touchStartY = 0;
  touchCurrentY = 0;
});

fullPlayPauseBtn.addEventListener('click', handlePlayPause);
fullNextBtn.addEventListener('click', handleNext);
fullPrevBtn.addEventListener('click', handlePrev);

fullShuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  updateShuffleRepeatButtons();
});

fullRepeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  updateShuffleRepeatButtons();
});

playerMenuBtn.addEventListener('click', () => {
  playerMenuPanel.classList.add('active');
});

menuPanelClose.addEventListener('click', () => {
  playerMenuPanel.classList.remove('active');
});

menuLikeBtn.addEventListener('click', () => {
  const t = playlist[currentIndex];
  if (!t) return;

  if (!userPlaylists['Sons Likés']) userPlaylists['Sons Likés'] = [];

  const alreadyLiked = userPlaylists['Sons Likés'].some(
    song => song.title === t.title && song.artist === t.artist
  );

  if (alreadyLiked) {
    alert('Déjà dans les Sons Likés !');
    playerMenuPanel.classList.remove('active');
    return;
  }

  userPlaylists['Sons Likés'].push({
    title: t.title,
    artist: t.artist,
    src: t.src,
    thumb: t.thumb || ''
  });

  savePlaylists();
  renderPlaylists();

  menuLikeBtn.querySelector('i').className = 'fas fa-heart';

  setTimeout(() => {
    menuLikeBtn.querySelector('i').className = 'far fa-heart';
    playerMenuPanel.classList.remove('active');
  }, 1500);
});

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

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;

  const pct = (audio.currentTime / audio.duration) * 100;
  fullProgress.value = pct;

  const progressFill = `linear-gradient(to right, #1DB954 0%, #1DB954 ${pct}%, #404040 ${pct}%, #404040 100%)`;
  fullProgress.style.background = progressFill;

  fullCurrentTime.textContent = formatTime(audio.currentTime);
  fullDurationTime.textContent = formatTime(audio.duration);
});

fullProgress.addEventListener('input', () => {
  if (!audio.duration) return;
  const pct = fullProgress.value;
  audio.currentTime = (pct / 100) * audio.duration;
});

audio.addEventListener('play', () => {
  isPlaying = true;
  updatePlayPauseButtons();
});

audio.addEventListener('pause', () => {
  isPlaying = false;
  updatePlayPauseButtons();
});

audio.addEventListener('ended', () => {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
    return;
  }
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * playlist.length);
    loadAndPlay(currentIndex);
    return;
  }
  if (currentIndex < playlist.length - 1) {
    currentIndex++;
    loadAndPlay(currentIndex);
  } else {
    isPlaying = false;
    updatePlayPauseButtons();
  }
});

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

if (fullPlayerScrollable) {
  fullPlayerScrollable.addEventListener('scroll', () => {
    const scrollY = fullPlayerScrollable.scrollTop;
    const coverHeight = fullPlayerCoverWrapper ? fullPlayerCoverWrapper.offsetHeight : 0;
    const threshold = 100;

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

    const coverOpacity = Math.max(0, 1 - (scrollY / coverHeight));
    if (fullPlayerCoverWrapper) {
      fullPlayerCoverWrapper.style.opacity = coverOpacity;
    }

    lastScrollY = scrollY;
  });
}

if (lyricsPreview) {
  lyricsPreview.addEventListener('click', () => {
    if (lyricsPreview.classList.contains('expanded')) {
      fullPlayerScrollable.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
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

window.updateMiniPlayer = updateMiniPlayer;
window.updateFullPlayerUI = updateFullPlayerUI;
window.showMiniPlayer = showMiniPlayer;
window.hideMiniPlayer = hideMiniPlayer;
