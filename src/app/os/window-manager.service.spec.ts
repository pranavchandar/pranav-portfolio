import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WindowManager } from './window-manager.service';

describe('WindowManager', () => {
  let wm: WindowManager;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    wm = TestBed.inject(WindowManager);
  });

  it('opens singleton apps only once and focuses the existing window', async () => {
    await wm.open('about');
    await wm.open('trash');
    await wm.open('about');
    expect(wm.windows().length).toBe(2);
    expect(wm.active()?.app.id).toBe('about');
  });

  it('allows several terminals', async () => {
    await wm.open('terminal');
    await wm.open('terminal');
    expect(wm.windows().filter((w) => w.app.id === 'terminal').length).toBe(2);
  });

  it('asks before closing the resume installer', async () => {
    await wm.open('resume');
    const id = wm.windows()[0].id;
    wm.requestClose(id);
    expect(wm.dialog()).not.toBeNull();
    expect(wm.windows().length).toBe(1);
    wm.resolveDialog(true);
    expect(wm.windows().length).toBe(0);
  });

  it('minimizing hands focus to the next window', async () => {
    await wm.open('about');
    await wm.open('trash');
    wm.minimize(wm.active()!.id);
    expect(wm.active()?.app.id).toBe('about');
  });
});
