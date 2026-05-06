import {
  Component,
  HostListener,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from '../navigation/navigation.component';
import { FooterComponent } from '../footer/footer.component';

export interface ArtPiece {
  id: number;
  num: string;
  title: string;
  fileName: string;
  imagePath: string;
  thumbPath: string;
  aspect: 'portrait' | 'square' | 'landscape';
}

// Build pieces from file list — title derived from original filename
function buildPieces(): ArtPiece[] {
  const files: [string, string][] = [
    ['1-fish.jpg', '1 Fish'],
    ['2-wisp.jpg', '2 Wisp'],
    ['3-bulky.jpg', '3 Bulky'],
    ['rubendone.jpg', 'Rubendone'],
    ['shackles-hands-final.jpg', 'Shackles'],
    ['starfire.jpg', 'Starfire'],
    ['thunderdogcon.jpg', 'Thunderdog'],
    ['torttown.jpg', 'Tort Town'],
    ['yali-asset.jpg', 'Yali'],
    ['adityakarikalan.jpg', 'Aditya Karikalan'],
    ['ape.jpg', 'Ape'],
    ['bat1.jpg', 'Bat'],
    ['batman-fanart.jpg', 'Batman Fanart'],
    ['boquete.jpg', 'Boquete'],
    ['casey-stern.jpg', 'Casey Stern'],
    ['crabby.jpg', 'Crabby'],
    ['daemon.jpg', 'Daemon'],
    ['eagle.jpg', 'Eagle'],
    ['empty.jpg', 'Empty'],
    ['entity1.jpg', 'Entity I'],
    ['entity2.jpg', 'Entity II'],
    ['fire-deer8.jpg', 'Fire Deer'],
    ['flames.jpg', 'Flames'],
    ['forget.jpg', 'Forget'],
    ['i-can-too.jpg', 'I Can Too'],
    ['ironsymbiote.jpg', 'Iron Symbiote'],
    ['kali.jpg', 'Kali'],
    ['kalialt.jpg', 'Kali Alt'],
    ['kang1.jpg', 'Kang I'],
    ['kang2.jpg', 'Kang II'],
    ['lady-drowned-don-finish-touch.jpg', 'Lady Drowned'],
    ['manson-with-bg.jpg', 'Manson'],
    ['match.jpg', 'Match'],
    ['mmendook.jpg', 'Mmendook'],
    ['moonmanbackupfin.jpg', 'Moon Man'],
    ['nest.jpg', 'Nest'],
    ['owlkenningscolort.jpg', 'Owl Kennings'],
    ['pigeon-omen-fin-no-light.jpg', 'Pigeon Omen'],
    ['pigeonfin.jpg', 'Pigeon'],
    ['poochitaref.jpg', 'Poochita'],
    ['practice1.jpg', 'Practice I'],
    ['practice2.jpg', 'Practice II'],
    ['practice3.jpg', 'Practice III'],
    ['practice4.jpg', 'Practice IV'],
    ['pricess-grim-rec-fin.jpg', 'Princess Grim'],
    ['queen-monarchbackup8.jpg', 'Queen Monarch'],
    ['radish-head.jpg', 'Radish Head'],
    ['raintitanfinsun-wallpop.jpg', 'Rain Titan'],
    ['riderlogo.jpg', 'Rider Logo'],
    ['ruins-v2.4.2.jpg', 'Ruins'],
    ['sad-girl.jpg', 'Sad Girl'],
    ['sailormoon-recovered.jpg', 'Sailor Moon'],
    ['scallop.jpg', 'Scallop'],
    ['shiva.jpg', 'Shiva'],
    ['skulltshirtprint.jpg', 'Skull Print'],
    ['spriner-finv2.jpg', 'Spriner'],
    ['storm-bringer-white-qk-fin.jpg', 'Storm Bringer'],
    ['swords-plane-done.jpg', 'Swords Plane'],
    ['templevillagevarf-6.jpg', 'Temple Village'],
    ['tent-crop-2.jpg', 'Tent II'],
    ['tent-crop-3.jpg', 'Tent III'],
    ['tent-crop-4.jpg', 'Tent IV'],
    ['tent-crop-5.jpg', 'Tent V'],
    ['tent-crop.jpg', 'Tent'],
    ['thunder-fin.jpg', 'Thunder'],
    ['tormentdone.jpg', 'Torment'],
    ['tripv2.jpg', 'Trip'],
    ['tsukuyo2-yoshiwara-onfire.jpg', 'Tsukuyo Yoshiwara On Fire'],
    ['vishnu.jpg', 'Vishnu'],
    ['waagsewhitebg.jpg', 'Waagse'],
    ['waterwitch.jpg', 'Water Witch'],
    ['winry.jpg', 'Winry'],
  ];

  const aspects: ('portrait' | 'square' | 'landscape')[] = [
    'landscape', 'portrait', 'square', 'landscape', 'portrait', 'square',
    'square', 'landscape', 'landscape', 'portrait', 'square', 'landscape',
    'portrait', 'square', 'portrait', 'square', 'landscape', 'landscape',
    'portrait', 'landscape', 'square', 'portrait', 'landscape', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'portrait',
  ];

  return files.map(([fileName, title], i) => {
    const thumbName = fileName.replace(/\.\w+$/, '.jpg');
    return {
      id: i + 1,
      num: String(i + 1).padStart(3, '0'),
      title,
      fileName,
      imagePath: `assets/digital-art/${fileName}`,
      thumbPath: `assets/digital-art/thumbs/${thumbName}`,
      aspect: aspects[i % aspects.length],
    };
  });
}

@Component({
  selector: 'app-digital-art',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationComponent, FooterComponent],
  templateUrl: './digital-art.component.html',
  styleUrls: ['./digital-art.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DigitalArtComponent implements OnInit {
  pieces: ArtPiece[] = buildPieces();
  filteredPieces: ArtPiece[] = [];
  featuredPiece: ArtPiece = this.pieces.find(p => p.fileName === 'vishnu.jpg')!;

  searchQuery = '';
  selectedPiece: ArtPiece | null = null;
  lightboxIndex = 0;

  ngOnInit() {
    this.filteredPieces = [...this.pieces];
  }

  filterPieces(): void {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.filteredPieces = [...this.pieces];
      return;
    }
    this.filteredPieces = this.pieces.filter((p) =>
      p.title.toLowerCase().includes(q)
    );
  }

  openLightbox(piece: ArtPiece): void {
    this.selectedPiece = piece;
    this.lightboxIndex = this.filteredPieces.findIndex(
      (p) => p.id === piece.id
    );
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.selectedPiece = null;
    document.body.style.overflow = '';
  }

  navigateLightbox(dir: number): void {
    if (!this.filteredPieces.length) return;
    this.lightboxIndex =
      (this.lightboxIndex + dir + this.filteredPieces.length) %
      this.filteredPieces.length;
    this.selectedPiece = this.filteredPieces[this.lightboxIndex];
  }

  onImageAreaClick(event: MouseEvent): void {
    event.stopPropagation();
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    if (event.clientX < rect.left + rect.width / 2) {
      this.navigateLightbox(-1);
    } else {
      this.navigateLightbox(1);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!this.selectedPiece) return;
    if (e.key === 'Escape') this.closeLightbox();
    if (e.key === 'ArrowRight') this.navigateLightbox(1);
    if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
  }
}
