import {
  Component,
  HostListener,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavigationComponent } from '../navigation/navigation.component';
import { FooterComponent } from '../footer/footer.component';

export interface Video {
  id: string;
  title: string;
  category: string;
  orientation: 'wide' | 'tall';
  description: string;
  featured?: boolean;
}

const VIDEOS: Video[] = [
  { id: 's9UtV-exsm0', title: 'Nomu Bust', category: 'Showcase', orientation: 'wide', description: 'Full sculpt, texturing, and lighting breakdown of the Nomu character bust.', featured: true },
  { id: 'RgJuRdkIHtc', title: 'Goat Cult', category: 'Showcase', orientation: 'wide', description: 'Environment design and atmosphere study with volumetric lighting.' },
  { id: 'Z_glSRbxb5E', title: 'GaneshSound', category: 'Showcase', orientation: 'wide', description: 'Environment design with custom sound design for a semi-fantasy setting with Unreal Engine assets.' },
  { id: '6MFZxL_4YrQ', title: 'Robot Maintenance', category: 'Showcase', orientation: 'wide', description: 'Mechanical design, rigging, and environment rendering.' },
  { id: 'h-imZigZdUQ', title: 'Poochita', category: 'Showcase', orientation: 'wide', description: 'Character sculpt with stylized texturing and lighting setup.' },
  { id: 'kXIdQVF9_sQ', title: 'Desert Ram', category: 'Showcase', orientation: 'wide', description: 'Desert landscape environment design as a test render for the Chola temple, sand and particle test with wind physics.' },
  { id: 'gepIsyevIlk', title: 'Temple Retro Inside', category: 'Showcase', orientation: 'wide', description: 'Architectural visualization of a temple interior with retro aesthetic and mood lighting.' },
  { id: '0xCNLkgnjbk', title: 'Chola Kingdom Lost', category: 'Showcase', orientation: 'wide', description: 'Epic environment reconstruction of the Chola dynasty era with atmospheric storytelling.' },
  { id: 'KprlH1dNBc8', title: 'Aghori', category: 'CGI Short', orientation: 'tall', description: 'Dark character portrait with efficient fire viz, and heavy smoke sim test.' },
  { id: 'Dr2oMuGzTmI', title: 'Doughnut', category: 'CGI Short', orientation: 'tall', description: 'Blender fundamentals study — modelling, shading, and compositing of the iconic doughnut scene.' },
  { id: 'EaMcfzMvW7o', title: 'DemonBuildingSecurityCam', category: 'CGI Short', orientation: 'tall', description: 'Found-footage style CGI composite with demon creature and security camera aesthetic.' },
  { id: 'v_-k7IL-rhw', title: 'DemonBuildingSound', category: 'CGI Short', orientation: 'tall', description: 'Atmospheric sound design pass over the demon building scene — foley, ambient layers, and creature audio.' },
  { id: 'ZzriL-kESEY', title: 'Ganesh Old Footage', category: 'CGI Short', orientation: 'tall', description: 'Retro film grain composite over a Ganesh environment — post-processing and color grade study.' },
  { id: 'XSWUroCgebA', title: 'Langurman', category: 'CGI Short', orientation: 'tall', description: 'Stylized character design and animation test with dynamic posing and fur simulation.' },
  { id: 'QAeRZUf0rzI', title: 'Yali Asset', category: 'CGI Short', orientation: 'tall', description: 'Yali mythological creature asset showcase.' },
];

@Component({
  selector: 'app-cgi',
  standalone: true,
  imports: [CommonModule, NavigationComponent, FooterComponent],
  templateUrl: './cgi.component.html',
  styleUrls: ['./cgi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CgiComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  videos = VIDEOS;
  filteredVideos: Video[] = [];
  activeId: string | null = null;
  filter = 'All';
  featuredVideo = VIDEOS.find(v => v.featured)!;
  categories: { name: string; count: number }[] = [];

  thumbSrcs: Record<string, string> = {};
  thumbFailed: Record<string, boolean> = {};

  heroEmbedUrl!: SafeResourceUrl;
  private embedUrlCache = new Map<string, SafeResourceUrl>();

  ngOnInit(): void {
    this.filteredVideos = [...this.videos];
    this.buildCategories();
    this.videos.forEach(v => {
      this.thumbSrcs[v.id] = `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`;
    });
    this.heroEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.featuredVideo.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${this.featuredVideo.id}&modestbranding=1&showinfo=0&rel=0&playsinline=1`
    );
  }

  private buildCategories(): void {
    const catSet = new Set(this.videos.map(v => v.category));
    this.categories = [
      { name: 'All', count: this.videos.length },
      ...Array.from(catSet).map(c => ({
        name: c,
        count: this.videos.filter(v => v.category === c).length,
      })),
    ];
  }

  setFilter(category: string): void {
    this.filter = category;
    this.filteredVideos = category === 'All'
      ? [...this.videos]
      : this.videos.filter(v => v.category === category);
    this.activeId = null;
    this.cdr.markForCheck();
  }

  toggleVideo(id: string): void {
    this.activeId = this.activeId === id ? null : id;
    this.cdr.markForCheck();
    if (this.activeId) {
      setTimeout(() => {
        document.querySelector('.player-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }

  closePlayer(): void {
    this.activeId = null;
    this.cdr.markForCheck();
  }

  playFeatured(): void {
    this.activeId = this.featuredVideo.id;
    this.cdr.markForCheck();
    setTimeout(() => {
      document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        document.querySelector('.player-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }, 100);
  }

  scrollToShowcase(): void {
    document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
  }

  get gridCols(): number {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth <= 560) return 1;
    if (window.innerWidth <= 900) return 2;
    return 4;
  }

  shouldShowPlayerAfter(index: number): boolean {
    if (!this.activeId) return false;
    const activeIndex = this.filteredVideos.findIndex(v => v.id === this.activeId);
    if (activeIndex < 0) return false;
    const cols = this.gridCols;
    const playerRowEnd = Math.floor(activeIndex / cols) * cols + cols;
    return index === Math.min(playerRowEnd - 1, this.filteredVideos.length - 1);
  }

  get activeVideo(): Video | null {
    return this.activeId
      ? this.filteredVideos.find(v => v.id === this.activeId) || null
      : null;
  }

  getEmbedUrl(videoId: string): SafeResourceUrl {
    if (!this.embedUrlCache.has(videoId)) {
      this.embedUrlCache.set(videoId,
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
        )
      );
    }
    return this.embedUrlCache.get(videoId)!;
  }

  onThumbError(id: string): void {
    if (this.thumbSrcs[id]?.includes('maxresdefault')) {
      this.thumbSrcs[id] = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    } else {
      this.thumbFailed[id] = true;
    }
    this.cdr.markForCheck();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this.activeId) {
      this.closePlayer();
    }
  }
}
