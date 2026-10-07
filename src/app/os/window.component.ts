import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PixelIconComponent } from './pixel-icon.component';
import { Win, WindowManager } from './window-manager.service';

@Component({
  selector: 'os-window',
  imports: [PixelIconComponent],
  templateUrl: './window.component.html',
  styleUrl: './window.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WindowComponent {
  readonly wm = inject(WindowManager);
  readonly win = input.required<Win>();
  readonly active = computed(() => this.wm.active()?.id === this.win().id);

  startDrag(e: PointerEvent): void {
    const win = this.win();
    if (win.maximized || e.button !== 0) return;
    e.preventDefault();
    const ox = e.clientX - win.x;
    const oy = e.clientY - win.y;
    this.track(e, (ev) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const x = Math.min(vw - 80, Math.max(80 - win.w, ev.clientX - ox));
      const y = Math.min(vh - 90, Math.max(0, ev.clientY - oy));
      this.wm.move(win.id, x, y);
    });
  }

  startResize(e: PointerEvent): void {
    const win = this.win();
    if (win.maximized) return;
    e.preventDefault();
    e.stopPropagation();
    const sx = e.clientX;
    const sy = e.clientY;
    this.track(e, (ev) => this.wm.resize(win.id, win.w + ev.clientX - sx, win.h + ev.clientY - sy));
  }

  private track(start: PointerEvent, onMove: (e: PointerEvent) => void): void {
    const target = start.target as HTMLElement;
    target.setPointerCapture?.(start.pointerId);
    document.body.classList.add('dragging');
    const move = (ev: PointerEvent) => onMove(ev);
    const up = () => {
      document.body.classList.remove('dragging');
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', up);
      target.removeEventListener('pointercancel', up);
    };
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', up);
    target.addEventListener('pointercancel', up);
  }
}
