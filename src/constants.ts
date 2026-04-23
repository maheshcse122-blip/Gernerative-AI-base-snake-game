import { Song, Direction } from './types';

export const SONGS: Song[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'SynthWave AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400',
  },
  {
    id: '2',
    title: 'Cyber Chase',
    artist: 'Electro Mind',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber2/400/400',
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'Future Echo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/digital3/400/400',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = Direction.UP;
export const GAME_SPEED = 100;

export const THEME = {
  bg: '#000000',
  bgDark: '#000000',
  bgSidebar: '#000000',
  bgBoard: '#000000',
  accent: '#00ffff', // Raw Cyan
  accentMuted: '#004444',
  secondary: '#ff00ff', // Raw Magenta
  gridLine: '#00ffff22',
};
