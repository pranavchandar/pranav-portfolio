import { ICONS, PALETTE, IconName, pixelSvg } from './pixel-icons';

describe('pixel icons', () => {
  const names = Object.keys(ICONS) as IconName[];

  it('are all 16×16 and only use palette colours', () => {
    for (const name of names) {
      const rows = ICONS[name];
      expect(rows.length).withContext(name).toBe(16);
      for (const row of rows) {
        expect(row.length).withContext(name).toBe(16);
        for (const ch of row) if (ch !== '.') expect(PALETTE[ch]).withContext(`${name}:${ch}`).toBeDefined();
      }
    }
  });

  it('render to SVG', () => {
    expect(pixelSvg('smiley')).toContain('<svg');
    expect(pixelSvg('smiley')).toContain(PALETTE['n']);
  });
});
