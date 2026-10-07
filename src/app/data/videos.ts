export interface Tape {
  id: string;
  title: string;
  kind: 'Showcase' | 'CGI Short';
  orientation: 'wide' | 'tall';
  description: string;
  /** Hand-written label colour for the VHS sticker */
  label: string;
}

export const TAPES: Tape[] = [
  { id: 's9UtV-exsm0', title: 'Nomu Bust', kind: 'Showcase', orientation: 'wide', label: '#ffcf33', description: 'Full sculpt, texturing, and lighting breakdown of the Nomu character bust.' },
  { id: 'RgJuRdkIHtc', title: 'Goat Cult', kind: 'Showcase', orientation: 'wide', label: '#ff6b6b', description: 'Environment design and atmosphere study with volumetric lighting.' },
  { id: 'Z_glSRbxb5E', title: 'GaneshSound', kind: 'Showcase', orientation: 'wide', label: '#7ee081', description: 'Environment design with custom sound design for a semi-fantasy setting with Unreal Engine assets.' },
  { id: '6MFZxL_4YrQ', title: 'Robot Maintenance', kind: 'Showcase', orientation: 'wide', label: '#6bc5ff', description: 'Mechanical design, rigging, and environment rendering.' },
  { id: 'h-imZigZdUQ', title: 'Poochita', kind: 'Showcase', orientation: 'wide', label: '#ff9de2', description: 'Character sculpt with stylized texturing and lighting setup.' },
  { id: 'kXIdQVF9_sQ', title: 'Desert Ram', kind: 'Showcase', orientation: 'wide', label: '#ffb347', description: 'Desert landscape environment — a test render for the Chola temple, sand and particle test with wind physics.' },
  { id: 'gepIsyevIlk', title: 'Temple Retro Inside', kind: 'Showcase', orientation: 'wide', label: '#c3a6ff', description: 'Architectural visualization of a temple interior with retro aesthetic and mood lighting.' },
  { id: '0xCNLkgnjbk', title: 'Chola Kingdom Lost', kind: 'Showcase', orientation: 'wide', label: '#ffe66d', description: 'Epic environment reconstruction of the Chola dynasty era with atmospheric storytelling.' },
  { id: 'KprlH1dNBc8', title: 'Aghori', kind: 'CGI Short', orientation: 'tall', label: '#ff6b6b', description: 'Dark character portrait with efficient fire viz and a heavy smoke sim test.' },
  { id: 'Dr2oMuGzTmI', title: 'Doughnut', kind: 'CGI Short', orientation: 'tall', label: '#ff9de2', description: 'The rite of passage. Modelling, shading, and compositing of the iconic Blender doughnut.' },
  { id: 'EaMcfzMvW7o', title: 'Demon Building Security Cam', kind: 'CGI Short', orientation: 'tall', label: '#7ee081', description: 'Found-footage style CGI composite with a demon creature and security-camera aesthetic.' },
  { id: 'v_-k7IL-rhw', title: 'Demon Building (Sound)', kind: 'CGI Short', orientation: 'tall', label: '#6bc5ff', description: 'Sound design pass over the demon building scene — foley, ambient layers, and creature audio.' },
  { id: 'ZzriL-kESEY', title: 'Ganesh Old Footage', kind: 'CGI Short', orientation: 'tall', label: '#ffb347', description: 'Retro film-grain composite over a Ganesh environment — post-processing and colour-grade study.' },
  { id: 'XSWUroCgebA', title: 'Langurman', kind: 'CGI Short', orientation: 'tall', label: '#c3a6ff', description: 'Stylized character design and animation test with dynamic posing and fur simulation.' },
  { id: 'QAeRZUf0rzI', title: 'Yali Asset', kind: 'CGI Short', orientation: 'tall', label: '#ffe66d', description: 'Yali mythological creature asset showcase.' },
];

export const thumbFor = (id: string, quality: 'hq' | 'max' = 'hq') =>
  `https://i.ytimg.com/vi/${id}/${quality === 'max' ? 'maxresdefault' : 'hqdefault'}.jpg`;

export const embedFor = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
