import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Curve = 'sine' | 'cosine' | 'wave' | 'parabola' | 'line';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TestComponent implements AfterViewInit {
  @ViewChild('roadSvg') roadSvg!: ElementRef<SVGElement>;
  @ViewChild('roadPath') roadPath!: ElementRef<SVGPathElement>;
  @ViewChild('roadLane') roadLane!: ElementRef<SVGPathElement>;
  @ViewChild('roadContainer') roadContainer!: ElementRef<HTMLDivElement>;

  curves: { id: Curve; label: string }[] = [
    { id: 'sine', label: 'Sine wave' },
    { id: 'cosine', label: 'Cosine wave' },
    { id: 'wave', label: 'Compound wave' },
    { id: 'parabola', label: 'Parabola' },
    { id: 'line', label: 'Straight line' },
  ];
  selectedCurve: Curve = 'sine';

  ngAfterViewInit() {
    this.updatePath();
  }

  @HostListener('window:resize')
  onResize() {
    this.updatePath();
  }

  private evaluate(curve: Curve, x: number): number {
    switch (curve) {
      case 'sine':
        return 20 * Math.sin(x / 50);
      case 'cosine':
        return 20 * Math.cos(x / 50);
      case 'wave':
        return 20 * Math.sin(x / 50) + 10 * Math.cos(x / 25);
      case 'parabola':
        return 0.001 * (x - 300) * (x - 300) - 30;
      case 'line':
        return 0;
    }
  }

  updatePath() {
    if (!this.roadSvg || !this.roadPath || !this.roadLane || !this.roadContainer) return;

    const roadPath = this.roadPath.nativeElement;
    const laneSeparator = this.roadLane.nativeElement;
    const car = document.querySelector('.car') as SVGElement | null;

    const width = this.roadContainer.nativeElement.offsetWidth;
    const height = this.roadContainer.nativeElement.offsetHeight;
    const pathData = ['M 50 ' + height * 0.7];
    const step = width / 60;
    const maxX = width - 50;

    for (let x = 50; x <= maxX; x += step) {
      const y = height * 0.5 + this.evaluate(this.selectedCurve, x / (width / 600)) * (height / 800);
      pathData.push(`L ${x} ${Math.max(0, Math.min(height, y))}`);
    }

    const d = pathData.join(' ');
    roadPath.setAttribute('d', d);
    laneSeparator.setAttribute('d', d);
    if (car) car.style.offsetPath = `path('${d}')`;
  }
}
