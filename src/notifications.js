import { supabase, getNotifications, markNotificationAsRead, getUnreadNotificationCount, subscribeToNotifications, getEmailPreferences, updateEmailPreferences } from './supabase.js';

let currentUserId = null;
let notificationChannel = null;

const notificationBtn = document.getElementById('notificationBtn');
const notificationBadge = document.getElementById('notificationBadge');
const notificationsList = document.getElementById('notificationsList');
const emailPreferencesToggle = document.getElementById('emailNotificationsToggle');

export function initNotifications(userId) {
  if (!userId) {
    console.warn('No user ID provided for notifications');
    return;
  }

  currentUserId = userId;

  loadNotifications();

  updateNotificationBadge();

  if (notificationChannel) {
    notificationChannel.unsubscribe();
  }

  notificationChannel = subscribeToNotifications(userId, (newNotification) => {
    updateNotificationBadge();

    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    loadNotifications();
  });

  notificationBtn.addEventListener('click', () => {
    showPage('notifications');
    markAllNotificationsAsRead();
  });

  loadEmailPreferences();

  if (emailPreferencesToggle) {
    emailPreferencesToggle.addEventListener('change', async (e) => {
      const enabled = e.target.checked;
      const success = await updateEmailPreferences(currentUserId, enabled);
      if (!success) {
        e.target.checked = !enabled;
        alert('Erreur lors de la mise à jour des préférences email');
      }
    });
  }
}

async function loadNotifications() {
  if (!currentUserId) return;

  const notifications = await getNotifications(currentUserId);

  if (!notificationsList) return;

  if (notifications.length === 0) {
    notificationsList.innerHTML = `
      <div class="notifications-empty">
        <i class="fas fa-bell-slash"></i>
        <p>Aucune notification pour le moment</p>
      </div>
    `;
    return;
  }

  notificationsList.innerHTML = '';

  notifications.forEach(notif => {
    const item = document.createElement('div');
    item.className = `notification-item ${!notif.is_read ? 'unread' : ''}`;

    const coverUrl = notif.song?.cover_url || notif.song?.artist?.photo_url || '';
    const timeAgo = getTimeAgo(new Date(notif.created_at));

    item.innerHTML = `
      ${coverUrl ? `<img src="${coverUrl}" class="notification-cover" alt="Cover">` : '<div class="notification-cover" style="background: #333;"></div>'}
      <div class="notification-content">
        <div class="notification-message">${notif.message}</div>
        <div class="notification-time">${timeAgo}</div>
      </div>
      ${!notif.is_read ? '<div class="notification-dot"></div>' : ''}
    `;

    item.addEventListener('click', () => {
      if (!notif.is_read) {
        markNotificationAsRead(notif.id);
        item.classList.remove('unread');
        const dot = item.querySelector('.notification-dot');
        if (dot) dot.remove();
        updateNotificationBadge();
      }

      if (notif.song) {
        playSongFromNotification(notif.song);
      }
    });

    notificationsList.appendChild(item);
  });
}

async function updateNotificationBadge() {
  if (!currentUserId) return;

  const count = await getUnreadNotificationCount(currentUserId);

  if (count > 0) {
    notificationBadge.textContent = count > 99 ? '99+' : count;
    notificationBadge.style.display = 'flex';
  } else {
    notificationBadge.style.display = 'none';
  }
}

async function markAllNotificationsAsRead() {
  if (!currentUserId) return;

  const notifications = await getNotifications(currentUserId);
  const unreadNotifications = notifications.filter(n => !n.is_read);

  for (const notif of unreadNotifications) {
    await markNotificationAsRead(notif.id);
  }

  updateNotificationBadge();
  loadNotifications();
}

function playSongFromNotification(song) {
  if (typeof window.playlist !== 'undefined' && typeof window.loadAndPlay === 'function') {
    window.playlist = [{
      src: song.audio_url,
      title: song.title,
      artist: song.artist?.name || 'Unknown',
      thumb: song.cover_url || song.artist?.photo_url || ''
    }];
    window.currentIndex = 0;
    window.loadAndPlay(0);

    if (typeof window.openFullPlayer === 'function') {
      window.openFullPlayer();
    }
  }
}

function getTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'À l\'instant';
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} j`;

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function showPage(pageName) {
  if (typeof window.showPage === 'function') {
    window.showPage(pageName);
  }
}

async function loadEmailPreferences() {
  if (!currentUserId || !emailPreferencesToggle) return;

  const prefs = await getEmailPreferences(currentUserId);

  if (prefs) {
    emailPreferencesToggle.checked = prefs.email_enabled;
  } else {
    emailPreferencesToggle.checked = false;
  }
}

export { updateNotificationBadge };
