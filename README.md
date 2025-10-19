# Muzikly - ConnexionBanger

Application web de streaming musical moderne avec gestion de playlists, système de likes et lecteur audio complet.

## Structure du Projet

```
project/
├── index.html           # Structure HTML principale
├── package.json         # Dépendances et scripts npm
├── .env                 # Variables d'environnement (Supabase)
├── .gitignore          # Fichiers à ignorer par Git
└── src/
    ├── style.css       # Styles CSS de l'application
    ├── script.js       # Logique principale (navigation, playlists, recherche)
    └── player.js       # Lecteur audio et contrôles de lecture
```

## Fichiers Principaux

### `index.html`
Page HTML principale contenant:
- Sidebar de navigation (desktop)
- Navigation mobile en bas
- Sections: Découvrir, Playlists, Sons likés, Recherche, Sorties
- Mini-player (mode réduit)
- Full-player (mode étendu avec paroles)
- Modal pour les détails des artistes

### `src/script.js`
Gère la logique métier de l'application:
- **Configuration des ressources**: URLs GitHub et Supabase Storage
- **Données des artistes**: Liste des artistes et leurs tracks
- **Albums et featured tracks**: Contenu mis en avant
- **Navigation**: Système de pages (home, playlists, liked, search, upcoming)
- **Playlists**: Création, modification, suppression
- **Système de likes**: Ajout/retrait des favoris
- **Recherche**: Recherche en temps réel dans les titres et artistes
- **Modal artiste**: Affichage des détails et discographie

### `src/player.js`
Contrôle le lecteur audio:
- **Playback**: Lecture, pause, avance, recule
- **Modes**: Shuffle (aléatoire), Repeat (répétition)
- **Interface**: Mini-player et full-player avec transitions
- **Progress bar**: Barre de progression interactive
- **Affichage des paroles**: Chargement dynamique depuis GitHub
- **Auto-play**: Passage automatique au titre suivant

### `src/style.css`
Styles de l'application:
- Design responsive (mobile et desktop)
- Variables CSS pour la cohérence des couleurs
- Animations et transitions fluides
- Layouts: Grid et Flexbox
- Composants: Cards, boutons, modales
- Player: Mini-player fixe et full-player en overlay

## Fonctionnalités

### Navigation
- 5 sections principales: Découvrir, Playlists, Sons likés, Recherche, Sorties
- Navigation desktop (sidebar) et mobile (bottom bar)
- Recherche globale dans le header

### Gestion de la Musique
- **Découvrir**: Mise en avant d'un titre, grille d'artistes, sons à la une
- **Playlists personnalisées**: Création, édition, suppression
- **Sons likés**: Collection de favoris
- **Recherche**: Recherche instantanée par titre ou artiste

### Lecteur Audio
- **Mini-player**: Affichage compact en bas de page
- **Full-player**: Vue étendue avec cover, contrôles et paroles
- **Contrôles**: Play/pause, précédent/suivant, shuffle, repeat
- **Progress bar**: Navigation temporelle dans le titre
- **Paroles**: Affichage des paroles si disponibles

### Stockage
- **LocalStorage**: Sauvegarde des playlists et préférences
- **Supabase Storage**: Hébergement des fichiers audio
- **GitHub**: Hébergement des images (covers, photos artistes) et paroles

## Technologies

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Build**: Vite
- **Storage**:
  - Supabase (audio)
  - GitHub (images et paroles)
  - LocalStorage (données utilisateur)
- **Icons**: Font Awesome 6
- **Fonts**: Inter (Google Fonts)

## Configuration des Ressources

### URLs de Base
```javascript
// Images et covers - GitHub
const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/CX-Banger/cx-final-muzikly/main';

// Audio - Supabase Storage
const SUPABASE_STORAGE_URL = 'https://hrzmagjjobctkfxayokt.supabase.co/storage/v1/object/public/sons/';

// Paroles - GitHub
const LYRICS_BASE_URL = 'https://raw.githubusercontent.com/CX-Banger/cx-muzik/main/media/lyrics';
```

## Structure des Données

### Artistes
Chaque artiste contient:
- `id`: Identifiant unique
- `name`: Nom de l'artiste
- `bio`: Biographie
- `photo`: URL de la photo de profil
- `tracks`: Liste des morceaux

### Tracks
Chaque morceau contient:
- `id`: Identifiant unique
- `title`: Titre du morceau
- `src`: URL du fichier audio
- `cover`: URL de la pochette

### Playlists
Format de stockage dans LocalStorage:
```javascript
{
  "Sons Likés": [
    { title: "Titre", artist: "Artiste", src: "url.mp3", thumb: "cover.jpg" }
  ],
  "Ma Playlist": [...]
}
```

## Scripts Disponibles

```bash
npm run dev      # Lancer le serveur de développement
npm run build    # Construire pour la production
npm run preview  # Prévisualiser le build de production
```

## Design

### Responsive
- **Desktop**: Sidebar fixe + contenu principal
- **Mobile**: Bottom navigation + header compact

### Thème
- Couleurs: Noir, blanc, vert accent (#4CAF50)
- Typography: Inter (300, 400, 600, 700)
- Espacement: Système cohérent avec marges/paddings

### Composants Principaux
- Cards artistes avec hover effects
- Grids responsive (artistes, tracks, albums)
- Player avec transitions fluides
- Modales et overlays avec backdrop blur

## Points d'Attention

### Données utilisateur
Les playlists et likes sont stockés dans le LocalStorage. Pour réinitialiser:
```javascript
localStorage.removeItem('playlists')
```

### Format audio
Les fichiers audio doivent être au format MP3 hébergés sur Supabase Storage.

### Images
Les covers et photos sont hébergées sur GitHub. Structure attendue:
```
/media/artistes/{id}.jpg           # Photos artistes
/media/artiste{id}/cover{id}.jpg   # Covers des tracks
```
