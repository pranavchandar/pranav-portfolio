export interface ArtPiece {
  id: number;
  num: string;
  slug: string;
  title: string;
  category: string;
  /** width / height of the original file */
  ratio: number;
  image: string;
  thumb: string;
}

// [file slug, title, category, aspect ratio]
const RAW: [string, string, string, number][] = [
  ['1-fish', '1 Fish', 'Creature', 0.75],
  ['2-wisp', '2 Wisp', 'Concept', 0.75],
  ['3-bulky', '3 Bulky', 'Character', 0.75],
  ['rubendone', 'Rubendone', 'Character', 0.71],
  ['shackles-hands-final', 'Shackles', 'Concept', 1.02],
  ['starfire', 'Starfire', 'Fanart', 0.75],
  ['thunderdogcon', 'Thunderdog', 'Creature', 1.78],
  ['torttown', 'Tort Town', 'Environment', 0.75],
  ['yali-asset', 'Yali', 'Mythology', 1.00],
  ['adityakarikalan', 'Aditya Karikalan', 'Mythology', 0.81],
  ['ape', 'Ape', 'Creature', 0.75],
  ['bat1', 'Bat', 'Creature', 1.00],
  ['batman-fanart', 'Batman Fanart', 'Fanart', 0.75],
  ['boquete', 'Boquete', 'Environment', 1.00],
  ['casey-stern', 'Casey Stern', 'Character', 0.71],
  ['crabby', 'Crabby', 'Creature', 1.00],
  ['daemon', 'Daemon', 'Character', 0.81],
  ['eagle', 'Eagle', 'Creature', 1.00],
  ['empty', 'Empty', 'Concept', 1.00],
  ['entity1', 'Entity I', 'Character', 1.78],
  ['entity2', 'Entity II', 'Character', 1.78],
  ['fire-deer8', 'Fire Deer', 'Creature', 1.26],
  ['flames', 'Flames', 'Concept', 0.69],
  ['forget', 'Forget', 'Concept', 1.00],
  ['i-can-too', 'I Can Too', 'Concept', 0.75],
  ['ironsymbiote', 'Iron Symbiote', 'Fanart', 0.75],
  ['kali', 'Kali', 'Mythology', 0.75],
  ['kalialt', 'Kali Alt', 'Mythology', 1.78],
  ['kang1', 'Kang I', 'Fanart', 0.91],
  ['kang2', 'Kang II', 'Fanart', 0.91],
  ['lady-drowned-don-finish-touch', 'Lady Drowned', 'Character', 0.83],
  ['manson-with-bg', 'Manson', 'Character', 0.56],
  ['match', 'Match', 'Concept', 1.00],
  ['mmendook', 'Mmendook', 'Character', 1.00],
  ['moonmanbackupfin', 'Moon Man', 'Character', 0.75],
  ['nest', 'Nest', 'Environment', 1.00],
  ['owlkenningscolort', 'Owl Kennings', 'Creature', 0.75],
  ['pigeon-omen-fin-no-light', 'Pigeon Omen', 'Creature', 1.14],
  ['pigeonfin', 'Pigeon', 'Creature', 1.19],
  ['poochitaref', 'Poochita', 'Character', 1.00],
  ['practice1', 'Practice I', 'Study', 0.67],
  ['practice2', 'Practice II', 'Study', 0.67],
  ['practice3', 'Practice III', 'Study', 0.67],
  ['practice4', 'Practice IV', 'Study', 0.67],
  ['pricess-grim-rec-fin', 'Princess Grim', 'Character', 0.61],
  ['queen-monarchbackup8', 'Queen Monarch', 'Character', 1.01],
  ['radish-head', 'Radish Head', 'Character', 1.67],
  ['raintitanfinsun-wallpop', 'Rain Titan', 'Character', 1.77],
  ['riderlogo', 'Rider Logo', 'Design', 0.80],
  ['ruins-v2.4.2', 'Ruins', 'Environment', 0.75],
  ['sad-girl', 'Sad Girl', 'Character', 0.69],
  ['sailormoon-recovered', 'Sailor Moon', 'Fanart', 1.00],
  ['scallop', 'Scallop', 'Creature', 1.00],
  ['shiva', 'Shiva', 'Mythology', 0.71],
  ['skulltshirtprint', 'Skull Print', 'Design', 0.80],
  ['spriner-finv2', 'Spriner', 'Character', 0.64],
  ['storm-bringer-white-qk-fin', 'Storm Bringer', 'Character', 0.75],
  ['swords-plane-done', 'Swords Plane', 'Environment', 0.75],
  ['templevillagevarf-6', 'Temple Village', 'Environment', 2.34],
  ['tent-crop-2', 'Tent II', 'Environment', 1.83],
  ['tent-crop-3', 'Tent III', 'Environment', 1.83],
  ['tent-crop-4', 'Tent IV', 'Environment', 1.83],
  ['tent-crop-5', 'Tent V', 'Environment', 1.83],
  ['tent-crop', 'Tent', 'Environment', 1.83],
  ['thunder-fin', 'Thunder', 'Character', 1.41],
  ['tormentdone', 'Torment', 'Concept', 0.75],
  ['tripv2', 'Trip', 'Concept', 1.00],
  ['tsukuyo2-yoshiwara-onfire', 'Tsukuyo Yoshiwara On Fire', 'Fanart', 1.35],
  ['vishnu', 'Vishnu', 'Mythology', 2.35],
  ['waagsewhitebg', 'Waagse', 'Character', 0.75],
  ['waterwitch', 'Water Witch', 'Character', 0.81],
  ['winry', 'Winry', 'Fanart', 0.75],
];

/** Fake-but-confident museum placards. Picked deterministically per piece. */
const MEDIUMS = [
  'Pixels on glass, 3 a.m. energy',
  'Stylus, caffeine, mild existential dread',
  'Digital oil (no actual oil was harmed)',
  'Layers. So many layers. 214 layers.',
  'Ctrl+Z, used 9,000 times',
  'Wacom, stubbornness',
  'Procreate & a deadline that did not exist',
  'Brush #47 and a very specific playlist',
];

const APPRAISALS = [
  'Priceless (unappraised)',
  '3 coffees and a samosa',
  'One (1) heartfelt compliment',
  '₹∞ — make an offer',
  'Not for sale. Ask anyway.',
  'Valued at exactly one follow on Instagram',
];

export const ART: ArtPiece[] = RAW.map(([slug, title, category, ratio], i) => ({
  id: i + 1,
  num: String(i + 1).padStart(3, '0'),
  slug,
  title,
  category,
  ratio,
  image: `assets/digital-art/${slug}.webp`,
  thumb: `assets/digital-art/thumbs/${slug}.webp`,
}));

export const ART_CATEGORIES = ['All', ...Array.from(new Set(ART.map((p) => p.category))).sort()];

export function placardFor(piece: ArtPiece): { medium: string; value: string } {
  return {
    medium: MEDIUMS[(piece.id * 7) % MEDIUMS.length],
    value: APPRAISALS[(piece.id * 3) % APPRAISALS.length],
  };
}
