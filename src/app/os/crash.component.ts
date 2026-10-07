import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { OsService } from './os.service';

/** Blue screen of death + the classic "safe to turn off" screen. */
@Component({
  selector: 'os-crash',
  template: `
    @if (os.phase() === 'bsod') {
      <div class="bsod" role="alert" (click)="os.reboot()">
        <p class="sad">:(</p>
        <p class="big">Your PC ran into Pranav and needs to restart. We're just collecting some error info, and then we'll restart for you.</p>
        <p class="big">{{ pct() }}% complete</p>
        <div class="row">
          <div class="qr" aria-hidden="true">
            @for (c of qr; track $index) { <i [class.on]="c"></i> }
          </div>
          <p class="small">
            For more information about this issue and possible fixes, visit nowhere.<br /><br />
            If you call a support person, give them this info:<br />
            Stop code: <b>{{ os.bsodReason() }}</b><br />
            What failed: self_control.sys<br /><br />
            (click anywhere to reboot faster)
          </p>
        </div>
      </div>
    } @else if (os.phase() === 'shutdown') {
      <div class="off">
        <p>It's now safe to close this tab.</p>
        <p class="sub">Or don't. Pranav would like that.</p>
        <button type="button" class="btn95 btn95--primary" (click)="os.reboot()">⏻ Power on</button>
      </div>
    }
  `,
  styles: `
    :host { display: contents; }
    .bsod { position: fixed; inset: 0; z-index: 9500; background: #0a63c9; color: #fff; padding: 8vh 10vw;
      font-family: 'Segoe UI', var(--font-plain); overflow: auto; }
    .sad { font-size: clamp(80px, 14vw, 160px); margin: 0 0 20px; font-weight: 300; }
    .big { font-size: clamp(18px, 2.4vw, 28px); max-width: 900px; margin: 0 0 24px; font-weight: 300; line-height: 1.35; }
    .row { display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap; }
    .qr { display: grid; grid-template-columns: repeat(11, 10px); background: #fff; padding: 8px; flex: none; }
    .qr i { width: 10px; height: 10px; }
    .qr i.on { background: #0a63c9; }
    .small { font-size: 15px; margin: 0; line-height: 1.5; }
    .off { position: fixed; inset: 0; z-index: 9500; background: #000; display: grid; place-content: center; justify-items: center;
      text-align: center; gap: 12px; padding: 24px; }
    .off p { margin: 0; color: var(--amber); font: 400 clamp(28px, 5vw, 56px) var(--font-pixel); }
    .off .sub { font-size: 22px; color: #666; margin-bottom: 20px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrashComponent implements OnInit {
  readonly os = inject(OsService);
  private readonly destroyRef = inject(DestroyRef);
  readonly pct = signal(0);
  readonly qr = Array.from({ length: 121 }, (_, i) => ((i * 7919) % 13) % 3 === 0 || [0, 1, 2, 11, 13, 22, 23, 24, 8, 9, 10, 19, 21, 30, 31, 32, 88, 89, 90, 99, 101, 110, 111, 112].includes(i));

  ngOnInit(): void {
    if (!this.os.browser) return;
    const t = setInterval(() => {
      if (this.os.phase() !== 'bsod') {
        this.pct.set(0);
        return;
      }
      const next = Math.min(100, this.pct() + Math.ceil(Math.random() * 9));
      this.pct.set(next);
      if (next >= 100) {
        this.pct.set(0);
        this.os.reboot();
      }
    }, 280);
    this.destroyRef.onDestroy(() => clearInterval(t));
  }
}
