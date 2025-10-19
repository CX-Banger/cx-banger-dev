# 📚 Documentation Développeur - Muzikly

## 🎯 Vue d'ensemble

Muzikly est une application de streaming musical moderne construite en JavaScript vanilla, HTML5 et CSS3. L'application permet aux utilisateurs d'écouter de la musique, gérer des playlists, rechercher des titres, et voir les paroles en temps réel.

## 📁 Structure du Projet

```
project/
├── index.html                 # Structure HTML principale
├── src/
│   ├── script.js             # ⚠️ Version originale (non modulaire)
│   ├── script-modular.js     # ✅ Version modulaire recommandée
│   ├── player.js             # ⚠️ Version originale du lecteur
│   ├── player-commented.js   # ✅ Version commentée du lecteur
│   ├── style.css             # Tous les styles de l'application
│   └── modules/              # Modules JavaScript (architecture modulaire)
│       ├── config.js         # Configuration et URLs
│       ├── data.js           # Données des artistes et albums
│       ├── utils.js          # Fonctions utilitaires
│       ├── navigation.js     # Gestion de la navigation
│       ├── playlistManager.js# Gestion des playlists
│       ├── search.js         # Fonctionnalité de recherche
│       ├── artistModal.js    # Page détaillée d'artiste
│       └── audioPlayer.js    # Lecteur audio et paroles
└── README_DEV.md             # Cette documentation
```

## 🧩 Architecture Modulaire

### 📦 Modules Disponibles

#### `config.js`
**Rôle:** Centralise toutes les URLs et configurations
- `GITHUB_BASE_URL`: URL pour les images (covers, photos artistes)
- `SUPABASE_STORAGE_URL`: URL pour les fichiers audio
- `LYRICS_BASE_URL`: URL pour les fichiers de paroles

#### `data.js`
**Rôle:** Contient et structure toutes les données
- `artists`: Tableau des artistes avec leurs tracks
- `albums`: Liste des albums avec métadonnées
- Construction automatique des URLs pour chaque ressource

#### `utils.js`
**Rôle:** Fonctions utilitaires réutilisables
- `formatDuration(seconds)`: Formate une durée en MM:SS
- `formatTime(s)`: Formate un temps pour le lecteur
- `loadTrackDuration(audioSrc, callback)`: Charge la durée d'un audio
- `resolveSrc(src)`: Résout une source audio (gère les tableaux)

#### `navigation.js`
**Rôle:** Gère la navigation entre les pages
- `showPage(id)`: Affiche une page spécifique
- `initNavigation()`: Initialise les événements de navigation
- Gère les boutons de navigation (sidebar + mobile)
- Gère la barre de recherche du header

#### `playlistManager.js`
**Rôle:** Gestion complète des playlists utilisateur
- `getUserPlaylists()`: Récupère les playlists depuis localStorage
- `savePlaylists(playlists)`: Sauvegarde les playlists
- `renderPlaylists()`: Affiche la liste des playlists
- `renderPlaylistTracks(plName)`: Affiche les titres d'une playlist
- `renderLiked()`: Affiche les sons likés

#### `search.js`
**Rôle:** Fonctionnalité de recherche
- `searchTracks(query)`: Recherche dans les artistes et albums
- `renderSearchResults(query)`: Affiche les résultats
- `initSearch()`: Initialise les événements de recherche

#### `artistModal.js`
**Rôle:** Page détaillée d'un artiste
- `openArtist(artist, ...)`: Ouvre la page d'un artiste
- `initArtistPlayButton()`: Initialise le bouton de lecture
- Affiche la liste des tracks avec durées
- Gère l'ajout aux favoris

#### `audioPlayer.js`
**Rôle:** Gestion de la lecture audio
- `loadLyrics(track)`: Charge les paroles depuis GitHub
- `loadTrack(index)`: Charge un titre dans le lecteur
- `loadAndPlay(index)`: Charge et lance la lecture
- `saveLastPlayed()`: Sauvegarde le dernier titre joué
- `restoreLastPlayed()`: Restaure le dernier titre

### 🔄 Flux de Données

```
┌─────────────────────────────────────────────────────┐
│                   index.html                        │
│  (Structure HTML, includesscript-modular.js)       │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│              script-modular.js                      │
│  (Point d'entrée, orchestre tous les modules)      │
│                                                      │
│  - Importe tous les modules                         │
│  - Initialise l'application                         │
│  - Gère l'état global                               │
└──┬──────────┬──────────┬──────────┬─────────┬───────┘
   │          │          │          │         │
   │          │          │          │         │
   ▼          ▼          ▼          ▼         ▼
┌─────┐  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐
│data │  │navi    │ │search  │ │artist  │ │audio │
│.js  │  │gation  │ │.js     │ │Modal   │ │Player│
│     │  │.js     │ │        │ │.js     │ │.js   │
└─────┘  └────────┘ └────────┘ └────────┘ └──────┘
   │          │          │          │         │
   └──────────┴──────────┴──────────┴─────────┘
                       │
                       ▼
             ┌──────────────────┐
             │ playlistManager  │
             │      .js          │
             │                   │
             │ (localStorage)    │
             └──────────────────┘
```

## 🎵 Le Lecteur Audio (player.js)

### Composants Principaux

#### 1. **Mini Player**
- Barre fixe en bas de l'écran
- Affiche: pochette, titre, artiste, bouton play/pause
- Clic dessus → ouvre le Full Player

#### 2. **Full Player**
- Lecteur plein écran avec:
  - Grande pochette
  - Contrôles de lecture complets
  - Barre de progression
  - Boutons shuffle/repeat
  - Section paroles scrollable
- Gestures tactiles:
  - Swipe vers le bas pour fermer
  - Scroll pour voir les paroles

#### 3. **Contrôles de Lecture**
- **Play/Pause**: Lance ou met en pause la lecture
- **Next**: Titre suivant (gère shuffle/repeat)
- **Prev**: Titre précédent ou recommence le titre actuel
- **Shuffle**: Lecture aléatoire
- **Repeat**: Répète la playlist

#### 4. **Menu du Player**
- **Liker**: Ajoute aux "Sons Likés"
- **Ajouter à playlist**: Ajoute à une playlist personnalisée

### Intégrations

- **Media Session API**: Contrôles système (notifications, écran verrouillé)
- **localStorage**: Sauvegarde des playlists et du dernier titre joué

## 🎨 CSS (style.css)

Le fichier CSS est organisé par sections:

```
1. GLOBAL RESET         - Reset CSS de base
2. LAYOUT               - Structure principale (sidebar, main)
3. TOPBAR               - Barre de navigation supérieure
4. HERO SECTION         - Bannière "À la une"
5. GRIDS                - Grilles d'artistes/albums
6. FEATURED SECTION     - Section albums vedette
7. ARTIST CARDS         - Cartes des artistes
8. PLAYLISTS            - Interface des playlists
9. SEARCH               - Interface de recherche
10. MINI PLAYER         - Lecteur mini en bas
11. FULL PLAYER         - Lecteur plein écran
12. PLAYER MENU         - Menu du lecteur
13. LYRICS              - Affichage des paroles
14. ARTIST PAGE         - Page détaillée d'artiste
15. RESPONSIVE          - Media queries
```

### Couleurs Principales

```css
--background: #121212
--card-bg: #1e1e1e
--card-hover: #282828
--accent: #1DB954 (vert Spotify-like)
--text: #ffffff
--muted: #b3b3b3
```

## 🚀 Utilisation

### Version Actuelle (Non Modulaire)

```html
<script src="src/script.js"></script>
<script src="src/player.js"></script>
```

### Version Modulaire (Recommandée)

Pour utiliser la version modulaire, modifiez `index.html`:

```html
<script type="module" src="src/script-modular.js"></script>
<script src="src/player-commented.js"></script>
```

⚠️ **Note:** Les modules ES6 nécessitent un serveur web (pas de `file://`)

## ��️ Développement

### Ajouter un Nouvel Artiste

1. Dans `data.js`, ajoutez le nom dans `artistNames`
2. Ajoutez les titres dans `trackTitles`
3. Assurez-vous que les fichiers existent sur GitHub et Supabase

### Ajouter une Nouvelle Page

1. Ajoutez la structure HTML dans `index.html`
2. Créez un bouton de navigation avec `data-page="nom-page"`
3. Créez une fonction `renderNomPage()` dans script.js
4. Appelez-la depuis `init()`

### Modifier le Lecteur

Le lecteur expose ces fonctions globalement:
- `window.updateMiniPlayer(title, artist, thumb)`
- `window.updateFullPlayerUI()`
- `window.openFullPlayer()`
- `window.showMiniPlayer()`

## 📦 Dépendances Externes

- **Font Awesome 6.5.0**: Icônes
- **Google Fonts (Inter)**: Police de caractères
- **Supabase Storage**: Hébergement audio
- **GitHub**: Hébergement images et paroles

## 🔧 Fonctionnalités Clés

### 1. Système de Playlists
- Sauvegarde automatique dans localStorage
- Playlist spéciale "Sons Likés"
- Création de playlists personnalisées
- Ajout/suppression de titres

### 2. Recherche
- Recherche en temps réel (dès 2 caractères)
- Recherche dans titres et artistes
- Résultats cliquables pour lecture immédiate

### 3. Paroles
- Chargement automatique depuis GitHub
- Format JSON avec sections (couplets, refrain)
- Affichage scrollable dans le Full Player

### 4. Page Artiste
- Vue détaillée avec photo et bio
- Liste complète des tracks
- Durées chargées dynamiquement
- Lecture directe de n'importe quel titre

## 🐛 Points d'Attention

1. **localStorage**: Les playlists sont sauvegardées localement
   - Effacer le cache = perte des playlists
   - Pas de synchronisation entre appareils

2. **CORS**: Les fichiers audio/images doivent avoir les bonnes permissions CORS

3. **Modules ES6**: Nécessitent un serveur web (ex: `python -m http.server`)

4. **Audio**: Format MP3 recommandé pour la compatibilité

## 📝 Conventions de Code

- **Nommage**: camelCase pour les fonctions, PascalCase pour les composants
- **Commentaires**: En français, clairs et descriptifs
- **Organisation**: Un module = une responsabilité
- **Exports**: Export nommé (pas de default)

## 🔄 Migration vers la Version Modulaire

Pour migrer complètement vers l'architecture modulaire:

1. Remplacez `<script src="src/script.js">` par `<script type="module" src="src/script-modular.js">`
2. Remplacez `player.js` par `player-commented.js`
3. Testez toutes les fonctionnalités
4. Supprimez les anciens fichiers si tout fonctionne

## 📞 Support

Pour toute question sur l'architecture ou l'implémentation:
- Consultez les commentaires dans chaque module
- Chaque fonction est documentée avec @param et @returns
- Les blocs de code sont séparés par des commentaires de section

---

**Bonne contribution ! 🎵**
