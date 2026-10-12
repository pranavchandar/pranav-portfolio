import { ICONS } from '../os/pixel-icons';
import { PROJECTS_LIST } from './projects';

describe('projects data', () => {
  it('has unique ids and real icons', () => {
    const ids = PROJECTS_LIST.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of PROJECTS_LIST) expect(ICONS[p.icon]).withContext(p.id).toBeDefined();
  });

  it('only marks projects live when they have an https URL, and links every repo', () => {
    for (const p of PROJECTS_LIST) {
      expect(p.repo).withContext(p.id).toMatch(/^https:\/\/github\.com\/pranavchandar\//);
      expect(p.status === 'live').withContext(p.id).toBe(!!p.live);
      if (p.live) expect(p.live.url).withContext(p.id).toMatch(/^https:\/\//);
    }
  });
});
