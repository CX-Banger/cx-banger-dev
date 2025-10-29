/**
 * Data Module
 * Gère les données des artistes, albums et leur construction
 */

import { GITHUB_BASE_URL, SUPABASE_STORAGE_URL } from './config.js';

// Noms des artistes
const artistNames = ['NAN', 'Synaï', 'Elihem', 'Sara', 'Eilynn', 'Melohim', 'Tiim', 'Math'];

// Titres des chansons par artiste
const trackTitles = [
  ['Olala', 'Obsédé', 'Etoile', 'Parapluie', 'Love Story', 'Bande', 'Epitre Au Monde #1', 'Mieux', 'Alchimie', 'Compassion', 'Génant', 'Techiyá', 'Kesse', 'Psaumes 151', 'Pourquoi', 'Dispo', 'En Tout Temps', 'Génération', 'Favelas', 'Chemin ft Elihem', 'Sans Effet', 'Victoire ft Eilynn'],
  ['YHWH', 'Freestyle Pour Dieu', 'Zinzin', 'Choisir Papa', 'Le Temps', 'Une Question...', 'Papa Yahweh ft Eilynn', 'Saisir les Bases', 'Dessin', 'Cri du Coeur ft Sara', 'Chargeur Plein', 'The King ft Elihem', 'Je t aime ft Sara'],
  ['In God', 'Visé', 'Minimum', 'Can you hear me ?', 'Evidemment', 'The King ft Synaï', 'Chemin ft NAN'],
  ['Louange à Mon Dieu', 'Tentation', 'Dis moi ft Eilynn', 'Evangéliser', 'Je t aime ft Synaï', 'Cri du Coeur ft Synaï'],
  ['Cendrillon', 'Nouveau Départ', 'Victoire ft NAN', 'Ta Présence', 'A chaque jour', 'Je te retrouverai', 'Flame of Life', 'Papa Yahweh ft Synaï', 'Dis moi ft Sara'],
  ['Ma Carrière', 'Porter Du Fruit', 'Mourir à moi même', 'Mon Histoire', '10.10.2025'],
  ['Tiim 1', 'Tiim 2'],
  ['Math 1', 'Math 2', 'Math 3', 'Math 4', 'Math 5']
];

/**
 * Construction du tableau des artistes avec leurs métadonnées
 * Chaque artiste contient: id, nom, bio, photo, et liste de tracks
 */
export const artists = artistNames.map((name, i) => ({
  id: i + 1,
  name,
  bio: `${name} `,
  photo: `${GITHUB_BASE_URL}/media/artistes/${i + 1}.jpg`,
  tracks: trackTitles[i].map((title, j) => ({
    id: `son${j + 1}`,
    title,
    src: `${SUPABASE_STORAGE_URL}/artiste${i + 1}/son${j + 1}.mp3`,
    cover: `${GITHUB_BASE_URL}/media/artiste${i + 1}/cover${j + 1}.jpg`
  }))
}));

/**
 * Liste des albums (anciens, avec URLs publiques)
 */
export const albums = [
  { title: 'Freestyle Pour Dieu', artist: 'Synaï', image: 'https://i.pinimg.com/236x/2c/23/17/2c2317fb606f8dad772f8b2a63dc1b07.jpg', audio: 'https://hrzmagjjobctkfxayokt.supabase.co/storage/v1/object/public/sons/artiste%202/son2.mp3' },
  { title: 'Obsédé', artist: 'NAN(Rap-Gospel)', image: 'https://i.pinimg.com/236x/2c/23/17/2c2317fb606f8dad772f8b2a63dc1b07.jpg', audio: 'https://hrzmagjjobctkfxayokt.supabase.co/storage/v1/object/public/sons/artiste%201/son2.mp3' },
  { title: 'In God', artist: 'Elihem', image: 'https://i.pinimg.com/236x/2c/23/17/2c2317fb606f8dad772f8b2a63dc1b07.jpg', audio: 'https://hrzmagjjobctkfxayokt.supabase.co/storage/v1/object/public/sons/artiste%203/son1.mp3' },
  { title: 'Sara 1', artist: 'Sara', image: 'https://i.pinimg.com/236x/2c/23/17/2c2317fb606f8dad772f8b2a63dc1b07.jpg', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { title: 'Cendrillon', artist: 'Kalynn', image: 'https://github.com/CX-Banger/profile-page-artiste/blob/main/assets/disque.jpg?raw=true', audio: 'https://hrzmagjjobctkfxayokt.supabase.co/storage/v1/object/public/sons/artiste%205/son1.mp3' },
  { title: 'Melohim (Remix)', artist: 'Melohim', image: 'https://github.com/CX-Banger/profile-page-artiste/blob/main/assets/disque.jpg?raw=true', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { title: 'Tiim 1', artist: 'Tiim', image: 'https://github.com/CX-Banger/profile-page-artiste/blob/main/assets/disque.jpg?raw=true', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { title: 'Math 1', artist: 'Math', image: 'https://github.com/CX-Banger/profile-page-artiste/blob/main/assets/disque.jpg?raw=true', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }
];
