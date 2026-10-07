import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ABOUT, NAME } from '../../data/profile';
import { OsService } from '../../os/os.service';
import { WindowManager } from '../../os/window-manager.service';

const MENU_JOKES: Record<string, string> = {
  File: 'File > Save is disabled. Pranav is already saved, spiritually.',
  Edit: 'Edit > Undo: cannot undo meeting Pranav.',
  Format: 'Format > Font: we tried Comic Sans. Check the Control Panel.',
  View: 'View > Zoom: just lean closer to the screen.',
  Help: 'Help > About: you are literally reading it.',
};

@Component({
  selector: 'app-about',
  templateUrl: './about.app.html',
  styleUrl: './about.app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(keydown)': 'onKey($event)' },
})
export class AboutApp {
  private readonly os = inject(OsService);
  private readonly wm = inject(WindowManager);
  readonly name = NAME;
  readonly paragraphs = ABOUT;
  readonly menus = Object.keys(MENU_JOKES);
  readonly dirty = signal(false);
  readonly words = ABOUT.join(' ').split(/\s+/).length;

  menu(label: string): void {
    this.os.toast(MENU_JOKES[label], 'notepad');
  }

  open(app: 'resume' | 'punch' | 'contact'): void {
    this.wm.open(app);
  }

  onKey(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      this.os.toast('Saving is a privilege, not a right. (Changes are not saved. Like real life.)', 'notepad');
    }
  }
}
