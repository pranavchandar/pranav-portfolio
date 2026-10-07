import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { OsService } from '../../os/os.service';
import { SoundService } from '../../os/sound.service';

interface Junk {
  name: string;
  size: string;
  deleted: string;
  restore: string;
}

const JUNK: Junk[] = [
  { name: 'sleep_schedule.ics', size: '0 KB', deleted: '19/08/2019', restore: 'Restored? Bold. It will be deleted again by Thursday.' },
  { name: 'ext_js_frontend_2012/', size: '1.8 GB', deleted: '2021', restore: 'Absolutely not. We migrated away from that for a reason.' },
  { name: 'Main.java (Java 4)', size: '640 KB', deleted: '2020', restore: 'Java 4 is at peace now. Let it rest.' },
  { name: 'svn_repo_backup_FINAL_v2/', size: '3.1 GB', deleted: '2020', restore: 'Git has entered the chat. SVN has left it.' },
  { name: 'manual_regression_tests.xlsx', size: '88 MB', deleted: '2022', restore: 'Replaced by Cucumber + Selenium. 70% of your weekend says thanks.' },
  { name: 'doughnut_attempt_01.blend', size: '12 MB', deleted: 'the dawn of time', restore: 'Every Blender artist has one. This one stays in the bin.' },
  { name: 'my_first_portfolio.html', size: '4 KB', deleted: '2018', restore: '<marquee> was a different time. Restore denied.' },
  { name: 'social_life.zip', size: '0 KB', deleted: 'unknown', restore: 'File is empty. Was always empty. Restored anyway. ❤' },
  { name: 'raven.webp, chel.webp', size: '70 KB', deleted: 'last week', restore: 'Removed from the gallery by the curator. The curator is Pranav. He has spoken.' },
  { name: 'normal_portfolio_template/', size: '2 MB', deleted: 'today', restore: 'You are looking at the reason this was deleted.' },
];

@Component({
  selector: 'app-trash',
  template: `
    <div class="toolbar">
      <button type="button" class="btn95" (click)="empty()">🗑 Empty Recycle Bin</button>
      <span class="count">{{ items().length }} object(s)</span>
    </div>
    <div class="table sunken scroll95">
      <table>
        <thead><tr><th>Name</th><th>Size</th><th>Deleted</th><th></th></tr></thead>
        <tbody>
          @for (j of items(); track j.name) {
            <tr>
              <td>{{ j.name }}</td><td>{{ j.size }}</td><td>{{ j.deleted }}</td>
              <td><button type="button" class="restore" (click)="restore(j)">restore</button></td>
            </tr>
          } @empty {
            <tr><td colspan="4" class="empty">The bin is empty. Somehow you have made it worse.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    :host { display: flex; flex-direction: column; gap: 8px; height: 100%; background: var(--chrome); }
    .toolbar { display: flex; gap: 12px; align-items: center; }
    .count { color: var(--ink-dim); }
    .table { flex: 1; min-height: 0; background: #fbf7ee; color: #1c1414; }
    table { width: 100%; border-collapse: collapse; font-size: 19px; }
    th { position: sticky; top: 0; text-align: left; padding: 4px 8px; background: var(--chrome-face); color: var(--ink);
      font-weight: 400; box-shadow: inset -1px -1px 0 var(--bevel-lo), inset 1px 1px 0 var(--bevel-hi); }
    td { padding: 3px 8px; white-space: nowrap; }
    tr:hover td { background: var(--red-deep); color: #fff; }
    .restore { border: 0; background: none; color: inherit; text-decoration: underline; font-size: 17px; }
    .empty { text-align: center; padding: 30px; color: #8a7a6a; white-space: normal; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrashApp {
  private readonly os = inject(OsService);
  private readonly sound = inject(SoundService);
  readonly items = signal(JUNK);
  private emptyAttempts = 0;

  restore(j: Junk): void {
    this.sound.error();
    this.os.toast(j.restore, 'trash');
  }

  empty(): void {
    this.emptyAttempts++;
    if (this.emptyAttempts < 3) {
      this.sound.error();
      this.os.toast(
        this.emptyAttempts === 1
          ? 'Cannot empty: these items are emotionally load-bearing.'
          : 'Are you sure? Pranav has history with these files.',
        'trash',
      );
      return;
    }
    this.sound.crash();
    this.items.set([]);
    this.os.toast('Recycle Bin emptied. Pranav felt that.', 'trash');
  }
}
