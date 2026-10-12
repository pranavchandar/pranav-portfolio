import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GITHUB_PROFILE, PROJECTS_LIST, Project, STATUS_LABEL } from '../../data/projects';
import { PixelIconComponent } from '../../os/pixel-icon.component';
import { SoundService } from '../../os/sound.service';
import { WindowManager } from '../../os/window-manager.service';

@Component({
  selector: 'app-projects',
  imports: [PixelIconComponent],
  templateUrl: './projects.app.html',
  styleUrl: './projects.app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsApp {
  private readonly wm = inject(WindowManager);
  private readonly sound = inject(SoundService);

  readonly projects = PROJECTS_LIST;
  readonly statusLabel = STATUS_LABEL;
  readonly profile = GITHUB_PROFILE;
  readonly selectedId = signal(PROJECTS_LIST[0].id);
  readonly selected = computed(() => this.projects.find((p) => p.id === this.selectedId())!);
  readonly online = PROJECTS_LIST.filter((p) => p.status === 'live').length;

  select(p: Project): void {
    if (p.id !== this.selectedId()) this.sound.click();
    this.selectedId.set(p.id);
  }

  /** Double-clicking a live project launches it, like a real desktop would. */
  activate(p: Project): void {
    this.select(p);
    if (p.live) this.launch(p);
  }

  launch(p: Project): void {
    this.wm.open('navigator', { site: p.id, nonce: Date.now() });
  }

  repoName(p: Project): string {
    return p.repo.replace('https://github.com/', '');
  }
}
