import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TestComponent implements AfterViewInit {
  @ViewChild('roadSvg') roadSvg!: ElementRef<SVGElement>;
  @ViewChild('roadPath') roadPath!: ElementRef<SVGPathElement>;
  @ViewChild('roadLane') roadLane!: ElementRef<SVGPathElement>;
  @ViewChild('roadContainer') roadContainer!: ElementRef<HTMLDivElement>;
  functionInput: string = '20 * Math.sin(x / 50)';

  ngAfterViewInit() {
    this.updatePath(); // Initial path setup
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updatePath();
  }

  updatePath() {
    const svg = this.roadSvg.nativeElement;
    const roadPath = this.roadPath.nativeElement;
    const laneSeparator = this.roadLane.nativeElement;
    const car = document.querySelector('.car') as SVGElement;
    let func;

    try {
      func = eval(`(x) => ${this.functionInput}`);
    } catch (e) {
      alert('Invalid function! Please use a valid JavaScript expression (e.g., 20 * Math.sin(x / 50)).');
      return;
    }

    const width = this.roadContainer.nativeElement.offsetWidth;
    const height = this.roadContainer.nativeElement.offsetHeight;
    const pathData = ['M 50 ' + (height * 0.7)]; // Start 70% from top
    const step = width / 60;
    const maxX = width - 50;

    for (let x = 50; x <= maxX; x += step) {
      const y = (height * 0.5) + (func(x / (width / 600)) * (height / 800));
      pathData.push(`L ${x} ${Math.max(0, Math.min(height, y))}`);
    }

    const d = pathData.join(' ');
    roadPath.setAttribute('d', d);
    laneSeparator.setAttribute('d', d);
    car.style.offsetPath = `path('${d}')`;

    console.log('Path points:', pathData.slice(0, 5));
  }
}